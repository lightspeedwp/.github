#!/usr/bin/env node
/**
 * check-template-labels.js
 * Validates issue-template frontmatter, canonical labels, and template-to-type mappings.
 */

import fs from "fs";
import * as yaml from "js-yaml";
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

const TEMPLATE_TYPE_MAP = {
  "01-task.md": {
    primaryType: "type:task",
  },
  "02-bug.md": {
    primaryType: "type:bug",
  },
  "03-feature.md": {
    primaryType: "type:feature",
    secondaryTypes: ["type:enhancement"],
  },
  "04-design.md": {
    primaryType: "type:design",
    secondaryTypes: ["type:ui", "type:a11y"],
  },
  "05-epic.md": {
    primaryType: "type:epic",
  },
  "06-story.md": {
    primaryType: "type:story",
  },
  "07-improvement.md": {
    primaryType: "type:improve",
    secondaryTypes: ["type:enhancement"],
  },
  "08-chore.md": {
    primaryType: "type:chore",
    secondaryTypes: ["type:maintenance"],
  },
  "09-code-refactor.md": {
    primaryType: "type:refactor",
    secondaryTypes: ["type:maintenance", "type:chore"],
  },
  "10-build-ci.md": {
    primaryType: "type:build",
    secondaryTypes: ["type:ci"],
  },
  "11-automation.md": {
    primaryType: "type:automation",
  },
  "12-testing-coverage.md": {
    primaryType: "type:test",
    secondaryTypes: ["type:qa"],
  },
  "13-performance.md": {
    primaryType: "type:performance",
  },
  "14-a11y.md": {
    primaryType: "type:a11y",
  },
  "15-security.md": {
    primaryType: "type:security",
  },
  "16-compatibility.md": {
    primaryType: "type:compatibility",
  },
  "17-integration-issue.md": {
    primaryType: "type:integration",
    secondaryTypes: ["type:dependency"],
  },
  "18-release.md": {
    primaryType: "type:release",
  },
  "19-maintenance.md": {
    primaryType: "type:maintenance",
    secondaryTypes: ["type:chore"],
  },
  "20-documentation.md": {
    primaryType: "type:documentation",
  },
  "21-research.md": {
    primaryType: "type:research",
    secondaryTypes: ["type:investigation"],
  },
  "22-audit.md": {
    primaryType: "type:audit",
  },
  "23-code-review.md": {
    primaryType: "type:review",
  },
  "24-ai-ops.md": {
    primaryType: "type:ai-ops",
  },
  "25-content-modelling.md": {
    primaryType: "type:content-modelling",
  },
};

function loadYaml(file) {
  return yaml.load(fs.readFileSync(file, "utf8"));
}

function extractFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) {
    return null;
  }

  try {
    return yaml.load(match[1]) || {};
  } catch (error) {
    return { __error: error.message };
  }
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
    .filter((f) => /^\d{2}-.+\.md$/u.test(f));
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

function normaliseTemplateLabels(labelsValue) {
  if (!labelsValue) {
    return [];
  }

  if (Array.isArray(labelsValue)) {
    return labelsValue.flatMap((label) =>
      typeof label === "string" ? [label.trim()] : [],
    );
  }

  if (typeof labelsValue === "string") {
    return labelsValue
      .split(",")
      .map((label) => label.replace(/['"[\]]/gu, "").trim())
      .filter(Boolean);
  }

  return [];
}

function validateTemplateFrontmatter(
  file,
  frontmatter,
  canonicalLabels,
  issueTypeLabels,
) {
  const requiredKeys = [
    "file_type",
    "name",
    "about",
    "version",
    "last_updated",
    "category",
  ];

  if (!frontmatter) {
    throw new Error(`Missing YAML frontmatter in ${file}`);
  }

  if (frontmatter.__error) {
    throw new Error(
      `Invalid YAML frontmatter in ${file}: ${frontmatter.__error}`,
    );
  }

  for (const key of requiredKeys) {
    if (!frontmatter[key]) {
      throw new Error(`Missing required frontmatter key "${key}" in ${file}`);
    }
  }

  if (frontmatter.file_type !== "issue-template") {
    throw new Error(
      `Unexpected file_type in ${file}: expected "issue-template", found "${frontmatter.file_type}"`,
    );
  }

  if (Object.prototype.hasOwnProperty.call(frontmatter, "description")) {
    throw new Error(
      `Issue template frontmatter in ${file} must use "about" instead of "description"`,
    );
  }

  const declaredLabels = normaliseTemplateLabels(frontmatter.labels);
  const declaredTypes = normaliseTemplateLabels(frontmatter.type).filter(
    (label) => label.startsWith("type:"),
  );

  for (const label of declaredLabels) {
    if (label && !canonicalLabels.has(label)) {
      throw new Error(`Unknown label "${label}" referenced in ${file}`);
    }
  }

  for (const typeLabel of declaredTypes) {
    if (!issueTypeLabels.has(typeLabel)) {
      throw new Error(
        `Unknown issue type "${typeLabel}" referenced in ${file}`,
      );
    }
  }
}

function main() {
  const canonical = getCanonicalLabels();
  const issueTypeLabels = getIssueTypeLabels();
  const templateLabels = getTemplateLabels();
  const templateFiles = fs
    .readdirSync(ISSUE_TEMPLATE_DIR)
    .filter((f) => /^\d{2}-.+\.md$/u.test(f));
  const all = new Set([...issueTypeLabels, ...templateLabels]);
  const unknown = [...all].filter((l) => l && !canonical.has(l));
  if (unknown.length) {
    console.error("Unknown labels found in templates or issue-types.yml:");
    for (const l of unknown) console.error(`  - ${l}`);
    process.exit(1);
  }

  const templateMapEntries = Object.entries(TEMPLATE_TYPE_MAP);
  const missingMappedFiles = templateFiles.filter(
    (file) => !TEMPLATE_TYPE_MAP[file],
  );
  if (missingMappedFiles.length > 0) {
    console.error("Missing template-to-type mapping entries:");
    for (const file of missingMappedFiles) console.error(`  - ${file}`);
    process.exit(1);
  }

  const mappedTypes = new Set();
  for (const [file, mapping] of templateMapEntries) {
    mappedTypes.add(mapping.primaryType);
    for (const secondaryType of mapping.secondaryTypes || []) {
      mappedTypes.add(secondaryType);
    }

    const content = fs.readFileSync(
      path.join(ISSUE_TEMPLATE_DIR, file),
      "utf8",
    );
    const frontmatter = extractFrontmatter(content);
    validateTemplateFrontmatter(file, frontmatter, canonical, issueTypeLabels);

    const declaredTypes = [
      ...normaliseTemplateLabels(frontmatter?.type).filter((label) =>
        label.startsWith("type:"),
      ),
      ...normaliseTemplateLabels(frontmatter?.labels).filter((label) =>
        label.startsWith("type:"),
      ),
    ];

    if (declaredTypes.length > 0) {
      const allowedTypes = new Set([
        mapping.primaryType,
        ...(mapping.secondaryTypes || []),
      ]);

      const invalidTypes = declaredTypes.filter(
        (typeLabel) => !allowedTypes.has(typeLabel),
      );
      if (invalidTypes.length > 0) {
        console.error(`Unexpected template-to-type mapping in ${file}:`);
        for (const typeLabel of invalidTypes) console.error(`  - ${typeLabel}`);
        process.exit(1);
      }
    }
  }

  const unknownMappedTypes = [...mappedTypes].filter(
    (typeLabel) => !issueTypeLabels.has(typeLabel),
  );
  if (unknownMappedTypes.length > 0) {
    console.error("Template map references unknown issue types:");
    for (const typeLabel of unknownMappedTypes)
      console.error(`  - ${typeLabel}`);
    process.exit(1);
  }

  console.log("All template frontmatter, labels, and type mappings are valid.");
}

main();
