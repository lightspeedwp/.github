#!/usr/bin/env node
/**
 * ============================================================================
 * Script Name: retry-helper.js
 * Location: .github/agents/includes/retry-helper.js
 * Description: Retry logic with exponential backoff for GitHub API calls
 * Version: v1.0.0
 * Author: LightSpeed WP Team
 * License: GPL v3 or later
 * ============================================================================
 */
// TODO: Align this helper with the latest automation spec updates.

const core = require("@actions/core");

/**
 * Default retry configuration
 */
const DEFAULT_CONFIG = {
  maxRetries: 3,
  initialDelayMs: 1000,
  maxDelayMs: 10000,
  backoffMultiplier: 2,
  retryableStatusCodes: [429, 500, 502, 503, 504],
  retryableErrors: ["ECONNRESET", "ETIMEDOUT", "ENOTFOUND", "EAI_AGAIN"],
};

/**
 * Determines if an error is retryable
 * @param {Error} error - The error to check
 * @param {Object} config - Retry configuration
 * @returns {boolean} True if the error is retryable
 */
function isRetryableError(error, config = DEFAULT_CONFIG) {
  // Handle null or invalid error
  if (!error || typeof error !== "object") {
    return false;
  }

  // Check for status codes (GitHub API errors)
  if (error.status && config.retryableStatusCodes.includes(error.status)) {
    return true;
  }

  // Check for network errors
  if (error.code && config.retryableErrors.includes(error.code)) {
    return true;
  }

  // Check for specific error messages
  if (error.message) {
    const message = error.message.toLowerCase();
    if (
      message.includes("rate limit") ||
      message.includes("timeout") ||
      message.includes("network") ||
      message.includes("econnreset") ||
      message.includes("socket hang up")
    ) {
      return true;
    }
  }

  return false;
}

/**
 * Calculates delay for next retry using exponential backoff
 * @param {number} attempt - Current attempt number (0-indexed)
 * @param {Object} config - Retry configuration
 * @returns {number} Delay in milliseconds
 */
function calculateDelay(attempt, config = DEFAULT_CONFIG) {
  const delay =
    config.initialDelayMs * Math.pow(config.backoffMultiplier, attempt);
  return Math.min(delay, config.maxDelayMs);
}

/**
 * Waits for the specified duration
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise<void>}
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Executes a function with retry logic and exponential backoff
 * @param {Function} fn - Async function to execute
 * @param {Object} options - Retry options
 * @param {number} options.maxRetries - Maximum number of retries (default: 3)
 * @param {number} options.initialDelayMs - Initial delay in ms (default: 1000)
 * @param {number} options.maxDelayMs - Maximum delay in ms (default: 10000)
 * @param {number} options.backoffMultiplier - Backoff multiplier (default: 2)
 * @param {number[]} options.retryableStatusCodes - HTTP status codes to retry
 * @param {string[]} options.retryableErrors - Error codes to retry
 * @param {string} options.operationName - Name of the operation (for logging)
 * @returns {Promise<*>} Result of the function
 * @throws {Error} If all retries are exhausted
 */
async function withRetry(fn, options = {}) {
  const config = { ...DEFAULT_CONFIG, ...options };
  const operationName = config.operationName || "operation";

  let lastError;

  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      const result = await fn();
      if (attempt > 0) {
        core.info(
          `[retry-helper] ${operationName} succeeded on attempt ${attempt + 1}`,
        );
      }
      return result;
    } catch (error) {
      lastError = error;

      // Check if this is the last attempt
      if (attempt === config.maxRetries) {
        core.error(
          `[retry-helper] ${operationName} failed after ${config.maxRetries + 1} attempts: ${error.message}`,
        );
        throw error;
      }

      // Check if error is retryable
      if (!isRetryableError(error, config)) {
        core.error(
          `[retry-helper] ${operationName} failed with non-retryable error: ${error.message}`,
        );
        throw error;
      }

      // Calculate delay and retry
      const delay = calculateDelay(attempt, config);
      core.warning(
        `[retry-helper] ${operationName} failed (attempt ${attempt + 1}/${config.maxRetries + 1}): ${error.message}. Retrying in ${delay}ms...`,
      );

      await sleep(delay);
    }
  }

  // This should never be reached, but included for completeness
  throw lastError;
}

/**
 * Wraps a GitHub API call with retry logic
 * @param {Function} apiCall - GitHub API call function
 * @param {string} operationName - Name of the API operation
 * @param {Object} retryOptions - Additional retry options
 * @returns {Promise<*>} API call result
 */
async function retryGitHubCall(apiCall, operationName, retryOptions = {}) {
  return withRetry(apiCall, {
    ...retryOptions,
    operationName: operationName || "GitHub API call",
  });
}

/**
 * Executes multiple operations with retry logic in sequence
 * @param {Array<{fn: Function, name: string}>} operations - Array of operations
 * @param {Object} retryOptions - Retry options applied to all operations
 * @returns {Promise<Array>} Array of results
 */
async function retrySequence(operations, retryOptions = {}) {
  const results = [];

  for (const operation of operations) {
    const result = await withRetry(operation.fn, {
      ...retryOptions,
      operationName: operation.name || "operation",
    });
    results.push(result);
  }

  return results;
}

/**
 * Executes multiple operations with retry logic in parallel
 * @param {Array<{fn: Function, name: string}>} operations - Array of operations
 * @param {Object} retryOptions - Retry options applied to all operations
 * @returns {Promise<Array>} Array of results
 */
async function retryParallel(operations, retryOptions = {}) {
  const promises = operations.map((operation) =>
    withRetry(operation.fn, {
      ...retryOptions,
      operationName: operation.name || "operation",
    }),
  );

  return Promise.all(promises);
}

/**
 * Creates a retry-enabled version of a function
 * @param {Function} fn - Function to wrap
 * @param {Object} defaultOptions - Default retry options
 * @returns {Function} Wrapped function with retry logic
 */
function createRetryable(fn, defaultOptions = {}) {
  return async (...args) => {
    return withRetry(() => fn(...args), defaultOptions);
  };
}

module.exports = {
  withRetry,
  retryGitHubCall,
  retrySequence,
  retryParallel,
  createRetryable,
  isRetryableError,
  calculateDelay,
  DEFAULT_CONFIG,
};
