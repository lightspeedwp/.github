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

function assertLabelConfig(labels) {
  if (!Array.isArray(labels)) {
    fail(".github/labels.yml must be an array");
  }
  labels.forEach((item, index) => {
    if (typeof item === "string") return;
    if (!item || typeof item !== "object" || typeof item.name !== "string") {
      fail(`Invalid labels.yml entry at index ${index}`);
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

const root = process.cwd();
const labels = loadYaml(path.join(root, ".github/labels.yml"));
const issueTypes = loadYaml(path.join(root, ".github/issue-types.yml"));
const labeler = loadYaml(path.join(root, ".github/labeler.yml"));

assertLabelConfig(labels);
assertIssueTypeConfig(issueTypes);
assertLabelerConfig(labeler);

console.log("[validate-labeling-configs] OK");
