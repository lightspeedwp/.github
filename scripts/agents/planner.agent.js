/**
 * planner.agent.js
 *
 * Lightweight placeholder implementation to keep the planner workflow healthy.
 * Currently runs in dry-run mode and logs context; extend with real automation
 * when the planner specification is implemented.
 */

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function log(message) {
  const timestamp = new Date().toISOString();
  console.log(`[planner] ${timestamp} ${message}`);
}

/**
 * Run the planner agent in advisory mode.
 *
 * @param {object} options
 * @param {boolean} [options.dryRun=true] - When true, only logs contextual information.
 */
export async function runPlanner(options = {}) {
  const { dryRun = true } = options;
  const eventName = process.env.GITHUB_EVENT_NAME || "local";
  const repoRoot = path.resolve(__dirname, "..", "..");

  log(`Starting planner agent (${dryRun ? "dry-run" : "apply"})`);
  log(`Context: event=${eventName}, repoRoot=${repoRoot}`);

  if (!dryRun) {
    log("No write actions implemented yet; exiting without changes.");
  }

  log("Planner agent finished without errors.");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const dryRun = !process.argv.includes("--apply");
  runPlanner({ dryRun }).catch((error) => {
    console.error("[planner] fatal error", error);
    process.exit(1);
  });
}
