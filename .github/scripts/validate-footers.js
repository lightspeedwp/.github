#!/usr/bin/env node

/**
 * Footer Validation Script
 *
 * Validates all Markdown files against the footer configuration schema:
 * - Detects duplicate footers
 * - Ensures each document has at most one footer
 * - Validates footer IDs against predefined list
 * - Reports violations with file paths and suggestions
 *
 * Usage:
 *   node validate-footers.js [--fix] [--report=output.json]
 *
 * Flags:
 *   --fix              Attempt to remove duplicate footers (creates backup)
 *   --report=FILE      Save violations to JSON file
 *   --verbose          Show detailed output for each file
 */

import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import * as yaml from "js-yaml";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration paths
const FOOTER_CONFIG_PATH = path.join(
  __dirname,
  "../../config/footers.config.yaml",
);

// Load configuration
let footerConfig;

try {
  const configContent = fs.readFileSync(FOOTER_CONFIG_PATH, "utf8");
  footerConfig = yaml.load(configContent);
  console.log("✅ Loaded footer configuration");
} catch (err) {
  console.error("❌ Failed to load configuration:", err.message);
  process.exit(1);
}

// Parse command-line flags
const args = process.argv.slice(2);
const shouldFix = args.includes("--fix");
const reportFile = args
  .find((arg) => arg.startsWith("--report="))
  ?.split("=")[1];
const verbose = args.includes("--verbose");
const changedOnly = args.includes("--changed-only");

// Track violations
const violations = {
  duplicateFooters: [],
  multipleFooersPerDoc: [],
  invalidFooterId: [],
  missingFooters: [],
};

const DEFAULT_FOOTER_SIGNATURES = [
  "_Maintained with",
  "_Built by",
  "_Have questions?",
  "_This page brought to you by",
  "_Docs signed by",
  "Made with 💚 by LightSpeedWP",
];

function extractFooterSignatures(config) {
  const canonicalFooters = Object.values(config?.footers || {})
    .map((footer) => footer?.template)
    .filter((template) => typeof template === "string")
    .map((template) =>
      template
        .trim()
        .split("\n")
        .map((line) => line.trim())
        .find((line) => line && line !== "---"),
    )
    .filter(Boolean);

  return [...new Set([...DEFAULT_FOOTER_SIGNATURES, ...canonicalFooters])];
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function extractFooterTail(content) {
  const lines = content.split("\n");
  const separators = [];

  lines.forEach((line, idx) => {
    if (line.trim() === "---") {
      separators.push(idx);
    }
  });

  if (separators.length === 0) {
    return "";
  }

  const tailStart = separators[separators.length - 1] + 1;
  return lines.slice(tailStart).join("\n").trim();
}

function countFooterSignatureMatches(content, config) {
  const tail = extractFooterTail(content);
  const signatures = extractFooterSignatures(config);

  return signatures.map((signature) => {
    const escaped = escapeRegExp(signature);
    const matches = tail.match(new RegExp(escaped, "g")) || [];
    return { signature, count: matches.length };
  });
}

function getDefaultFooterForCategory(category) {
  const categoryConfig = footerConfig.categories?.[category];
  const footerId = categoryConfig?.default_footer;
  const footerTemplate = footerId && footerConfig.footers?.[footerId]?.template;

  if (typeof footerTemplate === "string") {
    return footerTemplate.trimEnd();
  }

  return null;
}

function replaceFooterTail(content, footerTemplate) {
  const footerBlock = `\n---\n\n${footerTemplate.trimEnd()}\n`;
  const separators = [];
  const lines = content.split("\n");

  lines.forEach((line, idx) => {
    if (line.trim() === "---") {
      separators.push(idx);
    }
  });

  if (separators.length === 0) {
    if (content.endsWith("\n")) {
      return `${content}${footerBlock.trimStart()}`;
    }

    return `${content}\n${footerBlock.trimStart()}`;
  }

  const lastSeparatorIdx = separators[separators.length - 1];
  const contentWithoutTail = lines
    .slice(0, lastSeparatorIdx)
    .join("\n")
    .replace(/\s+$/, "");
  return `${contentWithoutTail}${footerBlock}`;
}

// Bundled/vendored skill reference material (third-party snapshots embedded
// in agent skill folders, not repo-authored) is exempt from footer
// requirements — mirrors the exclusions in eslint.config.cjs and
// scripts/validation/validate-mermaid-syntax.js.
const VENDOR_PATH_PATTERN =
  /\/(plugin-provided|platform-managed|directory-installed|agentskills-main)\//;

function inferCategory(filePath, frontmatter) {
  const normalizedForVendorCheck = filePath.replace(/\\/g, "/");
  if (VENDOR_PATH_PATTERN.test(normalizedForVendorCheck)) {
    return "";
  }

  if (
    frontmatter?.category &&
    footerConfig.categories?.[frontmatter.category]
  ) {
    return frontmatter.category;
  }

  const normalizedPath = filePath.replace(/\\/g, "/");
  const pathPatterns = [
    {
      pattern: /^\.github\/ISSUE_TEMPLATE\/.*\.md$/i,
      category: "issue-template",
    },
    {
      pattern: /^\.github\/PULL_REQUEST_TEMPLATE\/.*\.md$/i,
      category: "pull-request-template",
    },
    { pattern: /^agents\/.*\.(?:md|agent\.md)$/i, category: "agents" },
    {
      pattern: /^instructions\/.*\.md$|.*\.instructions\.md$/i,
      category: "instructions",
    },
    { pattern: /^schema\/.*\.md$|.*\.schema\.md$/i, category: "schema" },
    {
      pattern: /^\.github\/reports\/.*\.md$|.*audit.*\.md$/i,
      category: "audit",
    },
    { pattern: /.*research.*\.md$/i, category: "research" },
    {
      pattern: /^scripts\/.*\.md$|^utils\/.*\.md$|.*utility.*\.md$/i,
      category: "utility",
    },
    {
      pattern: /^docs\/.*governance.*\.md$|^governance\/.*\.md$/i,
      category: "governance",
    },
    {
      pattern: /^docs\/.*(?:automation|ai-ops).*\.md$/i,
      category: "ai-ops",
    },
    { pattern: /^docs\/.*\.md$/i, category: "docs" },
    { pattern: /^(?:.*\/)?README\.md$/i, category: "readme" },
  ];

  const match = pathPatterns.find(({ pattern }) =>
    pattern.test(normalizedPath),
  );
  return match?.category || "";
}

/**
 * Find all Markdown files in the repository
 */
function findMarkdownFiles(dir = ".") {
  let files = [];
  const items = fs.readdirSync(dir);

  for (const item of items) {
    if (["node_modules", ".git", ".github/scripts"].includes(item)) continue;

    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      files = files.concat(findMarkdownFiles(fullPath));
    } else if (item.endsWith(".md")) {
      files.push(fullPath);
    }
  }

  return files;
}

function readGitEventContext() {
  const eventPath = process.env.GITHUB_EVENT_PATH;

  if (!eventPath || !fs.existsSync(eventPath)) {
    return null;
  }

  try {
    return JSON.parse(fs.readFileSync(eventPath, "utf8"));
  } catch {
    return null;
  }
}

function getChangedMarkdownFiles() {
  let baseRef = "";
  let headRef = "";
  const event = readGitEventContext();
  const eventName = process.env.GITHUB_EVENT_NAME || "";

  if (eventName === "pull_request" || eventName === "pull_request_target") {
    baseRef = event?.pull_request?.base?.sha || "";
    headRef = event?.pull_request?.head?.sha || "";
  } else if (eventName === "push") {
    baseRef = event?.before || "";
    headRef = event?.after || "";
  }

  const diffRange =
    baseRef && headRef ? `${baseRef} ${headRef}` : "HEAD~1 HEAD";

  try {
    const output = execSync(`git diff --name-only ${diffRange} -- '*.md'`, {
      encoding: "utf8",
      maxBuffer: 1024 * 1024 * 100,
    }).trim();

    return output ? output.split("\n").filter(Boolean) : [];
  } catch {
    return findMarkdownFiles();
  }
}

/**
 * Extract YAML frontmatter from a Markdown file
 */
function extractFrontmatter(content) {
  const fmRegex = /^---\n([\s\S]*?)\n---/;
  const match = content.match(fmRegex);

  if (!match) return null;

  try {
    return yaml.load(match[1]);
  } catch {
    return null;
  }
}

/**
 * Validate a single file
 */
function validateFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const frontmatter = extractFrontmatter(content);
  const category = inferCategory(filePath, frontmatter);
  const footerMatches = countFooterSignatureMatches(content, footerConfig);
  const footerHitCounts = footerMatches.filter(({ count }) => count > 0);

  const fileViolations = [];

  if (!category) {
    return fileViolations;
  }

  // Check for duplicate footers
  const duplicateMatch = footerMatches.find(({ count }) => count > 1);
  if (duplicateMatch) {
    fileViolations.push({
      type: "duplicateFooters",
      file: filePath,
      message: `Found repeated footer signature: ${duplicateMatch.signature}`,
      count: duplicateMatch.count,
    });
  }

  // Check for missing footer
  if (
    footerConfig.validation_rules.require_footer_in_document &&
    category &&
    footerHitCounts.length === 0
  ) {
    fileViolations.push({
      type: "missingFooters",
      file: filePath,
      message: `Document is missing a branded footer for category '${category}'`,
      category,
    });
  }

  // Check for multiple footers per document
  if (
    !footerConfig.validation_rules.allow_multiple_footers_per_document &&
    footerHitCounts.length > 1
  ) {
    fileViolations.push({
      type: "multipleFootersPerDoc",
      file: filePath,
      message: `Document has ${footerHitCounts.length} footer signatures; only 1 allowed`,
      count: footerHitCounts.length,
    });
  }

  return fileViolations;
}

/**
 * Remove duplicate footers from content
 */
function removeDuplicateFooters(content) {
  const lines = content.split("\n");
  const separators = [];

  // Find all "---" separators
  lines.forEach((line, idx) => {
    if (line.trim() === "---") {
      separators.push(idx);
    }
  });

  if (separators.length < 2) return content; // No footer to process

  // Keep everything up to the last separator
  const lastSeparatorIdx = separators[separators.length - 1];
  return lines.slice(0, lastSeparatorIdx + 1).join("\n") + "\n";
}

/**
 * Main validation logic
 */
function main() {
  console.log("🔍 Scanning for Markdown files...\n");

  const files = changedOnly ? getChangedMarkdownFiles() : findMarkdownFiles();
  console.log(
    `📄 Found ${files.length} ${changedOnly ? "changed " : ""}Markdown files\n`,
  );

  let totalViolations = 0;

  for (const file of files) {
    const fileViolations = validateFile(file);

    if (fileViolations.length > 0) {
      totalViolations += fileViolations.length;

      if (verbose) {
        console.log(`⚠️  ${file}`);
        fileViolations.forEach((v) => {
          console.log(`   - ${v.type}: ${v.message}`);
        });
      }

      // Add to appropriate violation category
      fileViolations.forEach((v) => {
        if (v.type === "duplicateFooters") {
          violations.duplicateFooters.push({ file, ...v });
        } else if (v.type === "multipleFootersPerDoc") {
          violations.multipleFooersPerDoc.push({ file, ...v });
        } else if (v.type === "missingFooters") {
          violations.missingFooters.push({ file, ...v });
        }
      });
    }
  }

  console.log("\n📊 Validation Summary\n");
  console.log(`Duplicate footers:       ${violations.duplicateFooters.length}`);
  console.log(
    `Multiple footers:        ${violations.multipleFooersPerDoc.length}`,
  );
  console.log(`Missing footers:         ${violations.missingFooters.length}`);
  console.log(`Total violations:        ${totalViolations}\n`);

  // Report to file if requested
  if (reportFile) {
    fs.writeFileSync(reportFile, JSON.stringify(violations, null, 2));
    console.log(`📄 Report saved to ${reportFile}\n`);
  }

  // Fix violations if requested
  if (shouldFix && totalViolations > 0) {
    console.log("🔧 Attempting to fix violations...\n");

    const filesToFix = [
      ...violations.duplicateFooters,
      ...violations.multipleFooersPerDoc,
      ...violations.missingFooters,
    ].map((v) => v.file);

    const uniqueFiles = [...new Set(filesToFix)];

    for (const file of uniqueFiles) {
      const content = fs.readFileSync(file, "utf8");
      let fixed = removeDuplicateFooters(content);

      const frontmatter = extractFrontmatter(fixed);
      const footerCategory = inferCategory(file, frontmatter);
      const footerTemplate = footerCategory
        ? getDefaultFooterForCategory(footerCategory)
        : null;

      if (footerTemplate) {
        fixed = replaceFooterTail(fixed, footerTemplate);
      }

      // Create backup
      const backupFile = `${file}.backup`;
      fs.writeFileSync(backupFile, content);

      // Write fixed content
      fs.writeFileSync(file, fixed);
      console.log(`✅ Fixed ${file} (backup: ${backupFile})`);
    }

    console.log("\n✅ Fixes applied. Review changes and commit.\n");
  }

  // Exit with appropriate code
  if (totalViolations > 0) {
    console.log("❌ Validation failed. Fix violations or use --fix flag.\n");
    process.exit(1);
  } else {
    console.log("✅ All files validated successfully!\n");
    process.exit(0);
  }
}

main();
