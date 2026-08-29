#!/usr/bin/env node

/**
 * production-validation.js
 *
 * Phase 6.1 Production Validation Script
 * Runs comprehensive sanity checks before production deployment.
 *
 * Usage:
 *   node production-validation.js --task checklist
 *   node production-validation.js --task environment
 *   node production-validation.js --task smoke
 *   node production-validation.js --task rollback [--max-rollback 15] [--no-dry-run]
 *   node production-validation.js --task monitoring
 *   node production-validation.js --all [--verbose]
 */

"use strict";

const {
  runDeploymentChecklist,
  setupProductionEnvironment,
  runSmokeTests,
  validateRollbackPlan,
  configureMonitoring,
  parseProductionArguments,
  executeAllProductionValidations,
} = require("./production-validation-helpers.js");

const args = process.argv.slice(2);
const options = parseProductionArguments(args);

/**
 * Prints a labelled result block, optionally in verbose mode.
 *
 * @param {string} label
 * @param {object} result
 */
function printResult(label, result) {
  const icon = result.success ? "✅" : "❌";
  console.log(`\n${icon} ${label}`);
  if (options.verbose) {
    console.log(JSON.stringify(result, null, 2));
  }
}

/**
 * Resolves and runs the requested task.
 */
function run() {
  if (options.runAll) {
    console.log("Running all Phase 6.1 production validation checks…\n");
    const result = executeAllProductionValidations(options);
    printResult("Deployment Checklist", result.results.checklist);
    printResult("Production Environment", result.results.environment);
    printResult("Smoke Tests", result.results.smokeTests);
    printResult("Rollback Plan", result.results.rollback);
    printResult("Monitoring & Alerting", result.results.monitoring);
    console.log(
      `\nSummary: ${result.summary.passed}/${result.summary.totalChecks} checks passed`,
    );
    console.log(`Status: ${result.status}`);
    process.exitCode = result.status === "GO" ? 0 : 1;
    return;
  }

  switch (options.task) {
    case "checklist": {
      const result = runDeploymentChecklist(options);
      printResult("Deployment Checklist", result);
      process.exitCode = result.success ? 0 : 1;
      break;
    }
    case "environment": {
      const result = setupProductionEnvironment(options);
      printResult("Production Environment", result);
      process.exitCode = result.success ? 0 : 1;
      break;
    }
    case "smoke": {
      const result = runSmokeTests(options);
      printResult("Smoke Tests", result);
      process.exitCode = result.success ? 0 : 1;
      break;
    }
    case "rollback": {
      const result = validateRollbackPlan(options);
      printResult("Rollback Plan", result);
      process.exitCode = result.success ? 0 : 1;
      break;
    }
    case "monitoring": {
      const result = configureMonitoring(options);
      printResult("Monitoring & Alerting", result);
      process.exitCode = result.success ? 0 : 1;
      break;
    }
    default:
      console.error("No task specified. Use --task <name> or --all.");
      console.error(
        "Available tasks: checklist, environment, smoke, rollback, monitoring",
      );
      process.exitCode = 1;
  }
}

run();
