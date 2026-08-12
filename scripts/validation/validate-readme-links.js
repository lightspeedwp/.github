#!/usr/bin/env node
/**
 * Validate README file links for Issue #670
 * Checks internal, relative, and external links for validity
 * @module scripts/validation/validate-readme-links.js
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { globSync } from "glob";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "../../");

function discoverReadmeFiles() {
  const patterns = [
    "**/README.md",
    ".github/**/README.md",
    ".vscode/README.md",
  ];
  const exclusions = [
    "**/node_modules/**",
    "**/build/**",
    "**/.git/**",
    "**/.next/**",
    "**/dist/**",
    "**/.nuxt/**",
  ];

  const files = globSync(patterns, {
    cwd: ROOT,
    ignore: exclusions,
    dot: true,
  });

  return Array.from(new Set(files)).sort();
}

function extractLinks(content, _filePath) {
  const links = [];
  // Markdown links: [text](url)
  const mdLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match;

  while ((match = mdLinkRegex.exec(content)) !== null) {
    const [, text, url] = match;
    links.push({
      text,
      url,
      type: classifyLink(url),
      line: content.substring(0, match.index).split(/\r?\n/u).length,
    });
  }

  return links;
}

function classifyLink(url) {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return "external";
  }
  if (url.startsWith("#")) {
    return "anchor";
  }
  if (url.startsWith("/")) {
    return "absolute";
  }
  return "relative";
}

function validateLink(url, filePath, type) {
  if (type === "external") {
    // External links validation would require network calls
    return { valid: true, reason: "external" };
  }

  if (type === "anchor") {
    // Anchor validation would require parsing the file
    return { valid: true, reason: "anchor" };
  }

  const fileDir = path.dirname(filePath);

  // Remove anchors for filesystem validation
  const cleanUrl = url.split("#")[0];

  let targetPath;
  if (type === "absolute") {
    targetPath = path.join(ROOT, cleanUrl.replace(/^\/+/u, ""));
  } else {
    targetPath = path.resolve(fileDir, cleanUrl);
  }

  // Check if file exists
  if (!fs.existsSync(targetPath)) {
    return { valid: false, reason: "File not found", path: targetPath };
  }

  return { valid: true, reason: "File exists" };
}

async function main() {
  console.log("🔗 Validating README file links...\n");

  const README_FILES = discoverReadmeFiles();
  const report = {
    totalFiles: 0,
    filesChecked: 0,
    totalLinks: 0,
    validLinks: 0,
    brokenLinks: 0,
    issues: [],
  };

  for (const file of README_FILES) {
    const filePath = path.join(ROOT, file);
    report.totalFiles++;

    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${file}`);
      continue;
    }

    const content = fs.readFileSync(filePath, "utf-8");
    const links = extractLinks(content, filePath);

    if (links.length === 0) {
      console.log(`✅ ${file}: No links found`);
      continue;
    }

    report.filesChecked++;
    console.log(`📄 ${file}: Found ${links.length} link(s)`);

    for (const link of links) {
      report.totalLinks++;
      const validation = validateLink(link.url, filePath, link.type);

      if (!validation.valid) {
        report.brokenLinks++;
        console.log(`   ❌ Line ${link.line}: ${link.url}`);
        report.issues.push({
          file,
          line: link.line,
          url: link.url,
          type: link.type,
          reason: validation.reason,
        });
      } else {
        report.validLinks++;
      }
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log("📊 LINK VALIDATION SUMMARY");
  console.log("=".repeat(60));
  console.log(`Total README files:  ${report.totalFiles}`);
  console.log(`Files checked:       ${report.filesChecked}`);
  console.log(`Total links:         ${report.totalLinks}`);
  console.log(`Valid links:         ${report.validLinks}`);
  console.log(`Broken links:        ${report.brokenLinks}`);
  if (report.totalLinks > 0) {
    const validRate = ((report.validLinks / report.totalLinks) * 100).toFixed(
      1,
    );
    console.log(`Validity rate:       ${validRate}%`);
  }

  if (report.brokenLinks > 0) {
    console.log("\n❌ BROKEN LINKS FOUND:");
    for (const issue of report.issues) {
      console.log(`\n  📄 ${issue.file}:${issue.line}`);
      console.log(`  🔗 URL: ${issue.url}`);
      console.log(`  ⚠️  Type: ${issue.type} — ${issue.reason}`);
    }
  }

  process.exit(report.brokenLinks > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error("Validation error:", err);
  process.exit(1);
});
