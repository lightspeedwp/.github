/**
 * Checklist Item Validator
 * Validates individual checklist items against schema and business rules
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

const VALID_STATES = ['unchecked', 'checked', 'gap', 'ambiguity', 'ambiguity-critical'];

const VALID_PRIORITIES = ['critical', 'high', 'medium', 'low'];

/**
 * Validates a single checklist item
 * @param {Object} item - Checklist item to validate
 * @returns {Object} Validation result with isValid flag and errors array
 */
function validateItem(item) {
  const errors = [];

  // Check required fields
  if (!item.id) {
    errors.push('Missing required field: id');
  } else if (!isValidItemId(item.id)) {
    errors.push(`Invalid item ID format: ${item.id} (expected CHK-###-{Dimension})`);
  }

  if (!item.question) {
    errors.push('Missing required field: question');
  } else if (typeof item.question !== 'string' || item.question.trim().length === 0) {
    errors.push('Question must be a non-empty string');
  }

  if (!item.dimension) {
    errors.push('Missing required field: dimension');
  } else if (!VALID_DIMENSIONS.includes(item.dimension)) {
    errors.push(
      `Invalid dimension: ${item.dimension}. Valid values: ${VALID_DIMENSIONS.join(', ')}`
    );
  }

  if (!item.state) {
    errors.push('Missing required field: state');
  } else if (!VALID_STATES.includes(item.state)) {
    errors.push(`Invalid state: ${item.state}. Valid values: ${VALID_STATES.join(', ')}`);
  }

  // Validate optional fields
  if (item.specReference !== undefined && typeof item.specReference !== 'string') {
    errors.push('specReference must be a string');
  }

  if (item.reviewerComment !== undefined && typeof item.reviewerComment !== 'string') {
    errors.push('reviewerComment must be a string');
  }

  if (item.priority !== undefined && !VALID_PRIORITIES.includes(item.priority)) {
    errors.push(`Invalid priority: ${item.priority}. Valid values: ${VALID_PRIORITIES.join(', ')}`);
  }

  // Validate marker consistency: if state is gap/ambiguity, should have spec reference explaining it
  if (['gap', 'ambiguity', 'ambiguity-critical'].includes(item.state)) {
    if (!item.specReference) {
      errors.push(`State "${item.state}" requires specReference with explanation of gap/ambiguity`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    item,
  };
}

/**
 * Validates item ID format: CHK-###-{Dimension}
 * @param {string} id - Item ID to validate
 * @returns {boolean} True if valid format
 */
function isValidItemId(id) {
  const pattern = /^CHK-\d{3}-[A-Za-z-]+$/;
  if (!pattern.test(id)) {
    return false;
  }

  // Extract dimension from ID
  const parts = id.split('-');
  if (parts.length < 3) {
    return false;
  }

  const dimensionPart = parts.slice(2).join('-');
  // ID dimension should match one of the valid dimensions (normalized)
  const normalizedDimensions = VALID_DIMENSIONS.map((d) =>
    d
      .replace(/([A-Z])/g, '-$1')
      .toLowerCase()
      .replace(/^-/, '')
  );
  return normalizedDimensions.includes(dimensionPart.toLowerCase());
}

/**
 * Validates multiple items
 * @param {Array} items - Array of items to validate
 * @returns {Object} Validation result with summary and per-item errors
 */
function validateItems(items) {
  if (!Array.isArray(items)) {
    return {
      isValid: false,
      errors: ['Items must be an array'],
      itemResults: [],
    };
  }

  const itemResults = items.map((item, index) => {
    const result = validateItem(item);
    return {
      index,
      id: item.id || 'unknown',
      ...result,
    };
  });

  const failedItems = itemResults.filter((r) => !r.isValid);
  const isValid = failedItems.length === 0;

  return {
    isValid,
    totalItems: items.length,
    validItems: items.length - failedItems.length,
    invalidItems: failedItems.length,
    itemResults,
    summary:
      failedItems.length > 0
        ? `${failedItems.length}/${items.length} items have validation errors`
        : `All ${items.length} items are valid`,
  };
}

module.exports = {
  validateItem,
  validateItems,
  isValidItemId,
  VALID_DIMENSIONS,
  VALID_STATES,
  VALID_PRIORITIES,
};
