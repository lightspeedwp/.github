#!/usr/bin/env node
/**
 * Validate that pull requests targeting main originate from release or hotfix
 * branches and match the expected release template shape.
 */

const fs = require("fs");

const releaseBranchPattern = /^release\/v(?<version>\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?)$/;
const hotfixBranchPattern = /^hotfix\/[a-z0-9._-]+$/i;

const releaseRequiredSections = [
  {
    name: "Linked issues & merged PRs",
    regex: /^##\s+Linked issues\s*&\s*merged PRs$/im,
  },
  {
    name: "Changelog",
    regex: /^##\s+Changelog$/im,
  },
  {
    name: "Checklist (Global DoD / PR)",
    regex: /^###\s+Checklist\s+\(Global DoD\s*\/\s*PR\)$/im,
  },
];

const hotfixRequiredSections = [
  {
    name: "Linked issues",
    regex: /^##\s+Linked issues$/im,
  },
  {
    name: "Incident / Root Cause",
    regex: /^##\s+Incident\s*\/\s*Root Cause$/im,
  },
  {
    name: "Changelog",
    regex: /^##\s+Changelog$/im,
  },
  {
    name: "Checklist (Global DoD / PR)",
    regex: /^###\s+Checklist\s+\(Global DoD\s*\/\s*PR\)$/im,
  },
];

function normaliseBranchName(value) {
  return String(value || "").trim().replace(/^refs\/heads\//, "");
}

function extractReleaseVersion(branchName) {
  const match = releaseBranchPattern.exec(normaliseBranchName(branchName));
  return match?.groups?.version || null;
}

function isReleaseBranch(branchName) {
  return extractReleaseVersion(branchName) !== null;
}

function isHotfixBranch(branchName) {
  return hotfixBranchPattern.test(normaliseBranchName(branchName));
}

function isAllowedBranch(branchName) {
  const normalised = normaliseBranchName(branchName);
  return isReleaseBranch(normalised) || isHotfixBranch(normalised);
}

function getEventPayload() {
  const eventPath = process.env.GITHUB_EVENT_PATH;
  if (!eventPath || !fs.existsSync(eventPath)) {
    return {};
  }

  try {
    return JSON.parse(fs.readFileSync(eventPath, "utf8"));
  } catch (error) {
    return { parseError: error.message };
  }
}

function findMissingSections(body, requiredSections) {
  const content = String(body || "");
  return requiredSections
    .filter((entry) => !entry.regex.test(content))
    .map((entry) => entry.name);
}

function validatePullRequestMetadata(pullRequest, branchName) {
  const findings = [];
  const normalisedBranch = normaliseBranchName(branchName);
  const releaseVersion = extractReleaseVersion(normalisedBranch);

  if (!pullRequest) {
    findings.push("Missing pull request payload.");
    return findings;
  }

  if (pullRequest.draft) {
    findings.push("PR must be marked ready for review before merging to main.");
  }

  if (normalisedBranch.startsWith("release/") && !isReleaseBranch(normalisedBranch)) {
    findings.push(
      `Release branches must use the form release/vX.Y.Z. Received '${normalisedBranch}'.`,
    );
    return findings;
  }

  if (normalisedBranch.startsWith("hotfix/") && !isHotfixBranch(normalisedBranch)) {
    findings.push(
      `Hotfix branches must use the form hotfix/<slug>. Received '${normalisedBranch}'.`,
    );
    return findings;
  }

  if (isReleaseBranch(normalisedBranch)) {
    const expectedTitle = `chore(release): v${releaseVersion}`;
    if (pullRequest.title !== expectedTitle) {
      findings.push(
        `Release PR title must be '${expectedTitle}'. Received '${pullRequest.title || "<missing>"}'.`,
      );
    }

    const missingSections = findMissingSections(
      pullRequest.body,
      releaseRequiredSections,
    );
    if (missingSections.length > 0) {
      findings.push(
        `Release PR body is missing required section(s): ${missingSections.join(", ")}.`,
      );
    }
  } else if (isHotfixBranch(normalisedBranch)) {
    const missingSections = findMissingSections(
      pullRequest.body,
      hotfixRequiredSections,
    );
    if (missingSections.length > 0) {
      findings.push(
        `Hotfix PR body is missing required section(s): ${missingSections.join(", ")}.`,
      );
    }
  }

  return findings;
}

function main() {
  const payload = getEventPayload();
  const pullRequest = payload.pull_request || null;
  const headRef =
    pullRequest?.head?.ref || process.env.GITHUB_HEAD_REF || process.env.HEAD_REF || "";
  const baseRef =
    pullRequest?.base?.ref || process.env.GITHUB_BASE_REF || process.env.BASE_REF || "";
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

  const normalisedBranch = normaliseBranchName(branchName);
  if (
    !normalisedBranch.startsWith("release/") &&
    !normalisedBranch.startsWith("hotfix/")
  ) {
    console.error(
      `Only release/* or hotfix/* branches may merge into main. Received '${branchName}'.`,
    );
    process.exit(1);
  }

  const findings = validatePullRequestMetadata(pullRequest, branchName);
  if (findings.length > 0) {
    console.error(
      `Pull request does not satisfy the release gate:\n- ${findings.join("\n- ")}`,
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
  isAllowedBranch,
  normaliseBranchName,
  extractReleaseVersion,
  isReleaseBranch,
  isHotfixBranch,
  validatePullRequestMetadata,
};
