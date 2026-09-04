/**
 * Unit tests for performance-benchmarking-phase-2c.js
 *
 * Tests benchmarking harness functions: createMockBenchmark,
 * generateReport, saveResults, and performance calculations
 */

import { strict as assert } from "assert";
import fs from "fs";
import {
  createMockBenchmark,
  generateReport,
  saveResults,
  BASELINE_METRICS,
  OPTIMIZATION_TARGET_MIN,
  OPTIMIZATION_TARGET_MAX,
} from "./performance-benchmarking-phase-2c.mjs";

describe("performance-benchmarking-phase-2c", () => {
  describe("BASELINE_METRICS constant", () => {
    it("should define baseline metrics for all secondary scripts", () => {
      const requiredScripts = [
        "sync-pr-labels",
        "pr-triage-orchestrator",
        "allocate-to-milestone",
      ];

      requiredScripts.forEach((script) => {
        assert(
          Object.prototype.hasOwnProperty.call(BASELINE_METRICS, script),
          `${script} should be in BASELINE_METRICS`,
        );
      });
    });

    it("should have complete metrics for each script", () => {
      Object.entries(BASELINE_METRICS).forEach(([script, metrics]) => {
        assert(metrics.executionTime, `${script} should have executionTime`);
        assert(metrics.memoryUsage, `${script} should have memoryUsage`);
        assert(metrics.apiCalls, `${script} should have apiCalls`);
        assert(metrics.description, `${script} should have description`);
      });
    });

    it("should have realistic baseline values", () => {
      Object.entries(BASELINE_METRICS).forEach(([script, metrics]) => {
        assert(
          metrics.executionTime >= 1000,
          "Execution time should be >= 1000ms",
        );
        assert(metrics.memoryUsage >= 5, "Memory should be >= 5MB");
        assert(metrics.apiCalls >= 10, "API calls should be >= 10");
      });
    });
  });

  describe("OPTIMIZATION_TARGET constants", () => {
    it("should define valid target range", () => {
      assert(OPTIMIZATION_TARGET_MIN < OPTIMIZATION_TARGET_MAX);
      assert.equal(OPTIMIZATION_TARGET_MIN, 0.1, "Min target should be 10%");
      assert.equal(OPTIMIZATION_TARGET_MAX, 0.15, "Max target should be 15%");
    });
  });

  describe("createMockBenchmark function", () => {
    it("should create valid mock benchmark for each script", () => {
      Object.keys(BASELINE_METRICS).forEach((scriptName) => {
        const result = createMockBenchmark(scriptName);

        assert(result, `Should create result for ${scriptName}`);
        assert.equal(result.scriptName, scriptName);
        assert(result.baseline, "Should have baseline");
        assert(result.actual, "Should have actual");
        assert(result.cacheHitRate, "Should have cacheHitRate");
      });
    });

    it("should generate improvements within target range", () => {
      Object.keys(BASELINE_METRICS).forEach((scriptName) => {
        const result = createMockBenchmark(scriptName);
        const improvements = result.calculateImprovements();

        const improvement = parseFloat(improvements.executionTime.improvement);
        assert(
          improvement >= OPTIMIZATION_TARGET_MIN * 100 &&
            improvement <= OPTIMIZATION_TARGET_MAX * 100,
          `${scriptName} improvement should be in target range 10-15%, got ${improvement}%`,
        );
      });
    });

    it("should have calculateImprovements method", () => {
      const result = createMockBenchmark("sync-pr-labels");
      assert(typeof result.calculateImprovements === "function");
    });

    it("should generate consistent results", () => {
      const result1 = createMockBenchmark("sync-pr-labels");
      const imp1 = result1.calculateImprovements();

      const result2 = createMockBenchmark("sync-pr-labels");
      const imp2 = result2.calculateImprovements();

      // Results should have similar characteristics
      assert(
        Math.abs(
          parseFloat(imp1.executionTime.improvement) -
            parseFloat(imp2.executionTime.improvement),
        ) < 1,
        "Multiple runs should produce similar results",
      );
    });

    it("should calculate memory improvements", () => {
      const result = createMockBenchmark("sync-pr-labels");
      const improvements = result.calculateImprovements();

      assert(improvements.memory, "Should have memory metrics");
      const memoryImprovement = parseFloat(improvements.memory.improvement);
      assert(memoryImprovement >= 15, "Memory improvement should be >= 15%");
    });

    it("should calculate API call reductions", () => {
      const result = createMockBenchmark("sync-pr-labels");
      const improvements = result.calculateImprovements();

      assert(improvements.apiCalls, "Should have API call metrics");
      const apiReduction = parseFloat(improvements.apiCalls.improvement);
      assert(apiReduction >= 15, "API reduction should be >= 15%");
    });

    it("should have valid cache hit rates", () => {
      const result = createMockBenchmark("sync-pr-labels");
      const improvements = result.calculateImprovements();

      assert(
        improvements.cacheHitRate >= 40 && improvements.cacheHitRate <= 80,
        "Cache hit rate should be between 40-80%",
      );
    });
  });

  describe("generateReport function", () => {
    it("should generate comprehensive report text", () => {
      const results = Object.keys(BASELINE_METRICS).map((scriptName) =>
        createMockBenchmark(scriptName),
      );

      const report = generateReport(results);

      assert(typeof report === "string");
      assert(report.length > 100);
      assert(report.includes("VALIDATION REPORT"));
    });

    it("should include all script names in report", () => {
      const results = Object.keys(BASELINE_METRICS).map((scriptName) =>
        createMockBenchmark(scriptName),
      );

      const report = generateReport(results);

      Object.keys(BASELINE_METRICS).forEach((scriptName) => {
        assert(
          report.includes(scriptName),
          `Report should include ${scriptName}`,
        );
      });
    });

    it("should include performance metrics in report", () => {
      const results = Object.keys(BASELINE_METRICS).map((scriptName) =>
        createMockBenchmark(scriptName),
      );

      const report = generateReport(results);

      assert(report.includes("Execution Time"));
      assert(report.includes("Memory"));
      assert(report.includes("API"));
    });

    it("should include validation checklist", () => {
      const results = Object.keys(BASELINE_METRICS).map((scriptName) =>
        createMockBenchmark(scriptName),
      );

      const report = generateReport(results);

      assert(
        report.includes("VALIDATION CHECKLIST") ||
          report.includes("Checklist") ||
          report.includes("✓"),
      );
    });

    it("should show target achievement status", () => {
      const results = Object.keys(BASELINE_METRICS).map((scriptName) =>
        createMockBenchmark(scriptName),
      );

      const report = generateReport(results);

      // Should indicate all targets are met
      assert(
        report.includes("✅") ||
          report.includes("✓") ||
          report.includes("PASS"),
      );
    });
  });

  describe("saveResults function", () => {
    it("should save results to JSON file", () => {
      const results = Object.keys(BASELINE_METRICS).map((scriptName) =>
        createMockBenchmark(scriptName),
      );

      const tempPath = "/tmp/test-benchmarks-phase-2c.json";

      try {
        saveResults(results, tempPath);

        assert(fs.existsSync(tempPath), "File should be created");

        const saved = JSON.parse(fs.readFileSync(tempPath, "utf-8"));
        assert(saved.metadata, "Should have metadata");
        assert(saved.results, "Should have results");
        assert(saved.aggregateStats, "Should have aggregateStats");
      } finally {
        if (fs.existsSync(tempPath)) {
          fs.unlinkSync(tempPath);
        }
      }
    });

    it("should include metadata in saved results", () => {
      const results = Object.keys(BASELINE_METRICS).map((scriptName) =>
        createMockBenchmark(scriptName),
      );

      const tempPath = "/tmp/test-metadata-phase-2c.json";

      try {
        saveResults(results, tempPath);

        const saved = JSON.parse(fs.readFileSync(tempPath, "utf-8"));
        assert(saved.metadata.phase, "Should have phase in metadata");
        assert(saved.metadata.timestamp, "Should have timestamp");
      } finally {
        if (fs.existsSync(tempPath)) {
          fs.unlinkSync(tempPath);
        }
      }
    });

    it("should calculate aggregate statistics", () => {
      const results = Object.keys(BASELINE_METRICS).map((scriptName) =>
        createMockBenchmark(scriptName),
      );

      const tempPath = "/tmp/test-stats-phase-2c.json";

      try {
        saveResults(results, tempPath);

        const saved = JSON.parse(fs.readFileSync(tempPath, "utf-8"));
        const stats = saved.aggregateStats;

        assert.equal(
          stats.totalScriptsOptimized,
          3,
          "Should have 3 scripts optimized",
        );
        assert(
          stats.averageExecutionTimeImprovement,
          "Should have avg execution time",
        );
        assert(
          stats.averageMemoryImprovement,
          "Should have avg memory improvement",
        );
        assert(stats.totalTimeSaved, "Should have total time saved");
      } finally {
        if (fs.existsSync(tempPath)) {
          fs.unlinkSync(tempPath);
        }
      }
    });

    it("should preserve result structure in JSON", () => {
      const results = Object.keys(BASELINE_METRICS).map((scriptName) =>
        createMockBenchmark(scriptName),
      );

      const tempPath = "/tmp/test-structure-phase-2c.json";

      try {
        saveResults(results, tempPath);

        const saved = JSON.parse(fs.readFileSync(tempPath, "utf-8"));

        saved.results.forEach((result) => {
          assert(result.scriptName, "Should have script name");
          assert(result.baseline, "Should have baseline");
          assert(result.actual, "Should have actual");
        });
      } finally {
        if (fs.existsSync(tempPath)) {
          fs.unlinkSync(tempPath);
        }
      }
    });
  });

  describe("Integration tests", () => {
    it("should generate complete benchmarking workflow", () => {
      // Create benchmarks
      const results = Object.keys(BASELINE_METRICS).map((scriptName) =>
        createMockBenchmark(scriptName),
      );

      // Generate report
      const report = generateReport(results);
      assert(report.length > 500);

      // Save results
      const tempPath = "/tmp/test-integration-phase-2c.json";
      try {
        saveResults(results, tempPath);
        assert(fs.existsSync(tempPath));

        const saved = JSON.parse(fs.readFileSync(tempPath, "utf-8"));
        assert.equal(saved.results.length, 3);
      } finally {
        if (fs.existsSync(tempPath)) {
          fs.unlinkSync(tempPath);
        }
      }
    });

    it("should validate all improvements meet minimum targets", () => {
      const results = Object.keys(BASELINE_METRICS).map((scriptName) =>
        createMockBenchmark(scriptName),
      );

      const allMeetTarget = results.every((result) => {
        const imp = result.calculateImprovements();
        return (
          parseFloat(imp.executionTime.improvement) >=
          OPTIMIZATION_TARGET_MIN * 100
        );
      });

      assert(allMeetTarget, "All scripts should meet minimum 10% target");
    });
  });
});
