#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();

const ACTIVE_PATHS = [
  "README.md",
  "docs/README.md",
  "docs/FRONTMATTER_SCHEMA.md",
  "docs/PR_CREATION_PROCESS.md",
  "docs/CANONICAL_CONFIGS_GUIDE.md",
  "instructions/issues.instructions.md",
  "instructions/pull-requests.instructions.md",
  ".github/README.md",
  ".github/pull_request_template.md",
  "docs/FOOTER_REMEDIATION_GUIDE.md",
  ".github/SAVED_REPLIES/README.md",
  ".github/DISCUSSION_TEMPLATE",
  ".github/ISSUE_TEMPLATE",
  ".github/PULL_REQUEST_TEMPLATE",
  ".github/prompts/README.md",
  ".github/workflows/README.md",
  ".github/metrics/README.md",
  "scripts/agents/includes/README.md",
];

const RETIRED_DOC_RULES = [
  {
    token: "ISSUE_LABELS.md",
    replacement: "docs/LABELING.md#issue-labelling",
  },
  {
    token: "PR_LABELS.md",
    replacement: "docs/LABELING.md#pull-request-labelling",
  },
  {
    token: "AUTOMATION_GOVERNANCE.md",
    replacement: "docs/AUTOMATION.md",
  },
  {
    token: "ISSUE-FIELDS.md",
    replacement: "docs/ISSUE_FIELDS.md",
  },
];

function fail(message) {
  console.error(`[validate-retired-doc-links] ${message}`);
  process.exit(1);
}

function collectMarkdownFiles(targetPath) {
  const absolutePath = path.join(ROOT, targetPath);

  if (!fs.existsSync(absolutePath)) {
    fail(`Configured validation path does not exist: ${targetPath}`);
  }

  const stats = fs.statSync(absolutePath);
  if (stats.isFile()) {
    return absolutePath.endsWith(".md") ? [absolutePath] : [];
  }

  const files = [];
  for (const entry of fs.readdirSync(absolutePath, { withFileTypes: true })) {
    const entryPath = path.join(absolutePath, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectMarkdownFiles(path.relative(ROOT, entryPath)));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(entryPath);
    }
  }

  return files;
}

function getActiveMarkdownFiles() {
  return [
    ...new Set(
      ACTIVE_PATHS.flatMap((targetPath) => collectMarkdownFiles(targetPath)),
    ),
  ];
}

function findRetiredDocMentions(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split(/\r?\n/u);
  const findings = [];

  for (const rule of RETIRED_DOC_RULES) {
    lines.forEach((line, index) => {
      if (!line.includes(rule.token)) {
        return;
      }

      findings.push({
        filePath,
        lineNumber: index + 1,
        token: rule.token,
        replacement: rule.replacement,
      });
    });
  }

  return findings;
}

function main() {
  const findings = getActiveMarkdownFiles().flatMap((filePath) =>
    findRetiredDocMentions(filePath),
  );

  if (findings.length > 0) {
    const summary = findings
      .map((finding) => {
        const relativePath = path.relative(ROOT, finding.filePath);
        return `${relativePath}:${finding.lineNumber} references ${finding.token}; use ${finding.replacement}`;
      })
      .join("\n");

    fail(
      `Active documentation still references retired or renamed docs:\n${summary}`,
    );
  }

  console.log("[validate-retired-doc-links] OK");
}

main();
