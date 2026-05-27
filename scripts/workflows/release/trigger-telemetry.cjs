#!/usr/bin/env node
/* eslint-env node */

const { process } = globalThis;

const fs = require("fs");
const path = require("path");
const {
  readEnv,
  writeGithubOutput,
  log,
  runMain,
} = require("../shared/runtime.cjs");

async function main() {
  const eventName = readEnv("GITHUB_EVENT_NAME", { defaultValue: "" });
  const actor = readEnv("GITHUB_ACTOR", { defaultValue: "" });

  const unauthorizedAttempts = ["workflow_dispatch", "workflow_call"].includes(
    eventName,
  )
    ? 0
    : 1;
  writeGithubOutput("unauthorized_attempts", unauthorizedAttempts);

  const telemetryPath = path.resolve(process.cwd(), "trigger-telemetry.json");
  const payload = {
    event: eventName,
    actor,
    unauthorized_attempts: unauthorizedAttempts,
  };

  fs.writeFileSync(telemetryPath, `${JSON.stringify(payload)}\n`, "utf8");
  log("info", "Release trigger telemetry recorded", payload);
}

runMain(main);
