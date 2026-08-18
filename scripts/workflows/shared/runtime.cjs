#!/usr/bin/env node
/* eslint-env node */

const { process, console } = globalThis;

const fs = require("fs");

function readEnv(name, options = {}) {
  const { required = false, defaultValue = "" } = options;
  const value = process.env[name];

  if (typeof value === "undefined" || value === null || value === "") {
    if (required) {
      throw new Error(`Missing required environment variable: ${name}`);
    }
    return defaultValue;
  }

  return String(value);
}

function normalizeBoolean(value, defaultValue = false) {
  if (typeof value === "boolean") {
    return value;
  }

  if (value === undefined || value === null || value === "") {
    return defaultValue;
  }

  const normalized = String(value).trim().toLowerCase();
  if (["1", "true", "yes", "on"].includes(normalized)) {
    return true;
  }
  if (["0", "false", "no", "off"].includes(normalized)) {
    return false;
  }

  return defaultValue;
}

function writeGithubOutput(key, value, outputPath = process.env.GITHUB_OUTPUT) {
  if (!outputPath) {
    throw new Error("GITHUB_OUTPUT is not set");
  }

  fs.appendFileSync(outputPath, `${key}=${value}\n`, "utf8");
}

function log(level, message, metadata = null) {
  const record = {
    level,
    message,
    timestamp: new Date().toISOString(),
  };

  if (metadata && typeof metadata === "object") {
    record.metadata = metadata;
  }

  console.log(JSON.stringify(record));
}

async function runMain(mainFn) {
  try {
    await mainFn();
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

module.exports = {
  readEnv,
  normalizeBoolean,
  writeGithubOutput,
  log,
  runMain,
};
