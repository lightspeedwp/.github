const logger = require('./logger.cjs');

class ValidationResultBuilder {
  /**
   * Build a ValidationResult object
   * @param {Object} options - Options for building result
   * @returns {Object} ValidationResult with rules, scores, summaries
   */
  buildResult(options = {}) {
    const {
      entryId = '',
      filename = '',
      ruleResults = [],
      complianceScore = 100,
      complianceStatus = 'passing',
      executedRules = []
    } = options;

    return {
      metadata: {
        entryId,
        filename,
        timestamp: new Date().toISOString(),
        version: '1.0'
      },
      validation: {
        ruleResults: this.normalizeRuleResults(ruleResults),
        summary: this.buildSummary(ruleResults),
        complianceScore,
        complianceStatus,
        executedRules: executedRules.length,
        totalRules: executedRules.length
      }
    };
  }

  /**
   * Normalize rule results to consistent format
   * @param {Array} ruleResults - Array of rule result objects
   * @returns {Array} Normalized rule results
   */
  normalizeRuleResults(ruleResults) {
    if (!Array.isArray(ruleResults)) {
      logger.warn('ruleResults is not an array, treating as empty');
      return [];
    }

    return ruleResults.map(result => {
      // Ensure required fields exist
      return {
        ruleId: result.ruleId || result.rule_id || 'UNKNOWN',
        ruleName: result.ruleName || result.rule_name || '',
        severity: result.severity || 'unknown',
        status: result.status || 'skipped', // passed, failed, skipped
        message: result.message || result.description || '',
        details: result.details || {},
        matches: Array.isArray(result.matches) ? result.matches : [],
        remediationGuidance: result.remediationGuidance || result.remediation_guidance || ''
      };
    });
  }

  /**
   * Build summary statistics from rule results
   * @param {Array} ruleResults - Array of rule result objects
   * @returns {Object} Summary with counts and categorization
   */
  buildSummary(ruleResults) {
    const normalized = this.normalizeRuleResults(ruleResults);

    // Count results by status
    const passed = normalized.filter(r => r.status === 'passed').length;
    const failed = normalized.filter(r => r.status === 'failed').length;
    const skipped = normalized.filter(r => r.status === 'skipped').length;

    // Count issues by severity
    const errors = normalized.filter(r => r.severity === 'error' && r.status === 'failed').length;
    const warnings = normalized.filter(r => r.severity === 'warning' && r.status === 'failed').length;

    // Build issue list
    const issues = normalized
      .filter(r => r.status === 'failed')
      .map(r => ({
        ruleId: r.ruleId,
        ruleName: r.ruleName,
        severity: r.severity,
        message: r.message,
        remediationGuidance: r.remediationGuidance
      }));

    return {
      totalRulesExecuted: normalized.length,
      passed,
      failed,
      skipped,
      errors,
      warnings,
      issues,
      hasErrors: errors > 0,
      hasWarnings: warnings > 0
    };
  }

  /**
   * Add a rule result to results array
   * @param {Array} ruleResults - Existing results array
   * @param {Object} ruleResult - New rule result to add
   * @returns {Array} Updated results array
   */
  addRuleResult(ruleResults, ruleResult) {
    if (!Array.isArray(ruleResults)) {
      logger.warn('ruleResults is not an array, initializing as empty');
      ruleResults = [];
    }

    if (!ruleResult || typeof ruleResult !== 'object') {
      logger.warn('Invalid ruleResult provided');
      return ruleResults;
    }

    ruleResults.push(this.normalizeRuleResults([ruleResult])[0]);
    return ruleResults;
  }

  /**
   * Create a failed rule result
   * @param {Object} options - Options for failed result
   * @returns {Object} Rule result object with status 'failed'
   */
  createFailedResult(options = {}) {
    const {
      ruleId = '',
      ruleName = '',
      severity = 'error',
      message = '',
      details = {},
      matches = [],
      remediationGuidance = ''
    } = options;

    return {
      ruleId,
      ruleName,
      severity,
      status: 'failed',
      message,
      details,
      matches,
      remediationGuidance
    };
  }

  /**
   * Create a passed rule result
   * @param {Object} options - Options for passed result
   * @returns {Object} Rule result object with status 'passed'
   */
  createPassedResult(options = {}) {
    const {
      ruleId = '',
      ruleName = '',
      severity = 'error',
      message = 'Rule passed',
      details = {}
    } = options;

    return {
      ruleId,
      ruleName,
      severity,
      status: 'passed',
      message,
      details,
      matches: [],
      remediationGuidance: ''
    };
  }

  /**
   * Create a skipped rule result
   * @param {Object} options - Options for skipped result
   * @returns {Object} Rule result object with status 'skipped'
   */
  createSkippedResult(options = {}) {
    const {
      ruleId = '',
      ruleName = '',
      severity = 'error',
      reason = 'Rule not applicable',
      details = {}
    } = options;

    return {
      ruleId,
      ruleName,
      severity,
      status: 'skipped',
      message: reason,
      details,
      matches: [],
      remediationGuidance: ''
    };
  }

  /**
   * Format result for JSON output
   * @param {Object} result - ValidationResult object
   * @returns {string} JSON string
   */
  toJSON(result) {
    return JSON.stringify(result, null, 2);
  }

  /**
   * Merge multiple validation results
   * @param {Array} results - Array of ValidationResult objects
   * @returns {Object} Merged result
   */
  mergeResults(results) {
    if (!Array.isArray(results) || results.length === 0) {
      return this.buildResult();
    }

    // Collect all rule results
    const allRuleResults = results.reduce((acc, result) => {
      if (result.validation && Array.isArray(result.validation.ruleResults)) {
        return acc.concat(result.validation.ruleResults);
      }
      return acc;
    }, []);

    // Build merged result
    return {
      metadata: {
        mergedAt: new Date().toISOString(),
        resultCount: results.length,
        version: '1.0'
      },
      validation: {
        ruleResults: allRuleResults,
        summary: this.buildSummary(allRuleResults),
        totalRules: allRuleResults.length
      }
    };
  }

  /**
   * Filter results by severity
   * @param {Object} result - ValidationResult object
   * @param {string} severity - Severity to filter by (error, warning)
   * @returns {Array} Filtered rule results
   */
  filterBySeverity(result, severity) {
    if (!result.validation || !Array.isArray(result.validation.ruleResults)) {
      return [];
    }

    return result.validation.ruleResults.filter(r => r.severity === severity);
  }

  /**
   * Check if result has blocking errors
   * @param {Object} result - ValidationResult object
   * @returns {boolean} True if there are errors with severity 'error'
   */
  hasBlockingErrors(result) {
    const errors = this.filterBySeverity(result, 'error');
    return errors.some(e => e.status === 'failed');
  }
}

module.exports = new ValidationResultBuilder();
