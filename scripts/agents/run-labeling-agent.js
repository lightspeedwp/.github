#!/usr/bin/env node
import { runLabelingAgent } from './labeling.agent.js';

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
