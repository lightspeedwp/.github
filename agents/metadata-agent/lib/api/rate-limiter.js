const RateLimitTracker = require("../rate-limit/rate-limit-tracker");

/**
 * Rate limit monitor for GitHub API.
 * Tracks core, GraphQL, and search rate limits independently.
 * Provides quota recovery estimation and threshold alerts.
 */

class RateLimiter extends RateLimitTracker {
  constructor(client) {
    if (!client) {
      throw new Error("Octokit client is required");
    }

    super();
    this.client = client;
  }

  /**
   * Update rate limit information from API
   * @returns {Promise<Object>} Updated rate limits
   */
  async updateRateLimits() {
    try {
      const response = await this.client.rateLimit.get();
      return this.updateFromRateLimitResponse(response.data);
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
  /**
   * Estimate quota recovery time (when we'll have quota available again)
   * @param {string} type - API type
   * @returns {number} Milliseconds until quota is available
   */
  async estimateQuotaRecovery(type = "core") {
    await this.updateRateLimits();
    return super.estimateQuotaRecovery(type, 1).recoveryInMs;
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
   * Reset all rate limits to defaults
   */
  resetLimits() {
    this.reset();
  }
}

module.exports = RateLimiter;
