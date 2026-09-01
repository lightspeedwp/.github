#!/usr/bin/env node

/**
 * Validate branch names against the LightSpeed branching strategy.
 *
 * Enforces the pattern: {type}/{scope}-{short-title}
 * - type: one of 30+ allowed prefixes (feat, fix, chore, etc.)
 * - scope: lowercase, kebab-case (hyphens only, no underscores)
 * - title: lowercase, kebab-case
 *
 * @module scripts/validation/validate-branch-name
 * @example
 * // CLI usage
 * node validate-branch-name.cjs feat/my-feature
 * node validate-branch-name.cjs --branch feat/my-feature --verbose
 * node validate-branch-name.cjs --show-pattern
 *
 * @example
 * // Programmatic usage
 * const { validateBranchName } = require('./validate-branch-name.cjs');
 * const result = validateBranchName('feat/my-feature');
 * if (!result.valid) {
 *   console.error(result.message);
 * }
 */

const { execSync } = require('child_process');

// 30+ allowed branch types per LightSpeed branching strategy
const ALLOWED_TYPES = [
  'feat',
  'fix',
  'hotfix',
  'release',
  'refactor',
  'chore',
  'docs',
  'test',
  'perf',
  'ci',
  'build',
  'deps',
  'security',
  'revert',
  'research',
  'design',
  'a11y',
  'ux',
  'i18n',
  'ops',
  'proto',
  'ds',
  'api',
  'schema',
  'telemetry',
  'content',
  'seo',
  'config',
  'migrate',
  'qa',
  'uat',
  'audit',
  'codex',
];

// Regex pattern enforcing: {type}/{scope}-{title} (strict kebab-case)
// Special case: release branches allow semantic versioning format (e.g., release/v1.0.0)
// Release branches accept EITHER:
// 1. Semantic version: release/v1.2.3 or release/1.2.3
// 2. Standard format: release/{scope}-{title}
const BRANCH_PATTERN_RELEASE_SEMVER = /^release\/v?\d+\.\d+\.\d+(-[a-z0-9]+)*$/;
const BRANCH_PATTERN_RELEASE_STANDARD = /^release\/([a-z0-9]+(?:-[a-z0-9]+)*)-([a-z0-9]+(?:-[a-z0-9]+)*)$/;
const BRANCH_PATTERN_STANDARD = new RegExp(
  `^(${ALLOWED_TYPES.filter(t => t !== 'release').join('|')})/([a-z0-9]+(?:-[a-z0-9]+)*)-([a-z0-9]+(?:-[a-z0-9]+)*)$`
);

// Branches exempt from validation (protected branches, bot branches, etc.)
const PROTECTED_BRANCHES = new Set(['main', 'develop']);
const BOT_PREFIXES = /^(dependabot|renovate)\//;

/**
 * Validate a branch name against the branching strategy pattern.
 *
 * @param {string} branchName - The branch name to validate
 * @param {Object} options - Validation options
 * @param {boolean} options.verbose - Print detailed validation output
 * @returns {Object} Validation result { valid: boolean, message?: string }
 */
function validateBranchName(branchName, options = {}) {
  const { verbose = false } = options;

  // Skip validation for protected and bot branches
  if (PROTECTED_BRANCHES.has(branchName) || BOT_PREFIXES.test(branchName)) {
    if (verbose) {
      console.log(`✓ Branch '${branchName}' is exempt from naming rules (protected/bot).`);
    }
    return { valid: true };
  }

  // Check against pattern (release branches have special rules for semantic versioning)
  const isReleaseSemver = BRANCH_PATTERN_RELEASE_SEMVER.test(branchName);
  const isReleaseStandard = BRANCH_PATTERN_RELEASE_STANDARD.test(branchName);
  const isStandardPattern = BRANCH_PATTERN_STANDARD.test(branchName);

  if (!isReleaseSemver && !isReleaseStandard && !isStandardPattern) {
    const message = formatValidationError(branchName);
    return { valid: false, message };
  }

  if (verbose) {
    console.log(`✓ Branch '${branchName}' follows the branching strategy.`);
  }

  return { valid: true };
}

/**
 * Format a helpful error message for invalid branch names.
 *
 * @param {string} branchName - The invalid branch name
 * @returns {string} Formatted error message
 */
function formatValidationError(branchName) {
  return [
    `❌ Branch '${branchName}' does not follow the naming pattern.`,
    '',
    'Required format: {type}/{scope}-{short-title}',
    '  - type: one of the allowed prefixes (lowercase)',
    '  - scope: lowercase, hyphens only (no underscores or uppercase)',
    '  - title: lowercase, hyphens only (no underscores or uppercase)',
    '',
    `Allowed types: ${ALLOWED_TYPES.join(', ')}`,
    '',
    'Valid examples:',
    '  ✓ feat/branch-naming-enforcement',
    '  ✓ fix/validation-script-bug',
    '  ✓ chore/update-dependencies',
    '  ✓ docs/branching-strategy-guide',
    '',
    'Invalid examples:',
    '  ✗ claude/my-branch (type "claude" not allowed)',
    '  ✗ Feature/MyBranch (uppercase not allowed)',
    '  ✗ fix-bug (missing type prefix)',
    '  ✗ feat/my_feature (underscores not allowed)',
    '  ✗ feat/MyFeature (uppercase not allowed)',
    '',
    'For more details, see: docs/BRANCHING_STRATEGY.md',
  ].join('\n');
}

/**
 * Get the current branch name from Git or environment variables.
 *
 * @param {string} explicitBranch - Branch name passed via --branch flag
 * @returns {string} The resolved branch name, or empty string if not detected
 */
function getCurrentBranchName(explicitBranch) {
  // Explicit branch via --branch flag takes precedence
  if (explicitBranch) {
    return explicitBranch;
  }

  // Try environment variables (GitHub Actions, CI systems)
  const envBranch =
    process.env.BRANCH_NAME ||
    process.env.GITHUB_HEAD_REF ||
    process.env.GITHUB_REF_NAME ||
    '';

  if (envBranch.trim()) {
    return envBranch.trim();
  }

  // Fall back to git command
  try {
    return execSync('git branch --show-current', {
      stdio: ['ignore', 'pipe', 'ignore'],
      encoding: 'utf8',
    }).trim();
  } catch {
    return '';
  }
}

/**
 * Get a flag value from command-line arguments.
 *
 * @param {string} flag - The flag name (e.g. '--branch')
 * @returns {string} The flag value, or empty string if not found
 */
function getFlagValue(flag) {
  const index = process.argv.indexOf(flag);
  if (index === -1 || index === process.argv.length - 1) {
    return '';
  }
  return process.argv[index + 1].trim();
}

/**
 * Get positional arguments (args that don't start with -- and aren't flag values).
 *
 * @returns {string[]} Array of positional arguments
 */
function getPositionalArgs() {
  const args = [];
  let skipNext = false;

  for (let i = 2; i < process.argv.length; i++) {
    if (skipNext) {
      skipNext = false;
      continue;
    }

    const arg = process.argv[i];

    // If it's a flag, skip it and its value
    if (arg.startsWith('--')) {
      // Check if this flag has a value
      if (i + 1 < process.argv.length && !process.argv[i + 1].startsWith('--')) {
        skipNext = true;
      }
    } else if (!arg.startsWith('-')) {
      // It's a positional argument
      args.push(arg);
    }
  }

  return args;
}

/**
 * Check if a flag is present in command-line arguments.
 *
 * @param {string} flag - The flag name (e.g. '--verbose')
 * @returns {boolean} True if flag is present
 */
function hasFlag(flag) {
  return process.argv.includes(flag);
}

/**
 * Print the validation pattern to console.
 */
function printPattern() {
  console.log('Branch Naming Pattern:');
  console.log(`  Regex: ${BRANCH_PATTERN.source}`);
  console.log('');
  console.log('Pattern explanation:');
  console.log('  ^           - Start of string');
  console.log(`  (${ALLOWED_TYPES.join('|')}) - Type prefix (required)`);
  console.log('  /           - Literal forward slash');
  console.log('  ([a-z0-9-]+) - Scope (lowercase, hyphens)');
  console.log('  -           - Literal hyphen');
  console.log('  ([a-z0-9-]+) - Title (lowercase, hyphens)');
  console.log('  $           - End of string');
  console.log('');
  console.log('Valid example: feat/my-feature-name');
  console.log('Invalid example: feat/myFeatureName (uppercase not allowed)');
}

/**
 * Print help message.
 */
function printHelp() {
  console.log('Validate branch names against LightSpeed branching strategy.');
  console.log('');
  console.log('Usage:');
  console.log('  node validate-branch-name.cjs [options]');
  console.log('  node validate-branch-name.cjs [branch-name] [options]');
  console.log('');
  console.log('Options:');
  console.log('  --branch <name>      Validate a specific branch name');
  console.log('  --verbose            Print detailed validation output');
  console.log('  --show-pattern       Print the validation pattern');
  console.log('  --help               Print this help message');
  console.log('');
  console.log('Examples:');
  console.log('  node validate-branch-name.cjs feat/my-feature');
  console.log('  node validate-branch-name.cjs --branch fix/bug-fix --verbose');
  console.log('  node validate-branch-name.cjs --show-pattern');
}

/**
 * Main entry point for CLI usage.
 */
function main() {
  // Handle special flags
  if (hasFlag('--help') || hasFlag('-h')) {
    printHelp();
    process.exit(0);
  }

  if (hasFlag('--show-pattern')) {
    printPattern();
    process.exit(0);
  }

  // Get options
  const verbose = hasFlag('--verbose');
  const explicitBranch = getFlagValue('--branch');

  // Get positional argument if provided
  const positionalArgs = getPositionalArgs();
  const positionalBranch = positionalArgs.length > 0 ? positionalArgs[0] : '';

  // Debug logging
  if (process.env.DEBUG_VALIDATION) {
    console.error('[DEBUG] process.argv:', process.argv);
    console.error('[DEBUG] positionalArgs:', positionalArgs);
    console.error('[DEBUG] explicitBranch:', explicitBranch);
    console.error('[DEBUG] positionalBranch:', positionalBranch);
  }

  // Resolve branch name (positional arg takes precedence, then --branch flag, then git)
  const branchName = getCurrentBranchName(explicitBranch || positionalBranch);

  if (process.env.DEBUG_VALIDATION) {
    console.error('[DEBUG] branchName:', branchName);
    console.error('[DEBUG] BRANCH_PATTERN_STANDARD:', BRANCH_PATTERN_STANDARD);
    console.error('[DEBUG] Standard pattern matches:', BRANCH_PATTERN_STANDARD.test(branchName));
    console.error('[DEBUG] Release semver pattern matches:', BRANCH_PATTERN_RELEASE_SEMVER.test(branchName));
    console.error('[DEBUG] Release standard pattern matches:', BRANCH_PATTERN_RELEASE_STANDARD.test(branchName));
  }

  if (!branchName) {
    console.error('❌ No branch detected. Provide one with --branch <name> or ensure you are in a Git repository.');
    process.exit(1);
  }

  // Validate
  const result = validateBranchName(branchName, { verbose });

  if (!result.valid) {
    console.error(result.message);
    process.exit(1);
  }

  process.exit(0);
}

// Run CLI if this is the main module
if (require.main === module) {
  main();
}

// Export for use in tests, hooks, and workflows
module.exports = {
  validateBranchName,
  ALLOWED_TYPES,
  BRANCH_PATTERN_RELEASE_SEMVER,
  BRANCH_PATTERN_RELEASE_STANDARD,
  BRANCH_PATTERN_STANDARD,
  PROTECTED_BRANCHES,
  BOT_PREFIXES,
  getCurrentBranchName,
};
