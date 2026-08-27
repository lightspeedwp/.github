/**
 * Changelog Formatter
 * Auto-format changelog entries to enforce style rules
 */

/**
 * Format a changelog entry, fixing common issues
 * @param {Object} entry - { title, description, prLink }
 * @returns {Object} Formatted entry with original and corrected values
 */
function formatEntry(entry = {}) {
  const { title = '', description = '', prLink = '' } = entry;

  const formatted = {
    title: formatTitle(title),
    description: formatDescription(description),
    prLink: formatPRLink(prLink),
    formatted: false,
  };

  // Check if anything changed
  formatted.formatted =
    formatted.title !== title ||
    formatted.description !== description ||
    formatted.prLink !== prLink;

  return formatted;
}

/**
 * Enforce em-dashes in text (not hyphens)
 * @param {string} text
 * @returns {string}
 */
function enforceEmDash(text) {
  if (!text) return text;

  // Replace hyphens between words with em-dashes
  // But preserve hyphens in: hyphenated-words, URLs, code
  // This is a simplified version - real implementation would be more complex

  // Don't modify if text contains URL-like patterns
  if (text.includes('http') || text.includes('/')) {
    return text;
  }

  // Replace " - " with " — "
  return text.replace(/ - /g, ' — ');
}

/**
 * Truncate title to 60 characters (after formatting)
 * @param {string} title
 * @returns {string}
 */
function truncateTitle(title) {
  if (!title) return '';

  let formatted = title.trim();
  formatted = enforceEmDash(formatted);

  if (formatted.length > 60) {
    // Truncate and remove trailing punctuation if needed
    formatted = formatted.slice(0, 60).trim();
    if (formatted.endsWith('-')) {
      formatted = formatted.slice(0, -1).trim();
    }
  }

  return formatted;
}

/**
 * Truncate description to 150 characters
 * @param {string} description
 * @returns {string}
 */
function truncateDescription(description) {
  if (!description) return '';

  let formatted = description.trim();
  formatted = enforceEmDash(formatted);

  if (formatted.length > 150) {
    formatted = formatted.slice(0, 150).trim();
    if (formatted.endsWith('-')) {
      formatted = formatted.slice(0, -1).trim();
    }
  }

  return formatted;
}

/**
 * Extract PR link from text (looks for #123 pattern)
 * @param {string} text
 * @returns {string|null}
 */
function extractPRLink(text) {
  if (!text) return null;

  const match = text.match(/#(\d+)/);
  return match ? match[0] : null;
}

/**
 * Format PR link (always #123 format, never modified by em-dash)
 * @param {string|number} prNumber
 * @returns {string}
 */
function formatPRLink(prNumber) {
  if (!prNumber) return '';

  const num = String(prNumber).replace(/[^\d]/g, '');
  return num ? `#${num}` : '';
}

/**
 * Format title (enforce capitalization, em-dashes, trim)
 * @param {string} title
 * @returns {string}
 */
function formatTitle(title) {
  if (!title) return '';

  let formatted = title.trim();

  // Enforce em-dashes
  formatted = enforceEmDash(formatted);

  // Capitalize first letter if lowercase
  if (formatted && formatted[0] === formatted[0].toLowerCase()) {
    formatted = formatted[0].toUpperCase() + formatted.slice(1);
  }

  // Truncate to 60 chars
  formatted = truncateTitle(formatted);

  return formatted;
}

/**
 * Format description (enforce em-dashes, trim, truncate)
 * @param {string} description
 * @returns {string}
 */
function formatDescription(description) {
  if (!description) return '';

  let formatted = description.trim();

  // Enforce em-dashes
  formatted = enforceEmDash(formatted);

  // Truncate to 150 chars
  formatted = truncateDescription(formatted);

  return formatted;
}

/**
 * Normalize whitespace in text
 * @param {string} text
 * @returns {string}
 */
function normalizeWhitespace(text) {
  if (!text) return '';

  // Remove leading/trailing whitespace
  let normalized = text.trim();

  // Collapse multiple spaces to single space
  normalized = normalized.replace(/  +/g, ' ');

  return normalized;
}

/**
 * Comprehensive formatting pipeline
 * @param {Object} entry
 * @returns {Object} Fully formatted entry
 */
function formatEntryComprehensive(entry = {}) {
  const { title = '', description = '', prLink = '' } = entry;

  return {
    title: normalizeWhitespace(formatTitle(title)),
    description: normalizeWhitespace(formatDescription(description)),
    prLink: formatPRLink(prLink),
  };
}

module.exports = {
  formatEntry,
  enforceEmDash,
  truncateTitle,
  truncateDescription,
  extractPRLink,
  formatPRLink,
  formatTitle,
  formatDescription,
  normalizeWhitespace,
  formatEntryComprehensive,
};
