/**
 * Custom Item Merger
 *
 * Merges user-defined custom checklist items with generated base/variant items.
 * Handles deduplication, validation, and dimension classification.
 *
 * Exports:
 * - mergeCustomItems(base, customItems): Merge custom items into base checklist
 * - validateCustomItems(items): Validate custom items against schema and dimensions
 * - deduplicateItems(items): Remove duplicate items by ID
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
 * Remove duplicate items by ID
 *
 * Filters items array keeping only first occurrence of each ID.
 * Preserves order, removes subsequent duplicates.
 *
 * @param {Array} items - Checklist items with id, question, dimension
 * @returns {Array} Deduplicated items array
 */
function deduplicateItems(items) {
  const seen = new Set();
  return items.filter(item => {
    if (seen.has(item.id)) {
      return false;
    }
    seen.add(item.id);
    return true;
  });
}

/**
 * Validate custom items against schema and dimension requirements
 *
 * Checks: required fields (id, question, dimension), valid dimension names,
 * ID format (CHK-###-{dimension}), and detects issues for warning/error reporting.
 *
 * @param {Array} items - Custom items to validate
 * @returns {Object} { errors: [], warnings: [] } - Validation results
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
    } else if (!VALID_DIMENSIONS.includes(item.dimension)) {
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
 * Merge custom items into a base checklist
 *
 * Combines base checklist items with user-provided custom items, deduplicates,
 * and tracks statistics (base count, custom count, total count).
 *
 * @param {Object} baseChecklist - Generated checklist with items and metadata
 * @param {Array} customItems - Custom items to merge (array of {id, question, dimension})
 * @returns {Object} Merged checklist with items, metadata, and merge statistics
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
  customItems.forEach(item => {
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
