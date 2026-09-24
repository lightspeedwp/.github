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
    // actions/labeler v5+ schema: label -> array of match objects. The
    // pinned v7 rejects anything else outright ("should be array of config
    // options"), so this validator does too. In particular the legacy
    // mapping form ({changed-files: {...}} directly under the label) is
    // rejected here (#3545).
    if (!Array.isArray(rules) || rules.length === 0) {
      fail(
        `Rule for '${label}' must be a non-empty array of match objects (v5+ list form with 'changed-files' / 'head-branch' entries)`,
      );
    }
    const ruleList = rules;
    if (ruleList.some((r) => !r || typeof r !== "object" || Array.isArray(r))) {
      fail(`Rule for '${label}' must be an object or an array of objects`);
    }

    for (const rule of ruleList) {
      for (const key of Object.keys(rule)) {
        if (!ALLOWED_RULE_KEYS.includes(key)) {
          fail(
            `Rule for '${label}' uses unknown match key '${key}' (allowed: ${ALLOWED_RULE_KEYS.join(", ")})`,
          );
        }
      }
      const hasHeadBranch = Object.prototype.hasOwnProperty.call(
        rule,
        "head-branch",
      );
      const hasChangedFiles = Object.prototype.hasOwnProperty.call(
        rule,
        "changed-files",
      );

      if (!hasHeadBranch && !hasChangedFiles) {
        fail(
          `Rule for '${label}' must include at least one of 'head-branch' or 'changed-files'`,
        );
      }
      if (hasHeadBranch) assertHeadBranchShape(label, rule);
      if (hasChangedFiles) assertChangedFilesShape(label, rule);
      for (const group of ["all", "any"]) {
        if (Object.prototype.hasOwnProperty.call(rule, group)) {
          const members = rule[group];
          if (!Array.isArray(members) || members.length === 0) {
            fail(`Rule for '${label}' group '${group}' must be a non-empty array`);
          }
        }
      }
    }
  }
}

// Match keys accepted by the pinned actions/labeler inside one rule object.
const ALLOWED_RULE_KEYS = ["changed-files", "head-branch", "all", "any"];
const ALLOWED_CHANGED_FILES_KEYS = [
  "any-glob-to-any-file",
  "any-glob-to-all-files",
  "all-globs-to-any-file",
  "all-globs-to-all-files",
];

function assertChangedFilesShape(label, rule) {
  const value = rule["changed-files"];
  // In the v5+ list form each rule object's 'changed-files' is a matcher
  // map ({any-glob-to-any-file: [...]}), never a bare array or scalar.
  // actions/labeler v7 drops anything else for the rule, so reject it
  // here instead of letting CI silently ignore file rules (#3545).
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    fail(
      `Rule for '${label}' must use the matcher-map form of 'changed-files' (e.g. any-glob-to-any-file: [...])`,
    );
  }
  const entries = Object.entries(value);
  if (entries.length === 0) {
    fail(`Rule for '${label}' has an empty 'changed-files' matcher map`);
  }
  for (const [key, globs] of entries) {
    if (!ALLOWED_CHANGED_FILES_KEYS.includes(key)) {
      fail(
        `Rule for '${label}' uses unknown changed-files matcher '${key}' (allowed: ${ALLOWED_CHANGED_FILES_KEYS.join(", ")})`,
      );
    }
    if (
      !Array.isArray(globs) ||
      globs.length === 0 ||
      globs.some((g) => typeof g !== "string" || g.length === 0)
    ) {
      fail(
        `Rule for '${label}' matcher '${key}' must list at least one glob string`,
      );
    }
  }
}

function assertHeadBranchShape(label, rule) {
  const value = rule["head-branch"];
  const list = Array.isArray(value) ? value : [value];
  if (
    list.length === 0 ||
    list.some((p) => typeof p !== "string" || p.length === 0)
  ) {
    fail(`Rule for '${label}' must list at least one head-branch pattern`);
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

function assertBranchLabelsParity(branchLabels, labelNames) {
  const mapping = (branchLabels || {}).branch_labels || {};
  const bad = [];
  for (const [branchType, config] of Object.entries(mapping)) {
    for (const label of (config && config.default_labels) || []) {
      if (!labelNames.has(label)) {
        bad.push(`${branchType} -> ${label}`);
      }
    }
  }
  if (bad.length > 0) {
    fail(
      `.github/branch-labels.yml default_labels not defined in .github/labels.yml (${bad.length}): ${bad.join(", ")}`,
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
const branchLabels = loadYaml(path.join(root, ".github/branch-labels.yml"));
const governancePolicy = loadYaml(
  path.join(root, ".github/label-governance-policy.yml"),
);

assertLabelConfig(labels);
assertIssueTypeConfig(issueTypes);
assertLabelerConfig(labeler);
assertLabelerParity(labeler, collectLabelNames(labels));
assertBranchLabelsParity(branchLabels, collectLabelNames(labels));
assertGovernancePolicy(governancePolicy);

console.log("[validate-labeling-configs] OK");
