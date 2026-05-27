#!/usr/bin/env node
/* eslint-env node */

const { process } = globalThis;

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const { readEnv, log, runMain } = require("../shared/runtime.cjs");

function execGit(command, allowError = false) {
  try {
    return execSync(command, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }).trim();
  } catch (error) {
    if (allowError) {
      return "";
    }
    throw new Error(`Git command failed: ${command}\n${error.message}`);
  }
}

function buildGitLogContent(rangeStart) {
  if (rangeStart) {
    return execGit(
      `git log ${rangeStart}..develop --first-parent --pretty=format:"- %h %s"`,
    );
  }

  return execGit('git log develop --first-parent --pretty=format:"- %h %s"');
}

async function main() {
  let rangeStart = readEnv("INPUT_NOTES_FROM", { defaultValue: "" }).trim();
  if (!rangeStart) {
    rangeStart = execGit("git describe --tags --abbrev=0", true);
  }

  const previewPath = path.resolve(
    process.cwd(),
    readEnv("RELEASE_NOTES_PREVIEW_PATH", {
      defaultValue: "release-notes-preview.md",
    }),
  );

  const content = buildGitLogContent(rangeStart);
  fs.writeFileSync(previewPath, `${content}\n`, "utf8");

  log("info", "Built dry-run release notes preview", {
    rangeStart,
    previewPath,
  });
}

module.exports = { buildGitLogContent };

runMain(main);
