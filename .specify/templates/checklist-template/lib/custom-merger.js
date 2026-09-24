/**
 * Custom Item Merger
 * T050: Merge custom items with generated checklist
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
 * Removes duplicate items from array based on ID
 * Items without IDs are always kept (validation will flag them separately)
 * @param {Array<Object>} items - Array of checklist items
 * @returns {Array<Object>} Deduplicated array keeping first occurrence of each ID
 */
function deduplicateItems(items) {
  const seen = new Set();
  return items.filter((item) => {
    // ID-less items cannot collide: keep them and let validateCustomItems
    // report the missing id instead of dropping them as duplicates.
    if (!item || !item.id) {
      return true;
    }
    if (seen.has(item.id)) {
      return false;
    }
    seen.add(item.id);
    return true;
  });
}

/**
 * Validates custom checklist items against schema requirements
 * Checks required fields (id, question, dimension) and dimension validity
 * @param {Array<Object>} items - Array of custom items to validate
 * @returns {Object} Validation result
 * @returns {boolean} result.isValid - Whether all items are valid
 * @returns {Array<string>} result.errors - Array of error messages
 * @returns {Array<string>} result.warnings - Array of warning messages
 */
function validateCustomItems(items) {
  const errors = [];
  const warnings = [];

  if (!Array.isArray(items)) {
    return { isValid: false, errors: ['Items must be an array'], warnings };
  }

  items.forEach((item, index) => {
    if (!item.id) {
      errors.push(`Item ${index}: Missing required field 'id'`);
    }
    if (!item.question) {
      errors.push(`Item ${index}: Missing required field 'question'`);
    }
    if (!item.dimension) {
      errors.push(`Item ${index}: Missing required field 'dimension'`);
    } else if (
      !VALID_DIMENSIONS.map((d) => d.toLowerCase().replace(/\s+/g, '-')).includes(
        String(item.dimension).toLowerCase().replace(/\s+/g, '-')
      )
    ) {
      errors.push(`Item ${index}: Invalid dimension '${item.dimension}'`);
    }

    // Warn about potential conflicts with base items
    if (item.id && item.id.startsWith('CHK-001')) {
      warnings.push(`Warning: Item ${index} (${item.id}) may conflict with base checklist`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Merges custom items with base checklist items
 * Combines base and custom items, deduplicates by ID, and updates statistics
 * @param {Object} baseChecklist - Base checklist object
 * @param {Array<Object>} baseChecklist.items - Base checklist items
 * @param {Object} baseChecklist.metadata - Base checklist metadata
 * @param {Array<Object>} [customItems=[]] - Custom items to merge
 * @returns {Object} Merged checklist
 * @returns {Array<Object>} result.items - Combined and deduplicated items
 * @returns {Object} result.metadata - Original checklist metadata
 * @returns {Object} result.stats - Merge statistics (baseItemCount, customItemCount, totalItemCount)
 */
function mergeCustomItems(baseChecklist, customItems = []) {
  const merged = {
    items: [...(baseChecklist.items || [])],
    metadata: baseChecklist.metadata || {},
    stats: {
      baseItemCount: baseChecklist.items ? baseChecklist.items.length : 0,
      customItemCount: customItems.length,
      totalItemCount: 0,
    },
  };

  // Add custom items
  customItems.forEach((item) => {
    merged.items.push({
      ...item,
      isCustom: true,
    });
  });

  // Deduplicate
  merged.items = deduplicateItems(merged.items);

  // Update stats
  merged.stats.totalItemCount = merged.items.length;

  return merged;
}

module.exports = {
  mergeCustomItems,
  deduplicateItems,
  validateCustomItems,
};
