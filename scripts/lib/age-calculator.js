/**
 * age-calculator.js — Branch age calculation utilities.
 *
 * Calculates branch age in days based on last commit timestamp (ISO8601).
 *
 * @module scripts/lib/age-calculator
 */

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function getAgeInDays(isoDate) {
  if (!isoDate) return 0;

  const then = new Date(isoDate);
  if (Number.isNaN(then.getTime())) return 0;

  return (Date.now() - then.getTime()) / MS_PER_DAY;
}

export function meetsAgeThreshold(ageInDays, thresholdDays = 30) {
  return ageInDays >= thresholdDays;
}

export function formatAge(ageInDays) {
  const days = Math.floor(ageInDays);

  if (days < 1) return "< 1 day";
  if (days < 7) return `${days} day${days === 1 ? "" : "s"}`;

  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks} week${weeks === 1 ? "" : "s"}`;

  const months = Math.floor(days / 30);
  return `${months} month${months === 1 ? "" : "s"}`;
}
