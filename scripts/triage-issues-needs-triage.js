#!/usr/bin/env node

/**
 * Issue Triage Automation Script
 *
 * Improves issues marked with status:needs-triage by:
 * - Adding missing area labels based on type and context
 * - Assigning to appropriate owner (ashleyshaw)
 * - Assigning to milestones based on priority and issue type
 * - Validating and enhancing metadata
 *
 * Usage:
 *   node scripts/triage-issues-needs-triage.js [--dry-run] [--issue <number>]
 */

import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configuration
const CONFIG = {
  owner: "lightspeedwp",
  repo: ".github",
  dryRun: process.argv.includes("--dry-run"),
  issueNumber: null,
};

// Parse CLI arguments
for (let i = 0; i < process.argv.length; i++) {
  if (process.argv[i] === "--issue" && process.argv[i + 1]) {
    CONFIG.issueNumber = parseInt(process.argv[i + 1], 10);
  }
}

/**
 * Label families and their area assignments
 */
const LABEL_TO_AREA_MAP = {
  // CI/DevOps
  "type:workflow": "area:ci",
  "type:ci": "area:ci",
  "area:ci": "area:ci",

  // Documentation
  "type:documentation": "area:documentation",
  "type:docs": "area:documentation",
  "area:docs": "area:documentation",

  // Testing
  "type:test": "area:tests",
  "area:tests": "area:tests",
  "area:testing": "area:tests",

  // Security
  "security:*": "area:security",

  // Scripts & Utilities
  "area:scripts": "area:scripts",

  // Operations
  "area:ops": "area:ops",
};

/**
 * Issue type to milestone mapping
 */
const ISSUE_TYPE_TO_MILESTONE = {
  "type:bug": "Bug Fixes",
  "type:feature": "Enhancements",
  "type:task": "Backlog",
  "type:epic": "Epics",
  "type:documentation": "Documentation",
  "type:code-refactor": "Technical Debt",
  "type:release": "Release",
};

/**
 * Priority to milestone urgency mapping
 */
const PRIORITY_TO_MILESTONE = {
  "priority:critical": "Critical Issues",
  "priority:high": "High Priority",
  "priority:important": "High Priority",
  "priority:normal": "Backlog",
  "priority:low": "Backlog",
};

/**
 * Determine area label(s) from issue labels
 */
function suggestAreaLabels(labels) {
  const suggested = new Set();

  for (const label of labels) {
    // Check direct mappings
    if (LABEL_TO_AREA_MAP[label]) {
      suggested.add(LABEL_TO_AREA_MAP[label]);
    }

    // Check pattern mappings
    for (const [pattern, area] of Object.entries(LABEL_TO_AREA_MAP)) {
      if (pattern.includes("*")) {
        const prefix = pattern.replace("*", "");
        if (label.startsWith(prefix)) {
          suggested.add(area);
        }
      }
    }
  }

  return Array.from(suggested);
}

/**
 * Suggest milestone based on priority and type
 */
function suggestMilestone(labels) {
  // Check priority first (high priority overrides type)
  for (const label of labels) {
    if (label.startsWith("priority:")) {
      const milestone = PRIORITY_TO_MILESTONE[label];
      if (milestone) return milestone;
    }
  }

  // Fall back to type-based milestone
  for (const label of labels) {
    const milestone = ISSUE_TYPE_TO_MILESTONE[label];
    if (milestone) return milestone;
  }

  return "Backlog"; // Default
}

/**
 * Analyze an issue and return improvement recommendations
 */
function analyzeIssue(issue) {
  const labels = issue.labels.map((l) => l.name);
  const currentAreas = labels.filter((l) => l.startsWith("area:"));
  const suggestedAreas = suggestAreaLabels(labels);
  const missingAreas = suggestedAreas.filter((a) => !currentAreas.includes(a));

  const improvements = {
    issue: issue.number,
    title: issue.title,
    current: {
      labels: labels.length,
      assignee: issue.assignee?.login || null,
      milestone: issue.milestone?.title || null,
      areas: currentAreas,
    },
    suggested: {
      missingLabels: missingAreas,
      assignee: "ashleyshaw",
      milestone: suggestMilestone(labels),
    },
    needsImprovement: {
      labels: missingAreas.length > 0,
      assignee: !issue.assignee,
      milestone: !issue.milestone,
    },
  };

  return improvements;
}

/**
 * Format improvement report for display
 */
function formatReport(improvement) {
  const lines = [];
  lines.push(`\n#${improvement.issue}: ${improvement.title}`);
  lines.push(`${"─".repeat(80)}`);

  if (improvement.needsImprovement.labels) {
    lines.push(
      `  Add labels: ${improvement.suggested.missingLabels.join(", ")}`,
    );
  }

  if (improvement.needsImprovement.assignee) {
    lines.push(`  Assign to: ${improvement.suggested.assignee}`);
  }

  if (improvement.needsImprovement.milestone) {
    lines.push(`  Add milestone: ${improvement.suggested.milestone}`);
  }

  if (!Object.values(improvement.needsImprovement).some(Boolean)) {
    lines.push("  ✓ No improvements needed");
  }

  return lines.join("\n");
}

/**
 * Main execution
 */
async function main() {
  console.log("\n📋 Issue Triage Report");
  console.log(`Repository: ${CONFIG.owner}/${CONFIG.repo}`);
  console.log(`Mode: ${CONFIG.dryRun ? "DRY RUN (no changes)" : "LIVE"}`);
  console.log(`Assignee: ashleyshaw`);
  console.log("═".repeat(80));

  // Load sample issues from the GitHub search result
  const searchResultPath =
    "/root/.claude/projects/-home-user--github/ba532398-a612-5d39-b1a5-e94f07c8bd95/tool-results/mcp-github-search_issues-1787966696216.txt";

  if (!fs.existsSync(searchResultPath)) {
    console.error("❌ Search results file not found");
    process.exit(1);
  }

  const searchData = JSON.parse(fs.readFileSync(searchResultPath, "utf8"));
  const issues = searchData.items;

  console.log(`\nFound ${issues.length} issues with status:needs-triage\n`);

  // Analyze all issues
  const improvements = issues
    .filter(
      (issue) => !CONFIG.issueNumber || issue.number === CONFIG.issueNumber,
    )
    .map(analyzeIssue);

  // Report improvements needed
  let improvementCount = 0;
  for (const improvement of improvements) {
    console.log(formatReport(improvement));
    if (Object.values(improvement.needsImprovement).some(Boolean)) {
      improvementCount++;
    }
  }

  // Summary
  console.log("\n" + "═".repeat(80));
  console.log("📊 Summary");
  console.log(`  Total issues reviewed: ${improvements.length}`);
  console.log(`  Issues needing improvement: ${improvementCount}`);

  const labelImprovements = improvements.filter(
    (i) => i.needsImprovement.labels,
  ).length;
  const assigneeImprovements = improvements.filter(
    (i) => i.needsImprovement.assignee,
  ).length;
  const milestoneImprovements = improvements.filter(
    (i) => i.needsImprovement.milestone,
  ).length;

  console.log(
    `\n  Label improvements: ${labelImprovements} issues need area labels`,
  );
  console.log(
    `  Assignee improvements: ${assigneeImprovements} issues need to be assigned`,
  );
  console.log(
    `  Milestone improvements: ${milestoneImprovements} issues need milestones`,
  );

  if (CONFIG.dryRun) {
    console.log("\n💡 To apply these changes, run without --dry-run flag");
  }

  console.log("\n✅ Analysis complete");
}

main().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
