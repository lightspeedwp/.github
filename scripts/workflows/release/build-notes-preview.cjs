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

function resolveTargetRef() {
  const preferred = readEnv("RELEASE_NOTES_TARGET_REF", {
    defaultValue: "develop",
  }).trim();
  if (preferred && execGit(`git rev-parse --verify ${preferred}`, true)) {
    return preferred;
  }
  return "HEAD";
}

function buildGitLogContent(rangeStart, targetRef) {
  if (rangeStart) {
    const ranged = execGit(
      `git log ${rangeStart}..${targetRef} --first-parent --pretty=format:"- %h %s"`,
      true,
    );
    if (ranged) {
      return ranged;
    }
  }

  return execGit(
    `git log ${targetRef} --first-parent --pretty=format:"- %h %s"`,
  );
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

  const targetRef = resolveTargetRef();
  const content = buildGitLogContent(rangeStart, targetRef);
  fs.writeFileSync(previewPath, `${content}\n`, "utf8");

  log("info", "Built dry-run release notes preview", {
    rangeStart,
    targetRef,
    previewPath,
  });
}

module.exports = { buildGitLogContent, resolveTargetRef };

runMain(main);
