/**
 * exclusion-patterns.js — Branch exclusion pattern matching.
 *
 * Implements regex-based branch exclusion to preserve branches
 * matching user-defined or default patterns.
 *
 * @module scripts/lib/exclusion-patterns
 */

const DEFAULT_EXCLUDE_PATTERN_OVERRIDE = /^(release\/|hotfix\/)/;

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

export function matchesExclusionPattern(branch, pattern) {
  if (!pattern) return false;
  return pattern.test(branch);
}

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
