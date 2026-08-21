/**
 * Metrics Reporter
 * Generates markdown reports from collected metrics data
 */

const fs = require('fs');
const path = require('path');

class MetricsReporter {
  constructor(storage, trendAnalyzer, anomalyDetector) {
    this.storage = storage;
    this.trendAnalyzer = trendAnalyzer;
    this.anomalyDetector = anomalyDetector;
  }

  /**
   * Generate comprehensive markdown report
   */
  async generateReport(repository, options = {}) {
    const { period = 'weekly', includeTrends = true, includeAnomalies = true } = options;

    try {
      const metrics = await this.storage.getLatestMetrics(repository);
      if (!metrics) {
        return this.generateEmptyReport(repository);
      }

      const history = await this.storage.getMetricsHistory(repository);
      const trends = includeTrends ? await this.trendAnalyzer.analyzeTrends(repository, this.storage) : {};
      const anomalies = includeAnomalies ? await this.anomalyDetector.detectAnomalies(repository, metrics, trends) : [];

      const reportDate = new Date(metrics.timestamp);
      const weekAgo = new Date(reportDate.getTime() - 7 * 24 * 60 * 60 * 1000);

      const report = [
        this.generateHeader(repository, reportDate, period),
        '',
        this.generateSummarySection(metrics, trends),
        '',
        this.generateIssuesSection(metrics, trends),
        '',
        this.generatePullRequestsSection(metrics, trends),
        '',
        this.generateContributorsSection(metrics),
        '',
        this.generateHealthScoreSection(metrics, trends, anomalies),
        '',
        this.generateAnomaliesSection(anomalies),
        '',
        this.generateTrendAnalysisSection(trends, period),
        '',
        this.generateFooter(),
      ];

      return report.filter((line) => line !== undefined).join('\n');
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  }

  generateHeader(repository, reportDate, period) {
    const [owner, repo] = repository.split('/');
    const dateString = reportDate.toISOString().split('T')[0];
    return `# Metrics Report: ${repository}\n\n**${period.charAt(0).toUpperCase() + period.slice(1)} Report:** ${dateString}\n\n---`;
  }

  generateSummarySection(metrics, trends) {
    const healthScore = this.calculateHealthScore(metrics, trends);
    const healthTrend = trends.health?.trend || 0;
    const healthArrow = healthTrend > 0 ? '↑' : healthTrend < 0 ? '↓' : '→';

    return [
      '## Summary',
      '',
      `- **Health Score:** ${healthScore}/100 ${healthArrow} ${healthTrend > 0 ? '+' : ''}${healthTrend}`,
      `- **Last Updated:** ${new Date().toISOString().split('T')[0]}`,
      `- **Repository:** ${metrics.repository || 'N/A'}`,
    ].join('\n');
  }

  generateIssuesSection(metrics, trends) {
    const issues = metrics.issues || {};
    const issuesTrend = trends.issues?.trend || 0;
    const closureRate = issues.total > 0 ? ((issues.closed / issues.total) * 100).toFixed(1) : 0;
    const closureTrendArrow = issuesTrend < 0 ? '↓' : '↑';

    return [
      '## Issues',
      '',
      `| Metric | Value | Trend |`,
      `|--------|-------|-------|`,
      `| Total | ${issues.total || 0} | ${issuesTrend > 0 ? '↑' : issuesTrend < 0 ? '↓' : '→'} |`,
      `| Closed | ${issues.closed || 0} | ${closureTrendArrow} |`,
      `| Open | ${issues.open || 0} | - |`,
      `| Closure Rate | ${closureRate}% | ${issuesTrend} |`,
      `| Avg Time-to-Fix | ${trends.avgFixTime?.value || 'N/A'} | - |`,
    ].join('\n');
  }

  generatePullRequestsSection(metrics, trends) {
    const prs = metrics.pullRequests || {};
    const prsTrend = trends.pullRequests?.trend || 0;
    const mergeRate = prs.total > 0 ? ((prs.merged / prs.total) * 100).toFixed(1) : 0;

    return [
      '## Pull Requests',
      '',
      `| Metric | Value | Trend |`,
      `|--------|-------|-------|`,
      `| Total | ${prs.total || 0} | ${prsTrend > 0 ? '↑' : prsTrend < 0 ? '↓' : '→'} |`,
      `| Merged | ${prs.merged || 0} | - |`,
      `| Open | ${prs.open || 0} | - |`,
      `| Merge Rate | ${mergeRate}% | - |`,
      `| Avg Review Time | ${trends.avgReviewTime?.value || 'N/A'} | - |`,
      `| CI Pass Rate | ${trends.ciPassRate?.value || 'N/A'}% | - |`,
    ].join('\n');
  }

  generateContributorsSection(metrics) {
    const contributors = metrics.contributors || {};

    return [
      '## Contributors',
      '',
      `| Type | Count |`,
      `|------|-------|`,
      `| Active | ${contributors.active || 0} |`,
      `| New | ${contributors.new || 0} |`,
      `| Returning | ${contributors.returning || 0} |`,
    ].join('\n');
  }

  generateHealthScoreSection(metrics, trends, anomalies) {
    const healthScore = this.calculateHealthScore(metrics, trends);
    const statusEmoji = healthScore >= 80 ? '✅' : healthScore >= 60 ? '⚠️' : '❌';
    const statusText = healthScore >= 80 ? 'Healthy' : healthScore >= 60 ? 'Fair' : 'Needs Attention';

    return [
      '## Health Status',
      '',
      `**${statusEmoji} ${statusText}** (Score: ${healthScore}/100)`,
      '',
      'Health score is calculated from:',
      `- Issue closure rate (weight: 25%): ${metrics.issues?.closed ? ((metrics.issues.closed / (metrics.issues.total || 1)) * 100).toFixed(1) : 0}%`,
      `- PR merge rate (weight: 25%): ${metrics.pullRequests?.merged ? ((metrics.pullRequests.merged / (metrics.pullRequests.total || 1)) * 100).toFixed(1) : 0}%`,
      `- Contributor activity (weight: 20%): ${metrics.contributors?.active ? metrics.contributors.active : 0} active`,
      `- Stability score (weight: 30%): ${trends.stabilityScore?.value || 'N/A'}`,
    ].join('\n');
  }

  generateAnomaliesSection(anomalies) {
    if (!anomalies || anomalies.length === 0) {
      return '## Anomalies\n\n✅ No anomalies detected this period.';
    }

    const anomalyLines = [
      '## ⚠️ Anomalies Detected',
      '',
      'The following patterns differ from historical baseline:',
      '',
    ];

    anomalies.forEach((anomaly) => {
      anomalyLines.push(`### ${anomaly.type}`);
      anomalyLines.push(`- **Severity:** ${anomaly.severity || 'medium'}`);
      anomalyLines.push(`- **Description:** ${anomaly.description}`);
      anomalyLines.push(`- **Impact:** ${anomaly.impact || 'medium'}`);
      anomalyLines.push('');
    });

    return anomalyLines.join('\n');
  }

  generateTrendAnalysisSection(trends, period) {
    const periodLabel = period === 'weekly' ? 'Week' : period === 'monthly' ? 'Month' : 'Period';

    return [
      '## Trend Analysis',
      '',
      '### Recent Trends',
      '',
      `- **${period === 'weekly' ? 'Weekly' : 'Monthly'} Change:** ${trends.overallChange?.value || 'N/A'}`,
      `- **${periodLabel}-over-${periodLabel}:** ${trends.periodOverPeriod?.value || 'N/A'}`,
      `- **Velocity:** ${trends.velocity?.value || 'N/A'}`,
      `- **Stability:** ${trends.stability?.value || 'N/A'}`,
      '',
      '### Forecast (Next Period)',
      '',
      `- **Expected Issues:** ${trends.forecast?.issues || 'N/A'}`,
      `- **Expected PRs:** ${trends.forecast?.pullRequests || 'N/A'}`,
      `- **Expected Contributors:** ${trends.forecast?.contributors || 'N/A'}`,
    ].join('\n');
  }

  generateFooter() {
    return [
      '---',
      '',
      `*Report generated on ${new Date().toISOString()}*`,
      '',
      '> This report is automatically generated from repository metrics. For questions, contact the metrics team.',
    ].join('\n');
  }

  /**
   * Calculate overall health score (0-100)
   */
  calculateHealthScore(metrics, trends) {
    let score = 50; // Base score

    // Issue closure rate (25% weight)
    if (metrics.issues?.total > 0) {
      const closureRate = metrics.issues.closed / metrics.issues.total;
      score += closureRate * 25;
    }

    // PR merge rate (25% weight)
    if (metrics.pullRequests?.total > 0) {
      const mergeRate = metrics.pullRequests.merged / metrics.pullRequests.total;
      score += mergeRate * 25;
    }

    // Contributor activity (20% weight)
    if (metrics.contributors?.active > 0) {
      score += Math.min((metrics.contributors.active / 10) * 20, 20);
    }

    // Stability (30% weight) - based on anomaly count
    const anomalyPenalty = (trends.anomalyCount || 0) * 5;
    score -= Math.min(anomalyPenalty, 30);

    return Math.max(0, Math.min(100, Math.round(score)));
  }

  generateEmptyReport(repository) {
    return [
      `# Metrics Report: ${repository}`,
      '',
      '## No Data Available',
      '',
      'No metrics data is available for this repository yet.',
      'The metrics collection workflow may not have run yet.',
      '',
      `**Next Collection:** Check back after the next scheduled run.`,
    ].join('\n');
  }

  /**
   * Generate ASCII chart for metrics
   */
  generateChart(label, data, width = 20, height = 5) {
    if (!Array.isArray(data) || data.length === 0) {
      return `\`\`\`\n${label}: No data\n\`\`\``;
    }

    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const range = maxValue - minValue || 1;

    const lines = [];
    for (let y = height; y > 0; y--) {
      let line = '│ ';
      const threshold = minValue + (range * (y - 1)) / (height - 1);
      for (let i = 0; i < Math.min(data.length, width); i++) {
        line += data[i] >= threshold ? '█' : ' ';
      }
      line += ' │';
      lines.push(line);
    }

    lines.push(`└${'─'.repeat(width + 2)}┘`);
    return `\`\`\`\n${lines.join('\n')}\n\`\`\``;
  }
}

module.exports = { MetricsReporter };
