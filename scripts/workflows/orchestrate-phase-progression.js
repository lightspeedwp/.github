#!/usr/bin/env node

/**
 * Orchestrate Phase Progression Workflow Runner
 * Invoked by GitHub Actions workflows to sync labels and progress phases
 * Usage: node orchestrate-phase-progression.js --event <type> --issue <number> [--pr <number>]
 */

const fs = require("fs");
const path = require("path");
const {
  syncLabelsOnEvent,
} = require("../../scripts/automation/handlers/sync-labels-on-event");
const {
  orchestratePhaseProgression,
  extractLinkedIssues,
} = require("../../scripts/automation/handlers/orchestrate-phase-progression");

// Parse command line arguments
const args = process.argv.slice(2);
const getArg = (key) => {
  const index = args.indexOf(`--${key}`);
  return index >= 0 ? args[index + 1] : null;
};

const eventType = getArg("event");
const issueNumber = parseInt(getArg("issue") || "0", 10);
const prNumber = parseInt(getArg("pr") || "0", 10);
const prBody = getArg("pr-body") || "";

if (!eventType || !issueNumber) {
  console.error(
    "Usage: node orchestrate-phase-progression.js --event <type> --issue <number>",
  );
  console.error("Optional: --pr <number> --pr-body <text>");
  process.exit(1);
}

/**
 * Main orchestration function
 */
async function main() {
  try {
    console.log(`\n📋 Orchestrating Phase Progression`);
    console.log(`   Event: ${eventType}`);
    console.log(`   Issue: #${issueNumber}`);
    if (prNumber) console.log(`   PR: #${prNumber}`);

    // For this implementation, we'll use mock GitHub data
    // In a real workflow, this would fetch from GitHub API
    const mockIssue = {
      number: issueNumber,
      title: `Issue #${issueNumber}`,
      body: "",
      labels: [],
    };

    // Handle issue event
    if (eventType.startsWith("issue")) {
      console.log("\n🏷️  Syncing labels on issue event...");
      const result = syncLabelsOnEvent(mockIssue, eventType, {
        dryRun: false,
      });

      console.log("\nLabel Sync Result:");
      console.log(`  Success: ${result.success}`);
      console.log(
        `  Current Labels: ${result.currentLabels.join(", ") || "none"}`,
      );
      if (result.suggestedChanges.length > 0) {
        console.log(
          `  Suggested Changes: ${result.suggestedChanges.map((c) => c.label).join(", ")}`,
        );
      }
      if (result.conflicts.length > 0) {
        console.log(`  Conflicts: ${result.conflicts.join(", ")}`);
      }

      if (!result.success) {
        console.error("\n❌ Label sync failed");
        process.exit(1);
      }
    }

    // Handle PR event
    if (eventType.startsWith("pr")) {
      console.log("\n📊 Orchestrating phase progression from PR event...");

      // Extract linked issues
      const linkedIssues = extractLinkedIssues(prBody);
      if (linkedIssues.length === 0) {
        console.log("ℹ️  No linked issues found in PR body");
        return;
      }

      console.log(`   Linked Issues: ${linkedIssues.join(", ")}`);

      // Determine trigger
      let trigger = "PR opened";
      if (eventType === "pr-merged") {
        trigger = "PR merged";
      }

      console.log(`   Trigger: ${trigger}`);

      // For each linked issue, attempt phase progression
      for (const linkedIssue of linkedIssues) {
        console.log(`\n   Processing issue #${linkedIssue}...`);

        const mockLinkedIssue = {
          number: linkedIssue,
          title: `Issue #${linkedIssue}`,
          body: "",
          labels: [],
        };

        const result = orchestratePhaseProgression(mockLinkedIssue, trigger, {
          dryRun: false,
        });

        console.log(`   Current Phase: ${result.currentPhaseLabel || "none"}`);
        console.log(
          `   Next Phase: ${result.nextPhaseLabel || "no progression"}`,
        );

        if (result.progression.length > 0) {
          console.log(
            `   ✅ Progression: ${result.progression[0].from} → ${result.progression[0].to}`,
          );
        }

        if (result.errors.length > 0) {
          console.error(`   ❌ Errors: ${result.errors.join(", ")}`);
        }
      }
    }

    console.log("\n✅ Phase progression orchestration complete\n");
  } catch (error) {
    console.error("\n❌ Error during phase progression orchestration:");
    console.error(error.message);
    process.exit(1);
  }
}

main();
