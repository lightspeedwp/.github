/**
 * @fileoverview Helpers for formatting and diffing label arrays, and generating markdown reports.
 * @module label-utils
 */

/**
 * Converts an array of label names into a Markdown table.
 * @param {string[]} labels - Array of label names.
 * @returns {string} Markdown table string.
 */
function labelsToMarkdownTable(labels) {
  if (!labels || labels.length === 0) return "_No labels applied._";
  let md = "| Label |\n|-------|\n";
  labels.forEach((l) => {
    md += `| \`${l}\` |\n`;
  });
  return md;
}

/**
 * Compares current and canonical label arrays and returns missing and extra labels.
 * @param {string[]} current - Current label names.
 * @param {string[]} canonical - Canonical (expected) label names.
 * @returns {{missing: string[], extra: string[]}} Object with missing and extra arrays.
 */
function diffLabels(current, canonical) {
  const missing = canonical.filter((l) => !current.includes(l));
  const extra = current.filter((l) => !canonical.includes(l));
  return { missing, extra };
}

module.exports = {
  labelsToMarkdownTable,
  diffLabels,
};
