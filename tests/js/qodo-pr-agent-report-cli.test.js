/**
 * CLI and GitHub artefact collection tests for the Qodo PR-Agent pilot report.
 * The API fixture runs in a child process so the real CLI path is exercised.
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import zlib from 'node:zlib';

const reportScript = path.resolve(__dirname, '../../scripts/metrics/qodo-pr-agent-report.cjs');

function zipRecord(record) {
  const name = 'qodo-pr-agent-run.json';
  const data = zlib.deflateRawSync(Buffer.from(JSON.stringify(record)));
  const header = Buffer.alloc(30);
  header.writeUInt32LE(0x04034b50, 0);
  header.writeUInt16LE(8, 8);
  header.writeUInt32LE(data.length, 18);
  header.writeUInt16LE(Buffer.byteLength(name), 26);
  return Buffer.concat([header, Buffer.from(name), data]);
}

describe('qodo-pr-agent-report CLI', () => {
  let directory;
  let preload;
  let requestLog;

  beforeEach(() => {
    directory = fs.mkdtempSync(path.join(os.tmpdir(), 'qodo-report-test-'));
    preload = path.join(directory, 'mock-fetch.cjs');
    requestLog = path.join(directory, 'requests.json');
    fs.writeFileSync(
      preload,
      `const fs = require('node:fs');
const requests = [];
const responses = process.env.MOCK_RESPONSES
  ? JSON.parse(fs.readFileSync(process.env.MOCK_RESPONSES, 'utf8')) : null;
globalThis.fetch = async (url, options) => {
  requests.push({ url, headers: options.headers });
  fs.writeFileSync(process.env.MOCK_REQUEST_LOG, JSON.stringify(requests));
  if (responses) {
    const response = responses[url];
    if (!response) throw new Error('Unexpected request: ' + url);
    return {
      ok: (response.status || 200) === 200,
      status: response.status || 200,
      json: async () => response.json,
      arrayBuffer: async () => Buffer.from(response.archive, 'base64'),
    };
  }
  if (process.env.MOCK_API_FAILURE === 'true') return { ok: false, status: 503 };
  if (url.includes('/workflows/')) {
    return { ok: true, json: async () => ({ workflow_runs: [{ id: 7 }, { id: 8 }] }) };
  }
  if (url.endsWith('/runs/7/artifacts')) {
    return { ok: true, json: async () => ({ artifacts: [
      { name: 'qodo-pr-agent-run-old', expired: true },
      { name: 'qodo-pr-agent-run-7', expired: false,
        archive_download_url: 'https://example.invalid/archive/7' },
    ] }) };
  }
  if (url.endsWith('/runs/8/artifacts')) {
    return { ok: true, json: async () => ({ artifacts: [] }) };
  }
  if (url === 'https://example.invalid/archive/7') {
    return { ok: true, arrayBuffer: async () => Buffer.from(process.env.MOCK_ZIP_BASE64, 'base64') };
  }
  throw new Error('Unexpected request: ' + url);
};
`
    );
  });

  afterEach(() => fs.rmSync(directory, { recursive: true, force: true }));

  function run(args, env = {}) {
    return spawnSync(process.execPath, ['--require', preload, reportScript, ...args], {
      encoding: 'utf8',
      timeout: 10000,
      env: {
        ...process.env,
        GITHUB_TOKEN: 'test-only-token',
        GITHUB_STEP_SUMMARY: '',
        MOCK_REQUEST_LOG: requestLog,
        MOCK_API_FAILURE: '',
        MOCK_RESPONSES: '',
        MOCK_ZIP_BASE64: zipRecord({
          tool: 'auto',
          outcome: 'success',
          duration_seconds: 60,
          event_at: '2026-10-01T10:00:00Z',
          started_at: '2026-10-01T10:01:00Z',
        }).toString('base64'),
        ...env,
      },
    });
  }

  it('collects an unexpired artefact, skips runs without one, and writes both reports', () => {
    const out = path.join(directory, 'reports');
    const stepSummary = path.join(directory, 'step-summary.md');
    fs.writeFileSync(stepSummary, 'Earlier summary\n');
    const result = run(
      ['--since', '2026-10-01', '--repo', 'team/project', '--workflow', 'pilot.yml', '--out', out],
      { GITHUB_STEP_SUMMARY: stepSummary }
    );

    expect(result.status).toBe(0);
    const [fileName] = fs.readdirSync(out);
    expect(fileName).toMatch(/^pilot-report-\d{4}-\d{2}-\d{2}\.md$/);
    const report = fs.readFileSync(path.join(out, fileName), 'utf8');
    expect(report).toContain('Repository: `team/project`');
    expect(report).toContain('Source: `pilot.yml` run-record artefacts');
    expect(report).toContain('**100.0%** (1 of 1; target 95%)');
    expect(report).toContain('**≈ $0.12**');
    expect(fs.readFileSync(stepSummary, 'utf8')).toBe(`Earlier summary\n${report}`);
    expect(result.stdout).toContain(`Wrote ${path.join(out, fileName)}`);

    const requests = JSON.parse(fs.readFileSync(requestLog, 'utf8'));
    expect(requests.map(({ url }) => url)).toStrictEqual([
      'https://api.github.com/repos/team/project/actions/workflows/pilot.yml/runs?created=%3E%3D2026-10-01&per_page=100&page=1',
      'https://api.github.com/repos/team/project/actions/runs/7/artifacts',
      'https://example.invalid/archive/7',
      'https://api.github.com/repos/team/project/actions/runs/8/artifacts',
    ]);
    for (const request of requests) {
      expect(request.headers.Authorization).toBe('Bearer test-only-token');
      expect(request.headers.Accept).toBe('application/vnd.github+json');
    }
  });

  it('prints a report when no output destination is configured', () => {
    const result = run(['--since', '2026-10-01']);
    expect(result.status).toBe(0);
    expect(result.stdout).toContain('# Qodo PR-Agent pilot report');
    expect(result.stdout).toContain('**100.0%** (1 of 1; target 95%)');
  });

  it('fails without a token before requesting workflow data', () => {
    const result = run(['--since', '2026-10-01'], { GITHUB_TOKEN: '' });
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('GITHUB_TOKEN is required');
    expect(fs.existsSync(requestLog)).toBe(false);
  });

  it('reports API failures without creating a report', () => {
    const out = path.join(directory, 'reports');
    const result = run(['--since', '2026-10-01', '--out', out], {
      MOCK_API_FAILURE: 'true',
    });
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('GitHub API 503');
    expect(fs.existsSync(out)).toBe(false);
  });

  it('writes only the step summary when it is the sole destination', () => {
    const summary = path.join(directory, 'summary.md');
    const result = run(['--since', '2026-10-01'], { GITHUB_STEP_SUMMARY: summary });
    expect(result.status).toBe(0);
    expect(result.stdout).toBe('');
    expect(fs.readFileSync(summary, 'utf8')).toContain('# Qodo PR-Agent pilot report');
  });

  it('rejects invalid arguments before making any API request', () => {
    const result = run(['--since', 'October 1']);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('--since YYYY-MM-DD is required');
    expect(fs.existsSync(requestLog)).toBe(false);
  });

  it.each([
    ['--tokens-per-run', 'abc', 'not a number'],
    ['--tokens-per-run', '-1', 'negative'],
    ['--price-per-mtok', 'free', 'not a number'],
    ['--price-per-mtok', '-0.5', 'negative'],
  ])('rejects %s = %s (%s) rather than reporting a broken figure', (flag, value) => {
    // Number() yields NaN for non-numeric input and ?? keeps it, so an
    // unchecked value reached the report as "≈ $NaN" for the spend estimate
    // that SC-008 depends on.
    const result = run(['--since', '2026-10-01', flag, value]);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain(`${flag} must be a non-negative number`);
    expect(result.stdout).not.toContain('NaN');
    expect(fs.existsSync(requestLog)).toBe(false);
  });

  it('accepts zero and decimal amounts', () => {
    for (const [flag, value] of [
      ['--tokens-per-run', '0'],
      ['--price-per-mtok', '0.25'],
    ]) {
      const result = run(['--since', '2026-10-01', flag, value]);
      expect([flag, result.status]).toStrictEqual([flag, 0]);
    }
  });

  describe('artefact collection boundaries', () => {
    const api = 'https://api.github.com/repos/lightspeedwp/.github';
    const runsUrl = (page) =>
      `${api}/actions/workflows/qodo-pr-agent.yml/runs?created=%3E%3D2026-10-01&per_page=100&page=${page}`;
    const artefactsUrl = (id) => `${api}/actions/runs/${id}/artifacts`;
    const archiveUrl = 'https://example.invalid/archive/selected';
    const selected = {
      name: 'qodo-pr-agent-run-selected',
      expired: false,
      archive_download_url: archiveUrl,
    };

    /** Run the CLI against an exact URL-to-response fixture; unmatched requests fail. */
    function runWithResponses(responses, args = []) {
      const fixture = path.join(directory, 'responses.json');
      fs.writeFileSync(fixture, JSON.stringify(responses));
      return run(['--since', '2026-10-01', ...args], { MOCK_RESPONSES: fixture });
    }

    it('fails loudly when GitHub caps the run list at 1,000 results', () => {
      // The API caps a list query at 1,000 results, so a wide window returns a
      // short page at the cap. Publishing a partial report would understate
      // SC-001 and SC-008 silently, so collection must refuse instead.
      const firstPage = Array.from({ length: 100 }, (_, i) => ({ id: i + 1 }));
      const responses = {
        [runsUrl(1)]: { json: { workflow_runs: firstPage, total_count: 1500 } },
        [runsUrl(2)]: { json: { workflow_runs: [], total_count: 1500 } },
      };
      for (const { id } of firstPage) responses[artefactsUrl(id)] = { json: { artifacts: [] } };

      const result = runWithResponses(responses);
      expect(result.status).not.toBe(0);
      expect(result.stderr + result.stdout).toContain('1,000 results');
      expect(result.stderr + result.stdout).toContain('1500');
    });

    it('proceeds when the reported total matches what was collected', () => {
      const firstPage = Array.from({ length: 100 }, (_, i) => ({ id: i + 1 }));
      const responses = {
        [runsUrl(1)]: { json: { workflow_runs: firstPage, total_count: 101 } },
        [runsUrl(2)]: { json: { workflow_runs: [{ id: 101 }], total_count: 101 } },
        [artefactsUrl(101)]: { json: { artifacts: [selected] } },
        [archiveUrl]: {
          archive: zipRecord({ tool: 'review', outcome: 'success', duration_seconds: 12 }).toString(
            'base64'
          ),
        },
      };
      for (const { id } of firstPage) responses[artefactsUrl(id)] = { json: { artifacts: [] } };

      const result = runWithResponses(responses);
      expect(result.status).toBe(0);
      expect(result.stdout).toContain('| `review` | 1 |');
    });

    it('continues after a full page and includes records from the next page', () => {
      const firstPage = Array.from({ length: 100 }, (_, i) => ({ id: i + 1 }));
      const responses = {
        [runsUrl(1)]: { json: { workflow_runs: firstPage } },
        [runsUrl(2)]: { json: { workflow_runs: [{ id: 101 }] } },
        [artefactsUrl(101)]: { json: { artifacts: [selected] } },
        [archiveUrl]: {
          archive: zipRecord({ tool: 'ask', outcome: 'failure', duration_seconds: 17 }).toString(
            'base64'
          ),
        },
      };
      for (const { id } of firstPage) responses[artefactsUrl(id)] = { json: { artifacts: [] } };

      const result = runWithResponses(responses);
      expect(result.status).toBe(0);
      expect(result.stdout).toContain('| `ask` | 1 |');
      expect(result.stdout).toContain('Median run duration: **17 s**');
      const urls = JSON.parse(fs.readFileSync(requestLog, 'utf8')).map(({ url }) => url);
      expect(urls.filter((url) => url.includes('/workflows/'))).toStrictEqual([
        runsUrl(1),
        runsUrl(2),
      ]);
      expect(urls).toHaveLength(104);
    });

    it('pages through every run past 1,000 and reports the last record', () => {
      // Ten full pages of 100, then a short eleventh page. Under the old
      // ten-page ceiling the loop exited on its counter while page 10 was still
      // exactly full, so page 11 was never requested and run 1,001 was dropped
      // from the totals without any indication. Records are attached to a few
      // runs only, to keep the fixture small; the one that matters is 1,001,
      // which sits on the page the ceiling used to skip.
      const total = 1050;
      const recordRunIds = new Set([1, 500, 1000, 1001, 1050]);
      const responses = {};
      for (let page = 1; page <= 11; page += 1) {
        const runs = Array.from({ length: 100 }, (_, i) => ({
          id: (page - 1) * 100 + i + 1,
        })).filter(({ id }) => id <= total);
        responses[runsUrl(page)] = { json: { workflow_runs: runs } };
        for (const { id } of runs) {
          if (!recordRunIds.has(id)) {
            responses[artefactsUrl(id)] = { json: { artifacts: [] } };
            continue;
          }
          responses[artefactsUrl(id)] = { json: { artifacts: [selected] } };
        }
      }
      responses[archiveUrl] = {
        archive: zipRecord({ tool: 'ask', outcome: 'success', duration_seconds: 42 }).toString(
          'base64'
        ),
      };

      const result = runWithResponses(responses);
      expect(result.status).toBe(0);
      // Five records were attached, so the report must show five runs. If the
      // eleventh page were skipped, only four would be reported.
      expect(result.stdout).toContain('| `ask` | 5 |');
      expect(result.stdout).toContain('**5** of 5 records');
      // The run the old ceiling dropped: id 1,001, first on page 11.
      const artefactRequests = JSON.parse(fs.readFileSync(requestLog, 'utf8')).map(
        ({ url }) => url
      );
      expect(artefactRequests).toContain(artefactsUrl(1001));

      const pageRequests = artefactRequests.filter((url) => url.includes('/workflows/'));
      expect(pageRequests).toStrictEqual([
        runsUrl(1),
        runsUrl(2),
        runsUrl(3),
        runsUrl(4),
        runsUrl(5),
        runsUrl(6),
        runsUrl(7),
        runsUrl(8),
        runsUrl(9),
        runsUrl(10),
        runsUrl(11),
      ]);
    });

    it('stops on the first short page without requesting another', () => {
      // The termination condition is a page shorter than per_page, so a
      // one-page result must not trigger a second request. The fixture throws
      // on any unlisted URL, so a stray page=2 would fail the run outright.
      const responses = {
        [runsUrl(1)]: { json: { workflow_runs: [{ id: 1 }, { id: 2 }] } },
      };
      responses[artefactsUrl(1)] = { json: { artifacts: [selected] } };
      responses[artefactsUrl(2)] = { json: { artifacts: [] } };
      responses[archiveUrl] = {
        archive: zipRecord({ tool: 'ask', outcome: 'success', duration_seconds: 5 }).toString(
          'base64'
        ),
      };

      const result = runWithResponses(responses);
      expect(result.status).toBe(0);
      const requests = JSON.parse(fs.readFileSync(requestLog, 'utf8')).map(({ url }) => url);
      expect(requests.filter((url) => url.includes('/workflows/'))).toStrictEqual([runsUrl(1)]);
    });

    it('downloads only the first matching unexpired artefact', () => {
      const result = runWithResponses({
        [runsUrl(1)]: { json: { workflow_runs: [{ id: 7 }] } },
        [artefactsUrl(7)]: {
          json: {
            artifacts: [
              { name: 'unrelated', expired: false },
              { name: 'qodo-pr-agent-run-expired', expired: true },
              selected,
              { ...selected, archive_download_url: 'https://example.invalid/not-selected' },
            ],
          },
        },
        [archiveUrl]: {
          archive: zipRecord({ tool: 'review', outcome: 'success' }).toString('base64'),
        },
      });
      expect(result.status).toBe(0);
      expect(result.stdout).toContain('**1** of 1 records');
      expect(JSON.parse(fs.readFileSync(requestLog, 'utf8')).map(({ url }) => url)).toStrictEqual([
        runsUrl(1),
        artefactsUrl(7),
        archiveUrl,
      ]);
    });

    it('returns an empty report without requesting artefacts when there are no runs', () => {
      const result = runWithResponses({ [runsUrl(1)]: { json: { workflow_runs: [] } } });
      expect(result.status).toBe(0);
      expect(result.stdout).toContain('**0** of 0 records');
      expect(JSON.parse(fs.readFileSync(requestLog, 'utf8'))).toHaveLength(1);
    });

    it('skips an archive that contains no run record', () => {
      const result = runWithResponses({
        [runsUrl(1)]: { json: { workflow_runs: [{ id: 7 }] } },
        [artefactsUrl(7)]: { json: { artifacts: [selected] } },
        // Empty ZIP end-of-central-directory record.
        [archiveUrl]: {
          archive: Buffer.from('504b0506000000000000000000000000000000000000', 'hex').toString(
            'base64'
          ),
        },
      });
      expect(result.status).toBe(0);
      expect(result.stdout).toContain('**0** of 0 records');
    });

    it.each(['artefact listing', 'archive download'])(
      'propagates a failed %s without writing a partial report',
      (stage) => {
        const out = path.join(directory, 'reports');
        const failureUrl = stage === 'artefact listing' ? artefactsUrl(7) : archiveUrl;
        const result = runWithResponses(
          {
            [runsUrl(1)]: { json: { workflow_runs: [{ id: 7 }] } },
            [artefactsUrl(7)]: { json: { artifacts: [selected] } },
            [failureUrl]: { status: 403 },
          },
          ['--out', out]
        );
        expect(result.status).toBe(1);
        expect(result.stderr).toContain(`GitHub API 403 for ${failureUrl}`);
        expect(fs.existsSync(out)).toBe(false);
      }
    );
  });
});
