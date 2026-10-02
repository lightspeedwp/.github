/** @jest-environment node */
import fs from 'fs';
import { execFileSync, spawnSync } from 'child_process';

jest.mock('child_process', () => ({ execFileSync: jest.fn(), spawnSync: jest.fn() }));
jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  existsSync: jest.fn(),
  mkdirSync: jest.fn(),
  writeFileSync: jest.fn(),
}));

describe('branch audit CLI with isolated Git, GitHub and filesystem operations', () => {
  let branches;
  let prResult;
  let exit;
  const originalArgv = process.argv;
  const originalSkipMain = process.env.CLEANUP_BRANCHES_SKIP_MAIN;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.useFakeTimers().setSystemTime(new Date('2026-06-30T12:00:00Z'));
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    exit = jest.spyOn(process, 'exit').mockImplementation(() => {});
    delete process.env.CLEANUP_BRANCHES_SKIP_MAIN;
    branches = {
      main: { merged: true },
      'feat/account-login': { merged: true },
      'claude/session-work': { merged: true },
      'fix/unmerged-work': { merged: false },
    };
    prResult = { status: 0, stdout: '' };
    fs.existsSync.mockReturnValue(false);
    spawnSync.mockImplementation((command, args) => {
      if (command === 'gh') return args[0] === '--version' ? { status: 0 } : prResult;
      if (command === 'git') {
        if (args[0] === 'rev-parse') return { status: 0, stdout: '.git\n' };
        if (args[0] === 'remote')
          return { status: 0, stdout: 'https://example.test/owner/repo.git\n' };
        if (args[0] === 'fetch' || args[0] === 'show-ref') return { status: 0 };
      }
      throw new Error(`Unexpected command: ${command} ${args.join(' ')}`);
    });
    execFileSync.mockImplementation((command, args) => {
      if (command !== 'git') throw new Error(`Unexpected command: ${command}`);
      if (args[0] === 'for-each-ref') {
        return args[1] === 'refs/heads'
          ? 'feat/local-work\n'
          : ['origin/HEAD', ...Object.keys(branches).map((branch) => `origin/${branch}`)].join(
              '\n'
            );
      }
      if (args[0] === 'branch' && args[1] === '-r' && args[2] === '--merged') {
        return Object.entries(branches)
          .filter(([, data]) => data.merged)
          .map(([branch]) => `origin/${branch}`)
          .join('\n');
      }
      if (args[0] === 'log') {
        const data = branches[args[3].replace(/^origin\//, '')];
        if (!data) throw new Error('Unknown branch');
        if (args[2] === '--format=%cI') return data.date || '2026-05-01T12:00:00Z';
        if (args[2] === '--format=%ae') return data.author || 'developer@example.test';
        if (args[2] === '--format=%H') return 'abc123';
      }
      if (args[0] === 'merge-base') return 'abc123';
      if (args[0] === 'rev-list') return '0';
      throw new Error(`Unexpected Git arguments: ${args.join(' ')}`);
    });
  });

  afterEach(() => {
    process.argv = originalArgv;
    if (originalSkipMain === undefined) delete process.env.CLEANUP_BRANCHES_SKIP_MAIN;
    else process.env.CLEANUP_BRANCHES_SKIP_MAIN = originalSkipMain;
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  // main currently has no awaits before process.exit; importing executes the
  // entire audit synchronously with the mocked exit, without exporting internals.
  function runCli(args = []) {
    process.argv = [
      process.execPath,
      '/virtual/cleanup-branches.js',
      '--reportDir=/virtual/reports',
      ...args,
    ];
    jest.isolateModules(() => {
      require('../../cleanup-branches.js');
    });
  }

  function jsonReport() {
    expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
    return JSON.parse(fs.writeFileSync.mock.calls[0][1]);
  }

  it('defaults to preview mode, inventories local branches and never deletes refs', () => {
    runCli(['--reportFormat=json', '--deleteLocal']);
    const report = jsonReport();
    expect(exit).toHaveBeenCalledWith(0);
    expect(report.dryRun).toBe(true);
    // Spec 018 FR-020 defers claude/* auto-approval, so a merged claude/*
    // branch is a naming-violation DISCUSS, never a deletion candidate.
    expect(report.deleted.map(({ branch }) => branch)).toEqual(['feat/account-login']);
    expect(report.deleted.every(({ localDeleted }) => localDeleted === false)).toBe(true);
    expect(report.summary.autoApprovedDelete).toBe(0);
    expect(report.preserved).toEqual([
      expect.objectContaining({ branch: 'main', category: 'KEEP' }),
      expect.objectContaining({
        branch: 'claude/session-work',
        category: 'DISCUSS',
        reason: expect.stringContaining('forbidden prefix: claude'),
      }),
      expect.objectContaining({ branch: 'fix/unmerged-work', category: 'DISCUSS' }),
    ]);
    expect(execFileSync).toHaveBeenCalledWith(
      'git',
      ['for-each-ref', 'refs/heads', '--format=%(refname:short)'],
      expect.any(Object)
    );
    const commands = [...spawnSync.mock.calls, ...execFileSync.mock.calls];
    expect(
      commands.some(
        ([, args]) =>
          args[0] === 'push' ||
          args.includes('--delete') ||
          args.includes('-D') ||
          args.includes('-d')
      )
    ).toBe(false);
    expect(fs.mkdirSync).toHaveBeenCalledWith('/virtual/reports', { recursive: true });
  });

  it.each([
    { status: 1, stderr: 'not authenticated' },
    { status: 0, stdout: Array(250).fill('feat/another-work').join('\n') },
  ])('downgrades every deletion candidate when PR verification is unavailable', (response) => {
    prResult = response;
    runCli(['--reportFormat=json']);
    const report = jsonReport();
    expect(report.deleted).toEqual([]);
    expect(report.summary.autoApprovedDelete).toBe(0);
    expect(report.preserved).toContainEqual({
      branch: 'feat/account-login',
      category: 'DISCUSS',
      reason: 'Open-PR verification unavailable; deletion blocked',
    });
    // Already DISCUSS for its name, so it keeps that reason (spec 018 FR-020).
    expect(report.preserved).toContainEqual(
      expect.objectContaining({
        branch: 'claude/session-work',
        category: 'DISCUSS',
        reason: expect.stringContaining('forbidden prefix: claude'),
      })
    );
    expect(report.preserved).toContainEqual(
      expect.objectContaining({ branch: 'main', category: 'KEEP' })
    );
    expect(exit).toHaveBeenCalledWith(0);
  });

  it('protects open PR branches and explicit author or branch exclusions', () => {
    prResult = { status: 0, stdout: 'claude/session-work\n' };
    branches['feat/account-login'].author = 'automation@example.test';
    runCli(['--reportFormat=json', '--preserveAuthors=automation@', '--excludePatterns=^fix/']);
    const report = jsonReport();
    expect(report.deleted).toEqual([]);
    expect(report.preserved).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          branch: 'claude/session-work',
          category: 'KEEP',
          reason: 'Has active pull request',
        }),
        expect.objectContaining({
          branch: 'feat/account-login',
          category: 'KEEP',
          reason: expect.stringContaining('Author matches'),
        }),
        expect.objectContaining({
          branch: 'fix/unmerged-work',
          category: 'KEEP',
          reason: expect.stringContaining('Matches exclusion'),
        }),
      ])
    );
  });

  it('rejects live deletion before invoking Git or writing a report', () => {
    runCli(['--dryRun=false', '--deleteLocal', '--verbose']);
    expect(exit).toHaveBeenCalledWith(1);
    expect(spawnSync).not.toHaveBeenCalled();
    expect(execFileSync).not.toHaveBeenCalled();
    expect(fs.writeFileSync).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('Direct deletion is disabled')
    );
  });

  it('writes an empty Markdown audit with dry-run mode and zero totals', () => {
    branches = {};
    runCli();
    expect(exit).toHaveBeenCalledWith(0);
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      '/virtual/reports/branch-cleanup-2026-06-30T12-00-00.md',
      expect.stringContaining('**Mode:** Dry run (no deletions)'),
      'utf8'
    );
    const markdown = fs.writeFileSync.mock.calls[0][1];
    expect(markdown).toContain('| Branches considered for deletion | 0 |');
    expect(markdown).toContain('| Deletion success rate | 0.00% |');
    expect(markdown).not.toContain('## Deleted Branches');
  });

  it.each(['-1', 'invalid'])('falls back to 30 days for --inactiveDays=%s', (value) => {
    branches = { 'feat/recent-work': { merged: true, date: '2026-06-29T12:00:00Z' } };
    runCli(['--reportFormat=json', `--inactiveDays=${value}`]);
    expect(jsonReport()).toMatchObject({
      inactiveDays: 30,
      deleted: [],
      preserved: [expect.objectContaining({ category: 'KEEP' })],
    });
  });

  it('reports filesystem failures as an unsuccessful audit', () => {
    fs.writeFileSync.mockImplementation(() => {
      throw new Error('disk full');
    });
    runCli(['--reportFormat=json', '--verbose']);
    expect(exit).toHaveBeenCalledWith(1);
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('disk full'));
  });
});
