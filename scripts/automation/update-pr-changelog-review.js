#!/usr/bin/env node

/**
 * Update PR Changelog Review Status
 *
 * Processes all open PRs with meta:needs-changelog and status:needs-review labels:
 * - Fetches current PR status (reviews, merge status)
 * - Updates labels based on review progress
 * - Replaces status:needs-review with appropriate status based on review state
 *
 * Usage:
 *   node update-pr-changelog-review.js --dry-run [--limit=N]
 *   node update-pr-changelog-review.js --auto [--confidence=0.85]
 *   node update-pr-changelog-review.js --interactive
 *
 * Flags:
 *   --dry-run              Preview changes without applying (default)
 *   --auto                 Apply all changes automatically
 *   --interactive          Prompt before each change
 *   --limit=N              Maximum PRs to process (default: 999999)
 *   --confidence=N         Confidence threshold 0-1 (default: 0.85)
 *   --verbose              Show detailed output
 */

import { Octokit } from "octokit";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const OWNER = "lightspeedwp";
const REPO = ".github";

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
const verbose = args.includes("--verbose");

/**
 * Determine PR status based on review state
 */
function determinePRStatus(pr, reviews) {
  if (pr.merged_at) {
    return "merged";
  }

  if (pr.draft) {
    return "draft";
  }

  const approvalCount = reviews.filter((r) => r.state === "APPROVED").length;
  const changeRequestCount = reviews.filter(
    (r) => r.state === "CHANGES_REQUESTED",
  ).length;

  if (changeRequestCount > 0) {
    return "changes-requested";
  }

  if (approvalCount > 0) {
    return "approved";
  }

  if (reviews.length === 0) {
    return "awaiting-review";
  }

  return "reviewing";
}

/**
 * Get next status label based on PR status
 */
function getNextStatusLabel(status) {
  const statusMap = {
    merged: "status:ready-for-changelog",
    draft: "status:in-progress",
    "changes-requested": "status:needs-update",
    approved: "status:ready-to-merge",
    "awaiting-review": "status:needs-review",
    reviewing: "status:under-review",
  };

  return statusMap[status] || "status:needs-review";
}

/**
 * Fetch PR reviews (lightweight operation)
 */
async function fetchPRReviews(prNumber) {
  try {
    const reviewsResponse = await octokit.rest.pulls.listReviews({
      owner: OWNER,
      repo: REPO,
      pull_number: prNumber,
      per_page: 30,
    });

    return reviewsResponse.data || [];
  } catch (error) {
    return [];
  }
}

/**
 * Sleep for a given number of milliseconds
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Process single PR
 */
async function processPR(pr, index, total) {
  const prNumber = pr.number;
  const labels = (pr.labels || []).map((l) => l.name || l);

  // Add rate limiting - sleep between API calls
  if (index > 0 && index % 10 === 0) {
    await sleep(2000); // Sleep 2 seconds every 10 PRs
  }

  // Fetch reviews only
  const reviews = await fetchPRReviews(prNumber);

  // Determine current status
  const status = determinePRStatus(pr, reviews);

  // Get next status label
  const nextStatusLabel = getNextStatusLabel(status);

  // Determine what to remove and add
  const labelsToRemove = labels.filter(
    (l) => l.startsWith("status:") && l !== nextStatusLabel,
  );
  const labelsToAdd = !labels.includes(nextStatusLabel)
    ? [nextStatusLabel]
    : [];

  return {
    number: prNumber,
    title: pr.title,
    status,
    currentLabels: labels,
    labelsToRemove,
    labelsToAdd,
    nextStatusLabel,
    reviews: reviews.length,
    approvals: reviews.filter((r) => r.state === "APPROVED").length,
  };
}

/**
 * Apply PR updates via GitHub API
 */
async function applyPRUpdate(pr, update) {
  const prNumber = pr.number;

  try {
    // Remove old status labels if needed
    if (update.labelsToRemove.length > 0) {
      for (const label of update.labelsToRemove) {
        try {
          await octokit.rest.issues.removeLabel({
            owner: OWNER,
            repo: REPO,
            issue_number: prNumber,
            name: label,
          });
        } catch {
          // Label might not exist, continue
        }
      }
    }

    // Add new status labels
    if (update.labelsToAdd.length > 0) {
      await octokit.rest.issues.addLabels({
        owner: OWNER,
        repo: REPO,
        issue_number: prNumber,
        labels: update.labelsToAdd,
      });
    }

    return {
      status: "updated",
      labelsRemoved: update.labelsToRemove,
      labelsAdded: update.labelsToAdd,
    };
  } catch (error) {
    return {
      status: "error",
      error: error.message,
    };
  }
}

/**
 * Fetch all PRs with meta:needs-changelog label
 */
async function fetchPRsWithLabels() {
  const prs = [];
  let page = 1;
  const perPage = 50;
  let hasMore = true;

  try {
    while (hasMore && prs.length < limitArg) {
      if (verbose) {
        console.log(`⏳ Fetching page ${page}...`);
      }

      const response = await octokit.rest.pulls.list({
        owner: OWNER,
        repo: REPO,
        labels: ["meta:needs-changelog"],
        state: "open",
        per_page: perPage,
        page,
      });

      prs.push(...response.data.slice(0, limitArg - prs.length));

      if (response.data.length < perPage) {
        hasMore = false;
      } else {
        page++;
      }
    }

    if (verbose) {
      console.log(`✅ Fetched ${prs.length} PRs`);
    }

    return prs;
  } catch (error) {
    console.error("❌ Error fetching PRs:", error.message);
    process.exit(1);
  }
}

/**
 * Main execution
 */
async function main() {
  console.log(`📋 PR Changelog Review Status Updater`);
  console.log(`🔧 Mode: ${mode}\n`);

  try {
    const prs = await fetchPRsWithLabels();

    if (prs.length === 0) {
      console.log("ℹ️  No PRs found with meta:needs-changelog label");
      process.exit(0);
    }

    const summary = {
      total: 0,
      updated: 0,
      skipped: 0,
      errors: 0,
      preview: [],
    };

    console.log(`\n📝 Processing ${prs.length} PRs...\n`);

    for (let i = 0; i < prs.length; i++) {
      const pr = prs[i];
      const progress = `[${i + 1}/${prs.length}]`;

      try {
        const update = await processPR(pr, i, prs.length);
        summary.total++;

        if (verbose) {
          console.log(`${progress} #${update.number}`);
          console.log(`   Status: ${update.status}`);
          console.log(`   Next Label: ${update.nextStatusLabel}\n`);
        }

        if (mode === "dry-run") {
          summary.preview.push(update);
          console.log(
            `${progress} PREVIEW: #${update.number} → ${update.nextStatusLabel}`,
          );
        } else if (mode === "auto") {
          if (
            update.labelsToAdd.length > 0 ||
            update.labelsToRemove.length > 0
          ) {
            const result = await applyPRUpdate(pr, update);
            if (result.status === "updated") {
              summary.updated++;
            } else {
              summary.errors++;
            }
          }
        }
      } catch (error) {
        summary.errors++;
        if (verbose) {
          console.error(`   ❌ Error: ${error.message}`);
        }
      }
    }

    // Report
    console.log("\n" + "=".repeat(60));
    console.log("📊 SUMMARY REPORT");
    console.log("=".repeat(60));

    console.log(`\n📈 Statistics:`);
    console.log(`   Total processed:  ${summary.total}`);
    console.log(`   Total updated:    ${summary.updated}`);
    console.log(`   Total skipped:    ${summary.skipped}`);
    console.log(`   Total errors:     ${summary.errors}`);

    if (mode === "dry-run" && summary.preview.length > 0) {
      console.log(
        `\n🔍 Preview Mode: ${summary.preview.length} PRs ready for update`,
      );
      console.log(`\nRun with --auto to apply changes`);
    }

    console.log("\n" + "=".repeat(60) + "\n");

    process.exit(summary.errors > 0 ? 1 : 0);
  } catch (error) {
    console.error("❌ Fatal error:", error.message);
    process.exit(1);
  }
}

// Only run main() when this module is the direct entry point
// ESM-safe check: compare module's own URL to process.argv[1]
import { pathToFileURL } from 'node:url';
import { realpathSync } from 'node:fs';

const isMainModule = import.meta.url === pathToFileURL(realpathSync(process.argv[1])).href;

if (isMainModule) {
  // Validate GITHUB_TOKEN before running
  if (!process.env.GITHUB_TOKEN) {
    console.error('❌ Error: GITHUB_TOKEN environment variable is required');
    process.exit(1);
  }
  main();
}
