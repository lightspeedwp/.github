#!/usr/bin/env node

/**
 * Apply Issue Triage Improvements
 *
 * This script batch-updates issues with:
 * - Missing area labels
 * - Assignee (ashleyshaw)
 * - Milestones
 *
 * Requires GitHub CLI (gh) to be installed and authenticated.
 *
 * Usage:
 *   npm run triage:apply [--issue <number>] [--dry-run]
 */

import { execSync } from "child_process";
import * as fs from "fs";

const CONFIG = {
  owner: "lightspeedwp",
  repo: ".github",
  assignee: "ashleyshaw",
  dryRun: process.argv.includes("--dry-run"),
  issueNumber: null,
};

for (let i = 0; i < process.argv.length; i++) {
  if (process.argv[i] === "--issue" && process.argv[i + 1]) {
    CONFIG.issueNumber = parseInt(process.argv[i + 1], 10);
  }
}

const LABEL_SUGGESTIONS = {
  2160: "area:security",
  2151: "area:tests",
  2150: "area:tests",
  2149: "area:tests",
  2146: "area:tests",
  2110: "area:documentation",
};

const MILESTONE_MAP = {
  "priority:critical": "Critical Issues",
  "priority:high": "High Priority",
  "priority:important": "High Priority",
  "priority:normal": "Backlog",
  "priority:low": "Backlog",
  "type:epic": "Epics",
  "type:bug": "Bug Fixes",
  "type:feature": "Enhancements",
  "type:code-refactor": "Technical Debt",
};

/**
 * Execute gh command safely
 */
function gh(args) {
  if (CONFIG.dryRun) {
    console.log(`  [DRY] gh ${args}`);
    return "";
  }
  try {
    return execSync(`gh ${args}`, { encoding: "utf8" }).trim();
  } catch (err) {
    console.error(`  ❌ Error: ${err.message}`);
    throw err;
  }
}

/**
 * Get issue details
 */
function getIssue(number) {
  const result = gh(
    `issue view ${number} --repo ${CONFIG.owner}/${CONFIG.repo} --json number,title,labels,assignee,milestone`,
  );
  return JSON.parse(result);
}

/**
 * Add label to issue
 */
function addLabel(number, label) {
  console.log(`    Adding label: ${label}`);
  gh(
    `issue edit ${number} --repo ${CONFIG.owner}/${CONFIG.repo} --add-label "${label}"`,
  );
}

/**
 * Assign issue
 */
function assignIssue(number, assignee) {
  console.log(`    Assigning to: ${assignee}`);
  gh(
    `issue edit ${number} --repo ${CONFIG.owner}/${CONFIG.repo} --assignee "${assignee}"`,
  );
}

/**
 * Add milestone
 */
function addMilestone(number, milestone) {
  console.log(`    Adding milestone: ${milestone}`);
  gh(
    `issue edit ${number} --repo ${CONFIG.owner}/${CONFIG.repo} --milestone "${milestone}"`,
  );
}

/**
 * Determine milestone for issue
 */
function determineMilestone(labels) {
  // Check priority first
  for (const label of labels) {
    if (MILESTONE_MAP[label]) {
      return MILESTONE_MAP[label];
    }
  }
  return "Backlog";
}

/**
 * Process single issue
 */
async function processIssue(number) {
  console.log(`\nProcessing #${number}`);

  const issue = getIssue(number);
  const currentLabels = issue.labels.map((l) => l.name);

  // Add missing area label if known
  if (LABEL_SUGGESTIONS[number]) {
    if (!currentLabels.includes(LABEL_SUGGESTIONS[number])) {
      addLabel(number, LABEL_SUGGESTIONS[number]);
    } else {
      console.log(`    ✓ Label already present: ${LABEL_SUGGESTIONS[number]}`);
    }
  }

  // Assign if not already assigned
  if (!issue.assignee || issue.assignee.login !== CONFIG.assignee) {
    assignIssue(number, CONFIG.assignee);
  } else {
    console.log(`    ✓ Already assigned to: ${issue.assignee.login}`);
  }

  // Add milestone if missing
  if (!issue.milestone) {
    const milestone = determineMilestone(currentLabels);
    addMilestone(number, milestone);
  } else {
    console.log(`    ✓ Milestone already set: ${issue.milestone.title}`);
  }
}

/**
 * Main execution
 */
async function main() {
  console.log("\n🔧 Applying Issue Triage Improvements");
  console.log(`Repository: ${CONFIG.owner}/${CONFIG.repo}`);
  console.log(`Mode: ${CONFIG.dryRun ? "DRY RUN" : "LIVE"}`);
  console.log("═".repeat(80));

  // Load search results
  const searchResultPath =
    "/root/.claude/projects/-home-user--github/ba532398-a612-5d39-b1a5-e94f07c8bd95/tool-results/mcp-github-search_issues-1787966696216.txt";
  const searchData = JSON.parse(fs.readFileSync(searchResultPath, "utf8"));
  const issues = searchData.items;

  const issuesToProcess = CONFIG.issueNumber
    ? issues.filter((i) => i.number === CONFIG.issueNumber)
    : issues;

  console.log(`\nProcessing ${issuesToProcess.length} issues...`);

  for (const issue of issuesToProcess) {
    try {
      await processIssue(issue.number);
    } catch (err) {
      console.error(`Failed to process #${issue.number}:`, err.message);
    }
  }

  console.log("\n" + "═".repeat(80));
  console.log("✅ Complete!");
  if (CONFIG.dryRun) {
    console.log(
      "💡 Review output above, then run without --dry-run to apply changes",
    );
  }
}

main().catch((err) => {
  console.error("❌ Fatal error:", err.message);
  process.exit(1);
});
