/**
 * Phase 2B Validation Test Suite
 *
 * Comprehensive test suite for validating Phase 2B optimization improvements
 * against baseline metrics and generating performance reports.
 */

import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import {
  runBenchmarks,
  generateReport,
  saveResults,
  OPTIMIZATION_TARGET,
} from "./performance-benchmarking.js";
import {
  generateHTMLDashboard,
  generateMarkdownReport,
} from "./metrics-dashboard.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Derive REPO_ROOT from __dirname: scripts/automation/__tests__/performance -> repo root
const REPO_ROOT = path.resolve(path.join(__dirname, "../../../../"));

describe("Phase 2B Performance Validation", () => {
  let benchmarkResults;

  beforeAll(async () => {
    // Capture tracked results file state before test
    const trackedResultsPath = path.join(
      REPO_ROOT,
      "scripts/automation/__tests__/performance/results-phase-2b.json",
    );
    const beforeStats = fs.existsSync(trackedResultsPath)
      ? fs.statSync(trackedResultsPath)
      : null;

    // Run benchmarks without persisting to tracked file
    benchmarkResults = await runBenchmarks();

    // Verify that tracked file was not modified during benchmark execution
    const afterStats = fs.existsSync(trackedResultsPath)
      ? fs.statSync(trackedResultsPath)
      : null;
    expect({
      existedBefore: beforeStats !== null,
      existsAfter: afterStats !== null,
      sameModificationTime: beforeStats?.mtime === afterStats?.mtime,
    }).toEqual({
      existedBefore: beforeStats !== null,
      existsAfter: afterStats !== null,
      sameModificationTime: true,
    });
  });

  describe("Execution Time Improvements", () => {
    it("should improve audit-issue-metadata execution time by at least 30%", () => {
      const result = benchmarkResults.find(
        (r) => r.scriptName === "audit-issue-metadata",
      );
      expect(result).toBeDefined();

      const improvements = result.calculateImprovements();
      const improvement = improvements.executionTime.improvement;

      expect(improvement).toBeGreaterThanOrEqual(OPTIMIZATION_TARGET * 100);
    });

    it("should improve bulk-issue-metadata-updater execution time by at least 30%", () => {
      const result = benchmarkResults.find(
        (r) => r.scriptName === "bulk-issue-metadata-updater",
      );
      expect(result).toBeDefined();

      const improvements = result.calculateImprovements();
      const improvement = improvements.executionTime.improvement;

      expect(improvement).toBeGreaterThanOrEqual(OPTIMIZATION_TARGET * 100);
    });

    it("should improve staging-validation execution time by at least 30%", () => {
      const result = benchmarkResults.find(
        (r) => r.scriptName === "staging-validation",
      );
      expect(result).toBeDefined();

      const improvements = result.calculateImprovements();
      const improvement = improvements.executionTime.improvement;

      expect(improvement).toBeGreaterThanOrEqual(OPTIMIZATION_TARGET * 100);
    });

    it("should achieve average execution time improvement across all scripts", () => {
      const avgImprovement =
        benchmarkResults.reduce((sum, r) => {
          return sum + r.calculateImprovements().executionTime.improvement;
        }, 0) / benchmarkResults.length;

      expect(avgImprovement).toBeGreaterThanOrEqual(OPTIMIZATION_TARGET * 100);
    });
  });

  describe("Memory Usage Improvements", () => {
    it("should reduce memory usage by at least 27%", () => {
      const avgMemoryImprovement =
        benchmarkResults.reduce((sum, r) => {
          return sum + r.calculateImprovements().memory.improvement;
        }, 0) / benchmarkResults.length;

      expect(avgMemoryImprovement).toBeGreaterThanOrEqual(
        OPTIMIZATION_TARGET * 100 * 0.9,
      );
    });

    it("should have measurable peak memory reduction", () => {
      for (const result of benchmarkResults) {
        const improvements = result.calculateImprovements();
        expect(improvements.memory.actual).toBeLessThan(
          improvements.memory.baseline,
        );
      }
    });
  });

  describe("API Call Optimization", () => {
    it("should reduce API calls through caching", () => {
      for (const result of benchmarkResults) {
        const improvements = result.calculateImprovements();
        // Should reduce API calls by at least 20%
        expect(improvements.apiCalls.improvement).toBeGreaterThanOrEqual(20);
      }
    });

    it("should achieve cache hit rates above 60%", () => {
      for (const result of benchmarkResults) {
        const improvements = result.calculateImprovements();
        expect(parseInt(improvements.cacheHitRate)).toBeGreaterThanOrEqual(60);
      }
    });
  });

  describe("Optimization Target Validation", () => {
    it("should meet 30% execution time improvement target", () => {
      const allTargetsMet = benchmarkResults.every((r) => {
        return r.calculateImprovements().executionTime.targetMet;
      });

      expect(allTargetsMet).toBe(true);
    });

    it("should document all baseline metrics", () => {
      for (const result of benchmarkResults) {
        expect(result.baseline).toBeDefined();
        expect(result.baseline.executionTime).toBeGreaterThan(0);
        expect(result.baseline.memoryUsage).toBeGreaterThan(0);
        expect(result.baseline.apiCalls).toBeGreaterThan(0);
      }
    });

    it("should calculate improvements correctly", () => {
      for (const result of benchmarkResults) {
        const improvements = result.calculateImprovements();

        // Verify calculation logic
        expect(improvements.executionTime.improvement).toEqual(
          (1 -
            improvements.executionTime.actual /
              improvements.executionTime.baseline) *
            100,
        );

        expect(improvements.memory.improvement).toEqual(
          (1 - improvements.memory.actual / improvements.memory.baseline) * 100,
        );
      }
    });
  });

  describe("Report Generation", () => {
    it("should generate text report", () => {
      const report = generateReport(benchmarkResults);

      expect(report).toContain("PHASE 2B OPTIMIZATION VALIDATION REPORT");
      expect(report).toContain("EXECUTIVE SUMMARY");
      expect(report).toContain("PER-SCRIPT RESULTS");
      expect(report).toContain("AGGREGATE IMPROVEMENTS");
      expect(report).toContain("VALIDATION CHECKLIST");
    });

    it("should include improvement percentages in report", () => {
      const report = generateReport(benchmarkResults);

      for (const result of benchmarkResults) {
        const improvements = result.calculateImprovements();
        expect(report).toContain(result.scriptName);
        expect(report).toContain(
          improvements.executionTime.improvement.toFixed(2),
        );
      }
    });

    it("should generate HTML dashboard", () => {
      const tempDir = fs.mkdtempSync(path.join(__dirname, ".tmp-html-"));
      const dashboardPath = path.join(tempDir, "phase-2b-dashboard.html");

      try {
        generateHTMLDashboard(benchmarkResults, dashboardPath);

        expect(fs.existsSync(dashboardPath)).toBe(true);

        const html = fs.readFileSync(dashboardPath, "utf8");
        expect(html).toContain("Phase 2B Performance Validation");
        expect(html).toContain("Avg Execution Time Improvement");
        expect(html).toContain("Per-Script Performance Metrics");
      } finally {
        // Clean up temporary directory
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    });

    it("should generate Markdown report", () => {
      const report = generateMarkdownReport(benchmarkResults);

      expect(report).toContain("Phase 2B Performance Validation Report");
      expect(report).toContain("Executive Summary");
      expect(report).toContain("Per-Script Results");
      expect(report).toContain("Validation Checklist");
      expect(report).toContain("Phase 2C Optimization");
    });
  });

  describe("Results Persistence", () => {
    it("should save results to JSON file", () => {
      const resultsPath = path.join(__dirname, "results-phase-2b.json");
      saveResults(benchmarkResults, resultsPath);

      expect(fs.existsSync(resultsPath)).toBe(true);

      const saved = JSON.parse(fs.readFileSync(resultsPath, "utf8"));
      expect(saved.metadata.phase).toBe("2B Validation");
      expect(saved.results).toHaveLength(benchmarkResults.length);
    });
  });

  afterAll(() => {
    // Only generate reports if requested via environment variable
    if (process.env.GENERATE_REPORTS !== "true") {
      return;
    }

    // Generate and save reports
    const report = generateReport(benchmarkResults);
    const reportPath = path.join(__dirname, "PHASE-2B-VALIDATION-REPORT.txt");
    fs.writeFileSync(reportPath, report);

    const dashboardPath = path.join(__dirname, "phase-2b-dashboard.html");
    generateHTMLDashboard(benchmarkResults, dashboardPath);

    const markdownPath = path.join(
      REPO_ROOT,
      "docs/PHASE-2B-VALIDATION-RESULTS.md",
    );
    const markdownReport = generateMarkdownReport(benchmarkResults);
    fs.mkdirSync(path.dirname(markdownPath), { recursive: true });
    fs.writeFileSync(markdownPath, markdownReport);

    console.log("\n✅ All reports generated successfully!");
    console.log(`   - Text Report: ${reportPath}`);
    console.log(`   - HTML Dashboard: ${dashboardPath}`);
    console.log(`   - Markdown Report: ${markdownPath}`);
  });
});
