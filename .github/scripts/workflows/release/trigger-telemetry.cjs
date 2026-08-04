#!/usr/bin/env node
/* eslint-env node */

const { process } = globalThis;

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const {
  readEnv,
  writeGithubOutput,
  log,
  runMain,
} = require("../shared/runtime.cjs");

async function main() {
  const eventName = readEnv("GITHUB_EVENT_NAME", { defaultValue: "" });
  const actor = readEnv("GITHUB_ACTOR", { defaultValue: "" });
  const token = readEnv("GITHUB_TOKEN", { defaultValue: "" });

  let unauthorizedAttempts = 1;
  let isAuthorized = false;

  // Only workflow_dispatch and workflow_call are valid triggers
  if (!["workflow_dispatch", "workflow_call"].includes(eventName)) {
    log(
      "error",
      `Unauthorized trigger event: ${eventName}. Only workflow_dispatch and workflow_call are allowed.`,
    );
  } else {
    // Check if actor is in the maintainers team
    try {
      if (!token) {
        throw new Error("GITHUB_TOKEN not available for authorization check");
      }

      const checkCmd = `curl -s -H "Authorization: token ${token}" https://api.github.com/orgs/lightspeedwp/teams/maintainers/memberships/${actor}`;
      const result = execSync(checkCmd, { encoding: "utf8" });
      const membership = JSON.parse(result);

      if (
        membership.state === "active" ||
        membership.state === "pending"
      ) {
        isAuthorized = true;
        unauthorizedAttempts = 0;
        log("info", `Actor ${actor} is authorized to trigger releases`);
      } else {
        log(
          "error",
          `Actor ${actor} is not an active member of the maintainers team`,
        );
      }
    } catch (error) {
      log(
        "error",
        `Authorization check failed: ${error.message}. Blocking release trigger.`,
      );
    }
  }

  // Output status for workflow conditional
  writeGithubOutput(
    "unauthorized_attempts",
    unauthorizedAttempts.toString(),
  );
  writeGithubOutput("is_authorized", isAuthorized.toString());

  const telemetryPath = path.resolve(process.cwd(), "trigger-telemetry.json");
  const payload = {
    event: eventName,
    actor,
    is_authorized: isAuthorized,
    unauthorized_attempts: unauthorizedAttempts,
    timestamp: new Date().toISOString(),
  };

  fs.writeFileSync(telemetryPath, `${JSON.stringify(payload)}\n`, "utf8");
  log("info", "Release trigger telemetry recorded", payload);

  // Exit with error if unauthorized
  if (!isAuthorized) {
    process.exit(1);
  }
}

runMain(main);
