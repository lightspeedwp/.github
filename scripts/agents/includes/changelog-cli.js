#!/usr/bin/env node
/**
 * ============================================================================
 * CLI Tool: changelog-cli.js
 * Location: scripts/agents/includes/changelog-cli.js
 * Description:
 *   - Provides command-line interface for changelog operations
 *   - Integrates conventional commits parsing with changelog building
 *   - Supports adding entries from commits or manual input
 * Standards:
 *   - Follows LightSpeed Coding Standards
 * ============================================================================
 */

const fs = require("fs");
const { execSync } = require("child_process");
const commitParser = require("./commitParser");
const categoryMapper = require("./categoryMapper");
const changelogBuilder = require("./changelogBuilder");

/**
 * Parse CLI arguments
 * @param {string[]} args - Command line arguments
 * @returns {Object} Parsed arguments
 */
function parseArgs(args) {
  const parsed = {
    command: args[0],
    options: {},
  };

  for (let i = 1; i < args.length; i++) {
    if (args[i].startsWith("--")) {
      const key = args[i].substring(2);
      const value =
        args[i + 1] && !args[i + 1].startsWith("--") ? args[++i] : true;
      parsed.options[key] = value;
    }
  }

  return parsed;
}

/**
 * Generate entries from git commits
 * @param {string} since - Git reference
 * @returns {Object} Entries organized by section
 */
function generateEntriesFromCommits(since = "origin/develop..HEAD") {
  if (since && !/^[a-zA-Z0-9_./~^@:-]+$/.test(since)) {
    throw new Error("Invalid git reference format");
  }
  try {
    const format = "%H%n%an%n%ae%n%s%n%b%n---END-COMMIT---%n";
    const cmd = 'git log --format="' + format + '" ' + since;
    const output = execSync(cmd, { encoding: "utf8", stdio: "pipe" });
    const commits = [];
    const commitStrings = output
      .split("---END-COMMIT---\n")
      .filter((s) => s.trim());

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

    const entriesBySection = {};

    // Get PR numbers from current branch
    let prNumber = null;
    try {
      const prBranch = execSync("git branch --show-current", {
        encoding: "utf8",
      }).trim();
      const prMatch = prBranch.match(/#(\d+)/);
      if (prMatch) {
        prNumber = prMatch[1];
      }
    } catch (_e) {
      // Ignore if not on a branch
    }

    // Process each commit
    commits.forEach((commit) => {
      const parsed = commitParser.parseConventionalCommit(commit.message);

      if (!parsed.valid) {
        return; // Skip invalid commits
      }

      const section = categoryMapper.mapCommitTypeToSection(parsed.type);
      if (!section) {
        return;
      }

      if (!entriesBySection[section]) {
        entriesBySection[section] = [];
      }

      entriesBySection[section].push({
        description: parsed.description,
        scope: parsed.scope,
        commit: commit.hash,
        author: commit.author,
        pr: prNumber,
      });
    });

    return entriesBySection;
  } catch (error) {
    console.error(`Error generating entries from commits: ${error.message}`);
    return {};
  }
}

/**
 * Interactive entry creation
 * @returns {Object} Single entry
 */
function interactiveEntry() {
  const readline = require("readline");
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question("Changelog entry: ", (description) => {
      rl.question(
        "Section (added/fixed/changed/deprecated/removed/security): ",
        (section) => {
          rl.question("Scope (optional): ", (scope) => {
            rl.close();
            resolve({
              description,
              section: section || "changed",
              scope: scope || null,
            });
          });
        },
      );
    });
  });
}

/**
 * Show help message
 */
function showHelp() {
  console.log("Changelog CLI - Manage changelog entries from commits\n");
  console.log("Usage: changelog-cli.js <command> [options]\n");
  console.log("Commands:");
  console.log(
    "  generate    Generate entries from commits (default: since origin/develop)",
  );
  console.log("  add         Add single entry interactively");
  console.log("  update      Update CHANGELOG.md with generated entries");
  console.log("  validate    Validate CHANGELOG.md format");
  console.log("  help        Show this help message\n");
  console.log("Options:");
  console.log("  --since <ref>    Git reference (for generate command)");
  console.log(
    "  --changelog <path> Path to CHANGELOG.md (default: ./CHANGELOG.md)\n",
  );
}

/**
 * CLI main handler
 */
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    showHelp();
    process.exit(0);
  }

  const parsed = parseArgs(args);
  const changelogPath = parsed.options.changelog || "./CHANGELOG.md";

  if (!fs.existsSync(changelogPath)) {
    console.error(`Changelog not found: ${changelogPath}`);
    process.exit(1);
  }

  try {
    switch (parsed.command) {
      case "generate": {
        const since = parsed.options.since || "origin/develop..HEAD";
        const entries = generateEntriesFromCommits(since);

        if (Object.keys(entries).length === 0) {
          console.log("No entries generated");
          process.exit(0);
        }

        console.log("Generated entries:");
        Object.entries(entries).forEach(([section, items]) => {
          console.log(`\n${section}:`);
          items.forEach((item) => {
            console.log(`  - ${item.description}`);
          });
        });

        process.exit(0);
        break;
      }

      case "add": {
        interactiveEntry().then((entry) => {
          const entriesBySection = {
            [entry.section]: [
              {
                description: entry.description,
                scope: entry.scope,
              },
            ],
          };

          changelogBuilder.updateChangelog(changelogPath, entriesBySection);
          console.log("✓ Entry added to changelog");
          process.exit(0);
        });
        break;
      }

      case "update": {
        const since = parsed.options.since || "origin/develop..HEAD";
        const entries = generateEntriesFromCommits(since);

        if (Object.keys(entries).length === 0) {
          console.log("No entries to add");
          process.exit(0);
        }

        changelogBuilder.updateChangelog(changelogPath, entries);
        console.log("✓ Changelog updated with new entries");
        process.exit(0);
        break;
      }

      case "validate": {
        const {
          parseChangelog,
          validateChangelog,
        } = require("./changelogUtils.cjs");
        const data = parseChangelog(changelogPath);
        const result = validateChangelog(data);

        if (result.valid) {
          console.log("✓ Changelog is valid");
          process.exit(0);
        } else {
          console.error("✗ Changelog validation failed:");
          result.errors.forEach((err) => console.error(`  - ${err}`));
          process.exit(1);
        }
        break;
      }

      case "help":
        showHelp();
        process.exit(0);
        break;

      default:
        console.error(`Unknown command: ${parsed.command}`);
        showHelp();
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

module.exports = {
  parseArgs,
  generateEntriesFromCommits,
  interactiveEntry,
};
