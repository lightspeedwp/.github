#!/usr/bin/env node
/* eslint-env node */

const { process } = globalThis;

const path = require("path");
const { spawnSync } = require("child_process");
const {
  readEnv,
  normalizeBoolean,
  log,
  runMain,
} = require("../shared/runtime.cjs");

const VALID_SCOPES = new Set(["major", "minor", "patch"]);
const VALID_PROVIDERS = new Set(["shell", "mcp"]);

function buildArgs(options) {
  const args = [`--scope=${options.scope}`];

  args.push(`--provider=${options.provider}`);

  if (options.version) {
    args.push(`--version=${options.version}`);
  }

  if (options.notesFrom) {
    args.push(`--notes-from=${options.notesFrom}`);
  }

  if (options.dryRun) {
    args.push("--dry-run");
  }

  return args;
}

async function main() {
  const scope = readEnv("INPUT_SCOPE", { defaultValue: "patch" }).toLowerCase();
  const provider = readEnv("INPUT_PROVIDER", {
    defaultValue: readEnv("RELEASE_PROVIDER", { defaultValue: "shell" }),
  })
    .toLowerCase()
    .trim();
  const version = readEnv("INPUT_VERSION", { defaultValue: "" }).trim();
  const notesFrom = readEnv("INPUT_NOTES_FROM", { defaultValue: "" }).trim();
  const dryRun = normalizeBoolean(
    readEnv("INPUT_DRY_RUN", { defaultValue: "false" }),
    false,
  );

  if (!VALID_SCOPES.has(scope)) {
    throw new Error(
      `Invalid release scope "${scope}". Use one of: major, minor, patch.`,
    );
  }

  if (!VALID_PROVIDERS.has(provider)) {
    throw new Error(
      `Invalid release provider "${provider}". Use one of: shell, mcp.`,
    );
  }

  if (!dryRun) {
    log("warn", "⚠️  PRODUCTION RELEASE INITIATED");
    log("warn", "This will create actual commits, tags, and releases.");
    log("warn", "If this is unintended, cancel the workflow immediately.");
    log("info", `Release details: scope=${scope}, provider=${provider}`);
  }

  const agentPath = path.resolve(
    process.cwd(),
    readEnv("RELEASE_AGENT_PATH", {
      defaultValue: "scripts/agents/release.agent.js",
    }),
  );

  const args = buildArgs({ scope, provider, version, notesFrom, dryRun });
  log("info", "Running release agent", {
    scope,
    provider,
    version,
    notesFrom,
    dryRun,
    args,
  });

  const result = spawnSync(process.execPath, [agentPath, ...args], {
    stdio: ["inherit", "pipe", "inherit"],
    encoding: "utf-8",
  });

  if (result.error) {
    throw new Error(`Failed to run release agent: ${result.error.message}`);
  }

  if (result.status !== 0) {
    throw new Error(`Release agent exited with status ${result.status}`);
  }

  // Parse agent output to extract version and release branch
  const output = result.stdout || "";
  const versionMatch = output.match(/Version:\s*(.+?)(?:\n|$)/);
  const branchMatch = output.match(/Release Branch:\s*(.+?)(?:\n|$)/);

  const releaseVersion = versionMatch ? versionMatch[1].trim() : "";
  const releaseBranch = branchMatch ? branchMatch[1].trim() : "";

  if (!releaseVersion || !releaseBranch) {
    log("warn", "Could not parse version/branch from agent output");
    log("warn", `Version: ${releaseVersion || "NOT FOUND"}`);
    log("warn", `Branch: ${releaseBranch || "NOT FOUND"}`);
  } else {
    log("info", `Extracted version=${releaseVersion}, branch=${releaseBranch}`);
  }

  // Output for parsing by the workflow step
  console.log(`RELEASE_VERSION=${releaseVersion}`);
  console.log(`RELEASE_BRANCH=${releaseBranch}`);
}

module.exports = { buildArgs };

runMain(main);
