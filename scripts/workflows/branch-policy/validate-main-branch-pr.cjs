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

function extractReleaseVersion(branchName) {
  const normalised = normaliseBranchName(branchName);
  const match = normalised.match(/^release\/v(\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?)$/);
  return match ? match[1] : null;
}

function isReleaseBranch(branchName) {
  return extractReleaseVersion(branchName) !== null;
}

function isHotfixBranch(branchName) {
  const normalised = normaliseBranchName(branchName);
  return /^hotfix\/.+/.test(normalised);
}

function validatePullRequestMetadata(pullRequest, branchName) {
  const findings = [];
  if (!pullRequest || typeof pullRequest !== "object") {
    return ["Missing pull request payload."];
  }

  const normalised = normaliseBranchName(branchName);
  const release = normalised.startsWith("release/");
  const hotfix = normalised.startsWith("hotfix/");
  const { draft = false, title = "", body = "" } = pullRequest;

  if (release && !isReleaseBranch(normalised)) {
    findings.push(
      `Release branch must match release/vX.Y.Z format. Received '${normalised}'.`,
    );
  }

  if (release && !/^chore\(release\): v\d+\.\d+\.\d+/.test(title)) {
    findings.push(
      `PR title must match "chore(release): vX.Y.Z" for release branches. Received '${title}'.`,
    );
  }

  if (hotfix && !/^hotfix:/i.test(title)) {
    findings.push(
      `PR title must start with "hotfix:" for hotfix branches. Received '${title}'.`,
    );
  }

  if (draft) {
    findings.push("Pull request must be ready for review (not a draft).");
  }

  const requiredSections = release || !hotfix
    ? ["Linked issues", "Changelog", "Checklist"]
    : ["Linked issues", "Incident / Root Cause", "Changelog", "Checklist"];
  for (const section of requiredSections) {
    if (!body.includes(section)) {
      findings.push(`Missing "${section}" section in PR body.`);
    }
  }

  return findings;
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

module.exports = {
  main,
  extractReleaseVersion,
  isAllowedBranch,
  isHotfixBranch,
  isReleaseBranch,
  normaliseBranchName,
  validatePullRequestMetadata,
};
