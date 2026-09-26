/**
 * ID Sequencer
 * T050 dependency: Generate and validate sequential checklist IDs
 */

// Note: dimensions used for validation in validateIdSequence
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

function formatDimensionInId(dimension) {
  return dimension.replace(/ /g, '-');
}

function extractNumberFromId(id) {
  const match = id.match(/CHK-(\d+)-/);
  return match ? parseInt(match[1], 10) : 0;
}

function getNextId(items, dimension) {
  if (!items || items.length === 0) {
    return `CHK-001-${formatDimensionInId(dimension)}`;
  }

  let maxNum = 0;
  items.forEach((item) => {
    if (item.id) {
      const num = extractNumberFromId(item.id);
      if (num > maxNum) {
        maxNum = num;
      }
    }
  });

  const nextNum = String(maxNum + 1).padStart(3, '0');
  return `CHK-${nextNum}-${formatDimensionInId(dimension)}`;
}

function sequenceIds(items) {
  if (!Array.isArray(items)) {
    return [];
  }

  if (items.length === 0) {
    return [];
  }

  const sequenced = [];
  let counter = 1;

  items.forEach((item) => {
    const sequencedItem = { ...item };

    // Generate ID if missing or invalid
    if (!item.id || !item.id.startsWith('CHK-')) {
      const num = String(counter).padStart(3, '0');
      const dimension = item.dimension || 'Unknown';
      sequencedItem.id = `CHK-${num}-${formatDimensionInId(dimension)}`;
    } else {
      // Use existing ID but update number to be sequential
      const dimension = formatDimensionInId(item.dimension);
      const num = String(counter).padStart(3, '0');
      sequencedItem.id = `CHK-${num}-${dimension}`;
    }

    sequenced.push(sequencedItem);
    counter += 1;
  });

  return sequenced;
}

function validateIdSequence(items) {
  const errors = [];
  const warnings = [];

  if (!Array.isArray(items)) {
    return { isValid: true, errors: [], warnings };
  }

  if (items.length === 0) {
    return { isValid: true, errors: [], warnings };
  }

  const seenIds = new Set();
  let expectedNum = 1;

  items.forEach((item, index) => {
    if (!item.id) {
      errors.push(`Item ${index}: Missing ID`);
      return;
    }

    // Check format
    if (!item.id.match(/^CHK-\d{3}-[\w-]+$/)) {
      errors.push(`Item ${index}: Invalid format for ID '${item.id}'`);
    }

    // Check for duplicates
    if (seenIds.has(item.id)) {
      errors.push(`Item ${index}: Duplicate ID '${item.id}'`);
    }
    seenIds.add(item.id);

    // Check sequence
    const num = extractNumberFromId(item.id);
    if (num !== expectedNum) {
      errors.push(
        `Item ${index}: Gap in sequence (expected CHK-${String(expectedNum).padStart(3, '0')}, got CHK-${String(num).padStart(3, '0')})`
      );
    }
    expectedNum = num + 1;

    // Check dimension mismatch
    if (item.dimension) {
      const idDimension = item.id.split('-').slice(2).join('-');
      const expectedDimension = formatDimensionInId(item.dimension);
      if (idDimension !== expectedDimension) {
        warnings.push(
          `Item ${index}: Dimension mismatch (ID has '${idDimension}', item has '${expectedDimension}')`
        );
      }
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

module.exports = {
  sequenceIds,
  validateIdSequence,
  getNextId,
};
