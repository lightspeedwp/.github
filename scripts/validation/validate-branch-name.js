#!/usr/bin/env node

/**
 * Validate branch names against the repository branching strategy.
 *
 * @module scripts/validation/validate-branch-name
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const ALLOWED_PREFIXES = [
  "feat",
  "fix",
  "hotfix",
  "release",
  "refactor",
  "chore",
  "docs",
  "test",
  "perf",
  "ci",
  "build",
  "deps",
  "security",
  "revert",
  "research",
  "design",
  "a11y",
  "ux",
  "i18n",
  "ops",
  "proto",
  "ds",
  "api",
  "schema",
  "telemetry",
  "content",
  "seo",
  "config",
  "migrate",
  "qa",
  "uat",
  "audit",
  "codex",
];

const BOT_PREFIXES = /^(dependabot|renovate)\//;
const AUDIT_BRANCH_PATTERN = /^pr-\d+-audit$/;
const PROTECTED_BRANCHES = new Set(["main", "develop"]);
const BRANCH_PATTERN = new RegExp(
  `^(${ALLOWED_PREFIXES.join("|")})/[a-z0-9-]+$`,
);

function getArgValue(flag) {
  const index = process.argv.indexOf(flag);

  if (index === -1 || index === process.argv.length - 1) {
    return "";
  }

  return process.argv[index + 1].trim();
}

function resolveBranchName() {
  const explicitBranch = getArgValue("--branch");

  if (explicitBranch) {
    return explicitBranch;
  }

  const envBranch =
    process.env.BRANCH_NAME ||
    process.env.GITHUB_HEAD_REF ||
    process.env.GITHUB_REF_NAME ||
    "";

  if (envBranch.trim()) {
    return envBranch.trim();
  }

  try {
    return execSync("git branch --show-current", {
      stdio: ["ignore", "pipe", "ignore"],
      encoding: "utf8",
    }).trim();
  } catch (_err) {
    return "";
  }
}

function resolveBaseBranch() {
  const explicitBase = getArgValue("--base");

  if (explicitBase) {
    return explicitBase;
  }

  const envBase = process.env.GITHUB_BASE_REF || process.env.BASE_BRANCH || "";

  return envBase.trim();
}

function isAllowed(branchName) {
  return (
    PROTECTED_BRANCHES.has(branchName) ||
    BOT_PREFIXES.test(branchName) ||
    AUDIT_BRANCH_PATTERN.test(branchName) ||
    BRANCH_PATTERN.test(branchName)
  );
}

function checkBaseBranch(branchName, baseBranch) {
  if (!baseBranch) {
    return { valid: true };
  }

  if (baseBranch === "main") {
    const isReleaseOrHotfix =
      branchName.startsWith("release/") ||
      branchName.startsWith("hotfix/") ||
      PROTECTED_BRANCHES.has(branchName) ||
      BOT_PREFIXES.test(branchName);

    if (!isReleaseOrHotfix) {
      return {
        valid: false,
        message: `❌ Policy Violation: Only release/* or hotfix/* branches may merge into main. Received '${branchName}' targeting 'main'.`,
      };
    }
  }

  if (baseBranch === "develop") {
    if (branchName === "main") {
      return {
        valid: false,
        message: `❌ Policy Violation: Merging the 'main' branch back into 'develop' directly is not allowed. Received '${branchName}' targeting 'develop'.`,
      };
    }
  }

  return { valid: true };
}

function checkBranchReuse(branchName) {
  if (PROTECTED_BRANCHES.has(branchName) || BOT_PREFIXES.test(branchName)) {
    return { reused: false };
  }

  // 1. Check if the branch has already been merged into develop or main via git log
  try {
    // Search for squash merges/merges containing the branch name
    const gitCmd = `git log --all --grep="from ${branchName}" --grep="${branchName} (#" --oneline`;
    const output = execSync(gitCmd, {
      stdio: ["ignore", "pipe", "ignore"],
      encoding: "utf8",
    }).trim();

    if (output) {
      return {
        reused: true,
        reason: `Found merge/squash commits for this branch in Git log:\n${output}`,
      };
    }
  } catch {
    // Log search can fail if git history is not initialized, ignore and continue
  }

  // 2. Check CHANGELOG.md for the branch name reference
  try {
    const changelogPath = path.resolve(__dirname, "../../CHANGELOG.md");
    if (fs.existsSync(changelogPath)) {
      const changelog = fs.readFileSync(changelogPath, "utf8");
      if (changelog.includes(branchName)) {
        return {
          reused: true,
          reason: `Branch name '${branchName}' is already referenced in CHANGELOG.md.`,
        };
      }
    }
  } catch {
    // Ignore FS/path resolve errors
  }

  return { reused: false };
}

function printFailure(branchName) {
  console.error(`Branch '${branchName}' does not follow the required format.`);
  console.error(
    "Expected: {prefix}/{branch-slug} (see docs/BRANCHING_STRATEGY.md)",
  );
  console.error(`Allowed prefixes: ${ALLOWED_PREFIXES.join(", ")}`);
  console.error("Audit replay branches: pr-<number>-audit");
  console.error(
    "Examples: fix/frontmatter-validation, docs/canonical-configs-guide, ops/branch-governance-guardrails",
  );
}

function main() {
  if (
    process.env.GITHUB_REF_TYPE === "tag" ||
    (process.env.GITHUB_REF && process.env.GITHUB_REF.startsWith("refs/tags/"))
  ) {
    console.log("Running on a tag. Skipping branch name validation.");
    process.exit(0);
  }

  const branchName = resolveBranchName();
  const baseBranch = resolveBaseBranch();

  if (!branchName) {
    console.warn(
      "No active branch detected (possibly detached HEAD). Skipping branch name validation.",
    );
    process.exit(0);
  }

  // Check 1: Naming Convention
  if (!isAllowed(branchName)) {
    printFailure(branchName);
    process.exit(1);
  }

  // Check 2: Base Branch Rules
  const baseCheck = checkBaseBranch(branchName, baseBranch);
  if (!baseCheck.valid) {
    console.error(baseCheck.message);
    process.exit(1);
  }

  // Check 3: Branch Reuse Prevention
  const reuseCheck = checkBranchReuse(branchName);
  if (reuseCheck.reused) {
    console.error(
      `❌ Policy Violation: Branch '${branchName}' has already been merged or completed and cannot be reused for new work batches.`,
    );
    console.error(`Reason: ${reuseCheck.reason}`);
    process.exit(1);
  }

  console.log(
    `Branch '${branchName}' matches the repository branching strategy.`,
  );
}

if (require.main === module) {
  main();
}

// Export for unit tests
module.exports = {
  ALLOWED_PREFIXES,
  BOT_PREFIXES,
  PROTECTED_BRANCHES,
  isAllowed,
  checkBaseBranch,
  checkBranchReuse,
  resolveBranchName,
  resolveBaseBranch,
};
