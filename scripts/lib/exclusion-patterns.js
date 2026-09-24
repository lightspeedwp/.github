/**
 * exclusion-patterns.js — Branch exclusion pattern matching.
 *
 * Implements regex-based branch exclusion to preserve branches
 * matching user-defined or default patterns.
 *
 * @module scripts/lib/exclusion-patterns
 */

const DEFAULT_EXCLUDE_PATTERN_OVERRIDE = /^(release\/|hotfix\/)/;

/**
 * Combine the default release/hotfix exclusions with user-supplied regexes.
 * User patterns are separated by pipes or commas; invalid regexes warn and
 * fall back to the default pattern alone.
 *
 * @param {string} userPatterns - Optional regex alternatives.
 * @returns {RegExp} Pattern for matching branch names.
 */
export function buildExclusionRegex(userPatterns = '') {
  const parts = [DEFAULT_EXCLUDE_PATTERN_OVERRIDE.source];

  if (userPatterns && userPatterns.trim()) {
    const userParts = userPatterns
      .split(/[|,]/)
      .map((p) => p.trim())
      .filter(Boolean);

    parts.push(...userParts);
  }

  const source = `(${parts.join('|')})`;
  try {
    return new RegExp(source);
  } catch (err) {
    console.warn(`⚠️  Invalid exclusion patterns regex: ${err.message}. Using defaults.`);
    return DEFAULT_EXCLUDE_PATTERN_OVERRIDE;
  }
}

/**
 * Test a branch against an exclusion regex; a missing regex matches nothing.
 *
 * @param {string} branch - Branch name.
 * @param {RegExp|null} pattern - Exclusion pattern.
 * @returns {boolean} Whether the branch matches.
 */
export function matchesExclusionPattern(branch, pattern) {
  if (!pattern) return false;
  return pattern.test(branch);
}

/**
 * Partition branches by exclusion pattern, preserving their original order.
 * Missing branches produce empty groups; a missing pattern excludes none.
 *
 * @param {string[]} branches - Branch names to partition.
 * @param {RegExp|null} pattern - Exclusion pattern.
 * @returns {{excluded: string[], included: string[]}} Partitioned names.
 */
export function filterByExclusionPattern(branches, pattern) {
  const excluded = [];
  const included = [];

  for (const branch of branches || []) {
    if (matchesExclusionPattern(branch, pattern)) {
      excluded.push(branch);
    } else {
      included.push(branch);
    }
  }

  return { excluded, included };
}
