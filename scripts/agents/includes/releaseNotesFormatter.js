#!/usr/bin/env node
/**
 * ============================================================================
 * Module: releaseNotesFormatter.js
 * Location: scripts/agents/includes/releaseNotesFormatter.js
 * Description:
 *   - Formats changelog entries into release notes
 *   - Generates markdown-formatted release notes from sections
 *   - Handles version headers and dates
 * Standards:
 *   - Follows LightSpeed Coding Standards
 * ============================================================================
 */

/**
 * Format section title (capitalize)
 * @param {string} section - Section name (e.g., "added", "fixed")
 * @returns {string} Formatted title (e.g., "Added")
 */
function formatSectionTitle(section) {
  if (!section || typeof section !== "string") {
    return null;
  }

  return section.charAt(0).toUpperCase() + section.slice(1);
}

function escapeMarkdownInline(value) {
  return String(value)
    .replace(/[\r\n]+/g, " ")
    .replace(/([\\`*_{}[\]()#+\-.!|>])/g, "\\$1")
    .trim();
}

/**
 * Format a single release note entry
 * @param {Object} entry - Entry with description, commit, author, pr, scope
 * @returns {string} Formatted entry line
 */
function formatEntry(entry) {
  if (!entry || typeof entry !== "object" || !entry.description) {
    return null;
  }

  const description = escapeMarkdownInline(entry.description);
  let line = `- ${description}`;

  // Add scope if present
  if (entry.scope) {
    const scope = escapeMarkdownInline(entry.scope);
    line = `- **${scope}:** ${description}`;
  }

  // Add commit reference if present
  if (entry.commit) {
    const shortHash = entry.commit.substring(0, 7);
    line += ` ([${shortHash}](https://github.com/lightspeedwp/.github/commit/${entry.commit}))`;
  }

  // Add PR reference if present
  if (entry.pr) {
    line += ` (#${entry.pr})`;
  }

  // Add author if present
  if (entry.author) {
    line += ` @${escapeMarkdownInline(entry.author)}`;
  }

  return line;
}

/**
 * Build release notes from entries
 * @param {Object} entries - Entries organized by section
 * @param {Object} options - Options {includeEmpty, sectionOrder}
 * @returns {string} Markdown formatted release notes
 */
function buildReleaseNotes(entries, options = {}) {
  if (!entries || typeof entries !== "object") {
    return "";
  }

  const includeEmpty = options.includeEmpty !== false; // Default true
  const defaultOrder = [
    "security",
    "removed",
    "deprecated",
    "added",
    "changed",
    "fixed",
    "documentation",
    "performance",
  ];
  const sectionOrder = options.sectionOrder || defaultOrder;

  const sections = [];

  // Process sections in order
  sectionOrder.forEach((section) => {
    if (!entries[section]) {
      return;
    }

    const sectionEntries = entries[section];
    if (!Array.isArray(sectionEntries)) {
      return;
    }

    if (sectionEntries.length === 0 && !includeEmpty) {
      return;
    }

    if (sectionEntries.length === 0) {
      sections.push(`### ${formatSectionTitle(section)}\n`);
      return;
    }

    const title = formatSectionTitle(section);
    const formattedEntries = sectionEntries
      .map(formatEntry)
      .filter(Boolean)
      .join("\n");

    sections.push(`### ${title}\n\n${formattedEntries}\n`);
  });

  // Process any additional sections not in order
  Object.keys(entries).forEach((section) => {
    if (sectionOrder.includes(section)) {
      return;
    }

    const sectionEntries = entries[section];
    if (!Array.isArray(sectionEntries) || sectionEntries.length === 0) {
      return;
    }

    const title = formatSectionTitle(section);
    const formattedEntries = sectionEntries
      .map(formatEntry)
      .filter(Boolean)
      .join("\n");

    sections.push(`### ${title}\n\n${formattedEntries}\n`);
  });

  return sections.join("\n");
}

/**
 * Format version header for release notes
 * @param {string} version - Version string (e.g., "1.2.3")
 * @param {string} date - Date string (ISO format or human readable)
 * @returns {string} Formatted version header
 */
function formatVersionHeader(version, date = null) {
  if (!version || typeof version !== "string") {
    return null;
  }

  if (date) {
    return `## [${version}] - ${date}`;
  }

  return `## [${version}]`;
}

/**
 * Generate complete release notes with version header
 * @param {string} version - Version string
 * @param {Object} entries - Entries organized by section
 * @param {Object} options - Options {date, includeEmpty, sectionOrder}
 * @returns {string} Complete markdown release notes
 */
function generateReleaseNotes(version, entries, options = {}) {
  if (!version || !entries || typeof entries !== "object") {
    return null;
  }

  const header = formatVersionHeader(version, options.date);
  if (!header) {
    return null;
  }

  const notes = buildReleaseNotes(entries, options);

  return `${header}\n\n${notes}`.trim();
}

/**
 * Extract summary from entries (key statistics)
 * @param {Object} entries - Entries organized by section
 * @returns {Object} Summary with counts per section
 */
function extractSummary(entries) {
  if (!entries || typeof entries !== "object") {
    return {};
  }

  const summary = {};

  Object.keys(entries).forEach((section) => {
    const sectionEntries = entries[section];
    if (Array.isArray(sectionEntries)) {
      summary[section] = sectionEntries.length;
    }
  });

  return summary;
}

/**
 * Generate summary text for release
 * @param {Object} entries - Entries organized by section
 * @returns {string} Human-readable summary (e.g., "3 features added, 2 bugs fixed")
 */
function generateSummaryText(entries) {
  if (!entries || typeof entries !== "object") {
    return "";
  }

  const summary = extractSummary(entries);
  const parts = [];

  if (summary.added > 0) {
    parts.push(
      `${summary.added} feature${summary.added !== 1 ? "s" : ""} added`,
    );
  }

  if (summary.fixed > 0) {
    parts.push(`${summary.fixed} bug${summary.fixed !== 1 ? "s" : ""} fixed`);
  }

  if (summary.deprecated > 0) {
    parts.push(
      `${summary.deprecated} item${summary.deprecated !== 1 ? "s" : ""} deprecated`,
    );
  }

  if (summary.removed > 0) {
    parts.push(
      `${summary.removed} item${summary.removed !== 1 ? "s" : ""} removed`,
    );
  }

  if (summary.security > 0) {
    parts.push(
      `${summary.security} security ${summary.security !== 1 ? "fixes" : "fix"}`,
    );
  }

  if (summary.changed > 0) {
    parts.push(`${summary.changed} change${summary.changed !== 1 ? "s" : ""}`);
  }

  if (summary.documentation > 0) {
    parts.push(
      `${summary.documentation} documentation ${summary.documentation !== 1 ? "updates" : "update"}`,
    );
  }

  if (summary.performance > 0) {
    parts.push(
      `${summary.performance} performance improvement${summary.performance !== 1 ? "s" : ""}`,
    );
  }

  if (parts.length === 0) {
    return "No changes";
  }

  return parts.join(", ");
}

module.exports = {
  escapeMarkdownInline,
  formatSectionTitle,
  formatEntry,
  buildReleaseNotes,
  formatVersionHeader,
  generateReleaseNotes,
  extractSummary,
  generateSummaryText,
};
