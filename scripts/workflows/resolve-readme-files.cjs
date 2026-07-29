#!/usr/bin/env node
/**
 * Resolve impacted README files from git diff
 * Outputs space-separated list of README files to GITHUB_OUTPUT
 */

const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

function getChangedFiles(baseSha, headSha) {
  try {
    const output = execFileSync(
      "git",
      ["diff", "--name-only", baseSha, headSha],
      {
        encoding: "utf8",
        stdio: ["pipe", "pipe", "pipe"],
      },
    );
    return output
      .trim()
      .split("\n")
      .filter((f) => f.length > 0);
  } catch {
    return [];
  }
}

function resolveReadmeFiles(changedFiles) {
  const readmes = new Set();

  changedFiles.forEach((file) => {
    const dir = path.dirname(file);

    // Check for README.md in the changed file's directory
    const readmeInDir = path.join(dir, "README.md");
    if (fs.existsSync(readmeInDir)) {
      readmes.add(readmeInDir);
    }

    // Check for root README.md if not in root already
    if (dir !== "." && fs.existsSync("README.md")) {
      readmes.add("README.md");
    }
  });

  return Array.from(readmes).sort();
}

function main() {
  const eventName = process.env.EVENT_NAME;
  let baseSha;
  let headSha = process.env.PUSH_SHA || process.env.PR_HEAD;

  // Determine base SHA based on event type
  if (eventName === "pull_request") {
    baseSha = process.env.PR_BASE;
  } else if (eventName === "push") {
    baseSha = process.env.PUSH_BEFORE;
  } else {
    baseSha = "HEAD~1";
  }

  // Get changed files
  const changedFiles = getChangedFiles(baseSha, headSha);

  // Resolve README files
  const readmes = resolveReadmeFiles(changedFiles);

  // Output to GITHUB_OUTPUT
  const outputFile = process.env.GITHUB_OUTPUT;
  if (outputFile && fs.existsSync(path.dirname(outputFile))) {
    const files = readmes.join(",");
    fs.appendFileSync(outputFile, `files=${files}\n`);
  }
}

main();
