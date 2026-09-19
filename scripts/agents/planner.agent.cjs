/**
 * planner.agent.cjs
 *
 * Lightweight placeholder implementation to keep the planner workflow healthy.
 * Currently runs in dry-run mode and logs context; extend with real automation
 * when the planner specification is implemented.
 * @module scripts/agents/planner.agent.cjs
 * @see agents/task-planner.agent.md
 */

const path = require("path");

function log(message) {
  const timestamp = new Date().toISOString();
  console.log(`[planner] ${timestamp} ${message}`);
}

async function runPlanner(options = {}) {
  const { dryRun = true } = options;
  const eventName = process.env.GITHUB_EVENT_NAME || "local";
  const repoRoot = path.resolve(__dirname, "..", "..");

  log(`Starting planner agent (${dryRun ? "dry-run" : "apply"})`);
  log(`Context: event=${eventName}, repoRoot=${repoRoot}`);

  if (!dryRun) {
    // TODO: Implement planner automation (context analysis, sequencing, scheduling) before leaving dry-run.
    log("No write actions implemented yet; exiting without changes.");
  }

  log("Planner agent finished without errors.");
}

module.exports = {
  runPlanner,
};

if (require.main === module) {
  const dryRun = !process.argv.includes("--apply");
  runPlanner({ dryRun }).catch((error) => {
    console.error("[planner] fatal error", error);
    process.exit(1);
  });
}
