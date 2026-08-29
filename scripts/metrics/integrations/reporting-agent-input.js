/**
 * Reporting Agent Input Formatter - Formats metrics for Reporting Agent
 *
 * Transforms raw metrics into structured input that the Reporting Agent
 * can use to generate human-readable reports. Supports multiple report types
 * and formats metrics appropriately for each.
 */

class MetricsReportFormatter {
  constructor(options = {}) {
    this.metricsDir = options.metricsDir || ".github/reports/metrics";
    this.reportDir = options.reportDir || ".github/reports/metrics";
  }

  /**
   * Format metrics for Reporting Agent
   * @param {Object} rawMetrics - Raw metrics from collection
   * @param {string} reportType - Type of report (weekly, monthly, quarterly, context)
   * @returns {Object} Formatted report input
   */
  formatForReportingAgent(rawMetrics, reportType = "weekly") {
    const reportMethod = `generate${reportType.charAt(0).toUpperCase()}${reportType.slice(1)}Report`;

    if (typeof this[reportMethod] !== "function") {
      throw new Error(`Unsupported report type: ${reportType}`);
    }

    return this[reportMethod](rawMetrics);
  }

  /**
   * Generate weekly report format
   * @param {Object} rawMetrics - Raw metrics
   * @returns {Object} Weekly report object
   */
  generateWeeklyReport(rawMetrics) {
    const safeMetrics = this.normaliseRawMetrics(rawMetrics);
    const healthScore = safeMetrics.healthScore;
    const startDate = new Date(safeMetrics.timestamp);
    startDate.setDate(startDate.getDate() - 7);

    return {
      type: "metrics-report",
      reportType: "weekly",
      timestamp: safeMetrics.timestamp,
      period: {
        start: startDate.toISOString(),
        end: safeMetrics.timestamp,
        label: `Week of ${this.formatDate(startDate)} - ${this.formatDate(new Date(safeMetrics.timestamp))}`,
      },
      executive_summary: {
        healthScore: healthScore.overall || 0,
        trend: healthScore.trend || "unknown",
        status: this.getHealthStatus(healthScore.overall),
        topPriority: this.getTopPriority(safeMetrics),
      },
      repositorySummary: this.formatRepositorySummary(safeMetrics.repositories),
      failureSummary: this.formatFailureSummary(safeMetrics.errors),
      metrics: this.formatMetricsSection(safeMetrics),
      trends: this.formatTrendsSection(safeMetrics),
      anomalies: this.formatAnomaliesSection(safeMetrics),
      insights: this.formatInsightsSection(safeMetrics),
      recommendations: this.formatRecommendationsSection(safeMetrics),
      health_components: this.formatHealthComponentsSection(
        healthScore.components || {},
      ),
      nextSteps: this.generateNextSteps(safeMetrics),
      reportLinks: {
        fullReport: this.generateReportLink("weekly-summary-latest.md"),
        previousWeek: this.generateReportLink(
          "weekly/weekly-summary-2026-W33.md",
        ),
        metricsCollection: this.generateCollectionLink(),
      },
    };
  }

  /**
   * Generate monthly report format
   * @param {Object} rawMetrics - Raw metrics
   * @returns {Object} Monthly report object
   */
  generateMonthlyReport(rawMetrics) {
    const report = this.generateWeeklyReport(rawMetrics);
    report.reportType = "monthly";
    report.period.label = `Month of ${this.formatMonth(new Date(rawMetrics.timestamp))}`;
    return report;
  }

  /**
   * Generate quarterly report format
   * @param {Object} rawMetrics - Raw metrics
   * @returns {Object} Quarterly report object
   */
  generateQuarterlyReport(rawMetrics) {
    const report = this.generateWeeklyReport(rawMetrics);
    report.reportType = "quarterly";
    const date = new Date(rawMetrics.timestamp);
    const quarter = Math.ceil((date.getMonth() + 1) / 3);
    report.period.label = `Q${quarter} ${date.getFullYear()}`;
    return report;
  }

  /**
   * Generate context-specific report
   * @param {Object} rawMetrics - Raw metrics
   * @param {string} context - Context type (control-plane, plugin, theme)
   * @returns {Object} Context-specific report
   */
  generateContextReport(rawMetrics, context = "control-plane") {
    const report = this.generateWeeklyReport(rawMetrics);
    report.context = context;
    report.reportType = `context-${context}`;
    return report;
  }

  /**
   * Format metrics section
   * @param {Object} rawMetrics - Raw metrics
   * @returns {Object} Formatted metrics
   */
  formatMetricsSection(rawMetrics) {
    const repo = this.getPrimaryRepository(rawMetrics.repositories);

    if (!repo) {
      return {};
    }

    const metrics = repo.metrics || {};

    return {
      issues: {
        total: metrics.issues?.total || 0,
        open: metrics.issues?.open || 0,
        closed: metrics.issues?.closed || 0,
        closureRate: this.formatPercent(metrics.issues?.closureRate),
        averageClosureTime: metrics.issues?.averageClosureTime || 0,
        staleIssues: metrics.issues?.staleIssues || 0,
        stalePercentage: this.formatPercent(
          (metrics.issues?.staleIssues || 0) / (metrics.issues?.total || 1),
        ),
        reopenedRate: this.formatPercent(metrics.issues?.reopenedRate),
      },
      pullRequests: {
        total: metrics.pullRequests?.total || 0,
        merged: metrics.pullRequests?.merged || 0,
        closed: metrics.pullRequests?.closed || 0,
        draft: metrics.pullRequests?.draft || 0,
        mergeRate: this.formatPercent(metrics.pullRequests?.mergeRate),
        averageReviewTime: metrics.pullRequests?.averageReviewTime || 0,
        averageMergeTime: metrics.pullRequests?.averageMergeTime || 0,
        averageSize: metrics.pullRequests?.averageSize || 0,
        largeSize: metrics.pullRequests?.largeSize || 0,
        largePercentage: this.formatPercent(
          (metrics.pullRequests?.largeSize || 0) /
            (metrics.pullRequests?.total || 1),
        ),
      },
      contributors: {
        active: metrics.contributors?.active || 0,
        topContributors: (metrics.contributors?.topContributors || []).map(
          (c) => {
            const contributor = { name: c.name, commits: c.commits };
            if (
              metrics.contributors?.totalCommits &&
              metrics.contributors.totalCommits > 0
            ) {
              contributor.percentage = this.formatPercent(
                c.commits / metrics.contributors.totalCommits,
              );
            }
            return contributor;
          },
        ),
      },
      codeQuality: {
        lintingPass: this.formatPercent(metrics.codeQuality?.lintingPass),
        testCoverage: this.formatPercent(metrics.codeQuality?.testCoverage),
        ciPassRate: this.formatPercent(metrics.codeQuality?.ciPassRate),
      },
    };
  }

  /**
   * Format trends section
   * @param {Object} rawMetrics - Raw metrics
   * @returns {Object} Formatted trends
   */
  formatTrendsSection(rawMetrics) {
    const trends = {};

    if (rawMetrics.repositories && rawMetrics.repositories[0]) {
      const metrics = rawMetrics.repositories[0].metrics || {};
      const trend = metrics.activityTrend || {};

      trends.issues = {
        trend: trend.issuesTrend || "unknown",
        change:
          typeof metrics.issuesChange !== "undefined"
            ? metrics.issuesChange
            : "unavailable",
        detail: metrics.issuesDetail || "Data unavailable",
      };

      trends.pullRequests = {
        trend: trend.prsTrend || "unknown",
        change:
          typeof metrics.prsChange !== "undefined"
            ? metrics.prsChange
            : "unavailable",
        detail: metrics.prsDetail || "Data unavailable",
      };

      const reviewTimeAnomaly = rawMetrics.anomalies?.find(
        (a) => a.metric === "averageReviewTime",
      );

      trends.reviewTime = {
        trend: trend.reviewTimeTrend || "unknown",
        change:
          typeof metrics.reviewTimeChange !== "undefined"
            ? metrics.reviewTimeChange
            : (reviewTimeAnomaly?.percentChange ?? "unavailable"),
        detail: metrics.reviewTimeDetail || "Data unavailable",
      };

      trends.contributors = {
        trend: trend.contributorsTrend || "unknown",
        change:
          typeof metrics.contributorsChange !== "undefined"
            ? metrics.contributorsChange
            : "unavailable",
        detail: metrics.contributorsDetail || "Data unavailable",
      };
    }

    return trends;
  }

  /**
   * Format anomalies section
   * @param {Object} rawMetrics - Raw metrics
   * @returns {Array} Formatted anomalies
   */
  formatAnomaliesSection(rawMetrics) {
    return (rawMetrics.anomalies || []).map((anomaly) => ({
      severity: anomaly.severity,
      metric: anomaly.metric,
      finding: `${anomaly.metric} changed from ${anomaly.from} to ${anomaly.to}`,
      percentChange: anomaly.percentChange,
      recommendation: `Review ${anomaly.metric} trend`,
    }));
  }

  /**
   * Format insights section
   * @param {Object} rawMetrics - Raw metrics
   * @returns {Array} Formatted insights
   */
  formatInsightsSection(rawMetrics) {
    return (rawMetrics.insights || []).map((insight) => ({
      category: insight.category,
      title: insight.finding,
      finding: insight.finding,
      impact: insight.impact,
      action: insight.recommendation,
    }));
  }

  /**
   * Format recommendations section
   * @param {Object} rawMetrics - Raw metrics
   * @returns {Array} Formatted recommendations
   */
  formatRecommendationsSection(rawMetrics) {
    return (rawMetrics.recommendations || []).map((rec) => ({
      priority: rec.priority,
      action:
        typeof rec.action === "string" && rec.action.length > 0
          ? rec.action
          : "Improve metric hygiene",
      effort: rec.effort,
      owner: rec.owner,
      timeframe: rec.timeframe,
      expectedOutcome: `Improve ${(typeof rec.action === "string" &&
      rec.action.length > 0
        ? rec.action
        : "metric hygiene"
      ).toLowerCase()}`,
    }));
  }

  /**
   * Format health components section
   * @param {Object} components - Health score components
   * @returns {Object} Formatted components
   */
  formatHealthComponentsSection(components) {
    const formatted = {};

    Object.entries(components || {}).forEach(([key, score]) => {
      formatted[key] = {
        score,
        metric: `${key}Metric`,
        value: score,
        target: 80,
        status:
          score >= 80 ? "healthy" : score >= 70 ? "at-risk" : "below-target",
      };
    });

    return formatted;
  }

  /**
   * Generate next steps
   * @param {Object} rawMetrics - Raw metrics
   * @returns {Array} Next steps
   */
  generateNextSteps(rawMetrics) {
    const steps = [];
    const today = rawMetrics.timestamp
      ? new Date(rawMetrics.timestamp)
      : new Date();
    const daysUntilFriday = (5 - today.getDay() + 7) % 7;
    const friday = new Date(today);
    friday.setDate(friday.getDate() + daysUntilFriday);

    if (rawMetrics.recommendations) {
      rawMetrics.recommendations.slice(0, 3).forEach((rec, index) => {
        const action =
          typeof rec.action === "string" && rec.action.length > 0
            ? rec.action
            : "Improve metric hygiene";
        const dueDate = new Date(friday);
        dueDate.setDate(dueDate.getDate() + index);
        steps.push(`${action} (due: ${dueDate.toISOString().split("T")[0]})`);
      });
    }

    return steps;
  }

  /**
   * Normalize raw metrics input to avoid runtime failures
   * @param {Object|null|undefined} rawMetrics - Raw metrics
   * @returns {Object} Safe metrics object
   */
  normaliseRawMetrics(rawMetrics) {
    const safeMetrics =
      rawMetrics && typeof rawMetrics === "object" ? rawMetrics : {};

    const timestamp =
      typeof safeMetrics.timestamp === "string" &&
      !Number.isNaN(Date.parse(safeMetrics.timestamp))
        ? safeMetrics.timestamp
        : new Date().toISOString();

    return {
      ...safeMetrics,
      timestamp,
      repositories: Array.isArray(safeMetrics.repositories)
        ? safeMetrics.repositories
        : [],
      anomalies: Array.isArray(safeMetrics.anomalies)
        ? safeMetrics.anomalies
        : [],
      insights: Array.isArray(safeMetrics.insights) ? safeMetrics.insights : [],
      recommendations: Array.isArray(safeMetrics.recommendations)
        ? safeMetrics.recommendations
        : [],
      errors: Array.isArray(safeMetrics.errors) ? safeMetrics.errors : [],
      healthScore:
        safeMetrics.healthScore && typeof safeMetrics.healthScore === "object"
          ? safeMetrics.healthScore
          : {},
    };
  }

  /**
   * Pick the best repository candidate for detailed metrics output
   * @param {Array<Object>} repositories - Repository list
   * @returns {Object|null} Primary repository or null
   */
  getPrimaryRepository(repositories) {
    if (!Array.isArray(repositories) || repositories.length === 0) {
      return null;
    }

    return (
      repositories.find(
        (repo) => repo.metrics && !repo.archived && !repo.permissionDenied,
      ) ||
      repositories.find((repo) => repo.metrics) ||
      null
    );
  }

  /**
   * Generate repository-level processing summary
   * @param {Array<Object>} repositories - Repository list
   * @returns {Object} Summary counts
   */
  formatRepositorySummary(repositories) {
    const repoList = Array.isArray(repositories) ? repositories : [];

    const archivedRepositories = repoList.filter(
      (repo) => repo.archived,
    ).length;
    const inaccessibleRepositories = repoList.filter(
      (repo) => repo.permissionDenied || repo.access === "denied",
    ).length;
    const processedRepositories = repoList.filter(
      (repo) => repo.metrics && !repo.permissionDenied && !repo.archived,
    ).length;

    const totalCommits = repoList.reduce((total, repo) => {
      const explicitTotal = repo.metrics?.contributors?.totalCommits;
      if (typeof explicitTotal === "number") {
        return total + explicitTotal;
      }

      const topContributors = repo.metrics?.contributors?.topContributors;
      if (Array.isArray(topContributors)) {
        return (
          total +
          topContributors.reduce(
            (sum, contributor) => sum + (contributor.commits || 0),
            0,
          )
        );
      }

      return total;
    }, 0);

    return {
      totalRepositories: repoList.length,
      processedRepositories,
      archivedRepositories,
      inaccessibleRepositories,
      totalCommits,
    };
  }

  /**
   * Summarize known API failures captured upstream
   * @param {Array<Object>} errors - Error events
   * @returns {Object} Failure summary
   */
  formatFailureSummary(errors) {
    const byType = {
      network: 0,
      rate_limit: 0,
      permissions: 0,
      not_found: 0,
      unknown: 0,
    };

    (Array.isArray(errors) ? errors : []).forEach((error) => {
      if (error.status === 429) {
        byType.rate_limit += 1;
        return;
      }

      if (error.status === 401 || error.status === 403) {
        byType.permissions += 1;
        return;
      }

      if (error.status === 404) {
        byType.not_found += 1;
        return;
      }

      if (["ENOTFOUND", "ETIMEDOUT", "ECONNRESET"].includes(error.code)) {
        byType.network += 1;
        return;
      }

      byType.unknown += 1;
    });

    return {
      total: (Array.isArray(errors) ? errors : []).length,
      byType,
      retryable: byType.network + byType.rate_limit,
    };
  }

  /**
   * Helper: Format date
   */
  formatDate(date) {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  /**
   * Helper: Format month
   */
  formatMonth(date) {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  }

  /**
   * Helper: Format percentage
   */
  formatPercent(value) {
    if (typeof value !== "number") return "0%";
    return `${Math.round(value * 100)}%`;
  }

  /**
   * Helper: Get health status
   */
  getHealthStatus(score) {
    if (score >= 80) return "healthy";
    if (score >= 70) return "at-risk";
    if (score >= 60) return "critical";
    return "failing";
  }

  /**
   * Helper: Get top priority from metrics
   */
  getTopPriority(rawMetrics) {
    if (rawMetrics.recommendations && rawMetrics.recommendations[0]) {
      return rawMetrics.recommendations[0].action;
    }
    return "Review metrics";
  }

  /**
   * Helper: Generate report link
   */
  generateReportLink(filename) {
    return `https://github.com/lightspeedwp/.github/tree/develop/.github/reports/metrics/${filename}`;
  }

  /**
   * Helper: Generate collection link
   */
  generateCollectionLink() {
    return "https://github.com/lightspeedwp/.github/blob/develop/scripts/metrics/metrics-agent.js";
  }
}

module.exports = MetricsReportFormatter;
