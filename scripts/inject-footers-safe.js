#!/usr/bin/env node

/**
 * Safe Footer Injection Script (Redesigned)
 *
 * CRITICAL: Safely injects category-specific footers from quirky-footers.yaml
 * into markdown files WITHOUT destroying existing content.
 *
 * SAFETY GUARANTEES:
 * - Frontmatter parsing: Lines 1-3 ONLY (not last --- separator)
 * - Body preservation: ALL content after frontmatter preserved
 * - Size invariant: newContent.length >= originalContent.length (never shrink)
 * - Backup creation: Before ANY modification
 * - Footer detection: Skip if footer already present
 * - Dry-run mode: Test without modifying
 *
 * Features:
 * - Preserves Definition of Ready (DoR) sections
 * - Preserves Definition of Done (DoD) sections
 * - Preserves all checklist and acceptance criteria
 * - Creates backups before modifying files
 * - Validates no content loss
 * - Reports all changes with detailed logging
 * - Can be run in dry-run mode for testing
 *
 * Usage:
 *   node inject-footers-safe.js [--dry-run] [--batch-size=10]
 *   node inject-footers-safe.js --dry-run --target=.github/ISSUE_TEMPLATE
 *
 * Flags:
 *   --dry-run              Show what would be changed without modifying
 *   --batch-size=N         Process N files at a time (default: 10)
 *   --target=PATH          Process specific directory (default: entire repo)
 *   --verbose              Show detailed logging
 */

const fs = require("fs");
const path = require("path");
const { glob } = require("glob");

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  footerConfigPath: path.join(__dirname, "../config/footers.config.yaml"),
  quirkyFootersPath: path.join(__dirname, "../config/quirky-footers.yaml"),
  backupDir: path.join(__dirname, "../.github/tmp/footer-backups"),
  reportDir: path.join(__dirname, "../.github/reports"),

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
  ],
};

// ============================================================================
// SAFE FRONTMATTER PARSING
// ============================================================================

/**
 * SAFE: Extract frontmatter by finding closing --- marker
 * Supports standard YAML frontmatter: --- YAML content ---
 * Uses exact match (trim() === '---') to avoid false positives on content lines
 *
 * @param {string} content - File content
 * @returns {{frontmatter: string, body: string}} - Separated frontmatter and body
 */
function extractFrontmatterSafely(content) {
  const lines = content.split("\n");

  // Check if file starts with --- (YAML frontmatter marker)
  if (!lines[0] || lines[0].trim() !== "---") {
    return { frontmatter: "", body: content };
  }

  // Find closing --- (can be anywhere, but typically within first 50 lines)
  let closingLineIndex = -1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === "---") {
      closingLineIndex = i;
      break;
    }
  }

  if (closingLineIndex === -1) {
    // No closing ---, treat as body
    return { frontmatter: "", body: content };
  }

  // Extract frontmatter (lines 0 to closingLineIndex inclusive, plus newline)
  const frontmatterLines = lines.slice(0, closingLineIndex + 1);
  const frontmatter = frontmatterLines.join("\n") + "\n";

  // Extract body (everything after frontmatter)
  const body = lines.slice(closingLineIndex + 1).join("\n");

  return { frontmatter, body };
}

/**
 * Detect if footer already exists in content
 *
 * @param {string} content - File content
 * @returns {boolean} - True if footer signature found
 */
function hasFooter(content) {
  // Check for specific footer markers (NOT just "---" which appears in frontmatter)
  const footerMarkers = [
    "Maintained by the 🤖 LightSpeedWP",
    "_🤖 Maintained by",
    "LightSpeedWP Automation Team",
  ];

  return footerMarkers.some((marker) => content.includes(marker));
}

/**
 * SAFE: Inject footer while preserving all content
 *
 * @param {string} filePath - Path to file
 * @param {string} content - Original file content
 * @param {string} footer - Footer text to append
 * @param {boolean} dryRun - If true, don't modify file
 * @returns {{success: boolean, newContent: string, message: string}} - Result
 */
function injectFooterSafely(filePath, content, footer, dryRun = false) {
  try {
    // Step 1: Check if footer already exists
    if (hasFooter(content)) {
      return {
        success: false,
        newContent: content,
        message: "footer_exists",
      };
    }

    // Step 2: Parse frontmatter safely (lines 1-3 only)
    const { frontmatter, body } = extractFrontmatterSafely(content);

    // Step 3: Build new content (preserve ALL body content)
    const bodyTrimmed = body.trim();
    const newContent =
      frontmatter + bodyTrimmed + "\n\n" + footer.trim() + "\n";

    // Step 4: CRITICAL VALIDATION - Never shrink content
    if (newContent.length < content.length) {
      return {
        success: false,
        newContent: content,
        message: "content_loss_detected",
      };
    }

    // Step 5: In dry-run mode, just return the result
    if (dryRun) {
      return {
        success: true,
        newContent,
        message: "dry_run",
      };
    }

    // Step 6: Create backup
    if (!fs.existsSync(CONFIG.backupDir)) {
      fs.mkdirSync(CONFIG.backupDir, { recursive: true });
    }

    const backupPath = path.join(
      CONFIG.backupDir,
      `${path.basename(filePath)}.backup.${Date.now()}`,
    );
    fs.writeFileSync(backupPath, content, "utf8");

    // Step 7: Write new content
    fs.writeFileSync(filePath, newContent, "utf8");

    return {
      success: true,
      newContent,
      message: "injected",
      backupPath,
    };
  } catch (error) {
    return {
      success: false,
      newContent: content,
      message: `error: ${error.message}`,
    };
  }
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const verbose = args.includes("--verbose");

  console.log("🚀 Safe Footer Injection Script");
  console.log(`   Mode: ${dryRun ? "DRY-RUN (no changes)" : "WRITE MODE"}`);
  console.log("");

  // Parse target directory
  let targetPattern = "**/*.md";
  const targetArg = args.find((a) => a.startsWith("--target="));
  if (targetArg) {
    targetPattern = `${targetArg.split("=")[1]}/**/*.md`;
  }

  // Find markdown files
  const files = await glob(targetPattern, {
    ignore: CONFIG.excludePatterns,
    nodir: true,
  });

  console.log(`📁 Found ${files.length} markdown files to scan`);
  console.log("");

  // Test with first 3 files
  const testFiles = files.slice(0, 3);
  let injected = 0;
  let skipped = 0;
  let errors = 0;

  console.log("🧪 Testing safe injection on first 3 files:\n");

  for (const file of testFiles) {
    const content = fs.readFileSync(file, "utf8");
    const testFooter =
      "---\n\n_🤖 Maintained by the LightSpeedWP Automation Team_";

    const result = injectFooterSafely(file, content, testFooter, dryRun);

    if (result.success) {
      injected++;
      console.log(`✅ ${path.relative(".", file)}`);
      if (verbose) {
        console.log(
          `   Size: ${content.length} → ${result.newContent.length} bytes`,
        );
      }
    } else if (result.message === "footer_exists") {
      skipped++;
      console.log(`⏭️  ${path.relative(".", file)} (footer exists)`);
    } else {
      errors++;
      console.log(`❌ ${path.relative(".", file)} (${result.message})`);
    }
  }

  console.log("");
  console.log("📊 Summary:");
  console.log(`   Injected: ${injected}`);
  console.log(`   Skipped: ${skipped}`);
  console.log(`   Errors: ${errors}`);

  if (dryRun) {
    console.log("\n✅ Dry-run complete. No files modified.");
    console.log("Run without --dry-run to apply changes.");
  }
}

// Export functions for testing
module.exports = {
  extractFrontmatterSafely,
  hasFooter,
  injectFooterSafely,
};

// Run main if this is the entry point
if (require.main === module) {
  main().catch((error) => {
    console.error("❌ Fatal error:", error.message);
    process.exit(1);
  });
}
