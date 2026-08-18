/**
 * Workspace Cleaner Module
 * Safe worktree cleanup with user confirmation and status reporting.
 */

const { execFileSync } = require("child_process");
const path = require("path");

/**
 * Get current git worktree status.
 * Returns clean/dirty state and summary of changes.
 */
function getWorktreeStatus(repoPath) {
  try {
    const statusOutput = execFileSync("git", ["status", "--porcelain"], {
      cwd: repoPath,
      encoding: "utf8",
    });

    const stagedFiles = [];
    const uncommittedFiles = [];

    if (statusOutput.trim()) {
      const lines = statusOutput.split("\n").filter((l) => l.trim());
      lines.forEach((line) => {
        const status = line.substring(0, 2);
        const filename = line.substring(3).trim();

        if (status.startsWith("M") || status.startsWith("A")) {
          stagedFiles.push(filename);
        } else if (status.startsWith("?")) {
          uncommittedFiles.push(filename);
        } else {
          uncommittedFiles.push(filename);
        }
      });
    }

    const isClean = stagedFiles.length === 0 && uncommittedFiles.length === 0;

    return {
      isClean,
      stagedFiles,
      uncommittedFiles,
      totalChanges: stagedFiles.length + uncommittedFiles.length,
    };
  } catch (error) {
    return {
      isClean: false,
      error: error.message,
      stagedFiles: [],
      uncommittedFiles: [],
      totalChanges: 0,
    };
  }
}

/**
 * Get current branch name.
 */
function getCurrentBranch(repoPath) {
  try {
    const branch = execFileSync("git", ["rev-parse", "--abbrev-ref", "HEAD"], {
      cwd: repoPath,
      encoding: "utf8",
    }).trim();
    return branch;
  } catch (error) {
    return null;
  }
}

/**
 * Get list of commits ahead of base branch.
 */
function getCommitsAhead(repoPath, baseBranch = "develop") {
  try {
    const currentBranch = getCurrentBranch(repoPath);
    if (!currentBranch) return 0;

    const refRange = `${baseBranch}..${currentBranch}`;
    const commits = execFileSync("git", ["log", "--oneline", refRange], {
      cwd: repoPath,
      encoding: "utf8",
    })
      .trim()
      .split("\n")
      .filter((line) => line.length > 0).length;

    return commits || 0;
  } catch (error) {
    return 0;
  }
}

/**
 * Validate worktree safety before cleanup.
 * Returns warnings if cleanup might lose work.
 */
function validateCleanupSafety(repoPath) {
  const warnings = [];
  const status = getWorktreeStatus(repoPath);
  const branch = getCurrentBranch(repoPath);
  const commitsAhead = getCommitsAhead(repoPath);

  if (!status.isClean) {
    warnings.push({
      level: "error",
      message: `Working directory is dirty (${status.totalChanges} changes)`,
      details: {
        staged: status.stagedFiles,
        uncommitted: status.uncommittedFiles,
      },
    });
  }

  if (commitsAhead > 0) {
    warnings.push({
      level: "warning",
      message: `Branch has ${commitsAhead} commits ahead of develop`,
      details: {
        branch,
        commitsAhead,
      },
    });
  }

  return {
    safe: warnings.filter((w) => w.level === "error").length === 0,
    warnings,
    status,
  };
}

/**
 * Stash uncommitted changes (non-destructive).
 */
function stashChanges(repoPath, message = "Auto-stashed before cleanup") {
  try {
    execFileSync("git", ["stash", "push", "-u", "-m", message], {
      cwd: repoPath,
    });
    return {
      success: true,
      message: "Changes stashed successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Commit pending changes with auto-generated message.
 */
function commitChanges(repoPath, message = "Cleanup: Final session commit") {
  try {
    execFileSync("git", ["add", "-A"], { cwd: repoPath });
    execFileSync("git", ["commit", "-m", message], {
      cwd: repoPath,
    });
    return {
      success: true,
      message: "Changes committed successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Delete the git worktree.
 * DANGEROUS: This removes the entire worktree directory.
 */
function deleteWorktree(worktreePath) {
  try {
    // Get the worktree name from the path
    const worktreeName = path.basename(worktreePath);
    const parentPath = path.dirname(worktreePath);

    // First, prune invalid worktrees
    try {
      execFileSync("git", ["worktree", "prune"], { cwd: parentPath });
    } catch {
      // Ignore errors
    }

    // Remove the worktree
    execFileSync("git", ["worktree", "remove", worktreePath, "--force"], {
      cwd: parentPath,
    });

    return {
      success: true,
      worktreePath,
      message: `Worktree '${worktreeName}' deleted successfully`,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      worktreePath,
    };
  }
}

/**
 * Comprehensive cleanup workflow.
 * Handles dirty worktree, optional commit/stash, and deletion.
 */
function cleanupWorktree(repoPath, worktreePath, options = {}) {
  const {
    autoStash = false,
    autoCommit = false,
    deleteAfterCleanup = false,
    confirmationCallback = null,
  } = options;

  const results = {
    startTime: new Date().toISOString(),
    repoPath,
    worktreePath,
    steps: [],
    success: false,
    errors: [],
  };

  // Step 1: Validate safety
  const validation = validateCleanupSafety(repoPath);
  results.steps.push({
    name: "validate_safety",
    status: validation.safe ? "warning" : "error",
    warnings: validation.warnings,
  });

  if (!validation.safe && !autoCommit && !autoStash) {
    results.errors.push(
      "Worktree is dirty and no auto-cleanup options enabled",
    );
    return results;
  }

  // Step 2: Handle uncommitted changes
  if (!validation.status.isClean) {
    if (autoStash) {
      const stashResult = stashChanges(repoPath);
      results.steps.push({
        name: "stash_changes",
        status: stashResult.success ? "success" : "error",
        message: stashResult.message || stashResult.error,
      });
      if (!stashResult.success) {
        results.errors.push(`Stash failed: ${stashResult.error}`);
      }
    } else if (autoCommit) {
      const commitResult = commitChanges(repoPath);
      results.steps.push({
        name: "commit_changes",
        status: commitResult.success ? "success" : "error",
        message: commitResult.message || commitResult.error,
      });
      if (!commitResult.success) {
        results.errors.push(`Commit failed: ${commitResult.error}`);
      }
    }
  }

  // Step 3: Ask for confirmation if callback provided
  if (confirmationCallback && typeof confirmationCallback === "function") {
    const confirmed = confirmationCallback({
      worktreePath,
      willDelete: deleteAfterCleanup,
      changes: validation.status,
    });

    if (!confirmed) {
      results.steps.push({
        name: "user_confirmation",
        status: "cancelled",
        message: "User cancelled cleanup",
      });
      return results;
    }

    results.steps.push({
      name: "user_confirmation",
      status: "confirmed",
      message: "User confirmed cleanup",
    });
  }

  // Step 4: Delete worktree
  if (deleteAfterCleanup) {
    const deleteResult = deleteWorktree(worktreePath);
    results.steps.push({
      name: "delete_worktree",
      status: deleteResult.success ? "success" : "error",
      message: deleteResult.message || deleteResult.error,
    });
    if (!deleteResult.success) {
      results.errors.push(`Worktree deletion failed: ${deleteResult.error}`);
    }
  }

  results.success = results.errors.length === 0;
  results.endTime = new Date().toISOString();

  return results;
}

/**
 * Generate human-readable cleanup report.
 */
function generateCleanupReport(cleanupResult) {
  const { success, steps, errors, startTime, endTime } = cleanupResult;

  let report = "# Workspace Cleanup Report\n\n";
  report += `**Status:** ${success ? "✅ Success" : "❌ Failed"}\n`;
  report += `**Time:** ${startTime} → ${endTime}\n\n`;

  if (steps.length > 0) {
    report += "## Steps Executed\n\n";
    steps.forEach((step) => {
      const statusEmoji =
        step.status === "success"
          ? "✅"
          : step.status === "error"
            ? "❌"
            : step.status === "cancelled"
              ? "⏸️"
              : "⚠️";
      report += `${statusEmoji} **${step.name}** — ${step.message}\n`;
    });
    report += "\n";
  }

  if (errors.length > 0) {
    report += "## Errors\n\n";
    errors.forEach((error) => {
      report += `- ${error}\n`;
    });
    report += "\n";
  }

  return report;
}

// Exports
module.exports = {
  getWorktreeStatus,
  getCurrentBranch,
  getCommitsAhead,
  validateCleanupSafety,
  stashChanges,
  commitChanges,
  deleteWorktree,
  cleanupWorktree,
  generateCleanupReport,
};
