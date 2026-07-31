#!/usr/bin/env node
/**
 * @fileoverview Deprecated compatibility shim for the legacy project-meta-sync agent.
 *
 * The active automation now lives in:
 * - .github/workflows/project-meta-sync.yml
 * - .github/workflows/metadata-governance.yml
 * - scripts/agents/includes/derive-project-fields.cjs
 * - scripts/agents/includes/issue-pr-metadata.cjs
 *
 * This shim remains so older references fail soft and point to the live contract.
 */

const DEPRECATION_NOTE =
  "project-meta-sync.agent.js is deprecated. Use the workflow and helper scripts listed in this module docblock.";

async function run() {
  console.warn(`[DEPRECATED] ${DEPRECATION_NOTE}`);
  return {
    ok: true,
    deprecated: true,
    replacement: {
      workflow: ".github/workflows/project-meta-sync.yml",
      metadata_workflow: ".github/workflows/metadata-governance.yml",
      helper: "scripts/agents/includes/derive-project-fields.cjs",
      metadata_helper: "scripts/agents/includes/issue-pr-metadata.cjs",
    },
    message: DEPRECATION_NOTE,
  };
}

if (require.main === module) {
  run().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}

module.exports = run;
module.exports.run = run;
module.exports.DEPRECATION_NOTE = DEPRECATION_NOTE;
