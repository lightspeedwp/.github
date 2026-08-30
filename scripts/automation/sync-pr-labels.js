#!/usr/bin/env node

/**
 * Sync PR Labels Script
 * Automatically manage meta:has-pr label based on linked PRs
 * @module scripts/automation/sync-pr-labels.js
 */

import { LabelManager } from "./includes/label-management.js";
import { ReportGenerator } from "./includes/report-generator.js";
import path from "path";
import { fileURLToPath } from "url";
import { Octokit } from "octokit";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Initialize GitHub API client
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const OWNER = "lightspeedwp";
const REPO = ".github";
const PR_REGEX = /#(\d+)/g;

// PR validation cache for improved performance (Phase 2 optimization)
const prValidationCache = {
  data: new Map(),
  ttl: 10 * 60 * 1000, // 10 minute cache TTL
  lastUpdate: 0,

  set(key, value) {
    this.data.set(key, value);
    this.lastUpdate = Date.now();
  },

  get(key) {
    if (Date.now() - this.lastUpdate > this.ttl) {
      this.data.clear();
      return null;
    }
    return this.data.get(key);
  },

  clear() {
    this.data.clear();
    this.lastUpdate = 0;
  },
};

/**
 * Extract PR numbers from issue text
 */
function extractPRNumbers(text) {
  if (!text) return [];
  const matches = text.matchAll(PR_REGEX);
  return Array.from(matches).map((m) => parseInt(m[1]));
}

/**
 * Check if a PR number is valid and open (cached for improved performance)
 */
async function isPRValid(prNumber) {
  const cacheKey = `pr-${prNumber}`;
  const cached = prValidationCache.get(cacheKey);
  if (cached !== null && cached !== undefined) {
    return cached;
  }

  try {
    const response = await octokit.rest.pulls.get({
      owner: OWNER,
      repo: REPO,
      pull_number: prNumber,
    });
    const isOpen = response.data.state === "open";
    prValidationCache.set(cacheKey, isOpen);
    return isOpen;
  } catch {
    // PR not found or error retrieving
    prValidationCache.set(cacheKey, false);
    return false;
  }
}

/**
 * Analyze an issue for linked PRs
 */
async function analyzeIssuePRs(issue) {
  const prNumbers = extractPRNumbers(issue.body || "");
  let hasValidPR = false;

  // Check each mentioned PR
  for (const prNum of prNumbers) {
    if (await isPRValid(prNum)) {
      hasValidPR = true;
      break;
    }
  }

  return {
    number: issue.number,
    title: issue.title,
    linkedPRs: prNumbers,
    hasValidPR,
    currentLabels: issue.labels?.map((l) => l.name) || [],
  };
}

/**
 * Main sync function
 */
async function syncPRLabels(options = {}) {
  const {
    verbose = false,
    dryRun = false,
    issueNumber = null,
    format = "json",
    output = null,
  } = options;

  const startTime = Date.now();
  const changes = [];
  const errors = [];

  try {
    const manager = new LabelManager({ verbose });
    const reporter = new ReportGenerator({ verbose });

    if (verbose) {
      console.log("Starting PR label sync...");
      if (dryRun) console.log("DRY RUN MODE - no changes will be applied");
      console.log(`Fetching issues...`);
    }

    // Fetch all open issues
    const allIssues = await manager.fetchAllIssues({ limit: 350 });

    // Filter to specific issue if requested
    const issuesToProcess = issueNumber
      ? allIssues.filter((i) => i.number === issueNumber)
      : allIssues;

    if (verbose) {
      console.log(
        `Processing ${issuesToProcess.length} issues for PR label sync...`,
      );
    }

    // Analyze each issue
    const analysisResults = [];
    for (const issue of issuesToProcess) {
      try {
        const analysis = await analyzeIssuePRs(issue);
        analysisResults.push(analysis);
      } catch (err) {
        errors.push({
          issue: issue.number,
          error: err.message,
        });
      }
    }

    // Determine required changes
    for (const analysis of analysisResults) {
      const hasPRLabel = analysis.currentLabels.includes("meta:has-pr");

      if (analysis.hasValidPR && !hasPRLabel) {
        // Add label
        changes.push({
          type: "add",
          issue: analysis.number,
          label: "meta:has-pr",
          reason: `Issue #${analysis.number} has valid linked PR(s): ${analysis.linkedPRs.join(", ")}`,
          dryRun,
        });

        if (!dryRun) {
          try {
            await manager.addLabel(analysis.number, "meta:has-pr");
          } catch (err) {
            errors.push({
              issue: analysis.number,
              error: `Failed to add label: ${err.message}`,
            });
          }
        }
      } else if (!analysis.hasValidPR && hasPRLabel) {
        // Remove label
        changes.push({
          type: "remove",
          issue: analysis.number,
          label: "meta:has-pr",
          reason:
            analysis.linkedPRs.length === 0
              ? `Issue #${analysis.number} has no linked PRs`
              : `Issue #${analysis.number}'s linked PR(s) are not open`,
          dryRun,
        });

        if (!dryRun) {
          try {
            await manager.removeLabel(analysis.number, "meta:has-pr");
          } catch (err) {
            errors.push({
              issue: analysis.number,
              error: `Failed to remove label: ${err.message}`,
            });
          }
        }
      }
    }

    // Build report
    const report = {
      sync_date: new Date().toISOString(),
      total_issues_analyzed: analysisResults.length,
      dry_run: dryRun,
      changes: {
        added: changes.filter((c) => c.type === "add").length,
        removed: changes.filter((c) => c.type === "remove").length,
        total: changes.length,
      },
      summary: {
        issues_with_valid_prs: analysisResults.filter((a) => a.hasValidPR)
          .length,
        issues_processed: analysisResults.length,
        errors: errors.length,
      },
      changes_detail: changes,
      errors: errors.length > 0 ? errors : undefined,
    };

    // Export if output path provided
    if (output) {
      const ext = format === "json" ? ".json" : `.${format}`;
      const outputPath = output.endsWith(ext) ? output : `${output}${ext}`;
      reporter.exportToFile(format, report, outputPath);

      if (verbose) {
        console.log(`Report saved to: ${outputPath}`);
      }
    }

    if (verbose) {
      console.log(`Sync completed in ${Date.now() - startTime}ms`);
    }

    return {
      success: true,
      report,
      duration: Date.now() - startTime,
    };
  } catch (error) {
    console.error(`Sync failed: ${error.message}`);
    return {
      success: false,
      error: error.message,
      duration: Date.now() - startTime,
    };
  }
}

/**
 * Parse command line arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    verbose: args.includes("-v") || args.includes("--verbose"),
    dryRun: args.includes("--dry-run"),
    issueNumber: null,
    format: "json",
    output: null,
  };

  // Parse dry-run
  if (!options.dryRun) {
    options.dryRun = args.includes("--preview");
  }

  // Parse issue number
  const issueIdx = args.findIndex((a) => a === "--issue");
  if (issueIdx > -1 && args[issueIdx + 1]) {
    options.issueNumber = parseInt(args[issueIdx + 1]);
  }

  // Parse format
  const formatIdx = args.findIndex((a) => a === "--format");
  if (formatIdx > -1 && args[formatIdx + 1]) {
    options.format = args[formatIdx + 1];
  }

  // Parse output
  const outputIdx = args.findIndex((a) => a === "--output");
  if (outputIdx > -1 && args[outputIdx + 1]) {
    options.output = args[outputIdx + 1];
  }

  return options;
}

/**
 * Main entry point
 */
async function main() {
  const options = parseArgs();

  if (options.verbose) {
    console.log("PR Labels Sync Script");
    console.log(`Mode: ${options.dryRun ? "dry-run" : "apply"}`);
    console.log(`Format: ${options.format}`);
    if (options.output) console.log(`Output: ${options.output}`);
    if (options.issueNumber)
      console.log(`Filter: Issue #${options.issueNumber}`);
    console.log("");
  }

  const result = await syncPRLabels(options);

  if (result.success) {
    // Print summary
    console.log("\n=== PR Labels Sync Summary ===\n");
    console.log(
      `Total Issues Analyzed: ${result.report.total_issues_analyzed}`,
    );
    console.log(
      `Issues with Valid PRs: ${result.report.summary.issues_with_valid_prs}`,
    );
    console.log(`Changes: ${result.report.changes.total}`);
    console.log(`  Added: ${result.report.changes.added}`);
    console.log(`  Removed: ${result.report.changes.removed}`);

    if (result.report.summary.errors > 0) {
      console.log(`Errors: ${result.report.summary.errors}`);
    }

    if (result.report.changes.total > 0) {
      console.log("\nSample Changes:");
      result.report.changes_detail.slice(0, 5).forEach((change, i) => {
        console.log(
          `  ${i + 1}. Issue #${change.issue}: ${change.type.toUpperCase()} ${change.label}`,
        );
        console.log(`     Reason: ${change.reason}`);
      });

      if (result.report.changes.total > 5) {
        console.log(
          `  ... and ${result.report.changes.total - 5} more changes`,
        );
      }
    }

    console.log(`\nDuration: ${result.duration}ms`);
    if (options.dryRun) {
      console.log(
        "\n⚠️  DRY RUN MODE - no changes were actually applied. Run without --dry-run to apply changes.",
      );
    }

    if (!options.output) {
      console.log("\nJSON Output:");
      console.log(JSON.stringify(result.report, null, 2));
    }
  } else {
    console.error(`\nSync Failed: ${result.error}`);
    console.error(`Duration: ${result.duration}ms\n`);
    process.exit(1);
  }
}

// Run if called directly
if (
  process.argv[1] &&
  path.resolve(fileURLToPath(import.meta.url)) === path.resolve(process.argv[1])
) {
  main().catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
  });
}

export { syncPRLabels };
