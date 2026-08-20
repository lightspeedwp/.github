// GitHub API Integration Tests — Issues & Labels
// Tests: Create, read, update, search issues and apply/sync labels via GitHub API

const fixtures = require("./github-fixtures");

// Mock GitHub API client
class GitHubAPIClient {
  constructor(token) {
    if (!token) throw new Error("GitHub token required");
    this.token = token;
    this.requests = [];
  }

  recordRequest(method, endpoint, data) {
    this.requests.push({ method, endpoint, data, timestamp: Date.now() });
  }

  async getIssue(owner, repo, issueNumber) {
    this.recordRequest("GET", `/repos/${owner}/${repo}/issues/${issueNumber}`);
    return {
      status: 200,
      data: { ...fixtures.issues.issueWithLabels, number: issueNumber },
    };
  }

  async createIssue(owner, repo, title, body, labels = []) {
    this.recordRequest("POST", `/repos/${owner}/${repo}/issues`, {
      title,
      body,
      labels,
    });
    return {
      status: 201,
      data: {
        ...fixtures.issues.minimalIssue,
        title,
        body,
        labels: labels.map((name) => ({
          id: Math.random(),
          name,
          color: "000000",
        })),
      },
    };
  }

  async updateIssue(owner, repo, issueNumber, updates) {
    this.recordRequest(
      "PATCH",
      `/repos/${owner}/${repo}/issues/${issueNumber}`,
      updates,
    );
    const data = { ...fixtures.issues.issueWithLabels, ...updates };
    if (updates.assignee && typeof updates.assignee === "string") {
      data.assignee = { login: updates.assignee };
    }
    return {
      status: 200,
      data,
    };
  }

  async addLabels(owner, repo, issueNumber, labels) {
    this.recordRequest(
      "POST",
      `/repos/${owner}/${repo}/issues/${issueNumber}/labels`,
      { labels },
    );
    return {
      status: 200,
      data: labels.map((name) => ({
        id: Math.random(),
        name,
        color: "000000",
      })),
    };
  }

  async removeLabel(owner, repo, issueNumber, label) {
    this.recordRequest(
      "DELETE",
      `/repos/${owner}/${repo}/issues/${issueNumber}/labels/${label}`,
    );
    return { status: 204 };
  }

  async listIssueLabels(owner, repo, issueNumber) {
    this.recordRequest(
      "GET",
      `/repos/${owner}/${repo}/issues/${issueNumber}/labels`,
    );
    return { status: 200, data: fixtures.issues.issueWithLabels.labels };
  }

  async searchIssues(owner, repo, query) {
    this.recordRequest("GET", `/search/issues`, { q: query });
    return {
      status: 200,
      data: {
        total_count: fixtures.batch.searchResults.total_count,
        items: fixtures.batch.searchResults.items,
      },
    };
  }

  async createLabel(owner, repo, name, color, description = "") {
    this.recordRequest("POST", `/repos/${owner}/${repo}/labels`, {
      name,
      color,
      description,
    });
    return {
      status: 201,
      data: {
        id: Math.random(),
        name,
        color,
        description,
      },
    };
  }

  async updateLabel(owner, repo, labelName, updates) {
    this.recordRequest(
      "PATCH",
      `/repos/${owner}/${repo}/labels/${labelName}`,
      updates,
    );
    return { status: 200, data: { ...fixtures.labels.bugLabel, ...updates } };
  }

  async deleteLabel(owner, repo, labelName) {
    this.recordRequest("DELETE", `/repos/${owner}/${repo}/labels/${labelName}`);
    return { status: 204 };
  }

  async listLabels(owner, repo) {
    this.recordRequest("GET", `/repos/${owner}/${repo}/labels`);
    return {
      status: 200,
      data: Object.values(fixtures.labels),
    };
  }

  getRequestHistory() {
    return this.requests;
  }

  clearRequestHistory() {
    this.requests = [];
  }
}

describe("GitHub API: Issues & Labels", () => {
  let client;
  const owner = "lightspeedwp";
  const repo = ".github";

  beforeEach(() => {
    client = new GitHubAPIClient("test-token-12345");
  });

  describe("Issue Operations", () => {
    describe("getIssue", () => {
      it("retrieves issue by number", async () => {
        const response = await client.getIssue(owner, repo, 1001);
        expect(response.status).toBe(200);
        expect(response.data.number).toBe(1001);
        expect(response.data.title).toBeDefined();
      });

      it("returns issue state information", async () => {
        const response = await client.getIssue(owner, repo, 1001);
        expect(response.data.state).toMatch(/^(open|closed)$/);
        expect(response.data.user).toBeDefined();
        expect(response.data.user.login).toBeDefined();
      });

      it("includes issue metadata", async () => {
        const response = await client.getIssue(owner, repo, 1001);
        expect(response.data.created_at).toBeDefined();
        expect(response.data.updated_at).toBeDefined();
        expect(response.data.labels).toBeInstanceOf(Array);
      });

      it("records API request", async () => {
        await client.getIssue(owner, repo, 1001);
        const history = client.getRequestHistory();
        expect(history.length).toBe(1);
        expect(history[0].method).toBe("GET");
        expect(history[0].endpoint).toContain("/issues/1001");
      });
    });

    describe("createIssue", () => {
      it("creates issue with title and body", async () => {
        const response = await client.createIssue(
          owner,
          repo,
          "New issue",
          "Issue description",
        );
        expect(response.status).toBe(201);
        expect(response.data.title).toBe("New issue");
        expect(response.data.body).toBe("Issue description");
        expect(response.data.state).toBe("open");
      });

      it("creates issue with labels", async () => {
        const labels = ["type:bug", "priority:high"];
        const response = await client.createIssue(
          owner,
          repo,
          "Bug report",
          "Found a bug",
          labels,
        );
        expect(response.status).toBe(201);
        expect(response.data.labels).toHaveLength(2);
        expect(response.data.labels.map((l) => l.name)).toEqual(labels);
      });

      it("creates issue without labels", async () => {
        const response = await client.createIssue(
          owner,
          repo,
          "Basic issue",
          "No labels",
        );
        expect(response.status).toBe(201);
        expect(response.data.labels).toEqual([]);
      });

      it("records create request", async () => {
        await client.createIssue(owner, repo, "Test", "Body", ["type:task"]);
        const history = client.getRequestHistory();
        expect(history[0].method).toBe("POST");
        expect(history[0].data.title).toBe("Test");
        expect(history[0].data.labels).toContain("type:task");
      });
    });

    describe("updateIssue", () => {
      it("updates issue title", async () => {
        const response = await client.updateIssue(owner, repo, 1001, {
          title: "Updated title",
        });
        expect(response.status).toBe(200);
        expect(response.data.title).toBe("Updated title");
      });

      it("updates issue state", async () => {
        const response = await client.updateIssue(owner, repo, 1001, {
          state: "closed",
          state_reason: "completed",
        });
        expect(response.status).toBe(200);
        expect(response.data.state).toBe("closed");
      });

      it("updates issue assignee", async () => {
        const response = await client.updateIssue(owner, repo, 1001, {
          assignee: "alice",
        });
        expect(response.status).toBe(200);
        expect(response.data.assignee.login).toBe("alice");
      });

      it("updates multiple fields", async () => {
        const response = await client.updateIssue(owner, repo, 1001, {
          title: "New title",
          body: "New body",
          state: "closed",
        });
        expect(response.status).toBe(200);
        expect(response.data.title).toBe("New title");
        expect(response.data.body).toBe("New body");
      });
    });
  });

  describe("Label Operations", () => {
    describe("addLabels", () => {
      it("adds single label to issue", async () => {
        const response = await client.addLabels(owner, repo, 1001, [
          "type:bug",
        ]);
        expect(response.status).toBe(200);
        expect(response.data).toHaveLength(1);
        expect(response.data[0].name).toBe("type:bug");
      });

      it("adds multiple labels to issue", async () => {
        const response = await client.addLabels(owner, repo, 1001, [
          "type:bug",
          "priority:high",
          "status:needs-review",
        ]);
        expect(response.status).toBe(200);
        expect(response.data).toHaveLength(3);
      });

      it("records label addition request", async () => {
        await client.addLabels(owner, repo, 1001, ["type:feature"]);
        const history = client.getRequestHistory();
        expect(history[0].method).toBe("POST");
        expect(history[0].endpoint).toContain("/labels");
        expect(history[0].data.labels).toContain("type:feature");
      });
    });

    describe("removeLabel", () => {
      it("removes label from issue", async () => {
        const response = await client.removeLabel(
          owner,
          repo,
          1001,
          "type:bug",
        );
        expect(response.status).toBe(204);
      });

      it("records label removal request", async () => {
        await client.removeLabel(owner, repo, 1001, "type:bug");
        const history = client.getRequestHistory();
        expect(history[0].method).toBe("DELETE");
        expect(history[0].endpoint).toContain("/labels/type:bug");
      });

      it("removes multiple labels separately", async () => {
        await client.removeLabel(owner, repo, 1001, "type:bug");
        await client.removeLabel(owner, repo, 1001, "priority:high");
        const history = client.getRequestHistory();
        expect(history).toHaveLength(2);
      });
    });

    describe("listIssueLabels", () => {
      it("lists all labels on issue", async () => {
        const response = await client.listIssueLabels(owner, repo, 1001);
        expect(response.status).toBe(200);
        expect(response.data).toBeInstanceOf(Array);
        expect(response.data.length).toBeGreaterThan(0);
      });

      it("returns label metadata", async () => {
        const response = await client.listIssueLabels(owner, repo, 1001);
        response.data.forEach((label) => {
          expect(label.id).toBeDefined();
          expect(label.name).toBeDefined();
          expect(label.color).toBeDefined();
        });
      });
    });

    describe("createLabel", () => {
      it("creates new label in repository", async () => {
        const response = await client.createLabel(
          owner,
          repo,
          "custom:label",
          "ff6b6b",
          "Custom label",
        );
        expect(response.status).toBe(201);
        expect(response.data.name).toBe("custom:label");
        expect(response.data.color).toBe("ff6b6b");
      });

      it("creates label with description", async () => {
        const response = await client.createLabel(
          owner,
          repo,
          "type:custom",
          "000000",
          "A custom issue type",
        );
        expect(response.status).toBe(201);
        expect(response.data.description).toBe("A custom issue type");
      });

      it("creates label without description", async () => {
        const response = await client.createLabel(
          owner,
          repo,
          "quick-label",
          "ffffff",
        );
        expect(response.status).toBe(201);
        expect(response.data.name).toBe("quick-label");
      });
    });

    describe("updateLabel", () => {
      it("updates label name", async () => {
        const response = await client.updateLabel(owner, repo, "type:bug", {
          name: "type:defect",
        });
        expect(response.status).toBe(200);
        expect(response.data.name).toBe("type:defect");
      });

      it("updates label color", async () => {
        const response = await client.updateLabel(owner, repo, "type:bug", {
          color: "ff0000",
        });
        expect(response.status).toBe(200);
        expect(response.data.color).toBe("ff0000");
      });

      it("updates label description", async () => {
        const response = await client.updateLabel(owner, repo, "type:bug", {
          description: "Bug or defect report",
        });
        expect(response.status).toBe(200);
        expect(response.data.description).toBe("Bug or defect report");
      });
    });

    describe("deleteLabel", () => {
      it("deletes label from repository", async () => {
        const response = await client.deleteLabel(owner, repo, "type:bug");
        expect(response.status).toBe(204);
      });

      it("records label deletion request", async () => {
        await client.deleteLabel(owner, repo, "type:bug");
        const history = client.getRequestHistory();
        expect(history[0].method).toBe("DELETE");
      });
    });

    describe("listLabels", () => {
      it("lists all labels in repository", async () => {
        const response = await client.listLabels(owner, repo);
        expect(response.status).toBe(200);
        expect(response.data).toBeInstanceOf(Array);
        expect(response.data.length).toBeGreaterThan(0);
      });

      it("returns complete label metadata", async () => {
        const response = await client.listLabels(owner, repo);
        response.data.forEach((label) => {
          expect(label.id).toBeDefined();
          expect(label.name).toBeDefined();
          expect(label.color).toBeDefined();
        });
      });
    });
  });

  describe("Search Operations", () => {
    describe("searchIssues", () => {
      it("searches issues by query", async () => {
        const response = await client.searchIssues(
          owner,
          repo,
          "type:bug state:open",
        );
        expect(response.status).toBe(200);
        expect(response.data.total_count).toBeGreaterThan(0);
        expect(response.data.items).toBeInstanceOf(Array);
      });

      it("returns search result count", async () => {
        const response = await client.searchIssues(owner, repo, "state:open");
        expect(response.data.total_count).toBeDefined();
        expect(typeof response.data.total_count).toBe("number");
      });

      it("records search request", async () => {
        await client.searchIssues(owner, repo, "label:type:bug");
        const history = client.getRequestHistory();
        expect(history[0].method).toBe("GET");
        expect(history[0].endpoint).toContain("/search/issues");
      });
    });
  });

  describe("Label Sync Scenarios", () => {
    it("syncs labels across related issues", async () => {
      // Add labels to source issue
      await client.addLabels(owner, repo, 1001, ["type:bug", "priority:high"]);

      // Remove conflicting label
      await client.removeLabel(owner, repo, 1002, "type:feature");

      // Add same labels to target
      await client.addLabels(owner, repo, 1002, ["type:bug", "priority:high"]);

      const history = client.getRequestHistory();
      expect(history).toHaveLength(3);
      expect(history[0].method).toBe("POST"); // add
      expect(history[1].method).toBe("DELETE"); // remove
      expect(history[2].method).toBe("POST"); // add
    });

    it("handles label conflicts during sync", async () => {
      const labels = ["type:bug", "type:feature"]; // conflicting labels
      const response = await client.addLabels(owner, repo, 1001, labels);
      expect(response.status).toBe(200);
      expect(response.data.length).toBe(2); // both added (validation happens elsewhere)
    });

    it("validates label existence before application", async () => {
      const response = await client.listLabels(owner, repo);
      const availableLabels = response.data.map((l) => l.name);
      expect(availableLabels.length).toBeGreaterThan(0);
      expect(availableLabels).toContain("type:bug");
    });
  });

  describe("Error Handling", () => {
    it("handles missing authorization", () => {
      expect(() => new GitHubAPIClient()).toThrow("GitHub token required");
    });

    it("records all API requests for audit", async () => {
      await client.addLabels(owner, repo, 1001, ["type:bug"]);
      await client.removeLabel(owner, repo, 1001, "type:feature");
      await client.getIssue(owner, repo, 1001);

      const history = client.getRequestHistory();
      expect(history).toHaveLength(3);
      expect(history.every((r) => r.timestamp)).toBe(true);
    });

    it("allows clearing request history", async () => {
      await client.getIssue(owner, repo, 1001);
      client.clearRequestHistory();
      expect(client.getRequestHistory()).toHaveLength(0);
    });
  });
});
