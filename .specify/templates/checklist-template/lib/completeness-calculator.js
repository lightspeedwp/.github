/**
 * Completeness Calculator
 * Calculates checklist completion metrics and status determination
 */

const STATUS_THRESHOLDS = {
  pass: {
    gaps: 0,
    criticalAmbiguities: 0,
    ambiguities: 3,
    checkedPercent: 80,
  },
  caution: {
    gaps: 2,
    criticalAmbiguities: 1,
    ambiguities: 5,
    checkedPercent: 60,
  },
  fail: {
    gaps: Infinity,
    criticalAmbiguities: 2,
    ambiguities: Infinity,
  },
};

/**
 * Calculate completion metrics from checklist items
 * @param {Array} items - Array of checklist items
 * @returns {Object} Completion metrics
 */
function calculateMetrics(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return {
      totalItems: 0,
      checkedItems: 0,
      uncheckedItems: 0,
      gaps: 0,
      ambiguities: 0,
      criticalAmbiguities: 0,
      completionPercent: 0,
      status: 'empty',
    };
  }

  const checked = items.filter((item) => item.state === 'checked').length;
  const gaps = items.filter((item) => item.state === 'gap').length;
  const ambiguities = items.filter((item) => item.state === 'ambiguity').length;
  const criticalAmbiguities = items.filter((item) => item.state === 'ambiguity-critical').length;

  const totalItems = items.length;
  const unchecked = totalItems - checked;
  const completionPercent = Math.round((checked / totalItems) * 100);

  return {
    totalItems,
    checkedItems: checked,
    uncheckedItems: unchecked,
    gaps,
    ambiguities,
    criticalAmbiguities,
    completionPercent,
  };
}

/**
 * Determine overall status based on metrics
 * @param {Object} metrics - Completion metrics
 * @returns {string} Status: 'pass', 'caution', 'fail', 'empty'
 */
function determineStatus(metrics) {
  if (metrics.totalItems === 0) {
    return 'empty';
  }

  // Critical ambiguities always fail
  if (metrics.criticalAmbiguities >= STATUS_THRESHOLDS.fail.criticalAmbiguities) {
    return 'fail';
  }

  // Three or more gaps is failure
  if (metrics.gaps >= 3) {
    return 'fail';
  }

  // Check CAUTION thresholds
  if (
    metrics.gaps <= STATUS_THRESHOLDS.caution.gaps &&
    metrics.criticalAmbiguities <= STATUS_THRESHOLDS.caution.criticalAmbiguities &&
    metrics.ambiguities <= STATUS_THRESHOLDS.caution.ambiguities &&
    metrics.completionPercent >= STATUS_THRESHOLDS.caution.checkedPercent
  ) {
    // Check if within PASS thresholds (more restrictive)
    if (
      metrics.gaps <= STATUS_THRESHOLDS.pass.gaps &&
      metrics.criticalAmbiguities <= STATUS_THRESHOLDS.pass.criticalAmbiguities &&
      metrics.ambiguities <= STATUS_THRESHOLDS.pass.ambiguities &&
      metrics.completionPercent >= STATUS_THRESHOLDS.pass.checkedPercent
    ) {
      return 'pass';
    }

    return 'caution';
  }

  return 'fail';
}

/**
 * Get status symbol
 * @param {string} status - Status value
 * @returns {string} Status symbol (emoji)
 */
function getStatusSymbol(status) {
  const symbols = {
    pass: '✅',
    caution: '⚠️',
    fail: '❌',
    empty: '📋',
  };

  return symbols[status] || '❓';
}

/**
 * Get status description
 * @param {string} status - Status value
 * @returns {string} Status description
 */
function getStatusDescription(status) {
  const descriptions = {
    pass: 'PASS — Ready for implementation',
    caution: 'CAUTION — Proceed with stakeholder awareness of gaps/ambiguities',
    fail: 'FAIL — Critical issues must be resolved before implementation',
    empty: 'EMPTY — No items to evaluate',
  };

  return descriptions[status] || 'Unknown status';
}

/**
 * Calculate checklist report with metrics and status
 * @param {Array} items - Array of checklist items
 * @returns {Object} Complete report with recommendations
 */
function calculateReport(items) {
  const metrics = calculateMetrics(items);
  const status = determineStatus(metrics);
  const symbol = getStatusSymbol(status);
  const description = getStatusDescription(status);

  // Determine blocking issues
  const blockingIssues = [];

  if (metrics.criticalAmbiguities > 0) {
    blockingIssues.push(
      `${metrics.criticalAmbiguities} critical ambiguity/ambiguities blocking design decisions`
    );
  }

  if (metrics.gaps >= 3) {
    blockingIssues.push(`${metrics.gaps} gaps in requirements`);
  }

  // Determine warnings
  const warnings = [];

  if (metrics.gaps > 0 && metrics.gaps < 3) {
    warnings.push(`${metrics.gaps} gap(s) in specification`);
  }

  if (metrics.ambiguities > STATUS_THRESHOLDS.pass.ambiguities) {
    warnings.push(`${metrics.ambiguities} ambiguity/ambiguities (target: ≤3)`);
  }

  if (metrics.completionPercent < STATUS_THRESHOLDS.pass.checkedPercent) {
    warnings.push(`Completion at ${metrics.completionPercent}% (target: ≥80%)`);
  }

  // Determine recommended actions
  const recommendedActions = [];

  if (blockingIssues.length > 0) {
    recommendedActions.push('Resolve all critical ambiguities and major gaps before proceeding');
  }

  if (warnings.length > 0) {
    recommendedActions.push('Address identified gaps and ambiguities');
  }

  if (status === 'pass') {
    recommendedActions.push('Specification approved — ready for implementation');
  }

  if (status === 'caution') {
    recommendedActions.push('Obtain stakeholder acknowledgement of identified issues');
  }

  return {
    metrics,
    status,
    symbol,
    description,
    blockingIssues,
    warnings,
    recommendedActions,
    canProceed: status === 'pass' || status === 'caution',
    needsReview: blockingIssues.length > 0 || warnings.length > 0,
  };
}

/**
 * Check if specification is "good enough to implement"
 * @param {Array} items - Array of checklist items
 * @returns {Object} Approval assessment
 */
function isGoodEnoughToImplement(items) {
  const report = calculateReport(items);

  const approval = {
    approved: report.status === 'pass',
    approvedWithCautions: report.status === 'caution',
    blocked: report.status === 'fail' || report.status === 'empty',
    status: report.status,
    rationale: [],
  };

  if (approval.approved) {
    approval.rationale.push('All gaps resolved');
    approval.rationale.push(
      `Critical ambiguities: ${report.metrics.criticalAmbiguities} (≤0 required)`
    );
    approval.rationale.push(`Ambiguities: ${report.metrics.ambiguities} (≤3 allowed)`);
    approval.rationale.push(`Completion: ${report.metrics.completionPercent}% (≥80% required)`);
  } else if (approval.approvedWithCautions) {
    approval.rationale.push('Specification is acceptable with stakeholder awareness of cautions');
    approval.rationale.push(`Gaps: ${report.metrics.gaps} (requires mitigation plan)`);
    approval.rationale.push(
      `Critical ambiguities: ${report.metrics.criticalAmbiguities} (acceptable if acknowledged)`
    );
  } else {
    approval.rationale.push('Specification has blocking issues that must be resolved');
    report.blockingIssues.forEach((issue) => {
      approval.rationale.push(`  - ${issue}`);
    });
  }

  return approval;
}

module.exports = {
  calculateMetrics,
  determineStatus,
  getStatusSymbol,
  getStatusDescription,
  calculateReport,
  isGoodEnoughToImplement,
  STATUS_THRESHOLDS,
};
