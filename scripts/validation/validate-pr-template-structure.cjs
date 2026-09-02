#!/usr/bin/env node
/**
 * validate-pr-template-structure.cjs
 * Validates that PR templates contain required sections and valid label references
 * Used by pr-validation.yml as part of Phase 3 Task 3 enhancements
 */

const fs = require('fs');
const yaml = require('js-yaml');

const TEMPLATE_PATH = '.github/pull_request_template.md';
const LABELS_FILE = '.github/labels.yml';

/**
 * Load a YAML file and return parsed content.
 * @param {string} file - Path to the YAML file
 * @returns {any} Parsed YAML content
 */
function loadYaml(file) {
  return yaml.load(fs.readFileSync(file, 'utf8'));
}

/**
 * Extract canonical label names from labels.yml.
 * @returns {Set<string>} Set of canonical label names
 */
function getCanonicalLabels() {
  const labels = loadYaml(LABELS_FILE);
  return new Set(
    labels
      .map((label) =>
        typeof label === 'string'
          ? label
          : typeof label === 'object' && label?.name
            ? label.name
            : null,
      )
      .filter(Boolean),
  );
}

/**
 * Validate PR template structure against required sections and DoD items.
 * @param {string} templateContent - Raw template markdown content
 * @returns {{errors: string[], warnings: string[]}} Validation errors and warnings
 */
function validateTemplateStructure(templateContent) {
  const errors = [];
  const warnings = [];

  // Required sections for PR governance
  const requiredSections = [
    'Linked issues',
    'Changelog',
    'Risk Assessment',
    'How to Test',
    'Checklist',
  ];

  for (const section of requiredSections) {
    const sectionRegex = new RegExp(`^##\\s+${section}`, 'm');
    if (!sectionRegex.test(templateContent)) {
      errors.push(`Missing required section: "${section}"`);
    }
  }

  // Changelog section should have subsections
  const changelogSectionRegex = /^##\s+Changelog\s*$[\s\S]*?(?=^##\s|\Z)/m;
  const changelogMatch = templateContent.match(changelogSectionRegex);
  if (changelogMatch) {
    const changelogContent = changelogMatch[0];
    const changelogSubsections = ['Added', 'Changed', 'Fixed', 'Removed'];
    for (const subsection of changelogSubsections) {
      const subsectionRegex = new RegExp(`^###\\s+${subsection}`, 'm');
      if (!subsectionRegex.test(changelogContent)) {
        warnings.push(
          `Changelog section missing "${subsection}" subsection (recommended but not required)`,
        );
      }
    }
  }

  // Checklist should have Global DoD items
  const checklistRegex = /^##\s+Checklist[\s\S]*?(?=^##\s|\Z)/m;
  const checklistMatch = templateContent.match(checklistRegex);
  if (checklistMatch) {
    const checklistContent = checklistMatch[0];
    const dodItems = [
      'All AC met',
      'Tests added',
      'Docs/readme/changelog updated',
      'Security checklist',
      'Code/design reviews',
      'CI green',
      'Risk assessment',
    ];

    let foundDoD = 0;
    for (const item of dodItems) {
      if (checklistContent.toLowerCase().includes(item.toLowerCase())) {
        foundDoD++;
      }
    }

    if (foundDoD < 5) {
      warnings.push(
        `Checklist has ${foundDoD}/${dodItems.length} DoD items (should have majority)`,
      );
    }
  }

  return { errors, warnings };
}

/**
 * Validate that all label references in the template use canonical labels.
 * @param {string} templateContent - Raw template markdown content
 * @param {Set<string>} canonicalLabels - Set of canonical label names
 * @returns {string[]} Validation errors for non-canonical labels
 */
function validateLabelReferencesInTemplate(templateContent, canonicalLabels) {
  const errors = [];

  // Find all label references in the template
  const labelPatterns = [
    /`([a-z:_-]+(?::[a-z:_*-]+)?)`/gi, // backticks
    /\[`([a-z:_-]+(?::[a-z:_*-]+)?)`\]/gi, // bracketed backticks
  ];

  const referencedLabels = new Set();
  for (const pattern of labelPatterns) {
    let match;
    while ((match = pattern.exec(templateContent))) {
      const label = match[1];
      // Only check labels that look like label names (contain : for prefixes or are simple)
      if (label.includes(':') || label.match(/^[a-z0-9-]+$/)) {
        referencedLabels.add(label);
      }
    }
  }

  // Check that referenced labels are canonical (if they look like real labels)
  for (const label of referencedLabels) {
    // Skip wildcard patterns and examples
    if (label.includes('*')) continue;
    if (label === 'type' || label === 'status' || label === 'priority') continue;

    // For specific labels, check if canonical
    if (label.includes(':') && !canonicalLabels.has(label)) {
      // Only error if it looks like a specific label (not a pattern)
      if (!label.endsWith(':') && label.split(':')[1].length > 1) {
        errors.push(`Template references non-canonical label: ${label}`);
      }
    }
  }

  return errors;
}

/**
 * Main entry point: Validate PR template structure and label references.
 * Exits with code 1 if validation fails, 0 on success.
 */
function main() {
  if (!fs.existsSync(TEMPLATE_PATH)) {
    console.error(`PR template not found at: ${TEMPLATE_PATH}`);
    process.exit(1);
  }

  if (!fs.existsSync(LABELS_FILE)) {
    console.error(`Labels file not found at: ${LABELS_FILE}`);
    process.exit(1);
  }

  const templateContent = fs.readFileSync(TEMPLATE_PATH, 'utf8');
  const canonicalLabels = getCanonicalLabels();

  const { errors: structureErrors, warnings: structureWarnings } =
    validateTemplateStructure(templateContent);
  const labelErrors = validateLabelReferencesInTemplate(
    templateContent,
    canonicalLabels,
  );

  const allErrors = [...structureErrors, ...labelErrors];

  if (allErrors.length > 0) {
    console.error('PR template validation FAILED:');
    for (const error of allErrors) {
      console.error(`  ❌ ${error}`);
    }
    process.exit(1);
  }

  if (structureWarnings.length > 0) {
    console.warn('PR template validation passed with warnings:');
    for (const warning of structureWarnings) {
      console.warn(`  ⚠️  ${warning}`);
    }
  }

  console.log('✅ PR template structure and label references are valid.');
}

main();
