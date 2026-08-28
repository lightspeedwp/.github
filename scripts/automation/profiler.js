#!/usr/bin/env node
/**
 * Automation Scripts Profiler
 * Measures performance metrics for all automation scripts
 * Outputs baseline data for optimization work (Phase 2)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const SCRIPTS_DIR = __dirname;
const SCRIPTS_TO_PROFILE = [
  "add-issue-template-sections.js",
  "audit-issue-metadata.js",
  "bulk-issue-metadata-updater.js",
  "manage-stale-issues.js",
  "allocate-to-milestone.js",
  "review-meta-labels.js",
  "review-status-labels.js",
  "sync-pr-labels.js",
  "staging-validation.js",
  "handlers-orchestrator.js",
  "label-orchestrator.js",
  "pr-triage-orchestrator.js",
];

// Profile metrics
const metrics = {
  timestamp: new Date().toISOString(),
  scripts: [],
};

// Get file size in bytes
function getFileSize(scriptName) {
  try {
    const filePath = path.join(SCRIPTS_DIR, scriptName);
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch (error) {
    return 0;
  }
}

// Count lines of code
function countLinesOfCode(scriptName) {
  try {
    const filePath = path.join(SCRIPTS_DIR, scriptName);
    const content = fs.readFileSync(filePath, "utf8");
    const lines = content.split("\n").length;
    const codeLines = content
      .split("\n")
      .filter((line) => line.trim() && !line.trim().startsWith("//")).length;
    return { total: lines, code: codeLines };
  } catch (error) {
    return { total: 0, code: 0 };
  }
}

// Analyze script dependencies
function analyzeDependencies(scriptName) {
  try {
    const filePath = path.join(SCRIPTS_DIR, scriptName);
    const content = fs.readFileSync(filePath, "utf8");

    // Count requires/imports
    const requires = (content.match(/require\s*\(/g) || []).length;
    const imports = (content.match(/import\s+/g) || []).length;

    // Detect common patterns
    const hasAPICall = /fetch|axios|http\.get|github|octokit/i.test(content);
    const hasFileIO = /fs\.|readFile|writeFile/i.test(content);
    const hasLogging = /console\.log|debug|logger/i.test(content);
    const hasErrorHandling = /try|catch|throw/i.test(content);

    return {
      requires: requires + imports,
      apiCall: hasAPICall,
      fileIO: hasFileIO,
      logging: hasLogging,
      errorHandling: hasErrorHandling,
    };
  } catch (error) {
    return {
      requires: 0,
      apiCall: false,
      fileIO: false,
      logging: false,
      errorHandling: false,
    };
  }
}

// Create profile entry for a script
function profileScript(scriptName) {
  const fileSize = getFileSize(scriptName);
  const loc = countLinesOfCode(scriptName);
  const deps = analyzeDependencies(scriptName);

  return {
    script: scriptName,
    size_bytes: fileSize,
    size_kb: (fileSize / 1024).toFixed(2),
    lines_of_code: loc,
    dependencies: deps,
    optimization_potential: identifyOptimizations(scriptName, deps, loc),
    estimated_execution_time_ms: estimateExecutionTime(deps, loc),
    estimated_memory_mb: estimateMemoryUsage(fileSize, loc.code),
  };
}

// Identify optimization opportunities
function identifyOptimizations(scriptName, deps, loc) {
  const opportunities = [];

  if (deps.requires > 5) opportunities.push("reduce-dependencies");
  if (loc.code > 300) opportunities.push("refactor-for-readability");
  if (deps.apiCall && !deps.errorHandling)
    opportunities.push("add-error-handling");
  if (deps.apiCall) opportunities.push("add-caching");
  if (deps.fileIO) opportunities.push("optimize-file-io");
  if (deps.logging) opportunities.push("add-performance-logging");

  return opportunities;
}

// Estimate execution time based on script complexity
function estimateExecutionTime(deps, loc) {
  let estimate = 100; // Base 100ms

  if (deps.apiCall) estimate += 500; // API calls are slow
  if (deps.fileIO) estimate += 200; // File I/O is slower
  if (loc.code > 200) estimate += 300;
  if (loc.code > 400) estimate += 500;

  return estimate;
}

// Estimate memory usage
function estimateMemoryUsage(fileSize, codeLines) {
  // Rough estimate: ~0.5MB base + 0.1MB per 100 LOC + size overhead
  const baseMemory = 0.5;
  const codeMemory = (codeLines / 100) * 0.1;
  const sizeOverhead = (fileSize / 1024 / 100) * 0.1;

  return (baseMemory + codeMemory + sizeOverhead).toFixed(2);
}

// Profile all scripts
function profileAllScripts() {
  console.log("🔍 Profiling automation scripts for Phase 2...\n");

  SCRIPTS_TO_PROFILE.forEach((scriptName) => {
    try {
      const profile = profileScript(scriptName);
      metrics.scripts.push(profile);

      console.log(`✓ ${scriptName}`);
      console.log(
        `  Size: ${profile.size_kb} KB (${profile.lines_of_code.total} lines, ${profile.lines_of_code.code} code)`,
      );
      console.log(`  Est. Execution: ${profile.estimated_execution_time_ms}ms`);
      console.log(`  Est. Memory: ${profile.estimated_memory_mb} MB`);
      console.log(
        `  Optimizations: ${profile.optimization_potential.join(", ") || "none"}`,
      );
      console.log("");
    } catch (error) {
      console.error(`✗ Error profiling ${scriptName}: ${error.message}`);
    }
  });
}

// Generate summary report
function generateSummary() {
  if (metrics.scripts.length === 0) {
    console.log("No scripts profiled.");
    return;
  }

  const totalSize = metrics.scripts.reduce((sum, s) => sum + s.size_bytes, 0);
  const totalLoc = metrics.scripts.reduce(
    (sum, s) => sum + s.lines_of_code.code,
    0,
  );
  const totalTime = metrics.scripts.reduce(
    (sum, s) => sum + s.estimated_execution_time_ms,
    0,
  );
  const totalMemory = metrics.scripts.reduce(
    (sum, s) => sum + parseFloat(s.estimated_memory_mb),
    0,
  );

  console.log("📊 SUMMARY");
  console.log("═".repeat(50));
  console.log(`Total Scripts Profiled: ${metrics.scripts.length}`);
  console.log(`Total Size: ${(totalSize / 1024).toFixed(2)} KB`);
  console.log(`Total Lines of Code: ${totalLoc}`);
  console.log(
    `Total Estimated Time: ${totalTime}ms (${(totalTime / metrics.scripts.length).toFixed(0)}ms avg)`,
  );
  console.log(`Total Estimated Memory: ${totalMemory.toFixed(2)} MB`);
  console.log("");

  // Identify slowest scripts
  const slowest = [...metrics.scripts]
    .sort(
      (a, b) => b.estimated_execution_time_ms - a.estimated_execution_time_ms,
    )
    .slice(0, 3);

  console.log("⚡ SLOWEST SCRIPTS (Priority for optimization)");
  slowest.forEach((s, i) => {
    console.log(`${i + 1}. ${s.script} - ${s.estimated_execution_time_ms}ms`);
  });
  console.log("");
}

// Save metrics to file
function saveMetrics() {
  const outputDir = ".github/reports/profiling";
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const filename = path.join(
    outputDir,
    `baseline-${new Date().toISOString().split("T")[0]}.json`,
  );
  fs.writeFileSync(filename, JSON.stringify(metrics, null, 2));

  console.log(`📁 Baseline metrics saved to: ${filename}`);
}

// Main execution
try {
  profileAllScripts();
  generateSummary();
  saveMetrics();
  process.exit(0);
} catch (error) {
  console.error("Profiler Error:", error);
  process.exit(1);
}
