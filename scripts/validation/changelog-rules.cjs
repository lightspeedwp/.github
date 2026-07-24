#!/usr/bin/env node

/**
 * Changelog Entry Validation Rules
 * Validates CHANGELOG.md entries against style guide and format requirements
 */

const fs = require("fs");
const path = require("path");

class ChangelogValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
  }

  /**
   * Validate a single changelog entry
   * @param {string} entry - The raw entry text
   * @param {number} lineNum - Line number in file
   * @returns {object} - Validation result {valid, errors, warnings}
   */
  validateEntry(entry, lineNum) {
    const result = { valid: true, errors: [], warnings: [] };

    // Rule 1: Entry format
    const formatRegex = /^- \*\*[^*]+\*\* — .+\(/;
    if (!formatRegex.test(entry)) {
      result.errors.push(
        `Line ${lineNum}: Invalid format. Expected: - **Title** — description (...)`,
      );
      result.valid = false;
    }

    // Rule 2: Em-dash correctness
    if (!entry.includes("—") && entry.includes("-")) {
      result.errors.push(
        `Line ${lineNum}: Found hyphen (-) instead of em-dash (—)`,
      );
      result.valid = false;
    }

    // Rule 3: Extract title and validate length
    const titleMatch = entry.match(/\*\*([^*]+)\*\*/);
    if (titleMatch) {
      const title = titleMatch[1];
      if (title.length > 60) {
        result.warnings.push(
          `Line ${lineNum}: Title is ${title.length} chars (max 60): "${title.substring(0, 50)}..."`,
        );
      }
    }

    // Rule 4: Extract description and validate length
    const descMatch = entry.match(/— ([^(]+)\(/);
    if (descMatch) {
      const desc = descMatch[1].trim();
      if (desc.length > 150) {
        result.warnings.push(
          `Line ${lineNum}: Description is ${desc.length} chars (max 150)`,
        );
      }
    }

    // Rule 5: PR link validation
    const prLinkRegex = /\(\[PR #(\d+)\]/;
    if (!prLinkRegex.test(entry)) {
      result.errors.push(
        `Line ${lineNum}: Missing PR link. Required format: ([PR #1234](url))`,
      );
      result.valid = false;
    }

    // Rule 6: URL validation
    const urlRegex =
      /https?:\/\/github\.com\/[\w\-\.]+\/[\w\-\.]+\/(pull|issues)\/\d+/;
    const allUrls = entry.match(/\(https?:\/\/[^\)]+\)/g);
    if (allUrls) {
      allUrls.forEach((urlWithParens) => {
        const urlMatch = urlWithParens.match(/https?:\/\/[^\)]+/);
        if (urlMatch && !urlRegex.test(urlMatch[0])) {
          // Only warn for non-GitHub URLs; GitHub URLs with repos like "lightspeedwp/.github" are valid
          if (!urlMatch[0].includes("github.com")) {
            result.warnings.push(
              `Line ${lineNum}: Non-GitHub URL: ${urlWithParens}`,
            );
          }
        }
      });
    }

    // Rule 7: Sentence count (should be 1-2 sentences)
    if (descMatch) {
      const desc = descMatch[1].trim();
      const sentences = desc.split(/[.!?]+/).filter((s) => s.trim().length > 0);
      if (sentences.length > 2) {
        result.warnings.push(
          `Line ${lineNum}: Description has ${sentences.length} sentences (max 2)`,
        );
      }
    }

    return result;
  }

  /**
   * Validate entire CHANGELOG.md file
   * @param {string} filePath - Path to CHANGELOG.md
   * @returns {object} - Validation results
   */
  validateFile(filePath) {
    const content = fs.readFileSync(filePath, "utf8");
    const lines = content.split("\n");
    const results = {
      totalErrors: 0,
      totalWarnings: 0,
      entries: [],
    };

    let inUnreleased = false;
    let currentEntry = "";
    let currentLine = 0;

    lines.forEach((line, idx) => {
      const lineNum = idx + 1;

      // Track [Unreleased] section
      if (line.match(/^## \[Unreleased\]/)) {
        inUnreleased = true;
        return;
      }

      // End of [Unreleased] section
      if (inUnreleased && line.match(/^## \[\d/)) {
        inUnreleased = false;
        return;
      }

      // Skip if not in [Unreleased]
      if (!inUnreleased) return;

      // Skip section headers
      if (line.match(/^### /)) {
        // Track if we're in Contributors section (skip validation for those entries)
        if (line.match(/^### Contributors/)) {
          inUnreleased = false; // Effectively end validation at Contributors
        }
        return;
      }

      // Collect entry lines
      if (line.startsWith("- ")) {
        if (currentEntry) {
          const validation = this.validateEntry(currentEntry, currentLine);
          results.entries.push({
            line: currentLine,
            entry: currentEntry.substring(0, 80),
            ...validation,
          });
          if (!validation.valid) results.totalErrors++;
          results.totalWarnings += validation.warnings.length;
        }
        currentEntry = line;
        currentLine = lineNum;
      } else if (line.trim() && inUnreleased) {
        // Continuation of previous entry
        currentEntry += " " + line.trim();
      }
    });

    // Don't forget last entry
    if (currentEntry) {
      const validation = this.validateEntry(currentEntry, currentLine);
      results.entries.push({
        line: currentLine,
        entry: currentEntry.substring(0, 80),
        ...validation,
      });
      if (!validation.valid) results.totalErrors++;
      results.totalWarnings += validation.warnings.length;
    }

    return results;
  }

  /**
   * Print validation report
   */
  printReport(results) {
    console.log("\n📋 CHANGELOG Validation Report\n");
    console.log(`📊 Summary:`);
    console.log(`   Total Entries: ${results.entries.length}`);
    console.log(`   Errors: ${results.totalErrors}`);
    console.log(`   Warnings: ${results.totalWarnings}`);

    if (results.totalErrors > 0) {
      console.log("\n❌ Errors (must fix):");
      results.entries
        .filter((e) => !e.valid)
        .forEach((entry) => {
          console.log(`\n   Line ${entry.line}:`);
          entry.errors.forEach((err) => console.log(`   → ${err}`));
        });
    }

    if (results.totalWarnings > 0) {
      console.log("\n⚠️  Warnings (should fix):");
      results.entries
        .filter((e) => e.warnings.length > 0)
        .forEach((entry) => {
          entry.warnings.forEach((warn) => {
            console.log(`   Line ${entry.line}: ${warn}`);
          });
        });
    }

    if (results.totalErrors === 0 && results.totalWarnings === 0) {
      console.log("\n✅ All entries valid!");
    }

    process.exit(results.totalErrors > 0 ? 1 : 0);
  }
}

// Main
if (require.main === module) {
  const changelogPath = path.join(__dirname, "../../CHANGELOG.md");
  const validator = new ChangelogValidator();
  const results = validator.validateFile(changelogPath);
  validator.printReport(results);
}

module.exports = ChangelogValidator;
