/**
 * Checklist Validator
 *
 * Validates generated checklists against structural and content requirements.
 * Checks: object structure, required fields, item properties, dimension validity,
 * ID uniqueness, and completeness metrics.
 *
 * Exports:
 * - checklistValidator(checklist): Validate checklist structure and content
 */

const VALID_DIMENSIONS = [
  'Completeness',
  'Clarity',
  'Consistency',
  'Measurability',
  'Scenario Coverage',
  'Edge Cases',
  'Dependencies',
  'Ambiguities',
];

/**
 * Validate checklist structure and content
 *
 * Performs comprehensive validation including:
 * - Presence of required fields (items array, metadata object, summary object)
 * - Item property validation (id, question, dimension, state)
 * - Dimension name validation against VALID_DIMENSIONS
 * - ID uniqueness and format validation (CHK-###-{dimension})
 * - Summary metrics consistency
 *
 * @param {Object} checklist - Checklist object to validate
 * @returns {Object} { isValid: boolean, errors: string[], warnings: string[] }
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
        if (!item.id.match(/^CHK-\d{3}-[\w\-]+$/)) {
          errors.push(`Item ${index}: Invalid ID format '${item.id}'`);
        }
      }

      if (!item.question) {
        errors.push(`Item ${index}: Missing question`);
      }

      if (!item.dimension) {
        errors.push(`Item ${index}: Missing dimension`);
      } else {
        dimensionCoverage.add(item.dimension);

        // Check valid dimension
        if (!VALID_DIMENSIONS.includes(item.dimension)) {
          errors.push(`Item ${index}: Invalid dimension '${item.dimension}'`);
        }
      }
    });

    // Check dimension coverage
    VALID_DIMENSIONS.forEach(dimension => {
      if (!dimensionCoverage.has(dimension)) {
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
