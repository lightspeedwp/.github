#!/usr/bin/env node
/**
 * ============================================================================
 * Script Name: label-reporting.js
 * Location: scripts/utility/label-reporting.js
 * Description: Markdown reporting helpers for labeling and standardization actions.
 * Version: v1.0.0
 * Author: LightSpeed WP Team
 * License: GPL v3 or later
 * ============================================================================
 */

/**
 * Build a Markdown summary for labeling actions.
 * @param {Object} data - An object with added/removed/migrated arrays
 * @returns {string} Markdown summary
 */
function buildLabelingReport(data = {}) {
  const added = data.added || [];
  const removed = data.removed || [];
  const migrated = data.migrated || [];
  let report = "## Label Actions Report\n\n";
  if (added.length) report += `**Added**: ${added.join(", ")}\n`;
  if (removed.length) report += `**Removed**: ${removed.join(", ")}\n`;
  if (migrated.length)
    report += `**Migrated**: ${migrated.map((m) => `${m.from} → ${m.to}`).join(", ")}\n`;
  if (!added.length && !removed.length && !migrated.length)
    report += "_No changes._\n";
  return report;
}

module.exports = { buildLabelingReport };

/**
 * Build a markdown report for label standardization actions.
 */
function buildStandardizationReport({ nonStandardLabels, migratedLabels }) {
  let report = `## 🏷️ Label Standardization Report\n\n**Non-standard labels found:**\n`;
  report +=
    nonStandardLabels && nonStandardLabels.length
      ? nonStandardLabels.map((l) => `- \`${l}\``).join("\n")
      : "*No non-standard labels found*";
  if (migratedLabels && migratedLabels.length > 0) {
    report += `\n\n**Migrated Labels:**\n`;
    migratedLabels.forEach((m) => {
      report += `- \`${m.from}\` → \`${m.to}\`\n`;
    });
  }
  report += `\n\n*Repository labels now conform to org-wide standards.*`;
  return report;
}

export { buildLabelingReport, buildStandardizationReport };
