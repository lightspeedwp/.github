/**
 * LabelingRuleCache — Performance optimization for label rule evaluation
 * Caches rule evaluation results to avoid redundant processing on high-volume issues
 * @module scripts/agents/includes/labeling-cache.js
 */

/**
 * Cache for labeling rule evaluation results
 * Prevents redundant rule evaluation on repeated patterns
 */
class LabelingRuleCache {
  constructor(maxSize = 1000) {
    this.cache = new Map();
    this.maxSize = maxSize;
    this.hits = 0;
    this.misses = 0;
  }

  /**
   * Evaluate a rule against an issue with caching
   * @param {Object} issue - Issue object with number, title, body, labels
   * @param {Object} rule - Rule with id and evaluate method
   * @returns {boolean} Result of rule evaluation
   */
  evaluateWithCache(issue, rule) {
    const cacheKey = this._getCacheKey(issue, rule);

    if (this.cache.has(cacheKey)) {
      this.hits += 1;
      return this.cache.get(cacheKey);
    }

    this.misses += 1;
    const result = rule.evaluate(issue);

    // Implement simple LRU eviction if cache grows too large
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(cacheKey, result);
    return result;
  }

  /**
   * Get cache statistics
   * @returns {Object} Hit rate and cache size statistics
   */
  getStats() {
    const total = this.hits + this.misses;
    return {
      hits: this.hits,
      misses: this.misses,
      hitRate: total > 0 ? ((this.hits / total) * 100).toFixed(2) + "%" : "N/A",
      cacheSize: this.cache.size,
      maxSize: this.maxSize,
    };
  }

  /**
   * Clear all cached entries
   */
  clear() {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
  }

  /**
   * Generate cache key from issue and rule
   * @private
   */
  _getCacheKey(issue, rule) {
    return `${issue.number}:${rule.id}`;
  }
}

module.exports = {
  LabelingRuleCache,
};
