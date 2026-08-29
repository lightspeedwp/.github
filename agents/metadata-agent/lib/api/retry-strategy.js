/**
 * Exponential backoff retry strategy with jitter for GitHub API resilience.
 * Handles rate limit errors, network errors, and transient failures.
 */

class RetryStrategy {
  constructor(config = {}) {
    this.maxRetries = config.maxRetries ?? 5;
    this.initialDelayMs = config.initialDelayMs ?? 1000;
    this.maxDelayMs = config.maxDelayMs ?? 60000;
    this.backoffFactor = config.backoffFactor ?? 2;
    this.jitterFactor = config.jitterFactor ?? 0.1;

    // Error codes that should trigger retry
    this.retryableErrors = new Set([
      408, // Request Timeout
      429, // Too Many Requests (Rate Limited)
      500, // Internal Server Error
      502, // Bad Gateway
      503, // Service Unavailable
      504, // Gateway Timeout
      "ECONNRESET",
      "ENOTFOUND",
      "ETIMEDOUT",
      "ECONNREFUSED",
    ]);
  }

  /**
   * Check if an error is retryable
   * @param {Error} error - The error object
   * @returns {boolean} True if error should trigger a retry
   */
  isRetryable(error) {
    if (!error) return false;

    // Check HTTP status code
    if (error.status) {
      return this.retryableErrors.has(error.status);
    }

    // Check error code
    if (error.code) {
      return this.retryableErrors.has(error.code);
    }

    // Check error message for rate limiting
    if (error.message) {
      return (
        error.message.includes("rate limit") ||
        error.message.includes("timeout") ||
        error.message.includes("too many requests")
      );
    }

    return false;
  }

  /**
   * Calculate delay with exponential backoff and jitter
   * @param {number} attemptNumber - Current attempt (0-indexed)
   * @returns {number} Delay in milliseconds
   */
  calculateDelay(attemptNumber) {
    if (attemptNumber < 0) {
      throw new Error("Attempt number must be non-negative");
    }

    // Exponential backoff: initialDelay * (backoffFactor ^ attemptNumber)
    let delay =
      this.initialDelayMs * Math.pow(this.backoffFactor, attemptNumber);

    // Cap at max delay
    delay = Math.min(delay, this.maxDelayMs);

    // Add jitter: delay * (1 ± jitterFactor * random)
    const jitter = delay * this.jitterFactor * (Math.random() - 0.5) * 2;
    delay = Math.round(delay + jitter);

    return Math.max(0, delay);
  }

  /**
   * Get retry delay from error if available (respects Retry-After header)
   * @param {Error} error - The error object
   * @param {number} attemptNumber - Current attempt (0-indexed)
   * @returns {number} Delay in milliseconds
   */
  getRetryDelay(error, attemptNumber) {
    // Check for explicit Retry-After header
    if (error.response?.headers?.["retry-after"]) {
      const retryAfter = error.response.headers["retry-after"];

      // Retry-After can be seconds or HTTP-date
      if (/^\d+$/.test(retryAfter)) {
        return parseInt(retryAfter) * 1000;
      }

      // Parse HTTP-date
      const retryDate = new Date(retryAfter);
      if (!isNaN(retryDate)) {
        return Math.max(0, retryDate - new Date());
      }
    }

    // Fall back to exponential backoff
    return this.calculateDelay(attemptNumber);
  }

  /**
   * Execute a function with automatic retries
   * @param {Function} fn - Async function to retry
   * @param {string} description - Description for logging
   * @returns {Promise<any>} Result of the function
   */
  async execute(fn, description = "Operation") {
    if (typeof fn !== "function") {
      throw new Error("First argument must be a function");
    }

    let lastError;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;

        if (attempt === this.maxRetries || !this.isRetryable(error)) {
          throw error;
        }

        const delay = this.getRetryDelay(error, attempt);
        console.warn(
          `${description} failed (attempt ${attempt + 1}/${this.maxRetries + 1}). ` +
            `Retrying in ${Math.round(delay / 1000)}s: ${error.message}`,
        );

        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    throw lastError;
  }

  /**
   * Validate configuration
   * @throws {Error} If configuration is invalid
   */
  validate() {
    if (this.maxRetries < 0) {
      throw new Error("maxRetries must be non-negative");
    }

    if (this.initialDelayMs < 0) {
      throw new Error("initialDelayMs must be non-negative");
    }

    if (this.maxDelayMs < this.initialDelayMs) {
      throw new Error("maxDelayMs must be >= initialDelayMs");
    }

    if (this.backoffFactor < 1) {
      throw new Error("backoffFactor must be >= 1");
    }

    if (this.jitterFactor < 0 || this.jitterFactor > 1) {
      throw new Error("jitterFactor must be between 0 and 1");
    }
  }

  /**
   * Get current configuration
   * @returns {Object} Configuration object
   */
  getConfig() {
    return {
      maxRetries: this.maxRetries,
      initialDelayMs: this.initialDelayMs,
      maxDelayMs: this.maxDelayMs,
      backoffFactor: this.backoffFactor,
      jitterFactor: this.jitterFactor,
    };
  }

  /**
   * Update configuration
   * @param {Object} config - New configuration values
   */
  updateConfig(config) {
    if (config.maxRetries !== undefined) this.maxRetries = config.maxRetries;
    if (config.initialDelayMs !== undefined) {
      this.initialDelayMs = config.initialDelayMs;
    }
    if (config.maxDelayMs !== undefined) this.maxDelayMs = config.maxDelayMs;
    if (config.backoffFactor !== undefined) {
      this.backoffFactor = config.backoffFactor;
    }
    if (config.jitterFactor !== undefined)
      this.jitterFactor = config.jitterFactor;

    this.validate();
  }
}

module.exports = RetryStrategy;
