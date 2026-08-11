#!/usr/bin/env node

/**
 * Label Orchestrator — Unified Label Management CLI
 * Coordinates all label management scripts (sync, audit, stale marking)
 * @module scripts/automation/label-orchestrator.js
 */

import { spawn } from "child_process";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Default configuration
const defaultConfig = {
  mode: "audit", // audit | sync | stale
  format: "markdown", // markdown | json | csv
  dryRun: false,
  verbose: false,
  days: 30, // For stale marking
  output: null, // Output file path
};

function parseArgs(argv) {
  const config = { ...defaultConfig };

  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];

    if (arg === "audit") {
      config.mode = "audit";
    } else if (arg === "sync") {
      config.mode = "sync";
    } else if (arg === "stale") {
      config.mode = "stale";
    } else if (arg === "--all") {
      config.all = true;
    } else if (arg === "--dry-run") {
      config.dryRun = true;
    } else if (arg === "--verbose") {
      config.verbose = true;
    } else if (arg === "--format" && i + 1 < argv.length) {
      config.format = argv[++i];
    } else if (arg === "-o" && i + 1 < argv.length) {
      config.output = argv[++i];
    } else if (arg === "--days" && i + 1 < argv.length) {
      config.days = parseInt(argv[++i], 10);
    }
  }

  return config;
}

function runScript(scriptPath, args) {
  return new Promise((resolve, reject) => {
    const process = spawn("node", [scriptPath, ...args], {
      stdio: "inherit",
      cwd: __dirname,
    });

    process.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Script ${scriptPath} exited with code ${code}`));
      }
    });

    process.on("error", reject);
  });
}

async function auditLabels(config) {
  const args = [];
  if (config.verbose) args.push("--verbose");
  if (config.format) args.push("--format", config.format);
  if (config.output) args.push("-o", config.output);

  console.log("🔍 Running label audit...");
  await runScript(path.join(__dirname, "review-meta-labels.js"), args);

  console.log("🔍 Running status label audit...");
  await runScript(path.join(__dirname, "review-status-labels.js"), args);
}

async function syncLabels(config) {
  const args = [];
  if (config.verbose) args.push("--verbose");
  if (config.dryRun) args.push("--dry-run");

  console.log("🔄 Syncing PR labels...");
  await runScript(path.join(__dirname, "sync-pr-labels.js"), args);
}

async function markStaleIssues(config) {
  const args = ["--days", config.days.toString()];
  if (config.verbose) args.push("--verbose");
  if (config.dryRun) args.push("--dry-run");

  console.log(`⏰ Marking stale issues (>${config.days} days inactive)...`);
  await runScript(path.join(__dirname, "manage-stale-issues.js"), args);
}

async function main() {
  const config = parseArgs(process.argv);

  try {
    switch (config.mode) {
      case "audit":
        await auditLabels(config);
        break;
      case "sync":
        await syncLabels(config);
        break;
      case "stale":
        await markStaleIssues(config);
        break;
      default:
        console.error(`Unknown mode: ${config.mode}`);
        process.exit(1);
    }

    console.log("✅ Label management completed successfully");
  } catch (error) {
    console.error("❌ Label management failed:", error.message);
    process.exit(1);
  }
}

main();
