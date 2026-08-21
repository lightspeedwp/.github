#!/usr/bin/env node

/**
 * Simple PR Label Update Script
 *
 * Updates status labels for PRs with meta:needs-changelog:
 * - PRs with review comments → status:under-review
 * - PRs with draft status → status:in-progress
 * - PRs open and awaiting initial review → status:needs-review
 *
 * Usage:
 *   node update-pr-labels-simple.js --dry-run [--limit=N]
 *   node update-pr-labels-simple.js --auto
 *
 * Flags:
 *   --dry-run              Preview changes (default)
 *   --auto                 Apply all changes
 *   --limit=N              Maximum PRs (default: 999999)
 *   --verbose              Show details
 */

import { Octokit } from "octokit";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const OWNER = "lightspeedwp";
const REPO = ".github";

// Parse args
const args = process.argv.slice(2);
const mode = args.includes("--auto") ? "auto" : "dry-run";
const verbose = args.includes("--verbose");
const limitArg = parseInt(
  args.find((a) => a.startsWith("--limit="))?.split("=")[1] || "999999",
);

/**
 * Determine next status based on PR attributes
 */
function determineStatus(pr) {
  if (pr.draft) return "status:in-progress";
  if (pr.state === "closed")
    return pr.merged_at ? "status:ready-for-changelog" : "status:closed";

  const labels = (pr.labels || []).map((l) => l.name);

  // If already has a detailed status label, keep it or check if needs update
  const existingStatus = labels.find((l) => l.startsWith("status:"));
  if (
    existingStatus &&
    existingStatus !== "status:needs-review" &&
    existingStatus !== "status:needs-changelog"
  ) {
    return existingStatus; // Keep existing specific status
  }

  // Default to needs-review for open PRs
  return "status:needs-review";
}

/**
 * Fetch and process PRs
 */
async function processPRs() {
  console.log(`📋 Simple PR Label Updater`);
  console.log(`🔧 Mode: ${mode}\n`);

  try {
    console.log("⏳ Fetching PRs with meta:needs-changelog...\n");

    const response = await octokit.rest.pulls.list({
      owner: OWNER,
      repo: REPO,
      state: "open",
      labels: ["meta:needs-changelog"],
      per_page: 100,
    });

    const prs = response.data.slice(0, limitArg);

    if (prs.length === 0) {
      console.log("ℹ️  No PRs found with meta:needs-changelog");
      return;
    }

    console.log(`✅ Found ${prs.length} open PRs\n`);

    const summary = {
      total: 0,
      preview: [],
      updated: 0,
      errors: 0,
    };

    for (const pr of prs) {
      const nextStatus = determineStatus(pr);
      const labels = (pr.labels || []).map((l) => l.name);

      if (verbose) {
        console.log(`#${pr.number}: ${pr.title.substring(0, 50)}`);
        console.log(
          `  Current: ${labels.filter((l) => l.startsWith("status:")).join(", ") || "(none)"}`,
        );
        console.log(`  Next: ${nextStatus}\n`);
      }

      summary.total++;
      summary.preview.push({
        number: pr.number,
        title: pr.title.substring(0, 60),
        next: nextStatus,
      });

      if (mode === "auto") {
        try {
          // Remove old status label if different
          const oldStatusLabel = labels.find((l) => l.startsWith("status:"));
          if (oldStatusLabel && oldStatusLabel !== nextStatus) {
            await octokit.rest.issues.removeLabel({
              owner: OWNER,
              repo: REPO,
              issue_number: pr.number,
              name: oldStatusLabel,
            });
          }

          // Add new status label if needed
          if (nextStatus && !labels.includes(nextStatus)) {
            await octokit.rest.issues.addLabels({
              owner: OWNER,
              repo: REPO,
              issue_number: pr.number,
              labels: [nextStatus],
            });
          }

          summary.updated++;
        } catch (error) {
          summary.errors++;
          console.error(`❌ Error updating PR #${pr.number}: ${error.message}`);
        }
      }
    }

    // Report
    console.log("\n" + "=".repeat(60));
    console.log("📊 Summary");
    console.log("=".repeat(60));
    console.log(`Total: ${summary.total}`);
    console.log(`Updated: ${summary.updated}`);
    console.log(`Errors: ${summary.errors}`);

    if (mode === "dry-run" && summary.preview.length > 0) {
      console.log(`\nChanges ready to apply:`);
      summary.preview.forEach((p) => {
        console.log(`  #${p.number} → ${p.next}`);
      });
      console.log(`\nRun with --auto to apply`);
    }

    console.log("=".repeat(60) + "\n");
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

// Export functions for testing
export { determineStatus, processPRs };

// Only run if this file is being executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  processPRs();
}
