#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

function fail(message) {
  console.error(`[validate-labeling-configs] ${message}`);
  process.exit(1);
}

function loadYaml(filePath) {
  try {
    return yaml.load(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    fail(`Failed to parse ${filePath}: ${error.message}`);
  }
}

function collectLabelNames(labels) {
  return new Set(
    labels
      .filter(
        (item) =>
          item && typeof item === "object" && typeof item.name === "string",
      )
      .map((item) => item.name),
  );
}

function assertLabelConfig(labels) {
  const allowedPrefixes = [
    "status:",
    "priority:",
    "type:",
    "area:",
    "comp:",
    "lang:",
    "env:",
    "compat:",
    "cpt:",
    "ai-ops:",
    "contrib:",
    "discussion:",
    "release:",
    "meta:",
    "openspec:",
  ];

  if (!Array.isArray(labels)) {
    fail(".github/labels.yml must be an array");
  }
  labels.forEach((item, index) => {
    if (typeof item === "string") return;
    if (!item || typeof item !== "object" || typeof item.name !== "string") {
      fail(`Invalid labels.yml entry at index ${index}`);
    }
    const hasAllowedPrefix = allowedPrefixes.some((prefix) =>
      item.name.startsWith(prefix),
    );
    if (!hasAllowedPrefix) {
      fail(
        `Label '${item.name}' must use a canonical family prefix (${allowedPrefixes.join(", ")})`,
      );
    }
  });
}

function assertIssueTypeConfig(issueTypes) {
  if (!issueTypes || !Array.isArray(issueTypes.issue_types)) {
    fail(".github/issue-types.yml must include an issue_types array");
  }
  issueTypes.issue_types.forEach((item, index) => {
    if (!item || typeof item !== "object") {
      fail(`Invalid issue type entry at index ${index}`);
    }
    if (typeof item.name !== "string" || typeof item.label !== "string") {
      fail(`Issue type at index ${index} must include name and label`);
    }
  });
}

function assertLabelerConfig(labeler) {
  if (!labeler || typeof labeler !== "object" || Array.isArray(labeler)) {
    fail(".github/labeler.yml must be an object map");
  }

  for (const [label, rules] of Object.entries(labeler)) {
    if (!rules || typeof rules !== "object" || Array.isArray(rules)) {
      fail(`Rule for '${label}' must be an object`);
    }

    const hasHeadBranch = Object.prototype.hasOwnProperty.call(
      rules,
      "head-branch",
    );
    const hasChangedFiles = Object.prototype.hasOwnProperty.call(
      rules,
      "changed-files",
    );

    if (!hasHeadBranch && !hasChangedFiles) {
      fail(
        `Rule for '${label}' must include at least one of 'head-branch' or 'changed-files'`,
      );
    }
  }
}

function assertLabelerParity(labeler, labelNames) {
  const emittedLabels = Object.keys(labeler || {});
  const missingLabels = emittedLabels.filter((label) => !labelNames.has(label));

  if (missingLabels.length > 0) {
    fail(
      `.github/labeler.yml emits labels not defined in .github/labels.yml (${missingLabels.length}): ${missingLabels.join(", ")}`,
    );
  }
}

function assertGovernancePolicy(policy) {
  if (!policy || typeof policy !== "object" || Array.isArray(policy)) {
    fail(".github/label-governance-policy.yml must be an object");
  }

  const cleanup = policy.destructive_cleanup;
  if (!cleanup || typeof cleanup !== "object" || Array.isArray(cleanup)) {
    fail(
      ".github/label-governance-policy.yml must include destructive_cleanup object",
    );
  }

  if (typeof cleanup.enabled !== "boolean") {
    fail("destructive_cleanup.enabled must be a boolean");
  }

  if (
    cleanup.approved_orphan_labels !== undefined &&
    !Array.isArray(cleanup.approved_orphan_labels)
  ) {
    fail("destructive_cleanup.approved_orphan_labels must be an array");
  }

  if (
    cleanup.never_delete_labels !== undefined &&
    !Array.isArray(cleanup.never_delete_labels)
  ) {
    fail("destructive_cleanup.never_delete_labels must be an array");
  }
}

const root = process.cwd();
const labels = loadYaml(path.join(root, ".github/labels.yml"));
const issueTypes = loadYaml(path.join(root, ".github/issue-types.yml"));
const labeler = loadYaml(path.join(root, ".github/labeler.yml"));
const governancePolicy = loadYaml(
  path.join(root, ".github/label-governance-policy.yml"),
);

assertLabelConfig(labels);
assertIssueTypeConfig(issueTypes);
assertLabelerConfig(labeler);
assertLabelerParity(labeler, collectLabelNames(labels));
assertGovernancePolicy(governancePolicy);

console.log("[validate-labeling-configs] OK");
