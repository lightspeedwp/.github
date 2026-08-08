#!/usr/bin/env node
/* eslint-env node */

const { process } = globalThis;
const path = require("path");
const {
  readEnv,
  log,
  runMain,
} = require("../shared/runtime.cjs");

async function main() {
  const version = readEnv("INPUT_VERSION", { required: true }).trim();
  const provider = readEnv("INPUT_PROVIDER", {
    defaultValue: "shell",
  })
    .toLowerCase()
    .trim();

  log(`Creating release PR from develop to main for v${version}...`);
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
    // Create PR from develop to main
    await releaseProvider.createReleasePRToMain(version, {
      dryRun: false,
      developPRNumber: null, // Could be passed via env if needed
    });

    log(`✓ Release PR (develop → main) created for v${version}`);
    console.log(`release_version=${version}`);
  } catch (error) {
    console.error(`✗ Failed to create main release PR: ${error.message}`);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

runMain(main);
