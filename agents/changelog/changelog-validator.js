#!/usr/bin/env node

/**
 * Changelog Validator CLI
 * Real-time validation of changelog entries against quality rules
 */

const fs = require('fs');
const path = require('path');
const validator = require('./includes/changelogValidator.cjs');
const formatter = require('./includes/formatter.cjs');
const logger = require('./includes/logger.cjs');

const RULES_FILE = path.join(__dirname, '../../.github/changelog-rules.yml');

/**
 * Parse command line arguments
 */
function parseArgs(args) {
  const command = args[0] || 'help';
  const options = {};

  for (let i = 1; i < args.length; i++) {
    if (args[i] === '--entry') options.entry = args[++i];
    if (args[i] === '--input') options.input = args[++i];
    if (args[i] === '--json') options.json = true;
    if (args[i] === '--release') options.release = args[++i];
    if (args[i] === '--from') options.from = args[++i];
    if (args[i] === '--to') options.to = args[++i];
    if (args[i] === '--branch') options.branch = args[++i];
    if (args[i] === '--format') options.format = args[++i];
    if (args[i] === '--help' || args[i] === '-h') options.help = true;
  }

  return { command, options };
}

/**
 * Read input from file or stdin
 */
async function readInput(filePath) {
  if (filePath === '-') {
    return new Promise((resolve, reject) => {
      let data = '';
      process.stdin.setEncoding('utf8');
      process.stdin.on('readable', () => {
        let chunk;
        while ((chunk = process.stdin.read()) !== null) {
          data += chunk;
        }
      });
      process.stdin.on('end', () => resolve(data));
      process.stdin.on('error', reject);
    });
  }

  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  return fs.readFileSync(filePath, 'utf8');
}

/**
 * Parse YAML entry string into object
 */
function parseYamlEntry(content) {
  try {
    const yaml = require('js-yaml');
    return yaml.load(content);
  } catch (error) {
    throw new Error(`Invalid YAML: ${error.message}`);
  }
}

/**
 * Validate a changelog entry
 */
async function validateEntry(options) {
  try {
    if (!options.entry && options.input !== '-') {
      console.error('Error: --entry <path> or --input - is required');
      process.exit(1);
    }

    const entryPath = options.entry || '-';
    const content = await readInput(entryPath);
    const entry = parseYamlEntry(content);

    const validationResult = validator.validate(entry, RULES_FILE, {
      stopOnError: false,
      context: {
        entryId: entry.id || 'unknown',
        filename: options.entry || 'stdin'
      }
    });

    if (options.json) {
      console.log(JSON.stringify(validationResult, null, 2));
    } else {
      const formatted = formatter.formatValidationResult(validationResult);
      console.log(formatted);
    }

    // Exit with appropriate code
    process.exit(validationResult.summary.status === 'passing' ? 0 : 1);
  } catch (error) {
    const result = {
      status: 'error',
      message: error.message,
      timestamp: new Date().toISOString()
    };

    if (options.json) {
      console.log(JSON.stringify(result, null, 2));
    } else {
      console.error(`Error: ${error.message}`);
    }

    process.exit(2);
  }
}

/**
 * Audit command (placeholder for Phase 4)
 */
async function auditRelease(options) {
  console.log('Audit command not yet implemented (Phase 4)');
  process.exit(1);
}

/**
 * Export command (placeholder for Phase 5)
 */
async function exportReleaseNotes(options) {
  console.log('Export command not yet implemented (Phase 5)');
  process.exit(1);
}

/**
 * Show help message
 */
function showHelp() {
  console.log(`
Changelog Validator CLI
Real-time validation of changelog entries against quality rules

USAGE:
  changelog-validator <command> [options]

COMMANDS:
  validate          Validate a changelog entry
  audit             Audit all entries in a release (Phase 4)
  export            Generate release notes (Phase 5)
  help              Show this help message

VALIDATE OPTIONS:
  --entry <path>    Path to entry file (YAML format)
  --input -         Read from stdin
  --json            Output results as JSON (default: human-readable)

EXAMPLES:
  # Validate from file
  changelog-validator validate --entry entry.yaml

  # Validate from stdin
  echo "category: feature
title: New feature
description: This is a new feature." | changelog-validator validate --input -

  # Get JSON output
  changelog-validator validate --entry entry.yaml --json

For more help, visit: https://github.com/lightspeedwp/.github/docs/CHANGELOG_QUALITY_AUDIT.md
  `);
}

/**
 * Main CLI entry point
 */
async function main() {
  try {
    const args = process.argv.slice(2);
    const { command, options } = parseArgs(args);

    if (options.help || command === 'help') {
      showHelp();
      process.exit(0);
    }

    switch (command) {
      case 'validate':
        await validateEntry(options);
        break;
      case 'audit':
        await auditRelease(options);
        break;
      case 'export':
        await exportReleaseNotes(options);
        break;
      default:
        console.error(`Unknown command: ${command}`);
        console.error('Use "changelog-validator help" for usage information');
        process.exit(1);
    }
  } catch (error) {
    console.error(`Fatal error: ${error.message}`);
    process.exit(2);
  }
}

// Run CLI if executed directly
if (require.main === module) {
  main();
}

module.exports = { validateEntry, auditRelease, exportReleaseNotes };
