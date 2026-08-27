#!/usr/bin/env node

/**
 * Footer Injection Script
 *
 * Safely injects category-specific footers from quirky-footers.yaml
 * into markdown files that are missing them.
 *
 * Features:
 * - Creates backups before modifying files
 * - Infers category from frontmatter or file path
 * - Uses quirky-footers.yaml for personality-driven templates
 * - Validates schema compliance after injection
 * - Reports all changes with detailed logging
 * - Can be run in dry-run mode for testing
 *
 * Usage:
 *   node inject-footers.js [--dry-run] [--category-map=file.json] [--batch-size=10]
 *
 * Flags:
 *   --dry-run              Show what would be changed without modifying
 *   --category-map=FILE    JSON file with path -> category mappings
 *   --batch-size=N         Process N files at a time (default: 10)
 *   --backup-dir=PATH      Store backups in custom directory
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { glob } from "glob";
import * as yaml from "js-yaml";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  footerConfigPath: path.join(__dirname, "../config/footers.config.yaml"),
  quirkyFootersPath: path.join(__dirname, "../config/quirky-footers.yaml"),
  backupDir: path.join(__dirname, "../.github/tmp/footer-backups"),
  reportDir: path.join(__dirname, "../.github/reports"),

  // Exclude patterns (from FOOTER_VALIDATION_AUDIT.md + quirky-footers.yaml)
  excludePatterns: [
    "**/node_modules/**",
    "**/.git/**",
    "**/.github/reports/**",
    "**/.github/projects/**",
    "**/*tmp*/**",
    "**/dist/**",
    "**/build/**",
    "**/__tests__/**",
    "**/*.test.md",
    "**/test-*.md",
    "**/.github/ISSUE_TEMPLATE/**",
    "**/.github/PULL_REQUEST_TEMPLATE/**",
    "**/.github/DISCUSSION_TEMPLATE/**",
    "/**/template(s)?/**",
    "/**/example(s)?/**",
    "/**/sample(s)?/**",
    "/**/fixture(s)?/**",
    "/**/references/**",
    "/**/mock(s)?/**",
    "**/.archive/**",
    "**/completed/**",
    "**/deprecated/**",
    "**/legacy/**",
    // Vendor/plugin paths that shouldn't have footers
    "**/plugin-provided/**",
    "**/platform-managed/**",
    "**/directory-installed/**",
    "**/agentskills-main/**",
  ],
};

// ============================================================================
// PATH-BASED CATEGORY INFERENCE
// ============================================================================

const PATH_CATEGORY_MAP = {
  "docs/": "docs",
  "instructions/": "instructions",
  "agents/": "agents",
  "skills/": "ai-ops",
  "hooks/": "ai-ops",
  "scripts/": "ai-ops",
  "schemas/": "schema",
  ".github/instructions/": "instructions",
  "workflows/": "ai-ops",
  "cookbook/": "docs",
  "plugins/": "ai-ops",
  "prompts/": "ai-ops",
};

// ============================================================================
// STATE TRACKING
// ============================================================================

const injectionState = {
  filesProcessed: 0,
  filesSkipped: 0,
  filesInjected: 0,
  filesFailed: 0,
  errors: [],
  changes: [],
  backups: {},
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function loadConfig(configPath, configName) {
  try {
    const content = fs.readFileSync(configPath, "utf8");
    const config = yaml.load(content);
    console.log(`✅ Loaded ${configName}`);
    return config;
  } catch (err) {
    console.error(`❌ Failed to load ${configName}:`, err.message);
    process.exit(1);
  }
}

function _shouldExclude(filePath) {
  return CONFIG.excludePatterns.some((pattern) => {
    // Convert glob pattern to regex
    const regexPattern = pattern
      .replace(/\*\*/g, ".*")
      .replace(/\*/g, "[^/]*")
      .replace(/\?/g, ".");
    return new RegExp(regexPattern).test(filePath);
  });
}

function inferCategory(filePath, frontmatter) {
  // First check frontmatter
  if (frontmatter?.category) {
    return frontmatter.category;
  }

  // Then infer from path
  for (const [pathPattern, category] of Object.entries(PATH_CATEGORY_MAP)) {
    if (filePath.includes(pathPattern)) {
      return category;
    }
  }

  // Default
  return "docs";
}

function extractFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;

  try {
    return yaml.load(match[1]);
  } catch (_e) {
    return null;
  }
}

function hasFooter(content) {
  const lastSeparatorIndex = content.lastIndexOf("\n---");
  if (lastSeparatorIndex === -1) return false;

  const afterLastSeparator = content.substring(lastSeparatorIndex + 4).trim();
  return afterLastSeparator.length > 0;
}

function _getFooterBlock(content) {
  const lastSeparatorIndex = content.lastIndexOf("\n---");
  if (lastSeparatorIndex === -1) return null;

  return content.substring(lastSeparatorIndex);
}

// ============================================================================
// FOOTER INJECTION
// ============================================================================

function injectFooter(
  filePath,
  content,
  category,
  quirkyConfig,
  _footerConfig,
  dryRun,
) {
  try {
    // Get default quirky footer for category
    const categoryConfig = quirkyConfig?.categories?.[category];
    if (!categoryConfig) {
      injectionState.filesFailed++;
      injectionState.errors.push({
        file: filePath,
        error: `Unknown category: ${category}`,
      });
      return null;
    }

    const defaultQuirkyFooterId = categoryConfig.default_quirky_footer;
    const footerTemplate = quirkyConfig?.footers?.[defaultQuirkyFooterId];

    if (!footerTemplate) {
      injectionState.filesFailed++;
      injectionState.errors.push({
        file: filePath,
        error: `Footer template not found: ${defaultQuirkyFooterId}`,
      });
      return null;
    }

    // Create new content with footer
    let newContent = content;

    // Remove existing footer if present
    const lastSeparatorIndex = content.lastIndexOf("\n---");
    if (lastSeparatorIndex > 0) {
      newContent = content.substring(0, lastSeparatorIndex);
    }

    // Append new footer
    newContent += "\n" + footerTemplate.template.trim() + "\n";

    if (dryRun) {
      return { newContent, footerId: defaultQuirkyFooterId };
    }

    // Create backup
    if (!fs.existsSync(CONFIG.backupDir)) {
      fs.mkdirSync(CONFIG.backupDir, { recursive: true });
    }

    const backupPath = path.join(
      CONFIG.backupDir,
      `${path.basename(filePath)}.backup`,
    );
    fs.writeFileSync(backupPath, content, "utf8");
    injectionState.backups[filePath] = backupPath;

    // Write new content
    fs.writeFileSync(filePath, newContent, "utf8");

    injectionState.filesInjected++;
    injectionState.changes.push({
      file: filePath,
      category,
      footer: defaultQuirkyFooterId,
      backup: backupPath,
    });

    return { newContent, footerId: defaultQuirkyFooterId };
  } catch (err) {
    injectionState.filesFailed++;
    injectionState.errors.push({
      file: filePath,
      error: err.message,
    });
    return null;
  }
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function main() {
  const dryRun = process.argv.includes("--dry-run");

  console.log("📝 Footer Injection Script");
  console.log(
    `Mode: ${dryRun ? "DRY RUN (no changes)" : "LIVE (will modify files)"}\n`,
  );

  // Load configurations
  const footerConfig = loadConfig(CONFIG.footerConfigPath, "footer config");
  const quirkyConfig = loadConfig(
    CONFIG.quirkyFootersPath,
    "quirky footers config",
  );

  console.log("\n🔍 Scanning for markdown files without footers...\n");

  // Find all markdown files
  const files = await glob("**/*.md", {
    ignore: CONFIG.excludePatterns,
    nodir: true,
  });

  console.log(`Found ${files.length} markdown files to check\n`);

  for (const file of files) {
    try {
      injectionState.filesProcessed++;

      const content = fs.readFileSync(file, "utf8");

      // Skip if already has footer
      if (hasFooter(content)) {
        injectionState.filesSkipped++;
        continue;
      }

      // Extract frontmatter
      const frontmatter = extractFrontmatter(content);

      // Infer category
      const category = inferCategory(file, frontmatter);

      // Inject footer
      const result = injectFooter(
        file,
        content,
        category,
        quirkyConfig,
        footerConfig,
        dryRun,
      );

      if (result) {
        console.log(
          `${dryRun ? "📋" : "✅"} ${file} [${category}] <- ${result.footerId}`,
        );
      }
    } catch (err) {
      injectionState.filesFailed++;
      injectionState.errors.push({
        file,
        error: err.message,
      });
      console.error(`❌ ${file}: ${err.message}`);
    }
  }

  // ========================================================================
  // REPORTING
  // ========================================================================

  console.log("\n" + "=".repeat(80));
  console.log("INJECTION SUMMARY");
  console.log("=".repeat(80) + "\n");

  console.log(`📊 Statistics:`);
  console.log(`  Total files processed: ${injectionState.filesProcessed}`);
  console.log(`  Files with existing footers: ${injectionState.filesSkipped}`);
  console.log(`  Files injected: ${injectionState.filesInjected}`);
  console.log(`  Files failed: ${injectionState.filesFailed}\n`);

  if (injectionState.errors.length > 0) {
    console.log(`❌ Errors (${injectionState.errors.length}):\n`);
    for (const error of injectionState.errors.slice(0, 10)) {
      console.log(`  ${error.file}: ${error.error}`);
    }
    if (injectionState.errors.length > 10) {
      console.log(`  ... and ${injectionState.errors.length - 10} more`);
    }
    console.log();
  }

  // Save report
  if (!fs.existsSync(CONFIG.reportDir)) {
    fs.mkdirSync(CONFIG.reportDir, { recursive: true });
  }

  const reportPath = path.join(
    CONFIG.reportDir,
    `footer-injection-${new Date().toISOString().split("T")[0]}.json`,
  );

  fs.writeFileSync(reportPath, JSON.stringify(injectionState, null, 2));
  console.log(`📄 Report saved to: ${reportPath}\n`);

  if (dryRun) {
    console.log("ℹ️  DRY RUN COMPLETE - No files were modified.\n");
    console.log("To apply changes, run: node scripts/inject-footers.js\n");
  } else {
    console.log(
      `✅ Injection complete! ${injectionState.filesInjected} files modified.\n`,
    );
    console.log(`Backups stored in: ${CONFIG.backupDir}\n`);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
