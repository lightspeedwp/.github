/**
 * Changelog Validator
 * Two-gate validation system for changelog entries and structure
 */

const fs = require('fs');

/**
 * Validate entry format (Gate 1 - on PR to develop)
 * @param {Object} entry - { title, description, prLink }
 * @returns {Object} { valid: boolean, errors: [...] }
 */
function validateEntryFormat(entry = {}) {
  const errors = [];
  const { title = '', description = '', prLink = '' } = entry;

  // Title validation
  if (!title || title.length === 0) {
    errors.push('Title is required');
  } else if (title.length > 60) {
    errors.push(`Title must be < 60 chars (currently ${title.length})`);
  }

  // Description validation
  if (description && description.length > 150) {
    errors.push(
      `Description must be < 150 chars (currently ${description.length})`
    );
  }

  // Em-dash validation: flag " - " (spaced hyphens used for pauses), not compound words
  const hasSpacedHyphen = / - /.test(title) || / - /.test(description);

  if (hasSpacedHyphen) {
    errors.push('Use em-dashes (—) instead of hyphens (-) for pauses');
  }

  // PR link validation
  if (!prLink || !prLink.match(/#\d+/)) {
    errors.push('PR link required (e.g., #123)');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate changelog file structure (Gate 2 - at release time)
 * @param {string} changelogPath - Path to CHANGELOG.md
 * @returns {Object} { valid: boolean, errors: [...] }
 */
function validateChangelogStructure(changelogPath) {
  const errors = [];

  // Check file exists
  if (!fs.existsSync(changelogPath)) {
    return {
      valid: false,
      errors: ['CHANGELOG.md file not found'],
    };
  }

  try {
    const content = fs.readFileSync(changelogPath, 'utf8');

    // Check for Keep a Changelog format
    if (!content.includes('[Unreleased]')) {
      errors.push('[Unreleased] section is required');
    }

    // Check schema compliance
    const hasVersionPattern = /## \[\d+\.\d+\.\d+\]/m.test(content);
    const hasDatePattern = /## \[\d+\.\d+\.\d+\] - \d{4}-\d{2}-\d{2}/m.test(
      content
    );

    if (!hasVersionPattern && !hasDatePattern) {
      errors.push(
        'Version entries must follow format: ## [X.Y.Z] - YYYY-MM-DD'
      );
    }

    // Check for empty sections
    const unreleasedSection = content.match(
      /## \[Unreleased\]([\s\S]*?)(?=## \[|$)/
    );
    if (unreleasedSection) {
      const unreleasedContent = unreleasedSection[1].trim();
      if (!unreleasedContent || unreleasedContent.length === 0) {
        errors.push('[Unreleased] section is empty');
      }
    }

    // Check for category headers (optional, but recommended)
    // Note: Some changelogs may not use categories, so this is a warning not an error

    // Check all links are valid (at least reference section exists)
    const hasReferenceSection = content.includes('<!-- links -->') ||
      content.includes('[unreleased]:') ||
      /\[Unreleased\]:/.test(content);

    if (!hasReferenceSection && content.includes('[Unreleased]')) {
      errors.push('Changelog should include reference links section');
    }
  } catch (error) {
    errors.push(`Error reading file: ${error.message}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate no formatting issues
 * @param {Object} entry
 * @returns {Object} { valid: boolean, errors: [...] }
 */
function validateNoFormattingIssues(entry = {}) {
  const errors = [];
  const { title = '', description = '' } = entry;

  // Check for extra whitespace
  if (title !== title.trim()) {
    errors.push('Title has leading/trailing whitespace');
  }

  if (description && description !== description.trim()) {
    errors.push('Description has leading/trailing whitespace');
  }

  // Check for proper capitalization (first letter uppercase)
  if (title && title[0] === title[0].toLowerCase() && /[a-z]/.test(title[0])) {
    errors.push('Title should start with uppercase letter');
  }

  // Check for multiple spaces
  if (/  +/.test(title) || /  +/.test(description)) {
    errors.push('Remove multiple consecutive spaces');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Get all validation errors for an entry
 * @param {Object} entry
 * @returns {string[]} Array of error messages
 */
function getValidationErrors(entry = {}) {
  const allErrors = [];

  const formatErrors = validateEntryFormat(entry);
  allErrors.push(...formatErrors.errors);

  const formattingErrors = validateNoFormattingIssues(entry);
  allErrors.push(...formattingErrors.errors);

  return allErrors;
}

/**
 * Comprehensive validation for entry
 * @param {Object} entry
 * @param {string} gate - 'gate1' for PR validation, 'gate2' for release
 * @returns {Object} { valid: boolean, errors: [...] }
 */
function validateEntry(entry = {}, gate = 'gate1') {
  const formatValidation = validateEntryFormat(entry);

  if (!formatValidation.valid) {
    return formatValidation;
  }

  const formattingValidation = validateNoFormattingIssues(entry);

  if (!formattingValidation.valid) {
    return formattingValidation;
  }

  return {
    valid: true,
    errors: [],
  };
}

module.exports = {
  validateEntryFormat,
  validateChangelogStructure,
  validateNoFormattingIssues,
  getValidationErrors,
  validateEntry,
};
