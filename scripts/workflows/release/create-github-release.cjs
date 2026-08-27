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
  const provider = readEnv("INPUT_PROVIDER", {
    defaultValue: "shell",
  })
    .toLowerCase()
    .trim();
  const notesFrom = readEnv("INPUT_NOTES_FROM", { defaultValue: "" }).trim();

  log(`Creating GitHub Release for v${version}...`);
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
    // Create GitHub Release
    await releaseProvider.createRelease(version, {
      dryRun: false,
      notesFrom: notesFrom || undefined,
    });

    log(`✓ GitHub Release v${version} created`);
    console.log(`release_version=${version}`);
  } catch (error) {
    console.error(`✗ Failed to create GitHub Release: ${error.message}`);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

runMain(main);
