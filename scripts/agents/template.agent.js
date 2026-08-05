/**
 * Template agent stub that demonstrates the minimal structure agents should follow.
 * Adjust this placeholder per ../../../.github/agents/template.agent.md when building new automation.
 * @module scripts/agents/template.agent.js
 * @see ../../../.github/agents/template.agent.md
 */

// last_updated: 2025-10-23

// TODO: Expand this scaffold to exercise the full template-building process defined in the spec.

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
  runAgent({ dryRun }).catch((err) => (console.error(err), process.exit(1)));
}
