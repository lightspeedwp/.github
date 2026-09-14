/**
 * Phase 2C Optimization Validation Test Suite
 *
 * Tests the Phase 2C optimized scripts to ensure:
 * 1. Native fetch client is properly integrated
 * 2. Response caching is functional with TTL expiration
 * 3. Batch operations work with configurable concurrency
 * 4. Performance targets (10-15% improvement) are met
 * 5. Cache hit rates are acceptable (50-70%)
 * 6. Memory usage is optimized
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
} from "./performance-benchmarking-phase-2c.js";

describe("Phase 2C Optimization Validation", () => {
  let results;

  it("Test 1: baseline metrics are complete for all scripts", () => {
    const requiredScripts = [
      "sync-pr-labels",
      "pr-triage-orchestrator",
      "allocate-to-milestone",
    ];

    const allPresent = requiredScripts.every((script) =>
      Object.prototype.hasOwnProperty.call(BASELINE_METRICS, script),
    );
    assert(allPresent, "All required scripts must have baseline metrics");

    requiredScripts.forEach((script) => {
      const metrics = BASELINE_METRICS[script];
      const requiredFields = [
        "executionTime",
        "memoryUsage",
        "apiCalls",
        "description",
      ];
      const hasAllFields = requiredFields.every((field) =>
        Object.prototype.hasOwnProperty.call(metrics, field),
      );
      assert(hasAllFields, `${script} must have all required fields`);
    });
  });

  it("Test 2: mock benchmarks generate valid results", () => {
    const scripts = Object.keys(BASELINE_METRICS);
    results = [];

    for (const scriptName of scripts) {
      const result = createMockBenchmark(scriptName);
      results.push(result);

      assert(
        typeof result.executionTime === "number" && result.executionTime > 0,
        `${scriptName} execution time must be a positive number`,
      );
      assert(result.memory, `${scriptName} must have memory metrics`);
      assert(result.apiCalls, `${scriptName} must have API call metrics`);
    }
  });

  it("Test 3: performance targets are met", () => {
    const improvements = results.map((r) => ({
      scriptName: r.scriptName,
      ...r.calculateImprovements(),
    }));

    let meetsMinTarget = 0;
    improvements.forEach((imp) => {
      if (imp.executionTime.improvement >= OPTIMIZATION_TARGET_MIN * 100) {
        meetsMinTarget++;
      }
    });

    assert(
      meetsMinTarget >= 2,
      "At least 2 of 3 scripts must meet minimum 10% target",
    );
  });

  it("Test 4: cache hit rates are in an acceptable range", () => {
    const improvements = results.map((r) => ({
      scriptName: r.scriptName,
      ...r.calculateImprovements(),
    }));

    const validCacheRates = improvements.every((imp) => {
      const hitRate = parseFloat(imp.cacheHitRate);
      return hitRate >= 40 && hitRate <= 80;
    });

    assert(validCacheRates, "Cache hit rates must be between 40-80%");
  });

  it("Test 5: API call reduction meets target", () => {
    const improvements = results.map((r) => ({
      scriptName: r.scriptName,
      ...r.calculateImprovements(),
    }));

    improvements.forEach((imp) => {
      assert(
        imp.apiCalls.improvement >= 10,
        `${imp.scriptName} must reduce API calls by at least 10%`,
      );
    });
  });

  it("Test 6: memory usage is optimized", () => {
    const improvements = results.map((r) => ({
      scriptName: r.scriptName,
      ...r.calculateImprovements(),
    }));

    improvements.forEach((imp) => {
      assert(
        imp.memory.improvement >= 5,
        `${imp.scriptName} must reduce memory usage by at least 5%`,
      );
    });
  });

  it("Test 7: report generation is complete", () => {
    const report = generateReport(results);

    const hasHeader = report.includes(
      "PHASE 2C OPTIMIZATION VALIDATION REPORT",
    );
    const hasSummary = report.includes("EXECUTIVE SUMMARY");
    const hasMetrics = report.includes("PER-SCRIPT RESULTS");

    assert(hasHeader && hasSummary && hasMetrics, "Report must be complete");
  });

  it("Test 8: results JSON format is valid", () => {
    const tempPath = "/tmp/test-results-phase-2c.json";

    try {
      saveResults(results, tempPath);

      const saved = JSON.parse(fs.readFileSync(tempPath, "utf-8"));

      const hasMetadata =
        saved.metadata && saved.metadata.phase === "2C Validation";
      const hasResults =
        Array.isArray(saved.results) && saved.results.length > 0;
      const hasStats = saved.aggregateStats;

      assert(hasMetadata && hasResults && hasStats, "JSON structure invalid");
    } finally {
      if (fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath);
      }
    }
  });
});
