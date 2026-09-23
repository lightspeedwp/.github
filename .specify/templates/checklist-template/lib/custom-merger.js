/**
 * Custom Item Merger
 * T050: Merge custom items with generated checklist
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
