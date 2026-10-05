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

  it('fails with exit code 1 and writes no report when the remote branch listing fails', () => {
    const inventory = execFileSync.getMockImplementation();
    execFileSync.mockImplementation((command, args, options) => {
      if (args[0] === 'for-each-ref' && args[1] === 'refs/remotes/origin') {
        throw Object.assign(new Error('git failed'), { stderr: 'fatal: bad ref store' });
      }
      return inventory(command, args, options);
    });
    runCli(['--reportFormat=json', '--verbose']);
    expect(exit).toHaveBeenCalledWith(1);
    expect(exit).not.toHaveBeenCalledWith(0);
    expect(fs.writeFileSync).not.toHaveBeenCalled();
    const logged = console.error.mock.calls.flat().map(String).join('\n');
    expect(logged).toContain('Repository access failed');
  });

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

  it.each([
    ['rev-parse', { status: 128 }, 'Not a git repository'],
    ['remote', { status: 1, stdout: '' }, 'No "origin" remote found'],
    ['remote', { status: 0, stdout: '  \n' }, 'No "origin" remote found'],
  ])('stops before fetching when %s preflight fails', (operation, response, message) => {
    const spawn = spawnSync.getMockImplementation();
    spawnSync.mockImplementation((command, args) =>
      command === 'git' && args[0] === operation ? response : spawn(command, args)
    );

    runCli(['--verbose']);

    expect(exit).toHaveBeenCalledWith(1);
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining(message));
    expect(spawnSync.mock.calls.some(([, args]) => args[0] === 'fetch')).toBe(false);
    expect(execFileSync).not.toHaveBeenCalled();
    expect(fs.writeFileSync).not.toHaveBeenCalled();
  });

  it('stops after a failed fetch before classifying stale remote refs', () => {
    const spawn = spawnSync.getMockImplementation();
    spawnSync.mockImplementation((command, args) =>
      args[0] === 'fetch' ? { status: 1, stderr: 'network unavailable' } : spawn(command, args)
    );
    // Model process termination so the mock cannot continue past the fatal exit.
    exit.mockImplementationOnce(() => {
      throw new Error('simulated process exit');
    });

    runCli(['--verbose']);

    expect(exit).toHaveBeenNthCalledWith(1, 1);
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('network unavailable'));
    expect(execFileSync).not.toHaveBeenCalled();
    expect(spawnSync.mock.calls.some(([command]) => command === 'gh')).toBe(false);
    expect(fs.writeFileSync).not.toHaveBeenCalled();
  });

  it.each([true, false])(
    'falls back to main after develop fails (merged to main: %s)',
    (mergedToMain) => {
      branches = { 'feat/account-login': { merged: mergedToMain } };
      const git = execFileSync.getMockImplementation();
      execFileSync.mockImplementation((command, args) => {
        if (args[0] === 'branch' && args[3] === 'origin/develop') {
          throw new Error('develop unavailable');
        }
        return git(command, args);
      });

      runCli(['--reportFormat=json']);

      const report = jsonReport();
      expect(exit).toHaveBeenCalledWith(0);
      if (mergedToMain) {
        expect(report.deleted).toEqual([
          expect.objectContaining({ branch: 'feat/account-login', localDeleted: false }),
        ]);
        expect(report.preserved).toEqual([]);
      } else {
        expect(report.deleted).toEqual([]);
        expect(report.preserved).toEqual([
          expect.objectContaining({ branch: 'feat/account-login', category: 'DISCUSS' }),
        ]);
      }
    }
  );

  it('does not select a merged branch when its commit date cannot be read', () => {
    branches = { 'feat/account-login': { merged: true } };
    const git = execFileSync.getMockImplementation();
    execFileSync.mockImplementation((command, args) => {
      if (args[0] === 'log' && args[2] === '--format=%cI') throw new Error('missing commit');
      return git(command, args);
    });

    runCli(['--reportFormat=json']);

    expect(jsonReport()).toMatchObject({
      deleted: [],
      preserved: [expect.objectContaining({ branch: 'feat/account-login', category: 'KEEP' })],
    });
  });

  it('retains release and hotfix exclusions when a custom pattern is invalid', () => {
    branches = {
      'release/version-one': { merged: true },
      'hotfix/account-login': { merged: true },
      'feat/account-login': { merged: true },
    };
    runCli(['--reportFormat=json', '--excludePatterns=[']);

    const report = jsonReport();
    expect(report.deleted.map(({ branch }) => branch)).toEqual(['feat/account-login']);
    expect(report.preserved).toEqual([
      expect.objectContaining({ branch: 'release/version-one', category: 'KEEP' }),
      expect.objectContaining({ branch: 'hotfix/account-login', category: 'KEEP' }),
    ]);
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('falling back to defaults'));
  });

  it.each(['[', ' | '])('does not match every author with unusable patterns %j', (pattern) => {
    branches = { 'feat/account-login': { merged: true } };
    runCli(['--reportFormat=json', `--preserveAuthors=${pattern}`]);
    expect(jsonReport().deleted.map(({ branch }) => branch)).toEqual(['feat/account-login']);
    if (pattern === '[') {
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('disabling author preservation')
      );
    }
  });

  it('honours author preservation even when PR verification is unavailable', () => {
    prResult = { status: 1, stderr: 'not authenticated' };
    branches = { 'feat/account-login': { merged: true, author: 'automation@example.test' } };
    runCli(['--reportFormat=json', '--preserveAuthors=automation@']);
    expect(jsonReport()).toMatchObject({
      deleted: [],
      preserved: [
        {
          branch: 'feat/account-login',
          category: 'KEEP',
          reason: 'Author matches an explicit preservation pattern: automation@example.test',
        },
      ],
    });
  });

  it.each(['--dryRun', '--dryRun=invalid', '--dryRun=0'])(
    'keeps preview mode for %s without enumerating local branches by default',
    (flag) => {
      runCli(['--reportFormat=json', flag]);
      expect(jsonReport().dryRun).toBe(true);
      expect(execFileSync.mock.calls.some(([, args]) => args[1] === 'refs/heads')).toBe(false);
      expect(exit).toHaveBeenCalledWith(0);
    }
  );

  it('applies a custom inactivity threshold at the exact millisecond boundary', () => {
    branches = {
      'feat/before-threshold': { merged: true, date: '2026-06-23T12:00:00.001Z' },
      'feat/at-threshold': { merged: true, date: '2026-06-23T12:00:00.000Z' },
      'feat/future-work': { merged: true, date: '2026-07-01T12:00:00.000Z' },
    };
    runCli(['--reportFormat=json', '--inactiveDays=7']);
    const report = jsonReport();
    expect(report.inactiveDays).toBe(7);
    expect(report.deleted).toEqual([
      expect.objectContaining({ branch: 'feat/at-threshold', age: 7 }),
    ]);
    expect(report.preserved).toEqual([
      expect.objectContaining({ branch: 'feat/before-threshold', category: 'KEEP' }),
      expect.objectContaining({ branch: 'feat/future-work', category: 'KEEP' }),
    ]);
  });

  it('aggregates only deletion candidates into commit, storage, type and author metrics', () => {
    branches = {
      main: { merged: true },
      'feat/account-login': { merged: true, author: 'zoe@example.test' },
      'fix/widget-bug': { merged: true, author: 'alex@example.test' },
      'feat/account-logout': { merged: true, author: 'zoe@example.test' },
    };
    const git = execFileSync.getMockImplementation();
    execFileSync.mockImplementation((command, args) =>
      args[0] === 'rev-list' ? '2' : git(command, args)
    );
    fs.existsSync.mockReturnValue(true);

    runCli(['--reportFormat=json']);

    const report = jsonReport();
    expect(report.summary).toEqual({
      candidates: 3,
      autoApprovedDelete: 0,
      deleted: 3,
      preserved: 1,
      errors: 0,
      deletionSuccessRate: '100.00%',
      preservedDeletedRatio: '1:3',
      totalCommitsRemoved: 6,
      estimatedStorageFreedBytes: 24576,
      estimatedStorageFreedHuman: '24.00 KB',
    });
    expect(report.metrics).toEqual({
      deletedByType: { feat: 2, fix: 1 },
      authorsAffected: ['alex@example.test', 'zoe@example.test'],
    });
    expect(report.deleted).toHaveLength(3);
    for (const candidate of report.deleted) {
      expect(candidate).toMatchObject({
        hash: 'abc123',
        commitCount: 2,
        estimatedStorageBytes: 8192,
        localDeleted: false,
      });
    }
    expect(fs.mkdirSync).not.toHaveBeenCalled();
  });

  it('fails the audit when the report directory cannot be created', () => {
    fs.mkdirSync.mockImplementation(() => {
      throw new Error('permission denied');
    });
    runCli(['--verbose']);
    expect(exit).toHaveBeenCalledWith(1);
    expect(fs.writeFileSync).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('permission denied'));
  });
});
