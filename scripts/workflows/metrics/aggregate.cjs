#!/usr/bin/env node

/**
 * Aggregate metrics from various workflow sources
 *
 * Collects metrics from:
 * - .github/metrics/meta.json (meta workflow metrics)
 * - .github/metrics/meta-log.md (historical metrics)
 * - Git log (recent commits, authors, activity)
 * - Changelog (recent changes, PRs)
 *
 * Outputs: report_date (ISO date), metrics_json (JSON object)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const METRICS_DIR = process.env.METRICS_DIR || '.github/metrics';
const reportDate = new Date().toISOString().split('T')[0];

const metrics = {
  date: reportDate,
  timestamp: new Date().toISOString(),
  summary: {},
  details: {},
};

try {
  // Read meta metrics if available
  const metaMetricsFile = path.join(METRICS_DIR, 'meta.json');
  if (fs.existsSync(metaMetricsFile)) {
    const metaMetrics = JSON.parse(fs.readFileSync(metaMetricsFile, 'utf8'));
    metrics.summary.meta = metaMetrics;
  }

  // Aggregate git activity (last 7 days)
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    const commits = execSync(
      `git log --since="${sevenDaysAgo}" --oneline 2>/dev/null | wc -l`,
      { encoding: 'utf8' },
    ).trim();

    const authors = execSync(
      `git log --since="${sevenDaysAgo}" --pretty=format:%an 2>/dev/null | sort -u | wc -l`,
      { encoding: 'utf8' },
    ).trim();

    metrics.summary.gitActivity = {
      commitsLast7Days: parseInt(commits, 10),
      uniqueAuthorsLast7Days: parseInt(authors, 10),
      period: `${sevenDaysAgo} to ${reportDate}`,
    };
  } catch (err) {
    console.warn(`⚠️  Could not aggregate git metrics: ${err.message}`);
  }

  // Count workflow runs (rough estimate from logs if available)
  metrics.summary.workflowEstimate = {
    note: 'Requires GitHub API access for accurate counts',
    dataSource: 'Manual or API integration needed',
  };

  // Log final aggregated metrics
  console.log(`✅ Aggregated metrics for ${reportDate}`);
  console.log(`   - Git activity: ${metrics.summary.gitActivity?.commitsLast7Days || 'N/A'} commits`);
  if (metrics.summary.meta) {
    console.log(`   - Meta coverage: ${metrics.summary.meta.coverage || 'N/A'}%`);
  }

  // Output results
  outputResults(reportDate, JSON.stringify(metrics));
} catch (err) {
  console.error(`❌ Error aggregating metrics: ${err.message}`);
  process.exit(1);
}

/**
 * Output GitHub Actions workflow outputs
 */
function outputResults(reportDate, metricsJson) {
  const outputFile = process.env.GITHUB_OUTPUT;
  if (!outputFile) {
    console.log(`report_date=${reportDate}`);
    console.log(`metrics_json=${metricsJson}`);
    return;
  }

  let output = `report_date=${reportDate}\n`;
  output += `metrics_json=${metricsJson}\n`;

  fs.appendFileSync(outputFile, output, 'utf8');
}
