/**
 * Tests for Metrics Storage — Historical data persistence
 */

const { MetricsStorage } = require("../metrics-storage");
const fs = require("fs");
const path = require("path");

describe("MetricsStorage", () => {
  let storage;
  const testDir = "/tmp/metrics-storage-test";
  const testRepo = "test-owner/test-repo";
  const testMetrics = {
    issues: { total: 100, closed: 75, active: 25 },
    pull_requests: { total: 50, merged: 45 },
    contributors: { active: 12 },
  };

  beforeAll(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true });
    }
    storage = new MetricsStorage(testDir);
  });

  afterAll(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true });
    }
  });

  describe("saveMetrics", () => {
    test("saves metrics to file", () => {
      const count = storage.saveMetrics(testRepo, testMetrics);

      expect(count).toBe(1);
      const filePath = storage.getStoragePath(testRepo);
      expect(fs.existsSync(filePath)).toBe(true);
    });

    test("appends metrics to existing history", () => {
      storage.saveMetrics(testRepo, testMetrics);
      const count = storage.saveMetrics(testRepo, testMetrics);

      expect(count).toBeGreaterThanOrEqual(2);
    });

    test("validates metrics structure", () => {
      expect(() => {
        storage.saveMetrics(testRepo, { invalid: "structure" });
      }).toThrow("Invalid metrics structure");
    });

    test("preserves last 90 days of data", () => {
      const ninetyOneDaysAgo = Date.now() - 91 * 24 * 60 * 60 * 1000;
      const eightynineDaysAgo = Date.now() - 89 * 24 * 60 * 60 * 1000;

      storage.saveMetrics("preserve-test/repo", testMetrics, ninetyOneDaysAgo);
      storage.saveMetrics("preserve-test/repo", testMetrics, eightynineDaysAgo);
      storage.deleteOldEntries("preserve-test/repo", 90);

      const history = storage.loadMetrics("preserve-test/repo");
      expect(history.every((e) => e.timestamp >= eightynineDaysAgo)).toBe(true);
    });
  });

  describe("loadMetrics", () => {
    test("loads all metrics from file", () => {
      storage.saveMetrics(testRepo, testMetrics);
      storage.saveMetrics(testRepo, testMetrics);

      const history = storage.loadMetrics(testRepo);
      expect(Array.isArray(history)).toBe(true);
      expect(history.length).toBeGreaterThan(0);
    });

    test("returns empty array for non-existent repository", () => {
      const history = storage.loadMetrics("non-existent/repo");
      expect(history).toEqual([]);
    });
  });

  describe("getMetricsSince", () => {
    test("filters metrics by time range", () => {
      const now = Date.now();
      storage.saveMetrics(
        testRepo,
        testMetrics,
        now - 10 * 24 * 60 * 60 * 1000,
      );
      storage.saveMetrics(testRepo, testMetrics, now - 2 * 24 * 60 * 60 * 1000);

      const recentMetrics = storage.getMetricsSince(testRepo, 7);
      expect(recentMetrics.length).toBeGreaterThan(0);
    });
  });

  describe("getLatestMetrics", () => {
    test("returns most recent metrics", () => {
      storage.saveMetrics(testRepo, testMetrics);
      const latest = storage.getLatestMetrics(testRepo);

      expect(latest).not.toBeNull();
      expect(latest.metrics).toEqual(testMetrics);
    });
  });

  describe("validateMetrics", () => {
    test("validates correct metrics structure", () => {
      expect(storage.validateMetrics(testMetrics)).toBe(true);
    });

    test("rejects invalid structures", () => {
      expect(storage.validateMetrics(null)).toBe(false);
      expect(storage.validateMetrics({})).toBe(false);
      expect(storage.validateMetrics({ issues: {} })).toBe(false);
    });
  });

  describe("getAllRepositories", () => {
    test("lists all tracked repositories", () => {
      storage.saveMetrics("repo1/test", testMetrics);
      storage.saveMetrics("repo2/test", testMetrics);

      const repos = storage.getAllRepositories();
      expect(repos.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("deleteOldEntries", () => {
    test("removes entries older than cutoff", () => {
      const ninetyOneDaysAgo = Date.now() - 91 * 24 * 60 * 60 * 1000;
      storage.saveMetrics("cleanup-test/repo", testMetrics, ninetyOneDaysAgo);
      storage.saveMetrics("cleanup-test/repo", testMetrics, Date.now());

      const historyBefore = storage.loadMetrics("cleanup-test/repo");
      const deleted = storage.deleteOldEntries("cleanup-test/repo", 90);
      const historyAfter = storage.loadMetrics("cleanup-test/repo");

      expect(historyBefore.length).toBeGreaterThan(historyAfter.length);
      expect(deleted).toBeGreaterThanOrEqual(0);
    });
  });
});
