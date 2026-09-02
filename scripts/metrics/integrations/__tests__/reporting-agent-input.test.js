/**
 * Reporting Agent Input Formatter Tests
 */

const MetricsReportFormatter = require("../reporting-agent-input");
const fs = require("fs");
const path = require("path");

describe("MetricsReportFormatter", () => {
  let formatter;
  const fixturesDir = path.join(__dirname, "fixtures");

  beforeEach(() => {
    formatter = new MetricsReportFormatter({
      metricsDir: fixturesDir,
      reportDir: fixturesDir,
    });
  });

  describe("Constructor", () => {
    test("should initialize with defaults", () => {
      const f = new MetricsReportFormatter();
      expect(f).toBeInstanceOf(MetricsReportFormatter);
    });

    test("should initialize with custom options", () => {
      const f = new MetricsReportFormatter({
        metricsDir: "/custom/metrics",
        reportDir: "/custom/reports",
      });
      expect(f.metricsDir).toBe("/custom/metrics");
      expect(f.reportDir).toBe("/custom/reports");
    });
  });

  describe("Generate Weekly Report", () => {
    test("should generate complete weekly report", () => {
      const rawMetrics = JSON.parse(
        fs.readFileSync(path.join(fixturesDir, "sample-metrics.json"), "utf8"),
      );

      const report = formatter.generateWeeklyReport(rawMetrics);

      expect(report.type).toBe("metrics-report");
      expect(report.reportType).toBe("weekly");
      expect(report.timestamp).toBe(rawMetrics.timestamp);
      expect(report.period).toBeDefined();
      expect(report.executive_summary).toBeDefined();
      expect(report.metrics).toBeDefined();
      expect(report.trends).toBeDefined();
      expect(report.anomalies).toBeDefined();
      expect(report.insights).toBeDefined();
      expect(report.recommendations).toBeDefined();
      expect(report.health_components).toBeDefined();
      expect(report.nextSteps).toBeDefined();
      expect(report.reportLinks).toBeDefined();
    });

    test("should format metrics section correctly", () => {
      const rawMetrics = JSON.parse(
        fs.readFileSync(path.join(fixturesDir, "sample-metrics.json"), "utf8"),
      );

      const report = formatter.generateWeeklyReport(rawMetrics);
      const metrics = report.metrics;

      expect(metrics.issues.total).toBe(145);
      expect(metrics.issues.closureRate).toBe("71%");
      expect(metrics.pullRequests.total).toBe(23);
      expect(metrics.contributors.active).toBe(12);
      expect(metrics.codeQuality.testCoverage).toBe("87%");
    });

    test("should format trends section", () => {
      const rawMetrics = JSON.parse(
        fs.readFileSync(path.join(fixturesDir, "sample-metrics.json"), "utf8"),
      );

      const report = formatter.generateWeeklyReport(rawMetrics);
      const trends = report.trends;

      expect(trends.issues.trend).toBe("stable");
      expect(trends.pullRequests.trend).toBe("increasing");
      expect(trends.reviewTime.change).toBe(25);
    });

    test("should include anomalies", () => {
      const rawMetrics = JSON.parse(
        fs.readFileSync(path.join(fixturesDir, "sample-metrics.json"), "utf8"),
      );

      const report = formatter.generateWeeklyReport(rawMetrics);

      expect(report.anomalies).toHaveLength(2);
      expect(report.anomalies[0].severity).toBe("moderate");
      expect(report.anomalies[1].severity).toBe("high");
    });

    test("should include insights", () => {
      const rawMetrics = JSON.parse(
        fs.readFileSync(path.join(fixturesDir, "sample-metrics.json"), "utf8"),
      );

      const report = formatter.generateWeeklyReport(rawMetrics);

      expect(report.insights.length).toBeGreaterThan(0);
      expect(report.insights[0]).toHaveProperty("category");
      expect(report.insights[0]).toHaveProperty("action");
    });

    test("should include recommendations", () => {
      const rawMetrics = JSON.parse(
        fs.readFileSync(path.join(fixturesDir, "sample-metrics.json"), "utf8"),
      );

      const report = formatter.generateWeeklyReport(rawMetrics);

      expect(report.recommendations.length).toBeGreaterThan(0);
      expect(report.recommendations[0]).toHaveProperty("priority");
      expect(report.recommendations[0]).toHaveProperty("action");
    });

    test("should generate next steps", () => {
      const rawMetrics = JSON.parse(
        fs.readFileSync(path.join(fixturesDir, "sample-metrics.json"), "utf8"),
      );

      const report = formatter.generateWeeklyReport(rawMetrics);

      expect(report.nextSteps).toBeDefined();
      expect(Array.isArray(report.nextSteps)).toBe(true);
      expect(report.nextSteps.length).toBeGreaterThan(0);
    });
  });

  describe("Generate Monthly Report", () => {
    test("should generate monthly report", () => {
      const rawMetrics = JSON.parse(
        fs.readFileSync(path.join(fixturesDir, "sample-metrics.json"), "utf8"),
      );

      const report = formatter.generateMonthlyReport(rawMetrics);

      expect(report.reportType).toBe("monthly");
      expect(report.period.label).toContain("Month of");
    });
  });

  describe("Generate Quarterly Report", () => {
    test("should generate quarterly report", () => {
      const rawMetrics = JSON.parse(
        fs.readFileSync(path.join(fixturesDir, "sample-metrics.json"), "utf8"),
      );

      const report = formatter.generateQuarterlyReport(rawMetrics);

      expect(report.reportType).toBe("quarterly");
      expect(report.period.label).toContain("Q");
    });
  });

  describe("Format For Reporting Agent", () => {
    test("should support weekly report type", () => {
      const rawMetrics = JSON.parse(
        fs.readFileSync(path.join(fixturesDir, "sample-metrics.json"), "utf8"),
      );

      const report = formatter.formatForReportingAgent(rawMetrics, "weekly");

      expect(report.reportType).toBe("weekly");
    });

    test("should support monthly report type", () => {
      const rawMetrics = JSON.parse(
        fs.readFileSync(path.join(fixturesDir, "sample-metrics.json"), "utf8"),
      );

      const report = formatter.formatForReportingAgent(rawMetrics, "monthly");

      expect(report.reportType).toBe("monthly");
    });

    test("should reject invalid report type", () => {
      const rawMetrics = JSON.parse(
        fs.readFileSync(path.join(fixturesDir, "sample-metrics.json"), "utf8"),
      );

      expect(() => {
        formatter.formatForReportingAgent(rawMetrics, "invalid-type");
      }).toThrow("Unsupported report type");
    });
  });

  describe("Format Health Components", () => {
    test("should format health components", () => {
      const components = {
        responseTime: 80,
        closureRate: 71,
        reviewTime: 75,
        codeQuality: 87,
        teamCapacity: 70,
      };

      const formatted = formatter.formatHealthComponentsSection(components);

      expect(formatted.responseTime.score).toBe(80);
      expect(formatted.responseTime.status).toBe("healthy");
      expect(formatted.closureRate.status).toBe("at-risk");
      expect(formatted.codeQuality.status).toBe("healthy");
    });
  });

  describe("Helper Methods", () => {
    test("should format dates", () => {
      const date = new Date("2026-08-19");
      const formatted = formatter.formatDate(date);

      expect(formatted).toContain("Aug");
      expect(formatted).toContain("19");
      expect(formatted).toContain("2026");
    });

    test("should format percentages", () => {
      expect(formatter.formatPercent(0.75)).toBe("75%");
      expect(formatter.formatPercent(1.0)).toBe("100%");
      expect(formatter.formatPercent(0.333)).toBe("33%");
      expect(formatter.formatPercent(null)).toBe("0%");
    });

    test("should get health status", () => {
      expect(formatter.getHealthStatus(85)).toBe("healthy");
      expect(formatter.getHealthStatus(75)).toBe("at-risk");
      expect(formatter.getHealthStatus(65)).toBe("critical");
      expect(formatter.getHealthStatus(55)).toBe("failing");
    });

    test("should get top priority", () => {
      const metrics = {
        recommendations: [{ action: "Priority 1" }, { action: "Priority 2" }],
      };

      const priority = formatter.getTopPriority(metrics);
      expect(priority).toBe("Priority 1");
    });

    test("should handle missing recommendations", () => {
      const metrics = {};
      const priority = formatter.getTopPriority(metrics);
      expect(priority).toBe("Review metrics");
    });
  });

  describe("Report Links", () => {
    test("should generate report links", () => {
      const links = {
        fullReport: formatter.generateReportLink("weekly-summary-latest.md"),
        collection: formatter.generateCollectionLink(),
      };

      expect(links.fullReport).toContain("github.com");
      expect(links.fullReport).toContain("lightspeedwp");
      expect(links.collection).toContain("metrics-agent.js");
    });
  });

  describe("Anomalies Section", () => {
    test("should format anomalies correctly", () => {
      const rawMetrics = JSON.parse(
        fs.readFileSync(path.join(fixturesDir, "sample-metrics.json"), "utf8"),
      );

      const anomalies = formatter.formatAnomaliesSection(rawMetrics);

      expect(anomalies.length).toBeGreaterThan(0);
      expect(anomalies[0]).toHaveProperty("severity");
      expect(anomalies[0]).toHaveProperty("metric");
      expect(anomalies[0]).toHaveProperty("percentChange");
    });
  });

  describe("Recommendations Section", () => {
    test("should format recommendations correctly", () => {
      const rawMetrics = JSON.parse(
        fs.readFileSync(path.join(fixturesDir, "sample-metrics.json"), "utf8"),
      );

      const recommendations =
        formatter.formatRecommendationsSection(rawMetrics);

      expect(recommendations.length).toBeGreaterThan(0);
      expect(recommendations[0]).toHaveProperty("priority");
      expect(recommendations[0]).toHaveProperty("effort");
      expect(recommendations[0]).toHaveProperty("expectedOutcome");
    });
  });

  describe("Phase 4.3 - API Stability & Edge Cases", () => {
    test("handles high-volume repository and commit input", () => {
      const repositories = Array.from({ length: 1000 }, (_, index) => ({
        owner: "lightspeedwp",
        name: `repo-${index + 1}`,
        metrics: {
          issues: { total: 1 },
          pullRequests: { total: 1 },
          contributors: {
            active: 1,
            topContributors: [{ name: `dev-${index + 1}`, commits: 10 }],
          },
          codeQuality: { testCoverage: 0.9 },
        },
      }));

      const rawMetrics = {
        timestamp: "2026-08-29T00:00:00Z",
        repositories,
        healthScore: { overall: 80, trend: "stable", components: {} },
        recommendations: [{ action: "Prioritize triage" }],
      };

      const startTime = Date.now();
      const report = formatter.generateWeeklyReport(rawMetrics);
      const durationMs = Date.now() - startTime;

      expect(report.repositorySummary.totalRepositories).toBe(1000);
      expect(report.repositorySummary.totalCommits).toBe(10000);
      expect(durationMs).toBeLessThan(1000);
    });

    test("handles archived and inaccessible repositories safely", () => {
      const rawMetrics = {
        timestamp: "2026-08-29T00:00:00Z",
        repositories: [
          { name: "archived-repo", archived: true, metrics: {} },
          { name: "private-repo", permissionDenied: true, metrics: {} },
          {
            name: "active-repo",
            metrics: {
              issues: { total: 9 },
              pullRequests: { total: 4 },
              contributors: { active: 2, totalCommits: 120 },
              codeQuality: { testCoverage: 0.85 },
            },
          },
        ],
      };

      const report = formatter.generateWeeklyReport(rawMetrics);

      expect(report.repositorySummary.archivedRepositories).toBe(1);
      expect(report.repositorySummary.inaccessibleRepositories).toBe(1);
      expect(report.repositorySummary.processedRepositories).toBe(1);
      expect(report.metrics.issues.total).toBe(9);
    });

    test("summarizes network, auth, and rate-limit failures", () => {
      const rawMetrics = {
        timestamp: "2026-08-29T00:00:00Z",
        repositories: [],
        errors: [
          { status: 429, message: "rate limit exceeded" },
          { code: "ENOTFOUND", message: "dns lookup failed" },
          { status: 403, message: "forbidden" },
          { status: 401, message: "unauthorized" },
        ],
      };

      const report = formatter.generateWeeklyReport(rawMetrics);

      expect(report.failureSummary.total).toBe(4);
      expect(report.failureSummary.byType.rate_limit).toBe(1);
      expect(report.failureSummary.byType.network).toBe(1);
      expect(report.failureSummary.byType.permissions).toBe(2);
      expect(report.failureSummary.retryable).toBe(2);
    });

    test("gracefully handles null input and malformed recommendations", () => {
      const report = formatter.generateWeeklyReport({
        recommendations: [{ priority: "high", action: null }],
      });

      expect(report.type).toBe("metrics-report");
      expect(report.metrics).toEqual({});
      expect(report.recommendations[0].action).toBe("Improve metric hygiene");
      expect(report.nextSteps[0]).toContain("Improve metric hygiene");
      expect(report.timestamp).toBeDefined();
    });
  });
});
