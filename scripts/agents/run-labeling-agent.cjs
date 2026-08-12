#!/usr/bin/env node

async function main() {
  const { runLabelingAgent } = await import("./labeling.agent.js");

  await runLabelingAgent();
}

if (require.main === module) {
  main().catch((error) => {
    console.error(`[labeling.agent] Unhandled error: ${error.message}`);
    console.error(error.stack);
    process.exitCode = 1;
  });
}
