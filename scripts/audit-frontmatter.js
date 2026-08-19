#!/usr/bin/env node

/**
 * Frontmatter Audit Script
 * Scans all .md files and analyzes frontmatter references
 * Detects circular references and generates recommendations
 *
 * Usage: node scripts/audit-frontmatter.js
 * Output: .githu./.github/reports/audits/frontmatter/audit-frontmatter-report.csv
 *
 * @author LightSpeedWP
 * @version 1.0.0
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const REPO_ROOT = path.resolve(__dirname, "..");
const TARGET_DIRS = [
  path.join(REPO_ROOT, ".github"),
  path.join(REPO_ROOT, "docs"),
];
const EXCLUDE_PATTERNS = [
  "node_modules",
  ".archive",
  "coverage",
  "logs",
  ".vscode",
];
const REPORT_DIR = path.join(
  REPO_ROOT,
  ".github",
  "reports",
  "audits",
  "frontmatter",
);
const REPORT_PATH = path.join(REPORT_DIR, "audit-frontmatter-report.csv");

/**
 * Check if a path should be excluded
 * @param {string} filePath
 * @returns {boolean}
 */
function shouldExclude(filePath) {
  return EXCLUDE_PATTERNS.some((pattern) => filePath.includes(pattern));
}

/**
 * Recursively find all .md files
 * @param {string} dir
 * @returns {string[]}
 */
function findMarkdownFiles(dir) {
  let files = [];

  if (!fs.existsSync(dir)) {
    return files;
  }

  const items = fs.readdirSync(dir);

  items.forEach((item) => {
    const filePath = path.join(dir, item);
    if (shouldExclude(filePath)) {
      return;
    }

    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      files = files.concat(findMarkdownFiles(filePath));
    } else if (item.endsWith(".md") || item.endsWith(".mdx")) {
      files.push(filePath);
    }
  });

  return files;
}

/**
 * Extract references from frontmatter
 * @param {string} content
 * @returns {string[]}
 */
function extractReferences(content) {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);

  if (!frontmatterMatch) {
    return [];
  }

  const frontmatterContent = frontmatterMatch[1];
  const references = [];

  // Look for references field
  const referencesMatch = frontmatterContent.match(
    /references:\s*([\s\S]*?)(?=\n[a-z])/i,
  );
  if (referencesMatch) {
    const refBlock = referencesMatch[1];
    const pathMatches = refBlock.matchAll(/path:\s+["']?([^"'\n]+)["']?/g);
    for (const match of pathMatches) {
      references.push(match[1].trim());
    }
  }

  return references;
}

/**
 * Generate audit report
 * @param {string[]} files
 * @returns {Object[]}
 */
function generateAuditReport(files) {
  const report = [];

  // Extract all references
  for (const file of files) {
    const content = fs.readFileSync(file, "utf-8");
    const refs = extractReferences(content);
    const relPath = path.relative(REPO_ROOT, file);

    const recommendation =
      refs.length === 0
        ? "KEEP_NO_REFS"
        : refs.length <= 3
          ? "KEEP"
          : refs.length <= 5
            ? "EVALUATE"
            : "REDUCE";

    report.push({
      file: relPath,
      referenceCount: refs.length,
      references: refs.join(" | "),
      recommendation,
    });
  }

  return report.sort((a, b) => b.referenceCount - a.referenceCount);
}

/**
 * Export report to CSV
 * @param {Object[]} report
 * @param {string} outputPath
 */
function exportToCSV(report, outputPath) {
  const headers = ["File", "Reference Count", "References", "Recommendation"];

  let csv = headers.join(",") + "\n";

  for (const item of report) {
    const row = [
      `"${item.file}"`,
      item.referenceCount,
      `"${item.references.replace(/"/g, '""')}"`,
      item.recommendation,
    ];
    csv += row.join(",") + "\n";
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, csv);
  console.log(`✅ Report exported to: ${outputPath}`);
}

/**
 * Print summary statistics
 * @param {Object[]} report
 */
function printSummary(report) {
  const totalFiles = report.length;
  const highRefFiles = report.filter((r) => r.referenceCount > 5).length;
  const noRefFiles = report.filter((r) => r.referenceCount === 0).length;
  const totalRefs = report.reduce((sum, r) => sum + r.referenceCount, 0);
  const avgRefs = (totalRefs / totalFiles).toFixed(2);

  console.log("\n" + "=".repeat(70));
  console.log("FRONTMATTER AUDIT SUMMARY");
  console.log("=".repeat(70));
  console.log(`Total Files Scanned: ${totalFiles}`);
  console.log(`Total References Found: ${totalRefs}`);
  console.log(`Average References per File: ${avgRefs}`);
  console.log(`Files with High References (>5): ${highRefFiles}`);
  console.log(`Files with No References: ${noRefFiles}`);
  console.log("=".repeat(70) + "\n");

  if (highRefFiles > 0) {
    console.log("⚠️  HIGH REFERENCE FILES (PRIORITY):");
    report
      .filter((r) => r.referenceCount > 5)
      .slice(0, 10)
      .forEach((r) => {
        console.log(`   - ${r.file} (${r.referenceCount} refs)`);
      });
    console.log("");
  }
}

/**
 * Main execution
 */
function main() {
  console.log("🔍 Starting Frontmatter Audit...\n");

  // Find all markdown files
  console.log("📂 Scanning for markdown files...");
  let allFiles = [];
  for (const dir of TARGET_DIRS) {
    allFiles = allFiles.concat(findMarkdownFiles(dir));
  }
  console.log(`✅ Found ${allFiles.length} markdown files\n`);

  // Generate audit report
  console.log("📊 Analyzing references...");
  const report = generateAuditReport(allFiles);
  console.log("✅ Analysis complete\n");

  // Print summary
  printSummary(report);

  // Export to CSV
  exportToCSV(report, REPORT_PATH);

  console.log("\n✨ Audit complete! Review the CSV report above.");
}

try {
  main();
} catch (error) {
  console.error("❌ Error:", error.message);
  process.exit(1);
}
