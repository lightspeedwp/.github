/**
 * age-calculator.js — Branch age calculation utilities.
 *
 * Calculates branch age in days based on last commit timestamp (ISO8601).
 *
 * @module scripts/lib/age-calculator
 */

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Measure elapsed 24-hour days since an ISO date, including fractional days.
 * Missing or invalid dates yield zero; future dates yield negative values.
 *
 * @param {string} isoDate - Last commit date.
 * @returns {number} Elapsed days.
 */
export function getAgeInDays(isoDate) {
  if (!isoDate) return 0;

  const then = new Date(isoDate);
  if (Number.isNaN(then.getTime())) return 0;

  return (Date.now() - then.getTime()) / MS_PER_DAY;
}

/**
 * Check whether an age meets the inclusive threshold in days.
 *
 * @param {number} ageInDays - Elapsed days, possibly fractional.
 * @param {number} thresholdDays - Minimum days; defaults to 30.
 * @returns {boolean} Whether the threshold is met.
 */
export function meetsAgeThreshold(ageInDays, thresholdDays = 30) {
  return ageInDays >= thresholdDays;
}

/**
 * Display an age rounded down to days, weeks, or 30-day months.
 * Ages under one day display as "< 1 day"; 28–29 days display as "0 months".
 *
 * @param {number} ageInDays - Elapsed days, possibly fractional.
 * @returns {string} Approximate human-readable age.
 */
export function formatAge(ageInDays) {
  const days = Math.floor(ageInDays);

  if (days < 1) return '< 1 day';
  if (days < 7) return `${days} day${days === 1 ? '' : 's'}`;

  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks} week${weeks === 1 ? '' : 's'}`;

  const months = Math.floor(days / 30);
  return `${months} month${months === 1 ? '' : 's'}`;
}
