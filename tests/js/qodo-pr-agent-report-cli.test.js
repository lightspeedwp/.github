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

    it('stops after ten full pages even if more runs may exist', () => {
      const responses = {};
      for (let page = 1; page <= 10; page += 1) {
        const runs = Array.from({ length: 100 }, (_, i) => ({ id: (page - 1) * 100 + i + 1 }));
        responses[runsUrl(page)] = { json: { workflow_runs: runs } };
        for (const { id } of runs) responses[artefactsUrl(id)] = { json: { artifacts: [] } };
      }
      const result = runWithResponses(responses);
      expect(result.status).toBe(0);
      expect(result.stdout).toContain('**0** of 0 records');
      const requests = JSON.parse(fs.readFileSync(requestLog, 'utf8'));
      expect(requests.filter(({ url }) => url.includes('/workflows/'))).toHaveLength(10);
      expect(requests).toHaveLength(1010);
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
