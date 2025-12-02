#!/usr/bin/env node
/**
 * migrate-chatmodes.mjs
 *
 * Migration script to convert .chatmode.md files to .agent.md format
 * following VS Code's terminology change in v1.106+.
 *
 * Usage:
 *   node scripts/migrate-chatmodes.mjs --dry-run    # Preview changes
 *   node scripts/migrate-chatmodes.mjs              # Execute migration
 *   node scripts/migrate-chatmodes.mjs --verbose    # Detailed output
 *
 * @author LightSpeedWP Team
 * @version 1.0.0
 * @since 2025-12-01
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");

// Configuration
const CONFIG = {
  sourceDir: path.join(ROOT_DIR, ".github/chatmodes"),
  targetDir: path.join(ROOT_DIR, ".github/agents"),
  dryRun: process.argv.includes("--dry-run"),
  verbose: process.argv.includes("--verbose"),
  force: process.argv.includes("--force"),
};

// Migration results tracking
const results = {
  migrated: [],
  skipped: [],
  conflicts: [],
  errors: [],
};

/**
 * Log message with optional verbosity check
 * @param {string} message - Message to log
 * @param {boolean} verboseOnly - Only log if verbose mode is enabled
 */
function log(message, verboseOnly = false) {
  if (!verboseOnly || CONFIG.verbose) {
    console.log(message);
  }
}

/**
 * Convert chatmode filename to agent filename
 * @param {string} filename - Original chatmode filename
 * @returns {string} New agent filename
 */
function convertFilename(filename) {
  // Handle various naming patterns
  let newName = filename
    // Replace .chatmode.md with .agent.md
    .replace(/\.chatmode\.md$/, ".agent.md")
    // Replace .chatmodes.md with .agent.md (for index files)
    .replace(/\.chatmodes\.md$/, ".agent.md")
    // Handle template.* pattern -> template-*
    .replace(/^template\./, "template-")
    // Convert to lowercase
    .toLowerCase()
    // Fix any double dashes
    .replace(/--+/g, "-");

  return newName;
}

/**
 * Transform frontmatter from chatmode format to agent format
 * @param {string} content - File content
 * @returns {string} Transformed content
 */
function transformFrontmatter(content) {
  // Extract frontmatter
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) {
    return content;
  }

  const frontmatter = frontmatterMatch[1];
  const body = content.slice(frontmatterMatch[0].length);

  // Parse frontmatter lines
  const lines = frontmatter.split("\n");
  const newLines = [];
  let hasName = false;
  let hasDescription = false;
  let titleValue = null;
  let idValue = null;

  for (const line of lines) {
    // Skip file_type: chatmode (we'll add the new one)
    if (line.match(/^file_type:\s*["']?chatmode["']?/)) {
      newLines.push('file_type: "agent"');
      continue;
    }

    // Convert id to name
    if (line.match(/^id:\s*/)) {
      idValue = line
        .replace(/^id:\s*/, "")
        .replace(/["']/g, "")
        .trim();
      continue;
    }

    // Keep title but also use it for name if no name exists
    if (line.match(/^title:\s*/)) {
      titleValue = line
        .replace(/^title:\s*/, "")
        .replace(/["']/g, "")
        .trim();
      // Keep title for backward compatibility
      newLines.push(line);
      continue;
    }

    // Check for existing name
    if (line.match(/^name:\s*/)) {
      hasName = true;
    }

    // Check for description
    if (line.match(/^description:\s*/)) {
      hasDescription = true; // eslint-disable-line no-unused-vars
    }

    // Pass through other lines
    newLines.push(line);
  }

  // Add name field if not present (use title or id)
  if (!hasName && (titleValue || idValue)) {
    const nameValue = titleValue || idValue;
    // Insert name after file_type
    const fileTypeIndex = newLines.findIndex((l) => l.startsWith("file_type:"));
    if (fileTypeIndex !== -1) {
      newLines.splice(fileTypeIndex + 1, 0, `name: "${nameValue}"`);
    } else {
      newLines.unshift(`name: "${nameValue}"`);
    }
  }

  // Reconstruct the content
  return `---\n${newLines.join("\n")}\n---${body}`;
}

/**
 * Check if target file already exists
 * @param {string} targetPath - Target file path
 * @returns {boolean} True if conflict exists
 */
function checkConflict(targetPath) {
  return fs.existsSync(targetPath);
}

/**
 * Migrate a single file
 * @param {string} sourcePath - Source file path
 * @param {string} targetPath - Target file path
 */
function migrateFile(sourcePath, targetPath) {
  const relativeSrc = path.relative(ROOT_DIR, sourcePath);
  const relativeTgt = path.relative(ROOT_DIR, targetPath);

  log(`Processing: ${relativeSrc}`, true);

  // Check for conflict
  if (checkConflict(targetPath) && !CONFIG.force) {
    log(`  ⚠️  Conflict: ${relativeTgt} already exists`);
    results.conflicts.push({ source: relativeSrc, target: relativeTgt });
    return;
  }

  try {
    // Read source file
    const content = fs.readFileSync(sourcePath, "utf-8");

    // Transform content
    const transformedContent = transformFrontmatter(content);

    if (CONFIG.dryRun) {
      log(`  📋 Would migrate: ${relativeSrc} → ${relativeTgt}`);
      results.migrated.push({ source: relativeSrc, target: relativeTgt });
    } else {
      // Write to target
      fs.writeFileSync(targetPath, transformedContent, "utf-8");
      log(`  ✅ Migrated: ${relativeSrc} → ${relativeTgt}`);
      results.migrated.push({ source: relativeSrc, target: relativeTgt });
    }
  } catch (error) {
    log(`  ❌ Error: ${error.message}`);
    results.errors.push({ source: relativeSrc, error: error.message });
  }
}

/**
 * Process a directory recursively
 * @param {string} dir - Directory to process
 * @param {string} subPath - Subdirectory path relative to sourceDir
 */
function processDirectory(dir, subPath = "") {
  if (!fs.existsSync(dir)) {
    log(`Directory not found: ${dir}`);
    return;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      // Process subdirectory
      processDirectory(sourcePath, path.join(subPath, entry.name));
    } else if (
      entry.name.endsWith(".chatmode.md") ||
      entry.name.endsWith(".chatmodes.md")
    ) {
      // Convert filename
      const newFilename = convertFilename(entry.name);

      // Determine target path
      let targetPath;
      if (subPath) {
        // For awesome-copilot subdirectory, put in agents/awesome-copilot/
        const targetSubDir = path.join(CONFIG.targetDir, subPath);
        if (!CONFIG.dryRun && !fs.existsSync(targetSubDir)) {
          fs.mkdirSync(targetSubDir, { recursive: true });
        }
        targetPath = path.join(targetSubDir, newFilename);
      } else {
        targetPath = path.join(CONFIG.targetDir, newFilename);
      }

      migrateFile(sourcePath, targetPath);
    } else if (
      entry.name === "README.md" ||
      entry.name === "index.chatmode.md"
    ) {
      // Skip index files for now, will handle separately
      log(`  ⏭️  Skipping index file: ${entry.name}`, true);
      results.skipped.push(path.join(subPath, entry.name));
    }
  }
}

/**
 * Delete source files after successful migration
 */
function cleanupSourceFiles() {
  if (CONFIG.dryRun) {
    log("\n📋 Would delete source files after migration");
    return;
  }

  log("\n🧹 Cleaning up source files...");

  for (const { source } of results.migrated) {
    const sourcePath = path.join(ROOT_DIR, source);
    try {
      fs.unlinkSync(sourcePath);
      log(`  🗑️  Deleted: ${source}`, true);
    } catch (error) {
      log(`  ❌ Failed to delete ${source}: ${error.message}`);
    }
  }
}

/**
 * Remove empty directories
 * @param {string} dir - Directory to check
 */
function removeEmptyDirectories(dir) {
  if (!fs.existsSync(dir)) return;

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  // First, recurse into subdirectories
  for (const entry of entries) {
    if (entry.isDirectory()) {
      removeEmptyDirectories(path.join(dir, entry.name));
    }
  }

  // Check if directory is now empty
  const remainingEntries = fs.readdirSync(dir);
  if (remainingEntries.length === 0) {
    if (CONFIG.dryRun) {
      log(`📋 Would remove empty directory: ${path.relative(ROOT_DIR, dir)}`);
    } else {
      fs.rmdirSync(dir);
      log(`🗑️  Removed empty directory: ${path.relative(ROOT_DIR, dir)}`);
    }
  }
}

/**
 * Generate migration report
 */
function generateReport() {
  const reportPath = path.join(
    ROOT_DIR,
    ".github/reports/chatmode-migration-report.md",
  );

  const report = `---
file_type: "documentation"
title: "Chatmode to Agent Migration Report"
description: "Results of the chatmode to agent migration"
created_date: "${new Date().toISOString().split("T")[0]}"
last_updated: "${new Date().toISOString().split("T")[0]}"
---

# Chatmode to Agent Migration Report

**Generated:** ${new Date().toISOString()}
**Mode:** ${CONFIG.dryRun ? "Dry Run" : "Executed"}

## Summary

| Category | Count |
|----------|-------|
| Migrated | ${results.migrated.length} |
| Skipped | ${results.skipped.length} |
| Conflicts | ${results.conflicts.length} |
| Errors | ${results.errors.length} |

## Migrated Files

${
  results.migrated.length > 0
    ? results.migrated
        .map((f) => `- \`${f.source}\` → \`${f.target}\``)
        .join("\n")
    : "_No files migrated_"
}

## Skipped Files

${
  results.skipped.length > 0
    ? results.skipped.map((f) => `- \`${f}\``).join("\n")
    : "_No files skipped_"
}

## Conflicts

${
  results.conflicts.length > 0
    ? results.conflicts
        .map((f) => `- \`${f.source}\` conflicts with existing \`${f.target}\``)
        .join("\n")
    : "_No conflicts detected_"
}

## Errors

${
  results.errors.length > 0
    ? results.errors.map((f) => `- \`${f.source}\`: ${f.error}`).join("\n")
    : "_No errors occurred_"
}

## Next Steps

${
  results.conflicts.length > 0
    ? "1. Resolve conflicts manually or use --force flag\n"
    : ""
}${results.errors.length > 0 ? "1. Review and fix errors\\n" : ""}1. Update agent.md index with new files
2. Update references in documentation
3. Remove chatmodes/ folder if empty
4. Commit changes
`;

  if (!CONFIG.dryRun) {
    fs.writeFileSync(reportPath, report, "utf-8");
    log(`\n📄 Report saved to: ${path.relative(ROOT_DIR, reportPath)}`);
  } else {
    log("\n📋 Report (dry run - not saved):");
    console.log(report);
  }
}

/**
 * Main migration function
 */
async function main() {
  console.log("╔══════════════════════════════════════════════════════════╗");
  console.log("║     Chatmode to Agent Migration Script v1.0              ║");
  console.log("║     LightSpeedWP - VS Code v1.106+ Compatibility         ║");
  console.log("╚══════════════════════════════════════════════════════════╝");
  console.log("");

  if (CONFIG.dryRun) {
    console.log("🔍 DRY RUN MODE - No files will be modified\n");
  }

  if (!fs.existsSync(CONFIG.sourceDir)) {
    console.log(`❌ Source directory not found: ${CONFIG.sourceDir}`);
    process.exit(1);
  }

  // Ensure target directory exists
  if (!CONFIG.dryRun && !fs.existsSync(CONFIG.targetDir)) {
    fs.mkdirSync(CONFIG.targetDir, { recursive: true });
  }

  // Process chatmodes directory
  log("📂 Processing chatmodes directory...\n");
  processDirectory(CONFIG.sourceDir);

  // Cleanup source files
  if (!CONFIG.dryRun && results.migrated.length > 0) {
    cleanupSourceFiles();
    removeEmptyDirectories(CONFIG.sourceDir);
  }

  // Generate report
  generateReport();

  // Summary
  console.log("\n══════════════════════════════════════════════════════════");
  console.log("Migration Summary:");
  console.log(`  ✅ Migrated: ${results.migrated.length}`);
  console.log(`  ⏭️  Skipped:  ${results.skipped.length}`);
  console.log(`  ⚠️  Conflicts: ${results.conflicts.length}`);
  console.log(`  ❌ Errors:    ${results.errors.length}`);
  console.log("══════════════════════════════════════════════════════════\n");

  if (CONFIG.dryRun) {
    console.log("💡 Run without --dry-run to execute the migration\n");
  }
}

main().catch(console.error);
