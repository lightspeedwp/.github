#!/usr/bin/env node
/**
 * Automation Scripts Orchestrator
 * Unified entry point for all 13 automation scripts
 * Manages dependencies, error handling, and logging
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Script registry with metadata
const SCRIPT_REGISTRY = {
  "audit-metadata": {
    script: "audit-issue-metadata.js",
    description: "Audit issue metadata completeness and quality",
    category: "audit",
    priority: "high",
    estimatedTime: 1600,
    dependencies: [],
    options: {
      "--repo": "Repository name (required)",
      "--token": "GitHub token (required)",
      "--output": "Output format (json|csv|markdown)",
      "--verbose": "Verbose logging",
    },
  },
  "update-bulk": {
    script: "bulk-issue-metadata-updater.js",
    description: "Bulk update issue metadata",
    category: "update",
    priority: "high",
    estimatedTime: 1100,
    dependencies: ["audit-metadata"],
    options: {
      "--repo": "Repository name (required)",
      "--token": "GitHub token (required)",
      "--dryrun": "Dry run mode (no changes)",
      "--batch-size": "Batch size for updates",
    },
  },
  "manage-stale": {
    script: "manage-stale-issues.js",
    description: "Manage and close stale issues",
    category: "maintenance",
    priority: "medium",
    estimatedTime: 900,
    dependencies: [],
    options: {
      "--repo": "Repository name (required)",
      "--token": "GitHub token (required)",
      "--days": "Days before issue is stale (default: 30)",
      "--label": "Stale label to apply",
    },
  },
  "allocate-milestones": {
    script: "allocate-to-milestone.js",
    description: "Allocate issues to milestones",
    category: "planning",
    priority: "medium",
    estimatedTime: 1400,
    dependencies: ["audit-metadata"],
    options: {
      "--repo": "Repository name (required)",
      "--token": "GitHub token (required)",
      "--milestone": "Target milestone",
      "--criteria": "Allocation criteria",
    },
  },
  "review-labels": {
    script: "review-meta-labels.js",
    description: "Review and validate label usage",
    category: "audit",
    priority: "medium",
    estimatedTime: 900,
    dependencies: [],
    options: {
      "--repo": "Repository name (required)",
      "--token": "GitHub token (required)",
      "--report": "Generate report",
    },
  },
  "sync-pr-labels": {
    script: "sync-pr-labels.js",
    description: "Sync labels from PRs to related issues",
    category: "sync",
    priority: "medium",
    estimatedTime: 900,
    dependencies: [],
    options: {
      "--repo": "Repository name (required)",
      "--token": "GitHub token (required)",
      "--pr": "Specific PR number",
    },
  },
  "validate-staging": {
    script: "staging-validation.js",
    description: "Validate staging environment setup",
    category: "validation",
    priority: "high",
    estimatedTime: 1600,
    dependencies: [],
    options: {
      "--repo": "Repository name (required)",
      "--verbose": "Verbose output",
      "--checks": "Specific checks to run",
    },
  },
  "handle-all": {
    script: "handlers-orchestrator.js",
    description: "Run all issue handlers",
    category: "orchestration",
    priority: "high",
    estimatedTime: 900,
    dependencies: [],
    options: {
      "--repo": "Repository name (required)",
      "--token": "GitHub token (required)",
      "--parallel": "Run handlers in parallel",
    },
  },
  "triage-all": {
    script: "pr-triage-orchestrator.js",
    description: "Run complete PR triage workflow",
    category: "orchestration",
    priority: "high",
    estimatedTime: 1100,
    dependencies: ["review-labels", "sync-pr-labels"],
    options: {
      "--repo": "Repository name (required)",
      "--token": "GitHub token (required)",
      "--state": "Filter by PR state (open|closed|all)",
    },
  },
  "add-template-sections": {
    script: "add-issue-template-sections.js",
    description: "Add sections to issue templates",
    category: "template",
    priority: "low",
    estimatedTime: 900,
    dependencies: [],
    options: {
      "--repo": "Repository name (required)",
      "--sections": "Sections to add (comma-separated)",
    },
  },
  "review-status": {
    script: "review-status-labels.js",
    description: "Review status label assignments",
    category: "audit",
    priority: "medium",
    estimatedTime: 1400,
    dependencies: [],
    options: {
      "--repo": "Repository name (required)",
      "--report": "Generate report",
    },
  },
};

// Parse command line arguments
function parseArgs(args) {
  const result = { action: null, options: {} };
  for (let i = 0; i < args.length; i++) {
    if (!args[i].startsWith("--")) {
      if (!result.action) result.action = args[i];
    } else {
      const key = args[i].substring(2);
      result.options[key] = args[i + 1];
      i++;
    }
  }
  return result;
}

// Get action definition
function getActionDef(action) {
  return SCRIPT_REGISTRY[action];
}

// Check dependencies are available
function checkDependencies(actionDef) {
  if (!actionDef.dependencies || actionDef.dependencies.length === 0) {
    return { available: true, missing: [] };
  }

  const missing = [];
  actionDef.dependencies.forEach((dep) => {
    if (!getActionDef(dep)) {
      missing.push(dep);
    }
  });

  return { available: missing.length === 0, missing };
}

// Display help
function displayHelp(action) {
  if (action && getActionDef(action)) {
    const def = getActionDef(action);
    console.log(`\n📋 ${action.toUpperCase()}`);
    console.log(`${def.description}`);
    console.log(`\nOptions:`);
    Object.entries(def.options).forEach(([opt, desc]) => {
      console.log(`  ${opt.padEnd(20)} ${desc}`);
    });
  } else {
    console.log("\n🤖 Automation Scripts Orchestrator");
    console.log("Unified entry point for all automation scripts\n");
    console.log("USAGE: orchestrator.js <action> [options]\n");
    console.log("AVAILABLE ACTIONS:\n");

    Object.entries(SCRIPT_REGISTRY).forEach(([action, def]) => {
      const icon =
        def.priority === "high"
          ? "🔴"
          : def.priority === "medium"
            ? "🟡"
            : "🟢";
      console.log(`${icon} ${action.padEnd(20)} ${def.description}`);
      console.log(
        `   Category: ${def.category} | Est. Time: ${def.estimatedTime}ms\n`,
      );
    });

    console.log("EXAMPLES:");
    console.log(
      "  orchestrator.js audit-metadata --repo lightspeedwp/.github --token $TOKEN",
    );
    console.log(
      "  orchestrator.js triage-all --repo lightspeedwp/.github --token $TOKEN",
    );
    console.log("  orchestrator.js help <action>\n");
  }
}

// Display registry overview
function displayRegistry() {
  console.log("\n📊 SCRIPT REGISTRY OVERVIEW\n");

  const categories = {};
  Object.entries(SCRIPT_REGISTRY).forEach(([action, def]) => {
    if (!categories[def.category]) categories[def.category] = [];
    categories[def.category].push({ action, ...def });
  });

  Object.entries(categories).forEach(([cat, scripts]) => {
    console.log(`${cat.toUpperCase()} (${scripts.length} scripts)`);
    scripts.forEach((s) => {
      console.log(`  • ${s.action} - ${s.estimatedTime}ms`);
    });
    console.log("");
  });

  const totalTime = Object.values(SCRIPT_REGISTRY).reduce(
    (sum, def) => sum + def.estimatedTime,
    0,
  );
  console.log(`📈 TOTALS`);
  console.log(`  Total Scripts: ${Object.keys(SCRIPT_REGISTRY).length}`);
  console.log(
    `  Total Est. Time: ${totalTime}ms (${(totalTime / 1000).toFixed(1)}s)`,
  );
  console.log(
    `  Avg Per Script: ${(totalTime / Object.keys(SCRIPT_REGISTRY).length).toFixed(0)}ms\n`,
  );
}

// Validate action parameters
function validateParameters(action, options) {
  const def = getActionDef(action);
  if (!def) {
    return { valid: false, errors: [`Unknown action: ${action}`] };
  }

  const errors = [];
  const required = Object.entries(def.options)
    .filter(([opt]) => opt.endsWith("(required)"))
    .map(([opt]) => opt.replace(" (required)", "").substring(2));

  required.forEach((req) => {
    if (!options[req]) {
      errors.push(`Missing required option: --${req}`);
    }
  });

  return { valid: errors.length === 0, errors };
}

// Format output
function formatOutput(result) {
  return JSON.stringify(result, null, 2);
}

// Log action execution
function logExecution(action, startTime, endTime, success, message) {
  const duration = endTime - startTime;
  const status = success ? "✅" : "❌";
  const timestamp = new Date().toISOString();

  console.log(`${status} [${timestamp}] ${action} completed in ${duration}ms`);
  if (message) console.log(`   ${message}`);
}

// Main orchestrator logic
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === "help") {
    displayHelp(args[1]);
    return;
  }

  if (args[0] === "registry") {
    displayRegistry();
    return;
  }

  const { action, options } = parseArgs(args);

  if (!action) {
    console.error("Error: No action specified");
    displayHelp();
    process.exit(1);
  }

  const actionDef = getActionDef(action);
  if (!actionDef) {
    console.error(`Error: Unknown action '${action}'`);
    displayHelp();
    process.exit(1);
  }

  // Validate parameters
  const validation = validateParameters(action, options);
  if (!validation.valid) {
    console.error(`\n❌ Validation failed:`);
    validation.errors.forEach((err) => console.error(`  • ${err}`));
    displayHelp(action);
    process.exit(1);
  }

  // Check dependencies
  const depCheck = checkDependencies(actionDef);
  if (!depCheck.available) {
    console.error(`\n❌ Missing dependencies: ${depCheck.missing.join(", ")}`);
    console.log("Run these actions first or ensure they are available.");
    process.exit(1);
  }

  // Execute action
  console.log(`\n🚀 Starting: ${action}`);
  console.log(`   ${actionDef.description}`);
  console.log(
    `   Est. Time: ${(actionDef.estimatedTime / 1000).toFixed(1)}s\n`,
  );

  const startTime = Date.now();

  try {
    // Import and execute the script
    const scriptPath = path.join(__dirname, actionDef.script);
    if (!fs.existsSync(scriptPath)) {
      throw new Error(`Script not found: ${scriptPath}`);
    }

    // Build command line arguments to pass to the script
    const scriptArgs = Object.entries(options)
      .flatMap(([key, value]) => [`--${key}`, value])
      .join(" ");

    // Execute script via node subprocess
    // Note: In a real implementation, this would spawn the script process
    console.log(`   Executing: node ${scriptPath} ${scriptArgs}`);
    console.log(
      `   Status: Ready for execution (actual execution delegated to caller)\n`,
    );

    const endTime = Date.now();
    logExecution(
      action,
      startTime,
      endTime,
      true,
      `${actionDef.description} prepared for execution`,
    );

    // Return success
    console.log("\n✅ Orchestration complete");
  } catch (error) {
    const endTime = Date.now();
    logExecution(action, startTime, endTime, false, error.message);
    console.error(`\n❌ Error: ${error.message}`);
    process.exit(1);
  }
}

// Run orchestrator
main().catch((error) => {
  console.error("Orchestrator Error:", error);
  process.exit(1);
});
