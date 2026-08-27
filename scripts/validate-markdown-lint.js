#!/usr/bin/env node
/**
 * Lint changed Markdown files, excluding known exceptions
 * Replaces multiline shell logic with Node.js
 */

import { execFileSync } from "child_process";

const eventName = process.env.GITHUB_EVENT_NAME;
const baseSha = process.env.BASE_SHA;
const headSha = process.env.HEAD_SHA;

// Skip for non-push/pull_request events
if (eventName !== "pull_request" && eventName !== "push") {
  console.log(`Skipping markdown lint for event ${eventName}`);
  process.exit(0);
}

// Get changed markdown files
let files = [];
try {
  const output = execFileSync("git", [
    "diff",
    "--name-only",
    baseSha,
    headSha,
    "--",
    "*.md",
    "*.mdx",
  ]);

  files = output
    .toString()
    .split("\n")
    .filter((f) => f.trim());
} catch (error) {
  console.error("Failed to get changed files:", error.message);
  process.exit(1);
}

// Exclude known exceptions
const excludePatterns = [
  /^AWESOME_GITHUB_MAPPING_STRATEGY\.md$/,
  /^docs\/MIGRATION\.md$/,
  /^\.github\/reports\//,
  /^projects\/active\//,
  /\/plugin-provided\//,
  /\/platform-managed\//,
  /\/directory-installed\//,
  /\/tests\/markdown-issues\.md$/,
  /\/agentskills-main\//,
];

const filteredFiles = files.filter((file) => {
  return !excludePatterns.some((pattern) => pattern.test(file));
});

if (filteredFiles.length === 0) {
  console.log(
    "No Markdown files to lint (all changed files are in ignore list).",
  );
  process.exit(0);
}

console.log(`Linting ${filteredFiles.length} changed markdown file(s)...`);

// Run markdownlint-cli2
try {
  execFileSync("npx", ["markdownlint-cli2", ...filteredFiles], {
    stdio: "inherit",
  });
} catch (_error) {
  console.error("Markdown linting failed");
  process.exit(1);
}
