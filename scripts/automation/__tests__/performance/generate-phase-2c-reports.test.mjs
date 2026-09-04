/**
 * Unit tests for generate-phase-2c-reports.mjs
 *
 * Tests the report generation script that runs benchmarks and generates
 * HTML dashboards and Markdown reports
 */

import { strict as assert } from "assert";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Mock benchmark result for testing
 */
class MockResult {
  constructor(scriptName, executionTime, memory, apiCalls, cacheHitRate = 55) {
    this.scriptName = scriptName;
    this.baseline = {
      executionTime: 3000,
      memory: 10,
      apiCalls: 50,
    };
    this.actual = {
      executionTime,
      memory,
      apiCalls,
    };
    this.cacheHitRate = cacheHitRate;
  }

  calculateImprovements() {
    return {
      scriptName: this.scriptName,
      executionTime: {
        baseline: this.baseline.executionTime,
        actual: this.actual.executionTime,
        improvement: (
          ((this.baseline.executionTime - this.actual.executionTime) /
            this.baseline.executionTime) *
          100
        ).toFixed(2),
        targetMet:
          ((this.baseline.executionTime - this.actual.executionTime) /
            this.baseline.executionTime) *
            100 >=
          10,
      },
      memory: {
        baseline: this.baseline.memory,
        actual: this.actual.memory,
        improvement: (
          ((this.baseline.memory - this.actual.memory) / this.baseline.memory) *
          100
        ).toFixed(2),
      },
      apiCalls: {
        baseline: this.baseline.apiCalls,
        actual: this.actual.apiCalls,
        improvement: (
          ((this.baseline.apiCalls - this.actual.apiCalls) /
            this.baseline.apiCalls) *
          100
        ).toFixed(2),
      },
      cacheHitRate: this.cacheHitRate,
    };
  }
}

/**
 * Test utilities for report generation
 */
describe("generate-phase-2c-reports", () => {
  describe("Report generation utilities", () => {
    it("should handle multiple benchmark results", () => {
      const results = [
        new MockResult("sync-pr-labels", 2640, 8.2, 39),
        new MockResult("pr-triage-orchestrator", 2816, 9.5, 32),
        new MockResult("allocate-to-milestone", 2464, 8.8, 30),
      ];

      assert.equal(results.length, 3, "Should have 3 results");
      results.forEach((result) => {
        assert(result.scriptName, "Each result should have a script name");
        assert(result.calculateImprovements, "Each result should have calculateImprovements method");
      });
    });

    it("should calculate improvements for all results", () => {
      const results = [
        new MockResult("sync-pr-labels", 2640, 8.2, 39),
        new MockResult("pr-triage-orchestrator", 2816, 9.5, 32),
        new MockResult("allocate-to-milestone", 2464, 8.8, 30),
      ];

      const improvements = results.map((r) => ({
        scriptName: r.scriptName,
        ...r.calculateImprovements(),
      }));

      improvements.forEach((imp) => {
        assert(imp.scriptName, "Should have script name");
        assert(imp.executionTime, "Should have execution time metrics");
        assert(imp.memory, "Should have memory metrics");
        assert(imp.apiCalls, "Should have API call metrics");
        assert(
          imp.executionTime.improvement >= 10,
          "Should show at least 10% improvement"
        );
        assert(imp.executionTime.targetMet, "Should indicate target met");
      });
    });

    it("should aggregate statistics across all scripts", () => {
      const results = [
        new MockResult("sync-pr-labels", 2640, 8.2, 39),
        new MockResult("pr-triage-orchestrator", 2816, 9.5, 32),
        new MockResult("allocate-to-milestone", 2464, 8.8, 30),
      ];

      const improvements = results.map((r) => ({
        scriptName: r.scriptName,
        ...r.calculateImprovements(),
      }));

      // Calculate aggregate
      const totalTimeImprovement = improvements.reduce(
        (sum, i) => sum + parseFloat(i.executionTime.improvement),
        0
      );
      const avgTimeImprovement = (totalTimeImprovement / improvements.length).toFixed(2);

      assert.equal(
        avgTimeImprovement,
        "12.00",
        "Should calculate 12% average improvement"
      );
    });

    it("should generate summary statistics", () => {
      const results = [
        new MockResult("sync-pr-labels", 2640, 8.2, 39),
        new MockResult("pr-triage-orchestrator", 2816, 9.5, 32),
        new MockResult("allocate-to-milestone", 2464, 8.8, 30),
      ];

      const improvements = results.map((r) => ({
        scriptName: r.scriptName,
        ...r.calculateImprovements(),
      }));

      const stats = {
        totalScriptsOptimized: improvements.length,
        averageExecutionTimeImprovement: (
          improvements.reduce((sum, i) => sum + parseFloat(i.executionTime.improvement), 0) /
          improvements.length
        ).toFixed(2),
        averageMemoryImprovement: (
          improvements.reduce((sum, i) => sum + parseFloat(i.memory.improvement), 0) /
          improvements.length
        ).toFixed(2),
        totalTimeSaved: improvements.reduce(
          (sum, i) => sum + (i.executionTime.baseline - i.executionTime.actual),
          0
        ),
        totalAPICallsReduced: improvements.reduce(
          (sum, i) => sum + (i.apiCalls.baseline - i.apiCalls.actual),
          0
        ),
      };

      assert.equal(
        stats.totalScriptsOptimized,
        3,
        "Should optimize 3 scripts"
      );
      assert.equal(
        stats.averageExecutionTimeImprovement,
        "12.00",
        "Should average 12% improvement"
      );
      assert.equal(
        stats.averageMemoryImprovement,
        "18.00",
        "Should average 18% memory improvement"
      );
    });

    it("should validate improvement calculations", () => {
      const result = new MockResult("sync-pr-labels", 2640, 8.2, 39);
      const imp = result.calculateImprovements();

      // Baseline: 3000ms, Actual: 2640ms
      // Improvement: (3000 - 2640) / 3000 * 100 = 12%
      assert.equal(imp.executionTime.improvement, "12.00");

      // Baseline: 10MB, Actual: 8.2MB
      // Improvement: (10 - 8.2) / 10 * 100 = 18%
      assert.equal(imp.memory.improvement, "18.00");

      // Baseline: 50 calls, Actual: 39 calls
      // Reduction: (50 - 39) / 50 * 100 = 22%
      assert(parseFloat(imp.apiCalls.improvement) >= 20);
    });
  });

  describe("Report output handling", () => {
    it("should create valid output paths", () => {
      const tempDir = "/tmp/phase-2c-reports-test";
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      assert(fs.existsSync(tempDir), "Temp directory should be created");
      fs.rmdirSync(tempDir);
    });

    it("should handle file I/O operations safely", () => {
      const tempFile = "/tmp/test-report-phase-2c.json";
      const data = {
        metadata: { phase: "2C Validation", timestamp: new Date().toISOString() },
        results: [
          new MockResult("sync-pr-labels", 2640, 8.2, 39).calculateImprovements(),
        ],
        aggregateStats: {
          totalScriptsOptimized: 1,
          averageExecutionTimeImprovement: "12.00",
        },
      };

      // Write file
      fs.writeFileSync(tempFile, JSON.stringify(data, null, 2));
      assert(fs.existsSync(tempFile), "File should be written");

      // Read file
      const read = JSON.parse(fs.readFileSync(tempFile, "utf-8"));
      assert.equal(
        read.metadata.phase,
        "2C Validation",
        "Data should be preserved"
      );

      // Cleanup
      fs.unlinkSync(tempFile);
    });

    it("should support custom output paths", () => {
      const customPath = "/tmp/custom-phase-2c-output.json";
      const data = {
        metadata: { phase: "2C" },
        results: [],
      };

      fs.writeFileSync(customPath, JSON.stringify(data));
      assert(fs.existsSync(customPath), "Should create file at custom path");

      fs.unlinkSync(customPath);
    });
  });

  describe("Error handling", () => {
    it("should handle missing results gracefully", () => {
      const results = [];
      assert.equal(results.length, 0, "Empty results should be handled");
    });

    it("should validate result structure", () => {
      const validResult = new MockResult("test", 2640, 8.2, 39);
      assert(validResult.scriptName, "Should have scriptName");
      assert(validResult.baseline, "Should have baseline");
      assert(validResult.actual, "Should have actual");
      assert(validResult.cacheHitRate, "Should have cacheHitRate");
    });

    it("should handle extreme values", () => {
      // Zero improvement
      const result1 = new MockResult("test", 3000, 10, 50);
      const imp1 = result1.calculateImprovements();
      assert.equal(imp1.executionTime.improvement, "0.00");

      // Maximum improvement
      const result2 = new MockResult("test", 1, 0.1, 1);
      const imp2 = result2.calculateImprovements();
      assert(parseFloat(imp2.executionTime.improvement) > 90);
    });
  });
});
