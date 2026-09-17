/**
 * Dimension Classifier
 * Classifies and categorizes checklist items by their quality dimension
 */

const DIMENSIONS = {
  Completeness: {
    name: 'Completeness',
    description: 'All required information and requirements are present',
    items: [
      'Are error handling requirements defined for ALL failure scenarios?',
      'Are non-functional requirements covered?',
      'Are external dependencies documented?',
      'Are edge cases and boundary conditions explicitly addressed?',
      'Are assumptions documented?',
      'Are all user roles and permissions specified?',
    ],
  },
  Clarity: {
    name: 'Clarity',
    description: 'Requirements are unambiguous and measurable',
    items: [
      'Are vague terms replaced with measurable criteria?',
      'Is terminology consistent?',
      'Are acceptance criteria unambiguous?',
      'Are visual/interaction requirements clearly described?',
      'Are data formats explicitly specified?',
      'Are decision criteria clear?',
    ],
  },
  Consistency: {
    name: 'Consistency',
    description: 'Requirements do not conflict internally or externally',
    items: [
      'Are there conflicting requirements?',
      'Do related requirements contradict each other?',
      'Is terminology usage consistent?',
      'Do security requirements align with performance constraints?',
      'Are dependencies documented in both directions?',
    ],
  },
  Measurability: {
    name: 'Measurability',
    description: 'Requirements have quantified success criteria and acceptance tests',
    items: [
      'Does every success criterion include measurable acceptance test?',
      'Are performance metrics quantified?',
      'Are quality metrics defined?',
      'Can each requirement be validated?',
      'Are SLAs/SLOs explicitly stated?',
    ],
  },
  'Scenario-Coverage': {
    name: 'Scenario-Coverage',
    description: 'All user scenarios and workflows are documented',
    items: [
      'Are all primary user workflows documented?',
      'Are concurrent/parallel user scenarios addressed?',
      'Are offline/degraded-mode scenarios covered?',
      'Are integration scenarios addressed?',
      'Are multi-user scenarios specified?',
      'Are mobile/responsive scenarios covered?',
    ],
  },
  'Edge-Cases': {
    name: 'Edge-Cases',
    description: 'Boundary conditions and exceptional cases are handled',
    items: [
      'Are empty/null/zero cases handled?',
      'Are maximum/minimum boundaries specified?',
      'Are timeout scenarios defined?',
      'Are recovery flows documented?',
      'Are partial failure scenarios addressed?',
      'Are resource exhaustion scenarios covered?',
    ],
  },
  Dependencies: {
    name: 'Dependencies',
    description: 'All external and internal dependencies are documented',
    items: [
      'Are all third-party dependencies documented?',
      'Are data dependencies documented?',
      'Are system dependencies specified?',
      'Are assumptions about user knowledge documented?',
      'Are external compliance requirements documented?',
      'Are scheduling/ordering dependencies specified?',
    ],
  },
  Ambiguities: {
    name: 'Ambiguities',
    description: 'Unclear or conflicting areas are identified and resolved',
    items: [
      'Are there unresolved design decisions?',
      'Are there conflicting interpretations?',
      'Are scope boundaries clearly defined?',
      'Are future extensions deferred?',
      'Are stakeholder sign-offs obtained?',
    ],
  },
};

/**
 * Get dimension metadata by name
 * @param {string} dimensionName - Name of dimension (e.g., 'Completeness')
 * @returns {Object|null} Dimension metadata or null if not found
 */
function getDimension(dimensionName) {
  return DIMENSIONS[dimensionName] || null;
}

/**
 * Classify items by dimension
 * @param {Array} items - Array of checklist items
 * @returns {Object} Items grouped by dimension
 */
function classifyByDimension(items) {
  if (!Array.isArray(items)) {
    return {};
  }

  const classified = {};

  // Initialize all dimensions
  Object.keys(DIMENSIONS).forEach((dim) => {
    classified[dim] = [];
  });

  // Classify items
  items.forEach((item) => {
    if (item.dimension && DIMENSIONS[item.dimension]) {
      classified[item.dimension].push(item);
    }
  });

  return classified;
}

/**
 * Get dimension summary statistics
 * @param {Array} items - Array of checklist items
 * @returns {Object} Statistics by dimension
 */
function getDimensionStats(items) {
  const classified = classifyByDimension(items);
  const stats = {};

  Object.entries(classified).forEach(([dimension, dimItems]) => {
    const checked = dimItems.filter((item) => item.state === 'checked').length;
    const gaps = dimItems.filter((item) => item.state === 'gap').length;
    const ambiguities = dimItems.filter((item) => item.state === 'ambiguity').length;
    const criticalAmbiguities = dimItems.filter(
      (item) => item.state === 'ambiguity-critical'
    ).length;

    stats[dimension] = {
      total: dimItems.length,
      checked,
      unchecked: dimItems.length - checked,
      gaps,
      ambiguities,
      criticalAmbiguities,
      completionPercent: dimItems.length > 0 ? Math.round((checked / dimItems.length) * 100) : 0,
      status: gaps > 0 || criticalAmbiguities > 0 ? 'incomplete' : 'complete',
    };
  });

  return stats;
}

/**
 * Get all dimension names
 * @returns {Array} Array of dimension names
 */
function getDimensionNames() {
  return Object.keys(DIMENSIONS);
}

/**
 * Get items for a specific dimension
 * @param {Array} items - Array of checklist items
 * @param {string} dimensionName - Name of dimension to filter
 * @returns {Array} Items matching the dimension
 */
function getItemsForDimension(items, dimensionName) {
  if (!DIMENSIONS[dimensionName]) {
    return [];
  }

  return items.filter((item) => item.dimension === dimensionName);
}

/**
 * Validate that items cover all dimensions
 * @param {Array} items - Array of checklist items
 * @returns {Object} Coverage report with missing dimensions
 */
function validateDimensionCoverage(items) {
  const classified = classifyByDimension(items);
  const missingDimensions = [];

  Object.keys(DIMENSIONS).forEach((dimension) => {
    if (classified[dimension].length === 0) {
      missingDimensions.push(dimension);
    }
  });

  return {
    isCovered: missingDimensions.length === 0,
    coveredDimensions: Object.keys(DIMENSIONS).length - missingDimensions.length,
    totalDimensions: Object.keys(DIMENSIONS).length,
    missingDimensions,
    coverage: `${(((Object.keys(DIMENSIONS).length - missingDimensions.length) / Object.keys(DIMENSIONS).length) * 100).toFixed(0)}%`,
  };
}

module.exports = {
  getDimension,
  classifyByDimension,
  getDimensionStats,
  getDimensionNames,
  getItemsForDimension,
  validateDimensionCoverage,
  DIMENSIONS,
};
