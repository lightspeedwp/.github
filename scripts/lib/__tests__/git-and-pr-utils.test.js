import { execFileSync, spawnSync } from 'child_process';
import {
  getBaseRef,
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

describe('Git fallback and merge combinations', () => {
  beforeEach(() => jest.resetAllMocks());

  it.each([
    [0, 0, 'origin/develop'],
    [1, 0, 'origin/main'],
    [1, 1, 'origin/HEAD'],
  ])('selects the available base (%s, %s)', (develop, main, expected) => {
    spawnSync.mockImplementation((_command, args) => ({
      status: args[3].endsWith('/develop') ? develop : main,
    }));
    expect(getBaseRef()).toBe(expected);
  });

  it.each([
    [true, true, 'both', true],
    [true, false, 'develop', true],
    [false, true, 'main', true],
    [false, false, 'unmerged', false],
    [null, true, 'main', true],
    [true, null, 'develop', true],
    [null, false, 'unknown', false],
    [false, null, 'unknown', false],
    [null, null, 'unknown', false],
  ])('combines develop=%s and main=%s', (develop, main, state, merged) => {
    spawnSync.mockReturnValue({ status: 0 });
    execFileSync.mockImplementation((_command, args) => {
      const answer = args[3] === 'origin/develop' ? develop : main;
      if (answer === null) throw new Error('Git query failed');
      return answer ? '  origin/feat/account-login\n' : '  origin/feat/account-login-extra\n';
    });
    expect(getMergeStatus('feat/account-login')).toEqual({
      state,
      merged,
      mergedToDevelop: develop,
      mergedToMain: main,
    });
  });

  it.each([128, null])(
    'treats ref lookup status %s as unknown without querying branches',
    (status) => {
      spawnSync.mockReturnValue({ status });
      expect(isMergedToMain('feat/account-login')).toBeNull();
      expect(execFileSync).not.toHaveBeenCalled();
    }
  );

  it('does not count commits when the merge base cannot be found', () => {
    execFileSync.mockImplementation(() => {
      throw new Error('No merge base');
    });
    expect(getUniqueCommitCount('feat/account-login', 'origin/main')).toBe(0);
    expect(execFileSync).toHaveBeenCalledTimes(1);
  });
  it('returns zero when counting commits fails after finding a merge base', () => {
    execFileSync.mockReturnValueOnce('abc123\n').mockImplementationOnce(() => {
      throw new Error('object unavailable');
    });
    expect(getUniqueCommitCount('feat/account-login', 'origin/main')).toBe(0);
    expect(execFileSync).toHaveBeenLastCalledWith(
      'git',
      ['rev-list', '--count', 'abc123..origin/feat/account-login'],
      expect.any(Object)
    );
  });

  it.each(['', 'not-a-count', '0\n', '12\n'])('handles commit count output %j', (output) => {
    execFileSync.mockReturnValueOnce('abc123\n').mockReturnValueOnce(output);
    expect(getUniqueCommitCount('feat/account-login', 'origin/main')).toBe(
      output === '12\n' ? 12 : 0
    );
  });
});

describe('GitHub verification boundaries', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });
  afterEach(() => jest.restoreAllMocks());

  function ghResponse(stdout, status = 0, stderr = '') {
    spawnSync.mockReturnValueOnce({ status: 0 }).mockReturnValueOnce({ status, stdout, stderr });
  }

  it('trims and deduplicates branch names without altering their spelling', () => {
    ghResponse('  feat/account-login\n\nfix/widget-bug\nfeat/account-login\n');
    expect(getOpenPRs()).toEqual(new Set(['feat/account-login', 'fix/widget-bug']));
    expect(spawnSync).toHaveBeenLastCalledWith(
      'gh',
      [
        'pr',
        'list',
        '--state',
        'open',
        '--limit',
        '250',
        '--json',
        'headRefName',
        '--jq',
        '.[].headRefName',
      ],
      expect.any(Object)
    );
  });

  it.each([249, 250, 251])('fails closed at the PR limit with %s entries', (count) => {
    const names = Array.from({ length: count }, (_, i) => `feat/task-${i}`);
    ghResponse(names.join('\n'));
    expect(getOpenPRs()).toEqual(count < 250 ? new Set(names) : null);
  });

  it('checks truncation before deduplication', () => {
    ghResponse(Array(250).fill('feat/account-login').join('\n'));
    expect(getOpenPRs()).toBeNull();
  });

  it.each(['API rate limit exceeded', 'unauthorized', 'not authenticated', 'network failure', ''])(
    'does not trust stdout after a failed query: %s',
    (stderr) => {
      ghResponse('feat/account-login', 1, stderr);
      expect(getOpenPRs()).toBeNull();
      expect(console.warn).toHaveBeenCalled();
    }
  );

  it('uses cached PR names without invoking gh', () => {
    const cached = new Set(['feat/account-login']);
    expect(hasOpenPR('feat/account-login', cached)).toBe(true);
    expect(hasOpenPR('feat/account-login-extra', cached)).toBe(false);
    expect(spawnSync).not.toHaveBeenCalled();
  });
  it('fetches uncached PR names and propagates verification failures', () => {
    ghResponse('feat/account-login');
    expect(hasOpenPR('feat/account-login')).toBe(true);
    spawnSync.mockReturnValueOnce({ status: null, error: new Error('ENOENT') });
    expect(() => hasOpenPR('feat/account-login')).toThrow('Open-PR verification is unavailable');
  });

  it.each([249, 250])('checks the details response limit at %s entries', (count) => {
    const details = Array.from({ length: count }, (_, i) => ({
      headRefName: `feat/task-${i}`,
      title: `Task ${i}`,
      author: { login: 'contributor' },
    }));
    ghResponse(JSON.stringify(details));
    expect(getOpenPRDetails()).toEqual(count < 250 ? details : null);
  });
  it.each(['', '[]', '  \n '])('returns an empty details list for %j', (output) => {
    ghResponse(output);
    expect(getOpenPRDetails()).toEqual([]);
  });
  it('rejects malformed details and failed queries', () => {
    ghResponse('{invalid json');
    expect(getOpenPRDetails()).toBeNull();
    ghResponse('[]', 1, 'network failure');
    expect(getOpenPRDetails()).toBeNull();
  });

  it.each([
    ['local-gh-token', 'local-github-token', 'local-gh-token'],
    ['', 'local-github-token', 'local-github-token'],
  ])('selects the configured token for both PR lookups', (gh, github, expected) => {
    jest.replaceProperty(process, 'env', { ...process.env, GH_TOKEN: gh, GITHUB_TOKEN: github });
    ghResponse('');
    getOpenPRs();
    ghResponse('[]');
    getOpenPRDetails();
    for (const call of spawnSync.mock.calls.filter(([, args]) => args[0] === 'pr')) {
      expect(call[2].env.GH_TOKEN).toBe(expected);
    }
  });
});
