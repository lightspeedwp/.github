#!/usr/bin/env node

/**
 * Badge Link Fixer
 * Identifies and fixes broken badge links in markdown files
 * Handles:
 * - Trailing special characters (>, backticks, etc.)
 * - Incomplete workflow badge URLs
 * - Invalid URL encoding
 */

import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PATTERNS = [
  {
    name: "Trailing angle brackets",
    regex: /(https?:\/\/[^>\s`]+)>(?=[\s\n]|$)/g,
    replacement: "$1",
  },
  {
    name: "Trailing backticks",
    regex: /(https?:\/\/[^`\s]+)`(?=[\s\n]|$)/g,
    replacement: "$1",
  },
  {
    name: "Incomplete workflow badge URLs (branch param)",
    regex:
      /(https?:\/\/github\.com\/[^\/]+\/[^\/]+\/actions\/workflows\/[^\s?]+\.yml)\/badge\.svg\?branch=([^\s&)]+)$/gm,
    replacement: "$1/badge.svg?branch=$2",
  },
  {
    name: "HTML encoded characters in URLs",
    regex: /(https?:\/\/[^\s%]+)%([0-9A-F]{2})/g,
    replacement: (match, url, hex) => {
      try {
        const char = String.fromCharCode(parseInt(hex, 16));
        return url + char;
      } catch {
        return match;
      }
    },
  },
];

const EXCLUDE_PATHS = [
  "node_modules",
  ".git",
  ".github/workflows", // Don't modify workflows
];

function isExcluded(filePath) {
  return EXCLUDE_PATHS.some((exclude) => filePath.includes(exclude));
}

function findMarkdownFiles(rootDir = ".") {
  const files = [];

  function walkDir(dir) {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (isExcluded(fullPath)) continue;

        if (entry.isDirectory()) {
          walkDir(fullPath);
        } else if (entry.name.endsWith(".md")) {
          files.push(fullPath);
        }
      }
    } catch (err) {
      console.error(`Error reading directory ${dir}:`, err.message);
    }
  }

  walkDir(rootDir);
  return files;
}

function extractBrokenLinks(content) {
  const brokenLinks = [];

  // Find URLs with trailing special characters
  const trailingSpecialChars = /https?:\/\/[^\s)]+[>`]/g;
  let match;
  while ((match = trailingSpecialChars.exec(content)) !== null) {
    brokenLinks.push({
      url: match[0],
      type: "trailing-special-char",
      pattern: "URL with trailing special character",
    });
  }

  // Find incomplete workflow URLs
  const incompleteWorkflow =
    /https?:\/\/github\.com\/[^\/]+\/[^\/]+\/actions\/workflows\/[^\s?]+\.yml\/badge\.svg\?branch=[^\s&)]*$/gm;
  while ((match = incompleteWorkflow.exec(content)) !== null) {
    if (!match[0].includes("develop") && !match[0].includes("main")) {
      brokenLinks.push({
        url: match[0],
        type: "incomplete-workflow",
        pattern: "Incomplete workflow badge URL",
      });
    }
  }

  return brokenLinks;
}

function fixFile(filePath) {
  console.log(`\n📄 Processing: ${filePath}`);
  let content = fs.readFileSync(filePath, "utf-8");
  const originalContent = content;
  let fixed = false;

  for (const pattern of PATTERNS) {
    const matches = content.match(pattern.regex);
    if (matches) {
      console.log(`  ✓ Fixing ${pattern.name} (${matches.length} found)`);
      content = content.replace(pattern.regex, pattern.replacement);
      fixed = true;
    }
  }

  // Check for broken links after fixes
  const brokenLinks = extractBrokenLinks(content);
  if (brokenLinks.length > 0) {
    console.log(`  ⚠️  Still has broken links:`);
    brokenLinks.forEach((link) => {
      console.log(`    - ${link.type}: ${link.url}`);
    });
  }

  if (fixed) {
    fs.writeFileSync(filePath, content, "utf-8");
    console.log(`  ✅ File updated`);
    return { file: filePath, fixed: true, brokenLinks };
  } else {
    return { file: filePath, fixed: false, brokenLinks };
  }
}

function main() {
  console.log("🔍 Badge Link Fixer - Starting...\n");

  const markdownFiles = findMarkdownFiles();
  console.log(`Found ${markdownFiles.length} markdown files\n`);

  const results = {
    fixed: [],
    broken: [],
    unchanged: [],
  };

  for (const file of markdownFiles) {
    const result = fixFile(file);

    if (result.fixed) {
      results.fixed.push(result.file);
    } else if (result.brokenLinks.length > 0) {
      results.broken.push(result.file);
    } else {
      results.unchanged.push(result.file);
    }
  }

  // Summary
  console.log("\n\n📊 Summary");
  console.log("=".repeat(60));
  console.log(`✅ Fixed: ${results.fixed.length} files`);
  console.log(`⚠️  Still broken: ${results.broken.length} files`);
  console.log(`✓ Unchanged: ${results.unchanged.length} files`);

  if (results.fixed.length > 0) {
    console.log("\nFixed files:");
    results.fixed.forEach((file) => console.log(`  - ${file}`));
  }

  if (results.broken.length > 0) {
    console.log("\nFiles with remaining broken links:");
    results.broken.forEach((file) => console.log(`  - ${file}`));
  }

  // Exit with appropriate code
  process.exit(results.broken.length > 0 ? 1 : 0);
}

main();
