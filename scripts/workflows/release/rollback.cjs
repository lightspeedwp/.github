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

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const targetVersion = readEnv("ROLLBACK_TARGET_VERSION", {
    defaultValue: "",
  }).trim();

  if (!targetVersion) {
    throw new Error(
      "ROLLBACK_TARGET_VERSION required. Set it to the version to rollback to.",
    );
  }

  log(
    "warn",
    `⚠️  RELEASE ROLLBACK INITIATED: Rolling back release ${targetVersion}`,
  );
  log("info", dryRun ? "Running in DRY-RUN mode" : "Running in LIVE mode");
  log("info", "");

  try {
    execGit("git fetch origin main develop");
    log("info", "✓ Git access verified");

    const tagExists = execGit(`git rev-parse ${targetVersion}`, true);
    if (!tagExists) {
      log("warn", `Tag ${targetVersion} not found locally, checking remote...`);
      const remoteTagExists = execGit(
        `git ls-remote origin refs/tags/${targetVersion}`,
        true,
      );
      if (!remoteTagExists) {
        throw new Error(
          `Release tag ${targetVersion} not found. Cannot rollback.`,
        );
      }
    }
    log("info", `✓ Release tag ${targetVersion} found`);

    log("info", "Finding release commits to revert...");
    const releaseCommits = execGit(
      `git log main --grep="Release ${targetVersion}" --oneline`,
      true,
    );

    if (!releaseCommits) {
      log("warn", "No release commit found. Looking for recent main commits...");
      const recentCommits = execGit("git log main --oneline -5");
      log("info", `Recent commits on main:\n${recentCommits}`);
      log("warn", "Please manually verify and run: git revert <commit-hash>");
      process.exit(1);
    }

    if (!dryRun) {
      log("info", `Deleting tag ${targetVersion}...`);
      execGit(`git tag -d ${targetVersion}`);
      execGit(`git push origin --delete ${targetVersion}`);
    } else {
      log("info", `[DRY-RUN] Would delete tag ${targetVersion}`);
    }
    log("info", `✓ Tag ${targetVersion} handled`);

    log("info", "Reverting version file...");
    const versionFile = path.resolve(process.cwd(), "VERSION");
    if (fs.existsSync(versionFile)) {
      const currentVersion = fs.readFileSync(versionFile, "utf8").trim();
      log("info", `Current VERSION: ${currentVersion}`);

      const previousVersionCommit = execGit(
        `git log --all --grep="bump version" --pretty=format:"%H" -n 2`,
        true,
      );

      if (previousVersionCommit) {
        const commits = previousVersionCommit.split("\n");
        const prevCommit = commits[1];
        if (prevCommit) {
          const prevVersion = execGit(`git show ${prevCommit}:VERSION`, true);
          if (prevVersion) {
            log("info", `Previous VERSION: ${prevVersion}`);
            if (!dryRun) {
              fs.writeFileSync(versionFile, `${prevVersion}\n`, "utf8");
              execGit(
                `git add VERSION && git commit -m "chore: rollback version to ${prevVersion}"`,
              );
            } else {
              log("info", `[DRY-RUN] Would update VERSION to ${prevVersion}`);
            }
          }
        }
      }
    }
    log("info", `✓ Version file handled`);

    log("info", "Reverting CHANGELOG.md...");
    const changelogFile = path.resolve(process.cwd(), "CHANGELOG.md");
    if (fs.existsSync(changelogFile)) {
      const content = fs.readFileSync(changelogFile, "utf8");
      const lines = content.split("\n");

      const releaseHeaderIdx = lines.findIndex((l) =>
        l.includes(`## [${targetVersion}]`),
      );
      if (releaseHeaderIdx !== -1) {
        const nextReleaseIdx = lines
          .slice(releaseHeaderIdx + 1)
          .findIndex((l) => l.match(/^## \[/));
        const endIdx =
          nextReleaseIdx !== -1
            ? releaseHeaderIdx + 1 + nextReleaseIdx
            : lines.length;

        const newLines = [
          ...lines.slice(0, releaseHeaderIdx),
          ...lines.slice(endIdx),
        ];

        if (!dryRun) {
          fs.writeFileSync(changelogFile, newLines.join("\n"), "utf8");
          execGit(
            `git add CHANGELOG.md && git commit -m "chore: rollback CHANGELOG.md (remove ${targetVersion})"`,
          );
        } else {
          log("info", `[DRY-RUN] Would remove release section from CHANGELOG.md`);
        }
      }
    }
    log("info", `✓ CHANGELOG.md handled`);

    if (!dryRun) {
      log("info", "Pushing rollback changes to main...");
      execGit("git push origin main");
      log("info", "✓ Rollback pushed to main");

      log("info", "Syncing main back to develop...");
      execGit(
        "git checkout develop && git pull origin develop && git merge origin/main -m 'chore: rollback sync (main → develop)' --no-edit",
      );
      execGit("git push origin develop");
      log("info", "✓ Develop synced with rolled-back main");
    } else {
      log("info", "[DRY-RUN] Would push rollback changes");
    }

    log("info", "");
    log("info", `✅ Rollback of ${targetVersion} complete`);
    if (dryRun) {
      log("info", "This was a dry-run. Run again without --dry-run to apply rollback.");
    }
  } catch (error) {
    log("error", `❌ Rollback failed: ${error.message}`);
    log("warn", "Manual recovery may be required. Check git status and verify main/develop branches.");
    process.exit(1);
  }
}

runMain(main);
