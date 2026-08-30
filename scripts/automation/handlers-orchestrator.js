#!/usr/bin/env node

/**
 * Handlers Orchestrator — Tier 1 Batch Processor
 *
 * Orchestrates both Tier 1 handlers:
 * - handle-needs-template-fix: Fixes invalid issue templates
 * - handle-needs-triage: Performs type/area/assignee triage
 *
 * Supports multiple modes:
 * - --dry-run: Preview changes without applying
 * - --interactive: Prompt before each change
 * - --auto: Apply changes with confidence >threshold
 *
 * Usage:
 *   node scripts/automation/handlers-orchestrator.js \
 *     --mode dry-run \
 *     --handlers template-fix,triage \
 *     --limit 50
 *
 *   node scripts/automation/handlers-orchestrator.js \
 *     --mode auto \
 *     --auto-threshold 85 \
 *     --batch-size 10
 */

import { Octokit } from "@octokit/rest";
import * as templateFixHandler from "./handlers/handle-needs-template-fix.js";
import * as triageHandler from "./handlers/handle-needs-triage.js";

// Configuration (optimized with Set for skip label checking - Phase 2)
const defaultConfig = {
  owner: "lightspeedwp",
  repo: ".github",
  mode: "dry-run", // dry-run | interactive | auto
  handlers: "template-fix,triage", // Comma-separated list
  limit: 50, // Max issues to process
  batchSize: 10, // Process N issues at a time
  parallelHandlers: true, // Run handlers in parallel for each issue (Phase 2)
  autoThreshold: 80, // Min confidence for auto mode (%)
  skipLabels: ["status:done", "type:external"], // Never touch these
  skipLabelsSet: new Set(["status:done", "type:external"]), // For O(1) lookups
};

// Parse command-line arguments
function parseArgs(argv) {
  const config = { ...defaultConfig };

  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];

    if (arg === "--mode" && i + 1 < argv.length) {
      config.mode = argv[++i];
    } else if (arg === "--handlers" && i + 1 < argv.length) {
      config.handlers = argv[++i];
    } else if (arg === "--limit" && i + 1 < argv.length) {
      config.limit = parseInt(argv[++i], 10);
    } else if (arg === "--batch-size" && i + 1 < argv.length) {
      config.batchSize = parseInt(argv[++i], 10);
    } else if (arg === "--auto-threshold" && i + 1 < argv.length) {
      config.autoThreshold = parseInt(argv[++i], 10);
    }
  }

  return config;
}

// Get GitHub API token from environment
function getAuthToken() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error(
      "GITHUB_TOKEN environment variable not set. Unable to authenticate with GitHub API.",
    );
  }
  return token;
}

// Initialize Octokit client
function initializeOctokit(token) {
  return new Octokit({ auth: token });
}

// Fetch issues that need triage
async function fetchIssuesNeedingTriage(octokit, config) {
  console.log(
    "Fetching issues with status:needs-triage or status:needs-template-fix...",
  );

  const issues = [];
  const labels = [];

  if (config.handlers.includes("triage")) {
    labels.push("status:needs-triage");
  }
  if (config.handlers.includes("template-fix")) {
    labels.push("status:needs-template-fix");
  }

  for (const label of labels) {
    try {
      const query = `repo:${config.owner}/${config.repo} label:"${label}" state:open`;
      const response = await octokit.search.issuesAndPullRequests({
        q: query,
        per_page: 100,
      });

      issues.push(
        ...response.data.items.filter(
          (issue) => !issue.pull_request, // Exclude PRs
        ),
      );

      if (issues.length >= config.limit) {
        issues.splice(config.limit);
        break;
      }
    } catch (error) {
      console.error(
        `Error fetching issues with label "${label}":`,
        error.message,
      );
    }
  }

  return issues.slice(0, config.limit);
}

// Route issue to appropriate handler(s) (optimized for parallel execution - Phase 2)
async function routeToHandlers(issue, handlers, options) {
  // Enable parallel handler execution for better performance
  const handlerPromises = Object.entries(handlers).map(
    async ([handlerName, handler]) => {
      try {
        const result = await handler.processIssue(issue, options);
        return {
          handler: handlerName,
          ...result,
        };
      } catch (error) {
        return {
          handler: handlerName,
          status: "error",
          reason: error.message,
          issueNumber: issue.number,
        };
      }
    },
  );

  return Promise.all(handlerPromises);
}

// Format result for display
function formatResult(result) {
  const { handler, status, issueNumber, ...details } = result;

  const statusSymbol =
    {
      preview: "👀",
      updated: "✅",
      skipped: "⏭️",
      error: "❌",
      "low-confidence": "⚠️",
    }[status] || "❓";

  let line = `${statusSymbol} Issue #${issueNumber} [${handler}] — ${status}`;

  if (details.title) {
    line += `: ${details.title}`;
  }

  if (details.reason) {
    line += ` (${details.reason})`;
  }

  return line;
}

// Interactive mode: ask user to confirm each change
async function askForConfirmation(result) {
  // In real CLI, this would use readline or inquirer
  // For now, log the preview and indicate approval needed
  console.log(formatResult(result));

  // This would be interactive in a real CLI
  // For testing/automation, we return true (auto-confirm)
  return true;
}

// Generate summary report
function generateReport(allResults, _config) {
  const stats = {
    total: 0,
    byStatus: {},
    byHandler: {},
    skipped: 0,
    updated: 0,
    errors: 0,
  };

  for (const result of allResults) {
    const { handler, status } = result;
    stats.total++;

    // Track by status
    stats.byStatus[status] = (stats.byStatus[status] || 0) + 1;

    // Track by handler
    stats.byHandler[handler] = (stats.byHandler[handler] || 0) + 1;

    // Summary counters
    if (status === "skipped") stats.skipped++;
    else if (status === "updated") stats.updated++;
    else if (status === "error") stats.errors++;
  }

  console.log("\n" + "=".repeat(60));
  console.log("SUMMARY REPORT");
  console.log("=".repeat(60));
  console.log(`Total processed: ${stats.total}`);
  console.log(`Updated: ${stats.updated}`);
  console.log(`Skipped: ${stats.skipped}`);
  console.log(`Errors: ${stats.errors}`);
  console.log(`\nBy Status:`);
  Object.entries(stats.byStatus).forEach(([status, count]) => {
    console.log(`  ${status}: ${count}`);
  });
  console.log(`\nBy Handler:`);
  Object.entries(stats.byHandler).forEach(([handler, count]) => {
    console.log(`  ${handler}: ${count}`);
  });
  console.log("=".repeat(60) + "\n");

  return stats;
}

// Main orchestrator function
async function orchestrate(config) {
  console.log("🚀 Starting Handlers Orchestrator");
  console.log(`Mode: ${config.mode}`);
  console.log(`Handlers: ${config.handlers}`);
  console.log(`Limit: ${config.limit}`);
  console.log("");

  // Validate mode
  if (!["dry-run", "interactive", "auto"].includes(config.mode)) {
    throw new Error(
      `Invalid mode: ${config.mode}. Must be dry-run, interactive, or auto.`,
    );
  }

  // Load handlers
  const handlers = {};
  if (config.handlers.includes("template-fix")) {
    handlers["template-fix"] = templateFixHandler;
  }
  if (config.handlers.includes("triage")) {
    handlers.triage = triageHandler;
  }

  if (Object.keys(handlers).length === 0) {
    throw new Error("No valid handlers specified");
  }

  // Initialize GitHub API client
  const token = getAuthToken();
  const octokit = initializeOctokit(token);

  // Create wrapper for GitHub API calls
  const githubRequest = async (method, path, data) => {
    return octokit.request(method + " " + path, data);
  };

  // Fetch issues to process
  const issues = await fetchIssuesNeedingTriage(octokit, config);
  console.log(`Found ${issues.length} issues to process\n`);

  if (issues.length === 0) {
    console.log("No issues to process. Exiting.");
    return { stats: { total: 0 } };
  }

  // Process issues
  const allResults = [];
  const processingOptions = {
    dryRun: config.mode !== "auto",
    githubRequest,
    owner: config.owner,
    repo: config.repo,
    confidenceThreshold: config.autoThreshold,
  };

  for (let i = 0; i < issues.length; i += config.batchSize) {
    const batch = issues.slice(i, i + config.batchSize);
    console.log(`Processing batch ${Math.floor(i / config.batchSize) + 1}...`);

    for (const issue of batch) {
      // Skip issues with protection labels (optimized with Set lookup)
      const hasSkipLabel = (issue.labels || []).some((l) =>
        config.skipLabelsSet.has(l.name || l),
      );

      if (hasSkipLabel) {
        console.log(`⏭️  Skipping issue #${issue.number} (protected label)`);
        continue;
      }

      // Route to handlers
      const results = await routeToHandlers(issue, handlers, processingOptions);

      for (const result of results) {
        console.log(formatResult(result));

        // Interactive mode: ask for confirmation
        if (config.mode === "interactive" && result.status === "preview") {
          const approved = await askForConfirmation(result);
          if (approved && !processingOptions.dryRun) {
            // Re-run in apply mode
            result.status = "applied"; // Mark as applied
          }
        }

        allResults.push(result);
      }
    }
  }

  // Generate summary
  const stats = generateReport(allResults, config);
  return { stats, results: allResults };
}

// Entry point
async function main() {
  try {
    const config = parseArgs(process.argv);
    await orchestrate(config);
    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

// Export for testing
export { orchestrate, parseArgs, fetchIssuesNeedingTriage, routeToHandlers };

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
