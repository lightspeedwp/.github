#!/usr/bin/env node
/**
 * check-template-labels.js
 * Validates that all labels referenced in issue/PR templates exist in labels.yml
 */
// TODO: Align this helper with the latest automation spec updates.

import fs from "fs";
import { load } from "js-yaml";
import path from "path";

function resolveFromRoot(inputPath, fallbackPath) {
  const target = inputPath && inputPath.trim() ? inputPath : fallbackPath;
  return path.resolve(process.cwd(), target);
}

const LABELS_FILE = resolveFromRoot(
  process.env.LABELS_CONFIG,
  ".github/labels.yml",
);
const ISSUE_TYPES_FILE = resolveFromRoot(
  process.env.ISSUE_TYPES_CONFIG,
  ".github/issue-types.yml",
);
const ISSUE_TEMPLATE_DIR = resolveFromRoot(
  process.env.ISSUE_TEMPLATE_DIR,
  ".github/ISSUE_TEMPLATE",
);

function loadYaml(file) {
  return load(fs.readFileSync(file, "utf8"));
}

function getCanonicalLabels() {
  const labels = loadYaml(LABELS_FILE);
  return new Set(
    labels
      .map((label) =>
        typeof label === "string"
          ? label
          : typeof label === "object" && label?.name
            ? label.name
            : null,
      )
      .filter(Boolean),
  );
}

function getIssueTypeLabels() {
  const data = loadYaml(ISSUE_TYPES_FILE);
  const types = data.issue_types || [];
  const labels = new Set();
  for (const type of types) {
    if (type.label) labels.add(type.label);
    if (type.labels && Array.isArray(type.labels)) {
      for (const l of type.labels) labels.add(l);
    }
  }
  return labels;
}

function getTemplateLabels() {
  const files = fs
    .readdirSync(ISSUE_TEMPLATE_DIR)
    .filter((f) => f.endsWith(".md"));
  const labelRegex = /labels?:\s*\[([^\]]+)\]|labels?:\s*([^\n]+)/gi;
  const labels = new Set();
  for (const file of files) {
    const content = fs.readFileSync(
      path.join(ISSUE_TEMPLATE_DIR, file),
      "utf8",
    );
    let match;
    while ((match = labelRegex.exec(content))) {
      let found = match[1] || match[2];
      if (found) {
        found
          .split(",")
          .map((l) => l.replace(/['"[\]]/gu, "").trim())
          .forEach((l) => {
            if (l) labels.add(l);
          });
      }
    }
  }
  return labels;
}

function main() {
  const canonical = getCanonicalLabels();
  const issueTypeLabels = getIssueTypeLabels();
  const templateLabels = getTemplateLabels();
  const all = new Set([...issueTypeLabels, ...templateLabels]);
  const unknown = [...all].filter((l) => l && !canonical.has(l));
  if (unknown.length) {
    console.error("Unknown labels found in templates or issue-types.yml:");
    for (const l of unknown) console.error(`  - ${l}`);
    process.exit(1);
  } else {
    console.log("All template and type labels are valid.");
  }
}

main();
