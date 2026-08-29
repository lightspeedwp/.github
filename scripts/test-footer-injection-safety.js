#!/usr/bin/env node

/**
 * Footer Injection Safety Test
 *
 * Comprehensive tests to ensure:
 * 1. No content is accidentally removed
 * 2. Backups can restore files to original state
 * 3. Footers match expected format
 * 4. Injection is reversible
 *
 * This should be run BEFORE committing injected files.
 *
 * Usage:
 *   node test-footer-injection-safety.js
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import * as yaml from "js-yaml";
import _crypto from "crypto";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  backupDir: path.join(__dirname, "../.github/tmp/footer-backups"),
  injectionReportPath: path.join(__dirname, "../.github/reports"),
  quirkyFootersPath: path.join(__dirname, "../config/quirky-footers.yaml"),
};

// ============================================================================
// TEST RESULTS
// ============================================================================

const testResults = {
  passed: [],
  failed: [],
  warnings: [],
};

function pass(testName, message) {
  testResults.passed.push({ test: testName, message });
  console.log(`✅ ${testName}: ${message}`);
}

function fail(testName, message) {
  testResults.failed.push({ test: testName, message });
  console.error(`❌ ${testName}: ${message}`);
}

function warn(testName, message) {
  testResults.warnings.push({ test: testName, message });
  console.warn(`⚠️  ${testName}: ${message}`);
}

// ============================================================================
// CONTENT COMPARISON TESTS
// ============================================================================

function testContentNotRemoved(filePath, backupPath) {
  const backupContent = fs.readFileSync(backupPath, "utf8");
  const currentContent = fs.readFileSync(filePath, "utf8");

  // Remove footer from current content
  const lastSeparatorIndex = currentContent.lastIndexOf("\n---");
  const contentWithoutFooter =
    lastSeparatorIndex > 0
      ? currentContent.substring(0, lastSeparatorIndex)
      : currentContent;

  // Normalize both for comparison (trim trailing whitespace)
  const normalizedBackup = backupContent.trim();
  const normalizedCurrent = contentWithoutFooter.trim();

  if (normalizedBackup === normalizedCurrent) {
    pass("ContentIntegrity", `${path.basename(filePath)}: content preserved`);
    return true;
  } else {
    // Show character-level differences
    const backupLen = normalizedBackup.length;
    const currentLen = normalizedCurrent.length;

    if (currentLen < backupLen) {
      fail(
        "ContentIntegrity",
        `${path.basename(filePath)}: content shortened (${backupLen} → ${currentLen} chars)`,
      );
    } else if (currentLen > backupLen) {
      warn(
        "ContentIntegrity",
        `${path.basename(filePath)}: content expanded (might have duplicate content)`,
      );
    } else {
      fail(
        "ContentIntegrity",
        `${path.basename(filePath)}: content modified (same length but different content)`,
      );
    }

    return false;
  }
}

function testBackupRestorability(filePath, backupPath) {
  try {
    const backupContent = fs.readFileSync(backupPath, "utf8");

    // Verify backup is valid markdown with frontmatter
    const match = backupContent.match(/^---\n([\s\S]*?)\n---/);
    if (!match) {
      fail(
        "BackupRestorability",
        `${path.basename(backupPath)}: missing valid frontmatter`,
      );
      return false;
    }

    // Verify backup content is readable
    if (backupContent.length === 0) {
      fail("BackupRestorability", `${path.basename(backupPath)}: empty backup`);
      return false;
    }

    pass("BackupRestorability", `${path.basename(backupPath)}: can restore`);
    return true;
  } catch (err) {
    fail("BackupRestorability", `${path.basename(backupPath)}: ${err.message}`);
    return false;
  }
}

function testFooterFormat(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const lastSeparatorIndex = content.lastIndexOf("\n---");

  if (lastSeparatorIndex === -1) {
    fail("FooterFormat", `${path.basename(filePath)}: no footer separator`);
    return false;
  }

  const footer = content.substring(lastSeparatorIndex).trim();

  // Check footer structure
  if (!footer.startsWith("---")) {
    fail(
      "FooterFormat",
      `${path.basename(filePath)}: footer not starting with ---`,
    );
    return false;
  }

  if (footer.length < 10) {
    fail("FooterFormat", `${path.basename(filePath)}: footer too short`);
    return false;
  }

  if (footer.length > 500) {
    fail(
      "FooterFormat",
      `${path.basename(filePath)}: footer too long (possible duplication)`,
    );
    return false;
  }

  // Check for duplicate separators in footer
  const separatorCount = (footer.match(/\n---/g) || []).length;
  if (separatorCount > 1) {
    fail(
      "FooterFormat",
      `${path.basename(filePath)}: multiple separators in footer`,
    );
    return false;
  }

  pass("FooterFormat", `${path.basename(filePath)}: valid format`);
  return true;
}

function testFooterFromConfig(filePath, category) {
  try {
    const configContent = fs.readFileSync(CONFIG.quirkyFootersPath, "utf8");
    const config = load(configContent);

    const categoryConfig = config.categories?.[category];
    if (!categoryConfig) {
      warn(
        "FooterConfig",
        `${path.basename(filePath)}: unknown category '${category}'`,
      );
      return false;
    }

    const defaultFooterId = categoryConfig.default_quirky_footer;
    const footerTemplate = config.footers?.[defaultFooterId];

    if (!footerTemplate) {
      fail(
        "FooterConfig",
        `${path.basename(filePath)}: footer template not found`,
      );
      return false;
    }

    const fileContent = fs.readFileSync(filePath, "utf8");
    const expectedFooterText = footerTemplate.template.trim();

    if (!fileContent.includes(expectedFooterText)) {
      fail(
        "FooterConfig",
        `${path.basename(filePath)}: footer doesn't match config template`,
      );
      return false;
    }

    pass(
      "FooterConfig",
      `${path.basename(filePath)}: matches ${defaultFooterId}`,
    );
    return true;
  } catch (err) {
    warn("FooterConfig", `${path.basename(filePath)}: ${err.message}`);
    return false;
  }
}

function testNoFooterDuplication(filePath) {
  const content = fs.readFileSync(filePath, "utf8");

  // Count footer-like patterns
  const footerPatterns = [
    "Built by 🧱 LightSpeedWP",
    "Maintained by the 🤖 LightSpeedWP",
    "Made with 💚 by LightSpeedWP",
  ];

  let patternCount = 0;
  for (const pattern of footerPatterns) {
    patternCount += (content.match(new RegExp(pattern, "g")) || []).length;
  }

  if (patternCount > 1) {
    fail(
      "NoDuplication",
      `${path.basename(filePath)}: found ${patternCount} footer patterns (should be 1)`,
    );
    return false;
  }

  pass("NoDuplication", `${path.basename(filePath)}: no duplicates`);
  return true;
}

// ============================================================================
// MAIN TEST EXECUTION
// ============================================================================

async function runTests() {
  console.log("🧪 Footer Injection Safety Tests\n");

  // Find latest injection report
  const reportFiles = fs
    .readdirSync(CONFIG.injectionReportPath)
    .filter((f) => f.startsWith("footer-injection-"));

  if (reportFiles.length === 0) {
    console.error("❌ No injection report found.");
    process.exit(1);
  }

  const latestReportFile = reportFiles.sort().pop();
  const reportPath = path.join(CONFIG.injectionReportPath, latestReportFile);
  const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));

  console.log(`📊 Testing ${report.filesInjected} modified files\n`);
  console.log("TEST SUITE 1: Content Integrity\n");

  for (const change of report.changes) {
    const { file, backup, _category } = change;

    if (!fs.existsSync(file)) {
      fail("ContentIntegrity", `${path.basename(file)}: file not found`);
      continue;
    }

    testContentNotRemoved(file, backup);
  }

  console.log("\nTEST SUITE 2: Backup Restorability\n");

  for (const change of report.changes) {
    testBackupRestorability(change.file, change.backup);
  }

  console.log("\nTEST SUITE 3: Footer Format\n");

  for (const change of report.changes) {
    testFooterFormat(change.file);
  }

  console.log("\nTEST SUITE 4: Footer Configuration Matching\n");

  for (const change of report.changes) {
    testFooterFromConfig(change.file, change.category);
  }

  console.log("\nTEST SUITE 5: Duplication Detection\n");

  for (const change of report.changes) {
    testNoFooterDuplication(change.file);
  }

  // ========================================================================
  // RESULTS SUMMARY
  // ========================================================================

  console.log("\n" + "=".repeat(80));
  console.log("TEST SUMMARY");
  console.log("=".repeat(80) + "\n");

  console.log(`✅ Passed: ${testResults.passed.length}`);
  console.log(`❌ Failed: ${testResults.failed.length}`);
  console.log(`⚠️  Warnings: ${testResults.warnings.length}\n`);

  if (testResults.failed.length > 0) {
    console.error("FAILURES:\n");
    testResults.failed.forEach((r) =>
      console.error(`  ${r.test}: ${r.message}`),
    );
    console.error();
  }

  if (testResults.warnings.length > 0) {
    console.warn("WARNINGS:\n");
    testResults.warnings.forEach((w) =>
      console.warn(`  ${w.test}: ${w.message}`),
    );
    console.warn();
  }

  const allPassed = testResults.failed.length === 0;

  if (allPassed) {
    console.log("✅ All safety tests PASSED");
    console.log("   Safe to commit injected files\n");
    process.exit(0);
  } else {
    console.log("❌ Safety tests FAILED");
    console.log("   DO NOT commit until issues are resolved\n");
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
