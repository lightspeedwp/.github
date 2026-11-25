/**
 * The plumbing: text helpers, theme reader, block markup, allow-list, runner, reporter,
 * schema source and CLI.
 */
import { describe, expect, it } from 'vitest';
import { AllowList } from '../lib/allow-list';
import { BlockMarkup, fullName } from '../lib/block-markup';
import { Cli, USAGE } from '../lib/cli';
import { Reporter } from '../lib/reporter';
import { Runner } from '../lib/runner';
import { BundledSchemaSource } from '../lib/schema-source';
import { lineAt, lineOfPath, stripPhp, wildcard, withoutHeader } from '../lib/text';
import { ThemeReader } from '../lib/theme-reader';
import type { Check, Finding } from '../lib/types';
import { MemoryFileSystem, ROOT, cleanFiles, fakeSchema, makeTheme, onDisk } from './fixtures';

const finding = (over: Partial<Finding> = {}): Finding => ({
  check: 'styles/important',
  severity: 'error',
  file: 'theme.json',
  path: 'styles.css',
  message: 'm',
  hint: 'h',
  ...over,
});

describe('text helpers', () => {
  it('lineAt and lineOfPath', () => {
    const text = '{\n  "a": {\n    "b": 1\n  }\n}';
    expect(lineAt(text, text.indexOf('"b"'))).toBe(3);
    expect(lineOfPath(text, ['a', 'b'])).toBe(3);
    expect(lineOfPath(text, ['a', '0', 'missing'])).toBe(2);
    expect(lineOfPath(text, ['missing'])).toBeUndefined();
    expect(lineOfPath(text, ['0'])).toBeUndefined();
  });

  it('stripPhp keeps lines and JSON validity; withoutHeader drops the docblock', () => {
    expect(stripPhp('a<?php\necho 1;\n?>b<?php x')).toBe('a0\n\nb0');
    expect(withoutHeader('<?php\n/**\n * Title: X\n */\necho 1;')).toBe('<?php\n\n\n\necho 1;');
  });

  it('wildcard', () => {
    expect(wildcard('styles/*.json').test('styles/blocks/a.json')).toBe(true);
    expect(wildcard('theme.json').test('themeXjson')).toBe(false);
  });
});

describe('ThemeReader', () => {
  it('reads the theme, its text domain and pattern headers, skipping dependency folders', () => {
    const theme = makeTheme();
    expect(theme.textDomain).toBe('demo');
    expect(theme.namespace).toBe('demo');
    expect(theme.patterns.map((p) => p.path)).toEqual([
      'patterns/hero.php',
      'patterns/page-landing.php',
    ]);
    expect(theme.patterns[0].headers).toMatchObject({
      Title: 'Hero',
      Slug: 'demo/hero',
      'Viewport Width': '1280',
    });
    expect(theme.php.map((f) => f.path)).toEqual(['functions.php', 'inc/patterns.php']);
    expect(theme.partials[0].json).toMatchObject({ slug: 'button-dark' });
  });

  it('falls back to the folder name, honours config, and records JSON errors', () => {
    const theme = makeTheme((files) => {
      files['style.css'] = '/* Theme Name: Demo */';
      files['styles/bad.json'] = '{';
      files['.theme-validation.json'] = JSON.stringify({ namespace: 'acme' });
      delete files['theme.json'];
    });
    expect(theme.textDomain).toBe('demo');
    expect(theme.namespace).toBe('acme');
    expect(theme.themeJson).toBeUndefined();
    expect(theme.partials.find((p) => p.path === 'styles/bad.json')?.parseError).toBeTruthy();
  });

  it('throws a clear error for a broken config file', () => {
    expect(() => makeTheme((files) => (files['.theme-validation.json'] = '{'))).toThrow(
      /\.theme-validation\.json is not valid JSON/
    );
  });

  it('skips files it cannot read', () => {
    const fs = new MemoryFileSystem(onDisk(cleanFiles()));
    const original = fs.readText.bind(fs);
    fs.readText = (path) => (path.endsWith('hero.php') ? undefined : original(path));
    expect(new ThemeReader(fs).read(ROOT).patterns.map((p) => p.path)).toEqual([
      'patterns/page-landing.php',
    ]);
  });
});

describe('BlockMarkup', () => {
  it('names, tokens and blocks', () => {
    expect(fullName('group')).toBe('core/group');
    const m = new BlockMarkup({
      path: 'parts/x.html',
      text: '<!-- wp:group {"a":1} -->\n<p>x</p>\n<!-- /wp:group -->\n<!-- wp:acme/thing /-->',
    });
    expect(m.tokens().map((t) => `${t.kind} ${t.name} ${t.line}`)).toEqual([
      'open core/group 1',
      'close core/group 3',
      'void acme/thing 4',
    ]);
    expect(m.blocks().map((b) => b.name)).toEqual(['core/group', 'acme/thing']);
    expect(m.lineOf('<p>')).toBe(2);
    expect(m.lineOf(/thing/)).toBe(4);
    expect(m.lineOf('nope')).toBeUndefined();
    expect(m.problems()).toEqual([]);
  });

  it('reports bad attribute JSON as a problem while the lenient parser still reads the block', () => {
    const m = new BlockMarkup({
      path: 'parts/x.html',
      text: '<!-- wp:group {"a":} --><!-- /wp:group -->',
    });
    expect(m.problems().map((p) => p.message)).toEqual([
      'wp:core/group has attributes that are not valid JSON',
    ]);
    expect(m.blocks().map((b) => b.name)).toEqual(['core/group']);
  });
});

describe('AllowList', () => {
  it('allows matching findings up to max, and reports growth and unused entries', () => {
    const findings = [
      finding(),
      finding(),
      finding({ check: 'styles/raw-px', file: 'styles/a.json', path: 'styles.css' }),
    ];
    const result = new AllowList([
      { check: 'styles/important', file: 'theme.json', path: 'styles.css', max: 2 },
      { check: 'styles/raw-px', file: 'styles/*.json' },
      { check: 'a11y/image-alt', file: 'parts/*' },
    ]).apply(findings);
    expect(result.kept).toEqual([]);
    expect(result.allowed).toHaveLength(3);
    expect(result.unused.map((e) => e.check)).toEqual(['a11y/image-alt']);

    const grew = new AllowList([{ check: 'styles/important', file: 'theme.json', max: 1 }]).apply(
      findings
    );
    expect(grew.kept).toHaveLength(3);
    expect(grew.exceeded).toEqual([{ entry: expect.objectContaining({ max: 1 }), count: 2 }]);
  });

  it('allows nothing with no entries', () => {
    expect(new AllowList().apply([finding()]).kept).toHaveLength(1);
  });
});

const stub = (id: string, severity: Finding['severity']): Check => ({
  id,
  severity,
  description: 'stub check',
  run: () => [
    finding({ check: id, severity, line: severity === 'error' ? 4 : undefined, path: undefined }),
  ],
});

describe('Runner and Reporter', () => {
  const checks = [
    stub('styles/one', 'error'),
    stub('styles/two', 'warning'),
    stub('a11y/three', 'warning'),
  ];

  it('runs all checks, a group, or one id', () => {
    const theme = makeTheme();
    expect(new Runner(checks).run(theme).checks).toHaveLength(3);
    expect(new Runner(checks).run(theme, ['styles']).checks).toEqual(['styles/one', 'styles/two']);
    const one = new Runner(checks).run(theme, ['a11y/three']);
    expect(one).toMatchObject({ checks: ['a11y/three'], errors: 0, warnings: 1 });
  });

  it('renders text with errors first, debt lines and a summary', () => {
    const theme = makeTheme((files) => {
      files['.theme-validation.json'] = JSON.stringify({
        allow: [
          { check: 'styles/one', file: 'theme.json', max: 0 },
          { check: 'gone', file: 'x', path: 'p' },
          { check: 'gone', file: 'y' },
        ],
      });
    });
    const text = new Reporter('text').render('/t', new Runner(checks).run(theme));
    expect(text).toMatch(/^Theme: \/t\nChecks run: 3\n\nERROR {4}styles\/one {2}theme\.json:4\n/);
    expect(text.indexOf('ERROR')).toBeLessThan(text.indexOf('WARNING'));
    expect(text).toMatch(/DEBT GREW {2}styles\/one {2}theme\.json: 1 found, allow-list says 0/);
    expect(text).toMatch(/UNUSED {5}gone {2}x: nothing matches/);
    expect(text).toMatch(/1 error\(s\), 2 warning\(s\), 0 allowed/);
  });

  it('renders a clean text run and JSON', () => {
    const clean = new Runner([]).run(makeTheme());
    expect(new Reporter('text').render('/t', clean)).toBe(
      'Theme: /t\nChecks run: 0\n\n0 error(s), 0 warning(s), 0 allowed by .theme-validation.json\n'
    );
    const json = JSON.parse(new Reporter('json').render('/t', new Runner(checks).run(makeTheme())));
    expect(json.summary).toEqual({ errors: 1, warnings: 2, allowed: 0 });
  });
});

describe('BundledSchemaSource', () => {
  const fs = new MemoryFileSystem({
    '/schemas/theme-wp-7.1.json': '{"type":"object"}',
    '/pinned.json': '{"title":"pinned"}',
  });

  it('maps a schema URL to its bundled file, or uses the override', () => {
    expect(
      new BundledSchemaSource(fs, '/schemas').load('https://schemas.wp.org/wp/7.1/theme.json')
    ).toEqual({ type: 'object' });
    expect(
      new BundledSchemaSource(fs, '/schemas').load('https://schemas.wp.org/wp/6.0/theme.json')
    ).toBeUndefined();
    expect(
      new BundledSchemaSource(fs, '/schemas').load('https://example.com/other.json')
    ).toBeUndefined();
    expect(new BundledSchemaSource(fs, '/schemas', '/pinned.json').load('anything')).toEqual({
      title: 'pinned',
    });
  });
});

describe('Cli', () => {
  const cli = (files: Record<string, string> = cleanFiles()) => {
    const out: string[] = [];
    const err: string[] = [];
    const fs = new MemoryFileSystem({
      ...onDisk(files),
      '/schemas/theme-wp-7.1.json': JSON.stringify(fakeSchema),
    });
    return {
      out,
      err,
      run: (argv: string[]) =>
        new Cli({
          fs,
          stdout: (t) => out.push(t),
          stderr: (t) => err.push(t),
          schemaDir: '/schemas',
        }).run(argv),
    };
  };

  it('exits 0 on the clean theme', () => {
    const c = cli();
    expect(c.run([ROOT])).toBe(0);
    expect(c.out.join('')).toMatch(/0 error\(s\), 0 warning\(s\)/);
  });

  it('exits 1 on errors, and supports --only and --format json', () => {
    const files = cleanFiles();
    files['templates/index.html'] += '<!-- wp:image {"id":3} /-->';
    const c = cli(files);
    expect(c.run([ROOT, '--only', 'markup/database-id', '--format', 'json'])).toBe(1);
    expect(JSON.parse(c.out.join('')).checks).toEqual(['markup/database-id']);
  });

  it('exits 1 when the recorded debt grew', () => {
    const files = cleanFiles();
    files['.theme-validation.json'] = JSON.stringify({
      allow: [{ check: 'a11y/image-alt', file: '*', max: 0 }],
    });
    files['parts/header.html'] += '<!-- wp:image --><img src="/a.jpg"/><!-- /wp:image -->';
    expect(cli(files).run([ROOT, '--only', 'a11y'])).toBe(1);
  });

  it('prints help and the check list', () => {
    const c = cli();
    expect(c.run(['--help'])).toBe(0);
    expect(c.out[0]).toBe(USAGE);
    expect(c.run(['--list'])).toBe(0);
    expect(c.out[1]).toMatch(/^theme-json\/schema\s+error\s+/);
  });

  it.each([
    [[], /Give the theme folder/],
    [[ROOT, '--format'], /--format needs a value/],
    [[ROOT, '--format', 'xml'], /Unknown format "xml"/],
    [[ROOT, '--bogus'], /Unexpected argument "--bogus"/],
    [[ROOT, ROOT], /Unexpected argument/],
    [['/nowhere'], /has no style\.css/],
  ])('exits 2 for %j', (argv, message) => {
    const c = cli();
    expect(c.run(argv as string[])).toBe(2);
    expect(c.err.join('')).toMatch(message);
  });

  it('uses --schema for every file, and exits 2 on a broken config', () => {
    const c = cli();
    expect(
      c.run([ROOT, '--schema', '/schemas/theme-wp-7.1.json', '--only', 'theme-json/schema'])
    ).toBe(0);
    const files = cleanFiles();
    files['.theme-validation.json'] = '{';
    const broken = cli(files);
    expect(broken.run([ROOT])).toBe(2);
    expect(broken.err.join('')).toMatch(/not valid JSON/);
  });
});
