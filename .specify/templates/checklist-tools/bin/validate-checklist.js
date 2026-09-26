#!/usr/bin/env node

/**
 * Validate Checklist
 * CLI tool to validate checklist markdown files against schema
 * Usage: checklist-validate [file.md] [--json]
 */

const fs = require('fs');
const path = require('path');
const minimist = require('minimist');
const lib = require('../lib/index.js');

const args = minimist(process.argv.slice(2), {
  string: ['_'],
  boolean: ['help', 'version', 'json', 'verbose'],
  alias: {
    h: 'help',
    v: 'version',
    j: 'json',
  },
});

const VERSION = '1.0.0';

// Help text
const HELP = `
Requirements Quality Checklist Validator v${VERSION}

Usage:
  checklist-validate <file> [options]

Options:
  -j, --json             Output validation results as JSON
  --verbose              Show detailed validation info
  -h, --help             Show this help
  -v, --version          Show version

Examples:
  checklist-validate checklist.md
  checklist-validate checklist.md --json
  checklist-validate checklist.md --verbose
`;

if (args.help) {
  console.log(HELP);
  process.exit(0);
}

if (args.version) {
  console.log(`Requirements Quality Checklist Validator v${VERSION}`);
  process.exit(0);
}

// Get file path
const filePath = args._[0];

if (!filePath) {
  console.error('Error: Please provide a checklist file to validate');
  console.log(HELP);
  process.exit(1);
}

if (!fs.existsSync(filePath)) {
  console.error(`Error: File not found: ${filePath}`);
  process.exit(1);
}

// Validate checklist
function validateChecklist() {
  const content = fs.readFileSync(filePath, 'utf-8');

  // Parse items from markdown
  const items = lib.parseCheckboxes(content);

  // Validate each item
  const validationResult = lib.validateItems(items);

  // Calculate metrics
  const metrics = lib.calculateMetrics(items);

  // Create report
  const report = lib.calculateReport(items);

  // Check dimension coverage
  const coverage = lib.validateDimensionCoverage(items);

  const result = {
    file: filePath,
    valid: validationResult.isValid && coverage.isCovered && report.status !== 'fail',
    validation: validationResult,
    metrics,
    report,
    coverage,
    timestamp: new Date().toISOString(),
  };

  return result;
}

// Format output
function formatResult(result, asJson = false) {
  if (asJson) {
    return JSON.stringify(result, null, 2);
  }

  let output = `Requirements Quality Checklist Validation\n`;
  output += `==========================================\n\n`;
  output += `File: ${result.file}\n`;
  output += `Timestamp: ${result.timestamp}\n`;
  output += `Status: ${result.valid ? '✅ VALID' : '❌ INVALID'}\n\n`;

  // Validation summary
  output += `Validation Results\n`;
  output += `------------------\n`;
  output += `Total Items: ${result.validation.totalItems}\n`;
  output += `Valid Items: ${result.validation.validItems}\n`;
  output += `Invalid Items: ${result.validation.invalidItems}\n\n`;

  if (result.validation.invalidItems > 0) {
    output += `Invalid Items Details:\n`;
    result.validation.itemResults
      .filter((r) => !r.isValid)
      .forEach((item) => {
        output += `\n  - Item ${item.index} (${item.id}):\n`;
        item.errors.forEach((err) => {
          output += `    • ${err}\n`;
        });
      });
    output += `\n`;
  }

  // Metrics
  output += `Metrics\n`;
  output += `-------\n`;
  output += `Total Items: ${result.metrics.totalItems}\n`;
  output += `Checked Items: ${result.metrics.checkedItems}\n`;
  output += `Unchecked Items: ${result.metrics.uncheckedItems}\n`;
  output += `Completion: ${result.metrics.completionPercent}%\n`;
  output += `Gaps: ${result.metrics.gaps}\n`;
  output += `Ambiguities: ${result.metrics.ambiguities}\n`;
  output += `Critical Ambiguities: ${result.metrics.criticalAmbiguities}\n\n`;

  // Dimension coverage
  output += `Dimension Coverage\n`;
  output += `------------------\n`;
  output += `Covered Dimensions: ${result.coverage.coveredDimensions}/${result.coverage.totalDimensions}\n`;
  output += `Coverage: ${result.coverage.coverage}\n`;

  if (!result.coverage.isCovered) {
    output += `Missing Dimensions: ${result.coverage.missingDimensions.join(', ')}\n`;
  }
  output += `\n`;

  // Status
  output += `Status Report\n`;
  output += `-------------\n`;
  output += `Status: ${result.report.symbol} ${result.report.description}\n`;

  if (result.report.blockingIssues.length > 0) {
    output += `\nBlocking Issues:\n`;
    result.report.blockingIssues.forEach((issue) => {
      output += `  - ${issue}\n`;
    });
  }

  if (result.report.warnings.length > 0) {
    output += `\nWarnings:\n`;
    result.report.warnings.forEach((warning) => {
      output += `  - ${warning}\n`;
    });
  }

  output += `\nRecommended Actions:\n`;
  result.report.recommendedActions.forEach((action) => {
    output += `  - ${action}\n`;
  });

  return output;
}

// Main execution
try {
  const result = validateChecklist();

  const output = formatResult(result, args.json);
  console.log(output);

  // Exit with appropriate code
  process.exit(result.valid ? 0 : 1);
} catch (err) {
  console.error(`Error validating checklist: ${err.message}`);
  process.exit(1);
}
