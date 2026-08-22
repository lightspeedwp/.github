/**
 * Metrics Reporter Tests
 */

const { MetricsReporter } = require("../metrics-reporter");

describe("MetricsReporter", () => {
  let reporter;
  let mockStorage;
  let mockTrendAnalyzer;
  let mockAnomalyDetector;

  beforeEach(() => {
    mockStorage = {
      getLatestMetrics: jest.fn(),
      getMetricsHistory: jest.fn(),
    };

    mockTrendAnalyzer = {
      analyzeTrends: jest.fn(),
    };

    mockAnomalyDetector = {
      detectAnomalies: jest.fn(),
    };

    reporter = new MetricsReporter(
      mockStorage,
      mockTrendAnalyzer,
      mockAnomalyDetector,
    );
  });

  describe("Report Generation", () => {
    test("should generate report with valid metrics", async () => {
      const mockMetrics = {
        repository: "lightspeedwp/.github",
        timestamp: new Date().toISOString(),
        issues: { total: 42, closed: 35, open: 7 },
        pullRequests: { total: 28, merged: 26, open: 2 },
        contributors: { active: 12, new: 2, returning: 10 },
      };

      const mockTrends = {
        issues: { trend: 5 },
        pullRequests: { trend: -2 },
        health: { trend: 3 },
      };

      mockStorage.getLatestMetrics.mockResolvedValue(mockMetrics);
      mockStorage.getMetricsHistory.mockResolvedValue([mockMetrics]);
      mockTrendAnalyzer.analyzeTrends.mockResolvedValue(mockTrends);
      mockAnomalyDetector.detectAnomalies.mockResolvedValue([]);

      const report = await reporter.generateReport("lightspeedwp/.github");

      expect(report).toContain("Metrics Report");
      expect(report).toContain("lightspeedwp/.github");
      expect(report).toContain("Summary");
      expect(report).toContain("Issues");
      expect(report).toContain("Pull Requests");
      expect(report).toContain("Contributors");
    });

    test("should generate empty report when no metrics available", async () => {
      mockStorage.getLatestMetrics.mockResolvedValue(null);

      const report = await reporter.generateReport("lightspeedwp/.github");

      expect(report).toContain("No Data Available");
      expect(report).toContain("lightspeedwp/.github");
    });

    test("should include anomalies when detected", async () => {
      const mockMetrics = {
        repository: "lightspeedwp/.github",
        timestamp: new Date().toISOString(),
        issues: { total: 42, closed: 35, open: 7 },
        pullRequests: { total: 28, merged: 26, open: 2 },
        contributors: { active: 12, new: 2, returning: 10 },
      };

      const mockAnomalies = [
        {
          type: "Issue Closure Rate Drop",
          severity: "high",
          description: "Issue closure rate down 15% from baseline",
          impact: "high",
        },
      ];

      mockStorage.getLatestMetrics.mockResolvedValue(mockMetrics);
      mockStorage.getMetricsHistory.mockResolvedValue([mockMetrics]);
      mockTrendAnalyzer.analyzeTrends.mockResolvedValue({});
      mockAnomalyDetector.detectAnomalies.mockResolvedValue(mockAnomalies);

      const report = await reporter.generateReport("lightspeedwp/.github");

      expect(report).toContain("Anomalies");
      expect(report).toContain("Issue Closure Rate Drop");
    });

    test("should support different report periods", async () => {
      const mockMetrics = {
        repository: "lightspeedwp/.github",
        timestamp: new Date().toISOString(),
        issues: { total: 42, closed: 35, open: 7 },
        pullRequests: { total: 28, merged: 26, open: 2 },
        contributors: { active: 12, new: 2, returning: 10 },
      };

      mockStorage.getLatestMetrics.mockResolvedValue(mockMetrics);
      mockStorage.getMetricsHistory.mockResolvedValue([mockMetrics]);
      mockTrendAnalyzer.analyzeTrends.mockResolvedValue({});
      mockAnomalyDetector.detectAnomalies.mockResolvedValue([]);

      const weeklyReport = await reporter.generateReport(
        "lightspeedwp/.github",
        {
          period: "weekly",
        },
      );
      const monthlyReport = await reporter.generateReport(
        "lightspeedwp/.github",
        {
          period: "monthly",
        },
      );

      expect(weeklyReport).toBeDefined();
      expect(monthlyReport).toBeDefined();
      expect(weeklyReport).toContain("Metrics Report");
      expect(monthlyReport).toContain("Metrics Report");
    });
  });

  describe("Health Score Calculation", () => {
    test("should calculate health score correctly", () => {
      const metrics = {
        issues: { total: 100, closed: 80, open: 20 },
        pullRequests: { total: 50, merged: 45, open: 5 },
        contributors: { active: 15, new: 3, returning: 12 },
      };

      const trends = {
        anomalyCount: 0,
      };

      const score = reporter.calculateHealthScore(metrics, trends);

      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThanOrEqual(100);
      expect(typeof score).toBe("number");
    });

    test("should penalize for anomalies", () => {
      const metrics = {
        issues: { total: 100, closed: 80, open: 20 },
        pullRequests: { total: 50, merged: 45, open: 5 },
        contributors: { active: 15, new: 3, returning: 12 },
      };

      const trendsNoAnomalies = { anomalyCount: 0 };
      const trendsWithAnomalies = { anomalyCount: 2 };

      const scoreNoAnomalies = reporter.calculateHealthScore(
        metrics,
        trendsNoAnomalies,
      );
      const scoreWithAnomalies = reporter.calculateHealthScore(
        metrics,
        trendsWithAnomalies,
      );

      expect(scoreNoAnomalies).toBeGreaterThan(scoreWithAnomalies);
    });

    test("should handle empty metrics gracefully", () => {
      const metrics = {
        issues: { total: 0, closed: 0, open: 0 },
        pullRequests: { total: 0, merged: 0, open: 0 },
        contributors: { active: 0, new: 0, returning: 0 },
      };

      const trends = { anomalyCount: 0 };

      const score = reporter.calculateHealthScore(metrics, trends);

      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });
  });

  describe("Report Sections", () => {
    test("should generate header with correct format", () => {
      const header = reporter.generateHeader(
        "lightspeedwp/.github",
        new Date(),
        "weekly",
      );

      expect(header).toContain("Metrics Report");
      expect(header).toContain("lightspeedwp/.github");
      expect(header).toContain("Weekly Report");
    });

    test("should generate issues section with correct structure", () => {
      const metrics = {
        issues: { total: 42, closed: 35, open: 7 },
      };

      const trends = {
        issues: { trend: 5 },
        avgFixTime: { value: "3.2 days" },
      };

      const section = reporter.generateIssuesSection(metrics, trends);

      expect(section).toContain("Issues");
      expect(section).toContain("Total");
      expect(section).toContain("42");
      expect(section).toContain("Closed");
    });

    test("should generate contributors section", () => {
      const metrics = {
        contributors: { active: 12, new: 2, returning: 10 },
      };

      const section = reporter.generateContributorsSection(metrics);

      expect(section).toContain("Contributors");
      expect(section).toContain("Active");
      expect(section).toContain("12");
    });

    test("should generate health status section", () => {
      const metrics = {
        issues: { total: 42, closed: 35, open: 7 },
        pullRequests: { total: 28, merged: 26, open: 2 },
        contributors: { active: 12, new: 2, returning: 10 },
      };

      const trends = {
        stabilityScore: { value: 85 },
      };

      const anomalies = [];

      const section = reporter.generateHealthScoreSection(
        metrics,
        trends,
        anomalies,
      );

      expect(section).toContain("Health Status");
      expect(section).toContain("Score");
    });

    test("should generate footer", () => {
      const footer = reporter.generateFooter();

      expect(footer).toContain("Report generated");
      expect(footer).toContain("metrics team");
    });
  });

  describe("Error Handling", () => {
    test("should handle storage errors gracefully", async () => {
      mockStorage.getLatestMetrics.mockRejectedValue(
        new Error("Storage error"),
      );

      await expect(
        reporter.generateReport("lightspeedwp/.github"),
      ).rejects.toThrow("Storage error");
    });

    test("should handle undefined metrics gracefully", async () => {
      mockStorage.getLatestMetrics.mockResolvedValue(undefined);

      const report = await reporter.generateReport("lightspeedwp/.github");

      expect(report).toContain("No Data Available");
    });
  });
});
