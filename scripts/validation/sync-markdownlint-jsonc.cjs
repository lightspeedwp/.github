#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Generate .markdownlint.jsonc from the canonical .markdownlint.config.cjs.
 *
 * Why: VS Code markdownlint integrations commonly read JSON/JSONC configs,
 * while CI and CLI use the JS config. Generating JSONC keeps both aligned.
 */

const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "../..");
const sourcePath = path.join(repoRoot, ".markdownlint.config.cjs");
const targetPath = path.join(repoRoot, ".markdownlint.jsonc");

const previousStrict = process.env.MARKDOWNLINT_STRICT;
process.env.MARKDOWNLINT_STRICT = "false";
const source = require(sourcePath);
if (typeof previousStrict === "undefined") {
  delete process.env.MARKDOWNLINT_STRICT;
} else {
  process.env.MARKDOWNLINT_STRICT = previousStrict;
}

const outputConfig = {
  default: true,
  ...(source.rules || {}),
};

const jsonBody = JSON.stringify(outputConfig, null, 2)
  .split("\n")
  .slice(1, -1)
  .join("\n");

const output = [
  "{",
  "  // GENERATED FILE: synced from .markdownlint.config.cjs",
  "  // Run: npm run sync:markdownlint-config",
  "",
  jsonBody,
  "}",
  "",
].join("\n");

fs.writeFileSync(targetPath, output, "utf8");
console.log("Synced .markdownlint.jsonc from .markdownlint.config.cjs");
