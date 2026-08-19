/**
 * Skill: handle-pr-errors
 * Handles errors and provides recovery mechanisms for PR creation workflow
 *
 * Processes errors from any stage of PR creation and suggests recovery actions
 *
 * @param {Object} input - Input object
 * @param {Object} input.error - Error object with type, message, stage
 * @param {Object} input.context - Context from failed operation (skills output, inputs)
 * @param {Array} input.history - History of attempts (for retry logic)
 * @returns {Object} Error handling result with recovery suggestions
 */

export async function handlePrErrors(input) {
  const { error, context = {}, history = [] } = input;

  // Validate error input
  if (!error || typeof error !== "object") {
    return {
      handled: false,
      error: "Error object is required",
      recoveryOptions: [],
    };
  }

  try {
    // Categorize error
    const errorCategory = categorizeError(error);

    // Determine severity
    const severity = determineSeverity(errorCategory, error);

    // Get recovery options
    const recovery = getRecoveryOptions(errorCategory, error, context, history);

    // Build error report
    return {
      handled: true,
      errorCategory,
      severity,
      originalError: error.message,
      recoveryOptions: recovery.options,
      recommendedAction: recovery.recommended,
      nextSteps: recovery.nextSteps,
      retryable: recovery.retryable,
      retryCount: history.length,
      maxRetries: 3,
    };
  } catch (err) {
    return {
      handled: false,
      error: `Error handling failed: ${err.message}`,
      recoveryOptions: [],
    };
  }
}

/**
 * Categorize error by type
 */
function categorizeError(error) {
  const message = (error.message || "").toLowerCase();
  const type = (error.type || "").toLowerCase();

  // Input validation errors
  if (message.includes("required") || message.includes("missing")) {
    return "INPUT_VALIDATION";
  }

  // Conflict errors (check before generic branch check)
  if (message.includes("conflict") || message.includes("already")) {
    return "CONFLICT";
  }

  // Rate limit errors (check before GitHub API check)
  if (message.includes("rate limit")) return "RATE_LIMIT";

  // Authentication errors
  if (
    message.includes("authentication") ||
    message.includes("permission") ||
    message.includes("auth")
  ) {
    return "AUTHENTICATION_ERROR";
  }

  // GitHub API errors
  if (
    type === "github" ||
    message.includes("github") ||
    message.includes("api")
  ) {
    if (message.includes("branch")) return "BRANCH_NOT_FOUND";
    if (message.includes("exist")) return "RESOURCE_NOT_FOUND";
    return "GITHUB_API_ERROR";
  }

  // Template errors
  if (message.includes("template")) return "TEMPLATE_ERROR";

  // Branch name/not found errors
  if (message.includes("branch")) {
    if (message.includes("not found") || message.includes("nonexistent")) {
      return "BRANCH_NOT_FOUND";
    }
    return "BRANCH_NAME_ERROR";
  }

  // Label errors
  if (message.includes("label")) return "LABEL_ERROR";

  // Network errors
  if (message.includes("network") || message.includes("timeout")) {
    return "NETWORK_ERROR";
  }

  // Default
  return "UNKNOWN_ERROR";
}

/**
 * Determine error severity
 */
function determineSeverity(category, _error) {
  const severities = {
    INPUT_VALIDATION: "LOW",
    TEMPLATE_ERROR: "LOW",
    BRANCH_NAME_ERROR: "MEDIUM",
    LABEL_ERROR: "LOW",
    CONFLICT: "HIGH",
    BRANCH_NOT_FOUND: "HIGH",
    RESOURCE_NOT_FOUND: "HIGH",
    AUTHENTICATION_ERROR: "CRITICAL",
    RATE_LIMIT: "MEDIUM",
    GITHUB_API_ERROR: "HIGH",
    NETWORK_ERROR: "MEDIUM",
    UNKNOWN_ERROR: "MEDIUM",
  };

  return severities[category] || "MEDIUM";
}

/**
 * Get recovery options based on error category
 */
function getRecoveryOptions(category, error, context, history) {
  const options = [];
  let recommended;
  let nextSteps;
  let retryable;

  switch (category) {
    case "INPUT_VALIDATION":
      options.push(
        "Validate branch name format: {type}/{scope}-{short-title}",
        "Verify templateFile is a valid template",
        "Check that branchType is in allowed list",
        "Ensure all required fields are provided",
      );
      recommended = "Fix input validation errors and retry";
      retryable = true;
      nextSteps = [
        "1. Review error message for specific missing field",
        "2. Correct the invalid input",
        "3. Retry PR creation with corrected data",
      ];
      break;

    case "BRANCH_NAME_ERROR":
      options.push(
        "Rename branch to follow {type}/{scope}-{short-title} format",
        "Use lowercase letters and hyphens only",
        "Verify branch type is allowed (feat, fix, docs, etc.)",
        "Check that branch doesn't already exist",
      );
      recommended = "Rename the branch and try again";
      retryable = true;
      nextSteps = [
        "1. Verify current branch name format",
        "2. Rename with git branch -m old-name new-name",
        "3. Push new branch and retry PR creation",
      ];
      break;

    case "TEMPLATE_ERROR":
      options.push(
        "Verify template file exists in .github/PULL_REQUEST_TEMPLATE/",
        "Check template file syntax (YAML frontmatter, Markdown content)",
        "Use default template if custom template unavailable",
        "Build minimal PR from branch type",
      );
      recommended = "Fall back to default template and retry";
      retryable = true;
      nextSteps = [
        "1. Check if template file path is correct",
        "2. Use pr_feature.md or other default template",
        "3. Retry PR creation with valid template",
      ];
      break;

    case "CONFLICT":
      options.push(
        "Rebase branch onto latest develop",
        "Resolve merge conflicts locally",
        "Force-push if authorized (use carefully)",
        "Create PR from different base branch",
      );
      recommended = "Rebase branch and resolve conflicts";
      retryable = true;
      nextSteps = [
        "1. git fetch origin",
        "2. git rebase origin/develop",
        "3. Resolve any conflicts",
        "4. git push --force-with-lease",
        "5. Retry PR creation",
      ];
      break;

    case "AUTHENTICATION_ERROR":
      options.push(
        "Check GitHub token is valid",
        "Verify token has necessary permissions",
        "Re-authenticate with GitHub",
        "Check GitHub API endpoint",
      );
      recommended = "Verify GitHub authentication and retry";
      retryable = false;
      nextSteps = [
        "1. Check GITHUB_TOKEN environment variable",
        "2. Verify token scopes include: repo, read:user",
        "3. Generate new token if expired",
        "4. Retry PR creation",
      ];
      break;

    case "RATE_LIMIT":
      options.push(
        "Wait before retrying (60-300 seconds)",
        "Check rate limit status on GitHub API",
        "Batch multiple PRs if possible",
        "Contact GitHub support if rate limited excessively",
      );
      recommended = "Wait and retry after rate limit resets";
      retryable = true;
      nextSteps = [
        "1. Wait 60+ seconds for rate limit to reset",
        "2. Check GitHub rate limit status",
        "3. Retry PR creation",
      ];
      break;

    case "BRANCH_NOT_FOUND":
    case "RESOURCE_NOT_FOUND":
      options.push(
        "Verify branch exists locally and on remote",
        "Push branch to GitHub if not yet pushed",
        "Check base branch exists (usually develop)",
        "Verify repository access permissions",
      );
      recommended = "Ensure branch is pushed to GitHub and exists";
      retryable = true;
      nextSteps = [
        "1. Verify branch exists: git branch -a | grep branch-name",
        "2. Push if needed: git push -u origin branch-name",
        "3. Verify base branch exists on remote",
        "4. Retry PR creation",
      ];
      break;

    case "LABEL_ERROR":
      options.push(
        "Use labels from canonical set only",
        "Follow prefix:name format (type:feature, area:docs, etc.)",
        "Remove invalid labels from appliedLabels array",
        "Check against .github/labels.yml for valid labels",
      );
      recommended = "Use only canonical labels from allowed set";
      retryable = true;
      nextSteps = [
        "1. Verify all labels follow prefix:name format",
        "2. Check labels against canonical set in .github/labels.yml",
        "3. Remove any invalid labels",
        "4. Retry PR creation",
      ];
      break;

    case "NETWORK_ERROR":
      options.push(
        "Check network connectivity",
        "Retry after waiting (exponential backoff)",
        "Check GitHub API status",
        "Use VPN if GitHub is blocked",
      );
      recommended = "Wait and retry with exponential backoff";
      retryable = true;
      nextSteps = [
        "1. Verify internet connection is working",
        "2. Check GitHub API status page",
        "3. Wait 30-60 seconds",
        "4. Retry PR creation",
      ];
      break;

    default:
      options.push(
        "Review error message for specific issue",
        "Check PR object structure and all fields",
        "Verify GitHub context (owner, repo, token)",
        "Enable debug logging for more details",
      );
      recommended = "Investigate error details and fix underlying issue";
      retryable = history.length < 3; // Allow up to 3 retries
      nextSteps = [
        "1. Log complete error object for debugging",
        "2. Verify all inputs are valid",
        "3. Check GitHub API documentation",
        "4. Contact support if issue persists",
      ];
  }

  return {
    options,
    recommended,
    nextSteps,
    retryable: retryable && history.length < 3,
  };
}

/**
 * Determine if error is retryable
 */
function _isRetryable(category) {
  const nonRetryableErrors = ["AUTHENTICATION_ERROR", "CONFLICT"];
  return !nonRetryableErrors.includes(category);
}

/**
 * Build retry context
 */
function _buildRetryContext(error, _context, history) {
  return {
    previousAttempts: history.length,
    lastError: error.message,
    attemptTimestamps: history.map((h) => h.timestamp),
    backoffDelay: calculateBackoffDelay(history.length),
  };
}

/**
 * Calculate exponential backoff delay in milliseconds
 */
function calculateBackoffDelay(attemptCount) {
  return Math.min(10000, 1000 * Math.pow(2, attemptCount));
}

export default handlePrErrors;
