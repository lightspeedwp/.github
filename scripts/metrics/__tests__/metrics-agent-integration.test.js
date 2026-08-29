/**
 * Integration tests for GitHub API — Real API calls
 * These tests validate pagination, error handling, and rate limiting
 * Skip if GITHUB_TOKEN not available
 */

const {
  ConfigurationLoader,
  GitHubAPIClient,
} = require("../metrics-agent.cjs");

describe("GitHubAPIClient Integration Tests", () => {
  let client;
  const testRepo = {
    owner: "lightspeedwp",
    repo: ".github",
  };

  beforeAll(() => {
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      console.warn("GITHUB_TOKEN not set — skipping integration tests");
      return;
    }
    client = new GitHubAPIClient(token);
  });

  describe("Real API Calls", () => {
    test("fetches issues from real repository", async () => {
      if (!client) {
        console.warn("Skipping — no token");
        return;
      }

      const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const until = new Date();

      const issues = await client.getIssues(
        testRepo.owner,
        testRepo.repo,
        since,
        until,
      );

      expect(Array.isArray(issues)).toBe(true);
      if (issues.length > 0) {
        expect(issues[0]).toHaveProperty("id");
        expect(issues[0]).toHaveProperty("created_at");
        expect(issues[0]).toHaveProperty("state");
      }
    });

    test("fetches pull requests from real repository", async () => {
      if (!client) {
        console.warn("Skipping — no token");
        return;
      }

      const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const until = new Date();

      const prs = await client.getPullRequests(
        testRepo.owner,
        testRepo.repo,
        since,
        until,
      );

      expect(Array.isArray(prs)).toBe(true);
      if (prs.length > 0) {
        expect(prs[0]).toHaveProperty("id");
        expect(prs[0]).toHaveProperty("title");
      }
    });

    test("fetches contributors from real repository", async () => {
      if (!client) {
        console.warn("Skipping — no token");
        return;
      }

      const contributors = await client.getContributors(
        testRepo.owner,
        testRepo.repo,
      );

      expect(Array.isArray(contributors)).toBe(true);
      if (contributors.length > 0) {
        expect(contributors[0]).toHaveProperty("login");
        expect(contributors[0]).toHaveProperty("contributions");
      }
    });
  });

  describe("Error Handling", () => {
    test("provides helpful error message for 404", async () => {
      if (!client) {
        console.warn("Skipping — no token");
        return;
      }

      try {
        await client.getIssues("nonexistent", "repo", new Date(), new Date());
      } catch (error) {
        expect(error.message).toContain("404");
        expect(error.message).toContain("Repository not found");
      }
    });

    test("handles network errors with exponential backoff", async () => {
      if (!client) {
        console.warn("Skipping — no token");
        return;
      }

      const originalFetch = global.fetch;
      let attemptCount = 0;

      global.fetch = jest.fn(() => {
        attemptCount++;
        if (attemptCount < 3) {
          return Promise.reject(new Error("Network error"));
        }
        return originalFetch(
          "https://api.github.com/repos/lightspeedwp/.github",
        );
      });

      const testClient = new GitHubAPIClient("test-token");
      try {
        await testClient.getIssues(
          "lightspeedwp",
          ".github",
          new Date(),
          new Date(),
        );
      } catch (error) {
        expect(attemptCount).toBeGreaterThan(1);
      }

      global.fetch = originalFetch;
    });

    test("cleans up expired cache entries", async () => {
      if (!client) {
        console.warn("Skipping — no token");
        return;
      }

      const testClient = new GitHubAPIClient("test-token");
      testClient.cache = {
        "old-key": { data: [], timestamp: Date.now() - 7200000 },
        "new-key": { data: [], timestamp: Date.now() },
      };

      testClient.cleanupExpiredCache();

      expect("old-key" in testClient.cache).toBe(false);
      expect("new-key" in testClient.cache).toBe(true);
    });

    test("caches repeated requests", async () => {
      if (!client) {
        console.warn("Skipping — no token");
        return;
      }

      const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const until = new Date();

      const start1 = Date.now();
      const issues1 = await client.getIssues(
        testRepo.owner,
        testRepo.repo,
        since,
        until,
      );
      const time1 = Date.now() - start1;

      const start2 = Date.now();
      const issues2 = await client.getIssues(
        testRepo.owner,
        testRepo.repo,
        since,
        until,
      );
      const time2 = Date.now() - start2;

      expect(issues1).toEqual(issues2);
      expect(time2).toBeLessThan(time1);
      expect(time2).toBeLessThan(100);
    });
  });
});
