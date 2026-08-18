#!/usr/bin/env node

/**
 * PR Triage Orchestrator
 *
 * Comprehensive PR metadata management tool that:
 * - Identifies PRs needing review/changelog labels
 * - Validates PR descriptions and linked issues
 * - Creates reciprocal linked issues if missing
 * - Adds missing labels, assignees, milestones, and project assignments
 * - Handles recently merged PRs requiring changelog documentation
 *
 * Usage:
 *   node pr-triage-orchestrator.js --dry-run [--limit=N]
 *   node pr-triage-orchestrator.js --auto [--assignee=ID] [--milestone=ID]
 *
 * Flags:
 *   --dry-run              Preview changes without applying (default)
 *   --auto                 Apply all changes automatically
 *   --limit=N              Maximum PRs to process (default: 999999)
 *   --assignee=LOGIN       GitHub username to assign (default: ashleyshaw)
 *   --milestone=NAME       Milestone name (default: v1.0)
 *   --project=NUMBER       Project number (default: from LS_PROJECT_NUMBER)
 *   --merged-days=N        Include merged PRs from past N days (default: 14)
 *   --verbose              Show detailed output
 */

import { Octokit } from "octokit";
import fs from "fs";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const OWNER = "lightspeedwp";
const REPO = ".github";

// Parse command-line arguments
const args = process.argv.slice(2);
const mode = args.includes("--auto") ? "auto" : "dry-run";
const verbose = args.includes("--verbose");

const config = {
  assignee:
    args.find((a) => a.startsWith("--assignee="))?.split("=")[1] ||
    "ashleyshaw",
  milestone:
    args.find((a) => a.startsWith("--milestone="))?.split("=")[1] || "v1.0",
  projectNumber: parseInt(
    args.find((a) => a.startsWith("--project="))?.split("=")[1] ||
      process.env.LS_PROJECT_NUMBER ||
      "33",
  ),
  limit: parseInt(
    args.find((a) => a.startsWith("--limit="))?.split("=")[1] || "999999",
  ),
  mergedDays: parseInt(
    args.find((a) => a.startsWith("--merged-days="))?.split("=")[1] || "14",
  ),
};

console.log(`🔍 PR Triage Orchestrator`);
console.log(
  `📋 Mode: ${mode} | Assignee: ${config.assignee} | Milestone: ${config.milestone}`,
);
console.log(`⏱️  Including merged PRs from past ${config.mergedDays} days\n`);

/**
 * Fetch PRs needing review or changelog labels
 */
async function fetchPRsNeedingTriage() {
  const prs = [];
  const statusLabels = ["status:needs-review", "meta:needs-changelog"];
  const mergedSince = new Date(
    Date.now() - config.mergedDays * 24 * 60 * 60 * 1000,
  )
    .toISOString()
    .split("T")[0];

  try {
    // Fetch open PRs with status labels
    for (const label of statusLabels) {
      const response = await octokit.rest.pulls.list({
        owner: OWNER,
        repo: REPO,
        labels: label,
        state: "open",
        per_page: 100,
      });
      prs.push(...response.data.slice(0, config.limit - prs.length));
    }

    // Fetch recently merged PRs with meta:needs-changelog
    const mergedResponse = await octokit.rest.pulls.list({
      owner: OWNER,
      repo: REPO,
      labels: "meta:needs-changelog",
      state: "closed",
      per_page: 100,
    });

    for (const pr of mergedResponse.data) {
      if (pr.merged_at && new Date(pr.merged_at) > new Date(mergedSince)) {
        if (!prs.find((p) => p.number === pr.number)) {
          prs.push(pr);
        }
      }
    }

    return prs.slice(0, config.limit);
  } catch (error) {
    console.error("❌ Error fetching PRs:", error.message);
    process.exit(1);
  }
}

/**
 * Check if PR has linked issue
 */
async function getPRLinkedIssues(prNumber) {
  try {
    const response = await octokit.rest.issues.get({
      owner: OWNER,
      repo: REPO,
      issue_number: prNumber,
    });

    const body = response.data.body || "";
    const issueRegex = /#(\d+)/g;
    const matches = body.matchAll(issueRegex);
    const linkedIssues = Array.from(matches).map((m) => parseInt(m[1]));

    return linkedIssues;
  } catch (error) {
    console.error(`Error fetching PR #${prNumber}:`, error.message);
    return [];
  }
}

/**
 * Create a reciprocal linked issue for a PR
 */
async function createLinkedIssue(pr) {
  try {
    const issueTitle = `[Triage] ${pr.title}`;
    const issueBody = `## Related PR\n\nThis issue is linked to PR #${pr.number}.\n\n---\n\n_Created by PR Triage Orchestrator_`;

    const response = await octokit.rest.issues.create({
      owner: OWNER,
      repo: REPO,
      title: issueTitle,
      body: issueBody,
      labels: ["status:needs-triage", "type:task"],
      assignees: [config.assignee],
    });

    if (verbose) {
      console.log(
        `   ✅ Created issue #${response.data.number} for PR #${pr.number}`,
      );
    }

    return response.data.number;
  } catch (error) {
    console.error(
      `   ❌ Failed to create issue for PR #${pr.number}:`,
      error.message,
    );
    return null;
  }
}

/**
 * Update PR with missing metadata
 */
async function updatePRMetadata(pr, _linkedIssueNumber = null) {
  const updates = [];

  try {
    // Check for assignee
    if (!pr.assignees || pr.assignees.length === 0) {
      updates.push(`assignee: ${config.assignee}`);
    }

    // Check for milestone
    if (!pr.milestone) {
      updates.push(`milestone: ${config.milestone}`);
    }

    // Check for labels
    const labels = pr.labels?.map((l) => l.name) || [];
    const hasReviewLabel = labels.includes("status:needs-review");
    const hasChangelogLabel = labels.includes("meta:needs-changelog");

    if (!hasReviewLabel && pr.state === "open") {
      updates.push(`label: status:needs-review`);
    }

    if (!hasChangelogLabel && pr.merged_at) {
      updates.push(`label: meta:needs-changelog`);
    }

    if (mode === "auto") {
      // Update assignee
      if (!pr.assignees || pr.assignees.length === 0) {
        await octokit.rest.issues.addAssignees({
          owner: OWNER,
          repo: REPO,
          issue_number: pr.number,
          assignees: [config.assignee],
        });
      }

      // Update milestone
      if (!pr.milestone) {
        // First fetch milestone ID
        const milestones = await octokit.rest.issues.listMilestones({
          owner: OWNER,
          repo: REPO,
        });
        const targetMilestone = milestones.data.find(
          (m) => m.title === config.milestone,
        );
        if (targetMilestone) {
          await octokit.rest.issues.update({
            owner: OWNER,
            repo: REPO,
            issue_number: pr.number,
            milestone: targetMilestone.number,
          });
        }
      }

      // Add labels
      const labelsToAdd = [];
      if (!hasReviewLabel && pr.state === "open")
        labelsToAdd.push("status:needs-review");
      if (!hasChangelogLabel && pr.merged_at)
        labelsToAdd.push("meta:needs-changelog");

      if (labelsToAdd.length > 0) {
        await octokit.rest.issues.addLabels({
          owner: OWNER,
          repo: REPO,
          issue_number: pr.number,
          labels: labelsToAdd,
        });
      }
    }

    return updates;
  } catch (error) {
    console.error(`   ❌ Error updating PR #${pr.number}:`, error.message);
    return [];
  }
}

/**
 * Process PR triage
 */
async function triagePRs(prs) {
  const summary = {
    totalProcessed: 0,
    needsReview: [],
    needsChangelog: [],
    needsIssueLink: [],
    needsMetadata: [],
    created: [],
    updated: [],
    errors: [],
  };

  console.log(`\n📝 Triaging ${prs.length} PRs...\n`);

  for (let i = 0; i < prs.length; i++) {
    const pr = prs[i];
    const progress = `[${i + 1}/${prs.length}]`;

    try {
      const labels = pr.labels?.map((l) => l.name) || [];
      const linkedIssues = await getPRLinkedIssues(pr.number);
      let newIssueNumber = null;

      // Check what this PR needs
      if (labels.includes("status:needs-review") && pr.state === "open") {
        summary.needsReview.push(pr.number);
      }

      if (labels.includes("meta:needs-changelog") && pr.merged_at) {
        summary.needsChangelog.push(pr.number);
      }

      if (linkedIssues.length === 0 && pr.state === "open") {
        summary.needsIssueLink.push(pr.number);
        if (mode === "auto") {
          newIssueNumber = await createLinkedIssue(pr);
          if (newIssueNumber) {
            summary.created.push({ pr: pr.number, issue: newIssueNumber });
          }
        }
      }

      // Check metadata (assignee, milestone, labels)
      const updates = await updatePRMetadata(pr, newIssueNumber);
      if (updates.length > 0) {
        summary.needsMetadata.push(pr.number);
        summary.updated.push({ pr: pr.number, updates });
      }

      summary.totalProcessed++;

      if (verbose) {
        console.log(
          `${progress} #${pr.number}: ${pr.title.substring(0, 50)}...`,
        );
        if (labels.includes("status:needs-review"))
          console.log(`   - Needs review`);
        if (labels.includes("meta:needs-changelog"))
          console.log(`   - Needs changelog`);
        if (linkedIssues.length === 0) console.log(`   - No linked issue`);
        if (updates.length > 0)
          console.log(`   - Updates: ${updates.join(", ")}`);
        console.log("");
      }
    } catch (error) {
      summary.errors.push({ pr: pr.number, error: error.message });
      console.error(`${progress} #${pr.number} - Error: ${error.message}`);
    }
  }

  return summary;
}

/**
 * Display summary report
 */
function displaySummary(summary) {
  console.log("\n" + "=".repeat(70));
  console.log("📊 PR TRIAGE SUMMARY");
  console.log("=".repeat(70));

  console.log(`\n📈 Statistics:`);
  console.log(`   Total PRs processed: ${summary.totalProcessed}`);
  console.log(`   PRs needing review:  ${summary.needsReview.length}`);
  console.log(`   PRs needing changelog: ${summary.needsChangelog.length}`);
  console.log(`   PRs needing issue link: ${summary.needsIssueLink.length}`);
  console.log(`   PRs needing metadata: ${summary.needsMetadata.length}`);

  if (summary.created.length > 0) {
    console.log(`\n✅ Created Issues:`);
    summary.created.forEach((item) => {
      console.log(`   PR #${item.pr} → Issue #${item.issue}`);
    });
  }

  if (summary.updated.length > 0) {
    console.log(`\n📝 Metadata Updates:`);
    summary.updated.slice(0, 5).forEach((item) => {
      console.log(`   PR #${item.pr}: ${item.updates.join(", ")}`);
    });
    if (summary.updated.length > 5) {
      console.log(`   ... and ${summary.updated.length - 5} more`);
    }
  }

  if (summary.errors.length > 0) {
    console.log(`\n❌ Errors: ${summary.errors.length} PRs failed`);
    summary.errors.slice(0, 3).forEach((item) => {
      console.log(`   PR #${item.pr}: ${item.error}`);
    });
  }

  console.log("\n" + "=".repeat(70));

  if (mode === "dry-run") {
    console.log(`\n💡 Preview mode: Run with --auto to apply changes`);
  }
}

/**
 * Save report
 */
function saveReport(summary) {
  const timestamp = new Date()
    .toISOString()
    .replace(/[:.]/g, "-")
    .split("-")
    .slice(0, -1)
    .join("-");
  const filename = `pr-triage-${timestamp}.json`;
  const filepath = `reports/${filename}`;

  try {
    if (!fs.existsSync("reports")) {
      fs.mkdirSync("reports", { recursive: true });
    }

    fs.writeFileSync(filepath, JSON.stringify(summary, null, 2));
    console.log(`📄 Report saved to: ${filepath}`);
  } catch (error) {
    console.warn(`⚠️  Could not save report: ${error.message}`);
  }
}

/**
 * Main execution
 */
async function main() {
  try {
    const prs = await fetchPRsNeedingTriage();

    if (prs.length === 0) {
      console.log("ℹ️  No PRs found needing triage");
      process.exit(0);
    }

    const summary = await triagePRs(prs);
    displaySummary(summary);
    saveReport(summary);

    if (summary.errors.length > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error("❌ Fatal error:", error.message);
    process.exit(1);
  }
}

main();

export { triagePRs };
