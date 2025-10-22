#!/usr/bin/env node
/**
 * ============================================================================
 * Script Name: build-labeling-report.js
 * Location: scripts/utility/build-labeling-report.js
 * Description: Markdown reporting helper for auto-labeling actions.
 * Version: v1.0.0
 * Author: LightSpeed WP Team
 * License: GPL v3 or later
 * Requirements: Node.js
 * Usage: Import to generate markdown reports for labeling results.
 * ============================================================================
 */

/**
 * Build a markdown report for labeling actions.
 * @param {Object} params
 * @param {string} params.type - Issue or PR
 * @param {string[]} params.newLabels - Labels applied
 * @param {Array} params.suggestions - Canonicalization/migration suggestions
 * @returns {string} Markdown report
 */
function buildLabelingReport({ type, newLabels, suggestions }) {
  let report = `## 🏷️ Auto-Labeling Report\n\n**Type:** ${type}\n**Labels Applied:**\n`;
  report += (newLabels && newLabels.length)
    ? newLabels.map(l => `- \`${l}\``).join('\n')
    : '*No new labels applied*';
  if (suggestions && suggestions.length > 0) {
    report += `\n\n**Canonicalization/Migration Suggestions:**\n`;
    for (const s of suggestions) {
      if (s.to) report += `- \`${s.from}\` → \`${s.to}\`\n`;
      else report += `- \`${s.from}\` is non-standard and was removed\n`;
    }
  }
  report += `\n\n*Labels assigned based on content, file changes, branch rules, and org-wide standards.*`;
  return report;
}

module.exports = {
  buildLabelingReport,
};