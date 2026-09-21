const logger = require('./logger.cjs');
const config = require('./config.cjs');

class ScoreCalculator {
  /**
   * Calculate compliance score from validation results
   * @param {Array} ruleResults - Array of rule result objects
   * @returns {Object} Score calculation with breakdown
   */
  calculateScore(ruleResults) {
    if (!Array.isArray(ruleResults)) {
      logger.warn('ruleResults is not an array, treating as zero score');
      return this.buildScoreResult(100, [], []);
    }

    const failedRules = ruleResults.filter(r => r.status === 'failed');
    const errorRules = failedRules.filter(r => r.severity === 'error');
    const warningRules = failedRules.filter(r => r.severity === 'warning');

    // Calculate score: baseline 100, -25 per error, -5 per warning
    // Keys live in the canonical changelog-agent config (config.cjs).
    let score = config.scoring.baseScore;
    score -= errorRules.length * config.scoring.errorPenalty;
    score -= warningRules.length * config.scoring.warningPenalty;

    // Ensure score doesn't go below 0
    score = Math.max(0, score);

    return this.buildScoreResult(score, errorRules, warningRules);
  }

  /**
   * Build score result object with breakdown
   * @param {number} score - Calculated compliance score
   * @param {Array} errorRules - Failed rules with severity 'error'
   * @param {Array} warningRules - Failed rules with severity 'warning'
   * @returns {Object} Score result with status and breakdown
   */
  buildScoreResult(score, errorRules, warningRules) {
    const status = this.determineStatus(score);

    return {
      score,
      status,
      breakdown: {
        baseline: config.scoring.baseScore,
        errorPenalty: -errorRules.length * config.scoring.errorPenalty,
        warningPenalty: -warningRules.length * config.scoring.warningPenalty,
        total: score
      },
      failures: {
        errors: errorRules.length,
        warnings: warningRules.length,
        details: {
          errors: errorRules.map(r => ({
            ruleId: r.ruleId,
            ruleName: r.ruleName,
            message: r.message
          })),
          warnings: warningRules.map(r => ({
            ruleId: r.ruleId,
            ruleName: r.ruleName,
            message: r.message
          }))
        }
      }
    };
  }

  /**
   * Determine compliance status from score
   * @param {number} score - Compliance score (0-100)
   * @returns {string} Status: 'passing', 'warning', or 'failing'
   */
  determineStatus(score) {
    if (score >= config.compliance.passingThreshold) {
      return 'passing';
    }
    if (score >= config.compliance.conditionalPassThreshold) {
      return 'warning';
    }
    return 'failing';
  }

  /**
   * Get status label with color/icon for display
   * @param {string} status - Status from determineStatus
   * @returns {Object} Status with label and emoji/color
   */
  getStatusLabel(status) {
    const labels = {
      passing: { label: 'PASS', emoji: '✓', color: 'green' },
      warning: { label: 'WARN', emoji: '⚠', color: 'yellow' },
      failing: { label: 'FAIL', emoji: '✗', color: 'red' }
    };

    return labels[status] || labels.failing;
  }

  /**
   * Calculate compliance percentage
   * @param {number} score - Compliance score (0-100)
   * @returns {number} Percentage (0-100)
   */
  scoreToPercentage(score) {
    return Math.min(100, Math.max(0, score));
  }

  /**
   * Batch calculate scores for multiple result sets
   * @param {Array} resultSets - Array of rule result arrays
   * @returns {Array} Array of score results
   */
  batchCalculateScores(resultSets) {
    if (!Array.isArray(resultSets)) {
      logger.warn('resultSets is not an array');
      return [];
    }

    return resultSets.map((results, index) => {
      try {
        return this.calculateScore(results);
      } catch (error) {
        logger.error(`Error calculating score for result set ${index}: ${error.message}`);
        return this.buildScoreResult(0, [], []);
      }
    });
  }

  /**
   * Calculate average score across multiple score results
   * @param {Array} scores - Array of score results from calculateScore
   * @returns {Object} Average score with breakdown
   */
  calculateAverageScore(scores) {
    if (!Array.isArray(scores) || scores.length === 0) {
      return this.buildScoreResult(100, [], []);
    }

    const totalScore = scores.reduce((sum, s) => sum + (s.score || 0), 0);
    const avgScore = totalScore / scores.length;

    const totalErrors = scores.reduce((sum, s) => sum + (s.failures?.errors || 0), 0);
    const totalWarnings = scores.reduce((sum, s) => sum + (s.failures?.warnings || 0), 0);

    // Create dummy error/warning arrays for buildScoreResult
    const errorArray = Array(Math.ceil(totalErrors / scores.length)).fill({
      severity: 'error'
    });
    const warningArray = Array(Math.ceil(totalWarnings / scores.length)).fill({
      severity: 'warning'
    });

    return this.buildScoreResult(avgScore, errorArray, warningArray);
  }

  /**
   * Check if score meets minimum threshold for release
   * @param {number} score - Compliance score
   * @param {string} releaseType - Type of release (e.g., 'minor', 'major', 'patch')
   * @returns {Object} Meeting result with explanation
   */
  meetsReleaseRequirement(score, releaseType = 'minor') {
    // Different thresholds for different release types
    const releaseThresholds = {
      patch: 85,
      minor: 90,
      major: 95
    };

    const threshold = releaseThresholds[releaseType] || releaseThresholds.minor;
    const meets = score >= threshold;

    return {
      meets,
      score,
      threshold,
      releaseType,
      explanation: meets
        ? `Score ${score} meets ${releaseType} release requirement (${threshold})`
        : `Score ${score} does not meet ${releaseType} release requirement (needs ${threshold})`
    };
  }

  /**
   * Format score for human-readable display
   * @param {Object} scoreResult - Score result object from calculateScore
   * @returns {string} Formatted score display
   */
  formatScore(scoreResult) {
    if (!scoreResult || typeof scoreResult !== 'object') {
      return 'N/A';
    }

    const label = this.getStatusLabel(scoreResult.status);
    return `${scoreResult.score}/100 [${label.label}]`;
  }

  /**
   * Export score for metrics/analytics
   * @param {Object} scoreResult - Score result object
   * @param {Object} metadata - Optional metadata (entryId, timestamp, etc.)
   * @returns {Object} Score data for persistence/export
   */
  exportScore(scoreResult, metadata = {}) {
    return {
      timestamp: new Date().toISOString(),
      score: scoreResult.score,
      status: scoreResult.status,
      percentage: this.scoreToPercentage(scoreResult.score),
      errors: scoreResult.failures?.errors || 0,
      warnings: scoreResult.failures?.warnings || 0,
      metadata
    };
  }
}

module.exports = new ScoreCalculator();
