#!/usr/bin/env node

/**
 * Manage Stale Issues Script
 * Auto-apply meta:stale label and handle issue archiving
 * @module scripts/automation/manage-stale-issues.js
 */

import { LabelManager } from "./includes/label-management.js";
import { ActivityAnalyzer } from "./includes/activity-analyzer.js";
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

// Exclusion rules - issues to skip stale tagging (optimized with Set for O(1) lookup - Phase 2)
const EXCLUSION_RULES = {
  labels: ["type:epic", "status:in-progress", "priority:critical"],
  labelsSet: new Set(["type:epic", "status:in-progress", "priority:critical"]),
  hasMilestone: true,
};

/**
 * Check if issue should be excluded from stale tagging (optimized)
 */
function shouldExcludeIssue(issue) {
  const labels = issue.labels?.map((l) => l.name) || [];

  // Check label exclusions with Set (O(1) lookups)
  for (const label of labels) {
    if (EXCLUSION_RULES.labelsSet.has(label)) {
      return true;
    }
  }

  // Check milestone exclusion
  if (EXCLUSION_RULES.hasMilestone && issue.milestone) {
    return true;
  }

  return false;
}

/**
 * Generate warning comment for stale issue
 */
function generateStaleComment(issueNumber, daysSinceActivity) {
  return `## ⏰ Issue Stale Notification

This issue has been inactive for **${daysSinceActivity} days**.

To keep the issue active:
- Add a comment with an update or progress report
- Update the issue status or labels
- Link a related pull request

If no activity occurs within 7 days, this issue may be closed and archived.

---
*This is an automated message from the stale-issues manager.*`;
}

/**
 * Main stale management function
 */
async function manageStalIssues(options = {}) {
  const {
    verbose = false,
    dryRun = false,
    days = 30,
    label = true,
    comment = false,
    close = false,
    format = "json",
    output = null,
  } = options;

  const startTime = Date.now();
  const changes = [];
  const errors = [];

  try {
    const manager = new LabelManager({ verbose });
    const analyzer = new ActivityAnalyzer({ verbose });
    const reporter = new ReportGenerator({ verbose });

    if (verbose) {
      console.log("Starting stale issues management...");
      if (dryRun) console.log("DRY RUN MODE - no changes will be applied");
      console.log(`Threshold: ${days} days without activity`);
      console.log("Fetching issues...");
    }

    // Fetch all open issues
    const allIssues = await manager.fetchAllIssues({ limit: 1000 });

    if (verbose) {
      console.log(`Fetched ${allIssues.length} issues`);
      console.log("Analyzing activity...");
    }

    // Analyze each issue
    const staleIssues = [];
    for (const issue of allIssues) {
      // Check exclusions
      if (shouldExcludeIssue(issue)) {
        if (verbose) {
          console.log(
            `Excluding issue #${issue.number} (matches exclusion rule)`,
          );
        }
        continue;
      }

      // Check staleness
      const daysSince = analyzer.getDaysSinceActivity(issue);
      if (daysSince >= days) {
        staleIssues.push({
          number: issue.number,
          title: issue.title,
          daysSinceActivity: daysSince,
          currentLabels: issue.labels?.map((l) => l.name) || [],
        });
      }
    }

    if (verbose) {
      console.log(
        `Found ${staleIssues.length} stale issues (>${days} days inactive)`,
      );
    }

    // Process stale issues
    for (const issue of staleIssues) {
      const hasStaleLabel = issue.currentLabels.includes("meta:stale");

      // Add stale label if requested
      if (label && !hasStaleLabel) {
        changes.push({
          type: "label",
          issue: issue.number,
          action: "add",
          label: "meta:stale",
          reason: `Issue #${issue.number} inactive for ${issue.daysSinceActivity} days`,
          dryRun,
        });

        if (!dryRun) {
          try {
            await manager.addLabel(issue.number, "meta:stale");
          } catch (err) {
            errors.push({
              issue: issue.number,
              error: `Failed to add label: ${err.message}`,
            });
          }
        }
      }

      // Post warning comment if requested
      if (comment) {
        changes.push({
          type: "comment",
          issue: issue.number,
          action: "post",
          reason: `Post stale warning comment for issue #${issue.number}`,
          dryRun,
        });

        if (!dryRun) {
          try {
            const commentBody = generateStaleComment(
              issue.number,
              issue.daysSinceActivity,
            );
            await octokit.rest.issues.createComment({
              owner: OWNER,
              repo: REPO,
              issue_number: issue.number,
              body: commentBody,
            });
          } catch (err) {
            errors.push({
              issue: issue.number,
              error: `Failed to post comment: ${err.message}`,
            });
          }
        }
      }

      // Close issue if requested
      if (close) {
        changes.push({
          type: "close",
          issue: issue.number,
          action: "close",
          reason: `Close stale issue #${issue.number} (${issue.daysSinceActivity} days inactive)`,
          dryRun,
        });

        if (!dryRun) {
          try {
            await octokit.rest.issues.update({
              owner: OWNER,
              repo: REPO,
              issue_number: issue.number,
              state: "closed",
            });
          } catch (err) {
            errors.push({
              issue: issue.number,
              error: `Failed to close issue: ${err.message}`,
            });
          }
        }
      }
    }

    // Build report
    const report = {
      management_date: new Date().toISOString(),
      total_issues_analyzed: allIssues.length,
      stale_threshold_days: days,
      dry_run: dryRun,
      actions: {
        labeled: changes.filter((c) => c.type === "label" && c.action === "add")
          .length,
        commented: changes.filter(
          (c) => c.type === "comment" && c.action === "post",
        ).length,
        closed: changes.filter(
          (c) => c.type === "close" && c.action === "close",
        ).length,
        total: changes.length,
      },
      summary: {
        stale_issues_found: staleIssues.length,
        issues_processed: allIssues.length,
        errors: errors.length,
      },
      stale_issues: staleIssues.map((i) => ({
        number: i.number,
        title: i.title,
        daysSinceActivity: i.daysSinceActivity,
      })),
      changes_detail: changes,
      errors: errors.length > 0 ? errors : undefined,
    };

    // Export if output path provided
    if (output) {
      const ext =
        format === "json"
          ? ".json"
          : format === "markdown"
            ? ".md"
            : `.${format}`;
      const outputPath = output.endsWith(ext) ? output : `${output}${ext}`;
      reporter.exportToFile(format, report, outputPath);

      if (verbose) {
        console.log(`Report saved to: ${outputPath}`);
      }
    }

    if (verbose) {
      console.log(`Management completed in ${Date.now() - startTime}ms`);
    }

    return {
      success: true,
      report,
      duration: Date.now() - startTime,
    };
  } catch (error) {
    console.error(`Management failed: ${error.message}`);
    return {
      success: false,
      error: error.message,
      duration: Date.now() - startTime,
    };
  }
}

/**
 * Validate stale management options
 */
function validateOptions(options) {
  const errors = [];

  // Validate days is a positive integer
  if (!Number.isInteger(options.days) || options.days <= 0) {
    errors.push(
      `Invalid --days value: "${options.days}" (must be a positive integer)`,
    );
  }

  // Enforce minimum 7-day grace period
  if (options.days < 7) {
    errors.push(
      `--days must be at least 7 (provided: ${options.days}). This grace period allows time for human review before action.`,
    );
  }

  // Validate at least one action is selected if not dry-run
  if (!options.dryRun) {
    const hasAction = options.label || options.comment || options.close;
    if (!hasAction) {
      errors.push(
        "At least one action (--label, --comment, or --close) must be specified",
      );
    }
  }

  return errors;
}

/**
 * Parse command line arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    verbose: args.includes("-v") || args.includes("--verbose"),
    dryRun: args.includes("--dry-run") || args.includes("--preview"),
    days: 30,
    label: args.includes("--label"),
    comment: args.includes("--comment"),
    close: args.includes("--close"),
    format: "json",
    output: null,
  };

  // Parse days
  const daysIdx = args.findIndex((a) => a === "--days");
  if (daysIdx > -1 && args[daysIdx + 1]) {
    const daysValue = parseInt(args[daysIdx + 1], 10);
    options.days = daysValue;
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

  // Validate options
  const validationErrors = validateOptions(options);
  if (validationErrors.length > 0) {
    console.error("\n❌ Validation Errors:\n");
    validationErrors.forEach((err) => {
      console.error(`  • ${err}`);
    });
    console.error("");
    process.exit(1);
  }

  if (options.verbose) {
    console.log("Stale Issues Management Script");
    console.log(`Mode: ${options.dryRun ? "dry-run" : "apply"}`);
    console.log(`Threshold: ${options.days} days without activity`);
    console.log(
      `Actions: ${
        [
          options.label && "label",
          options.comment && "comment",
          options.close && "close",
        ]
          .filter(Boolean)
          .join(", ") || "none"
      }`,
    );
    console.log(`Format: ${options.format}`);
    if (options.output) console.log(`Output: ${options.output}`);
    console.log("");
  }

  const result = await manageStalIssues(options);

  if (result.success) {
    // Print summary
    console.log("\n=== Stale Issues Management Summary ===\n");
    console.log(
      `Total Issues Analyzed: ${result.report.total_issues_analyzed}`,
    );
    console.log(
      `Stale Issues Found: ${result.report.summary.stale_issues_found}`,
    );
    console.log(`Threshold: ${result.report.stale_threshold_days} days`);

    if (result.report.actions.total > 0) {
      console.log("\nActions Taken:");
      if (result.report.actions.labeled > 0) {
        console.log(`  Labeled: ${result.report.actions.labeled}`);
      }
      if (result.report.actions.commented > 0) {
        console.log(`  Commented: ${result.report.actions.commented}`);
      }
      if (result.report.actions.closed > 0) {
        console.log(`  Closed: ${result.report.actions.closed}`);
      }
    }

    if (result.report.summary.errors > 0) {
      console.log(`Errors: ${result.report.summary.errors}`);
    }

    console.log(`\nDuration: ${result.duration}ms\n`);

    if (options.dryRun) {
      console.log(
        "⚠️  DRY RUN MODE - no changes were actually applied. Run without --dry-run to apply changes.",
      );
    }

    if (!options.output) {
      console.log("JSON Output:");
      console.log(JSON.stringify(result.report, null, 2));
    }
  } else {
    console.error(`\nManagement Failed: ${result.error}`);
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

export { manageStalIssues };
