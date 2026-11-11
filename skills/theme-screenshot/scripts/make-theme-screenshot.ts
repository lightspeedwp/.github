/**
 * Makes a 1200 x 900 theme `screenshot.png` from a site's logo.
 *
 * The logo is centred on a soft radial gradient in the theme's colours, over a thin
 * divider, an industry line in spaced capitals and "WordPress block theme · <year>".
 *
 * Usage:
 *   npx tsx make-theme-screenshot.ts --site https://www.example.com \
 *     --theme-json wp-content/themes/my-theme/theme.json --industry "Tour operator" \
 *     --out wp-content/themes/my-theme/screenshot.png
 *   npx tsx make-theme-screenshot.ts --logo logo.svg --mode dark --accent "#b08d3c" --out screenshot.png
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { Rgb } from './lib/colour';
import { FileReader, Fetcher, LoadedLogo, LogoLoader } from './lib/logo';
import { ColourOverrides, ColourPlanner, Mode, ThemePalette } from './lib/palette';
import {
  fitLogo,
  LogoMeasure,
  SCREENSHOT_HEIGHT,
  SCREENSHOT_WIDTH,
  ScreenshotTemplate,
} from './lib/template';

/** Draws HTML to a PNG. The Puppeteer implementation lives below the CLI. */
export interface ScreenshotRenderer {
  /** The logo's natural size and the mean luminance (0 to 1) of its visible pixels. */
  inspect(dataUri: string): Promise<LogoMeasure>;
  render(html: string, width: number, height: number): Promise<Buffer>;
  close(): Promise<void>;
}

export interface ScreenshotOptions {
  /** A logo file. Wins over `site`. */
  logo?: string;
  /** A live site to find the logo on. */
  site?: string;
  /** A theme.json to read the palette from. */
  themeJson?: string;
  industry: string;
  year?: number;
  label?: string;
  mode?: Mode | 'auto';
  overrides?: ColourOverrides;
}

export interface ScreenshotResult {
  png: Buffer;
  mode: Mode;
  logo: LoadedLogo;
}

export class ThemeScreenshotMaker {
  constructor(
    private readonly loader: LogoLoader,
    private readonly files: FileReader,
    private readonly renderer: ScreenshotRenderer,
    private readonly template = new ScreenshotTemplate(),
    private readonly now: () => Date = () => new Date()
  ) {}

  async make(options: ScreenshotOptions): Promise<ScreenshotResult> {
    const logo = await this.loadLogo(options);
    const palette = options.themeJson
      ? ThemePalette.fromThemeJson(JSON.parse(this.files.read(options.themeJson).toString('utf8')))
      : new ThemePalette();
    const planner = new ColourPlanner(palette, options.overrides);
    const measure = await this.renderer.inspect(logo.dataUri);
    const mode = planner.chooseMode(options.mode ?? 'auto', measure.luminance);
    const html = this.template.render({
      logoDataUri: logo.dataUri,
      logoSize: fitLogo(measure, logo.dataUri.startsWith('data:image/svg+xml')),
      colours: planner.plan(mode),
      industry: options.industry,
      label: options.label ?? 'WordPress block theme',
      year: options.year ?? this.now().getFullYear(),
    });
    const png = await this.renderer.render(html, SCREENSHOT_WIDTH, SCREENSHOT_HEIGHT);
    return { png, mode, logo };
  }

  private loadLogo(options: ScreenshotOptions): Promise<LoadedLogo> {
    if (options.logo) {
      return this.loader.fromFile(options.logo);
    }
    if (options.site) {
      return this.loader.fromSite(options.site);
    }
    throw new Error('Pass --logo with a file, or --site with a live site to find the logo on.');
  }
}

export interface CliDeps {
  createMaker: () => { maker: ThemeScreenshotMaker; close: () => Promise<void> };
  writeFile: (path: string, data: Buffer) => void;
  stdout: (text: string) => void;
  stderr: (text: string) => void;
}

const USAGE =
  'Usage: make-theme-screenshot (--logo <file> | --site <url>) --industry <text> [--theme-json <file>] [--out screenshot.png] [--year <n>] [--label <text>] [--mode light|dark|auto] [--base <#hex>] [--contrast <#hex>] [--accent <#hex>]\n';

export async function runScreenshotCli(argv: string[], deps: CliDeps): Promise<number> {
  const options: ScreenshotOptions = { industry: '' };
  const overrides: ColourOverrides = {};
  let out = 'screenshot.png';
  try {
    for (let i = 0; i < argv.length; i++) {
      const arg = argv[i];
      const next = () => {
        const value = argv[++i];
        if (value === undefined) {
          throw new Error(`${arg} needs a value.`);
        }
        return value;
      };
      const colour = () => {
        const value = next();
        if (!Rgb.parse(value)) {
          throw new Error(`${arg} ${value} is not a hex colour such as #b08d3c.`);
        }
        return value;
      };
      switch (arg) {
        case '--help':
        case '-h':
          deps.stdout(USAGE);
          return 0;
        case '--logo':
          options.logo = next();
          break;
        case '--site':
          options.site = next();
          break;
        case '--theme-json':
          options.themeJson = next();
          break;
        case '--industry':
          options.industry = next();
          break;
        case '--label':
          options.label = next();
          break;
        case '--out':
          out = next();
          break;
        case '--year': {
          const year = Number(next());
          if (!Number.isInteger(year) || year < 2000 || year > 2100) {
            throw new Error('--year takes a four digit year.');
          }
          options.year = year;
          break;
        }
        case '--mode': {
          const mode = next();
          if (!['light', 'dark', 'auto'].includes(mode)) {
            throw new Error('--mode takes light, dark or auto.');
          }
          options.mode = mode as Mode | 'auto';
          break;
        }
        case '--base':
          overrides.base = colour();
          break;
        case '--contrast':
          overrides.contrast = colour();
          break;
        case '--accent':
          overrides.accent = colour();
          break;
        default:
          throw new Error(`Unknown option ${arg}.`);
      }
    }
    if (!options.industry.trim()) {
      throw new Error('Pass --industry, for example --industry "Tour operator".');
    }
    options.overrides = overrides;
    const { maker, close } = deps.createMaker();
    try {
      const result = await maker.make(options);
      deps.writeFile(out, result.png);
      deps.stdout(
        `Wrote ${out} (${SCREENSHOT_WIDTH}x${SCREENSHOT_HEIGHT}, ${result.mode} mode). Logo: ${result.logo.source}, ${result.logo.origin}\n`
      );
    } finally {
      await close();
    }
    return 0;
  } catch (error) {
    deps.stderr(`make-theme-screenshot: ${(error as Error).message}\n`);
    return 1;
  }
}

/* istanbul ignore next -- Puppeteer, network and file adapters, exercised by live runs */
export function createLiveMaker(): { maker: ThemeScreenshotMaker; close: () => Promise<void> } {
  const fetcher: Fetcher = {
    text: async (url) => {
      const response = await fetch(url, { redirect: 'follow' });
      if (!response.ok) {
        throw new Error(`${url} answered ${response.status}.`);
      }
      return response.text();
    },
    bytes: async (url) => {
      const response = await fetch(url, { redirect: 'follow' });
      if (!response.ok) {
        throw new Error(`${url} answered ${response.status}.`);
      }
      return {
        data: Buffer.from(await response.arrayBuffer()),
        type: response.headers.get('content-type') ?? '',
      };
    },
  };
  const files: FileReader = { read: (path) => readFileSync(path) };
  let browserPromise: Promise<import('puppeteer').Browser> | undefined;
  const browser = () =>
    (browserPromise ??= import('puppeteer').then((p) => p.default.launch({ headless: true })));
  const withPage = async <T>(
    width: number,
    height: number,
    work: (page: import('puppeteer').Page) => Promise<T>
  ): Promise<T> => {
    const page = await (await browser()).newPage();
    try {
      await page.setViewport({ width, height, deviceScaleFactor: 1 });
      return await work(page);
    } finally {
      await page.close();
    }
  };
  const renderer: ScreenshotRenderer = {
    inspect: (dataUri) =>
      withPage(200, 200, async (page) => {
        await page.setContent(`<img id="logo" src="${dataUri}">`);
        await page.waitForFunction(
          'document.getElementById("logo").complete && document.getElementById("logo").naturalWidth > 0'
        );
        return page.evaluate(`(() => {
          const img = document.getElementById('logo');
          const scale = Math.min(1, 200 / Math.max(img.naturalWidth, img.naturalHeight));
          const canvas = document.createElement('canvas');
          canvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
          canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
          const lin = (v) => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); };
          let total = 0, weight = 0;
          for (let i = 0; i < data.length; i += 4) {
            const a = data[i + 3] / 255;
            if (a < 0.5) continue;
            total += 0.2126 * lin(data[i]) + 0.7152 * lin(data[i + 1]) + 0.0722 * lin(data[i + 2]);
            weight += 1;
          }
          return { width: img.naturalWidth, height: img.naturalHeight, luminance: weight ? total / weight : 0.5 };
        })()`) as Promise<LogoMeasure>;
      }),
    render: (html, width, height) =>
      withPage(width, height, async (page) => {
        await page.setContent(html, { waitUntil: 'load' });
        return Buffer.from(await page.screenshot({ type: 'png' }));
      }),
    close: async () => {
      if (browserPromise) {
        await (await browserPromise).close();
      }
    },
  };
  return {
    maker: new ThemeScreenshotMaker(new LogoLoader(fetcher, files), files, renderer),
    close: () => renderer.close(),
  };
}

/* istanbul ignore next -- thin CLI entry point */
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  runScreenshotCli(process.argv.slice(2), {
    createMaker: createLiveMaker,
    writeFile: (path, data) => writeFileSync(path, data),
    stdout: (text) => process.stdout.write(text),
    stderr: (text) => process.stderr.write(text),
  }).then((code) => {
    process.exitCode = code;
  });
}
