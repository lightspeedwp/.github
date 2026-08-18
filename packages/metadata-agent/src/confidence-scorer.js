/**
 * Confidence Scorer Module
 *
 * Calculates confidence scores (0-100) for label applications and automated
 * metadata changes. Provides threshold management and confidence assessment.
 *
 * Confidence scores help determine when automated actions are safe vs.
 * when human review is needed.
 *
 * @module confidence-scorer
 */

import pino from 'pino';

/**
 * Logger instance for confidence scoring operations
 * @type {pino.Logger}
 */
const logger = pino({
  name: 'metadata-agent:confidence-scorer',
  level: process.env.LOG_LEVEL || 'info'
});

/**
 * Default confidence threshold (0-100)
 *
 * Actions with scores >= this threshold are considered safe for automation.
 * Actions below are flagged for review.
 *
 * @type {number}
 */
const DEFAULT_THRESHOLD = 70;

/**
 * Confidence Scorer Class
 *
 * Provides methods for calculating confidence scores based on:
 * - Label canonicality (is it in the approved set?)
 * - Issue context match (does the label fit the issue?)
 * - Conflict detection (would it conflict with existing labels?)
 * - Historical accuracy (has this labeling been correct before?)
 */
class ConfidenceScorer {
  /**
   * Initialize the confidence scorer
   *
   * @param {Object} options - Configuration options
   * @param {number} [options.threshold] - Confidence threshold for safe automation (0-100, default: 70)
   * @param {Object} [options.weights] - Weighting for different factors
   */
  constructor(options = {}) {
    const {
      threshold = DEFAULT_THRESHOLD,
      weights = {}
    } = options;

    this.threshold = Math.max(0, Math.min(100, threshold));
    this.weights = {
      canonicality: weights.canonicality ?? 0.30,
      contextMatch: weights.contextMatch ?? 0.25,
      noConflict: weights.noConflict ?? 0.25,
      frequency: weights.frequency ?? 0.20
    };

    // Verify weights sum to approximately 1.0
    const weightSum = Object.values(this.weights).reduce((a, b) => a + b, 0);
    if (Math.abs(weightSum - 1.0) > 0.01) {
      logger.warn(
        { weights: this.weights, sum: weightSum },
        'Weights do not sum to 1.0, results may be skewed'
      );
    }

    logger.info(
      { threshold: this.threshold, weights: this.weights },
      'Confidence scorer initialized'
    );
  }

  /**
   * Calculate confidence score for a label applied to an issue
   *
   * Score considers:
   * - Whether the label is in the canonical set (30% weight)
   * - How well the label matches the issue type/content (25% weight)
   * - Whether it conflicts with existing labels (25% weight)
   * - How frequently this label is used correctly (20% weight)
   *
   * @param {string} label - The label to score
   * @param {Object} context - Context information for scoring
   * @param {string} [context.issueNumber] - GitHub issue number
   * @param {string} [context.issueTitle] - Issue title text
   * @param {string} [context.issueBody] - Issue description
   * @param {string[]} [context.existingLabels] - Labels already on the issue
   * @param {string} [context.issueType] - Classified issue type (bug, feature, etc.)
   * @param {Object} [context.stats] - Historical stats { appliedCount, correctCount }
   * @returns {number} Confidence score from 0 to 100
   *
   * @example
   * const score = scorer.calculate('type:bug', {
   *   issueNumber: 123,
   *   issueTitle: 'Button not working on mobile',
   *   existingLabels: [],
   *   issueType: 'bug'
   * });
   * // → 92
   */
  calculate(label, context = {}) {
    if (!label || typeof label !== 'string') {
      logger.warn({ label }, 'Invalid label for scoring');
      return 0;
    }

    const {
      issueNumber = null,
      issueTitle = '',
      issueBody = '',
      existingLabels = [],
      issueType = null,
      stats = {}
    } = context;

    // Calculate component scores (0-100 each)
    const canonicalityScore = this._scoreCanonical(label);
    const contextScore = this._scoreContext(label, {
      issueTitle,
      issueBody,
      issueType
    });
    const conflictScore = this._scoreNoConflict(label, existingLabels);
    const frequencyScore = this._scoreFrequency(stats);

    // Weighted combination
    const totalScore =
      canonicalityScore * this.weights.canonicality +
      contextScore * this.weights.contextMatch +
      conflictScore * this.weights.noConflict +
      frequencyScore * this.weights.frequency;

    logger.debug(
      {
        label,
        issueNumber,
        scores: {
          canonical: canonicalityScore,
          context: contextScore,
          conflict: conflictScore,
          frequency: frequencyScore
        },
        total: Math.round(totalScore)
      },
      'Confidence score calculated'
    );

    return Math.round(totalScore);
  }

  /**
   * Get the current confidence threshold
   *
   * Actions with scores >= threshold are considered safe for automation.
   *
   * @returns {number} Confidence threshold (0-100)
   *
   * @example
   * const threshold = scorer.getThreshold();
   * console.log(`Need score >= ${threshold} to auto-apply`);
   */
  getThreshold() {
    return this.threshold;
  }

  /**
   * Set a new confidence threshold
   *
   * @param {number} threshold - New threshold (0-100)
   * @throws {Error} If threshold is invalid
   *
   * @example
   * scorer.setThreshold(80); // Stricter threshold
   */
  setThreshold(threshold) {
    if (typeof threshold !== 'number' || threshold < 0 || threshold > 100) {
      throw new Error('Threshold must be a number between 0 and 100');
    }
    this.threshold = threshold;
    logger.info({ threshold }, 'Confidence threshold updated');
  }

  /**
   * Check if a score meets the confidence threshold
   *
   * Determines whether an action with this score is safe to automate.
   *
   * @param {number} score - The confidence score to check
   * @returns {boolean} True if score >= threshold
   *
   * @example
   * if (scorer.isConfident(score)) {
   *   // Auto-apply the label
   * } else {
   *   // Request human review
   * }
   */
  isConfident(score) {
    if (typeof score !== 'number') {
      return false;
    }
    return score >= this.threshold;
  }

  /**
   * Get a confidence assessment with reasoning
   *
   * Returns a structured assessment including the score, threshold,
   * pass/fail status, and human-readable explanation.
   *
   * @param {number} score - The confidence score
   * @param {string} [reason] - Optional additional context
   * @returns {Object} Assessment { score, threshold, confident, action, reason }
   *
   * @example
   * const assessment = scorer.assess(65);
   * // → {
   * //   score: 65,
   * //   threshold: 70,
   * //   confident: false,
   * //   action: 'review',
   * //   reason: 'Below threshold, manual review recommended'
   * // }
   */
  assess(score, reason = '') {
    const confident = this.isConfident(score);
    const gap = this.threshold - score;

    return {
      score: Math.round(score),
      threshold: this.threshold,
      confident,
      action: confident ? 'auto-apply' : 'review',
      gap: confident ? 0 : Math.round(gap),
      reason: reason || (confident
        ? `Score ${Math.round(score)} meets threshold of ${this.threshold}`
        : `Score ${Math.round(score)} below threshold of ${this.threshold} by ${Math.round(gap)} points`
      )
    };
  }

  /**
   * Score canonicality (is the label in the approved set?)
   *
   * @private
   * @param {string} label - Label to score
   * @returns {number} Score 0-100
   */
  _scoreCanonical(label) {
    // In real implementation, check against canonical label set
    // For now, return high score if label contains a colon (has family)
    if (label.includes(':')) {
      return 85; // Prefixed labels are more likely to be canonical
    }
    return 45; // Unprefixed labels are less likely to be canonical
  }

  /**
   * Score context match (does the label fit the issue?)
   *
   * @private
   * @param {string} label - Label to score
   * @param {Object} context - Issue context
   * @returns {number} Score 0-100
   */
  _scoreContext(label, context) {
    const { issueTitle = '', issueBody = '', issueType = null } = context;
    const text = (issueTitle + ' ' + issueBody).toLowerCase();
    let score = 50; // Neutral base

    // Check if label family matches issue type
    if (issueType && label.includes(issueType)) {
      score += 30;
    }

    // Check for keywords in issue text that suggest the label
    const keywords = this._getKeywordsForLabel(label);
    const keywordMatches = keywords.filter(kw => text.includes(kw)).length;
    if (keywords.length > 0) {
      score += (keywordMatches / keywords.length) * 20;
    }

    return Math.min(100, score);
  }

  /**
   * Score conflict (would this label conflict with existing labels?)
   *
   * @private
   * @param {string} label - Label to score
   * @param {string[]} existingLabels - Labels already on the issue
   * @returns {number} Score 0-100
   */
  _scoreNoConflict(label, existingLabels = []) {
    const labelFamily = label.split(':')[0];

    // Check for same-family conflicts
    const hasConflict = existingLabels.some(existing => {
      const existingFamily = existing.split(':')[0];
      return existingFamily === labelFamily && existing !== label;
    });

    return hasConflict ? 20 : 85;
  }

  /**
   * Score frequency (has this been applied correctly historically?)
   *
   * @private
   * @param {Object} stats - Historical stats
   * @returns {number} Score 0-100
   */
  _scoreFrequency(stats = {}) {
    const { appliedCount = 0, correctCount = 0 } = stats;

    if (appliedCount === 0) {
      return 50; // No history, neutral score
    }

    const accuracy = correctCount / appliedCount;
    return Math.round(accuracy * 100);
  }

  /**
   * Get keywords that suggest a label should be applied
   *
   * @private
   * @param {string} label - The label to get keywords for
   * @returns {string[]} Array of relevant keywords
   */
  _getKeywordsForLabel(label) {
    const keywordMap = {
      'type:bug': ['bug', 'broken', 'error', 'issue', 'crash', 'failed'],
      'type:feature': ['feature', 'request', 'new', 'add', 'implement'],
      'type:documentation': ['docs', 'documentation', 'readme', 'guide'],
      'priority:critical': ['critical', 'urgent', 'blocking', 'severe'],
      'area:security': ['security', 'vulnerability', 'exploit', 'vulnerable'],
      'area:performance': ['slow', 'performance', 'speed', 'optimize'],
      'status:blocked': ['blocked', 'waiting', 'dependency', 'stuck']
    };

    return keywordMap[label] || [];
  }
}

/**
 * Create a confidence scorer instance
 *
 * @param {Object} options - Scorer options
 * @returns {ConfidenceScorer} Configured scorer instance
 *
 * @example
 * const scorer = createScorer({ threshold: 75 });
 * const score = scorer.calculate('type:bug', { issueType: 'bug' });
 */
export function createScorer(options = {}) {
  return new ConfidenceScorer(options);
}

/**
 * Confidence Scorer export object
 * Provides factory function and the scorer class
 *
 * @type {Object}
 * @exports confidence-scorer
 */
export const confidenceScorer = {
  createScorer,
  ConfidenceScorer,
  DEFAULT_THRESHOLD
};

export default confidenceScorer;
