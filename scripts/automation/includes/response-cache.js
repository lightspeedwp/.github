/**
 * Response Cache with TTL Support
 *
 * Provides a unified caching layer for HTTP responses with TTL-based expiration.
 * Tracks cache hits/misses for performance metrics.
 *
 * Usage:
 *   const cache = new ResponseCache({ ttl: 300000 }); // 5 minutes
 *   cache.set('key', { data: 'value' });
 *   const cached = cache.get('key');
 */

export class ResponseCache {
  constructor(options = {}) {
    this.ttl = options.ttl || 5 * 60 * 1000; // 5 minutes default
    this.data = new Map();
    this.hits = 0;
    this.misses = 0;
  }

  /**
   * Generate cache key from parameters
   */
  static generateKey(...parts) {
    return parts.filter(Boolean).join(":");
  }

  /**
   * Store value in cache with timestamp
   */
  set(key, value) {
    this.data.set(key, {
      value,
      timestamp: Date.now(),
    });
  }

  /**
   * Retrieve value from cache if not expired
   */
  get(key) {
    const entry = this.data.get(key);

    if (!entry) {
      this.misses++;
      return null;
    }

    // Check TTL expiration
    if (Date.now() - entry.timestamp > this.ttl) {
      this.data.delete(key);
      this.misses++;
      return null;
    }

    this.hits++;
    return entry.value;
  }

  /**
   * Check if key exists and is valid
   */
  has(key) {
    return this.get(key) !== null;
  }

  /**
   * Delete specific key
   */
  delete(key) {
    return this.data.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear() {
    this.data.clear();
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const total = this.hits + this.misses;
    return {
      hits: this.hits,
      misses: this.misses,
      total,
      hitRate: total > 0 ? ((this.hits / total) * 100).toFixed(2) + "%" : "0%",
      size: this.data.size,
    };
  }

  /**
   * Bulk set multiple values
   */
  setMultiple(entries) {
    for (const [key, value] of Object.entries(entries)) {
      this.set(key, value);
    }
  }

  /**
   * Bulk get multiple values
   */
  getMultiple(keys) {
    return keys.reduce((acc, key) => {
      const value = this.get(key);
      if (value !== null) {
        acc[key] = value;
      }
      return acc;
    }, {});
  }

  /**
   * Reset statistics
   */
  resetStats() {
    this.hits = 0;
    this.misses = 0;
  }
}

export default ResponseCache;
