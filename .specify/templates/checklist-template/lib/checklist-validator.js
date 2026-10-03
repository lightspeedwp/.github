/**
 * Checklist Validator
 * T053: Validate generated checklists
 */

/**
 * Valid checklist item dimensions
 * @type {Array<string>}
 */
const VALID_DIMENSIONS = [
  'Completeness',
  'Clarity',
  'Consistency',
  'Measurability',
  'Scenario-Coverage',
  'Edge-Cases',
  'Dependencies',
  'Ambiguities',
];

/**
 * Validates a checklist object structure and items
 * Checks for required fields, valid dimensions, duplicate IDs, and dimension coverage
 * @param {Object} checklist - Checklist object to validate
 * @param {Array} checklist.items - Array of checklist items
 * @param {Object} [checklist.metadata] - Metadata object
 * @returns {Object} Validation result
 * @returns {boolean} result.isValid - Whether checklist is valid
 * @returns {Array<string>} result.errors - Array of error messages
 * @returns {Array<string>} result.warnings - Array of warning messages
 */
function checklistValidator(checklist) {
  const errors = [];
  const warnings = [];

  if (!checklist || typeof checklist !== 'object') {
    return {
      isValid: false,
      errors: ['Checklist must be an object'],
      warnings,
    };
  }

  // Check structure
  if (!Array.isArray(checklist.items)) {
    errors.push('Checklist must have an "items" array');
  }

  if (!checklist.metadata) {
    errors.push('Checklist must have metadata');
  }

  // Check items
  if (Array.isArray(checklist.items)) {
    const seenIds = new Set();
    const dimensionCoverage = new Set();

    checklist.items.forEach((item, index) => {
      // Check required fields
      if (!item.id) {
        errors.push(`Item ${index}: Missing ID`);
      } else {
        // Check for duplicates
        if (seenIds.has(item.id)) {
          errors.push(`Item ${index}: Duplicate ID '${item.id}'`);
        }
        seenIds.add(item.id);

        // Check ID format
        if (!item.id.match(/^CHK-\d{3}-[\w-]+$/)) {
          errors.push(`Item ${index}: Invalid ID format '${item.id}'`);
        }
      }

      if (!item.question) {
        errors.push(`Item ${index}: Missing question`);
      }

      if (!item.dimension) {
        errors.push(`Item ${index}: Missing dimension`);
      } else {
        // Track coverage under the canonical hyphenated name so space and
        // hyphen forms ('Scenario Coverage' vs 'Scenario-Coverage') unify.
        const canonicalDimension = String(item.dimension).toLowerCase().replace(/\s+/g, '-');
        dimensionCoverage.add(canonicalDimension);

        // Check valid dimension (spaces and hyphens equivalent)
        const validDimensions = VALID_DIMENSIONS.map((d) => d.toLowerCase().replace(/\s+/g, '-'));
        if (!validDimensions.includes(canonicalDimension)) {
          errors.push(`Item ${index}: Invalid dimension '${item.dimension}'`);
        }
      }
    });

    // Check dimension coverage
    VALID_DIMENSIONS.forEach((dimension) => {
      if (!dimensionCoverage.has(dimension.toLowerCase())) {
        warnings.push(`Missing coverage for dimension: ${dimension}`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

module.exports = {
  checklistValidator,
};
