#!/usr/bin/env node

/**
 * Allocate merged PRs and closed issues to the current active milestone
 *
 * Usage:
 *   node allocate-to-milestone.js [--dry-run] [--days N] [--milestone N] [--verbose]
 *
 * Options:
 *   --dry-run         Show what would be changed without making changes
 *   --days N          Look back N days for merged PRs/closed issues (default: 7)
 *   --milestone N     Force allocation to specific milestone number (overrides auto-detection)
 *   --verbose         Enable detailed logging
 *
 * Environment:
 *   GITHUB_TOKEN      Required. GitHub personal access token with repo access
 *   GITHUB_OWNER      GitHub owner/org (default: lightspeedwp)
 *   GITHUB_REPO       GitHub repo name (default: .github)
 *
 * Examples:
 *   node allocate-to-milestone.js --dry-run
 *   node allocate-to-milestone.js --days 30 --verbose
 *   node allocate-to-milestone.js --milestone 42 --dry-run
 */

const https = require("https");
const { URL } = require("url");

// Configuration
const config = {
  owner: process.env.GITHUB_OWNER || "lightspeedwp",
  repo: process.env.GITHUB_REPO || ".github",
  token: process.env.GITHUB_TOKEN,
  dryRun: process.argv.includes("--dry-run"),
  verbose: process.argv.includes("--verbose"),
  lookbackDays: parseInt(
    process.argv.find((arg) => arg.startsWith("--days"))?.split("=")[1] || "7",
    10,
  ),
  forceMilestone: parseInt(
    process.argv.find((arg) => arg.startsWith("--milestone"))?.split("=")[1] ||
      "0",
    10,
  ),
};

// Validate token
if (!config.token) {
  console.error("❌ Error: GITHUB_TOKEN environment variable not set");
  process.exit(1);
}

let stats = {
  milestonesFound: 0,
  currentMilestone: null,
  prsProcessed: 0,
  prAllocated: 0,
  issuesProcessed: 0,
  issuesAllocated: 0,
  errors: [],
};

/**
 * Make authenticated GitHub API request
 */
async function github(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(`https://api.github.com${path}`);
    const options = {
      method,
      headers: {
        Authorization: `token ${config.token}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "allocate-to-milestone/1.0",
      },
    };

    const req = https.request(url, options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        if (res.statusCode >= 400) {
          reject(new Error(`API Error ${res.statusCode}: ${data}`));
        } else {
          resolve(JSON.parse(data || "{}"));
        }
      });
    });

    req.on("error", reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

/**
 * Get all open milestones sorted by due date (earliest first), then by creation date (latest first)
 */
async function getOpenMilestones() {
  log("📋 Fetching open milestones...");
  try {
    const milestones = await github(
      "GET",
      `/repos/${config.owner}/${config.repo}/milestones?state=open&per_page=100&sort=due_on&direction=asc`,
    );
    stats.milestonesFound = milestones.length;

    if (milestones.length === 0) {
      log("⚠️  No open milestones found");
      return null;
    }

    // Sort by due date (earliest first), then by created_at (latest first)
    milestones.sort((a, b) => {
      const aDue = new Date(a.due_on || "9999-12-31");
      const bDue = new Date(b.due_on || "9999-12-31");

      if (aDue.getTime() !== bDue.getTime()) {
        return aDue.getTime() - bDue.getTime(); // Earliest due date first
      }

      // If due dates are same, prefer latest created
      const aCreated = new Date(a.created_at);
      const bCreated = new Date(b.created_at);
      return bCreated.getTime() - aCreated.getTime();
    });

    const current = milestones[0];
    log(
      `✅ Selected milestone: #${current.number} "${current.title}" (due: ${current.due_on || "No due date"})`,
    );
    return current;
  } catch (err) {
    error(`Failed to fetch milestones: ${err.message}`);
    return null;
  }
}

/**
 * Get merged PRs from the last N days
 */
async function getMergedPRs() {
  const since = new Date(
    Date.now() - config.lookbackDays * 24 * 60 * 60 * 1000,
  ).toISOString();
  const query = `repo:${config.owner}/${config.repo} is:pr is:merged merged:>=${since}`;

  log(`🔍 Searching for PRs merged in the last ${config.lookbackDays} days...`);
  try {
    const response = await github(
      "GET",
      `/search/issues?q=${encodeURIComponent(query)}&per_page=100`,
    );
    const prs = response.items || [];
    log(`   Found ${prs.length} merged PRs`);
    return prs;
  } catch (err) {
    error(`Failed to fetch merged PRs: ${err.message}`);
    return [];
  }
}

/**
 * Get closed issues from the last N days
 */
async function getClosedIssues() {
  const since = new Date(
    Date.now() - config.lookbackDays * 24 * 60 * 60 * 1000,
  ).toISOString();
  const query = `repo:${config.owner}/${config.repo} is:issue is:closed closed:>=${since}`;

  log(
    `🔍 Searching for issues closed in the last ${config.lookbackDays} days...`,
  );
  try {
    const response = await github(
      "GET",
      `/search/issues?q=${encodeURIComponent(query)}&per_page=100`,
    );
    const issues = response.items || [];
    log(`   Found ${issues.length} closed issues`);
    return issues;
  } catch (err) {
    error(`Failed to fetch closed issues: ${err.message}`);
    return [];
  }
}

/**
 * Extract issue numbers from PR body (Closes #123, Resolves #456, etc.)
 */
function extractLinkedIssues(body) {
  if (!body) return [];
  const regex = /(?:Closes|Resolves|Fixes|Close|Resolve|Fix)\s+#(\d+)/gi;
  const issues = [];
  let match;
  while ((match = regex.exec(body)) !== null) {
    issues.push(parseInt(match[1], 10));
  }
  return [...new Set(issues)]; // Deduplicate
}

/**
 * Allocate item to milestone
 */
async function allocateToMilestone(itemType, number, milestone) {
  if (config.dryRun) {
    log(
      `   [DRY-RUN] Would allocate ${itemType} #${number} to milestone #${milestone.number}`,
    );
    return true;
  }

  try {
    const path = `/repos/${config.owner}/${config.repo}/${itemType}s/${number}`;
    await github("PATCH", path, { milestone: milestone.number });
    log(
      `   ✅ Allocated ${itemType} #${number} to milestone #${milestone.number}`,
    );
    return true;
  } catch (err) {
    error(`   Failed to allocate ${itemType} #${number}: ${err.message}`);
    stats.errors.push(`${itemType}#${number}: ${err.message}`);
    return false;
  }
}

/**
 * Process and allocate merged PRs
 */
async function processMergedPRs(prs, milestone) {
  log("\n📤 Processing merged PRs...");
  stats.prsProcessed = prs.length;

  for (const pr of prs) {
    const alreadyAllocated =
      pr.milestone && pr.milestone.number === milestone.number;
    if (alreadyAllocated) {
      log(`   ⏭️  #${pr.number} already allocated to this milestone, skipping`);
      continue;
    }

    const success = await allocateToMilestone("pull", pr.number, milestone);
    if (success) stats.prAllocated++;

    // Also allocate linked issues
    const linkedIssues = extractLinkedIssues(pr.body);
    if (linkedIssues.length > 0) {
      log(
        `   📎 Found ${linkedIssues.length} linked issue(s): ${linkedIssues.join(", ")}`,
      );
      for (const issueNum of linkedIssues) {
        await allocateToMilestone("issue", issueNum, milestone);
      }
    }
  }
}

/**
 * Process and allocate closed issues
 */
async function processClosedIssues(issues, milestone) {
  log("\n⏹️  Processing closed issues...");
  stats.issuesProcessed = issues.length;

  for (const issue of issues) {
    // Skip PRs (they'll be handled separately)
    if (issue.pull_request) {
      log(
        `   ⏭️  #${issue.number} is a PR, skipping (will be processed in PR phase)`,
      );
      continue;
    }

    const alreadyAllocated =
      issue.milestone && issue.milestone.number === milestone.number;
    if (alreadyAllocated) {
      log(
        `   ⏭️  #${issue.number} already allocated to this milestone, skipping`,
      );
      continue;
    }

    const success = await allocateToMilestone("issue", issue.number, milestone);
    if (success) stats.issuesAllocated++;
  }
}

/**
 * Logging helpers
 */
function log(msg) {
  console.log(msg);
}

function error(msg) {
  console.error(`❌ ${msg}`);
}

function verbose(msg) {
  if (config.verbose) {
    console.log(`   ${msg}`);
  }
}

/**
 * Print summary report
 */
function printSummary() {
  console.log("\n" + "=".repeat(60));
  console.log("📊 ALLOCATION SUMMARY");
  console.log("=".repeat(60));
  console.log(`Milestones found:     ${stats.milestonesFound}`);
  console.log(
    `Current milestone:    #${stats.currentMilestone?.number} "${stats.currentMilestone?.title}"`,
  );
  console.log(`Dry-run mode:         ${config.dryRun ? "YES" : "NO"}`);
  console.log(`\nPRs processed:        ${stats.prsProcessed}`);
  console.log(`PRs allocated:        ${stats.prAllocated}`);
  console.log(`Issues processed:     ${stats.issuesProcessed}`);
  console.log(`Issues allocated:     ${stats.issuesAllocated}`);

  if (stats.errors.length > 0) {
    console.log(`\n⚠️  Errors (${stats.errors.length}):`);
    stats.errors.forEach((err) => console.log(`   - ${err}`));
  }

  console.log("=".repeat(60));
}

/**
 * Main execution
 */
async function main() {
  console.log("🚀 PR/Issue → Milestone Allocation Tool\n");
  console.log(`Repository: ${config.owner}/${config.repo}`);
  console.log(`Look-back period: ${config.lookbackDays} days`);
  console.log(`Dry-run: ${config.dryRun ? "✅ YES" : "❌ NO (will modify)"}\n`);

  try {
    // Get current milestone
    let milestone = config.forceMilestone
      ? { number: config.forceMilestone }
      : await getOpenMilestones();

    if (!milestone) {
      console.log("❌ No milestone available for allocation");
      process.exit(1);
    }

    stats.currentMilestone = milestone;

    // Fetch and process merged PRs
    const mergedPRs = await getMergedPRs();
    await processMergedPRs(mergedPRs, milestone);

    // Fetch and process closed issues
    const closedIssues = await getClosedIssues();
    await processClosedIssues(closedIssues, milestone);

    // Print summary
    printSummary();

    if (config.dryRun) {
      console.log("✅ Dry-run completed. No changes were made.");
    } else {
      console.log("✅ Allocation completed successfully!");
    }
  } catch (err) {
    console.error(`\n❌ Fatal error: ${err.message}`);
    process.exit(1);
  }
}

main();
