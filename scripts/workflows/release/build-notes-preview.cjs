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
  const gitLogContent = buildGitLogContent(rangeStart, targetRef);

  // Get version from package.json
  const pkgPath = path.resolve(process.cwd(), "package.json");
  let currentVersion = "?.?.?";
  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
    currentVersion = pkg.version || "?.?.?";
  } catch (error) {
    log("warn", "Could not read version from package.json");
  }

  // Get affected files
  let affectedFiles = "";
  if (rangeStart) {
    affectedFiles = execGit(
      `git diff --name-only ${rangeStart}..${targetRef}`,
      true,
    );
  }

  // Read changelog excerpt
  let changelogExcerpt = "";
  const changelogPath = path.resolve(process.cwd(), "CHANGELOG.md");
  if (fs.existsSync(changelogPath)) {
    const changelogContent = fs.readFileSync(changelogPath, "utf8");
    const lines = changelogContent.split("\n");
    const unreleaseIdx = lines.findIndex((l) => l.includes("## Unreleased"));
    if (unreleaseIdx !== -1) {
      const nextSectionIdx = lines
        .slice(unreleaseIdx + 1)
        .findIndex((l) => l.match(/^## \[/));
      const endIdx =
        nextSectionIdx !== -1 ? unreleaseIdx + 1 + nextSectionIdx : Math.min(unreleaseIdx + 20, lines.length);
      changelogExcerpt = lines.slice(unreleaseIdx, endIdx).join("\n").trim();
    }
  }

  // Build comprehensive preview
  const preview = [
    "# Release Notes Preview (Dry-Run)",
    "",
    `**Current Version:** ${currentVersion}`,
    "",
    "## Unreleased Changes",
    gitLogContent,
    "",
    ...(changelogExcerpt ? ["## Changelog Excerpt", changelogExcerpt, ""] : []),
    ...(affectedFiles ? ["## Affected Files", affectedFiles.split("\n").map((f) => `- ${f}`).join("\n"), ""] : []),
    "---",
    "ℹ️  This is a dry-run preview. No commits, tags, or releases will be created.",
  ].join("\n");

  fs.writeFileSync(previewPath, preview, "utf8");

  log("info", "Built comprehensive dry-run release notes preview", {
    rangeStart,
    targetRef,
    currentVersion,
    previewPath,
    affectedFilesCount: affectedFiles.split("\n").filter((f) => f).length,
  });
}

module.exports = { buildGitLogContent, resolveTargetRef };

runMain(main);
