#!/usr/bin/env node

/**
 * remediation-wave-4f.js
 *
 * Wave 4F: Remediation & Validation Script
 *
 * Scans all .md files in repository, applies unified branding agent,
 * fixes branding issues, and generates comprehensive reports.
 *
 * Usage:
 *   node scripts/remediation-wave-4f.js [options]
 *   node scripts/remediation-wave-4f.js --dry-run
 *   node scripts/remediation-wave-4f.js --apply
 *   node scripts/remediation-wave-4f.js --apply --verbose
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import * as yaml from "js-yaml";
import minimist from "minimist";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, "..");

// ============================================================================
// CONFIGURATION & UTILITIES
// ============================================================================

/**
 * Find all markdown files in repository
 */
function findMarkdownFiles(rootDir = PROJECT_ROOT) {
  const results = [];
  const excludeDirs = [
    "node_modules",
    ".git",
    "dist",
    "build",
    "coverage",
    ".jest-skip",
  ];

  function walkDir(dir) {
    if (!fs.existsSync(dir)) return;

    const files = fs.readdirSync(dir);

    for (const file of files) {
      const fullPath = path.join(dir, file);
      const relPath = path.relative(rootDir, fullPath);

      // Skip excluded directories
      if (excludeDirs.some((exclude) => relPath.startsWith(exclude))) {
        continue;
      }

      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        walkDir(fullPath);
      } else if (file.endsWith(".md")) {
        results.push(relPath);
      }
    }
  }

  walkDir(rootDir);
  return results.sort();
}

/**
 * Load branding configuration
 */
function loadBrandingConfig() {
  const configPath = path.join(PROJECT_ROOT, "config/footers.config.yaml");
  const content = fs.readFileSync(configPath, "utf-8");
  return yaml.load(content);
}

/**
 * Run branding agent on a file
 */
function applyBrandingAgent(filePath, dryRun = true) {
  const cmd = `node scripts/agents/branding-unified.agent.js "${filePath}"${
    !dryRun ? " --apply" : ""
  } --infer-metadata`;

  try {
    const output = execSync(cmd, {
      cwd: PROJECT_ROOT,
      encoding: "utf-8",
      stdio: "pipe",
    });
    return { success: true, output };
  } catch (error) {
    return { success: false, output: error.toString() };
  }
}

// ============================================================================
// REMEDIATION REPORT GENERATION
// ============================================================================

/**
 * Generate remediation report
 */
function generateRemediationReport(results, _config) {
  const report = [];
  const timestamp = new Date().toISOString();

  report.push("---");
  report.push('title: "Wave 4F: Remediation Report"');
  report.push(
    'description: "Summary of branding remediation applied to all markdown files"',
  );
  report.push('file_type: "report"');
  report.push('version: "1.0.0"');
  report.push(`created_date: "${timestamp.split("T")[0]}"`);
  report.push(`last_updated: "${timestamp.split("T")[0]}"`);
  report.push('category: "audit"');
  report.push("---");
  report.push("");
  report.push("# Wave 4F: Remediation Report");
  report.push("");
  report.push(`**Generated**: ${timestamp}`);
  report.push(`**Total Files Processed**: ${results.length}`);
  report.push(
    `**Files with Changes**: ${results.filter((r) => r.changes.length > 0).length}`,
  );
  report.push(
    `**Files with Errors**: ${results.filter((r) => !r.success).length}`,
  );
  report.push("");

  // Summary statistics
  report.push("## Summary Statistics");
  report.push("");

  const changedFiles = results.filter((r) => r.changes.length > 0);
  const errorsCount = results.filter((r) => !r.success).length;
  const categorizedFiles = {};

  results.forEach((r) => {
    if (r.category) {
      categorizedFiles[r.category] = (categorizedFiles[r.category] || 0) + 1;
    }
  });

  report.push(`- **Total Files**: ${results.length}`);
  report.push(
    `- **Modified**: ${changedFiles.length} (${((changedFiles.length / results.length) * 100).toFixed(1)}%)`,
  );
  report.push(`- **Errors**: ${errorsCount}`);
  report.push(
    `- **Unchanged**: ${results.length - changedFiles.length - errorsCount}`,
  );
  report.push("");

  // Changes breakdown
  report.push("## Changes Applied");
  report.push("");

  const changeTypes = {};
  changedFiles.forEach((file) => {
    file.changes.forEach((change) => {
      changeTypes[change] = (changeTypes[change] || 0) + 1;
    });
  });

  for (const [changeType, count] of Object.entries(changeTypes)) {
    report.push(`- **${changeType}**: ${count} files`);
  }
  report.push("");

  // Category breakdown
  report.push("## Files by Category");
  report.push("");

  const categoryTable = [
    "| Category | Count | Modified |",
    "|----------|-------|----------|",
  ];

  Object.entries(categorizedFiles)
    .sort((a, b) => b[1] - a[1])
    .forEach(([category, count]) => {
      const modified = changedFiles.filter(
        (r) => r.category === category,
      ).length;
      categoryTable.push(`| ${category} | ${count} | ${modified} |`);
    });

  report.push(categoryTable.join("\n"));
  report.push("");

  // Files with errors
  if (errorsCount > 0) {
    report.push("## Files with Errors");
    report.push("");

    const errorFiles = results.filter((r) => !r.success);
    errorFiles.forEach((file) => {
      report.push(`### ${file.file}`);
      report.push("");
      report.push("```");
      report.push(file.output || "Unknown error");
      report.push("```");
      report.push("");
    });
  }

  // Changed files summary
  report.push("## Changed Files");
  report.push("");

  changedFiles.slice(0, 50).forEach((file) => {
    report.push(`### ${file.file}`);
    report.push("");
    report.push("**Changes**:");
    file.changes.forEach((change) => {
      report.push(`- ${change}`);
    });
    report.push("");
  });

  if (changedFiles.length > 50) {
    report.push(`_... and ${changedFiles.length - 50} more files ..._`);
    report.push("");
  }

  // Validation notes
  report.push("## Validation Notes");
  report.push("");
  report.push(
    "All files have been processed using the unified branding agent from Wave 4E.",
  );
  report.push("The agent:");
  report.push("- Inferred document category from frontmatter or file path");
  report.push("- Validated frontmatter against required fields");
  report.push("- Generated headers based on category rules");
  report.push("- Selected and rendered appropriate footer templates");
  report.push("- Removed duplicate/malformed footers");
  report.push("");

  // Next steps
  report.push("## Next Steps");
  report.push("");
  report.push("1. **Review** — Review the list of changed files above");
  report.push(
    "2. **Verify** — Run tests to ensure changes don't break anything",
  );
  report.push("3. **Commit** — Commit changes with descriptive message");
  report.push("4. **Validate** — Run schema validation to ensure compliance");
  report.push("");

  return report.join("\n");
}

/**
 * Generate validation report
 */
function generateValidationReport(results) {
  const report = [];
  const timestamp = new Date().toISOString();

  report.push("---");
  report.push('title: "Wave 4F: Validation Report"');
  report.push(
    'description: "Schema compliance validation results for all markdown files"',
  );
  report.push('file_type: "report"');
  report.push('version: "1.0.0"');
  report.push(`created_date: "${timestamp.split("T")[0]}"`);
  report.push(`last_updated: "${timestamp.split("T")[0]}"`);
  report.push('category: "audit"');
  report.push("---");
  report.push("");
  report.push("# Wave 4F: Validation Report");
  report.push("");
  report.push(`**Generated**: ${timestamp}`);
  report.push("");

  // Overall status
  const filesWithErrors = results.filter(
    (r) => r.errors && r.errors.length > 0,
  );
  const validationPassed = filesWithErrors.length === 0;

  report.push("## Overall Status");
  report.push("");
  report.push(
    validationPassed
      ? "✅ **PASSED** — All files meet schema requirements"
      : `❌ **FAILED** — ${filesWithErrors.length} files have validation errors`,
  );
  report.push("");

  // Detailed results by category
  report.push("## Validation Results by Category");
  report.push("");

  const byCategory = {};
  results.forEach((file) => {
    const category = file.category || "unknown";
    if (!byCategory[category]) {
      byCategory[category] = { total: 0, valid: 0, errors: [] };
    }
    byCategory[category].total++;
    if (!file.errors || file.errors.length === 0) {
      byCategory[category].valid++;
    } else {
      byCategory[category].errors.push(file);
    }
  });

  const categoryTable = [
    "| Category | Total | Valid | Invalid |",
    "|----------|-------|-------|---------|",
  ];

  Object.entries(byCategory)
    .sort((a, b) => b[1].total - a[1].total)
    .forEach(([category, stats]) => {
      const invalid = stats.total - stats.valid;
      const status = invalid === 0 ? "✅" : "❌";
      categoryTable.push(
        `| ${category} | ${stats.total} | ${stats.valid} | ${invalid} ${status} |`,
      );
    });

  report.push(categoryTable.join("\n"));
  report.push("");

  // Files with errors
  if (filesWithErrors.length > 0) {
    report.push("## Files with Errors");
    report.push("");

    filesWithErrors.slice(0, 20).forEach((file) => {
      report.push(`### ${file.file}`);
      report.push("");
      report.push("**Category**: `" + (file.category || "unknown") + "`");
      report.push("");
      report.push("**Errors**:");
      (file.errors || []).forEach((error) => {
        report.push(`- ${error}`);
      });
      report.push("");
    });

    if (filesWithErrors.length > 20) {
      report.push(`_... and ${filesWithErrors.length - 20} more files ..._`);
      report.push("");
    }
  }

  // Recommendations
  report.push("## Recommendations");
  report.push("");

  if (validationPassed) {
    report.push("✅ All files are compliant with the branding schema.");
    report.push("No further action required.");
  } else {
    report.push("Address the following issues:");
    report.push("");
    report.push(
      "1. **Missing Required Fields** — Add `title`, `description`, `file_type`, `category` to frontmatter",
    );
    report.push(
      "2. **Invalid Dates** — Use YYYY-MM-DD format for `created_date` and `last_updated`",
    );
    report.push(
      "3. **Invalid Category** — Use one of the 16 defined categories",
    );
    report.push("4. **Malformed YAML** — Validate frontmatter syntax");
    report.push("");
    report.push("Run the remediation script again after fixing these issues:");
    report.push("```bash");
    report.push("node scripts/remediation-wave-4f.js --apply");
    report.push("```");
  }
  report.push("");

  return report.join("\n");
}

// ============================================================================
// MAIN REMEDIATION PROCESS
// ============================================================================

/**
 * Run full remediation and validation
 */
async function runRemediation(options = {}) {
  const {
    dry_run = true,
    verbose = false,
    apply = false,
    sample_only = false,
  } = options;

  console.log("🔄 Wave 4F: Remediation & Validation");
  console.log("=====================================\n");

  // Find all markdown files
  console.log("📁 Scanning for markdown files...");
  let files = findMarkdownFiles();

  if (sample_only) {
    console.log(`   Found ${files.length} files (using sample of 20)`);
    files = files.slice(0, 20);
  } else {
    console.log(`   Found ${files.length} files`);
  }

  // Load configuration
  const config = loadBrandingConfig();

  // Process each file
  const results = [];
  let processed = 0;

  console.log(`\n📝 Processing files (dry-run: ${!apply})...\n`);

  for (const file of files) {
    processed++;
    const progress = `[${processed}/${files.length}]`;

    if (verbose) {
      console.log(`${progress} ${file}`);
    } else if (processed % 50 === 0) {
      console.log(`${progress} Processed ${processed} files...`);
    }

    const result = applyBrandingAgent(file, dry_run);

    // Parse output to extract metadata
    const result_obj = {
      file,
      success: result.success,
      output: result.output,
      changes: [],
      errors: [],
      category: null,
    };

    // Extract category and changes from output
    const categoryMatch = result.output.match(/Category: ([a-z-]+)/);
    if (categoryMatch) {
      result_obj.category = categoryMatch[1];
    }

    const changesMatch = result.output.match(
      /✅ Changes:([\s\S]*?)(?:⚠️|❌|$)/,
    );
    if (changesMatch) {
      const changeLines = changesMatch[1].split("\n").filter((l) => l.trim());
      result_obj.changes = changeLines.map((l) => l.replace(/^\s*-\s*/, ""));
    }

    const errorsMatch = result.output.match(/❌ Errors:([\s\S]*?)$/);
    if (errorsMatch) {
      const errorLines = errorsMatch[1].split("\n").filter((l) => l.trim());
      result_obj.errors = errorLines.map((l) => l.replace(/^\s*-\s*/, ""));
    }

    results.push(result_obj);
  }

  console.log(`\n✅ Processing complete!\n`);

  // Generate reports
  console.log("📊 Generating reports...\n");

  const remediationReport = generateRemediationReport(results, config);
  const validationReport = generateValidationReport(results);

  // Write reports
  const reportsDir = path.join(PROJECT_ROOT, ".github/reports");
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  const remediationReportPath = path.join(
    reportsDir,
    "wave-4f-remediation-report.md",
  );
  const validationReportPath = path.join(
    reportsDir,
    "wave-4f-validation-report.md",
  );

  fs.writeFileSync(remediationReportPath, remediationReport, "utf-8");
  fs.writeFileSync(validationReportPath, validationReport, "utf-8");

  console.log(`✅ Remediation report: ${remediationReportPath}`);
  console.log(`✅ Validation report: ${validationReportPath}\n`);

  // Summary
  const changedFiles = results.filter((r) => r.changes.length > 0);
  const filesWithErrors = results.filter((r) => r.errors.length > 0);

  console.log("📈 Summary");
  console.log("==========");
  console.log(`Total files processed: ${results.length}`);
  console.log(`Files with changes: ${changedFiles.length}`);
  console.log(`Files with errors: ${filesWithErrors.length}`);
  console.log("");

  if (filesWithErrors.length > 0) {
    console.log("⚠️  Files with errors (first 5):");
    filesWithErrors.slice(0, 5).forEach((f) => {
      console.log(`   - ${f.file}`);
    });
    console.log("");
  }

  if (dry_run) {
    console.log("💡 Dry-run mode: No files were modified");
    console.log("Run with --apply to apply changes");
  } else if (apply) {
    console.log("✅ Changes applied successfully");
  }
}

// ============================================================================
// CLI INTERFACE
// ============================================================================

async function main() {
  const argv = minimist(process.argv.slice(2), {
    boolean: ["dry-run", "apply", "verbose", "sample", "help"],
    alias: { h: "help", v: "verbose", d: "dry-run" },
  });

  if (argv.help) {
    console.log(`
Wave 4F: Remediation & Validation Script

Usage:
  node scripts/remediation-wave-4f.js [options]

Options:
  --dry-run             Preview changes without applying (default: true)
  --apply               Apply changes to all files
  --verbose, -v         Show detailed output for each file
  --sample              Process only first 20 files (for testing)
  --help, -h            Show this help message

Examples:
  node scripts/remediation-wave-4f.js
  node scripts/remediation-wave-4f.js --apply
  node scripts/remediation-wave-4f.js --apply --verbose
  node scripts/remediation-wave-4f.js --sample --verbose
`);
    process.exit(0);
  }

  try {
    await runRemediation({
      dry_run: !argv.apply,
      apply: argv.apply,
      verbose: argv.verbose,
      sample_only: argv.sample,
    });
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

export {
  findMarkdownFiles,
  generateRemediationReport,
  generateValidationReport,
};
