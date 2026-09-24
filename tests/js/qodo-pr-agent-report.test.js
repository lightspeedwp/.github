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

function zipOf(name, content) {
  const data = zlib.deflateRawSync(Buffer.from(content));
  const header = Buffer.alloc(30);
  header.writeUInt32LE(0x04034b50, 0);
  header.writeUInt16LE(8, 8);
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
});

describe('qodo-pr-agent-report helpers', () => {
  it('reads a deflated file from a zip archive', () => {
    const zip = zipOf('qodo-pr-agent-run.json', '{"tool":"auto"}');
    expect(readFromZip(zip, 'qodo-pr-agent-run.json')).toBe('{"tool":"auto"}');
    expect(readFromZip(zip, 'missing.json')).toBeNull();
  });

  it('requires --since in YYYY-MM-DD form', () => {
    expect(() => parseArgs([])).toThrow(/--since/);
    expect(parseArgs(['--since', '2026-10-01']).since).toBe('2026-10-01');
  });
});
