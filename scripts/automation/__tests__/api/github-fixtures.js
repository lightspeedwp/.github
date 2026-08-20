// Realistic GitHub API fixtures for integration testing
// Provides mock responses matching actual GitHub API structure and error scenarios

const fixtureTimestamp = (i, minutes = '00') => {
  const day = String((i % 28) + 1).padStart(2, '0');
  const hour = String(i % 24).padStart(2, '0');
  return `2026-01-${day}T${hour}:${minutes}:00Z`;
};

const fixtures = {
  // ==================== ISSUE FIXTURES ====================
  issues: {
    minimalIssue: {
      id: 1,
      number: 1001,
      title: 'Test issue',
      body: 'Test body',
      state: 'open',
      state_reason: null,
      user: { login: 'testuser', id: 1234 },
      assignee: null,
      assignees: [],
      labels: [],
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z',
      closed_at: null,
    },

    issueWithLabels: {
      id: 2,
      number: 1002,
      title: 'Bug report',
      body: 'Something is broken',
      state: 'open',
      state_reason: null,
      user: { login: 'alice', id: 5678 },
      assignee: { login: 'bob', id: 9101 },
      assignees: [{ login: 'bob', id: 9101 }],
      labels: [
        { id: 101, name: 'type:bug', color: 'd73a49' },
        { id: 102, name: 'priority:high', color: 'ff0000' },
      ],
      created_at: '2026-01-15T10:30:00Z',
      updated_at: '2026-01-20T15:45:00Z',
      closed_at: null,
    },

    closedIssue: {
      id: 3,
      number: 1003,
      title: 'Completed task',
      body: 'This has been done',
      state: 'closed',
      state_reason: 'completed',
      user: { login: 'charlie', id: 1112 },
      assignee: { login: 'alice', id: 5678 },
      assignees: [{ login: 'alice', id: 5678 }],
      labels: [{ id: 103, name: 'type:task', color: '0075ca' }],
      created_at: '2026-01-05T08:00:00Z',
      updated_at: '2026-01-25T12:00:00Z',
      closed_at: '2026-01-25T12:00:00Z',
    },

    issueWithMultipleAssignees: {
      id: 4,
      number: 1004,
      title: 'Complex feature',
      body: 'Requires multiple people',
      state: 'open',
      state_reason: null,
      user: { login: 'dave', id: 1314 },
      assignee: { login: 'alice', id: 5678 },
      assignees: [
        { login: 'alice', id: 5678 },
        { login: 'bob', id: 9101 },
        { login: 'charlie', id: 1112 },
      ],
      labels: [
        { id: 104, name: 'type:feature', color: 'a2eeef' },
        { id: 102, name: 'priority:high', color: 'ff0000' },
      ],
      created_at: '2026-01-10T14:20:00Z',
      updated_at: '2026-01-22T09:15:00Z',
      closed_at: null,
    },
  },

  // ==================== LABEL FIXTURES ====================
  labels: {
    bugLabel: {
      id: 101,
      node_id: 'MDU6TGFiZWwxMDE=',
      url: 'https://api.github.com/repos/lightspeedwp/.github/labels/type:bug',
      name: 'type:bug',
      color: 'd73a49',
      default: false,
      description: 'Bug report or defect',
    },

    featureLabel: {
      id: 105,
      node_id: 'MDU6TGFiZWwxMDU=',
      url: 'https://api.github.com/repos/lightspeedwp/.github/labels/type:feature',
      name: 'type:feature',
      color: 'a2eeef',
      default: false,
      description: 'New feature or capability',
    },

    priorityHighLabel: {
      id: 102,
      node_id: 'MDU6TGFiZWwxMDI=',
      url: 'https://api.github.com/repos/lightspeedwp/.github/labels/priority:high',
      name: 'priority:high',
      color: 'ff0000',
      default: false,
      description: 'High priority work',
    },

    metaHasPRLabel: {
      id: 106,
      node_id: 'MDU6TGFiZWwxMDY=',
      url: 'https://api.github.com/repos/lightspeedwp/.github/labels/meta:has-pr',
      name: 'meta:has-pr',
      color: '0075ca',
      default: false,
      description: 'Issue has associated PR',
    },
  },

  // ==================== PULL REQUEST FIXTURES ====================
  prs: {
    minimalPR: {
      id: 1,
      number: 201,
      title: 'Update README',
      body: 'Closes #1001',
      state: 'open',
      draft: false,
      user: { login: 'alice', id: 5678 },
      assignee: null,
      assignees: [],
      labels: [],
      head: {
        ref: 'feat/update-readme',
        sha: 'abcd1234',
        repo: { name: '.github', owner: { login: 'lightspeedwp' } },
      },
      base: {
        ref: 'develop',
        sha: 'main1234',
        repo: { name: '.github', owner: { login: 'lightspeedwp' } },
      },
      created_at: '2026-01-20T10:00:00Z',
      updated_at: '2026-01-20T10:00:00Z',
      closed_at: null,
      merged_at: null,
      merge_commit_sha: null,
    },

    prWithLinkedIssues: {
      id: 2,
      number: 202,
      title: 'Fix critical bug',
      body: 'Fixes #1002\nRelated to #1003\n\nThis PR addresses multiple issues',
      state: 'open',
      draft: false,
      user: { login: 'bob', id: 9101 },
      assignee: { login: 'alice', id: 5678 },
      assignees: [{ login: 'alice', id: 5678 }],
      labels: [
        { id: 101, name: 'type:bug', color: 'd73a49' },
        { id: 102, name: 'priority:high', color: 'ff0000' },
      ],
      head: {
        ref: 'fix/critical-bug',
        sha: 'efgh5678',
        repo: { name: '.github', owner: { login: 'lightspeedwp' } },
      },
      base: {
        ref: 'develop',
        sha: 'main1234',
        repo: { name: '.github', owner: { login: 'lightspeedwp' } },
      },
      created_at: '2026-01-18T15:30:00Z',
      updated_at: '2026-01-21T09:00:00Z',
      closed_at: null,
      merged_at: null,
      merge_commit_sha: null,
    },

    draftPR: {
      id: 3,
      number: 203,
      title: 'WIP: New feature exploration',
      body: 'Still working on this feature',
      state: 'open',
      draft: true,
      user: { login: 'charlie', id: 1112 },
      assignee: null,
      assignees: [],
      labels: [],
      head: {
        ref: 'feat/exploration',
        sha: 'ijkl9012',
        repo: { name: '.github', owner: { login: 'lightspeedwp' } },
      },
      base: {
        ref: 'develop',
        sha: 'main1234',
        repo: { name: '.github', owner: { login: 'lightspeedwp' } },
      },
      created_at: '2026-01-19T11:00:00Z',
      updated_at: '2026-01-19T11:00:00Z',
      closed_at: null,
      merged_at: null,
      merge_commit_sha: null,
    },

    mergedPR: {
      id: 4,
      number: 204,
      title: 'Merge previous work',
      body: 'Closes #999',
      state: 'closed',
      draft: false,
      user: { login: 'alice', id: 5678 },
      assignee: { login: 'bob', id: 9101 },
      assignees: [{ login: 'bob', id: 9101 }],
      labels: [{ id: 103, name: 'type:task', color: '0075ca' }],
      head: {
        ref: 'feat/previous',
        sha: 'mnop3456',
        repo: { name: '.github', owner: { login: 'lightspeedwp' } },
      },
      base: {
        ref: 'develop',
        sha: 'main1234',
        repo: { name: '.github', owner: { login: 'lightspeedwp' } },
      },
      created_at: '2026-01-15T08:00:00Z',
      updated_at: '2026-01-17T16:30:00Z',
      closed_at: '2026-01-17T16:30:00Z',
      merged_at: '2026-01-17T16:30:00Z',
      merge_commit_sha: 'merged123456',
    },
  },

  // ==================== MILESTONE FIXTURES ====================
  milestones: {
    openMilestone: {
      id: 1001,
      number: 1,
      title: 'v1.0.0',
      description: 'Initial release',
      state: 'open',
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-21T10:00:00Z',
      due_on: '2026-02-01T00:00:00Z',
      closed_at: null,
      open_issues: 15,
      closed_issues: 32,
    },

    closedMilestone: {
      id: 1002,
      number: 2,
      title: 'v0.9.0',
      description: 'Beta release',
      state: 'closed',
      created_at: '2025-12-01T00:00:00Z',
      updated_at: '2026-01-15T12:00:00Z',
      due_on: '2026-01-15T00:00:00Z',
      closed_at: '2026-01-15T12:00:00Z',
      open_issues: 0,
      closed_issues: 28,
    },

    futureMilestone: {
      id: 1003,
      number: 3,
      title: 'v2.0.0',
      description: 'Major feature release',
      state: 'open',
      created_at: '2026-01-10T00:00:00Z',
      updated_at: '2026-01-21T10:00:00Z',
      due_on: '2026-06-01T00:00:00Z',
      closed_at: null,
      open_issues: 42,
      closed_issues: 0,
    },
  },

  // ==================== ERROR RESPONSE FIXTURES ====================
  errors: {
    unauthorized: {
      status: 401,
      statusText: 'Unauthorized',
      data: {
        message: 'Bad credentials',
        documentation_url: 'https://docs.github.com/rest',
      },
    },

    forbidden: {
      status: 403,
      statusText: 'Forbidden',
      data: {
        message: 'API rate limit exceeded',
        documentation_url: 'https://docs.github.com/rest/overview/resources-in-the-rest-api#rate-limiting',
      },
    },

    notFound: {
      status: 404,
      statusText: 'Not Found',
      data: {
        message: 'Not Found',
        documentation_url: 'https://docs.github.com/rest/reference/issues#get-an-issue',
      },
    },

    conflict: {
      status: 409,
      statusText: 'Conflict',
      data: {
        message: 'Validation Failed',
        errors: [
          {
            message: 'Label does not exist',
            resource: 'Issue',
            field: 'labels',
            code: 'invalid',
          },
        ],
      },
    },

    unprocessableEntity: {
      status: 422,
      statusText: 'Unprocessable Entity',
      data: {
        message: 'Validation Failed',
        errors: [
          {
            message: 'state_reason not allowed for states other than closed',
            resource: 'Issue',
            field: 'state_reason',
            code: 'invalid',
          },
        ],
      },
    },

    rateLimit: {
      status: 403,
      statusText: 'Forbidden',
      data: {
        message: 'API rate limit exceeded for user ID 12345',
        documentation_url: 'https://docs.github.com/rest/overview/resources-in-the-rest-api#rate-limiting',
      },
      headers: {
        'x-ratelimit-limit': '60',
        'x-ratelimit-remaining': '0',
        'x-ratelimit-reset': '1234567890',
      },
    },

    timeout: {
      status: 0,
      statusText: 'Request Timeout',
      message: 'Request timed out after 30000ms',
    },

    serverError: {
      status: 500,
      statusText: 'Internal Server Error',
      data: {
        message: 'Internal Server Error',
        documentation_url: 'https://docs.github.com/rest',
      },
    },
  },

  // ==================== BATCH OPERATION FIXTURES ====================
  batch: {
    createIssuesResponse: [
      { id: 1, number: 2001, title: 'Batch issue 1', state: 'open' },
      { id: 2, number: 2002, title: 'Batch issue 2', state: 'open' },
      { id: 3, number: 2003, title: 'Batch issue 3', state: 'open' },
    ],

    updateLabelsResponse: [
      { number: 1001, labels: ['type:bug', 'priority:high'] },
      { number: 1002, labels: ['type:bug', 'priority:high', 'status:needs-review'] },
      { number: 1003, labels: ['type:feature'] },
    ],

    searchResults: {
      total_count: 150,
      incomplete_results: false,
      items: [
        { number: 1, title: 'Issue 1', state: 'open' },
        { number: 2, title: 'Issue 2', state: 'open' },
        { number: 3, title: 'Issue 3', state: 'closed' },
      ],
    },

    paginatedResponse: {
      page1: [
        { id: 1, number: 1, title: 'Item 1' },
        { id: 2, number: 2, title: 'Item 2' },
      ],
      page2: [
        { id: 3, number: 3, title: 'Item 3' },
        { id: 4, number: 4, title: 'Item 4' },
      ],
    },
  },

  // ==================== HELPER FUNCTIONS ====================
  // Create realistic issue lists
  createIssueList: (count, baseNumber = 1000) => {
    const issues = [];
    for (let i = 0; i < count; i++) {
      issues.push({
        id: baseNumber + i,
        number: baseNumber + i,
        title: `Issue ${i + 1}`,
        body: `Description for issue ${i + 1}`,
        state: i % 2 === 0 ? 'open' : 'closed',
        state_reason: i % 2 === 0 ? null : 'completed',
        user: { login: `user${i % 3}`, id: 1000 + i },
        labels: [
          { id: 100 + i, name: i % 2 === 0 ? 'type:bug' : 'type:feature' },
        ],
        created_at: fixtureTimestamp(i),
        updated_at: fixtureTimestamp(i, '30'),
        closed_at: i % 2 === 0 ? null : fixtureTimestamp(i),
      });
    }
    return issues;
  },

  // Create realistic PR lists
  createPRList: (count, baseNumber = 200) => {
    const prs = [];
    for (let i = 0; i < count; i++) {
      prs.push({
        id: baseNumber + i,
        number: baseNumber + i,
        title: `PR ${i + 1}`,
        body: `Closes #${1000 + i}`,
        state: i % 3 === 0 ? 'closed' : 'open',
        draft: i % 5 === 0,
        user: { login: `user${i % 4}`, id: 2000 + i },
        labels: [
          { id: 200 + i, name: i % 2 === 0 ? 'type:bug' : 'type:feature' },
        ],
        head: { ref: `feat/branch-${i}`, sha: `sha${i}` },
        base: { ref: 'develop', sha: 'mainsha' },
        created_at: fixtureTimestamp(i),
        updated_at: fixtureTimestamp(i, '30'),
        closed_at: i % 3 === 0 ? fixtureTimestamp(i) : null,
        merged_at: i % 3 === 0 ? fixtureTimestamp(i) : null,
        merge_commit_sha: i % 3 === 0 ? `merge${i}` : null,
      });
    }
    return prs;
  },
};

module.exports = fixtures;
