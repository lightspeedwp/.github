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
        optional: ["trendsIncluded", "anomaliesIncluded", "generationDuration"],
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
      const repositories = [{ owner: "test", repo: "repo" }];
      const error = new Error("Report generation failed");
      orchestrator.reporter.generateReport.mockRejectedValue(error);

      await expect(
        orchestrator.generateReports(repositories),
      ).resolves.toHaveLength(1);

      expect(orchestrator.reports[0]).toEqual(
        expect.objectContaining({
          repository: "test/repo",
          status: "error",
          error: "Report generation failed",
        }),
      );
    });

    it("should track multiple reports", async () => {
      const repositories = [
        { owner: "test", repo: "repo-one" },
        { owner: "test", repo: "repo-two" },
      ];

      orchestrator.reporter.generateReport
        .mockResolvedValueOnce("### Report 1")
        .mockResolvedValueOnce("### Report 2");
      jest
        .spyOn(orchestrator, "saveReport")
        .mockReturnValueOnce("report1.md")
        .mockReturnValueOnce("report2.md");
      jest.spyOn(fs, "statSync").mockReturnValue({ size: 123 });

      await orchestrator.generateReports(repositories);

      expect(orchestrator.reports).toHaveLength(2);
      expect(orchestrator.reports.map((report) => report.reportPath)).toEqual([
        "report1.md",
        "report2.md",
      ]);
      expect(
        orchestrator.reports.every((report) => report.status === "success"),
      ).toBe(true);
    });
  });

  describe("Telemetry Integration", () => {
    it("should use correct event schema", () => {
      const { EVENT_SCHEMAS } = require("../../telemetry/event-schemas.js");

      expect(EVENT_SCHEMAS["metrics.report.generated"]).toBeDefined();
      expect(EVENT_SCHEMAS["metrics.report.generated"].safe.required).toContain(
        "reportType",
      );
      expect(
        EVENT_SCHEMAS["metrics.report.generated"].restricted.required,
      ).toContain("repository");
    });

    it("should not throw if telemetry fails", async () => {
      const repositories = [{ owner: "test", repo: "repo" }];

      orchestrator.telemetry.emit.mockImplementation(() => {
        throw new Error("Telemetry error");
      });

      orchestrator.reporter.generateReport.mockResolvedValue("### Test");
      jest.spyOn(orchestrator, "saveReport").mockReturnValue("test-report.md");
      jest.spyOn(fs, "statSync").mockReturnValue({ size: 123 });

      // Telemetry failures are recorded, never propagated to the caller
      await expect(
        orchestrator.generateReports(repositories),
      ).resolves.toHaveLength(1);
      expect(orchestrator.reports[0].status).toBe("error");
    });
  });

  describe("Error Handling", () => {
    it("should handle save errors", async () => {
      const repositories = [{ owner: "test", repo: "repo" }];

      orchestrator.reporter.generateReport.mockResolvedValue("### Test");
      jest.spyOn(orchestrator, "saveReport").mockImplementation(() => {
        throw new Error("Storage error");
      });

      await orchestrator.generateReports(repositories);

      expect(orchestrator.reports[0]).toEqual(
        expect.objectContaining({
          repository: "test/repo",
          status: "error",
          error: "Storage error",
        }),
      );
    });

    it("should handle reporter errors", async () => {
      const repositories = [{ owner: "test", repo: "repo" }];

      orchestrator.reporter.generateReport.mockRejectedValue(
        new Error("Reporter error"),
      );

      await orchestrator.generateReports(repositories);

      expect(orchestrator.reports[0]).toEqual(
        expect.objectContaining({
          status: "error",
          error: "Reporter error",
        }),
      );
    });

    it("should handle invalid report data", async () => {
      const repositories = [{ owner: "test", repo: "repo" }];

      orchestrator.reporter.generateReport.mockResolvedValue(null);

      await orchestrator.generateReports(repositories);

      // Repositories without data are skipped rather than recorded
      expect(orchestrator.reports).toEqual([]);
    });
  });
});
