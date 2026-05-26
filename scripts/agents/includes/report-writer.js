#!/usr/bin/env node
/**
 * ============================================================================
 * Script Name: report-writer.js
 * Location: includes/report-writer.js
 * Description: Generates comprehensive Markdown reports for labeling agent runs
 * Version: v2.0.0
 * Author: LightSpeed WP Team
 * License: GPL v3 or later
 * ============================================================================
 */
// TODO: Align this helper with the latest automation spec updates.

import fs from "fs";
import path from "path";

/**
 * Reads telemetry data from the agent cache file if it exists
 * @returns {Object} Telemetry data object
 */
function readTelemetryData() {
  const cacheDir = path.join(process.cwd(), ".github", "cache");
  const telemetryFile = path.join(cacheDir, "labeling-telemetry.json");

  if (fs.existsSync(telemetryFile)) {
    try {
      const data = fs.readFileSync(telemetryFile, "utf8");
      return JSON.parse(data);
    } catch (error) {
      console.error(`Failed to read telemetry data: ${error.message}`);
      return getDefaultTelemetry();
    }
  }

  return getDefaultTelemetry();
}

/**
 * Returns default telemetry structure when no data is available
 * @returns {Object} Default telemetry object
 */
function getDefaultTelemetry() {
  return {
    timestamp: new Date().toISOString(),
    totals: {
      issues_processed: 0,
      prs_processed: 0,
      discussions_processed: 0,
      labels_added: 0,
      labels_removed: 0,
      unknown_labels: 0,
      alias_hits: 0,
      one_hot_violations: 0,
      defaults_applied: 0,
    },
    items: [],
    errors: [],
    warnings: [],
  };
}

/**
 * Formats a duration in milliseconds to human-readable format
 * @param {number} ms - Duration in milliseconds
 * @returns {string} Formatted duration
 */
function formatDuration(ms) {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(2)}s`;
  return `${(ms / 60000).toFixed(2)}m`;
}

/**
 * Generates a summary section for the report
 * @param {Object} telemetry - Telemetry data
 * @returns {string} Markdown summary section
 */
function generateSummary(telemetry) {
  const { totals } = telemetry;
  const totalItems =
    totals.issues_processed +
    totals.prs_processed +
    totals.discussions_processed;

  let summary = `## 📊 Summary\n\n`;
  summary += `**Run Time:** ${new Date(telemetry.timestamp).toLocaleString()}\n`;
  if (telemetry.duration) {
    summary += `**Duration:** ${formatDuration(telemetry.duration)}\n`;
  }
  summary += `**Total Items Processed:** ${totalItems}\n\n`;

  summary += `### Processing Breakdown\n\n`;
  summary += `| Type | Count |\n`;
  summary += `|------|-------|\n`;
  summary += `| Issues | ${totals.issues_processed} |\n`;
  summary += `| Pull Requests | ${totals.prs_processed} |\n`;
  summary += `| Discussions | ${totals.discussions_processed} |\n\n`;

  summary += `### Label Operations\n\n`;
  summary += `| Operation | Count |\n`;
  summary += `|-----------|-------|\n`;
  summary += `| Labels Added | ${totals.labels_added} |\n`;
  summary += `| Labels Removed | ${totals.labels_removed} |\n`;
  summary += `| Defaults Applied | ${totals.defaults_applied} |\n`;
  summary += `| One-Hot Violations Fixed | ${totals.one_hot_violations} |\n`;
  summary += `| Alias Migrations | ${totals.alias_hits} |\n`;
  summary += `| Unknown Labels Detected | ${totals.unknown_labels} |\n\n`;

  return summary;
}

/**
 * Generates detailed item processing section
 * @param {Object} telemetry - Telemetry data
 * @returns {string} Markdown items section
 */
function generateItemsSection(telemetry) {
  if (!telemetry.items || telemetry.items.length === 0) {
    return "";
  }

  let section = `## 📝 Processed Items\n\n`;

  for (const item of telemetry.items) {
    const itemType = item.type || "Unknown";
    const itemNumber = item.number || "N/A";
    const itemTitle = item.title || "Untitled";

    section += `### ${itemType} #${itemNumber}: ${itemTitle}\n\n`;

    if (item.labels_added && item.labels_added.length > 0) {
      section += `**Labels Added:** ${item.labels_added.map((l) => `\`${l}\``).join(", ")}\n\n`;
    }

    if (item.labels_removed && item.labels_removed.length > 0) {
      section += `**Labels Removed:** ${item.labels_removed.map((l) => `\`${l}\``).join(", ")}\n\n`;
    }

    if (item.migrations && item.migrations.length > 0) {
      section += `**Migrations:**\n`;
      for (const migration of item.migrations) {
        section += `- \`${migration.from}\` → \`${migration.to}\`\n`;
      }
      section += `\n`;
    }

    if (item.notes) {
      section += `**Notes:** ${item.notes}\n\n`;
    }

    section += `---\n\n`;
  }

  return section;
}

/**
 * Generates errors and warnings section
 * @param {Object} telemetry - Telemetry data
 * @returns {string} Markdown errors/warnings section
 */
function generateIssuesSection(telemetry) {
  let section = "";

  if (telemetry.errors && telemetry.errors.length > 0) {
    section += `## ⚠️ Errors\n\n`;
    for (const error of telemetry.errors) {
      section += `- **${error.context || "General"}:** ${error.message}\n`;
    }
    section += `\n`;
  }

  if (telemetry.warnings && telemetry.warnings.length > 0) {
    section += `## ⚡ Warnings\n\n`;
    for (const warning of telemetry.warnings) {
      section += `- **${warning.context || "General"}:** ${warning.message}\n`;
    }
    section += `\n`;
  }

  return section;
}

/**
 * Generates Mermaid chart for visualization
 * @param {Object} telemetry - Telemetry data
 * @returns {string} Mermaid chart markdown
 */
function generateChart(telemetry) {
  const { totals } = telemetry;
  const totalItems =
    totals.issues_processed +
    totals.prs_processed +
    totals.discussions_processed;

  if (totalItems === 0) {
    return "";
  }

  let chart = `## 📈 Visual Breakdown\n\n`;
  chart += `\`\`\`mermaid\npie title Items Processed by Type\n`;
  chart += `  "Issues" : ${totals.issues_processed}\n`;
  chart += `  "Pull Requests" : ${totals.prs_processed}\n`;
  chart += `  "Discussions" : ${totals.discussions_processed}\n`;
  chart += `\`\`\`\n\n`;

  return chart;
}

/**
 * Generates recommendations based on telemetry data
 * @param {Object} telemetry - Telemetry data
 * @returns {string} Markdown recommendations section
 */
function generateRecommendations(telemetry) {
  const recommendations = [];

  if (telemetry.totals.unknown_labels > 0) {
    recommendations.push(
      `- ${telemetry.totals.unknown_labels} unknown label(s) detected. Review and add to canonical labels.yml or mark as repository-specific.`,
    );
  }

  if (telemetry.totals.one_hot_violations > 5) {
    recommendations.push(
      `- High number of one-hot violations (${telemetry.totals.one_hot_violations}). Consider updating issue templates to prevent multiple status/priority/type labels.`,
    );
  }

  if (telemetry.totals.alias_hits > 0) {
    recommendations.push(
      `- ${telemetry.totals.alias_hits} alias migration(s) performed. Consider updating documentation to use canonical label names.`,
    );
  }

  if (telemetry.errors && telemetry.errors.length > 0) {
    recommendations.push(
      `- ${telemetry.errors.length} error(s) encountered. Review error log above and address issues.`,
    );
  }

  if (recommendations.length === 0) {
    return "";
  }

  let section = `## 💡 Recommendations\n\n`;
  section += recommendations.join("\n") + "\n\n";

  return section;
}

/**
 * Generates the complete report
 * @param {Object} telemetry - Telemetry data (optional)
 * @returns {string} Complete Markdown report
 */
function generateReport(telemetry = null) {
  const data = telemetry || readTelemetryData();

  let report = `# 🏷️ Labeling Agent Report\n\n`;
  report += `> Automated labeling, status enforcement, and standardization report\n\n`;
  report += `---\n\n`;

  report += generateSummary(data);
  report += generateChart(data);
  report += generateItemsSection(data);
  report += generateIssuesSection(data);
  report += generateRecommendations(data);

  report += `---\n\n`;
  report += `## 📚 Reference\n\n`;
  report += `- **Canonical Labels:** [.github/labels.yml](../../labels.yml)\n`;
  report += `- **Labeler Rules:** [.github/labeler.yml](../../labeler.yml)\n`;
  report += `- **Agent Documentation:** [Labeling Guide](../../../docs/LABELING.md)\n\n`;

  report += `_Generated by [LightSpeedWP Labeling Agent](../../agents/labeling.agent.js) v2.0.0_\n`;

  return report;
}

// If run directly, output the report
if (require.main === module) {
  const report = generateReport();
  process.stdout.write(report);
}

module.exports = {
  generateReport,
  readTelemetryData,
  getDefaultTelemetry,
  generateSummary,
  generateItemsSection,
  generateIssuesSection,
  generateChart,
  generateRecommendations,
};
