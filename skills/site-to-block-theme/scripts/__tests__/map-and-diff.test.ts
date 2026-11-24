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
    expect(md).toContain('`var:preset\\|spacing\\|20` (-1px)');
    expect(md).toContain('`var(--wp--custom--color--text--default)`');
  });

  it('reports shorthand parts and a fully matched page', () => {
    const shorthand = mapper.map(
      measureFile([measurement({ name: 'box', styles: { padding: '10px 0px 13px' } })])
    );
    expect(TokenMapper.markdown(shorthand)).toContain(
      '`var:preset\\|spacing\\|10` / 0 / `var:preset\\|spacing\\|10` (-3px)'
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

  it('marks an incomplete capture and exits 1', () => {
    const failed = measureFile([], { failures: [{ width: 390, error: 'timeout' }] });
    const io = memoryDeps({ ...files, 'failed.json': JSON.stringify(failed) });
    expect(runMapCli(['failed.json', '--theme-json', 'theme.json'], io.deps)).toBe(1);
    expect(io.written['tokens.md']).toContain(
      '**Incomplete capture:** measuring failed at 390px (timeout)'
    );
    expect(io.err.join('')).toContain('incomplete capture');
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
    expect(diff.find((d) => d.state === 'hover')!.local).toBe('#0a0a0a');
  });

  it('compares the effective hover value on each side, not the sparse changes', () => {
    const liveSide = measureFile([measurement({ name: 'link', styles: { 'margin-top': '10px' } })]);
    const localSide = measureFile([
      measurement({ name: 'link', styles: { 'margin-top': '20px' } }),
      measurement({ name: 'link', state: 'hover', styles: { 'margin-top': '10px' } }),
    ]);
    const diff = new MeasurementDiff().compare(liveSide, localSide);
    expect(diff.map((d) => `${d.state}|${d.property}`)).toEqual(['default|margin-top']);
    const onlyHoverMissing = new MeasurementDiff().compare(
      liveSide,
      measureFile([measurement({ name: 'other' })])
    );
    expect(onlyHoverMissing.map((d) => d.kind)).toEqual(['missing-local', 'missing-live']);
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

describe('MeasurementDiff.gaps', () => {
  it('reports failed and one-sided widths', () => {
    const a = measureFile(
      [measurement({ name: 'x', width: 390 }), measurement({ name: 'x', width: 1440 })],
      {
        widths: [390, 768, 1440],
        failures: [{ width: 768, error: 'timeout' }],
      }
    );
    const b = measureFile([measurement({ name: 'x', width: 390 })], { widths: [390, 1440] });
    expect(MeasurementDiff.gaps(a, b)).toEqual([
      'live failed at 768px (timeout)',
      '1440px measured on live only',
    ]);
    expect(
      MeasurementDiff.gaps(b, measureFile([], { failures: [{ width: 390, error: 'x' }] }))
    ).toEqual([
      'local failed at 390px (x)',
      '390px measured on live only',
      'no measurements on local',
    ]);
    expect(MeasurementDiff.gaps(measureFile([]), b)).toContain('no measurements on live');
  });
});

describe('runDiffCli', () => {
  const files = {
    'live.json': JSON.stringify(live),
    'local.json': JSON.stringify(measureFile([], { side: 'local' })),
    'local-full.json': JSON.stringify(
      measureFile([measurement({ name: 'hero heading' })], { side: 'local' })
    ),
  };

  it('writes the diff and report', () => {
    const io = memoryDeps(files);
    expect(
      runDiffCli(
        ['live.json', 'local-full.json', '--tolerance', '2', '--out', 'd.json', '--report', 'd.md'],
        io.deps
      )
    ).toBe(0);
    const written = JSON.parse(io.written['d.json']);
    expect(written.gaps).toEqual([]);
    expect(written.differences.map((d: { kind: string }) => d.kind)).toContain('value');
    expect(io.written['d.md']).toContain('# Differences from live');
  });

  it('writes an incomplete report and exits 1 when a capture is incomplete', () => {
    const io = memoryDeps(files);
    expect(runDiffCli(['live.json', 'local.json'], io.deps)).toBe(1);
    expect(io.written['diff.md']).toContain('**Incomplete comparison:**');
    expect(io.written['diff.md']).toContain('no measurements on local');
    expect(MeasurementDiff.markdown(live, live, [], ['live failed at 390px (x)'])).toContain(
      'No differences in what was compared.'
    );
    expect(io.err.join('')).toContain('incomplete comparison');
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
