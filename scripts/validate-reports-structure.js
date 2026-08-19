#!/usr/bin/env node
/**
 * Validate report structure and check for uppercase filenames
 * Replaces multiline shell logic with Node.js
 */

import fs from "fs";
import path from "path";

const reportsDir = ".githu./.github/reports/metrics";

console.log("Validating report structure...");

if (!fs.existsSync(reportsDir)) {
  console.log(`Report directory not found: ${reportsDir}`);
  process.exit(0);
}

const files = fs.readdirSync(reportsDir);
let hasUppercase = false;
let hasIssues = false;

// Check for uppercase filenames
files.forEach((file) => {
  const fullPath = path.join(reportsDir, file);
  const stat = fs.statSync(fullPath);

  if (stat.isFile() && /[A-Z]/.test(file)) {
    console.warn(`⚠️ Uppercase in filename: ${file}`);
    hasUppercase = true;
  }

  // Validate structure (basic check)
  if (file.endsWith(".json") || file.endsWith(".md")) {
    try {
      if (file.endsWith(".json")) {
        JSON.parse(fs.readFileSync(fullPath, "utf8"));
      }
    } catch (_err) {
      console.error(`❌ Invalid format: ${file}`);
      hasIssues = true;
    }
  }
});

if (hasUppercase) {
  console.warn("Found files with uppercase characters in names");
}

if (hasIssues) {
  console.error("Report validation failed");
  process.exit(1);
}

console.log("✅ Report validation passed");
process.exit(0);
