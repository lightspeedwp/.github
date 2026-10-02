import {
  categorizeBranch,
  categorizeBranches,
  validateBranchName,
} from '../branch-categorization.js';

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

  describe('agent-session auto-approval deferral (spec 018 FR-020)', () => {
    const old = '2020-01-01T00:00:00Z';
    const merged = { merged: true, state: 'merged' };
    const unmerged = { merged: false, state: 'unmerged' };

    it.each([0, 1, 30, 365])(
      'sends merged claude/* branches with a %i-day-old tip to DISCUSS',
      (ageInDays) => {
        const result = categorizeBranches(['claude/brave-otter-x1y2z3'], {
          'claude/brave-otter-x1y2z3': {
            lastCommitDate: new Date(Date.now() - ageInDays * 86400000).toISOString(),
            mergeStatus: merged,
          },
        });

        expect(result.DELETE).toHaveLength(0);
        expect(result.DISCUSS).toEqual([
          expect.objectContaining({
            name: 'claude/brave-otter-x1y2z3',
            autoApproved: false,
            reason: expect.stringContaining('forbidden prefix: claude'),
          }),
        ]);
      }
    );

    it('keeps an explicitly excluded claude/* branch', () => {
      const result = categorizeBranches(
        ['claude/brave-otter-x1y2z3'],
        { 'claude/brave-otter-x1y2z3': { lastCommitDate: old, mergeStatus: merged } },
        new Set(),
        /^claude\//
      );

      expect(result.KEEP).toEqual([expect.objectContaining({ autoApproved: false })]);
      expect(result.DELETE).toHaveLength(0);
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

describe('branch classification boundaries and precedence', () => {
  const now = Date.parse('2026-06-30T12:00:00Z');
  const branch = 'feat/account-login';
  const metadataFor = (age, merged) => ({
    author: 'author@example.test',
    lastCommitDate: new Date(now - age * 86400000).toISOString(),
    mergeStatus: { merged, state: merged ? 'both' : 'unmerged' },
  });

  beforeEach(() => jest.spyOn(Date, 'now').mockReturnValue(now));
  afterEach(() => jest.restoreAllMocks());

  it.each([
    [true, 29.999, 'KEEP', 'Recently active'],
    [true, 30, 'DELETE', 'Merged and inactive'],
    [false, 29.999, 'KEEP', 'Not fully merged'],
    [false, 30, 'DISCUSS', 'Unmerged and stale'],
  ])('classifies merged=%s at age %s as %s', (merged, age, category, reason) => {
    expect(categorizeBranch(branch, metadataFor(age, merged))).toEqual({
      category,
      reason: expect.stringContaining(reason),
      metadata: { ...metadataFor(age, merged), type: 'feat', ageInDays: age },
    });
  });

  it('honours a custom threshold, including zero days', () => {
    expect(categorizeBranch(branch, metadataFor(7, true), new Set(), null, 7).category).toBe(
      'DELETE'
    );
    expect(categorizeBranch(branch, metadataFor(0, true), new Set(), null, 0).category).toBe(
      'DELETE'
    );
    expect(categorizeBranch(branch, metadataFor(-1, true), new Set(), null, 0).category).toBe(
      'KEEP'
    );
  });

  it.each([undefined, '', 'invalid-date'])(
    'does not delete merged branches with date %s',
    (lastCommitDate) => {
      const result = categorizeBranch(branch, { lastCommitDate, mergeStatus: { merged: true } });
      expect(result.category).toBe('KEEP');
      expect(result.metadata.ageInDays).toBe(0);
      expect(result.metadata.author).toBe('unknown');
    }
  );

  it.each([
    ['main', /^main$/, ['main'], 'Protected branch'],
    ['claude/session-work', /^claude\//, ['claude/session-work'], 'Matches exclusion'],
    ['copilot/session-work', null, ['copilot/session-work'], 'Has active pull request'],
  ])(
    'applies preservation gates before naming or deletion for %s',
    (name, excluded, prs, reason) => {
      const result = categorizeBranch(name, metadataFor(90, true), new Set(prs), excluded);
      expect(result.category).toBe('KEEP');
      expect(result.reason).toContain(reason);
      expect(result.autoApproved).not.toBe(true);
    }
  );

  it('requires a complete valid name even for a stale merged branch', () => {
    expect(categorizeBranch('feat/login', metadataFor(90, true))).toMatchObject({
      category: 'DISCUSS',
      reason: expect.stringContaining('Invalid branch name'),
    });
    expect(validateBranchName('copilot/account-login')).toEqual({
      valid: false,
      reason: 'forbidden prefix: copilot',
    });
  });

  it('groups each branch once, preserving order and metadata without mutating inputs', () => {
    const branches = Object.freeze(['main', branch, 'fix/widget-bug', 'legacy']);
    const metadata = Object.freeze({
      [branch]: Object.freeze(metadataFor(45, true)),
      'fix/widget-bug': Object.freeze(metadataFor(31, true)),
    });
    const result = categorizeBranches(branches, metadata);
    expect(result.KEEP.map((entry) => entry.name)).toEqual(['main']);
    expect(result.DELETE.map((entry) => entry.name)).toEqual([branch, 'fix/widget-bug']);
    expect(result.DISCUSS.map((entry) => entry.name)).toEqual(['legacy']);
    expect(result.DELETE[0]).toMatchObject({
      name: branch,
      ageInDays: 45,
      author: 'author@example.test',
      type: 'feat',
      autoApproved: false,
    });
    expect(result.KEEP[0]).toMatchObject({
      ageInDays: 0,
      author: 'unknown',
      lastCommitDate: '',
      mergeStatus: { merged: false, state: 'unmerged' },
    });
    expect(metadata[branch]).toEqual(metadataFor(45, true));
  });

  it.each([
    [null, {}, 30, 'branches'],
    [[''], {}, 30, 'branches'],
    [[branch, 123], {}, 30, 'branches'],
    [[branch], null, 30, 'branchMetadata'],
    [[branch], [], 30, 'branchMetadata'],
    [[branch], {}, -1, 'inactiveDays'],
    [[branch], {}, 0.5, 'inactiveDays'],
    [[branch], {}, '30', 'inactiveDays'],
    [[branch], {}, NaN, 'inactiveDays'],
    [[branch], {}, Infinity, 'inactiveDays'],
  ])('rejects invalid batch arguments (%s, %s, %s)', (branches, metadata, threshold, field) => {
    const error = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(categorizeBranches(branches, metadata, new Set(), null, threshold)).toEqual({
      KEEP: [],
      DELETE: [],
      DISCUSS: [],
    });
    expect(error).toHaveBeenCalledWith(expect.stringContaining(field));
  });
});
