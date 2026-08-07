#!/usr/bin/env node
/**
 * Pre-Creation Label Validation Script
 *
 * Validates labels before issue/PR creation to enforce canonical label system.
 * Ensures all labels:
 * 1. Exist in canonical set (.github/labels.yml)
 * 2. Include required family prefix (type:, status:, priority:, etc.)
 * 3. Follow one-hot principle per family (except meta:, comp: which allow multiple)
 * 4. Always include a type:* label for classification
 *
 * Usage:
 *   node validate-labels-before-creation.cjs \
 *     --labels "type:bug,status:needs-triage" \
 *     --canonical-file .github/labels.yml
 *
 * Exit Codes:
 *   0 = validation passed
 *   1 = validation failed
 */

const fs = require('fs');
const yaml = require('js-yaml');

// ============================================================================
// Constants
// ============================================================================

const FAMILIES_ALLOW_MULTIPLE = ['meta', 'comp', 'lang'];
const REQUIRED_FAMILIES = ['type'];

// ============================================================================
// Argument Parsing
// ============================================================================

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = {
    labels: [],
    canonical_file: '.github/labels.yml'
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--labels' && i + 1 < args.length) {
      opts.labels = args[i + 1].split(',').map(l => l.trim()).filter(Boolean);
      i++;
    } else if (args[i] === '--canonical-file' && i + 1 < args.length) {
      opts.canonical_file = args[i + 1];
      i++;
    }
  }

  return opts;
}

// ============================================================================
// Label Loading
// ============================================================================

/**
 * Load canonical labels from YAML file
 * @param {string} filePath - Path to labels.yml
 * @returns {Map<string, object>} Map of label name → label metadata
 */
function loadCanonicalLabels(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const data = yaml.load(content, { schema: yaml.JSON_SCHEMA });

    if (!Array.isArray(data)) {
      throw new Error('labels.yml must contain an array of label objects');
    }

    const labels = new Map();
    for (const label of data) {
      if (label.name) {
        labels.set(label.name, label);
      }
    }

    return labels;
  } catch (error) {
    throw new Error(`Failed to load canonical labels: ${error.message}`);
  }
}

// ============================================================================
// Validation Logic
// ============================================================================

/**
 * Extract family prefix from label (part before colon)
 * @param {string} label - Label name (e.g., "type:bug")
 * @returns {string} Family name or null if no prefix
 */
function getFamily(label) {
  const match = label.match(/^([a-z]+):/);
  return match ? match[1] : null;
}

/**
 * Validate labels against canonical set
 * @param {string[]} labels - List of labels to validate
 * @param {Map} canonicalLabels - Map of valid labels
 * @returns {object} { valid: boolean, errors: string[], warnings: string[] }
 */
function validateLabels(labels, canonicalLabels) {
  const errors = [];
  const warnings = [];
  const familyCount = new Map();

  // ---- Rule 1: Each label must exist in canonical set ----
  for (const label of labels) {
    if (!label || label.trim() === '') continue;

    if (!canonicalLabels.has(label)) {
      errors.push(`Label '${label}' not found in canonical set (.github/labels.yml)`);
    }
  }

  // ---- Rule 2: Each label must have family prefix ----
  for (const label of labels) {
    if (!label || label.trim() === '') continue;

    const family = getFamily(label);
    if (!family) {
      errors.push(
        `Label '${label}' missing required family prefix. ` +
        `Use one of: type:, status:, priority:, area:, meta:, release:, lang:, env:, compat:, comp:`
      );
    } else {
      // Track family usage for one-hot validation
      if (!familyCount.has(family)) {
        familyCount.set(family, []);
      }
      familyCount.get(family).push(label);
    }
  }

  // ---- Rule 3: One-hot per family (except meta:, comp:, lang:) ----
  for (const [family, familyLabels] of familyCount) {
    if (FAMILIES_ALLOW_MULTIPLE.includes(family)) {
      continue; // These families allow multiple labels
    }

    if (familyLabels.length > 1) {
      errors.push(
        `Multiple labels from family '${family}' found: ${familyLabels.join(', ')}. ` +
        `Only one label per family is allowed (except ${FAMILIES_ALLOW_MULTIPLE.join(', ')}).`
      );
    }
  }

  // ---- Rule 4: Required family labels must be present ----
  for (const requiredFamily of REQUIRED_FAMILIES) {
    const hasRequired = labels.some(label => getFamily(label) === requiredFamily);
    if (!hasRequired) {
      errors.push(
        `Missing required '${requiredFamily}:*' label for classification. ` +
        `Examples: type:bug, type:feature, type:task, type:documentation`
      );
    }
  }

  // ---- Rule 5: Warnings for common mistakes ----
  const bareLabels = [
    'bug', 'feature', 'task', 'documentation', 'design', 'refactor',
    'urgent', 'critical', 'important', 'normal',
    'ci', 'docs', 'security', 'tests', 'labels',
    'release', 'automation'
  ];

  for (const label of labels) {
    if (bareLabels.includes(label)) {
      warnings.push(
        `Bare label '${label}' detected. ` +
        `This is not the canonical form. Did you mean 'type:${label}' or 'priority:${label}' or 'area:${label}'?`
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

// ============================================================================
// Output Formatting
// ============================================================================

/**
 * Format validation results for output
 * @param {object} result - Validation result
 * @returns {string} Formatted output
 */
function formatOutput(result) {
  let output = '';

  if (result.valid) {
    output += '✅ Label validation passed\n';
  } else {
    output += '❌ Label validation failed:\n\n';
    for (const error of result.errors) {
      output += `  ❌ ${error}\n`;
    }
    output += '\n';
  }

  if (result.warnings.length > 0) {
    output += '⚠️  Warnings:\n';
    for (const warning of result.warnings) {
      output += `  ⚠️  ${warning}\n`;
    }
  }

  return output;
}

// ============================================================================
// Main
// ============================================================================

function main() {
  const opts = parseArgs();

  try {
    // Load canonical labels
    const canonicalLabels = loadCanonicalLabels(opts.canonical_file);

    // Validate input labels
    const result = validateLabels(opts.labels, canonicalLabels);

    // Output results
    console.log(formatOutput(result));

    // Output JSON for machine parsing (on stderr)
    console.error(JSON.stringify({
      valid: result.valid,
      labels_count: opts.labels.length,
      canonical_labels_count: canonicalLabels.size,
      errors: result.errors,
      warnings: result.warnings
    }, null, 2));

    // Exit with appropriate code
    process.exit(result.valid ? 0 : 1);
  } catch (error) {
    console.error(`❌ Validation error: ${error.message}`);
    process.exit(1);
  }
}

main();
