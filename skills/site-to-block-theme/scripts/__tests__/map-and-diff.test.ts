import { MeasurementDiff, runDiffCli } from '../diff-measurements';
import { runMapCli, TokenMapper } from '../map-to-tokens';
import { ThemeTokens } from '../lib/theme-tokens';
import { TokenMatcher } from '../lib/token-matcher';
import { measureFile, measurement, memoryDeps, themeJson } from './fixtures';

const live = measureFile([
  measurement({
    name: 'hero heading',
    styles: {
      'font-size': '32px',
      'font-family': 'Moret, serif',
      color: 'rgb(10, 10, 10)',
      'padding-top': '21px',
      'line-height': '35.2px',
      display: 'block',
    },
  }),
  measurement({ name: 'hero heading', state: 'hover', styles: { color: 'rgb(0, 200, 0)' } }),
  measurement({ name: 'gone', found: false, styles: undefined }),
]);

describe('TokenMapper', () => {
  const mapper = new TokenMapper(new TokenMatcher(ThemeTokens.fromThemeJson([themeJson])));

  it('maps each measured value and counts the results', () => {
    const mapping = mapper.map(live);
    expect(mapping.counts).toEqual({ exact: 4, near: 1, none: 1, skip: 0 });
    const hover = mapping.rows.find((r) => r.state === 'hover')!;
    expect(hover.match.status).toBe('none');
    const lineHeight = mapping.rows.find((r) => r.property === 'line-height')!;
    expect(lineHeight.match.tokens[0].cssVar).toBe('--wp--custom--line-height--tight');
  });

  it('writes a report with the open decisions first', () => {
    const md = TokenMapper.markdown(mapper.map(live));
    expect(md.indexOf('## Needs a decision')).toBeLessThan(md.indexOf('## Exact'));
    expect(md).toContain('`var:preset|spacing|20` (-1px)');
    expect(md).toContain('`var(--wp--custom--color--text--default)`');
  });

  it('reports shorthand parts and a fully matched page', () => {
    const shorthand = mapper.map(
      measureFile([measurement({ name: 'box', styles: { padding: '10px 0px 13px' } })])
    );
    expect(TokenMapper.markdown(shorthand)).toContain(
      '`var:preset|spacing|10` / 0 / `var:preset|spacing|10` (-3px)'
    );
    const clean = mapper.map(
      measureFile([measurement({ name: 'box', styles: { 'padding-top': '10px' } })])
    );
    expect(TokenMapper.markdown(clean)).toContain('Every value has an exact token.');
    const empty = mapper.map(measureFile([]));
    expect(TokenMapper.markdown(empty)).toContain('None.');
  });
});

describe('runMapCli', () => {
  const files = {
    'live.json': JSON.stringify(live),
    'theme.json': JSON.stringify(themeJson),
    'empty.json': '{}',
  };

  it('writes the mapping and the report', () => {
    const io = memoryDeps(files);
    expect(
      runMapCli(
        ['live.json', '--theme-json', 'theme.json', '--out', 'm.json', '--report', 'm.md'],
        io.deps
      )
    ).toBe(0);
    expect(JSON.parse(io.written['m.json']).counts.exact).toBe(4);
    expect(io.written['m.md']).toContain('# Token mapping');
    expect(io.out.join('')).toContain('4 exact, 1 near, 1 with no token');
  });

  it('prints help', () => {
    const io = memoryDeps();
    expect(runMapCli(['--help'], io.deps)).toBe(0);
    expect(io.out.join('')).toContain('Usage');
  });

  it.each([
    [[], 'Give the live measurements file.'],
    [['live.json'], '--theme-json is required.'],
    [['live.json', 'other.json'], 'Unexpected argument other.json.'],
    [['live.json', '--theme-json'], '--theme-json needs a value.'],
    [['live.json', '--nope', 'x'], 'Unknown argument --nope.'],
    [['live.json', '--theme-json', 'empty.json'], 'No tokens found'],
    [['live.json', '--theme-json', 'missing.json'], 'ENOENT'],
  ])('fails clearly for %j', (argv, message) => {
    const io = memoryDeps(files);
    expect(runMapCli(argv as string[], io.deps)).toBe(1);
    expect(io.err.join('')).toContain(message);
  });
});

describe('MeasurementDiff', () => {
  const local = measureFile(
    [
      measurement({
        name: 'hero heading',
        rect: { width: 300, height: 60 },
        styles: {
          'font-size': '32.4px',
          'font-family': '"moret", serif',
          color: '#0a0a0a',
          'padding-top': '24px',
          'line-height': '35.2px',
          display: 'flex',
        },
      }),
      measurement({ name: 'gone', found: true }),
      measurement({ name: 'new', found: true }),
    ],
    { side: 'local', url: 'http://localhost:8881/' }
  );

  it('lists value, state, box and missing differences', () => {
    const diff = new MeasurementDiff(1).compare(live, local);
    const summary = diff.map((d) => `${d.name}|${d.state}|${d.kind}|${d.property ?? ''}`);
    expect(summary).toEqual([
      'gone|default|missing-live|',
      'hero heading|default|value|box height',
      'hero heading|default|value|padding-top',
      'hero heading|default|value|display',
      'hero heading|hover|value|color',
      'new|default|missing-live|',
    ]);
    expect(diff.find((d) => d.state === 'hover')!.local).toBe('(unchanged)');
  });

  it('flags elements missing on local', () => {
    const diff = new MeasurementDiff().compare(
      local,
      measureFile([measurement({ name: 'gone', found: false })])
    );
    expect(diff.filter((d) => d.kind === 'missing-local').map((d) => d.name)).toEqual([
      'gone',
      'hero heading',
      'new',
    ]);
  });

  it('compares values by kind', () => {
    const diff = new MeasurementDiff(1);
    expect(diff.same('color', 'rgb(0, 0, 0)', '#000')).toBe(true);
    expect(diff.same('margin', '10px 20px', '10.5px 20px')).toBe(true);
    expect(diff.same('margin', '10px 20px', '10px')).toBe(false);
    expect(diff.same('text-transform', 'UPPERCASE', 'uppercase')).toBe(true);
    expect(diff.same('display', 'block', 'flex')).toBe(false);
  });

  it('writes the differences table', () => {
    const md = MeasurementDiff.markdown(live, local, new MeasurementDiff().compare(live, local));
    expect(md).toContain('| Element | Width | State | Property | Live | Local |');
    expect(md).toContain('missing on live');
    expect(MeasurementDiff.markdown(live, live, [])).toContain('No differences found');
    const missingLocal = MeasurementDiff.markdown(live, local, [
      { name: 'x', width: 390, state: 'default', kind: 'missing-local' },
    ]);
    expect(missingLocal).toContain('missing on local');
  });
});

describe('runDiffCli', () => {
  const files = {
    'live.json': JSON.stringify(live),
    'local.json': JSON.stringify(measureFile([], { side: 'local' })),
  };

  it('writes the diff and report', () => {
    const io = memoryDeps(files);
    expect(
      runDiffCli(
        ['live.json', 'local.json', '--tolerance', '2', '--out', 'd.json', '--report', 'd.md'],
        io.deps
      )
    ).toBe(0);
    expect(JSON.parse(io.written['d.json'])[0].kind).toBe('missing-local');
    expect(io.written['d.md']).toContain('# Differences from live');
  });

  it('prints help', () => {
    const io = memoryDeps();
    expect(runDiffCli(['-h'], io.deps)).toBe(0);
  });

  it.each([
    [['live.json'], 'Give the live and the local'],
    [['live.json', 'local.json', '--nope', '1'], 'Unknown argument --nope.'],
    [['live.json', 'local.json', '--out'], '--out needs a value.'],
    [['live.json', 'local.json', '--tolerance', '-1'], '--tolerance must be'],
  ])('fails clearly for %j', (argv, message) => {
    const io = memoryDeps(files);
    expect(runDiffCli(argv as string[], io.deps)).toBe(1);
    expect(io.err.join('')).toContain(message);
  });
});
