/**
 * Rate limit monitor for GitHub API.
 * Tracks core, GraphQL, and search rate limits independently.
 * Provides quota recovery estimation and threshold alerts.
 */

class RateLimiter {
  constructor(client) {
    if (!client) {
      throw new Error("Octokit client is required");
    }

    this.client = client;
    this.limits = {
      core: { limit: 5000, remaining: 5000, reset: null },
      graphql: { limit: 5000, remaining: 5000, reset: null },
      search: { limit: 30, remaining: 30, reset: null },
    };

    this.thresholds = {
      core: 100, // Alert at 100 requests remaining
      graphql: 100,
      search: 5, // Alert at 5 searches remaining
    };

    this.lastUpdate = null;
  }

  /**
   * Update rate limit information from API
   * @returns {Promise<Object>} Updated rate limits
   */
  async updateRateLimits() {
    try {
      const response = await this.client.rateLimit.get();
      const { rate_limit: rateLimit, resources } = response.data;

      // Update core limit
      this.limits.core = {
        limit: rateLimit.limit,
        remaining: rateLimit.remaining,
        reset: new Date(rateLimit.reset * 1000),
      };

      // Update GraphQL limit
      if (resources.graphql) {
        this.limits.graphql = {
          limit: resources.graphql.limit,
          remaining: resources.graphql.remaining,
          reset: new Date(resources.graphql.reset * 1000),
        };
      }

      // Update search limit
      if (resources.search) {
        this.limits.search = {
          limit: resources.search.limit,
          remaining: resources.search.remaining,
          reset: new Date(resources.search.reset * 1000),
        };
      }

      this.lastUpdate = new Date();
      return this.limits;
    } catch (error) {
      throw new Error(`Failed to update rate limits: ${error.message}`, {
        cause: error,
      });
    }
  }

  /**
   * Get current rate limit for a specific API type
   * @param {string} type - API type: 'core', 'graphql', or 'search'
   * @returns {Object} Rate limit information
   */
  getLimit(type = "core") {
    if (!this.limits[type]) {
      throw new Error(`Unknown rate limit type: ${type}`);
    }
    return { ...this.limits[type] };
  }

  /**
   * Get all rate limits
   * @returns {Object} All rate limits
   */
  getAllLimits() {
    return {
      core: { ...this.limits.core },
      graphql: { ...this.limits.graphql },
      search: { ...this.limits.search },
    };
  }

  /**
   * Check if rate limit is below threshold
   * @param {string} type - API type
   * @returns {boolean} True if below threshold
   */
  isBelowThreshold(type = "core") {
    const limit = this.getLimit(type);
    return limit.remaining <= this.thresholds[type];
  }

  /**
   * Get time until rate limit reset for a specific type
   * @param {string} type - API type
   * @returns {number} Milliseconds until reset
   */
  getTimeUntilReset(type = "core") {
    const limit = this.getLimit(type);
    if (!limit.reset) return 0;
    return Math.max(0, limit.reset - new Date());
  }

  /**
   * Estimate quota recovery time (when we'll have quota available again)
   * @param {string} type - API type
   * @returns {number} Milliseconds until quota is available
   */
  async estimateQuotaRecovery(type = "core") {
    await this.updateRateLimits();

    const limit = this.getLimit(type);

    // If we have quota, return immediately
    if (limit.remaining > 0) {
      return 0;
    }

    // Otherwise, return time until reset
    return this.getTimeUntilReset(type);
  }

  /**
   * Get percentage of quota remaining
   * @param {string} type - API type
   * @returns {number} Percentage (0-100)
   */
  getPercentageRemaining(type = "core") {
    const limit = this.getLimit(type);
    if (limit.limit === 0) return 0;
    return Math.round((limit.remaining / limit.limit) * 100);
  }

  /**
   * Check if any rate limit is exhausted
   * @returns {Promise<boolean>} True if any quota is exhausted
   */
  async isAnyExhausted() {
    await this.updateRateLimits();

    return (
      this.limits.core.remaining <= 0 ||
      this.limits.graphql.remaining <= 0 ||
      this.limits.search.remaining <= 0
    );
  }

  /**
   * Get a summary of all rate limits
   * @returns {Object} Summary with percentages and reset times
   */
  async getSummary() {
    await this.updateRateLimits();

    return {
      core: {
        remaining: this.limits.core.remaining,
        limit: this.limits.core.limit,
        percentage: this.getPercentageRemaining("core"),
        reset: this.limits.core.reset,
        resetIn: this.getTimeUntilReset("core"),
      },
      graphql: {
        remaining: this.limits.graphql.remaining,
        limit: this.limits.graphql.limit,
        percentage: this.getPercentageRemaining("graphql"),
        reset: this.limits.graphql.reset,
        resetIn: this.getTimeUntilReset("graphql"),
      },
      search: {
        remaining: this.limits.search.remaining,
        limit: this.limits.search.limit,
        percentage: this.getPercentageRemaining("search"),
        reset: this.limits.search.reset,
        resetIn: this.getTimeUntilReset("search"),
      },
      lastUpdate: this.lastUpdate,
    };
  }

  /**
   * Set custom threshold for a rate limit type
   * @param {string} type - API type
   * @param {number} threshold - Threshold value
   */
  setThreshold(type, threshold) {
    if (!this.thresholds[type]) {
      throw new Error(`Unknown rate limit type: ${type}`);
    }
    if (threshold < 0) {
      throw new Error("Threshold must be non-negative");
    }
    this.thresholds[type] = threshold;
  }

  /**
   * Reset all rate limits to defaults
   */
  resetLimits() {
    this.limits = {
      core: { limit: 5000, remaining: 5000, reset: null },
      graphql: { limit: 5000, remaining: 5000, reset: null },
      search: { limit: 30, remaining: 30, reset: null },
    };
    this.lastUpdate = null;
  }
}

module.exports = RateLimiter;
