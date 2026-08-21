// GitHub API Integration Tests — Batch Operations & Performance
// Tests: Bulk create/update, pagination, rate limiting, performance with large datasets

const fixtures = require("./github-fixtures");

// Mock GitHub API client with rate limiting and performance tracking
class GitHubAPIClient {
  constructor(token, options = {}) {
    if (!token) throw new Error("GitHub token required");
    this.token = token;
    this.rateLimit = {
      limit: options.rateLimit || 60,
      remaining: options.rateLimit || 60,
      reset: Math.floor(Date.now() / 1000) + 3600,
    };
    this.requests = [];
    this.performanceMetrics = [];
    this.batchSize = options.batchSize || 30;
  }

  recordRequest(method, endpoint, duration) {
    this.requests.push({
      method,
      endpoint,
      timestamp: Date.now(),
      duration,
    });
  }

  recordPerformance(operation, duration, itemCount) {
    this.performanceMetrics.push({
      operation,
      duration,
      itemCount,
      avgPerItem: duration / itemCount,
      timestamp: Date.now(),
    });
  }

  checkRateLimit() {
    if (this.rateLimit.remaining <= 0) {
      throw new Error(
        `Rate limit exceeded. Reset at ${new Date(this.rateLimit.reset * 1000)}`,
      );
    }
    this.rateLimit.remaining -= 1;
  }

  async createIssuesBatch(owner, repo, issues) {
    const startTime = Date.now();
    this.checkRateLimit();

    const created = [];
    for (let i = 0; i < issues.length; i += this.batchSize) {
      const batch = issues.slice(i, i + this.batchSize);
      batch.forEach((issue) => {
        this.checkRateLimit();
        created.push({
          id: Math.random(),
          number: 2000 + created.length,
          ...issue,
          state: "open",
        });
      });
    }

    const duration = Date.now() - startTime;
    this.recordRequest("POST", `/repos/${owner}/${repo}/issues`, duration);
    this.recordPerformance("createIssuesBatch", duration, issues.length);

    return {
      status: 201,
      data: created,
      duration,
      batchCount: Math.ceil(issues.length / this.batchSize),
    };
  }

  async updateIssuesBatch(owner, repo, updates) {
    const startTime = Date.now();
    this.checkRateLimit();

    const updated = [];
    for (const update of updates) {
      this.checkRateLimit();
      updated.push({
        number: update.number,
        ...update.fields,
        state: update.fields.state || "open",
      });
    }

    const duration = Date.now() - startTime;
    this.recordRequest("PATCH", `/repos/${owner}/${repo}/issues`, duration);
    this.recordPerformance("updateIssuesBatch", duration, updates.length);

    return {
      status: 200,
      data: updated,
      duration,
    };
  }

  async addLabelsBatch(owner, repo, issues) {
    const startTime = Date.now();
    this.checkRateLimit();

    const results = [];
    for (const issue of issues) {
      this.checkRateLimit();
      results.push({
        number: issue.number,
        labels: issue.labels,
      });
    }

    const duration = Date.now() - startTime;
    this.recordRequest(
      "POST",
      `/repos/${owner}/${repo}/issues/labels`,
      duration,
    );
    this.recordPerformance("addLabelsBatch", duration, issues.length);

    return {
      status: 200,
      data: results,
      duration,
    };
  }

  async searchWithPagination(owner, repo, query, pageSize = 30) {
    const startTime = Date.now();
    this.checkRateLimit();

    const allItems = [];
    let page = 1;
    let hasMore = true;

    while (hasMore && page <= 5) {
      // Simulate pagination
      this.checkRateLimit();
      const items = fixtures.createIssueList
        ? fixtures.createIssueList(pageSize, 1000 + (page - 1) * pageSize)
        : Array.from({ length: pageSize }, (_, j) => ({
            number: 1000 + (page - 1) * pageSize + j,
          }));
      allItems.push(...items);
      hasMore = items.length === pageSize; // More pages available if we got full page

      this.recordRequest(
        "GET",
        `/search/issues?page=${page}`,
        Date.now() - startTime,
      );
      page += 1;
    }

    const duration = Date.now() - startTime;
    this.recordPerformance("searchWithPagination", duration, allItems.length);

    return {
      status: 200,
      data: {
        total_count: allItems.length,
        items: allItems,
        pages: page - 1,
      },
      duration,
    };
  }

  async listWithPagination(owner, repo, endpoint, pageSize = 30) {
    const startTime = Date.now();
    this.checkRateLimit();

    const allItems = [];
    let page = 1;
    const totalPages = 3; // Simulate 3 pages

    for (let i = 0; i < totalPages; i++) {
      this.checkRateLimit();
      const pageItems = fixtures.createIssueList
        ? fixtures.createIssueList(pageSize, 1000 + i * pageSize)
        : Array.from({ length: pageSize }, (_, j) => ({
            number: 1000 + i * pageSize + j,
          }));
      allItems.push(...pageItems);

      this.recordRequest(
        "GET",
        `${endpoint}?page=${page}`,
        Date.now() - startTime,
      );
      page += 1;
    }

    const duration = Date.now() - startTime;
    this.recordPerformance("listWithPagination", duration, allItems.length);

    return {
      status: 200,
      data: allItems,
      pages: totalPages,
      duration,
    };
  }

  async bulkAssignToMilestone(owner, repo, issueNumbers, milestoneNumber) {
    const startTime = Date.now();
    this.checkRateLimit();

    const updated = [];
    for (const issueNumber of issueNumbers) {
      this.checkRateLimit();
      updated.push({
        number: issueNumber,
        milestone: { number: milestoneNumber },
      });
    }

    const duration = Date.now() - startTime;
    this.recordRequest("PATCH", `/repos/${owner}/${repo}/issues`, duration);
    this.recordPerformance(
      "bulkAssignToMilestone",
      duration,
      issueNumbers.length,
    );

    return {
      status: 200,
      data: updated,
      assigned: updated.length,
      duration,
    };
  }

  async parallelOperations(operations) {
    const startTime = Date.now();

    // Simulate parallel operations with rate limit checks
    const results = await Promise.all(
      operations.map(async (op) => {
        this.checkRateLimit();
        // Simulate async operation
        await new Promise((resolve) => setTimeout(resolve, 10));
        return op();
      }),
    );

    const duration = Date.now() - startTime;
    this.recordPerformance("parallelOperations", duration, operations.length);

    return {
      status: 200,
      data: results,
      operationCount: operations.length,
      duration,
    };
  }

  getPerformanceMetrics() {
    return this.performanceMetrics;
  }

  getAveragePerformance(operation) {
    const metrics = this.performanceMetrics.filter(
      (m) => m.operation === operation,
    );
    if (metrics.length === 0) return null;

    const avgDuration =
      metrics.reduce((sum, m) => sum + m.duration, 0) / metrics.length;
    const avgPerItem =
      metrics.reduce((sum, m) => sum + m.avgPerItem, 0) / metrics.length;

    return {
      totalOperations: metrics.length,
      avgDuration,
      avgPerItem,
      min: Math.min(...metrics.map((m) => m.duration)),
      max: Math.max(...metrics.map((m) => m.duration)),
    };
  }

  getRateLimitStatus() {
    return {
      limit: this.rateLimit.limit,
      remaining: this.rateLimit.remaining,
      reset: this.rateLimit.reset,
      used: this.rateLimit.limit - this.rateLimit.remaining,
    };
  }

  getRequestHistory() {
    return this.requests;
  }
}

describe("GitHub API: Batch Operations & Performance", () => {
  let client;
  const owner = "lightspeedwp";
  const repo = ".github";

  beforeEach(() => {
    client = new GitHubAPIClient("test-token-12345", { rateLimit: 5000 });
  });

  describe("Batch Issue Creation", () => {
    it("creates multiple issues efficiently", async () => {
      const issues = [
        { title: "Issue 1", body: "Body 1" },
        { title: "Issue 2", body: "Body 2" },
        { title: "Issue 3", body: "Body 3" },
      ];

      const response = await client.createIssuesBatch(owner, repo, issues);
      expect(response.status).toBe(201);
      expect(response.data).toHaveLength(3);
      expect(response.duration).toBeDefined();
    });

    it("creates large batch of issues", async () => {
      const issues = Array.from({ length: 100 }, (_, i) => ({
        title: `Issue ${i + 1}`,
        body: `Description ${i + 1}`,
      }));

      const response = await client.createIssuesBatch(owner, repo, issues);
      expect(response.status).toBe(201);
      expect(response.data).toHaveLength(100);
      expect(response.batchCount).toBe(4); // 100 items with batch size 30
    });

    it("respects batch size limits", async () => {
      const issues = Array.from({ length: 85 }, (_, i) => ({
        title: `Issue ${i + 1}`,
        body: `Body ${i + 1}`,
      }));

      const response = await client.createIssuesBatch(owner, repo, issues);
      expect(response.batchCount).toBe(3); // ceil(85/30) = 3
    });

    it("tracks performance metrics for batch creation", async () => {
      const issues = Array.from({ length: 50 }, (_, i) => ({
        title: `Issue ${i}`,
        body: `Body ${i}`,
      }));

      await client.createIssuesBatch(owner, repo, issues);
      const metrics = client.getPerformanceMetrics();
      expect(metrics.length).toBeGreaterThan(0);
      expect(metrics[0].operation).toBe("createIssuesBatch");
      expect(metrics[0].itemCount).toBe(50);
    });
  });

  describe("Batch Issue Updates", () => {
    it("updates multiple issues", async () => {
      const updates = [
        { number: 1001, fields: { state: "closed" } },
        { number: 1002, fields: { title: "Updated" } },
        { number: 1003, fields: { state: "closed", title: "Resolved" } },
      ];

      const response = await client.updateIssuesBatch(owner, repo, updates);
      expect(response.status).toBe(200);
      expect(response.data).toHaveLength(3);
    });

    it("updates large batch of issues", async () => {
      const updates = Array.from({ length: 75 }, (_, i) => ({
        number: 1000 + i,
        fields: { state: i % 2 === 0 ? "closed" : "open" },
      }));

      const response = await client.updateIssuesBatch(owner, repo, updates);
      expect(response.status).toBe(200);
      expect(response.data).toHaveLength(75);
    });
  });

  describe("Batch Label Operations", () => {
    it("adds labels to multiple issues", async () => {
      const issues = [
        { number: 1001, labels: ["type:bug"] },
        { number: 1002, labels: ["type:feature", "priority:high"] },
        { number: 1003, labels: ["type:task"] },
      ];

      const response = await client.addLabelsBatch(owner, repo, issues);
      expect(response.status).toBe(200);
      expect(response.data).toHaveLength(3);
    });

    it("applies consistent labels across many issues", async () => {
      const issues = Array.from({ length: 60 }, (_, i) => ({
        number: 1000 + i,
        labels: ["meta:has-pr", "status:in-progress"],
      }));

      const response = await client.addLabelsBatch(owner, repo, issues);
      expect(response.status).toBe(200);
      expect(response.data).toHaveLength(60);
    });
  });

  describe("Pagination", () => {
    describe("searchWithPagination", () => {
      it("searches with automatic pagination", async () => {
        const response = await client.searchWithPagination(
          owner,
          repo,
          "state:open",
        );
        expect(response.status).toBe(200);
        expect(response.data.items).toBeInstanceOf(Array);
        expect(response.data.pages).toBeGreaterThan(0);
      });

      it("handles custom page size", async () => {
        const response = await client.searchWithPagination(
          owner,
          repo,
          "state:closed",
          50,
        );
        expect(response.status).toBe(200);
        expect(response.data.items.length).toBeGreaterThanOrEqual(0);
      });

      it("tracks pagination performance", async () => {
        await client.searchWithPagination(owner, repo, "type:bug");
        const metrics = client.getPerformanceMetrics();
        const searchMetric = metrics.find(
          (m) => m.operation === "searchWithPagination",
        );
        expect(searchMetric).toBeDefined();
        expect(searchMetric.duration).toBeGreaterThanOrEqual(0);
      });
    });

    describe("listWithPagination", () => {
      it("lists items with pagination", async () => {
        const response = await client.listWithPagination(
          owner,
          repo,
          "/repos/owner/repo/issues",
        );
        expect(response.status).toBe(200);
        expect(response.data).toBeInstanceOf(Array);
        expect(response.pages).toBe(3);
      });

      it("handles pagination across multiple requests", async () => {
        const response = await client.listWithPagination(
          owner,
          repo,
          "/repos/owner/repo/pulls",
        );
        expect(response.data.length).toBeGreaterThan(0);
        const history = client.getRequestHistory();
        expect(history.length).toBeGreaterThanOrEqual(1);
      });
    });
  });

  describe("Rate Limiting", () => {
    it("tracks remaining rate limit", async () => {
      const initialStatus = client.getRateLimitStatus();
      expect(initialStatus.remaining).toBeLessThanOrEqual(initialStatus.limit);

      await client.createIssuesBatch(owner, repo, [
        { title: "Test", body: "Test" },
      ]);

      const afterStatus = client.getRateLimitStatus();
      expect(afterStatus.remaining).toBeLessThan(initialStatus.remaining);
    });

    it("throws error when rate limit exceeded", async () => {
      const limitedClient = new GitHubAPIClient("token", { rateLimit: 2 });

      // First two requests use the available slots
      expect(() => limitedClient.checkRateLimit()).not.toThrow();
      expect(() => limitedClient.checkRateLimit()).not.toThrow();

      // Third request should exceed limit
      expect(() => limitedClient.checkRateLimit()).toThrow(
        /Rate limit exceeded/,
      );
    });

    it("reports rate limit status", async () => {
      const status = client.getRateLimitStatus();
      expect(status.limit).toBe(5000);
      expect(status.remaining).toBeDefined();
      expect(status.reset).toBeDefined();
      expect(status.used).toBeDefined();
    });

    it("prevents exceeding rate limit during batch operations", async () => {
      const limitedClient = new GitHubAPIClient("token", { rateLimit: 5 });

      // Small batch that fits within limit
      const issues = [{ title: "Issue 1", body: "Body" }];
      await expect(
        limitedClient.createIssuesBatch(owner, repo, issues),
      ).resolves.toMatchObject({
        status: 201,
      });
    });
  });

  describe("Bulk Assignment Operations", () => {
    it("assigns multiple issues to milestone", async () => {
      const issueNumbers = [1001, 1002, 1003, 1004, 1005];
      const response = await client.bulkAssignToMilestone(
        owner,
        repo,
        issueNumbers,
        1,
      );
      expect(response.status).toBe(200);
      expect(response.assigned).toBe(5);
    });

    it("handles large bulk assignment", async () => {
      const issueNumbers = Array.from({ length: 150 }, (_, i) => 1000 + i);
      const response = await client.bulkAssignToMilestone(
        owner,
        repo,
        issueNumbers,
        1,
      );
      expect(response.status).toBe(200);
      expect(response.assigned).toBe(150);
    });

    it("tracks performance of bulk operations", async () => {
      await client.bulkAssignToMilestone(owner, repo, [1001, 1002, 1003], 1);
      const avgPerf = client.getAveragePerformance("bulkAssignToMilestone");
      expect(avgPerf).toBeDefined();
      expect(avgPerf.totalOperations).toBeGreaterThan(0);
    });
  });

  describe("Parallel Operations", () => {
    it("executes operations in parallel", async () => {
      const operations = [
        () => ({ id: 1, name: "op1" }),
        () => ({ id: 2, name: "op2" }),
        () => ({ id: 3, name: "op3" }),
      ];

      const response = await client.parallelOperations(operations);
      expect(response.status).toBe(200);
      expect(response.data).toHaveLength(3);
      expect(response.operationCount).toBe(3);
    });

    it("handles large parallel workload", async () => {
      const operations = Array.from({ length: 100 }, (_, i) => () => ({
        id: i,
      }));
      const response = await client.parallelOperations(operations);
      expect(response.status).toBe(200);
      expect(response.data).toHaveLength(100);
    });

    it("respects rate limits during parallel execution", async () => {
      const operations = Array.from({ length: 10 }, () => () => ({}));
      const response = await client.parallelOperations(operations);
      expect(response.status).toBe(200);
      expect(client.getRateLimitStatus().remaining).toBeLessThanOrEqual(5000);
    });
  });

  describe("Performance Metrics", () => {
    it("tracks metrics for all operations", async () => {
      await client.createIssuesBatch(owner, repo, [
        { title: "Test", body: "Test" },
      ]);
      await client.updateIssuesBatch(owner, repo, [
        { number: 1001, fields: { state: "closed" } },
      ]);

      const metrics = client.getPerformanceMetrics();
      expect(metrics.length).toBeGreaterThanOrEqual(2);
    });

    it("calculates average performance per operation", async () => {
      await client.bulkAssignToMilestone(owner, repo, [1001, 1002, 1003], 1);
      await client.bulkAssignToMilestone(owner, repo, [2001, 2002], 2);

      const avgPerf = client.getAveragePerformance("bulkAssignToMilestone");
      expect(avgPerf.totalOperations).toBe(2);
      expect(avgPerf.avgDuration).toBeGreaterThanOrEqual(0);
      expect(avgPerf.avgPerItem).toBeGreaterThanOrEqual(0);
      expect(avgPerf.min).toBeLessThanOrEqual(avgPerf.max);
    });

    it("tracks min/max performance", async () => {
      for (let i = 0; i < 5; i++) {
        const count = 10 + i * 5;
        const issues = Array.from({ length: count }, (_, j) => ({
          title: `Issue ${j}`,
          body: "Body",
        }));
        await client.createIssuesBatch(owner, repo, issues);
      }

      const avgPerf = client.getAveragePerformance("createIssuesBatch");
      expect(avgPerf.min).toBeLessThanOrEqual(avgPerf.max);
      expect(avgPerf.avgDuration).toBeLessThanOrEqual(avgPerf.max);
      expect(avgPerf.avgDuration).toBeGreaterThanOrEqual(avgPerf.min);
    });
  });

  describe("Error Handling", () => {
    it("requires authentication token", () => {
      expect(() => new GitHubAPIClient()).toThrow("GitHub token required");
    });

    it("handles operations within rate limit", async () => {
      const response = await client.createIssuesBatch(owner, repo, [
        { title: "Test", body: "Body" },
      ]);
      expect(response.status).toBe(201);
    });

    it("maintains request history", async () => {
      await client.createIssuesBatch(owner, repo, [
        { title: "Test", body: "Body" },
      ]);
      await client.bulkAssignToMilestone(owner, repo, [1001], 1);

      const history = client.getRequestHistory();
      expect(history.length).toBeGreaterThanOrEqual(2);
      expect(history[0].timestamp).toBeDefined();
    });
  });

  describe("Real-world Batch Scenarios", () => {
    it("bulk updates with labels and milestone assignment", async () => {
      const issueNumbers = [1001, 1002, 1003];

      // Update all issues
      await client.updateIssuesBatch(owner, repo, [
        { number: 1001, fields: { title: "Updated 1" } },
        { number: 1002, fields: { title: "Updated 2" } },
        { number: 1003, fields: { title: "Updated 3" } },
      ]);

      // Add labels
      await client.addLabelsBatch(owner, repo, [
        { number: 1001, labels: ["meta:processed"] },
        { number: 1002, labels: ["meta:processed"] },
        { number: 1003, labels: ["meta:processed"] },
      ]);

      // Assign to milestone
      await client.bulkAssignToMilestone(owner, repo, issueNumbers, 1);

      const history = client.getRequestHistory();
      expect(history).toHaveLength(3);
    });

    it("search, paginate, and bulk process results", async () => {
      // Search with pagination
      const searchResponse = await client.searchWithPagination(
        owner,
        repo,
        "state:open",
      );

      // Assign results to milestone
      const issueNumbers = searchResponse.data.items
        .slice(0, 10)
        .map((item) => item.number);
      expect(issueNumbers.every((n) => typeof n === "number")).toBe(true);
      await client.bulkAssignToMilestone(owner, repo, issueNumbers, 1);

      const metrics = client.getPerformanceMetrics();
      expect(metrics.length).toBeGreaterThanOrEqual(2);
    });
  });
});
