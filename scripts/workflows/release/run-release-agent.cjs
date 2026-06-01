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

function buildArgs(options) {
  const args = [`--scope=${options.scope}`];

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

  const agentPath = path.resolve(
    process.cwd(),
    readEnv("RELEASE_AGENT_PATH", {
      defaultValue: "scripts/agents/release.agent.js",
    }),
  );

  const args = buildArgs({ scope, version, notesFrom, dryRun });
  log("info", "Running release agent", {
    scope,
    version,
    notesFrom,
    dryRun,
    args,
  });

  const result = spawnSync(process.execPath, [agentPath, ...args], {
    stdio: "inherit",
  });

  if (result.error) {
    throw new Error(`Failed to run release agent: ${result.error.message}`);
  }

  if (result.status !== 0) {
    throw new Error(`Release agent exited with status ${result.status}`);
  }
}

module.exports = { buildArgs };

runMain(main);
