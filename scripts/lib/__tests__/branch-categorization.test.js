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

  describe('empty agent-session branches (spec 016)', () => {
    const old = '2020-01-01T00:00:00Z';
    const merged = { merged: true, state: 'merged' };
    const unmerged = { merged: false, state: 'unmerged' };

    it('auto-approves deletion of a merged claude/* branch at least a day old', () => {
      const result = categorizeBranches(['claude/brave-otter-x1y2z3'], {
        'claude/brave-otter-x1y2z3': { lastCommitDate: old, mergeStatus: merged },
      });

      expect(result.DELETE).toEqual([
        expect.objectContaining({ name: 'claude/brave-otter-x1y2z3', autoApproved: true }),
      ]);
    });

    it('sends a claude/* branch with its own commits to DISCUSS', () => {
      const result = categorizeBranches(['claude/brave-otter-x1y2z3'], {
        'claude/brave-otter-x1y2z3': { lastCommitDate: old, mergeStatus: unmerged },
      });

      expect(result.DISCUSS).toHaveLength(1);
      expect(result.DELETE).toHaveLength(0);
    });

    it('keeps a claude/* branch that has an open PR', () => {
      const result = categorizeBranches(
        ['claude/brave-otter-x1y2z3'],
        { 'claude/brave-otter-x1y2z3': { lastCommitDate: old, mergeStatus: merged } },
        ['claude/brave-otter-x1y2z3']
      );

      expect(result.KEEP).toHaveLength(1);
    });

    it('does not auto-approve a claude/* branch younger than a day', () => {
      const result = categorizeBranches(['claude/brave-otter-x1y2z3'], {
        'claude/brave-otter-x1y2z3': {
          lastCommitDate: new Date().toISOString(),
          mergeStatus: merged,
        },
      });

      expect(result.DELETE).toHaveLength(0);
      expect(result.DISCUSS).toHaveLength(1);
    });

    it('does not auto-approve other forbidden prefixes', () => {
      const result = categorizeBranches(['copilot/fix-login-bug'], {
        'copilot/fix-login-bug': { lastCommitDate: old, mergeStatus: merged },
      });

      expect(result.DELETE).toHaveLength(0);
      expect(result.DISCUSS).toHaveLength(1);
    });

    it('marks ordinary merged-stale deletions as not auto-approved', () => {
      const result = categorizeBranches(['feat/account-login'], {
        'feat/account-login': { lastCommitDate: old, mergeStatus: merged },
      });

      expect(result.DELETE).toEqual([expect.objectContaining({ autoApproved: false })]);
    });
  });

  it.each([
    'doc/readme-typo-fix',
    'aiops/model-monitoring-update',
    'automation/issue-routing',
    'epic/platform-modernisation',
  ])('accepts canonical branch type %s', (branch) => {
    expect(validateBranchName(branch)).toEqual({ valid: true });
  });
});
