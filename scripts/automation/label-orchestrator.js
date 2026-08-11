#!/usr/bin/env node

/**
 * Label Orchestrator — Unified CLI for Issue Label Management
 * Orchestrates manage-stale-issues, review-meta-labels, review-status-labels, sync-pr-labels
 * @module scripts/automation/label-orchestrator.js
 */

import path from "path";
import { fileURLToPath } from "url";
import { manageStalIssues } from "./manage-stale-issues.js";
import { auditMetaLabels } from "./review-meta-labels.js";
import { auditStatusLabels } from "./review-status-labels.js";
import { syncPRLabels } from "./sync-pr-labels.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Parse command line arguments into options object
 */
function parseArguments(args) {
  const options = {
    mode: "audit", // audit, sync, apply
    verbose: args.includes("-v") || args.includes("--verbose"),
    dryRun: args.includes("--dry-run") || args.includes("--preview"),
    format: "json", // json, markdown, csv
    output: null,
    scripts: ["all"], // which scripts to run
    days: 30,
  };

  // Parse mode (first positional argument)
  const modeIdx = args.findIndex(
    (a) => !a.startsWith("-") && ["audit", "sync", "apply"].includes(a),
  );
  if (modeIdx > -1) {
    options.mode = args[modeIdx];
  }

  // Parse format
  const formatIdx = args.findIndex((a) => a === "--format");
  if (formatIdx > -1 && args[formatIdx + 1]) {
    options.format = args[formatIdx + 1];
  }

  // Parse output
  const outputIdx = args.findIndex((a) => a === "--output" || a === "-o");
  if (outputIdx > -1 && args[outputIdx + 1]) {
    options.output = args[outputIdx + 1];
  }

  // Parse days
  const daysIdx = args.findIndex((a) => a === "--days");
  if (daysIdx > -1 && args[daysIdx + 1]) {
    options.days = parseInt(args[daysIdx + 1], 10);
  }

  // Parse scripts to run
  const scriptsIdx = args.findIndex((a) => a === "--scripts");
  if (scriptsIdx > -1 && args[scriptsIdx + 1]) {
    options.scripts = args[scriptsIdx + 1].split(",").map((s) => s.trim());
  }

  return options;
}

/**
 * Validate options
 */
function validateOptions(options) {
  const validModes = ["audit", "sync", "apply"];
  if (!validModes.includes(options.mode)) {
    throw new Error(
      `Invalid mode '${options.mode}'. Must be: ${validModes.join(", ")}`,
    );
  }

  const validFormats = ["json", "markdown", "csv"];
  if (!validFormats.includes(options.format)) {
    throw new Error(
      `Invalid format '${options.format}'. Must be: ${validFormats.join(", ")}`,
    );
  }

  if (options.days <= 0) {
    throw new Error("Days must be a positive integer");
  }
}

/**
 * Log output with verbosity control
 */
function log(message, level = "info", isVerbose = false) {
  const timestamp = new Date().toISOString().split("T")[1].split(".")[0];
  const prefix = `[${timestamp}]`;

  if (level === "verbose" && !isVerbose) return;

  switch (level) {
    case "info":
      console.log(`${prefix} ℹ️  ${message}`);
      break;
    case "success":
      console.log(`${prefix} ✅ ${message}`);
      break;
    case "warning":
      console.warn(`${prefix} ⚠️  ${message}`);
      break;
    case "error":
      console.error(`${prefix} ❌ ${message}`);
      break;
    case "verbose":
      console.log(`${prefix} 🔍 ${message}`);
      break;
    default:
      console.log(`${prefix} ${message}`);
  }
}

/**
 * Run audit mode - analyze all labels without making changes
 */
async function runAudit(options) {
  log("Starting audit mode...", "info", options.verbose);
  const results = {};

  try {
    // Run selected scripts or all in audit mode
    const scripts = options.scripts.includes("all")
      ? ["meta-labels", "status-labels", "pr-labels", "stale-issues"]
      : options.scripts;

    for (const script of scripts) {
      log(`Running ${script} audit...`, "info", options.verbose);

      try {
        switch (script) {
          case "meta-labels":
            results["meta-labels"] = await auditMetaLabels({
              verbose: options.verbose,
              format: options.format,
              output: options.output,
            });
            log("Meta labels audit complete", "success", options.verbose);
            break;

          case "status-labels":
            results["status-labels"] = await auditStatusLabels({
              verbose: options.verbose,
              format: options.format,
              output: options.output,
            });
            log("Status labels audit complete", "success", options.verbose);
            break;

          case "pr-labels":
            results["pr-labels"] = await syncPRLabels({
              verbose: options.verbose,
              dryRun: true, // audit mode is like dry-run
              format: options.format,
              output: options.output,
            });
            log("PR labels audit complete", "success", options.verbose);
            break;

          case "stale-issues":
            results["stale-issues"] = await manageStalIssues({
              verbose: options.verbose,
              dryRun: true, // audit mode is like dry-run
              days: options.days,
              format: options.format,
              output: options.output,
            });
            log("Stale issues audit complete", "success", options.verbose);
            break;

          default:
            log(`Unknown script: ${script}`, "warning", options.verbose);
        }
      } catch (error) {
        log(
          `Error auditing ${script}: ${error.message}`,
          "error",
          options.verbose,
        );
        results[script] = { error: error.message };
      }
    }

    return { mode: "audit", results };
  } catch (error) {
    log(`Audit failed: ${error.message}`, "error", options.verbose);
    throw error;
  }
}

/**
 * Run sync mode - synchronize labels (PR labels, stale marking)
 */
async function runSync(options) {
  log("Starting sync mode...", "info", options.verbose);
  const results = {};

  try {
    const scripts = options.scripts.includes("all")
      ? ["pr-labels", "stale-issues"]
      : options.scripts;

    for (const script of scripts) {
      log(`Running ${script} sync...`, "info", options.verbose);

      try {
        switch (script) {
          case "pr-labels":
            results["pr-labels"] = await syncPRLabels({
              verbose: options.verbose,
              dryRun: options.dryRun,
              format: options.format,
              output: options.output,
            });
            log("PR labels synced", "success", options.verbose);
            break;

          case "stale-issues":
            results["stale-issues"] = await manageStalIssues({
              verbose: options.verbose,
              dryRun: options.dryRun,
              days: options.days,
              label: true,
              comment: true,
              format: options.format,
              output: options.output,
            });
            log("Stale issues synced", "success", options.verbose);
            break;

          default:
            log(`Sync not supported for ${script}`, "warning", options.verbose);
        }
      } catch (error) {
        log(
          `Error syncing ${script}: ${error.message}`,
          "error",
          options.verbose,
        );
        results[script] = { error: error.message };
      }
    }

    if (options.dryRun) {
      log("DRY RUN MODE - No changes made", "info", options.verbose);
    }

    return { mode: "sync", dryRun: options.dryRun, results };
  } catch (error) {
    log(`Sync failed: ${error.message}`, "error", options.verbose);
    throw error;
  }
}

/**
 * Run apply mode - synchronize labels and close stale issues
 */
async function runApply(options) {
  log("Starting apply mode...", "info", options.verbose);
  const results = {};

  try {
    const scripts = options.scripts.includes("all")
      ? ["pr-labels", "stale-issues"]
      : options.scripts;

    for (const script of scripts) {
      log(`Running ${script} apply...`, "info", options.verbose);

      try {
        switch (script) {
          case "pr-labels":
            results["pr-labels"] = await syncPRLabels({
              verbose: options.verbose,
              dryRun: false,
              format: options.format,
              output: options.output,
            });
            log("PR labels applied", "success", options.verbose);
            break;

          case "stale-issues":
            results["stale-issues"] = await manageStalIssues({
              verbose: options.verbose,
              dryRun: false,
              days: options.days,
              label: true,
              comment: true,
              close: true, // Apply mode closes stale issues
              format: options.format,
              output: options.output,
            });
            log(
              "Stale issues applied (with closure)",
              "success",
              options.verbose,
            );
            break;

          default:
            log(
              `Apply not supported for ${script}`,
              "warning",
              options.verbose,
            );
        }
      } catch (error) {
        log(
          `Error applying ${script}: ${error.message}`,
          "error",
          options.verbose,
        );
        results[script] = { error: error.message };
      }
    }

    return { mode: "apply", results };
  } catch (error) {
    log(`Apply failed: ${error.message}`, "error", options.verbose);
    throw error;
  }
}

/**
 * Generate summary report
 */
function generateSummary(result, options) {
  console.log("\n" + "=".repeat(60));
  console.log(`📊 ORCHESTRATOR SUMMARY — Mode: ${result.mode.toUpperCase()}`);
  console.log("=".repeat(60));

  const scripts = Object.keys(result.results);
  console.log(`\nScripts Run: ${scripts.join(", ")}`);

  if (result.dryRun) {
    console.log("⚠️  DRY RUN MODE — No changes were made");
  }

  let successCount = 0;
  let errorCount = 0;

  for (const [script, scriptResult] of Object.entries(result.results)) {
    if (scriptResult.error) {
      console.log(`  ❌ ${script}: ${scriptResult.error}`);
      errorCount++;
    } else {
      console.log(`  ✅ ${script}: Complete`);
      successCount++;
    }
  }

  console.log(`\nResults: ${successCount} succeeded, ${errorCount} failed`);

  if (options.output) {
    console.log(`📁 Output saved to: ${options.output}`);
  }

  console.log("=".repeat(60) + "\n");
}

/**
 * Display help message
 */
function showHelp() {
  console.log(`
Label Orchestrator — Unified CLI for Issue Label Management

USAGE
  node label-orchestrator.js [MODE] [OPTIONS]

MODES
  audit        Analyse all labels without making changes (default)
  sync         Synchronise PR and stale labels (dry-run by default)
  apply        Apply all label changes and close stale issues

OPTIONS
  -v, --verbose           Show detailed progress messages
  --dry-run, --preview    Preview changes without applying (sync/apply only)
  --format FORMAT         Output format: json, markdown, csv (default: json)
  -o, --output PATH       Save report to file
  --days DAYS            Threshold for stale detection (default: 30)
  --scripts SCRIPTS       Comma-separated list of scripts to run (default: all)
                         Options: meta-labels, status-labels, pr-labels, stale-issues
  -h, --help             Show this help message

EXAMPLES
  # Audit all labels (default)
  node label-orchestrator.js

  # Sync PR and stale labels (dry-run)
  node label-orchestrator.js sync --dry-run

  # Apply all changes
  node label-orchestrator.js apply --verbose

  # Audit specific scripts
  node label-orchestrator.js audit --scripts meta-labels,status-labels

  # Save report to file
  node label-orchestrator.js audit --format markdown -o report.md
`);
}

/**
 * Main orchestrator function
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.includes("-h") || args.includes("--help")) {
    showHelp();
    process.exit(0);
  }

  try {
    const options = parseArguments(args);
    validateOptions(options);

    log(`Label Orchestrator started`, "info", options.verbose);
    log(`Mode: ${options.mode}`, "verbose", options.verbose);
    log(`Format: ${options.format}`, "verbose", options.verbose);

    let result;
    switch (options.mode) {
      case "audit":
        result = await runAudit(options);
        break;
      case "sync":
        result = await runSync(options);
        break;
      case "apply":
        result = await runApply(options);
        break;
      default:
        throw new Error(`Unknown mode: ${options.mode}`);
    }

    generateSummary(result, options);
    process.exit(0);
  } catch (error) {
    log(`Fatal error: ${error.message}`, "error");
    if (process.env.DEBUG) {
      console.error(error);
    }
    process.exit(1);
  }
}

// Run if executed directly
if (
  path.resolve(fileURLToPath(import.meta.url)) === path.resolve(process.argv[1])
) {
  main().catch((error) => {
    console.error("Orchestrator error:", error);
    process.exit(1);
  });
}

export { runAudit, runSync, runApply, parseArguments, validateOptions };
