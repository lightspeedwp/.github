#!/usr/bin/env node

/**
 * Normalize issue and PR titles to include type prefixes.
 *
 * Converts titles like "Update documentation" to "docs: Update documentation"
 * based on issue type, type: labels, or PR-linked issue information.
 *
 * @module scripts/automation/normalize-issue-pr-titles
 * @example
 * // Dry-run scan of all open issues since 2026-01-01
 * node normalize-issue-pr-titles.js --dry-run --state open --since 2026-01-01
 *
 * // Actually update all issues (all states, all time)
 * node normalize-issue-pr-titles.js --state all
 *
 * // Generate report only
 * node normalize-issue-pr-titles.js --dry-run --state all --output report.json
 */

const fs = require("fs");
let Octokit;
try {
  ({ Octokit } = require("octokit"));
} catch (e) {
  // Octokit might not be available in test environment
  Octokit = null;
}

// Initialize Octokit (only when GITHUB_TOKEN is available and Octokit is loaded)
let octokit = null;
if (process.env.GITHUB_TOKEN && Octokit) {
  octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });
}

// Type to prefix mapping
const TYPE_PREFIXES = {
  bug: "fix",
  feature: "feat",
  hotfix: "hotfix",
  refactor: "refactor",
  chore: "chore",
  docs: "docs",
  documentation: "docs",
  test: "test",
  perf: "perf",
  performance: "perf",
  ci: "ci",
  build: "build",
  deps: "deps",
  dependency: "deps",
  security: "security",
  design: "design",
  a11y: "a11y",
  accessibility: "a11y",
  ux: "ux",
  release: "release",
  research: "research",
  revert: "revert",
  i18n: "i18n",
  ops: "ops",
  proto: "proto",
  ds: "ds",
  api: "api",
  schema: "schema",
  telemetry: "telemetry",
  content: "content",
  seo: "seo",
  config: "config",
  migrate: "migrate",
  migration: "migrate",
  qa: "qa",
  uat: "uat",
  audit: "audit",
  task: "chore",
  improvement: "feat",
  improve: "feat",
  enhancement: "feat",
};

/**
 * Get the type prefix from various sources.
 * Precedence: linked issue type > issue type field > PR labels > PR description
 */
async function getTypePrefix(item, owner, repo) {
  let detectedType = null;

  // For PRs: try to find linked issue and get its type
  if (item.pull_request) {
    try {
      const prData = await octokit.rest.pulls.get({
        owner,
        repo,
        pull_number: item.number,
      });

      const body = prData.data.body || "";
      const issueMatch = body.match(
        /(close|closes|closed|fix|fixes|fixed|resolve|resolves|resolved)\s+#(\d+)/i,
      );

      if (issueMatch) {
        const linkedIssueNumber = parseInt(issueMatch[2]);
        try {
          const issue = await octokit.rest.issues.get({
            owner,
            repo,
            issue_number: linkedIssueNumber,
          });

          // Check linked issue labels for type:
          if (issue.data.labels && issue.data.labels.length > 0) {
            for (const label of issue.data.labels) {
              const labelName = label.name.toLowerCase();
              if (labelName.startsWith("type:")) {
                detectedType = labelName.replace("type:", "");
                break;
              }
            }
          }
        } catch (e) {
          // Linked issue not found or not accessible
        }
      }

      // If no linked issue type, check PR labels
      if (
        !detectedType &&
        prData.data.labels &&
        prData.data.labels.length > 0
      ) {
        for (const label of prData.data.labels) {
          const labelName = label.name.toLowerCase();
          if (labelName.startsWith("type:")) {
            detectedType = labelName.replace("type:", "");
            break;
          }
        }
      }

      // If no labels, scan PR body for type: indicator
      if (!detectedType) {
        const typeMatch = body.match(/type:\s*(\w+)/i);
        if (typeMatch) {
          detectedType = typeMatch[1].toLowerCase();
        }
      }
    } catch (error) {
      console.error(`Error processing PR #${item.number}:`, error.message);
    }
  } else {
    // For issues: check labels first
    if (item.labels && item.labels.length > 0) {
      for (const label of item.labels) {
        const labelName = label.name.toLowerCase();
        if (labelName.startsWith("type:")) {
          detectedType = labelName.replace("type:", "");
          break;
        }
      }
    }

    // If no type: label, scan body for type field
    if (!detectedType && item.body) {
      const typeMatch = item.body.match(/type:\s*(\w+)/i);
      if (typeMatch) {
        detectedType = typeMatch[1].toLowerCase();
      }
    }
  }

  // Map detected type to prefix
  if (detectedType) {
    return TYPE_PREFIXES[detectedType] || "chore";
  }

  // Default to chore if no type found
  return "chore";
}

/**
 * Check if a title is already prefixed.
 */
function isAlreadyPrefixed(title) {
  const prefixPattern =
    /^(fix|feat|hotfix|refactor|chore|docs|test|perf|ci|build|deps|security|design|a11y|ux|release|research|revert|i18n|ops|proto|ds|api|schema|telemetry|content|seo|config|migrate|qa|uat|audit):\s+/i;
  return prefixPattern.test(title);
}

/**
 * Normalize a title by adding type prefix.
 */
function normalizeTitle(title, prefix) {
  if (isAlreadyPrefixed(title)) {
    return null; // Already prefixed, no change needed
  }

  return `${prefix}: ${title}`;
}

/**
 * Parse command-line arguments.
 */
function parseArgs() {
  const args = {
    dryRun: process.argv.includes("--dry-run"),
    state: "open", // open, closed, all
    since: null,
    output: null,
    verbose: process.argv.includes("--verbose"),
  };

  for (let i = 2; i < process.argv.length; i++) {
    if (process.argv[i] === "--state" && i + 1 < process.argv.length) {
      args.state = process.argv[i + 1];
      i++;
    } else if (process.argv[i] === "--since" && i + 1 < process.argv.length) {
      args.since = process.argv[i + 1];
      i++;
    } else if (process.argv[i] === "--output" && i + 1 < process.argv.length) {
      args.output = process.argv[i + 1];
      i++;
    }
  }

  return args;
}

/**
 * Format date for GitHub API (ISO 8601).
 */
function formatDate(dateStr) {
  try {
    return new Date(dateStr).toISOString();
  } catch {
    return null;
  }
}

/**
 * Main normalization routine.
 */
async function normalize() {
  const args = parseArgs();

  if (!process.env.GITHUB_TOKEN) {
    console.error("❌ GITHUB_TOKEN environment variable is not set");
    process.exit(1);
  }

  console.log("🔄 Starting title normalization...");
  console.log(`   Dry-run: ${args.dryRun}`);
  console.log(`   State: ${args.state}`);
  console.log(`   Since: ${args.since || "all time"}`);
  console.log("");

  const results = {
    issues: {
      total: 0,
      normalized: 0,
      skipped: 0,
      errors: 0,
      items: [],
    },
    prs: {
      total: 0,
      normalized: 0,
      skipped: 0,
      errors: 0,
      items: [],
    },
    summary: {
      startTime: new Date().toISOString(),
      dryRun: args.dryRun,
      state: args.state,
    },
  };

  try {
    // Get repository owner and repo from environment or config
    const context = JSON.parse(process.env.GITHUB_CONTEXT || "{}");
    const owner = context.repo?.owner || "lightspeedwp";
    const repo = context.repo?.repo || ".github";

    console.log(`📦 Repository: ${owner}/${repo}`);
    console.log("");

    // Build query parameters
    let query = `repo:${owner}/${repo} `;
    if (args.state === "open") {
      query += "is:open ";
    } else if (args.state === "closed") {
      query += "is:closed ";
    }

    if (args.since) {
      const sinceDate = formatDate(args.since);
      if (sinceDate) {
        query += `created:>=${sinceDate} `;
      }
    }

    // Process issues
    console.log("🔍 Scanning issues...");
    let issuesPage = 1;
    let hasMoreIssues = true;

    while (hasMoreIssues) {
      try {
        const issuesResponse = await octokit.rest.search.issuesAndPullRequests({
          q: `${query} is:issue type:issue`,
          per_page: 100,
          page: issuesPage,
        });

        if (issuesResponse.data.items.length === 0) {
          break;
        }

        for (const issue of issuesResponse.data.items) {
          results.issues.total++;

          try {
            const prefix = await getTypePrefix(issue, owner, repo);
            const newTitle = normalizeTitle(issue.title, prefix);

            if (newTitle) {
              results.issues.items.push({
                number: issue.number,
                url: issue.html_url,
                oldTitle: issue.title,
                newTitle,
                prefix,
                state: issue.state,
              });
              results.issues.normalized++;

              if (!args.dryRun) {
                await octokit.rest.issues.update({
                  owner,
                  repo,
                  issue_number: issue.number,
                  title: newTitle,
                });
                if (args.verbose) {
                  console.log(
                    `  ✅ #${issue.number}: "${issue.title}" → "${newTitle}"`,
                  );
                }
              } else if (args.verbose) {
                console.log(
                  `  📝 #${issue.number}: "${issue.title}" → "${newTitle}" (dry-run)`,
                );
              }
            } else {
              results.issues.skipped++;
              if (args.verbose) {
                console.log(`  ⏭️ #${issue.number}: Already prefixed`);
              }
            }
          } catch (error) {
            results.issues.errors++;
            console.error(
              `  ❌ Error processing #${issue.number}:`,
              error.message,
            );
          }
        }

        issuesPage++;
      } catch (error) {
        console.error("❌ Error fetching issues page:", error.message);
        hasMoreIssues = false;
      }
    }

    // Process PRs
    console.log("");
    console.log("🔍 Scanning pull requests...");
    let prsPage = 1;
    let hasMorePrs = true;

    while (hasMorePrs) {
      try {
        const prsResponse = await octokit.rest.search.issuesAndPullRequests({
          q: `${query} is:pull-request type:pr`,
          per_page: 100,
          page: prsPage,
        });

        if (prsResponse.data.items.length === 0) {
          break;
        }

        for (const pr of prsResponse.data.items) {
          results.prs.total++;

          try {
            const prefix = await getTypePrefix(pr, owner, repo);
            const newTitle = normalizeTitle(pr.title, prefix);

            if (newTitle) {
              results.prs.items.push({
                number: pr.number,
                url: pr.html_url,
                oldTitle: pr.title,
                newTitle,
                prefix,
                state: pr.state,
              });
              results.prs.normalized++;

              if (!args.dryRun) {
                await octokit.rest.pulls.update({
                  owner,
                  repo,
                  pull_number: pr.number,
                  title: newTitle,
                });
                if (args.verbose) {
                  console.log(
                    `  ✅ #${pr.number}: "${pr.title}" → "${newTitle}"`,
                  );
                }
              } else if (args.verbose) {
                console.log(
                  `  📝 #${pr.number}: "${pr.title}" → "${newTitle}" (dry-run)`,
                );
              }
            } else {
              results.prs.skipped++;
              if (args.verbose) {
                console.log(`  ⏭️ #${pr.number}: Already prefixed`);
              }
            }
          } catch (error) {
            results.prs.errors++;
            console.error(
              `  ❌ Error processing PR #${pr.number}:`,
              error.message,
            );
          }
        }

        prsPage++;
      } catch (error) {
        console.error("❌ Error fetching PRs page:", error.message);
        hasMorePrs = false;
      }
    }

    // Print summary
    console.log("");
    console.log("═══════════════════════════════════════");
    console.log(`📊 Summary Report${args.dryRun ? " (Dry-run)" : ""}`);
    console.log("═══════════════════════════════════════");
    console.log("");
    console.log("Issues:");
    console.log(`  Total:      ${results.issues.total}`);
    console.log(`  Normalized: ${results.issues.normalized}`);
    console.log(`  Skipped:    ${results.issues.skipped}`);
    console.log(`  Errors:     ${results.issues.errors}`);
    console.log("");
    console.log("Pull Requests:");
    console.log(`  Total:      ${results.prs.total}`);
    console.log(`  Normalized: ${results.prs.normalized}`);
    console.log(`  Skipped:    ${results.prs.skipped}`);
    console.log(`  Errors:     ${results.prs.errors}`);
    console.log("");
    console.log(
      `Grand Total: ${results.issues.total + results.prs.total} items`,
    );
    console.log(
      `To Normalize: ${results.issues.normalized + results.prs.normalized} items`,
    );
    console.log("");

    // Write output file if requested
    if (args.output) {
      results.summary.endTime = new Date().toISOString();
      fs.writeFileSync(args.output, JSON.stringify(results, null, 2));
      console.log(`✅ Detailed report written to: ${args.output}`);
    }

    // Exit with appropriate code
    process.exit(results.issues.errors + results.prs.errors > 0 ? 1 : 0);
  } catch (error) {
    console.error("❌ Fatal error:", error.message);
    process.exit(1);
  }
}

// Export functions for testing
module.exports = {
  normalizeTitle,
  isAlreadyPrefixed,
  getTypePrefix,
  parseArgs,
  formatDate,
};

// Run normalization when executed directly
if (require.main === module) {
  normalize();
}
