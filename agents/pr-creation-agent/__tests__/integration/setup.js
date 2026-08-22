// Integration test setup with mock GitHub API
// Sets up mocks for all GitHub API endpoints used by the PR creation agent

export class MockGitHub {
  constructor(options = {}) {
    this.options = options;
    this.calls = {
      getBranch: [],
      getContent: [],
      addLabels: [],
      listLabels: [],
      getLabel: [],
      create: [],
      get: [],
      update: [],
    };
  }

  // Branch operations
  repos = {
    getBranch: async ({ owner, repo, branch }) => {
      this.calls.getBranch.push({ owner, repo, branch });
      if (this.options.branchError) {
        throw new Error(this.options.branchError);
      }
      return {
        name: branch,
        commit: {
          sha: 'abcd1234',
          url: `https://api.github.com/repos/${owner}/${repo}/commits/abcd1234`,
        },
        protected: false,
      };
    },

    getProtectedBranch: async ({ owner, repo, branch }) => {
      return {
        name: branch,
        protection: { enabled: false },
      };
    },

    getContent: async ({ owner, repo, path }) => {
      this.calls.getContent.push({ owner, repo, path });
      if (this.options.templateError) {
        throw new Error(this.options.templateError);
      }
      return {
        name: path.split('/').pop(),
        path,
        size: 1024,
        content: Buffer.from('# PR Template\n\n## Description\n\nTemplate content').toString('base64'),
      };
    },

    get: async ({ owner, repo }) => {
      return {
        name: repo,
        full_name: `${owner}/${repo}`,
        private: false,
      };
    },
  };

  // Issue/Label operations
  issues = {
    addLabels: async ({ owner, repo, issue_number, labels }) => {
      this.calls.addLabels.push({ owner, repo, issue_number, labels });
      if (this.options.labelError) {
        throw new Error(this.options.labelError);
      }
      return {
        url: `https://api.github.com/repos/${owner}/${repo}/issues/${issue_number}`,
        labels: labels.map(name => ({ name, color: '0366d6' })),
      };
    },

    listLabels: async ({ owner, repo }) => {
      return [
        { name: 'type:feature', color: '0366d6' },
        { name: 'type:bug', color: 'fc2929' },
        { name: 'type:docs', color: '0075ca' },
        { name: 'area:agents', color: 'd4c5f9' },
        { name: 'priority:critical', color: 'ee0701' },
        { name: 'meta:no-changelog', color: 'cccccc' },
      ];
    },

    getLabel: async ({ owner, repo, name }) => {
      return { name, color: '0366d6' };
    },
  };

  // Pull request operations
  pulls = {
    create: async ({ owner, repo, title, body, head, base }) => {
      this.calls.create.push({ owner, repo, title, body, head, base });
      if (this.options.prCreationError) {
        throw new Error(this.options.prCreationError);
      }
      return {
        id: 1,
        number: 123,
        title,
        body,
        head: { ref: head },
        base: { ref: base },
        state: 'open',
        url: `https://github.com/${owner}/${repo}/pull/123`,
      };
    },

    get: async ({ owner, repo, pull_number }) => {
      return {
        number: pull_number,
        title: 'Test PR',
        state: 'open',
      };
    },

    update: async ({ owner, repo, pull_number, title, body }) => {
      this.calls.update.push({ owner, repo, pull_number, title, body });
      return { number: pull_number, title, body };
    },
  };

  // Helper to reset calls
  resetCalls() {
    Object.keys(this.calls).forEach(key => {
      this.calls[key] = [];
    });
  }

  // Helper to get all calls of a type
  getCallsFor(method) {
    return this.calls[method] || [];
  }
}

// Mock config for tests
export const createMockConfig = (overrides = {}) => {
  return {
    allowed_types: ['feat', 'fix', 'docs', 'chore', 'test', 'refactor', 'hotfix', 'security'],
    template_routing: {
      'feat/': 'pr_feature.md',
      'fix/': 'pr_bug.md',
      'docs/': 'pr_docs.md',
      'chore/': 'pr_chore.md',
      'test/': 'pr_chore.md',
      'refactor/': 'pr_refactor.md',
      'hotfix/': 'pr_hotfix.md',
      'security/': 'pr_bug.md',
    },
    canonical_labels: [
      'type:feature',
      'type:bug',
      'type:docs',
      'area:agents',
      'priority:critical',
    ],
    ...overrides,
  };
};

// Test data fixtures
export const testFixtures = {
  validBranches: [
    { name: 'feat/pr-creation-agent', type: 'feat' },
    { name: 'fix/invalid-branch-validation', type: 'fix' },
    { name: 'docs/branching-strategy', type: 'docs' },
    { name: 'hotfix/critical-security', type: 'hotfix' },
    { name: 'chore/dependency-update', type: 'chore' },
  ],

  invalidBranches: [
    { name: 'claude/invalid-prefix', error: 'branch-prefix-forbidden' },
    { name: 'feature/hyphen-issue', error: 'branch-type-invalid' },
    { name: 'my-branch', error: 'branch-prefix-missing' },
  ],

  validLabels: [
    ['type:feature'],
    ['type:bug'],
    ['type:feature', 'area:agents'],
    ['type:bug', 'priority:critical'],
  ],

  invalidLabels: [
    ['bug'],  // missing prefix
    ['type:feature', 'feature'],  // mixed valid/invalid
  ],

  templateCases: [
    { branch: 'feat/new-feature', expectedTemplate: 'pr_feature.md' },
    { branch: 'fix/bug-fix', expectedTemplate: 'pr_bug.md' },
    { branch: 'docs/update-readme', expectedTemplate: 'pr_docs.md' },
    { branch: 'hotfix/critical', expectedTemplate: 'pr_hotfix.md' },
  ],

  prData: {
    owner: 'lightspeedwp',
    repo: '.github',
    title: 'Test PR Title',
    body: '## Description\n\nTest PR description',
    head: 'feat/test-branch',
    base: 'develop',
  },
};
