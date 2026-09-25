/**
 * Unit tests for scripts/metrics/qodo-pr-agent-report.cjs (spec 017, FR-021, SC-001).
 */
import zlib from 'node:zlib';

const {
  aggregate,
  renderReport,
  readFromZip,
  parseArgs,
} = require('../../scripts/metrics/qodo-pr-agent-report.cjs');

const records = [
  {
    tool: 'auto',
    outcome: 'success',
    duration_seconds: 120,
    event_at: '2026-10-01T10:00:00Z',
    started_at: '2026-10-01T10:01:00Z',
  },
  {
    tool: 'auto',
    outcome: 'success',
    duration_seconds: 300,
    event_at: '2026-10-01T11:00:00Z',
    started_at: '2026-10-01T11:08:00Z',
  },
  { tool: 'ask', outcome: 'failure', duration_seconds: 60 },
  { tool: 'auto', outcome: 'skipped:draft', duration_seconds: 0 },
  { tool: 'none', outcome: 'skipped:command-not-allowed', duration_seconds: 0 },
];

/**
 * Build a local-header-only zip entry for archive extraction tests.
 * @param {string} name - Entry name.
 * @param {string} content - Uncompressed entry contents.
 * @param {number} [method=8] - Compression method: deflate (8) or stored (0).
 * @returns {Buffer} A zip archive containing the entry.
 */
function zipOf(name, content, method = 8) {
  const data = method === 8 ? zlib.deflateRawSync(Buffer.from(content)) : Buffer.from(content);
  const header = Buffer.alloc(30);
  header.writeUInt32LE(0x04034b50, 0);
  header.writeUInt16LE(method, 8);
  header.writeUInt32LE(data.length, 18);
  header.writeUInt16LE(Buffer.byteLength(name), 26);
  return Buffer.concat([header, Buffer.from(name), data]);
}

describe('qodo-pr-agent-report aggregate', () => {
  const summary = aggregate(records, { tokensPerRun: 10000, pricePerMtok: 5 });

  it('counts records per tool and outcome', () => {
    expect(summary.total).toBe(5);
    expect(summary.byTool).toStrictEqual({ auto: 3, ask: 1, none: 1 });
    expect(summary.outcomes['skipped:draft']).toBe(1);
    expect(summary.executed).toBe(3);
  });

  it('computes the median duration of executed runs only', () => {
    expect(summary.medianDurationSeconds).toBe(120);
  });

  it('measures SC-001 from the PR event to the end of the run', () => {
    // Run 1 ends 3 min after the event (within); run 2 ends 13 min after (outside).
    expect(summary.sc001).toStrictEqual({ automatic: 2, withinLimit: 1, rate: 0.5 });
  });

  it('estimates spend from executed runs', () => {
    expect(summary.estimatedSpendUsd).toBeCloseTo((3 * 10000 * 5) / 1_000_000);
  });

  it('renders a Markdown report', () => {
    const report = renderReport(summary, {
      repo: 'lightspeedwp/.github',
      workflow: 'qodo-pr-agent.yml',
      since: '2026-10-01',
      generated: '2026-10-15',
      tokensPerRun: 10000,
      pricePerMtok: 5,
    });
    expect(report).toContain('# Qodo PR-Agent pilot report — 2026-10-15');
    expect(report).toContain('| `auto` | 3 |');
    expect(report).toContain('**50.0%**');
    expect(report).toContain('ANTHROPIC_API_KEY_QODO_PR_AGENT');
  });

  it('reports no activity without dividing by zero or charging for skipped runs', () => {
    const empty = aggregate([]);
    expect(empty).toStrictEqual({
      total: 0,
      executed: 0,
      byTool: {},
      outcomes: {},
      medianDurationSeconds: null,
      sc001: { automatic: 0, withinLimit: 0, rate: null },
      estimatedSpendUsd: 0,
    });
    const report = renderReport(empty, {
      repo: 'lightspeedwp/.github',
      workflow: 'qodo-pr-agent.yml',
      since: '2026-09-01',
      generated: '2026-09-15',
      tokensPerRun: 20000,
      pricePerMtok: 6,
    });
    expect(report).toContain('Median run duration: **n/a s**');
    expect(report).toContain('automatic output within 10 minutes of the PR event: **n/a**');
    expect(report).toContain('**≈ $0.00**');
  });

  it('takes the mean of the middle two durations without mutating its input', () => {
    const input = [
      { tool: 'ask', outcome: 'failure', duration_seconds: 9 },
      { tool: 'review', outcome: 'success', duration_seconds: 1 },
      { tool: 'auto', outcome: 'skipped:draft', duration_seconds: 1000 },
      { tool: 'improve', outcome: 'success', duration_seconds: 5 },
      { tool: 'describe', outcome: 'failure', duration_seconds: 3 },
    ];
    expect(aggregate(input).medianDurationSeconds).toBe(4);
    expect(input.map((record) => record.duration_seconds)).toStrictEqual([9, 1, 1000, 5, 3]);
  });

  it('includes completion exactly at ten minutes but excludes a second later', () => {
    const timestamp = '2026-09-01T12:00:00Z';
    const automatic = (duration_seconds) => ({
      tool: 'auto',
      outcome: 'success',
      event_at: timestamp,
      started_at: '2026-09-01T12:01:00Z',
      duration_seconds,
    });
    expect(
      aggregate([
        automatic(540),
        automatic(541),
        { ...automatic(1), outcome: 'failure' },
        { ...automatic(1), tool: 'ask' },
        { ...automatic(1), started_at: undefined },
      ]).sc001
      // Failed and untimed eligible attempts count in the denominator only.
    ).toStrictEqual({ automatic: 4, withinLimit: 1, rate: 0.25 });
  });

  it('counts missing tool and outcome as unknown without treating them as executed', () => {
    const summary = aggregate([{}, { tool: 'auto', outcome: 'skipped:no-credential' }]);
    expect(summary.byTool).toStrictEqual({ unknown: 1, auto: 1 });
    expect(summary.outcomes).toStrictEqual({ unknown: 1, 'skipped:no-credential': 1 });
    expect(summary.executed).toBe(0);
    expect(summary.estimatedSpendUsd).toBe(0);
  });
});

describe('qodo-pr-agent-report SC-001 eligibility', () => {
  it('counts failed and no-credential automatic attempts but not ineligible skips', () => {
    const timely = {
      tool: 'auto',
      outcome: 'success',
      event_at: '2026-10-01T10:00:00Z',
      started_at: '2026-10-01T10:01:00Z',
      duration_seconds: 60,
    };
    const sc001 = aggregate([
      timely,
      { tool: 'auto', outcome: 'failure' },
      { tool: 'auto', outcome: 'skipped:no-credential' },
      { tool: 'auto', outcome: 'skipped:draft' },
      { tool: 'auto', outcome: 'skipped:kill-switch' },
      { tool: 'auto', outcome: 'skipped:excluded-author' },
    ]).sc001;
    expect(sc001).toStrictEqual({ automatic: 3, withinLimit: 1, rate: 1 / 3 });
  });
});

// A streamed archive (as written by actions/upload-artifact): general-purpose
// flag bit 3 set, sizes zero in the local header and recorded in a data
// descriptor and the central directory. Generated with Python's zipfile on a
// non-seekable stream.
const STREAMED_ZIP_BASE64 =
  'UEsDBBQACAAIAAAAIQAAAAAAAAAAAAAAAAAWAAAAcW9kby1wci1hZ2VudC1ydW4uanNvbqtWKsnPz1GyUkosLclX0lHKLy1Jzs9NBQoUlyYnpxYXK9UCAFBLBwhBcbWLJAAAACMAAABQSwMEFAAIAAgAAAAhAAAAAAAAAAAAAAAAABoAAABxb2RvLXByLWFnZW50LW1ldHJpY3MuanNvbqtWylWyMqwFAFBLBwiuQeuTCQAAAAcAAABQSwECFAMUAAgACAAAACEAQXG1iyQAAAAjAAAAFgAAAAAAAAAAAAAAgAEAAAAAcW9kby1wci1hZ2VudC1ydW4uanNvblBLAQIUAxQACAAIAAAAIQCuQeuTCQAAAAcAAAAaAAAAAAAAAAAAAACAAWgAAABxb2RvLXByLWFnZW50LW1ldHJpY3MuanNvblBLBQYAAAAAAgACAIwAAAC5AAAAAAA=';

describe('qodo-pr-agent-report helpers', () => {
  it('reads entries from a streamed archive with data descriptors', () => {
    const zip = Buffer.from(STREAMED_ZIP_BASE64, 'base64');
    expect(zip.readUInt32LE(18)).toBe(0); // local header carries no size
    expect(readFromZip(zip, 'qodo-pr-agent-run.json')).toBe('{"tool":"auto","outcome":"success"}');
    expect(readFromZip(zip, 'qodo-pr-agent-metrics.json')).toBe('{"m":1}');
    expect(readFromZip(zip, 'missing.json')).toBeNull();
  });

  it('reads a deflated file from a zip archive', () => {
    const zip = zipOf('qodo-pr-agent-run.json', '{"tool":"auto"}');
    expect(readFromZip(zip, 'qodo-pr-agent-run.json')).toBe('{"tool":"auto"}');
    expect(readFromZip(zip, 'missing.json')).toBeNull();
  });

  it('reads a stored entry after another entry, and returns null for an empty archive', () => {
    const archive = Buffer.concat([
      zipOf('other.json', '{}'),
      zipOf('qodo-pr-agent-run.json', '{"outcome":"success"}', 0),
    ]);
    expect(readFromZip(archive, 'qodo-pr-agent-run.json')).toBe('{"outcome":"success"}');
    expect(readFromZip(Buffer.alloc(0), 'qodo-pr-agent-run.json')).toBeNull();
  });

  it('requires --since in YYYY-MM-DD form', () => {
    expect(() => parseArgs([])).toThrow(/--since/);
    expect(parseArgs(['--since', '2026-10-01']).since).toBe('2026-10-01');
  });

  it('parses optional overrides and rejects unknown flags', () => {
    expect(parseArgs(['--since', '2026-09-01'])).toStrictEqual({
      since: '2026-09-01',
      repo: 'lightspeedwp/.github',
      workflow: 'qodo-pr-agent.yml',
      tokensPerRun: 20000,
      pricePerMtok: 6,
    });
    expect(
      parseArgs([
        '--since',
        '2026-09-01',
        '--out',
        'reports',
        '--repo',
        'other/repo',
        '--workflow',
        'custom.yml',
        '--tokens-per-run',
        '4000',
        '--price-per-mtok',
        '2.5',
      ])
    ).toMatchObject({
      out: 'reports',
      repo: 'other/repo',
      workflow: 'custom.yml',
      tokensPerRun: 4000,
      pricePerMtok: 2.5,
    });
    expect(() => parseArgs(['--since', '2026-09-01', '--unknown', 'value'])).toThrow(
      'Unknown argument: --unknown'
    );
  });
});
