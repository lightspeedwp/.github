import { categorizeBranches, validateBranchName } from '../branch-categorization.js';

describe('branch categorization', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('validates the complete type/scope-title branch name', () => {
    expect(validateBranchName('feat/account-login')).toEqual({ valid: true });

    for (const branch of ['feat/login', 'feat/account--login', 'feat/account-login!']) {
      expect(validateBranchName(branch)).toEqual(
        expect.objectContaining({
          valid: false,
          reason: expect.stringContaining('{type}/{scope}-{title}'),
        })
      );
    }

    expect(validateBranchName('Feat/account-login').valid).toBe(false);
  });

  it('normalizes an open-PR array while preserving direct Set support', () => {
    const metadata = {
      'feat/account-login': {
        lastCommitDate: '2020-01-01T00:00:00Z',
        mergeStatus: { merged: true, state: 'merged' },
      },
    };

    const fromArray = categorizeBranches(['feat/account-login'], metadata, ['feat/account-login']);
    const fromSet = categorizeBranches(
      ['feat/account-login'],
      metadata,
      new Set(['feat/account-login'])
    );

    expect(fromArray.KEEP).toHaveLength(1);
    expect(fromSet.KEEP).toHaveLength(1);
  });

  it('logs and returns empty categories for an invalid open-PR value', () => {
    const error = jest.spyOn(console, 'error').mockImplementation(() => {});

    const result = categorizeBranches(['feat/account-login'], {}, null);

    expect(result).toEqual({ KEEP: [], DELETE: [], DISCUSS: [] });
    expect(error).toHaveBeenCalledWith('openPRs must be a Set or an array');
  });

  it.each(['main', 'develop', 'production', 'staging', 'master'])(
    'always keeps protected branch %s',
    (branch) => {
      const result = categorizeBranches([branch]);
      expect(result.KEEP).toHaveLength(1);
    }
  );
});
