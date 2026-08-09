/**
 * Release Agent
 * Portable agent for multi-repo release management and version automation
 */

const repoDetector = require("./includes/repoDetector.cjs");
const versionManager = require("./includes/versionManager.cjs");
const gitOps = require("./includes/gitOps.cjs");
const githubOps = require("./includes/githubOps.cjs");

/**
 * Mark the most recent step as complete
 * @param {Array} steps - Steps array
 */
function completeLastStep(steps) {
  if (steps.length > 0) {
    steps[steps.length - 1].status = "complete";
  }
}

/**
 * Main release workflow orchestrator
 * Handles: version detection, bumping, PR creation, merging, and release
 *
 * @param {Object} options - Release configuration
 * @param {string} options.scope - 'major', 'minor', or 'patch' (default: 'patch')
 * @param {boolean} options.dryRun - Don't create PRs or commits (default: false)
 * @param {string} options.message - Release message (optional)
 * @param {string} options.repoRoot - Repository root (default: cwd)
 * @returns {Promise<Object>} Release result with versions, PRs, tag, release
 */
async function releaseWorkflow(options = {}) {
  const {
    scope = "patch",
    dryRun = false,
    message = "",
    repoRoot = process.cwd(),
  } = options;

  const result = {
    currentVersion: null,
    newVersion: null,
    prDevelop: null,
    prMain: null,
    tag: null,
    release: null,
    status: "pending",
    message: "",
    steps: [],
  };

  try {
    // Step 1: Detect repository type
    result.steps.push({ step: "Detect repo type", status: "in-progress" });
    const repoConfig = repoDetector.detectRepoType(repoRoot);
    completeLastStep(result.steps);
    result.steps.push({
      step: `Detected: ${repoConfig.type}`,
      status: "complete",
    });

    // Step 2: Get all version files
    result.steps.push({ step: "Detect version files", status: "in-progress" });
    const versionMap = versionManager.detectAllVersionFiles(repoConfig);
    completeLastStep(result.steps);

    // Step 3: Validate version consistency
    result.steps.push({
      step: "Validate version consistency",
      status: "in-progress",
    });
    const consistency = versionManager.validateVersionConsistency(versionMap);

    if (!consistency.isConsistent) {
      throw new Error(`Version mismatch: ${consistency.mismatches.join(", ")}`);
    }
    completeLastStep(result.steps);

    // Step 4: Get current and new versions
    result.currentVersion = versionManager.getCurrentVersion(versionMap);
    result.newVersion = versionManager.getNextVersion(
      result.currentVersion,
      scope,
    );

    result.steps.push({
      step: `Version: ${result.currentVersion} → ${result.newVersion}`,
      status: "complete",
    });

    if (dryRun) {
      result.message = "Dry run: No commits or PRs created";
      result.status = "success";
      return result;
    }

    // Step 5: Check working tree is clean
    result.steps.push({ step: "Check working tree", status: "in-progress" });
    if (!gitOps.isWorkingTreeClean()) {
      throw new Error("Working tree has uncommitted changes");
    }
    completeLastStep(result.steps);

    // Step 6: Apply version bump
    result.steps.push({
      step: "Apply version bump",
      status: "in-progress",
    });
    const bumpResult = versionManager.applyVersionBump(
      versionMap,
      result.newVersion,
    );

    if (!bumpResult.success) {
      throw new Error(
        `Failed to bump versions: ${bumpResult.failed.join(", ")}`,
      );
    }
    completeLastStep(result.steps);

    // Step 7: Stage and commit version bump
    result.steps.push({
      step: "Commit version bump",
      status: "in-progress",
    });

    const versionFiles = Object.values(versionMap).map((v) => v.path);
    gitOps.stageFiles(versionFiles);

    const commitMsg = `chore: Bump version to ${result.newVersion}`;
    const commitResult = gitOps.commitChanges(commitMsg, {
      name: "Release Bot",
      email: "bot@lightspeedwp.agency",
    });

    if (!commitResult) {
      throw new Error("Failed to commit version bump");
    }
    completeLastStep(result.steps);

    // Step 8: Create PR to develop (if not on develop)
    result.steps.push({
      step: "Create PR to develop",
      status: "in-progress",
    });

    const currentBranch = gitOps.getCurrentBranch();
    if (currentBranch !== "develop") {
      const prTitle = `chore: Release v${result.newVersion}`;
      const prBody = message
        ? `${message}\n\nVersion: ${result.currentVersion} → ${result.newVersion}`
        : `Version: ${result.currentVersion} → ${result.newVersion}`;

      result.prDevelop = githubOps.createPullRequest({
        title: prTitle,
        body: prBody,
        base: "develop",
        head: currentBranch,
      });

      if (!result.prDevelop) {
        throw new Error("Failed to create PR to develop");
      }
    }
    completeLastStep(result.steps);

    // Step 9: (Manual) User merges PR, then creates main PR
    result.steps.push({
      step: "PR created - manual merge required",
      status: "pending",
    });

    result.status = "success";
    result.message = `Release v${result.newVersion} ready. PR: ${result.prDevelop?.url || "on develop"}`;

    return result;
  } catch (error) {
    result.status = "failed";
    result.message = error.message;
    result.steps.push({
      step: `Error: ${error.message}`,
      status: "failed",
    });
    return result;
  }
}

/**
 * Validate that a release can proceed
 * @param {Object} options - { repoRoot, scope }
 * @returns {Object} Validation result
 */
async function validateRelease(options = {}) {
  const { repoRoot = process.cwd() } = options;

  const validation = {
    isValid: true,
    errors: [],
    warnings: [],
    repo: null,
    versions: null,
  };

  try {
    // Detect repo
    validation.repo = repoDetector.detectRepoType(repoRoot);

    // Check structure
    if (!repoDetector.isValidRepoStructure(validation.repo)) {
      validation.isValid = false;
      validation.errors.push("Repository structure is invalid");
      return validation;
    }

    // Check version files
    const versionMap = versionManager.detectAllVersionFiles(validation.repo);
    validation.versions = versionMap;

    // Check consistency
    const consistency = versionManager.validateVersionConsistency(versionMap);
    if (!consistency.isConsistent) {
      validation.isValid = false;
      validation.errors.push(
        `Version mismatch: ${consistency.mismatches.join(", ")}`,
      );
    }

    // Check working tree
    if (!gitOps.isWorkingTreeClean()) {
      validation.warnings.push("Working tree has uncommitted changes");
    }

    // Check GitHub auth
    if (!githubOps.isAuthenticated()) {
      validation.warnings.push("Not authenticated with GitHub");
    }
  } catch (error) {
    validation.isValid = false;
    validation.errors.push(error.message);
  }

  return validation;
}

module.exports = {
  releaseWorkflow,
  validateRelease,
};
