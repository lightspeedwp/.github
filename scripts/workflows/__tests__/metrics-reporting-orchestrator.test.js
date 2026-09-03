/**
 * Metrics Reporting Orchestrator Tests
 */

const fs = require("fs");

// Mock process.exit to prevent Jest from exiting
const originalExit = process.exit;
process.exit = jest.fn();

// Mock the external dependencies before importing MetricsReportingOrchestrator
jest.mock("../../metrics/metrics-storage.cjs", () => ({
  MetricsStorage: jest.fn().mockImplementation(() => ({
    getLatestMetrics: jest.fn().mockResolvedValue({
      repository: "test/repo",
      stats: { stargazers_count: 100 },
      timestamp: new Date().toISOString(),
    }),
  })),
}));

jest.mock("../../metrics/metrics-reporter", () => ({
  MetricsReporter: jest.fn().mockImplementation(() => ({
    generateReport: jest.fn().mockResolvedValue({
      path: ".github/reports/metrics/test-report.md",
      summary: "Test report generated successfully",
    }),
  })),
}));

jest.mock("../../metrics/trend-analyzer.cjs", () => ({
  TrendAnalyzer: jest.fn().mockImplementation(() => ({
    analyzeTrends: jest.fn().mockResolvedValue({
      trend: "increasing",
      changePercentage: 10.5,
    }),
  })),
}));

jest.mock("../../metrics/anomaly-detector.cjs", () => ({
  AnomalyDetector: jest.fn().mockImplementation(() => ({
    detectAnomalies: jest.fn().mockResolvedValue([]),
  })),
}));

jest.mock("../../telemetry/telemetry-client.js", () => ({
  createTelemetryClient: jest.fn().mockReturnValue({
    emit: jest.fn(),
  }),
}));

jest.mock("../../telemetry/event-schemas.js", () => ({
  EVENT_SCHEMAS: {
    "metrics.report.generated": {
      description: "Metrics report successfully generated and saved",
      safe: {
        required: ["reportType", "period", "metricsIncluded"],
        optional: [
          "trendsIncluded",
          "anomaliesIncluded",
          "generationDuration",
        ],
      },
      restricted: {
        required: ["repository"],
        optional: ["reportPath", "fileSize"],
      },
    },
  },
}));

const {
  MetricsReportingOrchestrator,
} = require("../metrics-reporting-orchestrator.cjs");

describe("MetricsReportingOrchestrator", () => {
  let orchestrator;

  afterAll(() => {
    // Restore process.exit
    process.exit = originalExit;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    orchestrator = new MetricsReportingOrchestrator();
  });

  describe("Constructor", () => {
    it("should initialize with correct dependencies", () => {
      expect(orchestrator).toBeInstanceOf(MetricsReportingOrchestrator);
      expect(orchestrator.storage).toBeDefined();
      expect(orchestrator.trendAnalyzer).toBeDefined();
      expect(orchestrator.anomalyDetector).toBeDefined();
      expect(orchestrator.reporter).toBeDefined();
      expect(orchestrator.reports).toEqual([]);
    });

    it("should initialize telemetry client", () => {
      expect(orchestrator.telemetry).toBeDefined();
      expect(orchestrator.telemetry.emit).toBeDefined();
    });
  });

  describe("generateReports", () => {
    it("should generate reports successfully", async () => {
      const repositories = [{ owner: "test", repo: "repo" }];
      const mockReport = "### Summary\n### Metrics";
      const reportPath = ".github/reports/metrics/test-report.md";

      orchestrator.reporter.generateReport.mockResolvedValue(mockReport);
      jest.spyOn(orchestrator, "saveReport").mockReturnValue(reportPath);
      jest.spyOn(fs, "statSync").mockReturnValue({ size: 123 });

      await orchestrator.generateReports(repositories);

      expect(orchestrator.reporter.generateReport).toHaveBeenCalled();
      expect(orchestrator.reports).toHaveLength(1);
      expect(orchestrator.reports[0]).toEqual(
        expect.objectContaining({ repository: "test/repo", status: "success" }),
      );
    });

    it("should emit telemetry event on successful report generation", async () => {
      const repositories = [{ owner: "test", repo: "repo" }];
      const mockReport = "### Summary\n### Metrics";
      const reportPath = ".github/reports/metrics/weekly-report.md";

      orchestrator.reporter.generateReport.mockResolvedValue(mockReport);
      jest.spyOn(orchestrator, "saveReport").mockReturnValue(reportPath);
      jest.spyOn(fs, "statSync").mockReturnValue({ size: 123 });

      await orchestrator.generateReports(repositories);

      expect(orchestrator.telemetry.emit).toHaveBeenCalledWith(
        "metrics.report.generated",
        expect.objectContaining({
          safe: expect.objectContaining({
            reportType: "metrics-report",
            period: "weekly",
            metricsIncluded: 2,
          }),
          restricted: expect.objectContaining({
            repository: "test/repo",
            reportPath,
            fileSize: 123,
          }),
        }),
      );
    });

    it("should handle errors gracefully", async () => {
      const error = new Error("Report generation failed");
      orchestrator.reporter.generateReport.mockRejectedValue(error);

      await expect(orchestrator.generateReports()).rejects.toThrow(
        "Report generation failed",
      );
    });

    it("should track multiple reports", async () => {
      const mockReports = [
        { path: "report1.md", summary: "Report 1" },
        { path: "report2.md", summary: "Report 2" },
      ];

      orchestrator.reporter.generateReport
        .mockResolvedValueOnce(mockReports[0])
        .mockResolvedValueOnce(mockReports[1]);

      await orchestrator.generateReports();
      await orchestrator.generateReports();

      expect(orchestrator.reports).toHaveLength(2);
      expect(orchestrator.reports).toEqual(mockReports);
    });
  });

  describe("Telemetry Integration", () => {
    it("should use correct event schema", () => {
      const { EVENT_SCHEMAS } = require("../../telemetry/event-schemas.js");

      expect(EVENT_SCHEMAS["metrics.report.generated"]).toBeDefined();
      expect(
        EVENT_SCHEMAS["metrics.report.generated"].safe.required,
      ).toContain("reportType");
      expect(
        EVENT_SCHEMAS["metrics.report.generated"].restricted.required,
      ).toContain("repository");
    });

    it("should not throw if telemetry fails", async () => {
      orchestrator.telemetry.emit.mockImplementation(() => {
        throw new Error("Telemetry error");
      });

      const mockReport = {
        path: "test-report.md",
        summary: "Test",
      };

      orchestrator.reporter.generateReport.mockResolvedValue(mockReport);

      // Should not throw even if telemetry fails
      await expect(orchestrator.generateReports()).resolves.not.toThrow();
    });
  });

  describe("Error Handling", () => {
    it("should handle storage errors", async () => {
      orchestrator.storage.getLatestMetrics.mockRejectedValue(
        new Error("Storage error"),
      );

      await expect(orchestrator.generateReports()).rejects.toThrow();
    });

    it("should handle reporter errors", async () => {
      orchestrator.reporter.generateReport.mockRejectedValue(
        new Error("Reporter error"),
      );

      await expect(orchestrator.generateReports()).rejects.toThrow(
        "Reporter error",
      );
    });

    it("should handle invalid report data", async () => {
      orchestrator.reporter.generateReport.mockResolvedValue(null);

      await orchestrator.generateReports();

      // Should handle null gracefully
      expect(orchestrator.reports).toContain(null);
    });
  });
});
