#!/usr/bin/env node
import { runLabelingAgent } from './labeling.agent.js';

/**
 * Run the labeling agent with label writes disabled when DRY_RUN is 'true'.
 * Set the process exit code if the agent rejects unexpectedly.
 */
async function main() {
  try {
    await runLabelingAgent({ dryRun: process.env.DRY_RUN === 'true' });
  } catch (error) {
    console.error(`[labeling.agent] Unhandled error: ${error.message}`);
    console.error(error.stack);
    process.exitCode = 1;
  }
}

main();
