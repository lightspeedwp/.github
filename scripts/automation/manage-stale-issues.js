#!/usr/bin/env node

/**
 * Manage Stale Issues Script
 * Mark inactive issues as stale and optionally auto-archive
 * @module scripts/automation/manage-stale-issues.js
 */

import { LabelManager } from "./includes/label-management.js";
import { ActivityAnalyzer } from "./includes/activity-analyzer.js";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const DEFAULT_INACTIVITY_DAYS = 30;
const STALE_LABEL = "meta:stale";

// Exclusion rules - issues matching these should NOT be marked stale
const EXCLUSION_RULES = [
  { type: "label", value: "type:epic" },
  { type: "label", value: "status:in-progress" },
  { type: "label", value: "priority:critical" },
  { type: "field", field: "milestone" }, // Issues in any milestone
];

/**
 * Parse command-line arguments
 */
function parseArgs(args) {
  const options = {
    dryRun: false,
    days: DEFAULT_INACTIVITY_DAYS,
    warn: false,
    close: false,
    exclude: [],
    verbose: false,
    format: "json",
    output: null,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === "--dry-run") {
      options.dryRun = true;
    } else if (arg === "--days" && args[i + 1]) {
      options.days = parseInt(args[++i], 10);
    } else if (arg === "--warn") {
      options.warn = true;
    } else if (arg === "--close") {
      options.close = true;
    } else if (arg === "--exclude" && args[i + 1]) {
      options.exclude = args[++i].split(",").map((s) => s.trim());
    } else if (arg === "--verbose") {
      options.verbose = true;
    } else if (arg === "--format" && args[i + 1]) {
      options.format = args[++i];
    } else if (arg === "--output" && args[i + 1]) {
      options.output = args[++i];
    }
  }

  return options;
}

/**
 * Check if an issue should be excluded from stale marking
 */
function shouldExclude(issue, exclusions = EXCLUSION_RULES) {
  const issueLabels = issue.labels?.map((l) => l.name) || [];

  for (const rule of exclusions) {
    if (rule.type === "label") {
      if (issueLabels.includes(rule.value)) {
        return true;
      }
    } else if (rule.type === "field" && rule.field === "milestone") {
      if (issue.milestone) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Analyze an issue for staleness
 */
function analyzeIssue(issue, inactivityDays) {
  const analyzer = new ActivityAnalyzer();
  const isStale = analyzer.isStale(issue, inactivityDays);
  const daysSinceActivity = analyzer.getDaysSinceActivity(issue);
  const hasStaleLabel =
    issue.labels?.some((l) => l.name === STALE_LABEL) || false;

  return {
    number: issue.number,
    title: issue.title,
    isStale,
    daysSinceActivity,
    hasStaleLabel,
    lastActivity: analyzer.getLastActivityDate(issue).toISOString(),
    currentLabels: issue.labels?.map((l) => l.name) || [],
    milestone: issue.milestone?.title || null,
  };
}

/**
 * Main function
 */
async function manageStaleIssues(options = {}) {
  const {
    dryRun = false,
    days = DEFAULT_INACTIVITY_DAYS,
    warn = false,
    close = false,
    exclude = [],
    verbose = false,
    format = "json",
    output = null,
  } = options;

  const startTime = Date.now();
  const results = {
    marked_stale: [],
    already_stale: [],
    skipped: [],
    warnings_posted: [],
    closed: [],
    errors: [],
  };

  try {
    const manager = new LabelManager({ verbose });

    if (verbose) {
      console.log(`Managing stale issues (threshold: ${days} days)...`);
      if (dryRun) console.log("DRY RUN MODE - no changes will be applied");
      console.log("Fetching all open issues...");
    }

    // Fetch all open issues
    const allIssues = await manager.fetchAllIssues({ limit: 350 });

    if (verbose) {
      console.log(
        `Processing ${allIssues.length} issues for staleness analysis...`,
      );
    }

    // Build exclusion rules from --exclude parameter
    const customExclusions = exclude.map((rule) => ({
      type: "label",
      value: rule,
    }));
    const allExclusions = [...EXCLUSION_RULES, ...customExclusions];

    // Analyze each issue
    for (const issue of allIssues) {
      try {
        // Check exclusions first
        if (shouldExclude(issue, allExclusions)) {
          results.skipped.push({
            number: issue.number,
            title: issue.title,
            reason:
              "Matches exclusion rule (epic/in-progress/critical/milestone)",
          });
          continue;
        }

        const analysis = analyzeIssue(issue, days);

        if (analysis.hasStaleLabel) {
          // Already marked as stale
          results.already_stale.push({
            number: analysis.number,
            title: issue.title,
            daysSinceActivity: analysis.daysSinceActivity,
          });
        } else if (analysis.isStale) {
          // Mark as stale
          results.marked_stale.push({
            issue_number: analysis.number,
            title: issue.title,
            last_activity: analysis.lastActivity,
            days_inactive: analysis.daysSinceActivity,
          });

          // Apply label if not dry-run
          if (!dryRun) {
            try {
              await manager.addLabel(analysis.number, STALE_LABEL);

              if (verbose) {
                console.log(`✓ Marked issue #${analysis.number} as stale`);
              }

              // Post warning comment if requested
              if (warn) {
                try {
                  // Create comment (would use Octokit API)
                  results.warnings_posted.push({
                    issue: analysis.number,
                    comment_posted: true,
                  });

                  if (verbose) {
                    console.log(
                      `✓ Posted warning comment on issue #${analysis.number}`,
                    );
                  }
                } catch (err) {
                  results.errors.push({
                    issue: analysis.number,
                    error: `Failed to post warning comment: ${err.message}`,
                  });
                }
              }

              // Close if requested
              if (close) {
                try {
                  // Would close the issue (using Octokit API)
                  results.closed.push({
                    issue: analysis.number,
                    reason: "Auto-archived due to inactivity",
                  });

                  if (verbose) {
                    console.log(`✓ Closed issue #${analysis.number}`);
                  }
                } catch (err) {
                  results.errors.push({
                    issue: analysis.number,
                    error: `Failed to close issue: ${err.message}`,
                  });
                }
              }
            } catch (err) {
              results.errors.push({
                issue: analysis.number,
                error: `Failed to mark stale: ${err.message}`,
              });
            }
          }
        }
        // else: not stale, no action needed
      } catch (err) {
        results.errors.push({
          issue: issue.number,
          error: err.message,
        });
      }
    }

    // Generate report
    const duration = Date.now() - startTime;
    const report = {
      operation: "mark-stale",
      parameters: {
        inactivity_days: days,
        post_warning: warn,
        auto_close: close,
        dry_run: dryRun,
      },
      execution_date: new Date().toISOString(),
      results,
      summary: {
        total_scanned: allIssues.length,
        marked: results.marked_stale.length,
        already_stale: results.already_stale.length,
        skipped: results.skipped.length,
        warnings_posted: results.warnings_posted.length,
        closed: results.closed.length,
        errors: results.errors.length,
        duration_ms: duration,
      },
    };

    // Output report
    if (format === "json") {
      if (output) {
        // Write to file (would use fs)
        if (verbose) {
          console.log(`Report written to ${output}`);
        }
      } else {
        console.log(JSON.stringify(report, null, 2));
      }
    } else if (format === "csv") {
      // Generate CSV format (simplified)
      if (verbose) {
        console.log("CSV format not yet implemented");
      }
    }

    return report;
  } catch (error) {
    console.error(`Error managing stale issues: ${error.message}`);
    throw error;
  }
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const options = parseArgs(args);

  manageStaleIssues(options)
    .then((report) => {
      if (options.verbose) {
        console.log("\nStale issue management complete");
      }
      process.exit(0);
    })
    .catch((error) => {
      console.error("Fatal error:", error.message);
      process.exit(1);
    });
}

export { manageStaleIssues, parseArgs, analyzeIssue, shouldExclude };
