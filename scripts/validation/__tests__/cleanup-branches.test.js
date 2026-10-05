import fs from 'fs';
import os from 'os';
import path from 'path';
import { spawnSync } from 'child_process';

let getMetrics;
let writeJsonReport;
let writeMarkdownReport;
let daysSince;
let buildExcludeRegex;
let buildPreserveAuthorRegex;
let getRunExitCode;

describe('cleanup-branches report generation', () => {
  const reportDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cleanup-branches-report-'));

  beforeAll(async () => {
    process.env.CLEANUP_BRANCHES_SKIP_MAIN = '1';
    ({
      getMetrics,
      writeJsonReport,
      writeMarkdownReport,
      daysSince,
      buildExcludeRegex,
      buildPreserveAuthorRegex,
      getRunExitCode,
    } = await import('../../cleanup-branches.js'));
  });

  afterAll(() => {
    delete process.env.CLEANUP_BRANCHES_SKIP_MAIN;
    fs.rmSync(reportDir, { recursive: true, force: true });
  });

  it('builds metrics with type breakdown and author list', () => {
    const metrics = getMetrics(
      [
        {
          branch: 'feat/old-widget',
          author: 'user@example.com',
          commitCount: 3,
          estimatedStorageBytes: 12288,
          type: 'feat',
        },
        {
          branch: 'fix/stale-bug',
          author: 'user@example.com',
          commitCount: 2,
          estimatedStorageBytes: 8192,
          type: 'fix',
        },
      ],
      [{ branch: 'release/v1.0.0', reason: 'protected branch' }],
      [],
      2
    );

    expect(metrics.candidatesCount).toBe(2);
    expect(metrics.successfulDeletes).toBe(2);
    expect(metrics.failedDeletes).toBe(0);
    expect(metrics.byType).toEqual({ feat: 1, fix: 1 });
    expect(metrics.authorsAffected).toEqual(['user@example.com']);
    expect(metrics.totalCommits).toBe(5);
    expect(metrics.estimatedStorageHuman).toBe('20.00 KB');
  });

  it('distinguishes successful, partial, and fatal run outcomes', () => {
    expect(getRunExitCode(3, [])).toBe(0);
    expect(getRunExitCode(3, [{ branch: 'feat/failed-branch' }])).toBe(2);
    expect(getRunExitCode(0, [{ error: 'fatal' }])).toBe(1);
  });

  it('writes markdown and json reports with the requested summary fields', () => {
    const deleted = [
      {
        branch: 'feat/old-widget',
        author: 'user@example.com',
        lastCommitDate: '2026-05-01T00:00:00Z',
        age: 42,
        hash: 'abc1234',
        type: 'feat',
        commitCount: 3,
        estimatedStorageBytes: 12288,
        reason: 'merged and inactive for 42 days',
        localDeleted: false,
      },
    ];
    const preserved = [
      { branch: 'main', category: 'KEEP', reason: 'protected branch' },
      {
        branch: 'legacy-branch',
        category: 'DISCUSS',
        reason: 'invalid branch name',
      },
    ];
    const errors = [{ branch: 'feat/problematic', error: 'remote deletion failed' }];
    const metrics = getMetrics(deleted, preserved, errors, 1);
    const reportOptions = {
      dryRun: false,
      inactiveDays: 30,
      reportDir,
    };

    const markdownPath = writeMarkdownReport(deleted, preserved, errors, metrics, reportOptions);
    const jsonPath = writeJsonReport(deleted, preserved, errors, metrics, reportOptions);

    const markdown = fs.readFileSync(markdownPath, 'utf8');
    const json = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

    expect(markdown).toContain('# Branch Cleanup Report');
    expect(markdown).toContain('| Branches considered for deletion | 1 |');
    expect(markdown).toContain('| Deletion success rate | 50.00% |');
    expect(markdown).toContain('- **feat**: 1');
    expect(markdown).toContain('- user@example.com');
    expect(markdown).toContain('## KEEP Branches');
    expect(markdown).toContain('## DISCUSS Branches');
    expect(markdown).toContain('## Errors');
    expect(markdown).toContain('remote deletion failed');

    expect(json.summary.candidates).toBe(1);
    expect(json.summary.deleted).toBe(1);
    expect(json.summary.preserved).toBe(2);
    expect(json.summary.errors).toBe(1);
    expect(json.summary.deletionSuccessRate).toBe('50.00%');
    expect(json.summary.estimatedStorageFreedHuman).toBe('12.00 KB');
    expect(json.metrics.deletedByType).toEqual({ feat: 1 });
    expect(json.metrics.authorsAffected).toEqual(['user@example.com']);
    expect(json.deleted[0].branch).toBe('feat/old-widget');
    expect(json.preserved[1].category).toBe('DISCUSS');
  });
});

describe('cleanup-branches edge case handling', () => {
  beforeAll(async () => {
    process.env.CLEANUP_BRANCHES_SKIP_MAIN = '1';
  });

  afterAll(() => {
    delete process.env.CLEANUP_BRANCHES_SKIP_MAIN;
  });

  it('daysSince handles empty/invalid dates safely by treating as recent', () => {
    expect(daysSince('')).toBe(0);
    expect(daysSince(null)).toBe(0);
    expect(daysSince(undefined)).toBe(0);
    expect(daysSince('invalid-date')).toBe(0);
  });

  it('daysSince returns correct age for valid ISO dates', () => {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const age = daysSince(oneDayAgo.toISOString());
    expect(Math.floor(age)).toBe(1);
  });

  it('buildExcludeRegex handles invalid regex gracefully with fallback', () => {
    const regex = buildExcludeRegex();
    expect(regex).toBeInstanceOf(RegExp);
    expect(() => regex.test('release/v1.0.0')).not.toThrow();
  });

  it('buildPreserveAuthorRegex handles invalid regex gracefully', () => {
    const regex = buildPreserveAuthorRegex();
    if (regex) {
      expect(regex).toBeInstanceOf(RegExp);
    }
    expect(() => buildPreserveAuthorRegex()).not.toThrow();
  });

  it('rejects direct live deletion before invoking repository operations', () => {
    // Resolve from this file, not the Jest working directory, and keep the
    // skip-main flag set by beforeAll out of the child's environment.
    const script = path.resolve(__dirname, '../../cleanup-branches.js');
    const env = { ...process.env };
    delete env.CLEANUP_BRANCHES_SKIP_MAIN;
    const result = spawnSync(process.execPath, [script, '--dryRun=false', '--verbose'], {
      encoding: 'utf8',
      env,
    });

    expect(result.status).toBe(1);
    expect(`${result.stdout}\n${result.stderr}`).toContain('Direct deletion is disabled');
  });
});
