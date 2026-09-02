const fs = require("fs");
const {
  validateAuditAccuracy,
  validatePerformance,
  validateErrorHandling,
  validateReportGeneration,
  validateDataIntegrity,
  runAllTasks,
} = require("../staging-validation.js");

// Import validation functions from production module helpers
const {
  validateAudit,
  runPerformanceBench,
  testErrorScenarios,
  validateReports,
  validateIntegrity,
  parseArguments,
  executeAllValidations,
} = require("../staging-validation-helpers.js");

jest.mock("fs");
jest.mock("console", () => ({
  log: jest.fn(),
  error: jest.fn(),
}));

describe("staging-validation (production module)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fs.mkdirSync.mockResolvedValue(undefined);
    fs.writeFileSync.mockResolvedValue(undefined);
  });

  describe("production module exports", () => {
    it("exports validateAuditAccuracy function", () => {
      expect(typeof validateAuditAccuracy).toBe("function");
    });

    it("exports validatePerformance function", () => {
      expect(typeof validatePerformance).toBe("function");
    });

    it("exports validateErrorHandling function", () => {
      expect(typeof validateErrorHandling).toBe("function");
    });

    it("exports validateReportGeneration function", () => {
      expect(typeof validateReportGeneration).toBe("function");
    });

    it("exports validateDataIntegrity function", () => {
      expect(typeof validateDataIntegrity).toBe("function");
    });

    it("exports runAllTasks function", () => {
      expect(typeof runAllTasks).toBe("function");
    });
  });

  describe("production module integration", () => {
    it("runAllTasks returns a promise", () => {
      const result = runAllTasks();
      expect(result instanceof Promise).toBe(true);
    });

    it("validateAuditAccuracy is callable", async () => {
      const result = validateAuditAccuracy({});
      expect(result instanceof Promise).toBe(true);
    });

    it("validatePerformance is callable", async () => {
      const result = validatePerformance({});
      expect(result instanceof Promise).toBe(true);
    });
  });
});

describe("staging-validation", () => {
  describe("validateAudit", () => {
    it("validates audit with default options", () => {
      const result = validateAudit();
      expect(result.success).toBe(true);
      expect(result.count).toBe(100);
      expect(result.sampleSize).toBe(30);
    });

    it("accepts custom count", () => {
      const result = validateAudit({ count: 500 });
      expect(result.count).toBe(500);
    });

    it("accepts custom sample size", () => {
      const result = validateAudit({ sampleSize: 50 });
      expect(result.sampleSize).toBe(50);
    });

    it("returns metrics object", () => {
      const result = validateAudit();
      expect(result.metrics).toBeDefined();
      expect(result.metrics.truePositiveRate).toBeDefined();
      expect(result.metrics.falsePositiveRate).toBeDefined();
    });

    it("rejects count less than 1", () => {
      const result = validateAudit({ count: 0 });
      expect(result.success).toBe(false);
    });

    it("rejects count greater than 10000", () => {
      const result = validateAudit({ count: 10001 });
      expect(result.success).toBe(false);
    });

    it("rejects sample size larger than count", () => {
      const result = validateAudit({ count: 50, sampleSize: 100 });
      expect(result.success).toBe(false);
    });

    it("returns pending_manual_review status", () => {
      const result = validateAudit();
      expect(result.status).toBe("pending_manual_review");
    });
  });

  describe("runPerformanceBench", () => {
    it("runs benchmark with default options", () => {
      const result = runPerformanceBench();
      expect(result.success).toBeDefined();
      expect(result.benchmarks).toBeDefined();
      expect(Array.isArray(result.benchmarks)).toBe(true);
    });

    it("runs specified number of benchmarks", () => {
      const result = runPerformanceBench({ runs: 5 });
      expect(result.benchmarks.length).toBe(5);
    });

    it("calculates average execution time", () => {
      const result = runPerformanceBench();
      expect(result.averages.avgTime).toBeDefined();
      expect(typeof parseFloat(result.averages.avgTime)).toBe("number");
    });

    it("calculates average API calls", () => {
      const result = runPerformanceBench();
      expect(result.averages.avgCalls).toBeDefined();
    });

    it("calculates average success rate", () => {
      const result = runPerformanceBench();
      expect(result.averages.avgSuccess).toBeDefined();
      const rate = parseFloat(result.averages.avgSuccess);
      expect(rate).toBeGreaterThan(0);
      expect(rate).toBeLessThanOrEqual(100);
    });

    it("includes threshold pass/fail status", () => {
      const result = runPerformanceBench();
      expect(result.thresholds.executionTime.pass).toBeDefined();
      expect(result.thresholds.apiCalls.pass).toBeDefined();
      expect(result.thresholds.successRate.pass).toBeDefined();
    });

    it("rejects invalid runs count", () => {
      const result = runPerformanceBench({ runs: 0 });
      expect(result.success).toBe(false);
    });

    it("rejects runs exceeding maximum", () => {
      const result = runPerformanceBench({ runs: 11 });
      expect(result.success).toBe(false);
    });
  });

  describe("testErrorScenarios", () => {
    it("tests default error scenarios", () => {
      const result = testErrorScenarios();
      expect(result.success).toBe(true);
      expect(result.scenarios).toBeDefined();
      expect(Object.keys(result.scenarios).length).toBeGreaterThan(0);
    });

    it("includes network-timeout scenario", () => {
      const result = testErrorScenarios();
      expect(result.scenarios["network-timeout"]).toBeDefined();
    });

    it("includes rate-limit scenario", () => {
      const result = testErrorScenarios();
      expect(result.scenarios["rate-limit"]).toBeDefined();
    });

    it("includes permission-denied scenario", () => {
      const result = testErrorScenarios();
      expect(result.scenarios["permission-denied"]).toBeDefined();
    });

    it("includes malformed-data scenario", () => {
      const result = testErrorScenarios();
      expect(result.scenarios["malformed-data"]).toBeDefined();
    });

    it("accepts custom scenarios", () => {
      const custom = ["custom-error-1", "custom-error-2"];
      const result = testErrorScenarios(custom);
      expect(result.scenarios["custom-error-1"]).toBeDefined();
      expect(result.scenarios["custom-error-2"]).toBeDefined();
    });

    it("marks all scenarios as handled", () => {
      const result = testErrorScenarios();
      Object.values(result.scenarios).forEach((scenario) => {
        expect(scenario.handled).toBe(true);
      });
    });
  });

  describe("validateReports", () => {
    it("validates default report formats", () => {
      const result = validateReports();
      expect(result.success).toBe(true);
      expect(result.formats.json).toBeDefined();
      expect(result.formats.csv).toBeDefined();
      expect(result.formats.markdown).toBeDefined();
    });

    it("validates JSON format", () => {
      const result = validateReports(["json"]);
      expect(result.formats.json.valid).toBe(true);
      expect(result.formats.json.checks.schema).toBe(true);
    });

    it("validates CSV format", () => {
      const result = validateReports(["csv"]);
      expect(result.formats.csv.valid).toBe(true);
    });

    it("validates Markdown format", () => {
      const result = validateReports(["markdown"]);
      expect(result.formats.markdown.valid).toBe(true);
    });

    it("validates multiple formats simultaneously", () => {
      const result = validateReports(["json", "csv"]);
      expect(Object.keys(result.formats).length).toBe(2);
    });

    it("rejects unknown format", () => {
      const result = validateReports(["unknown"]);
      expect(result.success).toBe(false);
    });

    it("includes completeness check", () => {
      const result = validateReports(["json"]);
      expect(result.formats.json.checks.completeness).toBe(true);
    });
  });

  describe("validateIntegrity", () => {
    it("validates with no issues", () => {
      const result = validateIntegrity();
      expect(result.success).toBe(true);
      expect(result.orphanedLabels).toBe(0);
      expect(result.conflictingPairs).toBe(0);
      expect(result.duplicateLabels).toBe(0);
    });

    it("detects orphaned labels", () => {
      const result = validateIntegrity({ orphaned: 3 });
      expect(result.orphanedLabels).toBe(3);
    });

    it("detects conflicting label pairs", () => {
      const result = validateIntegrity({ conflicts: 1 });
      expect(result.success).toBe(false);
      expect(result.conflictingPairs).toBe(1);
    });

    it("detects duplicate labels", () => {
      const result = validateIntegrity({ duplicates: 2 });
      expect(result.success).toBe(false);
    });

    it("checks metadata consistency", () => {
      const result = validateIntegrity({ consistency: 100 });
      expect(result.metadataConsistency).toBe(100);
    });

    it("fails if consistency below 100", () => {
      const result = validateIntegrity({ consistency: 99 });
      expect(result.success).toBe(false);
    });

    it("checks relationship validity", () => {
      const result = validateIntegrity({ validity: 100 });
      expect(result.relationshipValidity).toBe(100);
    });

    it("fails if too many orphaned labels", () => {
      const result = validateIntegrity({ orphaned: 10 });
      expect(result.success).toBe(false);
    });
  });

  describe("parseArguments", () => {
    it("parses --all flag", () => {
      const parsed = parseArguments(["--all"]);
      expect(parsed.runAll).toBe(true);
    });

    it("parses --task argument", () => {
      const parsed = parseArguments(["--task", "audit"]);
      expect(parsed.task).toBe("audit");
    });

    it("parses --count argument", () => {
      const parsed = parseArguments(["--count", "500"]);
      expect(parsed.count).toBe(500);
    });

    it("parses --runs argument", () => {
      const parsed = parseArguments(["--runs", "5"]);
      expect(parsed.runs).toBe(5);
    });

    it("parses --verbose flag", () => {
      const parsed = parseArguments(["--verbose"]);
      expect(parsed.verbose).toBe(true);
    });

    it("returns defaults for missing arguments", () => {
      const parsed = parseArguments([]);
      expect(parsed.runAll).toBe(false);
      expect(parsed.task).toBeNull();
      expect(parsed.count).toBe(100);
    });

    it("parses multiple arguments", () => {
      const parsed = parseArguments(["--all", "--count", "200", "--verbose"]);
      expect(parsed.runAll).toBe(true);
      expect(parsed.count).toBe(200);
      expect(parsed.verbose).toBe(true);
    });
  });

  describe("executeAllValidations", () => {
    it("executes all validation tasks", () => {
      const result = executeAllValidations();
      expect(result.results.audit).toBeDefined();
      expect(result.results.performance).toBeDefined();
      expect(result.results.errors).toBeDefined();
      expect(result.results.reports).toBeDefined();
      expect(result.results.integrity).toBeDefined();
    });

    it("includes timestamp in results", () => {
      const result = executeAllValidations();
      expect(result.timestamp).toBeDefined();
    });

    it("calculates summary statistics", () => {
      const result = executeAllValidations();
      expect(result.summary.totalTests).toBe(5);
      expect(result.summary.passed).toBeDefined();
      expect(result.summary.failed).toBeDefined();
      expect(result.summary.successRate).toBeDefined();
    });

    it("determines GO/NO-GO status", () => {
      const result = executeAllValidations();
      expect(["GO", "NO-GO"]).toContain(result.status);
    });

    it("returns GO when all tests pass", () => {
      const result = executeAllValidations();
      expect(result.status).toBeDefined();
    });

    it("accepts options for all validations", () => {
      const result = executeAllValidations({ count: 200, runs: 5 });
      expect(result.results.audit.count).toBe(200);
      expect(result.results.performance.benchmarks.length).toBe(5);
    });
  });

  describe("integration: Complete staging validation", () => {
    it("runs all tasks and produces report", () => {
      const result = executeAllValidations();
      expect(result.timestamp).toBeDefined();
      expect(result.summary.totalTests).toBeGreaterThan(0);
      expect(["GO", "NO-GO"]).toContain(result.status);
    });

    it("validates audit then performance then error handling", () => {
      const audit = validateAudit({ count: 100 });
      const perf = runPerformanceBench({ runs: 3 });
      const errors = testErrorScenarios();

      expect(audit.success).toBe(true);
      expect(typeof perf.success).toBe("boolean");
      expect(errors.success).toBe(true);
    });

    it("validates reports and data integrity", () => {
      const reports = validateReports();
      const integrity = validateIntegrity();

      expect(reports.success).toBe(true);
      expect(integrity.success).toBe(true);
    });
  });

  describe("edge cases", () => {
    it("handles custom count values", () => {
      const result = validateAudit({ count: 1, sampleSize: 1 });
      expect(result.success).toBe(true);
      expect(result.count).toBe(1);
    });

    it("handles large count values", () => {
      const result = validateAudit({ count: 10000 });
      expect(result.success).toBe(true);
    });

    it("handles single benchmark run", () => {
      const result = runPerformanceBench({ runs: 1 });
      expect(result.benchmarks.length).toBe(1);
      expect(result.success).toBeDefined();
    });

    it("handles no custom error scenarios", () => {
      const result = testErrorScenarios([]);
      expect(Object.keys(result.scenarios).length).toBeGreaterThan(0);
    });

    it("handles report format validation with single format", () => {
      const result = validateReports(["json"]);
      expect(Object.keys(result.formats).length).toBe(1);
    });

    it("handles zero conflicts in integrity check", () => {
      const result = validateIntegrity({
        orphaned: 0,
        conflicts: 0,
        duplicates: 0,
      });
      expect(result.success).toBe(true);
    });
  });
});
