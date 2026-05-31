/**
 * planner.agent.js
 *
 * Lightweight placeholder implementation to keep the planner workflow healthy.
 * Currently runs in dry-run mode and logs context; extend with real automation
 * when the planner specification is implemented.
 * @module scripts/agents/planner.agent.js
 * @see agents/task-planner.agent.md
 */

import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function log(message) {
  const timestamp = new Date().toISOString();
  console.log(`[planner] ${timestamp} ${message}`);
}

async function runPlanner(options = {}) {
  const { dryRun = true } = options;

  try {
    const token = process.env.GITHUB_TOKEN;
    if (!token && !dryRun) {
      throw new Error(
        "Missing GITHUB_TOKEN environment variable (required for write operations)",
      );
    }

    const eventName = process.env.GITHUB_EVENT_NAME || "local";
    const repoRoot = path.resolve(__dirname, "..", "..");

    log(`Starting planner agent (${dryRun ? "dry-run" : "apply"})`);
    log(`Context: event=${eventName}, repoRoot=${repoRoot}`);

    if (!dryRun) {
      // TODO: Implement planner automation (context analysis, sequencing, scheduling) before leaving dry-run.
      log("No write actions implemented yet; exiting without changes.");
    }

    log("Planner agent finished without errors.");
  } catch (error) {
    console.error(`[planner] fatal error: ${error.message}`);
    process.exit(1);
  }
}

export { runPlanner };

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const dryRun = !process.argv.includes("--apply");
  runPlanner({ dryRun }).catch((error) => {
    console.error("[planner] fatal error", error);
    process.exit(1);
  });
}
