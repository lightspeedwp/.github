// Minimal agent stub (Node.js)
/* eslint-disable */
// last_updated: 2025-10-17

export async function runAgent(opts = { dryRun: true }) {
  const config = {
    model: process.env.AGENT_MODEL || "auto",
    instructionsPath: process.env.AGENT_INSTRUCTIONS || "./AGENTS.md",
    connectors: [], // TODO: register MCP connectors
  };

  if (opts.dryRun) {
    console.log("[agent] dry-run", config);
    return;
  }

  // TODO: load instructions, run a simple task, and print outputs
  console.log("[agent] TODO implement task runner");
}

if (import.meta.url === `file:///${process.argv[1]}`) {
  const dryRun = process.argv.includes("--dry-run");
  runAgent({ dryRun }).catch(err => (console.error(err), process.exit(1)));
}
