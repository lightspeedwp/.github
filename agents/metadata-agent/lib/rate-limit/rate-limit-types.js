/**
 * Canonical GitHub API rate limit types and defaults.
 */

const RATE_LIMIT_TYPES = Object.freeze({
  CORE: "core",
  GRAPHQL: "graphql",
  SEARCH: "search",
});

const DEFAULT_LIMITS = Object.freeze({
  [RATE_LIMIT_TYPES.CORE]: { limit: 5000, remaining: 5000, reset: null },
  [RATE_LIMIT_TYPES.GRAPHQL]: { limit: 5000, remaining: 5000, reset: null },
  [RATE_LIMIT_TYPES.SEARCH]: { limit: 30, remaining: 30, reset: null },
});

const DEFAULT_THRESHOLDS = Object.freeze({
  [RATE_LIMIT_TYPES.CORE]: 100,
  [RATE_LIMIT_TYPES.GRAPHQL]: 100,
  [RATE_LIMIT_TYPES.SEARCH]: 5,
});

function isValidRateLimitType(type) {
  return Object.values(RATE_LIMIT_TYPES).includes(type);
}

module.exports = {
  RATE_LIMIT_TYPES,
  DEFAULT_LIMITS,
  DEFAULT_THRESHOLDS,
  isValidRateLimitType,
};
