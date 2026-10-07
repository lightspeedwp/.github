/**
 * Traceability Linker
 * Creates and manages traceability links between checklist items and specification elements
 */

/**
 * Parse specification reference format
 * Supports formats like:
 * - [Spec §FR-1] — requirement reference
 * - [Gap] — gap marker
 * - [Ambiguity: details] — ambiguity with detail
 * @param {string} specReference - Specification reference string
 * @returns {Object} Parsed reference
 */
function parseSpecReference(specReference) {
  if (!specReference) {
    return {
      type: 'none',
      value: null,
      isMarker: false,
    };
  }

  // Check for gap marker
  if (specReference.startsWith('[Gap')) {
    return {
      type: 'gap',
      value: specReference.match(/\[Gap:\s*([^\]]*)\]/)?.[1] || 'Unspecified gap',
      isMarker: true,
    };
  }

  // Check for ambiguity markers
  if (specReference.startsWith('[Ambiguity-Critical')) {
    return {
      type: 'ambiguity-critical',
      value: specReference.match(/\[Ambiguity-Critical:\s*([^\]]*)\]/)?.[1] || 'Critical ambiguity',
      isMarker: true,
    };
  }

  if (specReference.startsWith('[Ambiguity')) {
    return {
      type: 'ambiguity',
      value: specReference.match(/\[Ambiguity:\s*([^\]]*)\]/)?.[1] || 'Ambiguity',
      isMarker: true,
    };
  }

  // Check for spec reference
  const specMatch = specReference.match(/\[Spec\s+§?([A-Z]{2,3}-\d+)\]/);
  if (specMatch) {
    return {
      type: 'spec',
      value: specMatch[1],
      section: specMatch[1],
      isMarker: false,
    };
  }

  // Generic reference
  return {
    type: 'generic',
    value: specReference,
    isMarker: false,
  };
}

/**
 * Create traceability matrix from items
 * @param {Array} items - Checklist items
 * @param {Object} specMetadata - Specification metadata (title, version, etc.)
 * @returns {Object} Traceability matrix
 */
function createTraceabilityMatrix(items, specMetadata = {}) {
  const matrix = {
    spec: specMetadata,
    traceability: {},
    summary: {
      totalItems: items.length,
      linkedItems: 0,
      gapItems: 0,
      ambiguityItems: 0,
      unmarkedItems: 0,
    },
  };

  items.forEach((item) => {
    const parsed = parseSpecReference(item.specReference);

    const entry = {
      id: item.id,
      dimension: item.dimension,
      question: item.question,
      state: item.state,
      reference: parsed,
      priority: item.priority || 'normal',
    };

    // Add to appropriate bucket
    if (parsed.type === 'gap') {
      matrix.summary.gapItems++;
    } else if (parsed.type === 'ambiguity' || parsed.type === 'ambiguity-critical') {
      matrix.summary.ambiguityItems++;
    } else if (parsed.type === 'none') {
      matrix.summary.unmarkedItems++;
    } else {
      matrix.summary.linkedItems++;
    }

    // Index by item ID
    matrix.traceability[item.id] = entry;
  });

  return matrix;
}

/**
 * Get items linked to a specific requirement
 * @param {Object} matrix - Traceability matrix
 * @param {string} requirementId - Requirement ID (e.g., 'FR-1')
 * @returns {Array} Items linking to this requirement
 */
function getItemsForRequirement(matrix, requirementId) {
  return Object.values(matrix.traceability).filter(
    (entry) => entry.reference.type === 'spec' && entry.reference.section === requirementId
  );
}

/**
 * Get items without proper traceability
 * @param {Object} matrix - Traceability matrix
 * @returns {Array} Untraced items
 */
function getUntracedItems(matrix) {
  return Object.values(matrix.traceability).filter((entry) => entry.reference.type === 'none');
}

/**
 * Get all gaps from traceability matrix
 * @param {Object} matrix - Traceability matrix
 * @returns {Array} Gap items with details
 */
function getGaps(matrix) {
  return Object.values(matrix.traceability).filter((entry) => entry.reference.type === 'gap');
}

/**
 * Get all ambiguities from traceability matrix
 * @param {Object} matrix - Traceability matrix
 * @returns {Object} Ambiguities organized by criticality
 */
function getAmbiguities(matrix) {
  const ambiguities = Object.values(matrix.traceability).filter(
    (entry) => entry.reference.type === 'ambiguity' || entry.reference.type === 'ambiguity-critical'
  );

  return {
    all: ambiguities,
    critical: ambiguities.filter((entry) => entry.reference.type === 'ambiguity-critical'),
    standard: ambiguities.filter((entry) => entry.reference.type === 'ambiguity'),
  };
}

/**
 * Generate traceability report
 * @param {Object} matrix - Traceability matrix
 * @returns {Object} Human-readable report
 */
function generateReport(matrix) {
  const gaps = getGaps(matrix);
  const ambiguities = getAmbiguities(matrix);
  const untraced = getUntracedItems(matrix);

  return {
    summary: matrix.summary,
    gaps: {
      count: gaps.length,
      items: gaps,
    },
    ambiguities: {
      count: ambiguities.all.length,
      critical: ambiguities.critical.length,
      standard: ambiguities.standard.length,
      items: ambiguities,
    },
    untraced: {
      count: untraced.length,
      items: untraced,
    },
    coverage: {
      linkedPercent: Math.round(
        (matrix.summary.linkedItems / matrix.summary.totalItems) * 100 || 0
      ),
      traceablePercent: Math.round(
        ((matrix.summary.linkedItems + matrix.summary.gapItems + matrix.summary.ambiguityItems) /
          matrix.summary.totalItems) *
          100 || 0
      ),
    },
  };
}

/**
 * Create bidirectional linkage between requirement and checklist items
 * @param {string} requirementId - Requirement ID
 * @param {Array} linkedItemIds - Item IDs that verify this requirement
 * @returns {Object} Linkage record
 */
function createRequirementLink(requirementId, linkedItemIds = []) {
  return {
    requirementId,
    linkedItems: linkedItemIds,
    coverage: linkedItemIds.length > 0 ? 'verified' : 'unverified',
    verified: linkedItemIds.length > 0,
  };
}

/**
 * Validate traceability completeness
 * @param {Object} matrix - Traceability matrix
 * @returns {Object} Validation result
 */
function validateTraceability(matrix) {
  const gaps = getGaps(matrix);
  const criticalAmbiguities = getAmbiguities(matrix).critical;
  const untraced = getUntracedItems(matrix);

  return {
    isComplete: gaps.length === 0 && criticalAmbiguities.length === 0 && untraced.length === 0,
    issues: {
      gaps: gaps.length,
      criticalAmbiguities: criticalAmbiguities.length,
      untraced: untraced.length,
    },
    needsAttention: gaps.length > 0 || criticalAmbiguities.length > 0 || untraced.length > 0,
    blockers: gaps.length > 2 || criticalAmbiguities.length > 0,
  };
}

module.exports = {
  parseSpecReference,
  createTraceabilityMatrix,
  getItemsForRequirement,
  getUntracedItems,
  getGaps,
  getAmbiguities,
  generateReport,
  createRequirementLink,
  validateTraceability,
};
