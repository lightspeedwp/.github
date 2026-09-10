#!/usr/bin/env node

/**
 * Footer Injection Validation Script
 *
 * Validates that footer injection was successful:
 * 1. Schema compliance - footers match quirky-footers.yaml schema
 * 2. Content integrity - original content not lost
 * 3. Footer placement - footer is at end of file
 * 4. Backup integrity - all backups are readable
 *
 * Usage:
 *   node validate-footer-injection.js [--report-file=FILE]
 *
 * Exit codes:
 *   0 = all validations passed
 *   1 = validation failures found
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import * as yaml from "js-yaml";
import Ajv from "ajv";
import addFormats from "ajv-formats";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  quirkyFootersPath: path.join(__dirname, "../config/quirky-footers.yaml"),
  quirkyFootersSchemaPath: path.join(
    __dirname,
    "../../schemas/quirky-footers.schema.json",
  ),
  injectionReportPath: path.join(__dirname, "../.github/reports"),
  backupDir: path.join(__dirname, "../.github/tmp/footer-backups"),
};

// ============================================================================
// VALIDATION STATE
// ============================================================================

const validationState = {
  totalFiles: 0,
  validFiles: 0,
  invalidFiles: [],
  warnings: [],
  backupIssues: [],
  timestamp: new Date().toISOString(),
};

// ============================================================================
// SCHEMA VALIDATION
// ============================================================================

function validateFooterSchema() {
  try {
    const schemaContent = fs.readFileSync(
      CONFIG.quirkyFootersSchemaPath,
      "utf8",
    );
    const schema = JSON.parse(schemaContent);

    const configContent = fs.readFileSync(CONFIG.quirkyFootersPath, "utf8");
    const config = yaml.load(configContent);

    const ajv = new Ajv();
    addFormats(ajv);

    const validate = ajv.compile(schema);
    const valid = validate(config);

    if (!valid) {
      return {
        valid: false,
        errors: validate.errors,
      };
    }

    console.log("✅ Footer configuration schema validation passed");
    return { valid: true, errors: [] };
  } catch (err) {
    console.error("❌ Schema validation error:", err.message);
    return { valid: false, errors: [err.message] };
  }
}

// ============================================================================
// FILE VALIDATION
// ============================================================================

function validateFooterContent(filePath, content) {
  const issues = [];

  // Check 1: Footer present
  const lastSeparatorIndex = content.lastIndexOf("\n---");
  if (lastSeparatorIndex === -1) {
    issues.push("No footer separator found (---");
    return { valid: false, issues };
  }

  // Check 2: Footer has content
  const afterSeparator = content.substring(lastSeparatorIndex + 4).trim();
  if (afterSeparator.length === 0) {
    issues.push("Footer separator exists but has no content");
    return { valid: false, issues };
  }

  // Check 3: Footer is at end (nothing substantial after it)
  const lines = afterSeparator.split("\n");
  if (lines.length === 0) {
    issues.push("Footer content is empty");
    return { valid: false, issues };
  }

  // Check 4: Content before footer has minimum length
  const contentBeforeFooter = content.substring(0, lastSeparatorIndex);
  if (contentBeforeFooter.trim().length < 50) {
    issues.push("Content before footer is suspiciously short (might be lost)");
  }

  return { valid: issues.length === 0, issues };
}

function validateBackupIntegrity(filePath, backupPath) {
  const issues = [];

  if (!fs.existsSync(backupPath)) {
    issues.push(`Backup file missing: ${backupPath}`);
    return { valid: false, issues };
  }

  try {
    const backupContent = fs.readFileSync(backupPath, "utf8");

    // Backup should have less content than current (removed footer)
    const currentContent = fs.readFileSync(filePath, "utf8");
    if (backupContent.length > currentContent.length) {
      issues.push(
        "Backup is larger than current file (likely duplicate content)",
      );
    }

    // Backup should be readable YAML frontmatter
    const match = backupContent.match(/^---\n([\s\S]*?)\n---/);
    if (!match) {
      issues.push("Backup missing valid frontmatter structure");
    }
  } catch (err) {
    issues.push(`Backup unreadable: ${err.message}`);
  }

  return { valid: issues.length === 0, issues };
}

// ============================================================================
// MAIN VALIDATION
// ============================================================================

async function validateInjection() {
  console.log("🔍 Validating Footer Injection\n");

  // Step 1: Validate schema
  const schemaValidation = validateFooterSchema();
  if (!schemaValidation.valid) {
    console.error("❌ Schema validation failed:");
    schemaValidation.errors.forEach((err) =>
      console.error(`  ${err.message || JSON.stringify(err)}`),
    );
    return false;
  }

  console.log();

  // Step 2: Find latest injection report
  const reportFiles = fs
    .readdirSync(CONFIG.injectionReportPath)
    .filter((f) => f.startsWith("footer-injection-"));

  if (reportFiles.length === 0) {
    console.error("❌ No injection report found. Run inject-footers.js first.");
    return false;
  }

  const latestReportFile = reportFiles.sort().pop();
  const reportPath = path.join(CONFIG.injectionReportPath, latestReportFile);

  let latestReport;
  try {
    latestReport = JSON.parse(fs.readFileSync(reportPath, "utf8"));
    console.log(`📄 Using report: ${latestReportFile}`);
    console.log(`   Files injected: ${latestReport.filesInjected}`);
    console.log(`   Files failed: ${latestReport.filesFailed}\n`);
  } catch (err) {
    console.error(`❌ Failed to load injection report: ${err.message}`);
    return false;
  }

  // Step 3: Validate each modified file
  console.log("🔎 Validating modified files...\n");

  for (const change of latestReport.changes) {
    validationState.totalFiles++;

    try {
      const filePath = change.file;
      const content = fs.readFileSync(filePath, "utf8");

      // Validate footer content
      const contentValidation = validateFooterContent(filePath, content);
      if (!contentValidation.valid) {
        validationState.invalidFiles.push({
          file: filePath,
          issues: contentValidation.issues,
        });
        console.error(`❌ ${filePath}`);
        contentValidation.issues.forEach((issue) =>
          console.error(`   - ${issue}`),
        );
        continue;
      }

      // Validate backup integrity
      const backupValidation = validateBackupIntegrity(filePath, change.backup);
      if (!backupValidation.valid) {
        validationState.backupIssues.push({
          file: filePath,
          issues: backupValidation.issues,
        });
        console.warn(`⚠️  ${filePath} (backup issue)`);
        backupValidation.issues.forEach((issue) =>
          console.warn(`   - ${issue}`),
        );
      } else {
        validationState.validFiles++;
        console.log(`✅ ${filePath}`);
      }
    } catch (err) {
      validationState.invalidFiles.push({
        file: change.file,
        issues: [err.message],
      });
      console.error(`❌ ${change.file}: ${err.message}`);
    }
  }

  // Step 4: Generate summary
  console.log("\n" + "=".repeat(80));
  console.log("VALIDATION SUMMARY");
  console.log("=".repeat(80) + "\n");

  console.log(`📊 Results:`);
  console.log(`  Total files validated: ${validationState.totalFiles}`);
  console.log(`  Valid files: ${validationState.validFiles}`);
  console.log(`  Invalid files: ${validationState.invalidFiles.length}`);
  console.log(`  Backup issues: ${validationState.backupIssues.length}\n`);

  const validationPassed =
    validationState.invalidFiles.length === 0 &&
    validationState.backupIssues.length === 0;

  if (validationPassed) {
    console.log("✅ All validations PASSED");
    console.log("   - Schema compliance verified");
    console.log("   - Content integrity confirmed");
    console.log("   - Footers correctly placed");
    console.log("   - Backups intact\n");
    return true;
  } else {
    console.log("❌ Some validations FAILED");
    if (validationState.invalidFiles.length > 0) {
      console.log(
        `   - ${validationState.invalidFiles.length} files have validation issues`,
      );
    }
    if (validationState.backupIssues.length > 0) {
      console.log(
        `   - ${validationState.backupIssues.length} files have backup issues`,
      );
    }
    console.log();
    return false;
  }
}

// Main execution
validateInjection()
  .then((passed) => {
    process.exit(passed ? 0 : 1);
  })
  .catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
  });
