#!/usr/bin/env node

/**
 * CLI for validating branch names against the repository branching strategy.
 *
 * Usage:
 *   npm run validate:branch-name -- --branch <name>
 *   npm run validate:branch-name -- --current
 *   npm run validate:branch-name -- --json
 *   npm run validate:branch-name -- --help
 *
 * Exit Codes:
 *   0 = valid branch name
 *   1 = invalid branch name
 *   2 = execution error (e.g., cannot get current branch)
 */

import { execSync } from 'child_process';
import { validateBranchName, formatErrorMessage } from '../../lib/validate-branch-name.js';

// Parse command-line arguments
const args = process.argv.slice(2);
const showHelp = args.includes('--help') || args.includes('-h');
const jsonOutput = args.includes('--json');
const useCurrent = args.includes('--current');
const branchArgIndex = args.indexOf('--branch');
const explicitBranch = branchArgIndex !== -1 ? args[branchArgIndex + 1] : null;

/**
 * Print the CLI usage guide to standard output.
 *
 * @returns {void}
 */
function showUsage() {
  console.log(`
Validate branch names against the repository branching strategy.

Usage:
  npm run validate:branch-name -- [OPTIONS]

Options:
  --branch <name>   Validate a specific branch name
  --current         Validate the current Git branch
  --json            Output results as JSON (for machine parsing)
  --help            Show this help message

Exit Codes:
  0 = valid branch name
  1 = invalid branch name
  2 = execution error

Examples:
  npm run validate:branch-name -- --branch feat/user-auth
  npm run validate:branch-name -- --current
  npm run validate:branch-name -- --branch fix/bug-fix --json

Pattern: {type}/{scope}-{title}

Allowed Types (38):
  feat, fix, hotfix, release, refactor, chore, task, doc, docs, test,
  perf, ci, build, deps, security, design, a11y, ux, i18n, ops, proto,
  ds, api, schema, telemetry, content, seo, config, migrate, qa, uat,
  audit, codex, revert, research, aiops, automation, epic

Forbidden Prefixes:
  claude/, copilot/, openai/
`);
}

/**
 * Read the current branch name from Git.
 *
 * @returns {string | null} The current branch name, or `null` when Git cannot determine it.
 */
function getCurrentBranch() {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD', {
      encoding: 'utf-8',
    }).trim();
  } catch {
    return null;
  }
}

/**
 * Print the validation result in the requested format and exit with its status.
 *
 * @param {string} branchName - The branch name to validate.
 * @returns {never} This function exits with status 0 for a valid name or 1 for an invalid name.
 */
function validateAndOutput(branchName) {
  const result = validateBranchName(branchName);

  if (jsonOutput) {
    // JSON output for machine parsing
    console.log(
      JSON.stringify(
        {
          branch: branchName,
          valid: result.valid,
          type: result.type,
          scope: result.scope,
          title: result.title,
          errors: result.errors,
          suggested_name: result.suggested_name,
        },
        null,
        2
      )
    );
  } else {
    // Human-readable output
    if (result.valid) {
      console.log(`✅ Branch '${branchName}' is valid`);
    } else {
      console.log(formatErrorMessage(branchName, result));
    }
  }

  process.exit(result.valid ? 0 : 1);
}

/**
 * Resolve the CLI options and validate the selected or current branch.
 *
 * @returns {never} This function exits after displaying help, reporting an error, or validating a branch.
 */
function main() {
  if (showHelp) {
    showUsage();
    process.exit(0);
  }

  // Determine which branch to validate
  let branchName;

  if (explicitBranch) {
    branchName = explicitBranch;
  } else if (useCurrent) {
    branchName = getCurrentBranch();
    if (!branchName) {
      console.error('❌ Error: Could not determine current Git branch');
      process.exit(2);
    }
  } else {
    // Default: use current branch
    branchName = getCurrentBranch();
    if (!branchName) {
      if (jsonOutput) {
        console.log(
          JSON.stringify(
            {
              error: 'Could not determine current Git branch',
              branch: null,
              valid: false,
            },
            null,
            2
          )
        );
      } else {
        console.error('❌ Error: Could not determine current Git branch');
        console.error('Use --branch <name> to validate a specific branch');
      }
      process.exit(2);
    }
  }

  validateAndOutput(branchName);
}

main();
