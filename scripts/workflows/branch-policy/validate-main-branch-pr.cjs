#!/usr/bin/env node
/**
 * Validate that pull requests targeting main originate from release or hotfix
 * branches.
 */

const allowedPrefixes = ["release/", "hotfix/"];

function normaliseBranchName(value) {
  return String(value || "").trim().replace(/^refs\/heads\//, "");
}

function isAllowedBranch(branchName) {
  const normalised = normaliseBranchName(branchName);
  return allowedPrefixes.some((prefix) => normalised.startsWith(prefix));
}

function main() {
  const headRef = process.env.GITHUB_HEAD_REF || process.env.HEAD_REF || "";
  const baseRef = process.env.GITHUB_BASE_REF || process.env.BASE_REF || "";
  const eventName = process.env.GITHUB_EVENT_NAME || "";

  if (eventName !== "pull_request") {
    console.error("This guard only runs on pull_request events.");
    process.exit(1);
  }

  if (baseRef && baseRef !== "main") {
    console.error(`This guard only protects PRs targeting main, not '${baseRef}'.`);
    process.exit(1);
  }

  const branchName = normaliseBranchName(headRef);
  if (!branchName) {
    console.error("Missing pull request head branch name.");
    process.exit(1);
  }

  if (!isAllowedBranch(branchName)) {
    console.error(
      `Only release/* or hotfix/* branches may merge into main. Received '${branchName}'.`,
    );
    process.exit(1);
  }

  console.log(`Branch guard passed for '${branchName}'.`);
}

if (require.main === module) {
  main();
}

module.exports = { main, isAllowedBranch, normaliseBranchName };
