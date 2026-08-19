#!/usr/bin/env node

/**
 * Track Remediation Metrics
 *
 * Tracks remediation metrics over time for progress reporting
 * Maintains metrics in .github/data/remediation-metrics.json
 */

const fs = require('fs');
const path = require('path');

const metricsFile = '.github/data/remediation-metrics.json';
const dataDir = '.github/data';

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Load existing metrics
let metrics = {
  created: new Date().toISOString(),
  last_updated: new Date().toISOString(),
  history: [],
};

if (fs.existsSync(metricsFile)) {
  try {
    metrics = JSON.parse(fs.readFileSync(metricsFile, 'utf8'));
  } catch (error) {
    console.error('Failed to parse existing metrics:', error.message);
  }
}

// Read latest remediation summary
let latestSummary = null;
try {
  if (fs.existsSync('reports/remediation-summary.json')) {
    latestSummary = JSON.parse(fs.readFileSync('reports/remediation-summary.json', 'utf8'));
  }
} catch (error) {
  console.error('Failed to read remediation summary:', error.message);
  process.exit(1);
}

if (!latestSummary) {
  console.error('No remediation summary found');
  process.exit(1);
}

// Add to history
const entry = {
  timestamp: latestSummary.timestamp || new Date().toISOString(),
  ...latestSummary.execution_summary,
  ...latestSummary.quality_metrics,
  recommendations: latestSummary.recommendations_summary,
};

metrics.history.push(entry);
metrics.last_updated = new Date().toISOString();

// Keep only last 30 days of metrics
const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
metrics.history = metrics.history.filter((h) => new Date(h.timestamp) > thirtyDaysAgo);

// Calculate trends
if (metrics.history.length > 1) {
  const latest = metrics.history[metrics.history.length - 1];
  const previous = metrics.history[metrics.history.length - 2];

  metrics.trends = {
    success_rate_change: latest.success_rate - (previous.success_rate || 0),
    auto_apply_rate_change: latest.auto_apply_rate - (previous.auto_apply_rate || 0),
    total_issues_change: latest.total_issues - (previous.total_issues || 0),
    average_confidence_change: latest.average_confidence - (previous.average_confidence || 0),
  };
}

// Calculate current statistics
if (metrics.history.length > 0) {
  const latest = metrics.history[metrics.history.length - 1];

  metrics.current = {
    total_issues_processed: latest.total_issues || 0,
    successfully_remediated: latest.successfully_remediated || 0,
    success_rate: latest.success_rate || 0,
    auto_apply_eligible: latest.auto_apply_eligible || 0,
    auto_apply_rate: latest.auto_apply_rate || 0,
    average_confidence: latest.average_confidence || 0,
    recommendations: latest.recommendations || {},
  };
}

// Save updated metrics
fs.writeFileSync(metricsFile, JSON.stringify(metrics, null, 2));

console.log('✅ Metrics updated:');
console.log(JSON.stringify(metrics.current, null, 2));

// Generate progress report
generateProgressReport(metrics);

/**
 * Generate human-readable progress report
 */
function generateProgressReport(metrics) {
  const reportFile = '.githu./.github/reports/remediation-progress.md';
  const reportDir = path.dirname(reportFile);

  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  // Add YAML frontmatter
  let report = `---\n`;
  report += `file_type: "report"\n`;
  report += `title: "Issue Remediation Progress Report"\n`;
  report += `description: "Ongoing metrics and progress tracking for automated issue metadata remediation"\n`;
  report += `created_date: "${new Date().toISOString().split('T')[0]}"\n`;
  report += `last_updated: "${new Date().toISOString()}"\n`;
  report += `---\n\n`;

  report += `# Issue Remediation Progress Report\n\n`;
  report += `**Last Updated:** ${new Date().toISOString()}\n\n`;

  if (metrics.current) {
    const current = metrics.current;

    report += `## Current Metrics\n\n`;
    report += `| Metric | Value |\n`;
    report += `|--------|-------|\n`;
    report += `| Total Issues Processed | ${current.total_issues_processed} |\n`;
    report += `| Successfully Remediated | ${current.successfully_remediated} |\n`;
    report += `| Success Rate | ${current.success_rate}% |\n`;
    report += `| Auto-Apply Eligible | ${current.auto_apply_eligible} |\n`;
    report += `| Auto-Apply Rate | ${current.auto_apply_rate}% |\n`;
    report += `| Average Confidence | ${current.average_confidence}% |\n\n`;

    if (current.recommendations) {
      report += `## Recommendations Applied\n\n`;
      report += `| Type | Count |\n`;
      report += `|------|-------|\n`;
      report += `| Type Labels | ${current.recommendations.type_labels || 0} |\n`;
      report += `| Area Labels | ${current.recommendations.area_labels || 0} |\n`;
      report += `| Priority Labels | ${current.recommendations.priority_labels || 0} |\n`;
      report += `| Assignee Suggestions | ${current.recommendations.assignee_suggestions || 0} |\n`;
      report += `| Milestone Assignments | ${current.recommendations.milestone_assignments || 0} |\n`;
      report += `| Template Fixes | ${current.recommendations.template_fixes || 0} |\n`;
      report += `| **Total** | **${current.recommendations.total || 0}** |\n\n`;
    }
  }

  if (metrics.trends) {
    report += `## Trends (vs. previous run)\n\n`;
    const t = metrics.trends;
    report += `- Success Rate: ${t.success_rate_change > 0 ? '📈' : t.success_rate_change < 0 ? '📉' : '➡️'} ${t.success_rate_change > 0 ? '+' : ''}${t.success_rate_change}%\n`;
    report += `- Auto-Apply Rate: ${t.auto_apply_rate_change > 0 ? '📈' : t.auto_apply_rate_change < 0 ? '📉' : '➡️'} ${t.auto_apply_rate_change > 0 ? '+' : ''}${t.auto_apply_rate_change}%\n`;
    report += `- Total Issues: ${t.total_issues_change > 0 ? '📈' : t.total_issues_change < 0 ? '📉' : '➡️'} ${t.total_issues_change > 0 ? '+' : ''}${t.total_issues_change}\n`;
    report += `- Average Confidence: ${t.average_confidence_change > 0 ? '📈' : t.average_confidence_change < 0 ? '📉' : '➡️'} ${t.average_confidence_change > 0 ? '+' : ''}${t.average_confidence_change}%\n\n`;
  }

  report += `## Recent History\n\n`;
  report += `| Date | Issues | Success Rate | Confidence |\n`;
  report += `|------|--------|--------------|------------|\n`;

  metrics.history
    .slice(-10)
    .reverse()
    .forEach((entry) => {
      const date = new Date(entry.timestamp).toLocaleDateString();
      report += `| ${date} | ${entry.total_issues} | ${entry.success_rate}% | ${entry.average_confidence}% |\n`;
    });

  fs.writeFileSync(reportFile, report);
  console.log(`✅ Progress report generated: ${reportFile}`);
}
