/**
 * @fileoverview Generates a Markdown audit report comparing current and canonical labels.
 * @module build-labeling-report
 */

// TODO: Align this helper with the latest automation spec updates.

const { labelsToMarkdownTable, diffLabels } = require("./label-utils");

/**
 * Builds a Markdown-formatted audit report for labels on an issue/PR.
 * @param {string[]} currentLabels - Array of current label names.
 * @param {string[]} canonicalLabels - Array of canonical label names.
 * @returns {string} Markdown string summarizing label audit.
 */
function buildLabelingReport(currentLabels, canonicalLabels) {
  const { missing, extra } = diffLabels(currentLabels, canonicalLabels);
  let report = "## Label Audit Report\n";
  report += "\n**Current Labels:**\n" + labelsToMarkdownTable(currentLabels);
  report +=
    "\n**Expected Canonical Labels:**\n" +
    labelsToMarkdownTable(canonicalLabels);
  if (missing.length)
    report +=
      "\n**Missing Canonical Labels:**\n" + labelsToMarkdownTable(missing);
  if (extra.length)
    report +=
      "\n**Extra (Non-canonical) Labels:**\n" + labelsToMarkdownTable(extra);
  return report;
}

module.exports = { buildLabelingReport };
