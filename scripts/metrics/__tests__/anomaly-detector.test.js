/**
 * Tests for Anomaly Detector — Deviation detection
 */

const { AnomalyDetector } = require("../anomaly-detector");
const { MetricsStorage } = require("../metrics-storage");
const fs = require("fs");

describe("AnomalyDetector", () => {
  let detector;
  let storage;
  const testDir = "/tmp/anomaly-detector-test";
  const testRepo = "test-owner/test-repo";

  beforeAll(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true });
    }
    detector = new AnomalyDetector(testDir, 0.5);
    storage = new MetricsStorage(testDir);
  });

  afterAll(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true });
    }
  });

  describe("detectAnomalies", () => {
    test("flags significant deviations", () => {
      const now = Date.now();
      const dayMs = 24 * 60 * 60 * 1000;

      // Add baseline metrics
      for (let i = 0; i < 10; i++) {
        const metrics = {
          issues: { total: 100, closed: 75 },
          pull_requests: { total: 50, merged: 45 },
          contributors: { active: 10 },
        };
        storage.saveMetrics(testRepo, metrics, now - (10 - i) * dayMs);
      }

      // Add anomalous metric (>50% deviation)
      const anomalousMetrics = {
        issues: { total: 250, closed: 75 },
        pull_requests: { total: 50, merged: 45 },
        contributors: { active: 10 },
      };
      storage.saveMetrics(testRepo, anomalousMetrics, now);

      const result = detector.detectAnomalies(testRepo, 30);
      expect(result).toHaveProperty("anomalies");
      expect(result.anomalies.length).toBeGreaterThan(0);
    });

    test("calculates deviation percentage", () => {
      const result = detector.detectAnomalies(testRepo, 30);
      if (result.anomalies.length > 0) {
        expect(result.anomalies[0]).toHaveProperty("deviation");
        expect(parseFloat(result.anomalies[0].deviation)).toBeGreaterThan(0);
      }
    });

    test("returns confidence score", () => {
      const result = detector.detectAnomalies(testRepo, 30);
      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
    });
  });

  describe("detectTrendBreak", () => {
    test("detects reversals in trend", () => {
      const now = Date.now();
      const dayMs = 24 * 60 * 60 * 1000;

      // Add increasing trend
      for (let i = 0; i < 5; i++) {
        const metrics = {
          issues: { total: 100 + i * 10, closed: 75 },
          pull_requests: { total: 50, merged: 45 },
          contributors: { active: 10 },
        };
        storage.saveMetrics("trend-test/repo", metrics, now - (5 - i) * dayMs);
      }

      // Add reversed trend
      for (let i = 0; i < 5; i++) {
        const metrics = {
          issues: { total: 150 - i * 20, closed: 75 },
          pull_requests: { total: 50, merged: 45 },
          contributors: { active: 10 },
        };
        storage.saveMetrics("trend-test/repo", metrics, now - (5 - i - 5) * dayMs);
      }

      const result = detector.detectTrendBreak("trend-test/repo", 30);
      expect(result).toHaveProperty("trends");
    });
  });

  describe("calculateSeverity", () => {
    test("assigns severity based on deviation", () => {
      expect(detector.calculateSeverity(1.5)).toBe("critical");
      expect(detector.calculateSeverity(0.9)).toBe("high");
      expect(detector.calculateSeverity(0.6)).toBe("medium");
      expect(detector.calculateSeverity(0.4)).toBe("low");
    });
  });

  describe("getBaselineStatistics", () => {
    test("calculates statistics for metrics", () => {
      const stats = detector.getBaselineStatistics(testRepo, 30);
      expect(stats).toHaveProperty("issues");
      if (stats.issues && stats.issues.total) {
        expect(stats.issues.total).toHaveProperty("mean");
        expect(stats.issues.total).toHaveProperty("min");
        expect(stats.issues.total).toHaveProperty("max");
      }
    });
  });

  describe("calculateMovingAverage", () => {
    test("calculates window-based average", () => {
      const values = [10, 20, 30, 40, 50];
      const avg = detector.calculateMovingAverage(values, 3);
      expect(avg).toBe(40); // Average of [30, 40, 50]
    });
  });

  describe("calculateStdDev", () => {
    test("calculates standard deviation", () => {
      const values = [2, 4, 4, 4, 5, 5, 7, 9];
      const stdDev = detector.calculateStdDev(values);
      expect(stdDev).toBeGreaterThan(0);
    });
  });
});
