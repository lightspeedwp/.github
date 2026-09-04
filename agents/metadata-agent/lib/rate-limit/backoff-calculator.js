const { RATE_LIMIT_TYPES } = require("./rate-limit-types");

/**
 * Calculates adaptive retry delays with exponential backoff and jitter.
 */
class BackoffCalculator {
  constructor(config = {}) {
    this.initialDelayMs = config.initialDelayMs ?? 1000;
    this.maxDelayMs = config.maxDelayMs ?? 60000;
    this.backoffFactor = config.backoffFactor ?? 2;
    this.jitterFactor = config.jitterFactor ?? 0.1;
    this.rateLimitMultipliers = {
      core: config.coreMultiplier ?? 1.5,
      graphql: config.graphqlMultiplier ?? 2,
      search: config.searchMultiplier ?? 3,
    };
  }

  calculateExponentialDelay(attemptNumber) {
    if (!Number.isFinite(attemptNumber) || attemptNumber < 0) {
      throw new Error("Attempt number must be non-negative");
    }

    return Math.min(
      this.initialDelayMs * Math.pow(this.backoffFactor, attemptNumber),
      this.maxDelayMs,
    );
  }

  applyJitter(delayMs) {
    if (!Number.isFinite(delayMs) || delayMs < 0) {
      throw new Error("Delay must be non-negative");
    }

    if (this.jitterFactor === 0) {
      return Math.round(delayMs);
    }

    const randomValue = Math.max(Number.EPSILON, Math.random());
    const jitter = delayMs * this.jitterFactor * (randomValue * 2 - 1);
    return Math.max(0, Math.round(delayMs + jitter));
  }

  getRetryAfterDelayMs(error) {
    const retryAfter = error?.response?.headers?.["retry-after"];
    if (!retryAfter) {
      return null;
    }

    if (/^\d+$/.test(retryAfter)) {
      return parseInt(retryAfter, 10) * 1000;
    }

    const retryDate = new Date(retryAfter);
    if (Number.isNaN(retryDate.getTime())) {
      return null;
    }

    return Math.max(0, retryDate.getTime() - Date.now());
  }

  calculateDelay({
    attemptNumber,
    error = null,
    rateLimitType = RATE_LIMIT_TYPES.CORE,
    quotaRemainingPercent = null,
  }) {
    const retryAfterDelay = this.getRetryAfterDelayMs(error);
    if (retryAfterDelay !== null) {
      return Math.min(retryAfterDelay, this.maxDelayMs);
    }

    let delay = this.calculateExponentialDelay(attemptNumber);

    if (
      error?.status === 429 ||
      error?.message?.toLowerCase().includes("rate limit")
    ) {
      const multiplier = this.rateLimitMultipliers[rateLimitType] || 1;
      delay *= multiplier;

      if (Number.isFinite(quotaRemainingPercent)) {
        const pressure = Math.max(0, 100 - quotaRemainingPercent) / 100;
        delay *= 1 + pressure;
      }
    }

    delay = Math.min(delay, this.maxDelayMs);
    if (delay === this.maxDelayMs) {
      return this.maxDelayMs;
    }

    return this.applyJitter(delay);
  }
}

module.exports = BackoffCalculator;
