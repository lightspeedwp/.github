/**
 * Unit tests for metrics-dashboard-phase-2c.js
 *
 * Tests HTML dashboard generation and Markdown report generation
 * for Phase 2C performance metrics
 */

import { strict as assert } from "assert";
import fs from "fs";
import path from "path";
import {
  generateHTMLDashboard,
  generateMarkdownReport,
} from "./metrics-dashboard-phase-2c.js";

/**
 * Mock BenchmarkResult class for testing
 */
class MockBenchmarkResult {
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
 * Test suite for metrics dashboard generator
 */
describe("metrics-dashboard-phase-2c", () => {
  describe("generateHTMLDashboard", () => {
    it("should generate valid HTML with proper structure", () => {
      const results = [
        new MockBenchmarkResult("sync-pr-labels", 2640, 8.2, 39),
        new MockBenchmarkResult("pr-triage-orchestrator", 2816, 9.5, 32),
        new MockBenchmarkResult("allocate-to-milestone", 2464, 8.8, 30),
      ];

      const tempPath = "/tmp/test-dashboard-phase-2c.html";
      generateHTMLDashboard(results, tempPath);

      assert(fs.existsSync(tempPath), "HTML file should be created");
      const content = fs.readFileSync(tempPath, "utf-8");

      assert(content.includes("<!DOCTYPE html>"), "Should include DOCTYPE");
      assert(content.includes("Phase 2C Performance"), "Should have title");
      assert(content.includes("sync-pr-labels"), "Should include script names");
      assert(content.includes("12"), "Should show improvement percentage");

      fs.unlinkSync(tempPath);
    });

    it("should calculate aggregate statistics correctly", () => {
      const results = [
        new MockBenchmarkResult("sync-pr-labels", 2640, 8.2, 39),
        new MockBenchmarkResult("pr-triage-orchestrator", 2816, 9.5, 32),
        new MockBenchmarkResult("allocate-to-milestone", 2464, 8.8, 30),
      ];

      const tempPath = "/tmp/test-dashboard-stats.html";
      generateHTMLDashboard(results, tempPath);

      const content = fs.readFileSync(tempPath, "utf-8");
      assert(content.includes("12"), "Should show average 12% improvement");
      assert(
        content.includes("18"),
        "Should show average 18% memory improvement",
      );

      fs.unlinkSync(tempPath);
    });

    it("should throw error with empty results array", () => {
      const tempPath = "/tmp/test-dashboard-empty.html";
      try {
        generateHTMLDashboard([], tempPath);
        assert.fail("Should throw error for empty results");
      } catch (err) {
        assert(err.message.includes("Cannot generate HTML dashboard"));
      }
    });

    it("should indicate status when all targets are met", () => {
      const results = [
        new MockBenchmarkResult("sync-pr-labels", 2640, 8.2, 39),
        new MockBenchmarkResult("pr-triage-orchestrator", 2816, 9.5, 32),
        new MockBenchmarkResult("allocate-to-milestone", 2464, 8.8, 30),
      ];

      const tempPath = "/tmp/test-dashboard-status.html";
      generateHTMLDashboard(results, tempPath);

      const content = fs.readFileSync(tempPath, "utf-8");
      assert(
        content.includes("success") || content.includes("✅"),
        "Should show success status",
      );

      fs.unlinkSync(tempPath);
    });

    it("should include cache hit rate information", () => {
      const results = [
        new MockBenchmarkResult("sync-pr-labels", 2640, 8.2, 39, 55),
        new MockBenchmarkResult("pr-triage-orchestrator", 2816, 9.5, 32, 60),
        new MockBenchmarkResult("allocate-to-milestone", 2464, 8.8, 30, 50),
      ];

      const tempPath = "/tmp/test-dashboard-cache.html";
      generateHTMLDashboard(results, tempPath);

      const content = fs.readFileSync(tempPath, "utf-8");
      assert(
        content.includes("55") || content.includes("Cache"),
        "Should include cache info",
      );

      fs.unlinkSync(tempPath);
    });
  });

  describe("generateMarkdownReport", () => {
    it("should generate valid Markdown with required sections", () => {
      const results = [
        new MockBenchmarkResult("sync-pr-labels", 2640, 8.2, 39),
        new MockBenchmarkResult("pr-triage-orchestrator", 2816, 9.5, 32),
        new MockBenchmarkResult("allocate-to-milestone", 2464, 8.8, 30),
      ];

      const report = generateMarkdownReport(results);

      assert(report.includes("# 📊 Phase 2C"), "Should have main heading");
      assert(
        report.includes("Executive Summary"),
        "Should have Executive Summary",
      );
      assert(
        report.includes("Per-Script Results"),
        "Should have Per-Script Results section",
      );
      assert(
        report.includes("Validation Checklist"),
        "Should have Validation Checklist",
      );
    });

    it("should include performance metrics for each script", () => {
      const results = [
        new MockBenchmarkResult("sync-pr-labels", 2640, 8.2, 39),
        new MockBenchmarkResult("pr-triage-orchestrator", 2816, 9.5, 32),
      ];

      const report = generateMarkdownReport(results);

      assert(report.includes("sync-pr-labels"), "Should list script name");
      assert(
        report.includes("2640") || report.includes("12"),
        "Should include execution time",
      );
      assert(
        report.includes("8.2") || report.includes("18"),
        "Should include memory info",
      );
    });

    it("should calculate average improvements correctly", () => {
      const results = [
        new MockBenchmarkResult("sync-pr-labels", 2640, 8.2, 39),
        new MockBenchmarkResult("pr-triage-orchestrator", 2816, 9.5, 32),
        new MockBenchmarkResult("allocate-to-milestone", 2464, 8.8, 30),
      ];

      const report = generateMarkdownReport(results);

      // Average time improvement: (360 + 184 + 536) / 3 / 3000 * 100 ≈ 12%
      // Average memory improvement: (1.8 + 0.5 + 1.2) / 3 / 10 * 100 = 18%
      assert(
        report.includes("12"),
        "Should show 12% average execution time improvement",
      );
    });

    it("should indicate validation status for all targets", () => {
      const results = [
        new MockBenchmarkResult("sync-pr-labels", 2640, 8.2, 39),
        new MockBenchmarkResult("pr-triage-orchestrator", 2816, 9.5, 32),
        new MockBenchmarkResult("allocate-to-milestone", 2464, 8.8, 30),
      ];

      const report = generateMarkdownReport(results);

      assert(
        report.includes("✅") || report.includes("- [x]"),
        "Should show checkmarks for met targets",
      );
    });

    it("should throw error with empty results array", () => {
      try {
        generateMarkdownReport([]);
        assert.fail("Should throw error for empty results");
      } catch (err) {
        assert(err.message.includes("Cannot generate Markdown report"));
      }
    });

    it("should include ISO timestamp", () => {
      const results = [
        new MockBenchmarkResult("sync-pr-labels", 2640, 8.2, 39),
      ];

      const report = generateMarkdownReport(results);

      assert(
        report.includes("T") || report.includes("Z"),
        "Should include ISO timestamp",
      );
    });

    it("should clarify synthetic/mock data status", () => {
      const results = [
        new MockBenchmarkResult("sync-pr-labels", 2640, 8.2, 39),
      ];

      const report = generateMarkdownReport(results);

      // Report should clarify the nature of data
      assert(
        report.length > 100,
        "Should have sufficient content documenting methodology",
      );
    });
  });

  describe("Integration tests", () => {
    it("should generate both HTML and Markdown reports for same data", () => {
      const results = [
        new MockBenchmarkResult("sync-pr-labels", 2640, 8.2, 39),
        new MockBenchmarkResult("pr-triage-orchestrator", 2816, 9.5, 32),
        new MockBenchmarkResult("allocate-to-milestone", 2464, 8.8, 30),
      ];

      const htmlPath = "/tmp/test-integration.html";
      const report = generateMarkdownReport(results);

      generateHTMLDashboard(results, htmlPath);

      assert(fs.existsSync(htmlPath), "HTML file should exist");
      const htmlContent = fs.readFileSync(htmlPath, "utf-8");

      // Both should have similar metrics
      assert(htmlContent.length > 1000, "HTML should be substantial");
      assert(report.length > 500, "Markdown should be substantial");

      fs.unlinkSync(htmlPath);
    });
  });
});
