/**
 * Measures the computed styles of named elements on one page at several
 * viewport widths, in their default, hover and focus states, and takes a
 * full-page screenshot at each width. Run it on the live page and on the
 * local build with the same selectors file, then compare the two with
 * diff-measurements.ts and map the live values to tokens with map-to-tokens.ts.
 *
 * It reads the page only: it hovers and focuses to read states, but never
 * clicks, types or submits, and it refuses wp-admin and login URLs.
 *
 * Usage:
 *   npx tsx measure-page.ts --url https://www.example.com/ --selectors selectors.json \
 *     --side live --out live.json --shots shots
 *   npx tsx measure-page.ts --url http://localhost:8881/ --selectors selectors.json \
 *     --side local --out local.json --shots shots
 *
 * selectors.json maps a name to a selector, or to a live and a local selector:
 *   { "hero heading": ".hero h1", "card title": { "live": ".lsx-tour h3", "local": ".tsp-card h3" } }
 */

/* global HTMLElement, getComputedStyle -- collectors run in the browser */

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

export type Side = 'live' | 'local';
export type MeasureState = 'default' | 'hover' | 'focus';

export const DEFAULT_PROPERTIES = [
  'font-family',
  'font-size',
  'font-weight',
  'font-style',
  'line-height',
  'letter-spacing',
  'text-transform',
  'text-decoration-line',
  'text-align',
  'color',
  'background-color',
  'background-image',
  'padding-top',
  'padding-right',
  'padding-bottom',
  'padding-left',
  'margin-top',
  'margin-bottom',
  'row-gap',
  'column-gap',
  'border-top-width',
  'border-top-style',
  'border-top-color',
  'border-bottom-width',
  'border-bottom-color',
  'border-top-left-radius',
  'border-bottom-right-radius',
  'box-shadow',
  'outline-color',
  'outline-width',
  'outline-offset',
  'display',
  'flex-direction',
  'justify-content',
  'align-items',
  'grid-template-columns',
  'max-width',
  'aspect-ratio',
  'object-fit',
  'opacity',
  'transition-duration',
];

export interface ElementReading {
  count: number;
  rect: { width: number; height: number };
  styles: Record<string, string>;
}

export interface Measurement {
  name: string;
  selector: string;
  width: number;
  state: MeasureState;
  found: boolean;
  count?: number;
  rect?: { width: number; height: number };
  /** Every property in the default state; only the changed ones in hover and focus. */
  styles?: Record<string, string>;
}

export interface MeasureFile {
  url: string;
  side: Side;
  measuredAt: string;
  widths: number[];
  properties: string[];
  measurements: Measurement[];
  screenshots: string[];
  failures: { width: number; error: string }[];
}

export interface NamedSelector {
  name: string;
  selector: string;
}

/** Runs in the browser: reads the first element that matches the selector. */
export function readElement(args: {
  selector: string;
  properties: string[];
}): ElementReading | null {
  const all = document.querySelectorAll(args.selector);
  const element = all[0] as HTMLElement | undefined;
  if (!element) {
    return null;
  }
  const computed = getComputedStyle(element);
  const styles: Record<string, string> = {};
  for (const property of args.properties) {
    styles[property] = computed.getPropertyValue(property).trim();
  }
  const box = element.getBoundingClientRect();
  return {
    count: all.length,
    rect: { width: Math.round(box.width * 10) / 10, height: Math.round(box.height * 10) / 10 },
    styles,
  };
}

export interface PageHandle {
  read: (
    selector: string,
    properties: string[],
    state: MeasureState
  ) => Promise<ElementReading | null>;
  screenshot: (path: string) => Promise<boolean>;
  close: () => Promise<void>;
}

export interface BrowserDriver {
  open: (url: string, width: number) => Promise<PageHandle>;
  close: () => Promise<void>;
}

export interface MeasureOptions {
  url: string;
  side: Side;
  selectors: NamedSelector[];
  widths?: number[];
  states?: MeasureState[];
  properties?: string[];
  shotsDir?: string;
  delayMs?: number;
}

const FORBIDDEN_PATH = /\/(wp-admin|wp-login\.php)(\/|$|\?)/i;

export class PageMeasurer {
  constructor(
    private readonly driver: BrowserDriver,
    private readonly sleep: (ms: number) => Promise<void>,
    private readonly now: () => Date = () => new Date()
  ) {}

  /** Parses the URL and refuses admin and login pages. Call it before launching a browser. */
  static checkUrl(value: string): URL {
    const url = new URL(value);
    if (FORBIDDEN_PATH.test(url.pathname)) {
      throw new Error(`Refusing ${url.href}: measure public pages only, never wp-admin or login.`);
    }
    return url;
  }

  async measure(options: MeasureOptions): Promise<MeasureFile> {
    let url: URL;
    try {
      url = PageMeasurer.checkUrl(options.url);
    } catch (error) {
      await this.driver.close();
      throw error;
    }
    const widths = options.widths ?? [390, 768, 1440];
    const states = options.states ?? ['default', 'hover', 'focus'];
    const properties = options.properties ?? DEFAULT_PROPERTIES;
    const result: MeasureFile = {
      url: url.href,
      side: options.side,
      measuredAt: this.now().toISOString(),
      widths,
      properties,
      measurements: [],
      screenshots: [],
      failures: [],
    };

    try {
      for (const [index, width] of widths.entries()) {
        if (index > 0) {
          await this.sleep(options.delayMs ?? 1500);
        }
        let page: PageHandle | undefined;
        try {
          page = await this.driver.open(url.href, width);
          for (const item of options.selectors) {
            result.measurements.push(
              ...(await this.measureOne(page, item, width, states, properties))
            );
          }
          if (options.shotsDir) {
            const path = join(
              options.shotsDir,
              `${options.side}-${PageMeasurer.slug(url)}-${width}.png`
            );
            if (await page.screenshot(path)) {
              result.screenshots.push(path);
            }
          }
        } catch (error) {
          result.failures.push({ width, error: (error as Error).message });
        } finally {
          await page?.close();
        }
      }
    } finally {
      await this.driver.close();
    }
    return result;
  }

  private async measureOne(
    page: PageHandle,
    item: NamedSelector,
    width: number,
    states: MeasureState[],
    properties: string[]
  ): Promise<Measurement[]> {
    const base = await page.read(item.selector, properties, 'default');
    if (!base) {
      return [{ name: item.name, selector: item.selector, width, state: 'default', found: false }];
    }
    const out: Measurement[] = [
      {
        name: item.name,
        selector: item.selector,
        width,
        state: 'default',
        found: true,
        count: base.count,
        rect: base.rect,
        styles: base.styles,
      },
    ];
    for (const state of states) {
      if (state === 'default') {
        continue;
      }
      const reading = await page.read(item.selector, properties, state);
      if (!reading) {
        continue;
      }
      const changed = Object.fromEntries(
        Object.entries(reading.styles).filter(([key, value]) => base.styles[key] !== value)
      );
      if (Object.keys(changed).length) {
        out.push({
          name: item.name,
          selector: item.selector,
          width,
          state,
          found: true,
          styles: changed,
        });
      }
    }
    return out;
  }

  static slug(url: URL): string {
    const path = url.pathname.replace(/^\/|\/$/g, '');
    return path ? path.replace(/[^a-z0-9]+/gi, '-').toLowerCase() : 'home';
  }

  /** Reads a selectors file and picks the selector for one side. */
  static selectorsFrom(json: unknown, side: Side): NamedSelector[] {
    if (!json || typeof json !== 'object' || Array.isArray(json)) {
      throw new Error('The selectors file must be an object of name: selector.');
    }
    const out: NamedSelector[] = [];
    for (const [name, value] of Object.entries(json as Record<string, unknown>)) {
      if (typeof value === 'string') {
        out.push({ name, selector: value });
      } else if (value && typeof value === 'object') {
        const selector = (value as Record<string, unknown>)[side];
        if (typeof selector === 'string') {
          out.push({ name, selector });
        }
      } else {
        throw new Error(`Selector "${name}" must be a string or { live, local }.`);
      }
    }
    if (!out.length) {
      throw new Error(`No selectors for the ${side} side.`);
    }
    return out;
  }
}

export interface MeasureCliDeps {
  createDriver: () => Promise<BrowserDriver>;
  sleep: (ms: number) => Promise<void>;
  readFile: (path: string) => string;
  writeFile: (path: string, content: string) => void;
  makeDir: (path: string) => void;
  stdout: (text: string) => void;
  stderr: (text: string) => void;
}

const USAGE =
  'Usage: measure-page --url <page> (--selectors selectors.json | --selector <css> ...) [--side live|local]\n' +
  '       [--out measure.json] [--shots shots] [--widths 390,768,1440] [--states default,hover,focus]\n' +
  '       [--props font-size,color] [--delay 1500]\n';

export async function runMeasureCli(argv: string[], deps: MeasureCliDeps): Promise<number> {
  const values: Record<string, string> = {
    side: 'live',
    out: 'measure.json',
    widths: '390,768,1440',
    states: 'default,hover,focus',
    delay: '1500',
  };
  const optional = ['url', 'selectors', 'shots', 'props'];
  const single: string[] = [];
  try {
    for (let i = 0; i < argv.length; i++) {
      const arg = argv[i];
      if (arg === '--help' || arg === '-h') {
        deps.stdout(USAGE);
        return 0;
      }
      const key = arg.replace(/^--/, '');
      const value = argv[i + 1];
      if (
        !arg.startsWith('--') ||
        ![...optional, ...Object.keys(values), 'selector'].includes(key)
      ) {
        throw new Error(`Unknown argument ${arg}.`);
      }
      if (value === undefined) {
        throw new Error(`${arg} needs a value.`);
      }
      i++;
      if (key === 'selector') {
        single.push(value);
      } else {
        values[key] = value;
      }
    }
    if (!values.url) {
      throw new Error('--url is required.');
    }
    if (values.side !== 'live' && values.side !== 'local') {
      throw new Error('--side must be live or local.');
    }
    const side = values.side as Side;
    const selectors: NamedSelector[] = [
      ...(values.selectors
        ? PageMeasurer.selectorsFrom(JSON.parse(deps.readFile(values.selectors)), side)
        : []),
      ...single.map((selector) => ({ name: selector, selector })),
    ];
    if (!selectors.length) {
      throw new Error('Give --selectors <file> or at least one --selector.');
    }
    const states = values.states.split(',').map((s) => s.trim()) as MeasureState[];
    const unknown = states.filter((s) => !['default', 'hover', 'focus'].includes(s));
    if (unknown.length) {
      throw new Error(`Unknown state ${unknown.join(', ')}.`);
    }
    // Validate before launching the browser, so a refused URL never starts Chromium.
    PageMeasurer.checkUrl(values.url);
    if (values.shots) {
      deps.makeDir(values.shots);
    }
    const measurer = new PageMeasurer(await deps.createDriver(), deps.sleep);
    const result = await measurer.measure({
      url: values.url,
      side,
      selectors,
      widths: values.widths.split(',').map(Number),
      states,
      properties: values.props ? values.props.split(',').map((p) => p.trim()) : undefined,
      shotsDir: values.shots,
      delayMs: Number(values.delay),
    });
    deps.writeFile(values.out, `${JSON.stringify(result, null, 2)}\n`);
    const missing = result.measurements.filter((m) => !m.found);
    deps.stdout(
      `Measured ${selectors.length} elements at ${result.widths.join(', ')}px into ${values.out}` +
        ` (${result.screenshots.length} screenshots)\n`
    );
    for (const m of missing) {
      deps.stderr(`Not found at ${m.width}px: ${m.name} (${m.selector})\n`);
    }
    for (const f of result.failures) {
      deps.stderr(`Failed at ${f.width}px: ${f.error}\n`);
    }
    return result.failures.length ? 1 : 0;
  } catch (error) {
    deps.stderr(`measure-page: ${(error as Error).message}\n`);
    return 1;
  }
}

/* istanbul ignore next -- Puppeteer driver, exercised by live runs */
export async function createPuppeteerDriver(): Promise<BrowserDriver> {
  const puppeteer = (await import('puppeteer')).default;
  const browser = await puppeteer.launch({ headless: true });
  return {
    open: async (url, width) => {
      const page = await browser.newPage();
      await page.setViewport({ width, height: 900 });
      await page.goto(url, { waitUntil: 'load', timeout: 60000 });
      await page.waitForNetworkIdle({ idleTime: 500, timeout: 15000 }).catch(() => undefined);
      // tsx (esbuild) can add __name() helpers to function source; define it in the page.
      await page.evaluate('globalThis.__name = (f) => f');
      // Lazy-loaded images and scroll-triggered sections: scroll to the end and back.
      // Bounded, so an infinite-scroll page can't hold the width until the protocol times out.
      await page.evaluate(async () => {
        const started = Date.now();
        for (
          let y = 0;
          y < Math.min(document.body.scrollHeight, 30000) && Date.now() - started < 10000;
          y += 600
        ) {
          window.scrollTo(0, y);
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
        window.scrollTo(0, 0);
      });
      return {
        read: async (selector, properties, state) => {
          try {
            await page.mouse.move(0, 0);
            await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
            if (state === 'hover') {
              await page.hover(selector);
            } else if (state === 'focus') {
              await page.focus(selector);
            }
            return await page.evaluate(readElement, { selector, properties });
          } catch {
            return null; // Covered, hidden, not focusable or detached.
          }
        },
        screenshot: async (path) => {
          try {
            await page.screenshot({ path, fullPage: true });
            return true;
          } catch {
            return false;
          }
        },
        close: () => page.close(),
      };
    },
    close: () => browser.close(),
  };
}

/* istanbul ignore next -- thin CLI entry point */
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  runMeasureCli(process.argv.slice(2), {
    createDriver: createPuppeteerDriver,
    sleep: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
    readFile: (path) => readFileSync(path, 'utf8'),
    writeFile: (path, content) => writeFileSync(path, content),
    makeDir: (path) => mkdirSync(path, { recursive: true }),
    stdout: (text) => process.stdout.write(text),
    stderr: (text) => process.stderr.write(text),
  }).then((code) => process.exit(code));
}
