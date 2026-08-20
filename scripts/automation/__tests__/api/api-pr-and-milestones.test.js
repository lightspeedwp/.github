// GitHub API Integration Tests — Pull Requests & Milestones
// Tests: Create, read, update PRs and manage milestones via GitHub API

const fixtures = require('./github-fixtures');

// Mock GitHub API client
class GitHubAPIClient {
  constructor(token) {
    if (!token) throw new Error('GitHub token required');
    this.token = token;
    this.requests = [];
  }

  recordRequest(method, endpoint, data) {
    this.requests.push({ method, endpoint, data, timestamp: Date.now() });
  }

  async getPR(owner, repo, prNumber) {
    this.recordRequest('GET', `/repos/${owner}/${repo}/pulls/${prNumber}`);
    return { status: 200, data: { ...fixtures.prs.prWithLinkedIssues, number: prNumber } };
  }

  async createPR(owner, repo, title, body, head, base, draft = false) {
    this.recordRequest('POST', `/repos/${owner}/${repo}/pulls`, {
      title,
      body,
      head,
      base,
      draft,
    });
    return {
      status: 201,
      data: {
        ...fixtures.prs.minimalPR,
        title,
        body,
        draft,
        head: { ref: head },
        base: { ref: base },
      },
    };
  }

  async updatePR(owner, repo, prNumber, updates) {
    this.recordRequest('PATCH', `/repos/${owner}/${repo}/pulls/${prNumber}`, updates);
    return {
      status: 200,
      data: { ...fixtures.prs.prWithLinkedIssues, ...updates },
    };
  }

  async mergePR(owner, repo, prNumber, options = {}) {
    this.recordRequest('PUT', `/repos/${owner}/${repo}/pulls/${prNumber}/merge`, options);
    return {
      status: 200,
      data: {
        sha: 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b',
        merged: true,
        message: 'Pull request successfully merged',
      },
    };
  }

  async getPRLinkedIssues(owner, repo, prNumber) {
    this.recordRequest('GET', `/repos/${owner}/${repo}/pulls/${prNumber}`);
    // Extract issue numbers from PR body
    const pr = fixtures.prs.prWithLinkedIssues;
    const issueRegex = /#(\d+)/g;
    const linkedIssues = new Set();
    let match;
    while ((match = issueRegex.exec(pr.body)) !== null) {
      linkedIssues.add(parseInt(match[1], 10));
    }
    return { status: 200, data: [...linkedIssues] };
  }

  async listPRs(owner, repo, state = 'open') {
    this.recordRequest('GET', `/repos/${owner}/${repo}/pulls?state=${state}`);
    return {
      status: 200,
      data: fixtures.createPRList ? fixtures.createPRList(5, 300) : [fixtures.prs.minimalPR],
    };
  }

  async addPRLabels(owner, repo, prNumber, labels) {
    this.recordRequest('POST', `/repos/${owner}/${repo}/issues/${prNumber}/labels`, { labels });
    return {
      status: 200,
      data: labels.map((name) => ({
        id: Math.random(),
        name,
        color: '000000',
      })),
    };
  }

  async getMilestone(owner, repo, milestoneNumber) {
    this.recordRequest('GET', `/repos/${owner}/${repo}/milestones/${milestoneNumber}`);
    return { status: 200, data: fixtures.milestones.openMilestone };
  }

  async createMilestone(owner, repo, title, description = '', dueDate = null) {
    this.recordRequest('POST', `/repos/${owner}/${repo}/milestones`, {
      title,
      description,
      due_on: dueDate,
    });
    return {
      status: 201,
      data: {
        id: Math.random(),
        number: Math.floor(Math.random() * 1000),
        title,
        description,
        state: 'open',
        due_on: dueDate,
        open_issues: 0,
        closed_issues: 0,
      },
    };
  }

  async updateMilestone(owner, repo, milestoneNumber, updates) {
    this.recordRequest('PATCH', `/repos/${owner}/${repo}/milestones/${milestoneNumber}`, updates);
    return {
      status: 200,
      data: { ...fixtures.milestones.openMilestone, ...updates },
    };
  }

  async closeMilestone(owner, repo, milestoneNumber) {
    this.recordRequest('PATCH', `/repos/${owner}/${repo}/milestones/${milestoneNumber}`, {
      state: 'closed',
    });
    return {
      status: 200,
      data: { ...fixtures.milestones.closedMilestone },
    };
  }

  async deleteMilestone(owner, repo, milestoneNumber) {
    this.recordRequest('DELETE', `/repos/${owner}/${repo}/milestones/${milestoneNumber}`);
    return { status: 204 };
  }

  async listMilestones(owner, repo, state = 'open') {
    this.recordRequest('GET', `/repos/${owner}/${repo}/milestones?state=${state}`);
    return {
      status: 200,
      data: state === 'open' ? [fixtures.milestones.openMilestone] : [fixtures.milestones.closedMilestone],
    };
  }

  async assignIssueToMilestone(owner, repo, issueNumber, milestoneNumber) {
    this.recordRequest('PATCH', `/repos/${owner}/${repo}/issues/${issueNumber}`, {
      milestone: milestoneNumber,
    });
    return {
      status: 200,
      data: { ...fixtures.issues.issueWithLabels, milestone: { number: milestoneNumber } },
    };
  }

  async assignPRToMilestone(owner, repo, prNumber, milestoneNumber) {
    this.recordRequest('PATCH', `/repos/${owner}/${repo}/pulls/${prNumber}`, {
      milestone: milestoneNumber,
    });
    return {
      status: 200,
      data: { ...fixtures.prs.prWithLinkedIssues, milestone: { number: milestoneNumber } },
    };
  }

  getRequestHistory() {
    return this.requests;
  }

  clearRequestHistory() {
    this.requests = [];
  }
}

describe('GitHub API: PRs & Milestones', () => {
  let client;
  const owner = 'lightspeedwp';
  const repo = '.github';

  beforeEach(() => {
    client = new GitHubAPIClient('test-token-12345');
  });

  describe('Pull Request Operations', () => {
    describe('getPR', () => {
      it('retrieves PR by number', async () => {
        const response = await client.getPR(owner, repo, 202);
        expect(response.status).toBe(200);
        expect(response.data.number).toBe(202);
        expect(response.data.title).toBeDefined();
      });

      it('returns PR state information', async () => {
        const response = await client.getPR(owner, repo, 202);
        expect(response.data.state).toMatch(/^(open|closed)$/);
        expect(response.data.draft).toBeDefined();
      });

      it('includes PR metadata', async () => {
        const response = await client.getPR(owner, repo, 202);
        expect(response.data.user).toBeDefined();
        expect(response.data.created_at).toBeDefined();
        expect(response.data.updated_at).toBeDefined();
      });

      it('records API request', async () => {
        await client.getPR(owner, repo, 202);
        const history = client.getRequestHistory();
        expect(history.length).toBe(1);
        expect(history[0].method).toBe('GET');
        expect(history[0].endpoint).toContain('/pulls/202');
      });
    });

    describe('createPR', () => {
      it('creates PR with title and body', async () => {
        const response = await client.createPR(
          owner,
          repo,
          'Fix bug',
          'Closes #1001',
          'fix/bug',
          'develop'
        );
        expect(response.status).toBe(201);
        expect(response.data.title).toBe('Fix bug');
        expect(response.data.body).toBe('Closes #1001');
      });

      it('creates PR as draft', async () => {
        const response = await client.createPR(
          owner,
          repo,
          'WIP feature',
          'Still working',
          'feat/new',
          'develop',
          true
        );
        expect(response.status).toBe(201);
        expect(response.data.draft).toBe(true);
      });

      it('creates PR as ready for review', async () => {
        const response = await client.createPR(
          owner,
          repo,
          'Ready PR',
          'Ready to merge',
          'chore/update',
          'develop',
          false
        );
        expect(response.status).toBe(201);
        expect(response.data.draft).toBe(false);
      });

      it('records PR creation request', async () => {
        await client.createPR(owner, repo, 'Test', 'Body', 'branch', 'develop', false);
        const history = client.getRequestHistory();
        expect(history[0].method).toBe('POST');
        expect(history[0].data.title).toBe('Test');
        expect(history[0].data.head).toBe('branch');
      });
    });

    describe('updatePR', () => {
      it('updates PR title', async () => {
        const response = await client.updatePR(owner, repo, 202, { title: 'Updated title' });
        expect(response.status).toBe(200);
        expect(response.data.title).toBe('Updated title');
      });

      it('updates PR state', async () => {
        const response = await client.updatePR(owner, repo, 202, { state: 'closed' });
        expect(response.status).toBe(200);
        expect(response.data.state).toBe('closed');
      });

      it('converts draft to ready', async () => {
        const response = await client.updatePR(owner, repo, 203, { draft: false });
        expect(response.status).toBe(200);
      });

      it('updates multiple PR fields', async () => {
        const response = await client.updatePR(owner, repo, 202, {
          title: 'New title',
          body: 'New body',
        });
        expect(response.status).toBe(200);
        expect(response.data.title).toBe('New title');
      });
    });

    describe('mergePR', () => {
      it('merges PR successfully', async () => {
        const response = await client.mergePR(owner, repo, 202);
        expect(response.status).toBe(200);
        expect(response.data.merged).toBe(true);
      });

      it('returns merge commit SHA', async () => {
        const response = await client.mergePR(owner, repo, 202);
        expect(response.data.sha).toBeDefined();
        expect(response.data.sha).toMatch(/^[a-f0-9]{7,}$/);
      });

      it('supports merge options', async () => {
        const response = await client.mergePR(owner, repo, 202, {
          merge_method: 'squash',
          commit_title: 'Merge PR #202',
        });
        expect(response.status).toBe(200);
        expect(response.data.merged).toBe(true);
      });
    });

    describe('getPRLinkedIssues', () => {
      it('extracts linked issues from PR body', async () => {
        const response = await client.getPRLinkedIssues(owner, repo, 202);
        expect(response.status).toBe(200);
        expect(response.data).toBeInstanceOf(Array);
        expect(response.data.length).toBeGreaterThan(0);
      });

      it('returns unique issue numbers', async () => {
        const response = await client.getPRLinkedIssues(owner, repo, 202);
        const issueSet = new Set(response.data);
        expect(issueSet.size).toBe(response.data.length);
      });
    });

    describe('listPRs', () => {
      it('lists open PRs', async () => {
        const response = await client.listPRs(owner, repo, 'open');
        expect(response.status).toBe(200);
        expect(response.data).toBeInstanceOf(Array);
      });

      it('lists closed PRs', async () => {
        const response = await client.listPRs(owner, repo, 'closed');
        expect(response.status).toBe(200);
        expect(response.data).toBeInstanceOf(Array);
      });

      it('lists all PRs by default', async () => {
        const response = await client.listPRs(owner, repo);
        expect(response.status).toBe(200);
        expect(response.data).toBeInstanceOf(Array);
      });
    });

    describe('addPRLabels', () => {
      it('adds single label to PR', async () => {
        const response = await client.addPRLabels(owner, repo, 202, ['type:bug']);
        expect(response.status).toBe(200);
        expect(response.data).toHaveLength(1);
      });

      it('adds multiple labels to PR', async () => {
        const response = await client.addPRLabels(owner, repo, 202, ['type:bug', 'priority:high']);
        expect(response.status).toBe(200);
        expect(response.data).toHaveLength(2);
      });
    });
  });

  describe('Milestone Operations', () => {
    describe('getMilestone', () => {
      it('retrieves milestone by number', async () => {
        const response = await client.getMilestone(owner, repo, 1);
        expect(response.status).toBe(200);
        expect(response.data.number).toBeDefined();
        expect(response.data.title).toBeDefined();
      });

      it('returns milestone state', async () => {
        const response = await client.getMilestone(owner, repo, 1);
        expect(response.data.state).toMatch(/^(open|closed)$/);
      });

      it('includes issue counts', async () => {
        const response = await client.getMilestone(owner, repo, 1);
        expect(response.data.open_issues).toBeDefined();
        expect(response.data.closed_issues).toBeDefined();
        expect(typeof response.data.open_issues).toBe('number');
      });
    });

    describe('createMilestone', () => {
      it('creates milestone with title', async () => {
        const response = await client.createMilestone(owner, repo, 'v1.0.0');
        expect(response.status).toBe(201);
        expect(response.data.title).toBe('v1.0.0');
        expect(response.data.state).toBe('open');
      });

      it('creates milestone with description', async () => {
        const response = await client.createMilestone(
          owner,
          repo,
          'v1.1.0',
          'Feature release'
        );
        expect(response.status).toBe(201);
        expect(response.data.description).toBe('Feature release');
      });

      it('creates milestone with due date', async () => {
        const dueDate = '2026-03-01T00:00:00Z';
        const response = await client.createMilestone(
          owner,
          repo,
          'v2.0.0',
          'Major release',
          dueDate
        );
        expect(response.status).toBe(201);
        expect(response.data.due_on).toBe(dueDate);
      });

      it('initializes with zero issues', async () => {
        const response = await client.createMilestone(owner, repo, 'Fresh');
        expect(response.status).toBe(201);
        expect(response.data.open_issues).toBe(0);
        expect(response.data.closed_issues).toBe(0);
      });
    });

    describe('updateMilestone', () => {
      it('updates milestone title', async () => {
        const response = await client.updateMilestone(owner, repo, 1, { title: 'v1.1.0' });
        expect(response.status).toBe(200);
      });

      it('updates milestone description', async () => {
        const response = await client.updateMilestone(owner, repo, 1, {
          description: 'New description',
        });
        expect(response.status).toBe(200);
      });

      it('updates due date', async () => {
        const response = await client.updateMilestone(owner, repo, 1, {
          due_on: '2026-02-15T00:00:00Z',
        });
        expect(response.status).toBe(200);
      });
    });

    describe('closeMilestone', () => {
      it('closes open milestone', async () => {
        const response = await client.closeMilestone(owner, repo, 1);
        expect(response.status).toBe(200);
        expect(response.data.state).toBe('closed');
      });

      it('records milestone closure', async () => {
        await client.closeMilestone(owner, repo, 1);
        const history = client.getRequestHistory();
        expect(history[0].method).toBe('PATCH');
        expect(history[0].data.state).toBe('closed');
      });
    });

    describe('deleteMilestone', () => {
      it('deletes milestone', async () => {
        const response = await client.deleteMilestone(owner, repo, 1);
        expect(response.status).toBe(204);
      });

      it('records milestone deletion', async () => {
        await client.deleteMilestone(owner, repo, 1);
        const history = client.getRequestHistory();
        expect(history[0].method).toBe('DELETE');
        expect(history[0].endpoint).toContain('/milestones/1');
      });
    });

    describe('listMilestones', () => {
      it('lists open milestones', async () => {
        const response = await client.listMilestones(owner, repo, 'open');
        expect(response.status).toBe(200);
        expect(response.data).toBeInstanceOf(Array);
      });

      it('lists closed milestones', async () => {
        const response = await client.listMilestones(owner, repo, 'closed');
        expect(response.status).toBe(200);
        expect(response.data).toBeInstanceOf(Array);
      });
    });
  });

  describe('Issue & Milestone Assignment', () => {
    describe('assignIssueToMilestone', () => {
      it('assigns issue to milestone', async () => {
        const response = await client.assignIssueToMilestone(owner, repo, 1001, 1);
        expect(response.status).toBe(200);
        expect(response.data.milestone).toBeDefined();
      });

      it('supports reassigning to different milestone', async () => {
        await client.assignIssueToMilestone(owner, repo, 1001, 1);
        const response = await client.assignIssueToMilestone(owner, repo, 1001, 2);
        expect(response.status).toBe(200);
      });

      it('records assignment request', async () => {
        await client.assignIssueToMilestone(owner, repo, 1001, 1);
        const history = client.getRequestHistory();
        expect(history[0].method).toBe('PATCH');
        expect(history[0].data.milestone).toBe(1);
      });
    });

    describe('assignPRToMilestone', () => {
      it('assigns PR to milestone', async () => {
        const response = await client.assignPRToMilestone(owner, repo, 202, 1);
        expect(response.status).toBe(200);
        expect(response.data.milestone).toBeDefined();
      });

      it('supports reassigning PR to different milestone', async () => {
        await client.assignPRToMilestone(owner, repo, 202, 1);
        const response = await client.assignPRToMilestone(owner, repo, 202, 3);
        expect(response.status).toBe(200);
      });
    });
  });

  describe('PR Workflow Integration', () => {
    it('creates PR linked to issue and assigns milestone', async () => {
      // Create PR
      const prResponse = await client.createPR(
        owner,
        repo,
        'Fix issue 1001',
        'Fixes #1001',
        'fix/1001',
        'develop'
      );

      // Assign milestone
      await client.assignPRToMilestone(owner, repo, prResponse.data.number, 1);

      // Add labels
      await client.addPRLabels(owner, repo, prResponse.data.number, ['type:bug', 'priority:high']);

      const history = client.getRequestHistory();
      expect(history).toHaveLength(3);
      expect(history[0].method).toBe('POST'); // create
      expect(history[1].method).toBe('PATCH'); // assign milestone
      expect(history[2].method).toBe('POST'); // add labels
    });

    it('extracts linked issues and assigns issue to same milestone', async () => {
      // Get PR
      await client.getPR(owner, repo, 202);

      // Extract linked issues
      const linkedResponse = await client.getPRLinkedIssues(owner, repo, 202);

      // Assign first linked issue to milestone
      if (linkedResponse.data.length > 0) {
        await client.assignIssueToMilestone(owner, repo, linkedResponse.data[0], 1);
      }

      const history = client.getRequestHistory();
      expect(history[0].method).toBe('GET'); // get PR
      expect(history[1].method).toBe('GET'); // get linked issues
    });
  });

  describe('Request History & Audit', () => {
    it('records all API requests', async () => {
      await client.createMilestone(owner, repo, 'v1.0.0');
      await client.assignIssueToMilestone(owner, repo, 1001, 1);
      await client.getMilestone(owner, repo, 1);

      const history = client.getRequestHistory();
      expect(history).toHaveLength(3);
    });

    it('includes timestamps on all requests', async () => {
      await client.createMilestone(owner, repo, 'v1.0.0');
      const history = client.getRequestHistory();
      expect(history[0].timestamp).toBeDefined();
      expect(typeof history[0].timestamp).toBe('number');
    });

    it('allows clearing request history', async () => {
      await client.createMilestone(owner, repo, 'v1.0.0');
      client.clearRequestHistory();
      expect(client.getRequestHistory()).toHaveLength(0);
    });
  });
});
