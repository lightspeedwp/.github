const DEFAULT_CACHE_CONFIG = {
  ttlMs: 5 * 60 * 1000,
  maxEntries: 1000,
  evictionPolicy: "lru",
};

const SUPPORTED_EVICTION_POLICIES = new Set(["lru"]);

function isPositiveInteger(value) {
  return Number.isInteger(value) && value > 0;
}

/**
 * Normalise and validate cache configuration.
 *
 * @param {Object} config - Partial cache configuration.
 * @returns {Object} Validated configuration.
 */
function resolveCacheConfig(config = {}) {
  const resolved = {
    ...DEFAULT_CACHE_CONFIG,
    ...config,
  };

  if (!isPositiveInteger(resolved.ttlMs)) {
    throw new Error("ttlMs must be a positive integer");
  }

  if (!isPositiveInteger(resolved.maxEntries)) {
    throw new Error("maxEntries must be a positive integer");
  }

  if (!SUPPORTED_EVICTION_POLICIES.has(resolved.evictionPolicy)) {
    throw new Error("evictionPolicy must be one of: lru");
  }

  return resolved;
}

module.exports = {
  DEFAULT_CACHE_CONFIG,
  SUPPORTED_EVICTION_POLICIES,
  resolveCacheConfig,
};
