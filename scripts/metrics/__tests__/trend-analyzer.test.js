/**
 * Tests for Trend Analyzer — Period-over-period calculations
 */

const { TrendAnalyzer } = require("../trend-analyzer");
const { MetricsStorage } = require("../metrics-storage");
const fs = require("fs");

describe("TrendAnalyzer", () => {
  let analyzer;
  let storage;
  const testDir = "/tmp/trend-analyzer-test";
  const testRepo = "test-owner/test-repo";

  beforeAll(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true });
    }
    analyzer = new TrendAnalyzer(testDir);
    storage = new MetricsStorage(testDir);
  });

  afterAll(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true });
    }
  });

  describe("calculateWeeklyTrend", () => {
    test("calculates week-over-week changes", () => {
      const now = Date.now();
      const dayMs = 24 * 60 * 60 * 1000;

      // Add metrics for two weeks
      for (let i = 0; i < 14; i++) {
        const metrics = {
          issues: { total: 100 + i * 5, closed: 75 + i * 3 },
          pull_requests: { total: 50 + i * 2, merged: 45 + i * 2 },
          contributors: { active: 12 },
        };
        storage.saveMetrics(testRepo, metrics, now - (14 - i) * dayMs);
      }

      const trend = analyzer.calculateWeeklyTrend(testRepo);
      expect(trend).not.toBeNull();
      expect(trend.period).toBe("week-over-week");
      expect(trend.changes).toHaveProperty("issues");
    });

    test("returns null with insufficient data", () => {
      const trend = analyzer.calculateWeeklyTrend("insufficient/repo");
      expect(trend).toBeNull();
    });
  });

  describe("calculateMonthlyTrend", () => {
    test("calculates month-over-month changes", () => {
      const now = Date.now();
      const dayMs = 24 * 60 * 60 * 1000;

      for (let i = 0; i < 60; i++) {
        const metrics = {
          issues: { total: 100 + i, closed: 75 + i },
          pull_requests: { total: 50 + i, merged: 45 + i },
          contributors: { active: 12 + (i % 5) },
        };
        storage.saveMetrics(testRepo, metrics, now - (60 - i) * dayMs);
      }

      const trend = analyzer.calculateMonthlyTrend(testRepo);
      expect(trend).not.toBeNull();
      expect(trend.period).toBe("month-over-month");
    });
  });

  describe("getGrowthRate", () => {
    test("calculates growth rate for metric", () => {
      const now = Date.now();
      const dayMs = 24 * 60 * 60 * 1000;

      storage.saveMetrics(
        "growth/repo",
        {
          issues: { total: 100 },
          pull_requests: { total: 50 },
          contributors: { active: 10 },
        },
        now - 30 * dayMs,
      );
      storage.saveMetrics(
        "growth/repo",
        {
          issues: { total: 120 },
          pull_requests: { total: 50 },
          contributors: { active: 10 },
        },
        now,
      );

      const growthRate = analyzer.getGrowthRate(
        "growth/repo",
        "metrics.issues.total",
        30,
      );
      expect(growthRate).toBeGreaterThan(0);
    });
  });

  describe("predictNextValue", () => {
    test("predicts future metric values", () => {
      const now = Date.now();
      const dayMs = 24 * 60 * 60 * 1000;

      for (let i = 0; i < 10; i++) {
        const metrics = {
          issues: { total: 100 + i * 10 },
          pull_requests: { total: 50 },
          contributors: { active: 10 },
        };
        storage.saveMetrics("predict/repo", metrics, now - (10 - i) * dayMs);
      }

      const predicted = analyzer.predictNextValue(
        "predict/repo",
        "metrics.issues.total",
        10,
      );
      expect(predicted).not.toBeNull();
      expect(typeof predicted).toBe("number");
    });

    test("returns null with insufficient data", () => {
      const predicted = analyzer.predictNextValue(
        "insufficient/repo",
        "metrics.issues.total",
      );
      expect(predicted).toBeNull();
    });
  });

  describe("averageMetrics", () => {
    test("calculates average across multiple entries", () => {
      const entries = [
        {
          metrics: {
            issues: { total: 100 },
            pull_requests: { total: 50 },
            contributors: { active: 10 },
          },
        },
        {
          metrics: {
            issues: { total: 120 },
            pull_requests: { total: 60 },
            contributors: { active: 12 },
          },
        },
        {
          metrics: {
            issues: { total: 110 },
            pull_requests: { total: 55 },
            contributors: { active: 11 },
          },
        },
      ];

      const avg = analyzer.averageMetrics(entries);
      expect(avg.metrics.issues.total).toBe(110);
    });
  });
});
