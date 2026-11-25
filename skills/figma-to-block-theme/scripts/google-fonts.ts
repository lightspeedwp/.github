/**
 * Downloads WOFF2 files from Google Fonts and builds a theme.json font family.
 *
 * Uses the CSS2 API (not fonts.google.com/download, which returns HTML).
 * Ask for a weight range (200..1000) to get a variable font; pass a list
 * (400,700) for a static font.
 *
 * Usage:
 *   npx tsx google-fonts.ts --family "Nunito Sans" --slug body \
 *     --weights 200..1000 --styles normal,italic --out assets/fonts \
 *     --theme-root .
 *
 * Prints the settings.typography.fontFamilies entry as JSON.
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { posix } from 'node:path';
import { pathToFileURL } from 'node:url';

export interface FetchResponse {
  ok: boolean;
  status: number;
  text: () => Promise<string>;
  arrayBuffer: () => Promise<ArrayBuffer>;
}

export type Fetcher = (
  url: string,
  init?: { headers?: Record<string, string> }
) => Promise<FetchResponse>;

export interface FileWriter {
  mkdir: (path: string) => void;
  writeFile: (path: string, data: Uint8Array) => void;
}

export interface FontRequest {
  family: string;
  /** "200..1000" for a variable range, or "400,700" for static weights. */
  weights: string;
  styles: Array<'normal' | 'italic'>;
}

export interface ParsedFontFace {
  subset: string;
  fontFamily: string;
  fontStyle: string;
  fontWeight: string;
  url: string;
  unicodeRange?: string;
}

export interface ThemeFontFace {
  fontFamily: string;
  fontStyle: string;
  fontWeight: string;
  src: string[];
  unicodeRange?: string;
}

// A current browser user agent makes Google Fonts serve WOFF2.
const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36';

export class GoogleFontsClient {
  constructor(private readonly fetcher: Fetcher) {}

  buildCssUrl(request: FontRequest): string {
    const weights = this.weightList(request.weights);
    const italic = request.styles.includes('italic');
    const family = encodeURIComponent(request.family).replace(/%20/g, '+');
    let axes: string;

    if (italic) {
      const tuples = request.styles
        .map((style) => (style === 'italic' ? 1 : 0))
        .sort()
        .flatMap((ital) => weights.map((weight) => `${ital},${weight}`));
      axes = `ital,wght@${tuples.join(';')}`;
    } else {
      axes = `wght@${weights.join(';')}`;
    }

    return `https://fonts.googleapis.com/css2?family=${family}:${axes}&display=swap`;
  }

  async fetchFaces(request: FontRequest): Promise<ParsedFontFace[]> {
    const url = this.buildCssUrl(request);
    const response = await this.fetcher(url, {
      headers: { 'User-Agent': USER_AGENT },
    });

    if (!response.ok) {
      const hint = request.weights.includes('..')
        ? ' The font may not be variable: try a list of static weights such as 400,700.'
        : '';
      throw new Error(`Google Fonts returned ${response.status} for ${request.family}.${hint}`);
    }

    return GoogleFontsClient.parseCss(await response.text());
  }

  /** Reads the @font-face blocks, keeping the subset from the comment above each. */
  static parseCss(css: string): ParsedFontFace[] {
    const faces: ParsedFontFace[] = [];
    const blockPattern = /(?:\/\*\s*([\w-]+)\s*\*\/\s*)?@font-face\s*{([^}]*)}/g;
    let match: RegExpExecArray | null;

    while ((match = blockPattern.exec(css)) !== null) {
      const body = match[2];
      const read = (property: string) =>
        body.match(new RegExp(`${property}:\\s*([^;]+);`))?.[1].trim();
      const url = body.match(/url\(([^)]+)\)\s*format\(['"]?woff2['"]?\)/)?.[1];
      if (!url) {
        continue;
      }

      faces.push({
        subset: match[1] ?? 'default',
        fontFamily: (read('font-family') ?? '').replace(/['"]/g, ''),
        fontStyle: read('font-style') ?? 'normal',
        fontWeight: read('font-weight') ?? '400',
        url: url.replace(/['"]/g, ''),
        unicodeRange: read('unicode-range'),
      });
    }

    return faces;
  }

  private weightList(weights: string): string[] {
    const trimmed = weights.trim();
    if (/^\d+\.\.\d+$/.test(trimmed)) {
      return [trimmed];
    }
    const list = trimmed
      .split(',')
      .map((weight) => weight.trim())
      .filter(Boolean);
    if (!list.length || list.some((weight) => !/^\d+$/.test(weight))) {
      throw new Error(`Invalid weights "${weights}". Use 200..1000 or 400,700.`);
    }
    return [...new Set(list)].sort((a, b) => Number(a) - Number(b));
  }
}

export class FontDownloader {
  constructor(
    private readonly fetcher: Fetcher,
    private readonly writer: FileWriter
  ) {}

  /**
   * Saves each face to <outDir>/<family-slug>/ and returns fontFace entries
   * whose src paths are relative to the theme root.
   */
  async download(
    faces: ParsedFontFace[],
    outDir: string,
    subsets: string[],
    themeRoot = '.'
  ): Promise<ThemeFontFace[]> {
    const selected = faces.filter((face) => subsets.includes(face.subset));
    if (!selected.length) {
      const available = [...new Set(faces.map((face) => face.subset))];
      throw new Error(
        `No font files for subsets ${subsets.join(', ')}. Available: ${available.join(', ') || 'none'}.`
      );
    }

    const multipleSubsets = new Set(selected.map((face) => face.subset)).size > 1;
    const familySlug = this.slugify(selected[0].fontFamily);
    const directory = posix.join(outDir, familySlug);
    const relativeDirectory = posix.relative(themeRoot, directory);
    if (relativeDirectory.startsWith('..') || posix.isAbsolute(relativeDirectory)) {
      throw new Error(`The output folder ${outDir} must be inside the theme root ${themeRoot}.`);
    }
    this.writer.mkdir(directory);

    const entries: ThemeFontFace[] = [];
    for (const face of selected) {
      const parts = [
        familySlug,
        face.fontWeight.replace(/\s+/g, '-'),
        face.fontStyle,
        multipleSubsets ? face.subset : '',
      ].filter(Boolean);
      const fileName = `${parts.join('-')}.woff2`;
      const file = posix.join(directory, fileName);

      const response = await this.fetcher(face.url);
      if (!response.ok) {
        throw new Error(`Download failed (${response.status}) for ${face.url}.`);
      }
      this.writer.writeFile(file, new Uint8Array(await response.arrayBuffer()));

      const entry: ThemeFontFace = {
        fontFamily: face.fontFamily,
        fontStyle: face.fontStyle,
        fontWeight: face.fontWeight,
        src: [`file:./${posix.join(relativeDirectory, fileName)}`],
      };
      if (multipleSubsets && face.unicodeRange) {
        entry.unicodeRange = face.unicodeRange;
      }
      entries.push(entry);
    }

    return entries;
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
}

export interface FontsCliDeps {
  fetcher: Fetcher;
  writer: FileWriter;
  stdout: (text: string) => void;
  stderr: (text: string) => void;
}

/** Parses CLI arguments, downloads the font and prints its theme.json entry. */
export async function runGoogleFontsCli(argv: string[], deps: FontsCliDeps): Promise<number> {
  const values: Record<string, string> = {
    weights: '400..700',
    styles: 'normal',
    subsets: 'latin',
    out: 'assets/fonts',
    'theme-root': '.',
    fallback: 'sans-serif',
  };

  try {
    for (let i = 0; i < argv.length; i++) {
      const arg = argv[i];
      if (arg === '--help' || arg === '-h') {
        deps.stdout(
          'Usage: google-fonts --family "Nunito Sans" --slug body [--weights 200..1000 | 400,700] [--styles normal,italic] [--subsets latin] [--out assets/fonts] [--theme-root .] [--fallback sans-serif]\n'
        );
        return 0;
      }
      const key = arg.replace(/^--/, '');
      if (!arg.startsWith('--') || !['family', 'slug', ...Object.keys(values)].includes(key)) {
        throw new Error(`Unknown argument ${arg}.`);
      }
      const value = argv[++i];
      if (value === undefined) {
        throw new Error(`${arg} needs a value.`);
      }
      values[key] = value;
    }

    if (!values.family || !values.slug) {
      throw new Error('--family and --slug are required.');
    }

    const styles = values.styles.split(',').map((style) => style.trim());
    if (styles.some((style) => style !== 'normal' && style !== 'italic')) {
      throw new Error('--styles accepts normal and italic.');
    }

    const client = new GoogleFontsClient(deps.fetcher);
    const faces = await client.fetchFaces({
      family: values.family,
      weights: values.weights,
      styles: styles as FontRequest['styles'],
    });
    const fontFace = await new FontDownloader(deps.fetcher, deps.writer).download(
      faces,
      values.out,
      values.subsets.split(',').map((subset) => subset.trim()),
      values['theme-root']
    );
    const quoted = /\s/.test(values.family) ? `"${values.family}"` : values.family;

    deps.stdout(
      `${JSON.stringify(
        {
          name: values.family,
          slug: values.slug,
          fontFamily: `${quoted}, ${values.fallback}`,
          fontFace,
        },
        null,
        '\t'
      )}\n`
    );
    return 0;
  } catch (error) {
    deps.stderr(`google-fonts: ${(error as Error).message}\n`);
    return 1;
  }
}

/* istanbul ignore next -- thin CLI entry point */
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  runGoogleFontsCli(process.argv.slice(2), {
    fetcher: (url, init) => fetch(url, init),
    writer: {
      mkdir: (path) => mkdirSync(path, { recursive: true }),
      writeFile: (path, data) => writeFileSync(path, data),
    },
    stdout: (text) => process.stdout.write(text),
    stderr: (text) => process.stderr.write(text),
  }).then((code) => {
    process.exitCode = code;
  });
}
