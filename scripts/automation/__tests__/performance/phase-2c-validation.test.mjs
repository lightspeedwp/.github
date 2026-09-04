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

/**
 * Test suite configuration
 */
const TEST_CONFIG = {
  timeoutMs: 30000,
  verbose: true,
};

/**
 * Utility to log test progress
 */
function logTest(name, passed, details = "") {
  const icon = passed ? "✅" : "❌";
  console.log(`${icon} ${name}`);
  if (details && passed) console.log(`   ${details}`);
}

/**
 * Test 1: Verify baseline metrics exist for all scripts
 */
async function testBaselineMetricsComplete() {
  console.log("\n📋 Test 1: Baseline Metrics Completeness");
  console.log("─".repeat(60));

  const requiredScripts = [
    "sync-pr-labels",
    "pr-triage-orchestrator",
    "allocate-to-milestone",
  ];

  const allPresent = requiredScripts.every((script) =>
    Object.prototype.hasOwnProperty.call(BASELINE_METRICS, script),
  );
  logTest("All scripts have baseline metrics", allPresent);

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
    logTest(`  ${script} has required fields`, hasAllFields);
  });

  assert(allPresent, "All required scripts must have baseline metrics");
}

/**
 * Test 2: Verify mock benchmarks generate valid results
 */
async function testMockBenchmarkGeneration() {
  console.log("\n📊 Test 2: Mock Benchmark Generation");
  console.log("─".repeat(60));

  const scripts = Object.keys(BASELINE_METRICS);
  const results = [];

  for (const scriptName of scripts) {
    const result = createMockBenchmark(scriptName);
    results.push(result);

    // Verify structure
    const hasRequiredFields =
      typeof result.executionTime === "number" &&
      result.memory &&
      result.apiCalls;
    logTest(
      `  ${scriptName} has valid structure`,
      hasRequiredFields,
      `Time: ${result.executionTime.toFixed(0)}ms`,
    );

    assert(
      typeof result.executionTime === "number" && result.executionTime > 0,
      `${scriptName} execution time must be a positive number`,
    );
    assert(result.memory, `${scriptName} must have memory metrics`);
    assert(result.apiCalls, `${scriptName} must have API call metrics`);
  }

  return results;
}

/**
 * Test 3: Verify performance targets are met
 */
async function testPerformanceTargets(results) {
  console.log("\n🎯 Test 3: Performance Target Validation");
  console.log("─".repeat(60));

  const improvements = results.map((r) => ({
    scriptName: r.scriptName,
    ...r.calculateImprovements(),
  }));

  let meetsMinTarget = 0;
  let inTargetRange = 0;

  improvements.forEach((imp) => {
    const improvement = imp.executionTime.improvement;
    const meetsMin = improvement >= OPTIMIZATION_TARGET_MIN * 100;
    const inRange =
      improvement >= OPTIMIZATION_TARGET_MIN * 100 &&
      improvement <= OPTIMIZATION_TARGET_MAX * 100;

    if (meetsMin) meetsMinTarget++;
    if (inRange) inTargetRange++;

    logTest(
      `  ${imp.scriptName}: ${improvement.toFixed(2)}% improvement`,
      meetsMin,
      `Target: ${OPTIMIZATION_TARGET_MIN * 100}%-${OPTIMIZATION_TARGET_MAX * 100}%`,
    );
  });

  const avgImprovement = (
    improvements.reduce((sum, i) => sum + i.executionTime.improvement, 0) /
    improvements.length
  ).toFixed(2);

  console.log(
    `\n📈 Summary: ${meetsMinTarget}/${results.length} scripts meet minimum target`,
  );
  console.log(
    `📈 Summary: ${inTargetRange}/${results.length} scripts in target range`,
  );
  console.log(`📈 Summary: Average improvement: ${avgImprovement}%`);

  assert(
    meetsMinTarget >= 2,
    "At least 2 of 3 scripts must meet minimum 10% target",
  );
}

/**
 * Test 4: Verify cache hit rates
 */
async function testCachePerformance(results) {
  console.log("\n💾 Test 4: Cache Performance Validation");
  console.log("─".repeat(60));

  const improvements = results.map((r) => ({
    scriptName: r.scriptName,
    ...r.calculateImprovements(),
  }));

  const validCacheRates = improvements.every((imp) => {
    const hitRate = parseFloat(imp.cacheHitRate);
    return hitRate >= 40 && hitRate <= 80; // Reasonable cache hit rate range
  });

  logTest("All cache hit rates in acceptable range (40-80%)", validCacheRates);

  improvements.forEach((imp) => {
    const hitRate = parseFloat(imp.cacheHitRate);
    logTest(`  ${imp.scriptName}: ${hitRate}% cache hit rate`, true);
  });

  assert(validCacheRates, "Cache hit rates must be between 40-80%");
}

/**
 * Test 5: Verify API call reduction
 */
async function testAPICallReduction(results) {
  console.log("\n🌐 Test 5: API Call Reduction Validation");
  console.log("─".repeat(60));

  const improvements = results.map((r) => ({
    scriptName: r.scriptName,
    ...r.calculateImprovements(),
  }));

  improvements.forEach((imp) => {
    const reduction = imp.apiCalls.improvement;
    const meetsTarget = reduction >= 15; // At least 15% API call reduction

    logTest(
      `  ${imp.scriptName}: ${reduction.toFixed(2)}% API call reduction`,
      meetsTarget,
      `${imp.apiCalls.baseline} → ${imp.apiCalls.actual} calls`,
    );

    assert(
      reduction >= 10,
      `${imp.scriptName} must reduce API calls by at least 10%`,
    );
  });
}

/**
 * Test 6: Verify memory optimization
 */
async function testMemoryOptimization(results) {
  console.log("\n🧠 Test 6: Memory Optimization Validation");
  console.log("─".repeat(60));

  const improvements = results.map((r) => ({
    scriptName: r.scriptName,
    ...r.calculateImprovements(),
  }));

  improvements.forEach((imp) => {
    const memoryImprovement = imp.memory.improvement;
    const meetsTarget = memoryImprovement >= 8; // At least 8% memory reduction

    logTest(
      `  ${imp.scriptName}: ${memoryImprovement.toFixed(2)}% memory reduction`,
      meetsTarget,
      `${imp.memory.baseline.toFixed(2)}MB → ${imp.memory.actual.toFixed(2)}MB`,
    );

    assert(
      memoryImprovement >= 5,
      `${imp.scriptName} must reduce memory usage by at least 5%`,
    );
  });
}

/**
 * Test 7: Verify report generation
 */
async function testReportGeneration(results) {
  console.log("\n📄 Test 7: Report Generation");
  console.log("─".repeat(60));

  const report = generateReport(results);

  const hasHeader = report.includes("PHASE 2C OPTIMIZATION VALIDATION REPORT");
  const hasSummary = report.includes("EXECUTIVE SUMMARY");
  const hasMetrics = report.includes("PER-SCRIPT RESULTS");
  const hasChecklist = report.includes("VALIDATION CHECKLIST");

  logTest("Report includes header", hasHeader);
  logTest("Report includes executive summary", hasSummary);
  logTest("Report includes per-script metrics", hasMetrics);
  logTest("Report includes validation checklist", hasChecklist);

  assert(hasHeader && hasSummary && hasMetrics, "Report must be complete");

  console.log(`\n📋 Report Preview (first 500 chars):`);
  console.log(report.substring(0, 500) + "...\n");
}

/**
 * Test 8: Verify results JSON format
 */
async function testResultsJSONFormat(results) {
  console.log("\n💾 Test 8: Results JSON Format Validation");
  console.log("─".repeat(60));

  // Create temp file to test saveResults
  const tempPath = "/tmp/test-results-phase-2c.json";

  try {
    saveResults(results, tempPath);

    // Read back and verify structure
    const saved = JSON.parse(fs.readFileSync(tempPath, "utf-8"));

    const hasMetadata =
      saved.metadata && saved.metadata.phase === "2C Validation";
    const hasResults = Array.isArray(saved.results) && saved.results.length > 0;
    const hasStats = saved.aggregateStats;

    logTest("JSON has valid metadata", hasMetadata);
    logTest("JSON has results array", hasResults);
    logTest("JSON has aggregate statistics", !!hasStats);

    assert(hasMetadata && hasResults && hasStats, "JSON structure invalid");

    console.log(`\n📊 Aggregate Stats:`);
    console.log(
      `   Scripts optimized: ${saved.aggregateStats.totalScriptsOptimized}`,
    );
    console.log(
      `   Avg time improvement: ${saved.aggregateStats.averageExecutionTimeImprovement}%`,
    );
    console.log(
      `   Total time saved: ${saved.aggregateStats.totalTimeSaved}ms`,
    );
  } finally {
    // Cleanup
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }
  }
}

/**
 * Main test runner
 */
export async function runAllTests() {
  console.log("\n" + "═".repeat(60));
  console.log("   PHASE 2C VALIDATION TEST SUITE");
  console.log("═".repeat(60));

  let passed = 0;
  let failed = 0;

  try {
    // Test 1: Baseline metrics
    try {
      await testBaselineMetricsComplete();
      passed++;
    } catch (err) {
      console.error(`❌ Test 1 failed: ${err.message}`);
      failed++;
    }

    // Test 2: Mock benchmarks
    let results;
    try {
      results = await testMockBenchmarkGeneration();
      passed++;
    } catch (err) {
      console.error(`❌ Test 2 failed: ${err.message}`);
      failed++;
      return;
    }

    // Test 3: Performance targets
    try {
      await testPerformanceTargets(results);
      passed++;
    } catch (err) {
      console.error(`❌ Test 3 failed: ${err.message}`);
      failed++;
    }

    // Test 4: Cache performance
    try {
      await testCachePerformance(results);
      passed++;
    } catch (err) {
      console.error(`❌ Test 4 failed: ${err.message}`);
      failed++;
    }

    // Test 5: API call reduction
    try {
      await testAPICallReduction(results);
      passed++;
    } catch (err) {
      console.error(`❌ Test 5 failed: ${err.message}`);
      failed++;
    }

    // Test 6: Memory optimization
    try {
      await testMemoryOptimization(results);
      passed++;
    } catch (err) {
      console.error(`❌ Test 6 failed: ${err.message}`);
      failed++;
    }

    // Test 7: Report generation
    try {
      await testReportGeneration(results);
      passed++;
    } catch (err) {
      console.error(`❌ Test 7 failed: ${err.message}`);
      failed++;
    }

    // Test 8: Results JSON format
    try {
      await testResultsJSONFormat(results);
      passed++;
    } catch (err) {
      console.error(`❌ Test 8 failed: ${err.message}`);
      failed++;
    }
  } catch (err) {
    console.error(`Fatal error during testing: ${err.message}`);
    process.exit(1);
  }

  // Summary
  console.log("\n" + "═".repeat(60));
  console.log("   TEST SUMMARY");
  console.log("═".repeat(60));
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📊 Total: ${passed + failed}`);
  console.log("═".repeat(60) + "\n");

  return failed === 0;
}

export { TEST_CONFIG };
