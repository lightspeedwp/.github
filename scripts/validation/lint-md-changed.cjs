#!/usr/bin/env node
/* eslint-disable no-console */
// Lints only the Markdown files changed against the base ref.
//
// The repository carries a large backlog of pre-existing markdownlint
// violations in authored documentation. Linting the whole tree fails on that
// backlog and blocks every pull request, so CI lints what the pull request
// actually touches. Run `npm run lint:md` for the full-tree report.

const { spawnSync } = require("child_process");
const path = require("path");
const fs = require("fs");
const { changedFiles } = require("./lib/changed-files.cjs");

const files = changedFiles((f) => /\.mdx?$/.test(f));

if (files === null) {
  // Only reached when HEAD is a root commit (see lib/changed-files.cjs) —
  // any other case resolves to a real range. Skipping silently in CI would
  // let violations through unlinted, so this must be a loud, actionable
  // failure rather than a quiet no-op that leaves the job green.
  const message = "Could not resolve a base commit to diff against.";
  if (process.env.CI) {
    console.error(`${message} Set BASE_SHA and HEAD_SHA, or check out with fetch-depth: 0.`);
    process.exit(1);
  }
  console.log(`${message} Skipping — run npm run lint:md for the full tree.`);
  process.exit(0);
}

if (files.length === 0) {
  console.log("No Markdown files changed — nothing to lint.");
  process.exit(0);
}

// Load ignore patterns from .markdownlintignore
const ignorePatterns = [];
try {
  const ignorePath = path.join(__dirname, "../../.markdownlintignore");
  const ignoreContent = fs.readFileSync(ignorePath, "utf8");
  ignoreContent
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .forEach((pattern) => ignorePatterns.push(pattern));
} catch (err) {
  console.warn("Warning: Could not load .markdownlintignore", err.message);
}

// Simple glob pattern matching (supports **, *, ?)
// Note: This is a simplified implementation that handles common patterns
function matchesPattern(filePath, pattern) {
  // Use placeholders for **, *, ? to avoid conflicts during escaping
  let regex = pattern
    .replace(/\*\*\//g, "\x00")  // **/ placeholder (keep the slash for now)
    .replace(/\*\*/g, "\x01")    // ** placeholder
    .replace(/\*/g, "\x02")      // * placeholder
    .replace(/\?/g, "\x03");     // ? placeholder

  // Now escape regex special characters
  regex = regex.replace(/[.+^${}()|[\]\\]/g, "\\$&");

  // Replace placeholders with regex patterns
  // **/ matches any path including nested dirs, or nothing (making it optional)
  regex = regex.replace(/\x00/g, "(?:.*/)?");
  // ** matches any characters including /
  regex = regex.replace(/\x01/g, ".*");
  // * matches anything except /
  regex = regex.replace(/\x02/g, "[^/]*");
  // ? matches any single character except /
  regex = regex.replace(/\x03/g, "[^/]");

  return new RegExp(`^${regex}$`).test(filePath);
}

// Filter out files matching ignore patterns
const filesToLint = files.filter((file) => {
  for (const pattern of ignorePatterns) {
    if (matchesPattern(file, pattern)) {
      console.log(`⏭️  Skipped (ignored): ${file}`);
      return false;
    }
  }
  return true;
});

if (filesToLint.length === 0) {
  console.log("All Markdown files matched ignore patterns — nothing to lint.");
  process.exit(0);
}

console.log(`Linting ${filesToLint.length} changed Markdown file(s).`);
const result = spawnSync("npx", ["markdownlint-cli2", ...filesToLint], {
  stdio: "inherit",
});
process.exit(result.status ?? 1);
