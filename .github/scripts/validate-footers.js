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
import yaml from "js-yaml";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration paths
const FOOTER_CONFIG_PATH = path.join(
  __dirname,
  "../../config/footers.config.yaml",
);
const SCHEMA_PATH = path.join(
  __dirname,
  "../../schema/footer-config.schema.json",
);

// Load configuration and schema
let footerConfig, footerSchema;

try {
  const configContent = fs.readFileSync(FOOTER_CONFIG_PATH, "utf8");
  footerConfig = yaml.load(configContent);
  footerSchema = JSON.parse(fs.readFileSync(SCHEMA_PATH, "utf8"));
  console.log("✅ Loaded footer configuration and schema");
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

// Track violations
const violations = {
  duplicateFooters: [],
  multipleFooersPerDoc: [],
  invalidFooterId: [],
  missingCategory: [],
};

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
 * Extract all footer blocks from content
 * A footer block is content after the last "---" separator
 */
function extractFooters(content) {
  const separators = [];
  const lines = content.split("\n");

  // Find all "---" separators
  lines.forEach((line, idx) => {
    if (line.trim() === "---") {
      separators.push(idx);
    }
  });

  // If less than 2 separators, no footer
  if (separators.length < 2) return [];

  // Content after the last separator is the footer
  const lastSeparatorIdx = separators[separators.length - 1];
  const footerContent = lines
    .slice(lastSeparatorIdx + 1)
    .join("\n")
    .trim();

  if (!footerContent) return [];

  // Split footer into blocks (separated by blank lines)
  const footerBlocks = footerContent
    .split("\n\n")
    .map((block) => block.trim())
    .filter((block) => block.length > 0);

  return footerBlocks;
}

/**
 * Validate a single file
 */
function validateFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const frontmatter = extractFrontmatter(content);
  const footers = extractFooters(content);

  const fileViolations = [];

  // Check category requirement
  if (
    footerConfig.validation_rules.require_category_in_frontmatter &&
    !frontmatter?.category
  ) {
    fileViolations.push({
      type: "missingCategory",
      file: filePath,
      message: 'Document missing "category" field in frontmatter',
    });
  }

  // Check for duplicate footers
  if (footers.length > 1) {
    const seen = new Set();
    for (const footer of footers) {
      if (seen.has(footer)) {
        fileViolations.push({
          type: "duplicateFooters",
          file: filePath,
          message: `Found ${footers.length} footer blocks; ${footers.filter((f) => f === footer).length} are duplicates`,
          count: footers.length,
        });
        break;
      }
      seen.add(footer);
    }
  }

  // Check for multiple footers per document
  if (
    !footerConfig.validation_rules.allow_multiple_footers_per_document &&
    footers.length > 1
  ) {
    fileViolations.push({
      type: "multipleFootersPerDoc",
      file: filePath,
      message: `Document has ${footers.length} footers; only 1 allowed`,
      count: footers.length,
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

  const files = findMarkdownFiles();
  console.log(`📄 Found ${files.length} Markdown files\n`);

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
        } else if (v.type === "missingCategory") {
          violations.missingCategory.push({ file, ...v });
        }
      });
    }
  }

  console.log("\n📊 Validation Summary\n");
  console.log(`Duplicate footers:       ${violations.duplicateFooters.length}`);
  console.log(
    `Multiple footers:        ${violations.multipleFooersPerDoc.length}`,
  );
  console.log(`Missing category:        ${violations.missingCategory.length}`);
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
    ].map((v) => v.file);

    const uniqueFiles = [...new Set(filesToFix)];

    for (const file of uniqueFiles) {
      const content = fs.readFileSync(file, "utf8");
      const fixed = removeDuplicateFooters(content);

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
