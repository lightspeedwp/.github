/**
 * Error Handler Module
 *
 * Provides error catching, recovery strategies, and suggestions for
 * metadata agent operations. Helps users understand what went wrong
 * and suggests corrective actions.
 *
 * @module error-handler
 */

import pino from "pino";

/**
 * Logger instance for error handling operations
 * @type {pino.Logger}
 */
const logger = pino({
  name: "metadata-agent:error-handler",
  level: process.env.LOG_LEVEL || "info",
});

/**
 * Error type classifications
 * @type {Object}
 */
const ERROR_TYPES = {
  AUTHENTICATION: "authentication",
  AUTHORIZATION: "authorization",
  RATE_LIMIT: "rate_limit",
  NOT_FOUND: "not_found",
  VALIDATION: "validation",
  CONFLICT: "conflict",
  NETWORK: "network",
  UNKNOWN: "unknown",
};

/**
 * Catch and classify an error, suggesting recovery strategies
 *
 * Analyzes an error object and returns:
 * - Error type classification
 * - Human-readable message
 * - Suggested recovery actions
 * - Whether the error is retriable
 *
 * @param {Error|Object} error - The error to handle
 * @returns {Object} Error classification { type, message, recovery, retriable, code }
 *
 * @example
 * try {
 *   await api.getIssues();
 * } catch (error) {
 *   const handled = errorHandler.catch(error);
 *   console.log(`[${handled.type}] ${handled.message}`);
 *   console.log(`Recovery: ${handled.recovery}`);
 * }
 */
export function catchError(error) {
  if (!error) {
    return {
      type: ERROR_TYPES.UNKNOWN,
      message: "Unknown error occurred",
      recovery: "Check logs for details",
      retriable: false,
      code: null,
    };
  }

  // Determine error type
  let errorType = ERROR_TYPES.UNKNOWN;
  let retriable = false;
  let recovery = "Try again";

  // Check error status code first (for HTTP errors)
  if (error.status || error.statusCode) {
    const status = error.status || error.statusCode;

    if (status === 401) {
      errorType = ERROR_TYPES.AUTHENTICATION;
      recovery = "Check GITHUB_TOKEN environment variable";
    } else if (status === 403) {
      // Could be auth or rate limit
      if (error.message && error.message.includes("API rate limit")) {
        errorType = ERROR_TYPES.RATE_LIMIT;
        recovery = "Wait a few minutes before retrying";
        retriable = true;
      } else {
        errorType = ERROR_TYPES.AUTHORIZATION;
        recovery = "Check token has necessary scopes (repo, read:org)";
      }
    } else if (status === 404) {
      errorType = ERROR_TYPES.NOT_FOUND;
      recovery = "Verify repository and issue numbers are correct";
    } else if (status === 422) {
      errorType = ERROR_TYPES.VALIDATION;
      recovery = "Check label names are valid and issue exists";
    } else if (status === 409) {
      errorType = ERROR_TYPES.CONFLICT;
      recovery = "Issue state changed, refresh and try again";
      retriable = true;
    } else if (status >= 500) {
      recovery = "GitHub API is experiencing issues, try again later";
      retriable = true;
    }
  }

  // Check error message patterns
  const message = error.message || String(error);

  if (message.includes("ETIMEDOUT") || message.includes("ECONNRESET")) {
    errorType = ERROR_TYPES.NETWORK;
    recovery = "Check internet connection, try again";
    retriable = true;
  } else if (message.includes("rate limit")) {
    errorType = ERROR_TYPES.RATE_LIMIT;
    recovery = "Wait before retrying";
    retriable = true;
  } else if (message.includes("unauthorized") || message.includes("401")) {
    errorType = ERROR_TYPES.AUTHENTICATION;
    recovery = "Check GITHUB_TOKEN environment variable";
  } else if (message.includes("forbidden") || message.includes("403")) {
    errorType = ERROR_TYPES.AUTHORIZATION;
    recovery = "Check token scopes (repo, read:org)";
  } else if (message.includes("not found") || message.includes("404")) {
    errorType = ERROR_TYPES.NOT_FOUND;
    recovery = "Verify resource exists";
  } else if (message.includes("validation") || message.includes("invalid")) {
    errorType = ERROR_TYPES.VALIDATION;
    recovery = "Check input parameters are valid";
  }

  logger.warn(
    { type: errorType, code: error.status || error.code, message },
    "Error caught and classified",
  );

  return {
    type: errorType,
    message: message || "An unexpected error occurred",
    recovery,
    retriable,
    code: error.status || error.code || null,
    original: error,
  };
}

/**
 * Retry a function with exponential backoff and error handling
 *
 * Automatically retries on retriable errors (rate limits, timeouts, 5xx errors).
 * Does not retry on non-retriable errors (auth, validation, 4xx except 429).
 *
 * @async
 * @param {Function} fn - Async function to retry
 * @param {Object} options - Retry options
 * @param {number} [options.maxAttempts] - Maximum retry attempts (default: 3)
 * @param {number} [options.backoffMs] - Initial backoff time in ms (default: 1000)
 * @param {number} [options.maxBackoffMs] - Maximum backoff time (default: 60000)
 * @param {Function} [options.onRetry] - Callback called before each retry
 * @returns {Promise<any>} Result of the function
 * @throws {Error} If all retries exhausted or error is non-retriable
 *
 * @example
 * const result = await errorHandler.retry(
 *   () => api.getIssues({ owner, repo }),
 *   { maxAttempts: 5, backoffMs: 500 }
 * );
 */
export async function retry(fn, options = {}) {
  const {
    maxAttempts = 3,
    backoffMs = 1000,
    maxBackoffMs = 60000,
    onRetry = null,
  } = options;

  let lastError;
  let lastHandled;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      lastHandled = catchError(error);

      // Don't retry non-retriable errors
      if (!lastHandled.retriable) {
        logger.error(
          { type: lastHandled.type, attempt, message: lastHandled.message },
          "Non-retriable error, not retrying",
        );
        throw error;
      }

      // Don't wait after final attempt
      if (attempt >= maxAttempts) {
        break;
      }

      // Calculate backoff with exponential growth
      const waitMs = Math.min(
        backoffMs * Math.pow(2, attempt - 1),
        maxBackoffMs,
      );

      logger.warn(
        { attempt, maxAttempts, waitMs, type: lastHandled.type },
        "Retriable error, retrying",
      );

      // Call retry callback if provided
      if (onRetry) {
        onRetry({
          attempt,
          maxAttempts,
          waitMs,
          error: lastHandled,
        });
      }

      // Wait before retry
      await new Promise((resolve) => setTimeout(resolve, waitMs));
    }
  }

  // All retries exhausted
  logger.error(
    { maxAttempts, type: lastHandled?.type },
    "All retry attempts exhausted",
  );

  throw new Error(
    `Failed after ${maxAttempts} attempts: ${lastHandled?.message || lastError.message}`,
  );
}

/**
 * Suggest corrective actions for an error
 *
 * Provides structured suggestions for resolving an error, including:
 * - Immediate actions to try
 * - Information to check
 * - Who to contact if it persists
 *
 * @param {Error|Object} error - The error to get suggestions for
 * @returns {Object} Suggestions { actions, checks, escalation }
 *
 * @example
 * const error = new Error('API rate limit exceeded');
 * const suggestions = errorHandler.suggest(error);
 * console.log(suggestions.actions[0]); // "Wait 60 seconds..."
 */
export function suggest(error) {
  const handled = catchError(error);

  const suggestions = {
    type: handled.type,
    immediate: [],
    checks: [],
    escalation: null,
  };

  switch (handled.type) {
    case ERROR_TYPES.AUTHENTICATION:
      suggestions.immediate = [
        "Check GITHUB_TOKEN is set: echo $GITHUB_TOKEN",
        "Verify token is not empty or expired",
        "Regenerate token if needed at github.com/settings/tokens",
      ];
      suggestions.checks = [
        'Token has "repo" scope',
        'Token has "read:org" scope',
        "Token is not restricted to specific repos",
      ];
      suggestions.escalation = "Contact GitHub Support if token issues persist";
      break;

    case ERROR_TYPES.AUTHORIZATION:
      suggestions.immediate = [
        "Check token scopes: repo, read:org, write:discussion",
        "Verify account has access to the repository",
        "Check if organization requires SAML/SSO",
      ];
      suggestions.checks = [
        "GitHub user has collaborator/owner access",
        "Organization SAML is not blocking the token",
        "Repository is not archived or restricted",
      ];
      suggestions.escalation = "Contact repository admin or GitHub Support";
      break;

    case ERROR_TYPES.RATE_LIMIT:
      suggestions.immediate = [
        "Wait a few minutes before retrying",
        "Check rate limit: gh api rate_limit",
        "Use --delay flag to slow down batch operations",
      ];
      suggestions.checks = [
        "Verify not running multiple concurrent agents",
        "Check for webhook loops (issues triggering workflows)",
        "Consider using GraphQL for batch queries",
      ];
      suggestions.escalation = "Request higher rate limit from GitHub";
      break;

    case ERROR_TYPES.VALIDATION:
      suggestions.immediate = [
        "Check label names in error message",
        "Verify label exists: gh label list",
        "Ensure issue number is correct",
      ];
      suggestions.checks = [
        "Label family is correct (e.g., type:, status:)",
        "Label is spelled correctly",
        "Issue or PR exists and is not deleted",
      ];
      suggestions.escalation = "Create missing labels if needed";
      break;

    case ERROR_TYPES.NOT_FOUND:
      suggestions.immediate = [
        "Verify owner and repo: gh repo view <owner>/<repo>",
        "Check issue exists: gh issue view <number>",
        "Confirm you have access to view the repository",
      ];
      suggestions.checks = [
        "Repository name is correct",
        "Repository is not private (or you have access)",
        "Issue number is correct and not deleted",
      ];
      suggestions.escalation =
        "Check with team if repo was transferred/deleted";
      break;

    case ERROR_TYPES.NETWORK:
      suggestions.immediate = [
        "Check internet connection",
        "Try again in a few moments",
        "Check GitHub status: status.github.com",
      ];
      suggestions.checks = [
        "Network connectivity is stable",
        "No firewall/proxy blocking GitHub.com",
        "DNS resolution is working",
      ];
      suggestions.escalation = "Contact network admin if persistent";
      break;

    default:
      suggestions.immediate = [
        "Check logs for detailed error message",
        "Try the operation again",
        "Check GitHub status page",
      ];
      suggestions.checks = [
        "All required parameters are provided",
        "Input data is valid and complete",
        "GitHub API is operational",
      ];
      suggestions.escalation = "Review error logs and GitHub API documentation";
      break;
  }

  logger.info(
    { type: handled.type, actionCount: suggestions.immediate.length },
    "Suggestions generated",
  );

  return suggestions;
}

/**
 * Format an error for display to users
 *
 * Creates a clean, user-friendly error message with context and suggestions.
 *
 * @param {Error|Object} error - The error to format
 * @param {boolean} [includeStack] - Include stack trace (default: false)
 * @returns {string} Formatted error message
 *
 * @example
 * console.error(errorHandler.format(error));
 * // Output:
 * // [AUTHENTICATION ERROR]
 * // GitHub authentication failed: Invalid token
 * //
 * // Recovery: Check GITHUB_TOKEN environment variable
 */
export function format(error, includeStack = false) {
  const handled = catchError(error);
  const typeLabel = handled.type.toUpperCase().replace(/_/g, " ");

  let output = `[${typeLabel} ERROR]\n`;
  output += `${handled.message}\n\n`;
  output += `Recovery: ${handled.recovery}`;

  if (includeStack && handled.original && handled.original.stack) {
    output += `\n\nStack trace:\n${handled.original.stack}`;
  }

  return output;
}

/**
 * Error Handler export object
 * Provides all error handling functions in a single namespace
 *
 * @type {Object}
 * @exports error-handler
 */
export const errorHandler = {
  catch: catchError,
  retry,
  suggest,
  format,
  ERROR_TYPES,
};

export default errorHandler;
