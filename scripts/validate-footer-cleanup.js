#!/usr/bin/env node

/**
 * Footer validation and cleanup script
 * Detects and fixes:
 * - Multiple footer blocks in a single file
 * - References/links below the footer
 * - Duplicate footer lines
 */

import fs from "fs";
import path from "path";
import { globSync } from "glob";

// Footer signature patterns to detect
const FOOTER_SIGNATURES = [
  /\*Maintained by the 🤖/,
  /\*Built by 🧱/,
  /\*Have questions\?/,
  /\*This page brought to you by/,
  /\*Docs signed by 🤖/,
  /_Maintained with ❤️/,
  /Made with 💚/,
];

// Pattern to detect footer blocks
const FOOTER_BLOCK_PATTERN = /\n---\s*\n\s*\*[^\n]*\*\s*\n/g;

// Reference patterns to detect (these should NOT appear after footer)
const REFERENCE_PATTERNS = [
  /^\s*\[.*?\]\(.*?\)\s*$/m, // Markdown links
  /^📋|^📞|^🔗|^🧠|^📖|^🔍|^💬|^👥/m, // Link lines with emojis
];

/**
 * Check if a line appears to be a reference/link
 */
function isReferenceLine(line) {
  return (
    /^\s*\[.*?\]\(.*?\)\s*$/.test(line) ||
    /^[\s]*[📋📞🔗🧠📖🔍💬👥📂📊✅]+/.test(line)
  );
}

/**
 * Extract the footer block from content
 */
function extractFooter(content) {
  const stripped = stripFrontmatter(content);
  const lastSeparatorIndex = stripped.lastIndexOf("\n---\n");

  if (lastSeparatorIndex === -1) {
    return null;
  }

  const footerContent = stripped.slice(lastSeparatorIndex + 1).trim();
  return footerContent;
}

/**
 * Strip YAML frontmatter from content
 */
function stripFrontmatter(content) {
  return content.replace(/^---\n[\s\S]*?\n---\n?/, "");
}

/**
 * Count footer blocks in content
 * Only counts actual footer blocks (near end of file)
 */
function countFooterBlocks(content) {
  const stripped = stripFrontmatter(content);
  const lastSeparatorIndex = stripped.lastIndexOf("\n---\n");

  if (lastSeparatorIndex === -1) return 0;

  // Check if there's another separator in the last 1000 chars
  const endContent = stripped.slice(Math.max(0, lastSeparatorIndex - 1000));
  const separatorsInEnd = (endContent.match(/\n---\n/g) || []).length;

  return separatorsInEnd;
}

/**
 * Detect footer issues
 */
function detectFooterIssues(filePath, content) {
  const issues = [];
  const footer = extractFooter(content);

  if (!footer) {
    return issues; // No footer
  }

  // Check for multiple actual footer blocks (multiple quirky lines after separators)
  const stripped = stripFrontmatter(content);
  const endSection = stripped.slice(Math.max(0, stripped.length - 2000)); // Check last 2KB
  const footerMatches = (endSection.match(/\n---\s*\n\s*\*[^\n]*\*/g) || []).length;
  if (footerMatches > 1) {
    issues.push({
      type: "multiple-footers",
      count: footerMatches,
      severity: "high",
    });
  }

  // Check for references below footer
  const footerLines = footer.split("\n").map((l) => l.trim());
  const mainFooterLine = footerLines[0]; // Should be the quirky line
  const restOfFooter = footerLines.slice(1).filter(Boolean);

  if (restOfFooter.length > 0) {
    // Check if remaining lines are references
    const hasReferences = restOfFooter.some(isReferenceLine);
    if (hasReferences) {
      issues.push({
        type: "references-below-footer",
        count: restOfFooter.length,
        severity: "high",
        lines: restOfFooter,
      });
    }
  }

  // Check for duplicate footer signatures
  if (/[\s\S]*\*Maintained by the 🤖[\s\S]*\*Maintained by the 🤖/.test(footer)) {
    issues.push({
      type: "duplicate-footer-lines",
      severity: "high",
    });
  }

  return issues;
}

/**
 * Clean footer: keep only the quirky line, remove references
 */
function cleanFooter(content) {
  let cleaned = content;

  // Find and extract the footer
  const stripped = stripFrontmatter(content);
  const lastSeparatorIndex = stripped.lastIndexOf("\n---\n");

  if (lastSeparatorIndex === -1) {
    return content; // No footer to clean
  }

  const prefix = content.slice(0, content.length - stripped.length);
  const beforeFooter = stripped.slice(0, lastSeparatorIndex);
  const footerContent = stripped.slice(lastSeparatorIndex + 1).trim();

  // Extract just the first non-empty line (the quirky statement)
  const footerLines = footerContent.split("\n").map((l) => l.trim());
  // Match lines starting with asterisk or emoji, ending with asterisk (or just plain text)
  const quirkyLine = footerLines.find((l) => l && (/^(\*|[^\w\s]).*\*?$/.test(l) || l.includes("*")));

  if (!quirkyLine) {
    return content; // Can't find quirky line, return unchanged
  }

  // Rebuild content with clean footer (one quirky line only)
  cleaned = `${prefix}${beforeFooter.replace(/\s+$/, "")}\n\n---\n\n${quirkyLine}\n`;

  return cleaned;
}

/**
 * Process a single file
 */
function processFile(filePath, fix = false) {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const issues = detectFooterIssues(filePath, content);

    if (issues.length === 0) {
      return null;
    }

    const result = {
      filePath,
      issues,
      fixed: false,
    };

    if (fix && issues.length > 0) {
      const cleaned = cleanFooter(content);
      if (cleaned !== content) {
        fs.writeFileSync(filePath, cleaned);
        result.fixed = true;
      }
    }

    return result;
  } catch (err) {
    return {
      filePath,
      error: err.message,
    };
  }
}

/**
 * Main scan function
 */
function scanRepo(pattern = "**/*.md", fix = false) {
  const files = globSync(pattern, {
    ignore: [
      "node_modules/**",
      ".git/**",
      "build/**",
      "dist/**",
      ".next/**",
      "coverage/**",
    ],
  });

  const results = [];

  for (const file of files) {
    const result = processFile(file, fix);
    if (result) {
      results.push(result);
    }
  }

  return results;
}

/**
 * Format results for display
 */
function formatResults(results) {
  if (results.length === 0) {
    console.log("✓ No footer issues found!");
    return;
  }

  console.log(`\nFound ${results.length} file(s) with footer issues:\n`);

  let fixed = 0;
  let errors = 0;

  for (const result of results) {
    if (result.error) {
      console.error(`❌ ${result.filePath}: ${result.error}`);
      errors++;
      continue;
    }

    console.log(`📄 ${result.filePath}`);
    for (const issue of result.issues) {
      const icon =
        issue.severity === "high"
          ? "🔴"
          : issue.severity === "medium"
            ? "🟡"
            : "🟢";
      console.log(`  ${icon} ${issue.type}`);
      if (issue.count) {
        console.log(`     Count: ${issue.count}`);
      }
      if (issue.lines) {
        console.log(`     Lines: ${issue.lines.join(", ")}`);
      }
    }

    if (result.fixed) {
      console.log("  ✅ Fixed");
      fixed++;
    }
    console.log();
  }

  if (fixed > 0) {
    console.log(`\n✅ Fixed ${fixed} file(s)`);
  }
  if (errors > 0) {
    console.log(`\n❌ ${errors} error(s) encountered`);
  }
}

// CLI
const args = process.argv.slice(2);
const fix = args.includes("--fix");
const pattern = args.find((a) => !a.startsWith("--")) || "**/*.md";

console.log(`Scanning for footer issues in: ${pattern}`);
if (fix) {
  console.log("🔧 Auto-fix enabled\n");
}

const results = scanRepo(pattern, fix);
formatResults(results);

process.exit(results.some((r) => r.error) ? 1 : 0);
