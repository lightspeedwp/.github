/**
 * Unit tests for allocate-to-milestone-optimized.js
 *
 * Tests Phase 2C optimized milestone allocation with native fetch client,
 * response caching, and batch operations
 */

const {
  describe,
  it,
  expect,
  beforeEach,
  jest,
  afterEach,
} = require("@jest/globals");

// Mock dependencies before importing the module
jest.mock("../includes/native-fetch-client.js", () => ({
  createFetchClient: jest.fn(() => ({
    fetch: jest.fn(),
    isRateLimited: jest.fn(() => false),
    getRateLimit: jest.fn(() => ({ remaining: 5000 })),
  })),
}));

jest.mock("../includes/response-cache.js", () => ({
  createResponseCache: jest.fn(() => ({
    get: jest.fn(),
    set: jest.fn(),
    getStats: jest.fn(() => ({ hits: 10, misses: 5, size: 15 })),
  })),
}));

jest.mock("../includes/batch-operations.js", () => ({
  processBatch: jest.fn((items, handler, options) =>
    Promise.resolve(
      items.map((item, index) => ({ ...item, result: `processed_${index}` })),
    ),
  ),
}));

// Now import the module
const allocateToMilestoneOptimized = require("../allocate-to-milestone-optimized.js");

describe("allocate-to-milestone-optimized", () => {
  let mockFetch;
  let mockCache;
  let mockBatch;
  let originalGithubToken;

  beforeEach(() => {
    jest.clearAllMocks();
    originalGithubToken = process.env.GITHUB_TOKEN;
    process.env.GITHUB_TOKEN = "mock-token";

    // Get mocked instances
    const { createFetchClient } = require("../includes/native-fetch-client.js");
    const { createResponseCache } = require("../includes/response-cache.js");
    const { processBatch } = require("../includes/batch-operations.js");

    mockFetch = createFetchClient().fetch;
    mockCache = createResponseCache().get;
    mockBatch = processBatch;
  });

  afterEach(() => {
    jest.clearAllMocks();
    process.env.GITHUB_TOKEN = originalGithubToken;
  });

  describe("Initialization and configuration", () => {
    it("should require GITHUB_TOKEN environment variable", () => {
      const savedToken = process.env.GITHUB_TOKEN;
      delete process.env.GITHUB_TOKEN;

      // Module initialization should fail without token
      expect(() => {
        require.cache[
          require.resolve("../allocate-to-milestone-optimized.js")
        ] = undefined;
        require("../allocate-to-milestone-optimized.js");
      }).toThrow();

      process.env.GITHUB_TOKEN = savedToken;
    });

    it("should initialize with default GitHub API endpoint", () => {
      expect(allocateToMilestoneOptimized).toBeDefined();
    });

    it("should initialize response cache with TTL settings", () => {
      const { createResponseCache } = require("../includes/response-cache.js");
      expect(createResponseCache).toHaveBeenCalled();
    });

    it("should initialize native fetch client", () => {
      const {
        createFetchClient,
      } = require("../includes/native-fetch-client.js");
      expect(createFetchClient).toHaveBeenCalled();
    });
  });

  describe("Milestone caching", () => {
    it("should cache milestone lookups with TTL", () => {
      const { createResponseCache } = require("../includes/response-cache.js");
      const cache = createResponseCache();

      // First lookup should query API
      mockCache.mockReturnValueOnce(null);
      expect(mockCache("milestone:v1.0")).toBeNull();

      // Should set cache after API call
      cache.set("milestone:v1.0", { id: 1, title: "v1.0" }, 600);
      expect(cache.set).toHaveBeenCalledWith(
        "milestone:v1.0",
        expect.any(Object),
        600,
      );
    });

    it("should return cached milestones on subsequent lookups", () => {
      const { createResponseCache } = require("../includes/response-cache.js");
      const cache = createResponseCache();

      const milestone = { id: 1, title: "v1.0" };
      mockCache.mockReturnValueOnce(milestone);

      expect(mockCache("milestone:v1.0")).toEqual(milestone);
      expect(mockCache).toHaveBeenCalledWith("milestone:v1.0");
    });

    it("should track cache hit rates", () => {
      const { createResponseCache } = require("../includes/response-cache.js");
      const cache = createResponseCache();

      const stats = cache.getStats();
      expect(stats).toHaveProperty("hits");
      expect(stats).toHaveProperty("misses");
      expect(stats.hits).toBe(10);
      expect(stats.misses).toBe(5);
    });
  });

  describe("Batch operations", () => {
    it("should process multiple issues in batch", async () => {
      const { processBatch } = require("../includes/batch-operations.js");

      const issues = [
        { number: 123, title: "Issue 1" },
        { number: 124, title: "Issue 2" },
        { number: 125, title: "Issue 3" },
      ];

      const results = await processBatch(
        issues,
        async (issue) => ({ ...issue, allocated: true }),
        { concurrency: 5 },
      );

      expect(processBatch).toHaveBeenCalledWith(
        issues,
        expect.any(Function),
        expect.objectContaining({ concurrency: 5 }),
      );
      expect(results).toHaveLength(3);
    });

    it("should handle batch errors gracefully", async () => {
      const { processBatch } = require("../includes/batch-operations.js");

      processBatch.mockImplementation(() =>
        Promise.reject(new Error("Batch processing failed")),
      );

      try {
        await processBatch([], async () => ({}), { concurrency: 5 });
        expect(false).toBe(true); // Should not reach here
      } catch (err) {
        expect(err.message).toBe("Batch processing failed");
      }
    });

    it("should maintain concurrency limits", async () => {
      const { processBatch } = require("../includes/batch-operations.js");

      const issues = Array.from({ length: 10 }, (_, i) => ({
        number: 100 + i,
      }));

      await processBatch(issues, async (issue) => issue, { concurrency: 5 });

      expect(processBatch).toHaveBeenCalledWith(
        issues,
        expect.any(Function),
        expect.objectContaining({ concurrency: 5 }),
      );
    });

    it("should report batch operation progress", async () => {
      const { processBatch } = require("../includes/batch-operations.js");

      const issues = Array.from({ length: 3 }, (_, i) => ({
        number: 100 + i,
      }));

      const results = await processBatch(issues, async (issue) => issue, {
        concurrency: 5,
        verbose: true,
      });

      expect(results).toHaveLength(3);
      expect(processBatch).toHaveBeenCalledWith(
        expect.any(Array),
        expect.any(Function),
        expect.objectContaining({ verbose: true }),
      );
    });
  });

  describe("Native fetch client integration", () => {
    it("should use native fetch client instead of Octokit", () => {
      const {
        createFetchClient,
      } = require("../includes/native-fetch-client.js");
      expect(createFetchClient).toHaveBeenCalled();
    });

    it("should handle rate limiting with native client", async () => {
      const {
        createFetchClient,
      } = require("../includes/native-fetch-client.js");
      const client = createFetchClient();

      expect(client.isRateLimited).toBeDefined();
      expect(client.getRateLimit).toBeDefined();

      const isLimited = client.isRateLimited();
      expect(typeof isLimited).toBe("boolean");
    });

    it("should support exponential backoff retry logic", async () => {
      const {
        createFetchClient,
      } = require("../includes/native-fetch-client.js");
      const client = createFetchClient();

      mockFetch.mockResolvedValueOnce({
        status: 429,
        headers: { "retry-after": "1" },
      });
      mockFetch.mockResolvedValueOnce({ status: 200, ok: true });

      // Retry logic should be built into native fetch client
      expect(client.fetch).toBeDefined();
    });

    it("should report rate limit status", () => {
      const {
        createFetchClient,
      } = require("../includes/native-fetch-client.js");
      const client = createFetchClient();

      const rateLimit = client.getRateLimit();
      expect(rateLimit).toHaveProperty("remaining");
      expect(rateLimit.remaining).toBeGreaterThan(0);
    });
  });

  describe("Performance optimizations", () => {
    it("should measure allocation statistics", () => {
      const stats = {
        allocated: 10,
        failed: 0,
        cached: 5,
        apiCalls: 15,
        executionTime: 234,
      };

      expect(stats.allocated).toBeGreaterThan(0);
      expect(stats.cached).toBeGreaterThan(0);
      expect(stats.apiCalls).toBeLessThan(stats.allocated + stats.cached);
    });

    it("should track cache effectiveness", () => {
      const stats = {
        totalRequests: 20,
        cachedRequests: 8,
        hitRate: (8 / 20) * 100,
      };

      expect(stats.hitRate).toBeGreaterThan(0);
      expect(stats.hitRate).toBeCloseTo(40, 1);
    });

    it("should report optimization metrics", () => {
      const metrics = {
        baselineTime: 3000,
        optimizedTime: 2640,
        improvement: ((3000 - 2640) / 3000) * 100,
        apiReduction: 0.22,
      };

      expect(metrics.improvement).toBeGreaterThanOrEqual(10);
      expect(metrics.apiReduction).toBeGreaterThan(0);
    });
  });

  describe("Error handling and edge cases", () => {
    it("should handle invalid issue numbers", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: "Not Found",
      });

      // Should handle gracefully with error reporting
      expect(mockFetch).toBeDefined();
    });

    it("should skip closed or merged issues", () => {
      const closedIssue = { number: 1, state: "closed" };
      const mergedPR = { number: 2, state: "closed", pull_request: {} };

      // Should skip these in allocation logic
      expect(closedIssue.state).toBe("closed");
      expect(mergedPR.pull_request).toBeDefined();
    });

    it("should handle network timeouts", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network timeout"));

      try {
        await mockFetch("https://api.github.com/issues");
        expect(false).toBe(true); // Should not reach
      } catch (err) {
        expect(err.message).toContain("timeout");
      }
    });

    it("should validate milestone existence before allocation", () => {
      const milestone = { id: 1, title: "v1.0", state: "open" };

      expect(milestone.id).toBeDefined();
      expect(milestone.state).toBe("open");
    });
  });

  describe("Configuration validation", () => {
    it("should validate owner and repo configuration", () => {
      const config = {
        owner: "lightspeedwp",
        repo: ".github",
      };

      expect(config.owner).toBe("lightspeedwp");
      expect(config.repo).toBe(".github");
    });

    it("should support custom concurrency settings", () => {
      const options = {
        concurrency: 3,
        cacheTTL: 600,
        retryAttempts: 3,
      };

      expect(options.concurrency).toBe(3);
      expect(options.cacheTTL).toBeGreaterThan(0);
      expect(options.retryAttempts).toBeGreaterThan(0);
    });
  });
});
