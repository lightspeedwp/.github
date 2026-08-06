#!/usr/bin/env node
/* eslint-env node */

const { process } = globalThis;
const { execSync } = require("child_process");
const { readEnv, log, runMain } = require("../shared/runtime.cjs");

async function main() {
  const token = readEnv("GITHUB_TOKEN", { defaultValue: "" });

  if (!token) {
    throw new Error("GITHUB_TOKEN required for post-release sync");
  }

  try {
    log("info", "Starting post-release sync: main → develop");

    // Fetch latest main and develop
    execSync("git fetch origin main develop", { encoding: "utf8" });

    // Check current branch and move to main if needed
    const currentBranch = execSync("git branch --show-current", {
      encoding: "utf8",
    }).trim();

    if (currentBranch !== "main") {
      log("info", `Checking out main (currently on ${currentBranch})`);
      execSync("git checkout main", { encoding: "utf8" });
    }

    // Reset to origin/main to ensure we're on latest
    execSync("git reset --hard origin/main", { encoding: "utf8" });

    // Create sync branch
    const syncBranch = "chore/post-release-sync-main-to-develop";
    log("info", `Creating sync branch: ${syncBranch}`);

    // Delete sync branch if it exists
    try {
      execSync(`git branch -D ${syncBranch}`, { encoding: "utf8" });
    } catch {
      // Branch doesn't exist, that's fine
    }

    // Create new sync branch from main
    execSync(
      `git checkout -b ${syncBranch} origin/main`,
      { encoding: "utf8" },
    );

    // Merge main into develop (or create PR if not a direct push)
    log("info", "Syncing main changes back to develop");

    // Check what will be synced
    const diffOutput = execSync(
      "git diff origin/develop..origin/main --name-only",
      { encoding: "utf8" },
    ).trim();

    if (diffOutput) {
      const changedFiles = diffOutput.split("\n").filter((f) => f);
      log("info", `Files to sync from main to develop: ${changedFiles.length}`, {
        files: changedFiles,
      });
    } else {
      log("info", "No differences between main and develop");
    }

    const syncCommand = `
      git fetch origin develop
      git merge origin/main -m "chore: post-release sync (main → develop)" --no-edit
    `;

    try {
      execSync(syncCommand, { encoding: "utf8" });
      log("info", "Merge successful");
    } catch (error) {
      log(
        "warn",
        "Merge has conflicts. Attempting automatic conflict resolution.",
      );
      // Try to resolve conflicts automatically for specific files
      try {
        // Prefer main version for most files
        execSync("git merge --abort", { encoding: "utf8" });
        // Try a different merge strategy
        execSync(
          "git merge origin/main -m 'chore: post-release sync (main → develop)' --strategy-option=theirs --no-edit",
          { encoding: "utf8" },
        );
        log("info", "Resolved conflicts using theirs strategy");
      } catch (innerError) {
        log(
          "error",
          `Merge failed even with conflict resolution: ${innerError.message}`,
        );
        throw innerError;
      }
    }

    // Push sync branch
    log("info", `Pushing ${syncBranch} to remote`);
    execSync(`git push -u origin ${syncBranch}`, { encoding: "utf8" });

    // Create PR for sync
    log("info", "Creating PR: main → develop");
    const prCommand = `gh pr create \
      --base develop \
      --head ${syncBranch} \
      --title "chore: Post-release sync (main → develop)" \
      --body "Automatic sync of main changes back to develop after release.\\n\\nThis ensures develop is always in sync with main after a release."`;

    try {
      const prOutput = execSync(prCommand, { encoding: "utf8" });
      log("info", `Post-release sync PR created:\n${prOutput}`);
    } catch (error) {
      log(
        "warn",
        "Failed to create sync PR automatically. You may need to create it manually.",
      );
      log("info", `Branch: ${syncBranch}, Target: develop`);
    }

    log("info", "✓ Post-release sync complete");
  } catch (error) {
    log(
      "error",
      `Post-release sync failed: ${error.message}. Check git state and run manually if needed.`,
    );
    process.exit(1);
  }
}

runMain(main);
