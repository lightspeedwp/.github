#!/usr/bin/env node
/**
 * ============================================================================
 * Validation Script: validate-conventional-commits.js
 * Location: scripts/validation/validate-conventional-commits.js
 * Description:
 *   - Validates commits against Conventional Commits specification
 *   - Can be used as CLI tool or imported as module
 *   - Supports validation of git logs or commit message files
 * Standards:
 *   - Follows LightSpeed Coding Standards
 *   - Follows Conventional Commits v1.0.0
 * ============================================================================
 */

const { execSync } = require("child_process");
const fs = require("fs");
const { parseConventionalCommit } = require("../agents/includes/commitParser");

/**
 * Validate a commit message
 * @param {string} message - Commit message
 * @returns {Object} Validation result with valid flag and errors array
 */
function validateCommit(message) {
  const errors = [];
  const parsed = parseConventionalCommit(message);

  if (!parsed.valid) {
    errors.push(`Invalid commit format. Expected: type(scope): description`);
  }

  // Check required fields
  if (!parsed.type) {
    errors.push("Commit type is required");
  }

  if (!parsed.description) {
    errors.push("Commit description is required");
  }

  // Warn about scopes (not required but good practice)
  if (!parsed.scope) {
    // Scopes are optional, so don't error, just note
  }

  return {
    valid: errors.length === 0,
    errors,
    parsed,
  };
}

/**
 * Get git log for commits since a reference
 * @param {string} since - Git reference (commit, tag, branch)
 * @param {number} limit - Maximum number of commits to retrieve
 * @returns {Object[]} Array of commit objects
 */
function getGitLog(since, limit = 50) {
  if (since && !/^[a-zA-Z0-9_./~^@:-]+$/.test(since)) {
    throw new Error("Invalid git reference format");
  }
  try {
    const format = "%H%n%an%n%ae%n%s%n%b%n---END-COMMIT---%n";
    let cmd = 'git log --format="' + format + '" -n ' + limit;

    if (since) {
      cmd += " " + since + "..HEAD";
    }

    const commitStrings = execSync(cmd, { encoding: "utf8", stdio: "pipe" })
      .split("---END-COMMIT---\n")
      .filter((s) => s.trim());

    const commits = [];
    commitStrings.forEach((commitStr) => {
      const lines = commitStr.trim().split("\n");
      if (lines.length >= 3) {
        commits.push({
          hash: lines[0],
          author: lines[1],
          email: lines[2],
          message: lines.slice(3).join("\n"),
        });
      }
    });

    return commits;
  } catch (error) {
    console.error(`Error retrieving git log: ${error.message}`);
    return [];
  }
}

/**
 * Validate commits from git log
 * @param {string} since - Git reference to validate from
 * @param {number} limit - Maximum commits to check
 * @returns {Object} Validation results
 */
function validateGitLog(since, limit = 50) {
  const commits = getGitLog(since, limit);
  const results = [];
  let validCount = 0;
  let invalidCount = 0;

  commits.forEach((commit) => {
    const result = validateCommit(commit.message);
    if (result.valid) {
      validCount++;
    } else {
      invalidCount++;
      results.push({
        hash: commit.hash,
        author: commit.author,
        valid: false,
        errors: result.errors,
      });
    }
  });

  return {
    total: commits.length,
    validCount,
    invalidCount,
    issues: results,
  };
}

/**
 * CLI handler
 */
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error(
      "Usage: validate-conventional-commits.js [--git [since] | --file <path>]",
    );
    console.error("");
    console.error("Options:");
    console.error(
      "  --git [since]   Validate commits from git log (optional: from reference)",
    );
    console.error("  --file <path>   Validate commits from file");
    process.exit(1);
  }

  const command = args[0];

  try {
    if (command === "--git") {
      const since = args[1] || "origin/develop";
      const result = validateGitLog(since);

      if (result.invalidCount === 0) {
        console.log(
          `✓ All ${result.validCount} commits follow Conventional Commits format`,
        );
        process.exit(0);
      } else {
        console.error(`✗ Found ${result.invalidCount} invalid commits:`);
        result.issues.forEach((issue) => {
          console.error(`\n  Commit: ${issue.hash}`);
          console.error(`  Author: ${issue.author}`);
          issue.errors.forEach((err) => console.error(`    - ${err}`));
        });
        process.exit(1);
      }
    } else if (command === "--file") {
      const filePath = args[1];
      if (!filePath) {
        console.error("--file requires a path argument");
        process.exit(1);
      }

      if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        process.exit(1);
      }

      const content = fs.readFileSync(filePath, "utf8");
      const result = validateCommit(content);

      if (result.valid) {
        console.log("✓ Commit message is valid");
        process.exit(0);
      } else {
        console.error("✗ Commit message is invalid:");
        result.errors.forEach((err) => console.error(`  - ${err}`));
        process.exit(1);
      }
    } else {
      console.error(`Unknown command: ${command}`);
      process.exit(1);
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

// Run CLI if executed directly
if (require.main === module) {
  main();
}

// Export functions for use as module
module.exports = {
  validateCommit,
  validateGitLog,
  getGitLog,
};
