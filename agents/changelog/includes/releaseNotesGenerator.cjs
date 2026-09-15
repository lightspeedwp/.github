/**
 * Release Notes Generator
 * Format changelog entries for external consumption (release notes, documentation)
 */

const referenceLinker = require("./referenceLinker.cjs");

/**
 * Group entries by category
 * @param {Array} entries - Array of changelog entries
 * @returns {Object} Entries grouped by category with order priority
 */
function groupByCategory(entries) {
  const categoryOrder = [
    "Breaking Changes",
    "Security",
    "Features",
    "Added",
    "Improvements",
    "Fixed",
    "Changed",
    "Deprecated",
    "Removed",
    "Other",
  ];

  const grouped = {};

  // Initialize categories
  for (const cat of categoryOrder) {
    grouped[cat] = [];
  }

  // Group entries
  for (const entry of entries) {
    const category = entry.category || "Other";
    const normalizedCat = normalizeCategory(category);

    if (!grouped[normalizedCat]) {
      grouped[normalizedCat] = [];
    }

    grouped[normalizedCat].push(entry);
  }

  return grouped;
}

/**
 * Normalize category name
 * Maps various category names to standard form
 * @param {string} category - Category name
 * @returns {string} Normalized category
 */
function normalizeCategory(category) {
  const map = {
    added: "Added",
    feature: "Features",
    features: "Features",
    fixed: "Fixed",
    fix: "Fixed",
    improved: "Improvements",
    improvement: "Improvements",
    improvements: "Improvements",
    changed: "Changed",
    change: "Changed",
    deprecated: "Deprecated",
    removed: "Removed",
    security: "Security",
    breaking: "Breaking Changes",
    "breaking-change": "Breaking Changes",
    "breaking change": "Breaking Changes",
  };

  const normalized = map[category?.toLowerCase()] || category;
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

/**
 * Format a single entry for release notes
 * @param {Object} entry - Changelog entry
 * @returns {string} Formatted entry text
 */
function formatEntry(entry) {
  let output = "- ";

  // Add entry text
  const displayText = entry.linked_text || entry.text;
  output += displayText;

  // Add reference summary if available
  if (entry.pr_links?.length > 0 || entry.issue_links?.length > 0) {
    const summary = referenceLinker.createReferenceSummary(
      entry.pr_links,
      entry.issue_links,
    );
    output += ` (${summary})`;
  }

  return output;
}

/**
 * Generate Markdown release notes from entries
 * @param {string} version - Release version
 * @param {string} releaseDate - Release date (ISO format)
 * @param {Array} entries - Array of changelog entries
 * @returns {string} Markdown formatted release notes
 */
function generateMarkdownReleaseNotes(version, releaseDate, entries = []) {
  const grouped = groupByCategory(entries);

  let output = `# Release Notes\n\n`;
  output += `**Version**: ${version}\n`;
  output += `**Date**: ${releaseDate}\n\n`;

  // Add intro
  output += `## What's New\n\n`;
  output += `We're excited to announce the release of version ${version}. This release includes important improvements, new features, and bug fixes.\n\n`;

  // Add categories
  const categoryOrder = [
    "Breaking Changes",
    "Security",
    "Features",
    "Added",
    "Improvements",
    "Fixed",
    "Changed",
    "Deprecated",
    "Removed",
  ];

  for (const category of categoryOrder) {
    const categoryEntries = grouped[category];

    if (categoryEntries && categoryEntries.length > 0) {
      output += `## ${category}\n\n`;

      for (const entry of categoryEntries) {
        output += formatEntry(entry) + "\n";
      }

      output += "\n";
    }
  }

  // Add other categories not in standard list
  for (const category in grouped) {
    if (!categoryOrder.includes(category)) {
      const categoryEntries = grouped[category];

      if (categoryEntries && categoryEntries.length > 0) {
        output += `## ${category}\n\n`;

        for (const entry of categoryEntries) {
          output += formatEntry(entry) + "\n";
        }

        output += "\n";
      }
    }
  }

  // Add footer
  output += `---\n\n`;
  output += `**Full Changelog**: See the [GitHub releases page](https://github.com/lightspeedwp/.github/releases/tag/${version}) for more details.\n`;

  return output;
}

/**
 * Generate HTML release notes
 * @param {string} version - Release version
 * @param {string} releaseDate - Release date
 * @param {Array} entries - Array of changelog entries
 * @returns {string} HTML formatted release notes
 */
function generateHTMLReleaseNotes(version, releaseDate, entries = []) {
  const grouped = groupByCategory(entries);

  let output = `<!DOCTYPE html>\n<html>\n<head>\n`;
  output += `<title>Release ${version}</title>\n`;
  output += `<style>\n`;
  output += `body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }\n`;
  output += `h1 { color: #333; }\n`;
  output += `h2 { color: #666; margin-top: 30px; }\n`;
  output += `ul { line-height: 1.8; }\n`;
  output += `li { margin: 10px 0; }\n`;
  output += `a { color: #0066cc; text-decoration: none; }\n`;
  output += `a:hover { text-decoration: underline; }\n`;
  output += `</style>\n</head>\n<body>\n`;

  output += `<h1>Release ${version}</h1>\n`;
  output += `<p><strong>Date:</strong> ${releaseDate}</p>\n`;
  output += `<p>We're excited to announce the release of version ${version}. This release includes important improvements, new features, and bug fixes.</p>\n`;

  // Add categories
  const categoryOrder = [
    "Breaking Changes",
    "Security",
    "Features",
    "Added",
    "Improvements",
    "Fixed",
    "Changed",
    "Deprecated",
    "Removed",
  ];

  for (const category of categoryOrder) {
    const categoryEntries = grouped[category];

    if (categoryEntries && categoryEntries.length > 0) {
      output += `<h2>${category}</h2>\n<ul>\n`;

      for (const entry of categoryEntries) {
        const text = entry.linked_text || entry.text;
        output += `<li>${text}</li>\n`;
      }

      output += `</ul>\n`;
    }
  }

  output += `</body>\n</html>`;

  return output;
}

/**
 * Generate plain text release notes
 * @param {string} version - Release version
 * @param {string} releaseDate - Release date
 * @param {Array} entries - Array of changelog entries
 * @returns {string} Plain text formatted release notes
 */
function generatePlainTextReleaseNotes(version, releaseDate, entries = []) {
  const grouped = groupByCategory(entries);

  let output = `RELEASE ${version}\n`;
  output += `Released: ${releaseDate}\n`;
  output += `${"=".repeat(60)}\n\n`;

  // Add categories
  const categoryOrder = [
    "Breaking Changes",
    "Security",
    "Features",
    "Added",
    "Improvements",
    "Fixed",
    "Changed",
    "Deprecated",
    "Removed",
  ];

  for (const category of categoryOrder) {
    const categoryEntries = grouped[category];

    if (categoryEntries && categoryEntries.length > 0) {
      output += `${category.toUpperCase()}\n`;
      output += `${"-".repeat(category.length)}\n`;

      for (const entry of categoryEntries) {
        const text = entry.text || "";
        output += `* ${text}\n`;
      }

      output += "\n";
    }
  }

  return output;
}

module.exports = {
  generateMarkdownReleaseNotes,
  generateHTMLReleaseNotes,
  generatePlainTextReleaseNotes,
  groupByCategory,
  normalizeCategory,
  formatEntry,
};
