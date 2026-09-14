/**
 * Output Formatter
 * Formats validation results for human-readable and machine-readable output
 */

class Formatter {
  /**
   * Format validation result for human-readable output
   * @param {Object} result - Validation result from validator
   * @returns {string} Formatted output
   */
  formatValidationResult(result) {
    if (!result) return 'No result to format';

    const lines = [];
    const status = result.summary?.status || 'unknown';
    const score = result.complianceScore || 0;

    // Header with status badge
    const statusBadge = this.getStatusBadge(status);
    lines.push(`${statusBadge} Validation Result`);
    lines.push(`Score: ${score}/100 | Status: ${status.toUpperCase()}`);
    lines.push('');

    // Summary section
    if (result.summary) {
      lines.push('📊 Summary:');
      lines.push(`  Passed: ${result.summary.passed || 0} rules`);
      lines.push(`  Failed: ${result.summary.failed || 0} rules`);
      lines.push(`  Warnings: ${result.summary.warnings || 0} issues`);
      lines.push(`  Errors: ${result.summary.errors || 0} issues`);
      lines.push('');
    }

    // Issues section
    if (result.summary?.issues && result.summary.issues.length > 0) {
      lines.push('⚠️  Issues Found:');
      lines.push('');

      result.summary.issues.forEach((issue, idx) => {
        lines.push(`${idx + 1}. [${issue.severity.toUpperCase()}] ${issue.ruleName}`);
        lines.push(`   Rule: ${issue.ruleId}`);
        lines.push(`   Issue: ${issue.message}`);

        if (issue.matches && issue.matches.length > 0) {
          lines.push(`   Matches:`);
          issue.matches.forEach(match => {
            lines.push(`     - "${match.matched}" (line ${match.line})`);
          });
        }

        if (issue.remediationGuidance) {
          lines.push(`   Fix: ${issue.remediationGuidance}`);
        }
        lines.push('');
      });
    }

    // Passing rules (summary only)
    if (result.summary?.passed && result.summary.passed > 0) {
      lines.push(`✓ ${result.summary.passed} rule(s) passed validation`);
      lines.push('');
    }

    // Compliance status
    if (status === 'passing') {
      lines.push('✓ Entry meets all quality requirements');
    } else if (status === 'warning') {
      lines.push('⚠ Entry has warnings that should be reviewed');
    } else if (status === 'failing') {
      lines.push('✗ Entry has blocking errors that must be fixed');
    }

    return lines.join('\n');
  }

  /**
   * Get status badge for output
   * @param {string} status - Status string
   * @returns {string} Badge emoji and text
   */
  getStatusBadge(status) {
    const badges = {
      passing: '✓ [PASS]',
      warning: '⚠ [WARN]',
      failing: '✗ [FAIL]'
    };
    return badges[status] || '? [UNKNOWN]';
  }

  /**
   * Format score display
   * @param {number} score - Score 0-100
   * @returns {string} Formatted score string
   */
  formatScore(score) {
    const rounded = Math.round(score);
    if (rounded >= 90) return `${rounded}/100 (Excellent)`;
    if (rounded >= 75) return `${rounded}/100 (Good)`;
    if (rounded >= 60) return `${rounded}/100 (Fair)`;
    return `${rounded}/100 (Poor)`;
  }

  /**
   * Format compliance status with details
   * @param {Object} result - Validation result
   * @returns {string} Status explanation
   */
  formatComplianceStatus(result) {
    const status = result.summary?.status || 'unknown';
    const breakdown = result.summary || {};

    const lines = [];
    lines.push(`Compliance: ${status.toUpperCase()}`);
    lines.push(`Score: ${result.complianceScore || 0}/100`);

    if (breakdown.errors > 0) {
      lines.push(`⚠ ${breakdown.errors} blocking error(s)`);
    }
    if (breakdown.warnings > 0) {
      lines.push(`ℹ ${breakdown.warnings} warning(s)`);
    }

    return lines.join(' | ');
  }

  /**
   * Format a single rule result
   * @param {Object} ruleResult - Single rule result
   * @returns {string} Formatted rule line
   */
  formatRuleResult(ruleResult) {
    const status = ruleResult.status === 'passed' ? '✓' : '✗';
    const severity = ruleResult.severity === 'error' ? '[ERROR]' : '[WARN]';

    return `${status} ${ruleResult.ruleId}: ${ruleResult.ruleName} ${severity}`;
  }

  /**
   * Format validation details for compact display
   * @param {Object} result - Full validation result
   * @returns {string} Compact formatted output
   */
  formatCompact(result) {
    const lines = [];
    const statusBadge = this.getStatusBadge(result.summary?.status || 'unknown');
    const score = this.formatScore(result.complianceScore || 0);

    lines.push(`${statusBadge} Score: ${score}`);

    if (result.summary?.issues && result.summary.issues.length > 0) {
      lines.push(`Issues: ${result.summary.failed || result.summary.issues.length}`);
    }

    return lines.join(' | ');
  }

  /**
   * Format result for GitHub PR comment
   * @param {Object} result - Validation result
   * @param {Object} context - Context info (filename, entryId)
   * @returns {string} Markdown formatted for GitHub
   */
  formatForGitHub(result, context = {}) {
    const lines = [];
    const statusBadge = this.getStatusBadge(result.summary?.status || 'unknown');

    lines.push(`## ${statusBadge} Entry Validation Result`);
    lines.push('');

    // Entry context
    if (context.entryId || context.filename) {
      lines.push('**Entry:**');
      if (context.entryId) lines.push(`- ID: ${context.entryId}`);
      if (context.filename) lines.push(`- File: ${context.filename}`);
      lines.push('');
    }

    // Score
    lines.push(`**Compliance Score:** ${result.complianceScore || 0}/100`);
    lines.push('');

    // Issues
    if (result.summary?.issues && result.summary.issues.length > 0) {
      lines.push('### Issues Found');
      lines.push('');

      result.summary.issues.forEach(issue => {
        const icon = issue.severity === 'error' ? '❌' : '⚠️';
        lines.push(`${icon} **${issue.ruleName}** (\`${issue.ruleId}\`)`);
        lines.push(`${issue.message}`);

        if (issue.remediationGuidance) {
          lines.push('');
          lines.push(`**How to fix:** ${issue.remediationGuidance}`);
        }
        lines.push('');
      });
    }

    // Success message
    if (result.summary?.status === 'passing') {
      lines.push('✓ All quality checks passed!');
    }

    return lines.join('\n');
  }
}

module.exports = new Formatter();
