#!/usr/bin/env node

/**
 * Validate branch names against the repository branching strategy.
 *
 * @module scripts/validation/validate-branch-name
 */

const { execSync } = require("child_process");

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
];

const BOT_PREFIXES = /^(dependabot|renovate)\//;
const PROTECTED_BRANCHES = new Set(["main", "develop"]);
const BRANCH_PATTERN = new RegExp(
  `^(${ALLOWED_PREFIXES.join("|")})/[a-z0-9._-]+$`,
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
  } catch {
    return "";
  }
}

function isAllowed(branchName) {
  return (
    PROTECTED_BRANCHES.has(branchName) ||
    BOT_PREFIXES.test(branchName) ||
    BRANCH_PATTERN.test(branchName)
  );
}

function printFailure(branchName) {
  console.error(`Branch '${branchName}' does not follow the required format.`);
  console.error("Expected: {type}/{scope}-{short-title}");
  console.error(`Allowed prefixes: ${ALLOWED_PREFIXES.join(", ")}`);
  console.error(
    "Examples: fix/frontmatter-validation, docs/canonical-configs-guide, ops/branch-governance-guardrails",
  );
}

function main() {
  const branchName = resolveBranchName();

  if (!branchName) {
    console.error(
      "No branch name provided. Use --branch or set BRANCH_NAME, GITHUB_HEAD_REF, or GITHUB_REF_NAME.",
    );
    process.exit(1);
  }

  if (!isAllowed(branchName)) {
    printFailure(branchName);
    process.exit(1);
  }

  console.log(
    `Branch '${branchName}' matches the repository branching strategy.`,
  );
}

main();
