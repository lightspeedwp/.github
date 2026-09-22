import { execFileSync, spawnSync } from 'child_process';
import { getMergeBase, getUniqueCommitCount } from '../git-merge-utils.js';
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
