/**
 * Meta Agent Adapter - Transforms metrics into context for Meta Agent
 *
 * Converts raw metrics collection into a standardized JSON format that
 * the Meta Agent can consume as input context. This enables the Meta Agent
 * to make informed decisions about repository health, team capacity, and
 * priority actions.
 */

const fs = require('fs');
const path = require('path');

class MetricsContextProvider {
  constructor(options = {}) {
    this.metricsDir = options.metricsDir || '.github/reports/metrics';
    this.validateSchema = options.validateSchema !== false;
    this.cache = new Map();
    this.cacheExpiry = options.cacheExpiry || 3600000; // 1 hour
  }

  /**
   * Load the latest metrics from the metrics report directory
   * @param {string} context - Context type (control-plane, plugin, theme)
   * @returns {Promise<Object>} Parsed metrics JSON
   */
  async loadLatestMetrics(context = 'control-plane') {
    const cacheKey = `metrics-${context}`;

    // Check cache
    if (this.cache.has(cacheKey)) {
      const { data, timestamp } = this.cache.get(cacheKey);
      if (Date.now() - timestamp < this.cacheExpiry) {
        return data;
      }
    }

    // Load from file
    const metricsPath = path.join(this.metricsDir, 'latest-metrics.json');

    if (!fs.existsSync(metricsPath)) {
      throw new Error(`Metrics file not found: ${metricsPath}`);
    }

    const rawMetrics = JSON.parse(fs.readFileSync(metricsPath, 'utf8'));

    // Validate schema
    if (this.validateSchema) {
      this.validateMetricsSchema(rawMetrics);
    }

    // Cache result
    this.cache.set(cacheKey, { data: rawMetrics, timestamp: Date.now() });

    return rawMetrics;
  }

  /**
   * Validate metrics against expected schema
   * @param {Object} metrics - Metrics object to validate
   * @throws {Error} If schema validation fails
   */
  validateMetricsSchema(metrics) {
    const required = ['type', 'timestamp', 'context', 'repositories', 'healthScore', 'insights'];

    for (const field of required) {
      if (!metrics[field]) {
        throw new Error(`Missing required field in metrics: ${field}`);
      }
    }

    if (metrics.type !== 'metrics-collection') {
      throw new Error(`Invalid metrics type: ${metrics.type}`);
    }

    if (!Array.isArray(metrics.repositories)) {
      throw new Error('Repositories must be an array');
    }

    if (typeof metrics.healthScore !== 'object' || !metrics.healthScore.overall) {
      throw new Error('Invalid healthScore structure');
    }
  }

  /**
   * Extract top anomalies/issues from metrics
   * @param {Object} metrics - Raw metrics
   * @returns {Array} Array of top issues
   */
  extractTopIssues(metrics) {
    const issues = [];

    // Add anomalies as issues
    if (metrics.anomalies && Array.isArray(metrics.anomalies)) {
      metrics.anomalies.forEach((anomaly) => {
        if (anomaly.severity === 'high' || anomaly.severity === 'moderate') {
          issues.push({
            title: `${anomaly.metric} changed by ${anomaly.percentChange}%`,
            metric: anomaly.metric,
            current: anomaly.to,
            previous: anomaly.from,
            percentChange: anomaly.percentChange,
            severity: anomaly.severity,
            actionRequired: anomaly.severity === 'high'
          });
        }
      });
    }

    return issues;
  }

  /**
   * Extract trend summary from metrics
   * @param {Object} metrics - Raw metrics
   * @returns {Object} Trend summary object
   */
  getTrendSummary(metrics) {
    const summary = {
      issues: 'unknown',
      pullRequests: 'unknown',
      contributors: 'unknown'
    };

    if (metrics.repositories && metrics.repositories[0]) {
      const repo = metrics.repositories[0];
      if (repo.metrics && repo.metrics.activityTrend) {
        summary.issues = repo.metrics.activityTrend.issuesTrend || 'unknown';
        summary.pullRequests = repo.metrics.activityTrend.prsTrend || 'unknown';
        summary.contributors = repo.metrics.activityTrend.contributorsTrend || 'unknown';
      }
    }

    return summary;
  }

  /**
   * Format metrics as context for Meta Agent
   * @param {Object} rawMetrics - Raw metrics from collection
   * @returns {Object} Formatted context for Meta Agent
   */
  formatForMetaAgent(rawMetrics) {
    const healthScore = rawMetrics.healthScore || {};
    const topIssues = this.extractTopIssues(rawMetrics);
    const trends = this.getTrendSummary(rawMetrics);
    const recommendations = (rawMetrics.recommendations || []).slice(0, 3); // Top 3

    return {
      type: 'metrics-context',
      timestamp: rawMetrics.timestamp,
      context: rawMetrics.context,
      period: rawMetrics.period || 'weekly',
      healthScore: healthScore.overall || 0,
      healthComponents: healthScore.components || {},
      healthTrend: healthScore.trend || 'unknown',
      topIssues,
      trendSummary: trends,
      recommendations: recommendations.map((rec) => ({
        action: rec.action,
        priority: rec.priority,
        effort: rec.effort,
        owner: rec.owner,
        timeframe: rec.timeframe
      })),
      contextMetrics: this.extractContextMetrics(rawMetrics)
    };
  }

  /**
   * Extract key metrics from raw metrics
   * @param {Object} rawMetrics - Raw metrics
   * @returns {Object} Key context metrics
   */
  extractContextMetrics(rawMetrics) {
    const metrics = {
      issueMetrics: {
        total: 0,
        open: 0,
        closureRate: 0,
        averageClosureTime: 0
      },
      prMetrics: {
        total: 0,
        merged: 0,
        mergeRate: 0,
        averageReviewTime: 0
      },
      teamMetrics: {
        activeContributors: 0,
        capacity: 0
      },
      qualityMetrics: {
        lintPass: 0,
        testCoverage: 0,
        ciPassRate: 0
      }
    };

    if (rawMetrics.repositories && rawMetrics.repositories[0]) {
      const repo = rawMetrics.repositories[0];
      const repoMetrics = repo.metrics || {};

      metrics.issueMetrics = {
        total: repoMetrics.issues?.total || 0,
        open: repoMetrics.issues?.open || 0,
        closureRate: repoMetrics.issues?.closureRate || 0,
        averageClosureTime: repoMetrics.issues?.averageClosureTime || 0
      };

      metrics.prMetrics = {
        total: repoMetrics.pullRequests?.total || 0,
        merged: repoMetrics.pullRequests?.merged || 0,
        mergeRate: repoMetrics.pullRequests?.mergeRate || 0,
        averageReviewTime: repoMetrics.pullRequests?.averageReviewTime || 0
      };

      metrics.teamMetrics = {
        activeContributors: repoMetrics.contributors?.active || 0,
        capacity: repoMetrics.contributors?.active ? 0.7 : 0 // Simple capacity estimate
      };

      metrics.qualityMetrics = {
        lintPass: repoMetrics.codeQuality?.lintingPass || 0,
        testCoverage: repoMetrics.codeQuality?.testCoverage || 0,
        ciPassRate: repoMetrics.codeQuality?.ciPassRate || 0
      };
    }

    return metrics;
  }

  /**
   * Get full context object for Meta Agent
   * @param {string} context - Context type
   * @returns {Promise<Object>} Full Meta Agent context
   */
  async getMetricsContext(context = 'control-plane') {
    const rawMetrics = await this.loadLatestMetrics(context);
    return this.formatForMetaAgent(rawMetrics);
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
  }
}

module.exports = MetricsContextProvider;
