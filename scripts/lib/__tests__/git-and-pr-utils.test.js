import { execFileSync, spawnSync } from 'child_process';
import {
  getMergeBase,
  getMergeStatus,
  getUniqueCommitCount,
  isMergedToDevelop,
  isMergedToMain,
} from '../git-merge-utils.js';
import { getOpenPRDetails, getOpenPRs, hasOpenPR } from '../github-pr-utils.js';

jest.mock('child_process', () => ({
  execFileSync: jest.fn(),
  spawnSync: jest.fn(),
}));

describe('git merge utilities', () => {
  beforeEach(() => {
    execFileSync.mockReset();
    spawnSync.mockReset();
  });

  it('passes refs to git as discrete arguments', () => {
    execFileSync
      .mockReturnValueOnce('abc123\n')
      .mockReturnValueOnce('abc123\n')
      .mockReturnValueOnce('7\n');

    expect(getMergeBase('origin/main', 'origin/feat/name;echo-bad')).toBe('abc123');
    expect(execFileSync).toHaveBeenNthCalledWith(
      1,
      'git',
      ['merge-base', 'origin/main', 'origin/feat/name;echo-bad'],
      expect.any(Object)
    );

    expect(getUniqueCommitCount('feat/account-login', 'origin/main')).toBe(7);
    expect(execFileSync).toHaveBeenNthCalledWith(
      3,
      'git',
      ['rev-list', '--count', 'abc123..origin/feat/account-login'],
      expect.any(Object)
    );
  });
});

describe('merge status distinguishes a failed query from an unmerged branch', () => {
  beforeEach(() => {
    execFileSync.mockReset();
    spawnSync.mockReset();
  });

  /** Make the remote-tracking ref for `base` verify successfully. */
  function refExists(base) {
    spawnSync.mockReturnValueOnce({ status: 0 });
    return base;
  }

  it('reports a merged branch when Git confirms the merge', () => {
    refExists('develop');
    execFileSync.mockReturnValue('  origin/feat/login\n');

    expect(isMergedToDevelop('feat/login')).toBe(true);
  });

  it('reports a not-merged branch when Git succeeds and omits it', () => {
    refExists('develop');
    execFileSync.mockReturnValue('  origin/develop\n  origin/feat/other\n');

    expect(isMergedToDevelop('feat/login')).toBe(false);
  });

  it('returns null when Git itself fails, not false', () => {
    refExists('develop');
    execFileSync.mockImplementation(() => {
      throw new Error('fatal: not a git repository');
    });

    expect(isMergedToDevelop('feat/login')).toBeNull();
  });

  it('reports a not-merged base as false when the ref is absent, not unknown', () => {
    // show-ref exits 1 for an absent ref. That is a successful answer meaning
    // "this base does not exist here", so the branch is definitely not merged
    // into it. Only a Git failure is unknown.
    spawnSync.mockReturnValueOnce({ status: 1 });

    expect(isMergedToMain('feat/login')).toBe(false);
  });

  it('keeps a failed query out of the unmerged verdict in getMergeStatus', () => {
    refExists('develop');
    spawnSync.mockReturnValueOnce({ status: 1 }); // origin/main absent
    execFileSync.mockImplementation(() => {
      throw new Error('fatal: not a git repository');
    });

    const status = getMergeStatus('feat/login');

    expect(status.state).toBe('unknown');
    expect(status.merged).toBe(false);
  });

  it('still reports merged when the other base query failed', () => {
    refExists('develop');
    spawnSync.mockReturnValueOnce({ status: 1 }); // origin/main absent
    execFileSync.mockReturnValueOnce('  origin/feat/login\n');

    const status = getMergeStatus('feat/login');

    expect(status.merged).toBe(true);
    expect(status.state).toBe('develop');
  });

  it('reports unmerged only when every available base answered', () => {
    refExists('develop');
    refExists('main');
    execFileSync.mockReturnValue('  origin/develop\n  origin/main\n');

    const status = getMergeStatus('feat/login');

    expect(status.state).toBe('unmerged');
    expect(status.merged).toBe(false);
  });
});

describe('GitHub PR utilities', () => {
  beforeEach(() => {
    execFileSync.mockReset();
    spawnSync.mockReset();
  });

  it('returns unavailable when gh is missing or the query fails', () => {
    spawnSync.mockReturnValueOnce({ status: 1 });
    expect(getOpenPRs()).toBeNull();

    spawnSync
      .mockReturnValueOnce({ status: 0 })
      .mockReturnValueOnce({ status: 1, stderr: 'not authenticated' });
    expect(getOpenPRs()).toBeNull();

    spawnSync.mockReturnValueOnce({ status: 1 });
    expect(getOpenPRDetails()).toBeNull();
  });

  it('reserves an empty Set for a confirmed response with no open PRs', () => {
    spawnSync.mockReturnValueOnce({ status: 0 }).mockReturnValueOnce({ status: 0, stdout: '' });

    expect(getOpenPRs()).toEqual(new Set());
  });

  it('throws instead of treating unavailable verification as no open PR', () => {
    expect(() => hasOpenPR('feat/account-login', null)).toThrow(
      'Open-PR verification is unavailable'
    );
  });
});
