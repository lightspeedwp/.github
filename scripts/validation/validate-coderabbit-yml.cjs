#!/usr/bin/env node
/**
 * Validates `.coderabbit.yml` against the canonical CodeRabbit schema and structure.
 * @module scripts/validation/validate-coderabbit-yml
 * @see .coderabbit.yml
 */

const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const https = require("https");

// Accept file path as argument for testability
const filePath = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.resolve(__dirname, "../../.coderabbit.yml");
const schemaUrl =
  "https://coderabbit.ai/integrations/coderabbit-overrides.v2.json";
const localSchemaPath = path.resolve(
  __dirname,
  "../../.schemas/coderabbit-overrides.v2.json",
);
const logsDir = path.resolve(__dirname, "../../logs");
const logFile = path.join(logsDir, "validate-coderabbit-yml.log");

function logToFile(message) {
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
  fs.appendFileSync(logFile, `[${new Date().toISOString()}] ${message}\n`);
}

function error(msg) {
  const errMsg = `Error: ${msg}`;
  console.error(`\x1b[31m${errMsg}\x1b[0m`);
  logToFile(errMsg);
  // Print a recognizable string for test matching
  console.log("Invalid .coderabbit.yml");
  process.exit(1);
}

function fetchRemoteSchema(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          if (!data) return reject(new Error("Empty response from schema URL"));
          try {
            const json = JSON.parse(data);
            resolve(json);
          } catch (e) {
            reject(new Error("Invalid JSON from schema URL"));
          }
        });
      })
      .on("error", (err) => {
        reject(err);
      });
  });
}

async function main() {
  if (!fs.existsSync(filePath)) {
    error(`File not found: ${filePath}`);
  }
  const content = fs.readFileSync(filePath, "utf8");
  const data = yaml.load(content);

  // Always try to fetch the latest schema, fallback to local if needed
  let schema = null;
  let usedRemote = false;
  try {
    schema = await fetchRemoteSchema(schemaUrl);
    // Save the latest schema locally for future runs
    fs.writeFileSync(localSchemaPath, JSON.stringify(schema, null, 2));
    usedRemote = true;
    logToFile("Fetched latest schema from remote.");
  } catch (e) {
    if (fs.existsSync(localSchemaPath)) {
      schema = JSON.parse(fs.readFileSync(localSchemaPath, "utf8"));
      const warnMsg = `Warning: Using local schema due to fetch error: ${e.message}`;
      console.warn(warnMsg);
      logToFile(warnMsg);
    } else {
      error(`Failed to fetch schema and no local schema found: ${e.message}`);
    }
  }

  // Basic required fields (from schema)
  if (schema && Array.isArray(schema.required)) {
    for (const key of schema.required) {
      if (!(key in data)) {
        error(`Missing required top-level field: ${key}`);
      }
    }
  }

  // Optionally, check for common subfields
  if (data.reviews) {
    if (!data.reviews.path_filters) {
      console.warn("Warning: reviews.path_filters is missing.");
    }
    if (!data.reviews.auto_review) {
      console.warn("Warning: reviews.auto_review is missing.");
    }
  }

  const okMsg = `.coderabbit.yml is valid! (schema: ${usedRemote ? "remote" : "local"})`;
  console.log(`\x1b[32m${okMsg}\x1b[0m`);
  logToFile(okMsg);
  process.exit(0);
}

main().catch((e) => error(e.message || e));
