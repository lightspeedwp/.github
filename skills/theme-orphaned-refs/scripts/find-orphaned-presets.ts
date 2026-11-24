/**
 * Finds preset references in a block theme that theme.json no longer defines,
 * and suggests the closest defined slug for each.
 *
 * Usage (from the repository root):
 *   npx tsx skills/theme-orphaned-refs/scripts/find-orphaned-presets.ts --root <theme> [--report <file>] [--exclude <folder>]
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { extname, isAbsolute, join, relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export type PresetType =
  | 'color'
  | 'font-family'
  | 'font-size'
  | 'spacing'
  | 'shadow'
  | 'border-radius'
  | 'gradient'
  | 'duotone';

export const PRESET_TYPES: readonly PresetType[] = [
  'color',
  'font-family',
  'font-size',
  'spacing',
  'shadow',
  'border-radius',
  'gradient',
  'duotone',
];

/** Dependency, build, VCS and agent folders hold other projects' preset references. */
export const SKIP_DIRS: readonly string[] = [
  'node_modules',
  'vendor',
  'build',
  'dist',
  'coverage',
  '.git',
  '.agents',
  '.claude',
  '.github',
];

const BINARY_EXTENSIONS = new Set([
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.webp',
  '.svg',
  '.woff',
  '.woff2',
  '.ttf',
  '.otf',
  '.eot',
]);

const NAME_TO_FONT_SIZE: Record<string, string> = {
  tiny: '100',
  base: '200',
  small: '300',
  medium: '400',
  large: '500',
  'x-large': '600',
  'xx-large': '700',
  'xxx-large': '800',
  gigantic: '800',
  colossal: '900',
};

const COLOR_STEP_PREFIXES = new Set(['accent', 'cta', 'brand']);

const JSON_REFERENCE = /var:preset\|([a-z-]+)\|([a-zA-Z0-9-]+)/g;
// A type has single hyphens only, so "border-radius--600" reads as type "border-radius", slug "600".
const CSS_REFERENCE = /--wp--preset--([a-z]+(?:-[a-z]+)*)--([a-zA-Z0-9-]+)/g;

export type PresetRegistry = Record<PresetType, string[]>;

export interface Orphan {
  file: string;
  type: PresetType;
  slug: string;
  suggestion: string;
}

/** File access, injected so tests never touch the disk. */
export interface FileSystem {
  readText(path: string): string | undefined;
  listDir(path: string): { name: string; isDirectory: boolean }[];
  writeText(path: string, content: string): void;
}

type JsonObject = Record<string, unknown>;

/** Reads the slugs theme.json defines for each preset type. */
export class PresetRegistryLoader {
  load(themeJson: string): PresetRegistry {
    const settings = ((JSON.parse(themeJson) as JsonObject).settings ?? {}) as JsonObject;
    const slugs = (group: string, key: string): string[] => {
      const list = ((settings[group] ?? {}) as JsonObject)[key];
      return Array.isArray(list)
        ? list
            .map((entry) => (entry as JsonObject | null)?.slug)
            .filter((slug): slug is string => typeof slug === 'string' && slug !== '')
        : [];
    };
    return {
      color: slugs('color', 'palette'),
      gradient: slugs('color', 'gradients'),
      duotone: slugs('color', 'duotone'),
      'font-family': slugs('typography', 'fontFamilies'),
      'font-size': slugs('typography', 'fontSizes'),
      spacing: slugs('spacing', 'spacingSizes'),
      shadow: slugs('shadow', 'presets'),
      'border-radius': slugs('border', 'radiusSizes'),
    };
  }
}

/** Suggests the closest defined slug for one that no longer exists. */
export class SlugSuggester {
  suggest(slug: string, type: PresetType, candidates: string[]): string {
    if (!candidates.length || candidates.includes(slug)) {
      return slug;
    }

    if (type === 'font-size') {
      const mapped = NAME_TO_FONT_SIZE[slug];
      if (mapped && candidates.includes(mapped)) {
        return mapped;
      }
    }

    // Numeric ladders (font sizes 100-900, radius 0-700, spacing 5-100): the nearest step.
    if (/^\d+$/.test(slug)) {
      const steps = candidates.filter((c) => /^\d+$/.test(c));
      if (steps.length) {
        return this.nearest(steps, Number(slug), (c) => Number(c));
      }
    }

    const stepped = slug.match(/^(.*?)-(\d+)$/);
    if (stepped) {
      const [, prefix, digits] = stepped;
      const number = Number(digits);
      if (COLOR_STEP_PREFIXES.has(prefix) && number < 100) {
        const scaled = `${prefix}-${number * 100}`;
        if (candidates.includes(scaled)) {
          return scaled;
        }
      }
      const samePrefix = candidates.filter((c) => new RegExp(`^${prefix}-\\d+$`).test(c));
      if (samePrefix.length) {
        return this.nearest(samePrefix, number, (c) => Number(c.slice(prefix.length + 1)));
      }
    }

    return this.mostSimilar(slug, candidates);
  }

  private nearest(candidates: string[], target: number, value: (c: string) => number): string {
    return [...candidates].sort(
      (a, b) => Math.abs(value(a) - target) - Math.abs(value(b) - target) || value(a) - value(b)
    )[0];
  }

  /** Highest 2 x common-subsequence / total-length ratio; the first candidate wins ties. */
  private mostSimilar(slug: string, candidates: string[]): string {
    let best = candidates[0];
    let bestScore = -1;
    for (const candidate of candidates) {
      const score = (2 * this.commonLength(slug, candidate)) / (slug.length + candidate.length);
      if (score > bestScore) {
        best = candidate;
        bestScore = score;
      }
    }
    return best;
  }

  private commonLength(a: string, b: string): number {
    const row = new Array<number>(b.length + 1).fill(0);
    for (let i = 1; i <= a.length; i++) {
      let diagonal = 0;
      for (let j = 1; j <= b.length; j++) {
        const above = row[j];
        row[j] = a[i - 1] === b[j - 1] ? diagonal + 1 : Math.max(row[j], row[j - 1]);
        diagonal = above;
      }
    }
    return row[b.length];
  }
}

/** Walks the theme's own files and reports references to undefined presets. */
export class OrphanScanner {
  constructor(
    private readonly fs: FileSystem,
    private readonly suggester = new SlugSuggester()
  ) {}

  /** The theme's text files in path order, without entering skipped folders. */
  files(root: string, skipDirs: Iterable<string> = SKIP_DIRS): string[] {
    const skip = new Set(skipDirs);
    const found: string[] = [];
    const walk = (dir: string): void => {
      for (const entry of this.fs.listDir(dir)) {
        const path = join(dir, entry.name);
        if (entry.isDirectory) {
          if (!skip.has(entry.name)) {
            walk(path);
          }
        } else if (!BINARY_EXTENSIONS.has(extname(entry.name).toLowerCase())) {
          found.push(path);
        }
      }
    };
    walk(root);
    return found.sort();
  }

  scan(root: string, presets: PresetRegistry, skipDirs: Iterable<string> = SKIP_DIRS): Orphan[] {
    const orphans: Orphan[] = [];
    for (const file of this.files(root, skipDirs)) {
      const text = this.fs.readText(file);
      if (text === undefined) {
        continue;
      }
      for (const pattern of [JSON_REFERENCE, CSS_REFERENCE]) {
        for (const match of text.matchAll(pattern)) {
          const [, type, slug] = match;
          if (!(PRESET_TYPES as readonly string[]).includes(type)) {
            continue;
          }
          const candidates = presets[type as PresetType];
          if (!candidates.includes(slug)) {
            orphans.push({
              file,
              type: type as PresetType,
              slug,
              suggestion: this.suggester.suggest(slug, type as PresetType, candidates),
            });
          }
        }
      }
    }
    return orphans;
  }
}

export interface CliIo {
  fs: FileSystem;
  stdout(text: string): void;
  stderr(text: string): void;
}

const USAGE =
  'Usage: find-orphaned-presets [--root <theme>] [--theme theme.json] [--report <file>] [--exclude <folder>]...\n' +
  `Always skips: ${SKIP_DIRS.join(', ')}.\n`;

/** Parses CLI arguments, scans the theme, writes the report and returns the exit code. */
export function runOrphanedRefsCli(argv: string[], io: CliIo): number {
  let root = '.';
  let theme = 'theme.json';
  let report = '_orphaned_preset_refs.txt';
  const exclude: string[] = [];

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      io.stdout(USAGE);
      return 0;
    }
    const value = argv[i + 1];
    if (!['--root', '--theme', '--report', '--exclude'].includes(arg) || value === undefined) {
      io.stderr(`Unknown or incomplete argument: ${arg}\n${USAGE}`);
      return 1;
    }
    i++;
    if (arg === '--root') root = value;
    else if (arg === '--theme') theme = value;
    else if (arg === '--report') report = value;
    else exclude.push(value);
  }

  const rootPath = resolve(root);
  const themeJson = io.fs.readText(join(rootPath, theme));
  if (themeJson === undefined) {
    io.stderr(`Cannot read ${join(rootPath, theme)}\n`);
    return 1;
  }

  const presets = new PresetRegistryLoader().load(themeJson);
  const orphans = new OrphanScanner(io.fs).scan(rootPath, presets, [...SKIP_DIRS, ...exclude]);
  const reportPath = isAbsolute(report) ? report : join(rootPath, report);
  io.fs.writeText(
    reportPath,
    orphans
      .map((o) => `${relative(rootPath, o.file)}\t${o.type}\t${o.slug}\t${o.suggestion}\n`)
      .join('')
  );
  io.stdout(`Orphaned count: ${orphans.length}\nReport: ${reportPath}\n`);
  return 0;
}

/* istanbul ignore next -- the real file system, used only from the command line */
export const nodeFileSystem: FileSystem = {
  readText(path) {
    try {
      return readFileSync(path, 'utf8');
    } catch {
      return undefined;
    }
  },
  listDir(path) {
    return readdirSync(path, { withFileTypes: true }).map((entry) => ({
      name: entry.name,
      isDirectory: entry.isDirectory(),
    }));
  },
  writeText(path, content) {
    writeFileSync(path, content);
  },
};

/* istanbul ignore next -- thin CLI entry point */
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exitCode = runOrphanedRefsCli(process.argv.slice(2), {
    fs: nodeFileSystem,
    stdout: (text) => process.stdout.write(text),
    stderr: (text) => process.stderr.write(text),
  });
}
