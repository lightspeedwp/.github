import { join } from 'node:path';
import {
  FileSystem,
  OrphanScanner,
  PresetRegistryLoader,
  runOrphanedRefsCli,
  SKIP_DIRS,
  SlugSuggester,
} from '../find-orphaned-presets';

const ROOT = '/theme';

const THEME = JSON.stringify({
  settings: {
    color: { palette: [{ slug: 'base' }, { slug: 'brand-600' }, {}], gradients: [{ slug: 'g' }] },
    typography: { fontSizes: [{ slug: '200' }, { slug: '300' }], fontFamilies: [{ slug: 'body' }] },
    spacing: { spacingSizes: [{ slug: '5' }, { slug: '10' }] },
    shadow: { presets: [{ slug: '100' }] },
    border: { radiusSizes: [{ slug: '0' }, { slug: '400' }, { slug: '700' }] },
  },
});

/** An in-memory theme folder. Keys are paths relative to ROOT. */
class MemoryFileSystem implements FileSystem {
  readonly written = new Map<string, string>();
  readonly listed: string[] = [];

  constructor(private readonly files: Record<string, string | undefined>) {}

  readText(path: string): string | undefined {
    const key = path.slice(ROOT.length + 1);
    return key in this.files ? this.files[key] : undefined;
  }

  listDir(path: string): { name: string; isDirectory: boolean }[] {
    this.listed.push(path);
    const prefix = path === ROOT ? '' : `${path.slice(ROOT.length + 1)}/`;
    const entries = new Map<string, boolean>();
    for (const file of Object.keys(this.files)) {
      if (file.startsWith(prefix)) {
        const [name, ...rest] = file.slice(prefix.length).split('/');
        entries.set(name, rest.length > 0);
      }
    }
    return [...entries].map(([name, isDirectory]) => ({ name, isDirectory }));
  }

  writeText(path: string, content: string): void {
    this.written.set(path, content);
  }
}

function scan(files: Record<string, string | undefined>, skip?: string[]) {
  const fs = new MemoryFileSystem({ 'theme.json': THEME, ...files });
  const presets = new PresetRegistryLoader().load(THEME);
  const orphans = new OrphanScanner(fs).scan(ROOT, presets, skip).map((o) => ({
    ...o,
    file: o.file.slice(ROOT.length + 1),
  }));
  return { orphans, fs };
}

describe('PresetRegistryLoader', () => {
  it('reads every preset type, including radius, and drops entries without a slug', () => {
    const presets = new PresetRegistryLoader().load(THEME);
    expect(presets.color).toEqual(['base', 'brand-600']);
    expect(presets['border-radius']).toEqual(['0', '400', '700']);
    expect(presets.duotone).toEqual([]);
  });

  it('copes with a theme.json that has no settings', () => {
    expect(new PresetRegistryLoader().load('{}').spacing).toEqual([]);
  });
});

describe('OrphanScanner', () => {
  it('reports orphans in the theme files with suggestions', () => {
    const { orphans } = scan({
      'patterns/hero.php':
        'style="color:var(--wp--preset--color--brand-500)" {"fontSize":"var:preset|font-size|small"}',
    });
    expect(orphans).toEqual([
      { file: 'patterns/hero.php', type: 'font-size', slug: 'small', suggestion: '300' },
      { file: 'patterns/hero.php', type: 'color', slug: 'brand-500', suggestion: 'brand-600' },
    ]);
  });

  it('checks border-radius presets and suggests the nearest step', () => {
    const { orphans } = scan({
      'styles/blocks/button/rounded.json':
        '{"radius":"var(--wp--preset--border-radius--600)","r2":"var:preset|border-radius|400"}',
    });
    expect(orphans).toEqual([
      {
        file: 'styles/blocks/button/rounded.json',
        type: 'border-radius',
        slug: '600',
        suggestion: '700',
      },
    ]);
  });

  it('never enters dependency, build or agent folders', () => {
    const bad = 'var(--wp--preset--color--vivid-purple)';
    const files: Record<string, string> = { 'templates/index.html': bad };
    for (const folder of SKIP_DIRS) {
      files[`${folder}/deep/file.js`] = bad;
    }
    const { orphans, fs } = scan(files);
    expect(orphans.map((o) => o.file)).toEqual(['templates/index.html']);
    expect(fs.listed).not.toContain(join(ROOT, 'node_modules'));
  });

  it('honours extra excludes and skips binary and unreadable files', () => {
    const bad = 'var(--wp--preset--color--vivid-purple)';
    const { orphans } = scan(
      { 'tmp/file.css': bad, 'assets/logo.SVG': bad, 'parts/gone.html': undefined },
      [...SKIP_DIRS, 'tmp']
    );
    expect(orphans).toEqual([]);
  });

  it('ignores preset types it does not know', () => {
    expect(scan({ 'parts/header.html': 'var(--wp--preset--aspect-ratio--wide)' }).orphans).toEqual(
      []
    );
  });
});

describe('SlugSuggester', () => {
  const suggester = new SlugSuggester();

  it.each([
    ['x', 'color', [], 'x'],
    ['base', 'color', ['base'], 'base'],
    ['medium', 'font-size', ['300', '400'], '400'],
    ['huge', 'font-size', ['300', '400'], '300'],
    ['brand-6', 'color', ['brand-600', 'brand-100'], 'brand-600'],
    ['cta-450', 'color', ['cta-400', 'cta-900'], 'cta-400'],
    ['primary-450', 'color', ['primary-500', 'primary-400'], 'primary-400'],
    ['50', 'spacing', ['40', '60', 'base'], '40'],
    ['600', 'border-radius', ['none'], 'none'],
    ['contrast', 'color', ['base', 'contrast-alt'], 'contrast-alt'],
    ['zzz', 'color', ['base', 'brand'], 'base'],
  ] as const)('suggests for %s (%s)', (slug, type, candidates, expected) => {
    expect(suggester.suggest(slug, type, [...candidates])).toBe(expected);
  });
});

describe('runOrphanedRefsCli', () => {
  function run(argv: string[], files: Record<string, string> = {}) {
    const fs = new MemoryFileSystem({ 'theme.json': THEME, ...files });
    const out: string[] = [];
    const err: string[] = [];
    const code = runOrphanedRefsCli(argv, {
      fs,
      stdout: (t) => out.push(t),
      stderr: (t) => err.push(t),
    });
    return { code, fs, out: out.join(''), err: err.join('') };
  }

  it('writes a report of the orphans, relative to the theme', () => {
    const { code, fs, out } = run(
      ['--root', ROOT, '--report', 'report.txt', '--exclude', 'scratch'],
      {
        'patterns/a.php': 'var(--wp--preset--shadow--600)',
        'scratch/b.php': 'var(--wp--preset--shadow--600)',
      }
    );
    expect(code).toBe(0);
    expect(fs.written.get(join(ROOT, 'report.txt'))).toBe('patterns/a.php\tshadow\t600\t100\n');
    expect(out).toContain('Orphaned count: 1');
  });

  it('writes an absolute report path as given', () => {
    const { fs } = run(['--root', ROOT, '--report', '/tmp/out.txt', '--theme', 'theme.json']);
    expect(fs.written.get('/tmp/out.txt')).toBe('');
  });

  it('prints help', () => {
    const { code, out } = run(['--help']);
    expect(code).toBe(0);
    expect(out).toContain('Always skips: node_modules');
  });

  it('rejects unknown or incomplete arguments', () => {
    expect(run(['--nope', 'x']).code).toBe(1);
    expect(run(['--root']).err).toContain('Unknown or incomplete argument: --root');
  });

  it('fails when theme.json cannot be read', () => {
    const { code, err } = run(['--root', ROOT, '--theme', 'missing.json']);
    expect(code).toBe(1);
    expect(err).toContain('Cannot read');
  });
});
