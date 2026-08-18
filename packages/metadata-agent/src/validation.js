/**
 * Validation Module
 *
 * Implements three-tier validation system for GitHub metadata (labels, project fields):
 * - Tier 1: Blockers (must pass before any release)
 * - Tier 2: Warnings (should pass before minor/major releases)
 * - Tier 3: Info (nice-to-have checks, for awareness)
 *
 * Provides validation rules specific to release types (patch, minor, major)
 * and returns actionable recommendations.
 *
 * @module validation
 */

import pino from 'pino';

/**
 * Logger instance for validation operations
 * @type {pino.Logger}
 */
const logger = pino({
  name: 'metadata-agent:validation',
  level: process.env.LOG_LEVEL || 'info'
});

/**
 * Tier 1 Blockers: Validation rules that must pass for any release
 *
 * These are hard blockers that indicate serious metadata issues.
 * Releases cannot proceed without resolving all Tier 1 issues.
 *
 * @type {Object}
 */
const TIER_1_RULES = {
  'All issues have type label': (issues) => {
    const missing = issues.filter(issue =>
      !issue.labels.some(label => label.startsWith('type:'))
    );
    return {
      passed: missing.length === 0,
      failCount: missing.length,
      message: `${missing.length} issues missing type: label`
    };
  },

  'No conflicting labels': (issues) => {
    const conflicts = [];
    for (const issue of issues) {
      const families = {};
      for (const label of issue.labels) {
        const family = label.split(':')[0];
        if (families[family]) {
          conflicts.push({
            issue: issue.number,
            family,
            labels: issue.labels.filter(l => l.startsWith(family + ':'))
          });
        }
        families[family] = true;
      }
    }
    return {
      passed: conflicts.length === 0,
      failCount: conflicts.length,
      message: `${conflicts.length} issues have conflicting labels`,
      details: conflicts.slice(0, 5) // Show first 5 conflicts
    };
  },

  'All PRs have status label': (issues) => {
    const prs = issues.filter(i => i.isPR === true);
    const missing = prs.filter(pr =>
      !pr.labels.some(label => label.startsWith('status:'))
    );
    return {
      passed: missing.length === 0,
      failCount: missing.length,
      message: `${missing.length} PRs missing status: label`,
      prTotal: prs.length,
      prMissing: missing.length
    };
  },

  'Milestone is populated': (issues) => {
    const missing = issues.filter(i => !i.milestone);
    return {
      passed: missing.length === 0,
      failCount: missing.length,
      message: `${missing.length} issues not in a milestone`,
      total: issues.length,
      assigned: issues.length - missing.length
    };
  }
};

/**
 * Tier 2 Warnings: Validation rules that should pass for minor/major releases
 *
 * These indicate incomplete metadata that should be resolved before
 * significant releases, but don't block patch releases.
 *
 * @type {Object}
 */
const TIER_2_RULES = {
  'High label coverage (95%+)': (issues) => {
    const labeled = issues.filter(i => i.labels && i.labels.length > 0);
    const coverage = issues.length > 0
      ? Math.round((labeled.length / issues.length) * 100)
      : 100;
    return {
      passed: coverage >= 95,
      coverage,
      failCount: issues.length - labeled.length,
      message: `${coverage}% of issues are labeled (need 95%+)`,
      threshold: 95
    };
  },

  'All issues have priority label': (issues) => {
    const missing = issues.filter(issue =>
      !issue.labels.some(label => label.startsWith('priority:'))
    );
    const coverage = issues.length > 0
      ? Math.round(((issues.length - missing.length) / issues.length) * 100)
      : 100;
    return {
      passed: coverage >= 90,
      coverage,
      failCount: missing.length,
      message: `${coverage}% of issues have priority: label (need 90%+)`,
      threshold: 90
    };
  },

  'Consistent area labels': (issues) => {
    const withArea = issues.filter(i =>
      i.labels.some(l => l.startsWith('area:'))
    );
    const coverage = issues.length > 0
      ? Math.round((withArea.length / issues.length) * 100)
      : 100;
    return {
      passed: coverage >= 80,
      coverage,
      failCount: issues.length - withArea.length,
      message: `${coverage}% of issues have area: label (need 80%+)`,
      threshold: 80
    };
  },

  'Changelog tracking': (issues) => {
    const needsEntry = issues.filter(i =>
      i.labels.some(l => l === 'meta:needs-changelog')
    );
    const hasEntry = issues.filter(i =>
      i.labels.some(l => l === 'meta:has-changelog-entry')
    );
    const coverage = issues.length > 0 ? (hasEntry.length / issues.length) * 100 : 100;
    return {
      passed: coverage >= 80,
      coverage: Math.round(coverage),
      needsEntry: needsEntry.length,
      hasEntry: hasEntry.length,
      message: `${Math.round(coverage)}% have changelog entries (need 80%+)`
    };
  }
};

/**
 * Tier 3 Info: Non-blocking informational rules
 *
 * These are for awareness and tracking, but don't affect release decisions.
 *
 * @type {Object}
 */
const TIER_3_RULES = {
  'Average labels per issue': (issues) => {
    const total = issues.reduce((sum, i) => sum + (i.labels ? i.labels.length : 0), 0);
    const average = issues.length > 0 ? (total / issues.length).toFixed(2) : 0;
    return {
      passed: true, // Info only, never fails
      average,
      total,
      message: `Average ${average} labels per issue`
    };
  },

  'Label family distribution': (issues) => {
    const families = {};
    for (const issue of issues) {
      for (const label of issue.labels || []) {
        const family = label.split(':')[0];
        families[family] = (families[family] || 0) + 1;
      }
    }
    return {
      passed: true,
      families,
      message: `Label distribution: ${JSON.stringify(families)}`
    };
  }
};

/**
 * Validate issues against Tier 1 blockers
 *
 * Tier 1 checks are critical and must pass for any release to proceed.
 * Returns detailed failure information for each failed check.
 *
 * @param {Object[]} issues - Array of issue objects to validate
 * @returns {Object} Validation result { passed, blockers, count, details }
 *
 * @example
 * const result = validateTier1(issues);
 * if (!result.passed) {
 *   console.log('Blockers found:');
 *   result.blockers.forEach(b => console.log(`  - ${b.rule}: ${b.message}`));
 * }
 */
export function validateTier1(issues) {
  if (!Array.isArray(issues)) {
    return {
      passed: false,
      blockers: [],
      count: 0,
      details: { error: 'Issues must be an array' }
    };
  }

  const blockers = [];

  for (const [ruleName, ruleFunc] of Object.entries(TIER_1_RULES)) {
    try {
      const result = ruleFunc(issues);
      if (!result.passed) {
        blockers.push({
          rule: ruleName,
          message: result.message,
          ...result
        });
      }
    } catch (error) {
      logger.error({ rule: ruleName, error: error.message }, 'Tier 1 rule error');
      blockers.push({
        rule: ruleName,
        message: `Error evaluating rule: ${error.message}`,
        error: true
      });
    }
  }

  const passed = blockers.length === 0;

  logger.info(
    { passed, blockerCount: blockers.length, issueCount: issues.length },
    'Tier 1 validation complete'
  );

  return {
    passed,
    blockers,
    count: blockers.length,
    total: Object.keys(TIER_1_RULES).length,
    details: { issuesChecked: issues.length }
  };
}

/**
 * Validate issues against Tier 2 warnings
 *
 * Tier 2 checks should pass before minor/major releases but don't block
 * patch releases. Returns detailed information about each warning.
 *
 * @param {Object[]} issues - Array of issue objects to validate
 * @returns {Object} Validation result { passed, warnings, count, details }
 *
 * @example
 * const result = validateTier2(issues);
 * if (!result.passed) {
 *   console.log('Warnings:');
 *   result.warnings.forEach(w => console.log(`  - ${w.rule}: ${w.message}`));
 * }
 */
export function validateTier2(issues) {
  if (!Array.isArray(issues)) {
    return {
      passed: false,
      warnings: [],
      count: 0,
      details: { error: 'Issues must be an array' }
    };
  }

  const warnings = [];

  for (const [ruleName, ruleFunc] of Object.entries(TIER_2_RULES)) {
    try {
      const result = ruleFunc(issues);
      if (!result.passed) {
        warnings.push({
          rule: ruleName,
          message: result.message,
          ...result
        });
      }
    } catch (error) {
      logger.error({ rule: ruleName, error: error.message }, 'Tier 2 rule error');
      warnings.push({
        rule: ruleName,
        message: `Error evaluating rule: ${error.message}`,
        error: true
      });
    }
  }

  const passed = warnings.length === 0;

  logger.info(
    { passed, warningCount: warnings.length, issueCount: issues.length },
    'Tier 2 validation complete'
  );

  return {
    passed,
    warnings,
    count: warnings.length,
    total: Object.keys(TIER_2_RULES).length,
    details: { issuesChecked: issues.length }
  };
}

/**
 * Validate issues against Tier 3 info checks
 *
 * Tier 3 checks are informational only and never fail. They provide
 * insights into metadata health without blocking any actions.
 *
 * @param {Object[]} issues - Array of issue objects to validate
 * @returns {Object} Validation result { passed: true, info, count, details }
 *
 * @example
 * const result = validateTier3(issues);
 * console.log(result.info[0].message); // Shows label distribution
 */
export function validateTier3(issues) {
  if (!Array.isArray(issues)) {
    return {
      passed: true,
      info: [],
      count: 0,
      details: { error: 'Issues must be an array' }
    };
  }

  const info = [];

  for (const [ruleName, ruleFunc] of Object.entries(TIER_3_RULES)) {
    try {
      const result = ruleFunc(issues);
      info.push({
        rule: ruleName,
        message: result.message,
        ...result
      });
    } catch (error) {
      logger.error({ rule: ruleName, error: error.message }, 'Tier 3 rule error');
      info.push({
        rule: ruleName,
        message: `Error evaluating rule: ${error.message}`,
        error: true
      });
    }
  }

  logger.info(
    { infoCount: info.length, issueCount: issues.length },
    'Tier 3 validation complete'
  );

  return {
    passed: true, // Tier 3 never fails
    info,
    count: info.length,
    total: Object.keys(TIER_3_RULES).length,
    details: { issuesChecked: issues.length }
  };
}

/**
 * Get validation recommendation based on release type and validation results
 *
 * Analyzes Tier 1 and Tier 2 results to recommend whether to proceed,
 * check before proceeding, or block the release.
 *
 * @param {string} releaseType - Release type ('patch', 'minor', 'major')
 * @param {Object} tier1Result - Result from validateTier1()
 * @param {Object} tier2Result - Result from validateTier2()
 * @returns {Object} Recommendation { action, reason, details }
 *
 * @example
 * const tier1 = validateTier1(issues);
 * const tier2 = validateTier2(issues);
 * const rec = getRecommendation('minor', tier1, tier2);
 *
 * if (rec.action === 'block') {
 *   console.log(`Cannot proceed: ${rec.reason}`);
 * }
 */
export function getRecommendation(releaseType, tier1Result, tier2Result) {
  if (!tier1Result || !tier2Result) {
    return {
      action: 'check',
      reason: 'Validation results incomplete',
      details: { tier1: !!tier1Result, tier2: !!tier2Result }
    };
  }

  // Tier 1 failures always block
  if (!tier1Result.passed) {
    return {
      action: 'block',
      reason: `Tier 1 blockers found (${tier1Result.count} issues)`,
      details: {
        releaseType,
        blockerCount: tier1Result.count,
        blockers: tier1Result.blockers.map(b => b.rule)
      }
    };
  }

  // Tier 2 handling depends on release type
  if (!tier2Result.passed) {
    if (releaseType === 'patch') {
      return {
        action: 'proceed',
        reason: 'Tier 2 warnings OK for patch release',
        details: {
          releaseType,
          warningCount: tier2Result.count,
          warnings: tier2Result.warnings.map(w => w.rule),
          note: 'Consider addressing warnings before next release'
        }
      };
    }

    if (releaseType === 'minor' || releaseType === 'major') {
      return {
        action: 'check',
        reason: `${releaseType} release should address Tier 2 warnings`,
        details: {
          releaseType,
          warningCount: tier2Result.count,
          warnings: tier2Result.warnings.map(w => w.rule)
        }
      };
    }
  }

  // All checks passed
  return {
    action: 'proceed',
    reason: `All validations passed for ${releaseType} release`,
    details: {
      releaseType,
      tier1Passed: tier1Result.passed,
      tier2Passed: tier2Result.passed
    }
  };
}

/**
 * Validation export object
 * Provides all validation functions in a single namespace
 *
 * @type {Object}
 * @exports validation
 */
export const validation = {
  validateTier1,
  validateTier2,
  validateTier3,
  getRecommendation
};

export default validation;
