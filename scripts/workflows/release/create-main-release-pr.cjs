#!/usr/bin/env node
/* eslint-env node */

const { process } = globalThis;
const {
  readEnv,
  log,
  runMain,
} = require("../shared/runtime.cjs");

async function main() {
  const version = readEnv("INPUT_VERSION", { required: true }).trim();
  const releaseBranch = readEnv("INPUT_RELEASE_BRANCH", {
    required: true,
  }).trim();
  const provider = readEnv("INPUT_PROVIDER", {
    defaultValue: "shell",
  })
    .toLowerCase()
    .trim();

  log(`Creating release PR from ${releaseBranch} to main for v${version}...`);
  log(`Provider: ${provider}`);

  // Dynamic import the ES module
  const {
    createMcpReleaseProvider,
    createShellReleaseProvider,
  } = await import("../../agents/release.agent.js");

  // Select provider
  let releaseProvider;
  if (provider === "mcp") {
    releaseProvider = createMcpReleaseProvider();
  } else {
    releaseProvider = createShellReleaseProvider();
  }

  try {
    // Create PR from release branch to main (Phase 2 of stacked PR flow)
    const prNumber = await releaseProvider.createReleasePRToMain(version, {
      dryRun: false,
      branch: releaseBranch,
    });

    log(`✓ Release PR (${releaseBranch} → main) created for v${version}`);
    console.log(`release_version=${version}`);
    console.log(`main_pr_number=${prNumber}`);
  } catch (error) {
    console.error(`✗ Failed to create main release PR: ${error.message}`);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

runMain(main);
