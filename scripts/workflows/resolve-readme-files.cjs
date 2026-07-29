#!/usr/bin/env node
/**
 * Resolve impacted README files from git diff.
 *
 * Output format: Comma-separated list of README file paths written to GITHUB_OUTPUT.
 * This matches the format expected by GitHub Actions workflow variable interpolation
 * when passing values to shell commands via ${{ steps.readmes.outputs.files }}.
 *
 * Example output:
 *   files=README.md,.github/projects/README.md,docs/README.md
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
  let hasSubdirChanges = false;

  changedFiles.forEach((file) => {
    const dir = path.dirname(file);

    // Check for README.md in the changed file's directory
    const readmeInDir = path.join(dir, "README.md");
    if (fs.existsSync(readmeInDir)) {
      readmes.add(readmeInDir);
    }

    // Track if changes are in subdirectories (not root)
    if (dir !== ".") {
      hasSubdirChanges = true;
    }
  });

  // Only add root README if files in subdirectories changed AND root README exists
  if (hasSubdirChanges && fs.existsSync("README.md")) {
    readmes.add("README.md");
  }

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
