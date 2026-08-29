#!/usr/bin/env node

/**
 * Bulk Issue Metadata Updater — Orchestrator
 *
 * Unified batch processor for Tier 1 handlers:
 * - status:needs-template-fix → handle-needs-template-fix.js
 * - status:needs-triage → handle-needs-triage.js
 *
 * Supports three modes:
 * - --dry-run: Preview all changes without applying (default)
 * - --interactive: Prompt before each change
 * - --auto: Apply all changes with confidence threshold
 *
 * Usage:
 *   node bulk-issue-metadata-updater.js --dry-run [--limit=N]
 *   node bulk-issue-metadata-updater.js --interactive [--confidence=0.85]
 *   node bulk-issue-metadata-updater.js --auto --confidence=0.9
 *
 * Flags:
 *   --dry-run              Preview changes without applying (default mode)
 *   --interactive          Prompt before each change (requires user input)
 *   --auto                 Apply all changes automatically
 *   --limit=N              Maximum issues to process (default: 999999)
 *   --confidence=N         Confidence threshold 0-1 (default: 0.85)
 *   --label=LABEL          Process specific label (default: all status:needs-*)
 *   --verbose              Show detailed output for each issue
 */

import fs from "fs";
import readline from "readline";
import * as templateFixHandler from "./handlers/handle-needs-template-fix.js";
import * as triageHandler from "./handlers/handle-needs-triage.js";

const { URLSearchParams } = globalThis;

// GitHub API client using native fetch
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_API_BASE = "https://api.github.com";

const githubApi = {
  async request(method, path, data = {}) {
    const url = `${GITHUB_API_BASE}${path}`;
    const options = {
      method,
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        "X-GitHub-Api-Version": "2022-11-28",
        Accept: "application/vnd.github+json",
      },
    };

    if (Object.keys(data).length > 0) {
      options.body = JSON.stringify(data);
      options.headers["Content-Type"] = "application/json";
    }

    // eslint-disable-next-line no-undef
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(
        `GitHub API error: ${response.status} ${response.statusText}`,
      );
    }

    return response.json();
  },

  async listIssues(owner, repo, options = {}) {
    const params = new URLSearchParams({
      state: options.state || "open",
      per_page: options.per_page || 30,
      page: options.page || 1,
      ...(options.labels && { labels: options.labels }),
    });

    return this.request("GET", `/repos/${owner}/${repo}/issues?${params}`);
  },

  async listMilestones(owner, repo) {
    return this.request(
      "GET",
      `/repos/${owner}/${repo}/milestones?state=all&per_page=100`,
    );
  },
};

// Configuration
const config = {
  owner: "lightspeedwp",
  repo: ".github",
  perPage: 50,
};

// Parse command-line arguments
const args = process.argv.slice(2);
const mode = args.includes("--auto")
  ? "auto"
  : args.includes("--interactive")
    ? "interactive"
    : "dry-run";

const limitArg = parseInt(
  args.find((arg) => arg.startsWith("--limit="))?.split("=")[1] || "999999",
);
if (!Number.isSafeInteger(limitArg) || limitArg <= 0) {
  console.error(`Error: --limit must be a positive integer, got "${limitArg}"`);
  process.exit(1);
}

const confidenceArg = parseFloat(
  args.find((arg) => arg.startsWith("--confidence="))?.split("=")[1] || "0.85",
);
if (Number.isNaN(confidenceArg) || confidenceArg < 0 || confidenceArg > 1) {
  console.error(
    `Error: --confidence must be between 0 and 1, got "${confidenceArg}"`,
  );
  process.exit(1);
}

const targetLabel = args
  .find((arg) => arg.startsWith("--label="))
  ?.split("=")[1];
const verbose = args.includes("--verbose");

const config_ = {
  ...config,
  limit: limitArg,
  confidence: confidenceArg,
  targetLabel,
  verbose,
};

console.log(`📋 Bulk Issue Metadata Updater`);
console.log(
  `🔧 Mode: ${mode} | Confidence: ${(confidenceArg * 100).toFixed(0)}%`,
);
console.log(`📊 Processing up to ${limitArg} issues\n`);

// Fetch all issues with status:needs-* labels
async function fetchIssuesWithStatusLabels() {
  const issues = [];
  let page = 1;
  let hasMore = true;

  const statusLabels = config_.targetLabel
    ? [config_.targetLabel]
    : [
        "status:needs-template-fix",
        "status:needs-triage",
        "status:needs-more-info",
      ];

  try {
    while (hasMore && issues.length < config_.limit) {
      console.log(`⏳ Fetching page ${page}...`);

      for (const label of statusLabels) {
        try {
          const rawPage = await githubApi.listIssues(
            config_.owner,
            config_.repo,
            {
              labels: label,
              state: "open",
              per_page: config_.perPage,
              page,
            },
          );

          const pageIssues = (rawPage || []).filter(
            (item) => !item.pull_request,
          );

          issues.push(...pageIssues.slice(0, config_.limit - issues.length));

          if (pageIssues.length < config_.perPage) {
            hasMore = false;
          }
        } catch (error) {
          console.error(`❌ Error fetching label ${label}:`, error.message);
          continue;
        }
      }

      if (issues.length < config_.limit && hasMore) {
        page++;
      }
    }

    console.log(`✅ Fetched ${issues.length} issues\n`);
    return issues;
  } catch (error) {
    console.error("❌ Fatal error fetching issues:", error.message);
    process.exit(1);
  }
}

// Milestone cache to avoid repeated API calls
const milestoneCache = {};

// Get milestone number by title
async function getMilestoneNumber(milestoneTitle) {
  if (milestoneCache[milestoneTitle]) {
    return milestoneCache[milestoneTitle];
  }

  try {
    const response = await githubApi.listMilestones(
      config_.owner,
      config_.repo,
    );

    for (const milestone of response) {
      milestoneCache[milestone.title] = milestone.number;
      if (milestone.title === milestoneTitle) {
        return milestone.number;
      }
    }
  } catch (error) {
    console.warn(`⚠️  Could not fetch milestones: ${error.message}`);
  }

  return null;
}

// Create GitHub request function for handlers
function createGithubRequest(dryRun = false) {
  return async (method, path, data = {}) => {
    if (dryRun) {
      return { ok: true };
    }

    try {
      const response = await githubApi.request(method, path, data);
      return response;
    } catch (err) {
      throw new Error(`GitHub API error: ${err.message}`, { cause: err });
    }
  };
}

// Route issue to appropriate handler
async function routeToHandler(issue, options = {}) {
  const labels = (issue.labels || []).map((l) => l.name || l);
  const dryRun = options.dryRun !== false;

  if (labels.includes("status:needs-template-fix")) {
    return {
      label: "status:needs-template-fix",
      handler: "template-fix",
      result: await templateFixHandler.processIssue(issue, {
        dryRun,
        githubRequest: createGithubRequest(dryRun),
        owner: config_.owner,
        repo: config_.repo,
      }),
    };
  }

  if (labels.includes("status:needs-triage")) {
    return {
      label: "status:needs-triage",
      handler: "triage",
      result: await triageHandler.processIssue(issue, {
        dryRun,
        githubRequest: createGithubRequest(dryRun),
        confidenceThreshold: config_.confidence,
        owner: config_.owner,
        repo: config_.repo,
      }),
    };
  }

  return {
    label: "unknown",
    handler: "unknown",
    result: { status: "skipped" },
  };
}

// Apply milestone to an issue
async function applyMilestone(issueNumber, milestoneSuggestion, dryRun = true) {
  if (!milestoneSuggestion || dryRun) {
    return { applied: false, reason: dryRun ? "dry-run" : "no suggestion" };
  }

  try {
    const milestoneNumber = await getMilestoneNumber(milestoneSuggestion);
    if (!milestoneNumber) {
      return {
        applied: false,
        reason: `Milestone "${milestoneSuggestion}" not found`,
      };
    }

    await githubApi.request(
      "PATCH",
      `/repos/${config_.owner}/${config_.repo}/issues/${issueNumber}`,
      {
        milestone: milestoneNumber,
      },
    );

    return { applied: true, milestone: milestoneSuggestion };
  } catch (error) {
    return { applied: false, reason: error.message };
  }
}

// Prompt user for confirmation (interactive mode)
async function promptUser(message) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(message, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === "y" || answer.toLowerCase() === "yes");
    });
  });
}

// Process issues in batch
async function processBatch(issues) {
  const summary = {
    totalProcessed: 0,
    totalSkipped: 0,
    totalApplied: 0,
    totalFailed: 0,
    preview: [],
    updated: [],
    skipped: [],
    errors: [],
  };

  console.log(`\n📝 Processing ${issues.length} issues in ${mode} mode...\n`);

  for (let i = 0; i < issues.length; i++) {
    const issue = issues[i];
    const progress = `[${i + 1}/${issues.length}]`;

    try {
      const routed = await routeToHandler(issue, {
        dryRun: mode === "dry-run" || mode === "interactive",
      });

      const { result } = routed;

      if (verbose) {
        console.log(
          `${progress} #${issue.number}: ${issue.title.substring(0, 50)}...`,
        );
        console.log(`   Handler: ${routed.handler}`);
        console.log(`   Status: ${result.status}\n`);
      }

      if (result.status === "preview") {
        summary.preview.push({ issue: issue.number, ...result });
        summary.totalProcessed++;

        if (mode === "interactive") {
          const confirm = await promptUser(
            `Apply changes to #${issue.number}? (y/n): `,
          );
          if (confirm) {
            const applyResult = await routeToHandler(issue, {
              dryRun: false,
            });
            if (applyResult.result.status === "updated") {
              // Apply milestone if suggested
              const milestoneResult = await applyMilestone(
                issue.number,
                applyResult.result.milestoneSuggested,
                false,
              );
              summary.updated.push({
                issue: issue.number,
                ...applyResult.result,
                milestoneApplied: milestoneResult,
              });
              summary.totalApplied++;
            } else if (applyResult.result.status === "error") {
              summary.errors.push({
                issue: issue.number,
                ...applyResult.result,
              });
              summary.totalFailed++;
            }
          }
        }
      } else if (result.status === "updated") {
        // Apply milestone if suggested (auto mode only)
        const milestoneResult =
          mode === "auto"
            ? await applyMilestone(
                issue.number,
                result.milestoneSuggested,
                false,
              )
            : { applied: false, reason: "not in auto mode" };

        summary.updated.push({
          issue: issue.number,
          ...result,
          milestoneApplied: milestoneResult,
        });
        summary.totalApplied++;
      } else if (result.status === "skipped") {
        summary.skipped.push({ issue: issue.number, ...result });
        summary.totalSkipped++;
      } else if (result.status === "error") {
        summary.errors.push({ issue: issue.number, ...result });
        summary.totalFailed++;
      }
    } catch (error) {
      summary.errors.push({
        issue: issue.number,
        error: error.message,
      });
      summary.totalFailed++;
    }
  }

  return summary;
}

// Format and display summary report
function displaySummary(summary) {
  console.log("\n" + "=".repeat(60));
  console.log("📊 SUMMARY REPORT");
  console.log("=".repeat(60));

  console.log(`\n📈 Statistics:`);
  console.log(`   Total processed:  ${summary.totalProcessed}`);
  console.log(`   Total applied:    ${summary.totalApplied}`);
  console.log(`   Total skipped:    ${summary.totalSkipped}`);
  console.log(`   Total failed:     ${summary.totalFailed}`);

  if (mode === "dry-run") {
    console.log(
      `\n🔍 Preview Mode: ${summary.preview.length} changes ready to apply`,
    );
    if (summary.preview.length > 0 && summary.preview.length <= 5) {
      console.log(
        `   Issues: ${summary.preview.map((p) => `#${p.issue}`).join(", ")}`,
      );
    }
  }

  if (summary.updated.length > 0) {
    console.log(
      `\n✅ Applied Changes: ${summary.updated.length} issues updated`,
    );
    if (summary.updated.length <= 5) {
      console.log(
        `   Issues: ${summary.updated.map((u) => `#${u.issue}`).join(", ")}`,
      );
    }
  }

  if (summary.skipped.length > 0) {
    console.log(
      `\n⏭️  Skipped: ${summary.skipped.length} issues (already processed)`,
    );
  }

  if (summary.errors.length > 0) {
    console.log(`\n❌ Errors: ${summary.errors.length} issues failed`);
    if (summary.errors.length <= 5) {
      summary.errors.forEach((e) => {
        console.log(`   #${e.issue}: ${e.error || e.reason}`);
      });
    }
  }

  console.log("\n" + "=".repeat(60));

  if (mode === "dry-run") {
    console.log(`\n💡 Tip: Run with --interactive or --auto to apply changes`);
  }
}

// Save summary to file
function saveSummary(summary) {
  const timestamp = new Date()
    .toISOString()
    .replace(/[:.]/g, "-")
    .split("-")
    .slice(0, -1)
    .join("-");
  const filename = `orchestrator-summary-${timestamp}.json`;
  const filepath = `reports/${filename}`;

  try {
    if (!fs.existsSync("reports")) {
      fs.mkdirSync("reports", { recursive: true });
    }

    fs.writeFileSync(filepath, JSON.stringify(summary, null, 2));
    console.log(`\n📄 Summary saved to: ${filepath}`);
  } catch (error) {
    console.warn(`⚠️  Could not save summary: ${error.message}`);
  }
}

// Main execution
async function main() {
  try {
    const issues = await fetchIssuesWithStatusLabels();

    if (issues.length === 0) {
      console.log("ℹ️  No issues found with status:needs-* labels");
      process.exit(0);
    }

    const summary = await processBatch(issues);
    displaySummary(summary);
    saveSummary(summary);

    if (summary.totalFailed > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error("❌ Fatal error:", error.message);
    process.exit(1);
  }
}

main();
