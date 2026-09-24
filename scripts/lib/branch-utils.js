/**
 * branch-utils.js — Shared utility functions for branch operations.
 *
 * Pure utility functions with no side effects: branch type extraction,
 * date/age calculations, formatting, and storage estimation.
 *
 * @module scripts/lib/branch-utils
 */

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const AVG_STORAGE_BYTES_PER_COMMIT = 4096;

/**
 * Get the prefix before the first slash, or "other" for an unprefixed branch.
 *
 * @param {string} branch - Branch name.
 * @returns {string} Branch type.
 */
export function branchTypeOf(branch) {
  if (branch.includes('/')) {
    return branch.split('/')[0];
  }
  return 'other';
}

/**
 * Measure elapsed 24-hour days since a date, including fractional days.
 * Missing or invalid dates yield zero; future dates yield negative values.
 *
 * @param {string} isoDate - Last commit date.
 * @returns {number} Elapsed days.
 */
export function daysSince(isoDate) {
  if (!isoDate) return 0;
  const then = new Date(isoDate);
  if (Number.isNaN(then.getTime())) return 0;
  return (Date.now() - then.getTime()) / MS_PER_DAY;
}

/**
 * Format a byte count in B, KB, or MB using 1024-byte units.
 * Values at or above one MB remain in MB.
 *
 * @param {number} bytes - Byte count.
 * @returns {string} Formatted size.
 */
export function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(2)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(2)} MB`;
}

/**
 * Parse a base-10 integer, returning a fallback when parsing yields NaN.
 *
 * @param {*} value - Value to convert to a string and parse.
 * @param {number} fallback - Value for unparseable input.
 * @returns {number} Parsed integer or fallback.
 */
export function toInt(value, fallback = 0) {
  const parsed = parseInt(String(value).trim(), 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}

/**
 * Format a ratio as a percentage with two decimal places.
 * A zero denominator yields "0.00%".
 *
 * @param {number} numerator - Portion of the total.
 * @param {number} denominator - Total.
 * @returns {string} Formatted percentage.
 */
export function toPct(numerator, denominator) {
  if (denominator === 0) return '0.00%';
  return `${((numerator / denominator) * 100).toFixed(2)}%`;
}

/**
 * Estimate storage in bytes using 4096 bytes per commit.
 *
 * @param {number} commitCount - Number of commits.
 * @returns {number} Estimated bytes, not measured disk usage.
 */
export function estimateStorageFreedBytes(commitCount) {
  return commitCount * AVG_STORAGE_BYTES_PER_COMMIT;
}
