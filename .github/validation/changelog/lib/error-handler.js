class ValidationError extends Error {
  constructor(message, code, context = {}) {
    super(message);
    this.name = 'ValidationError';
    this.code = code;
    this.context = context;
    this.timestamp = new Date().toISOString();
  }

  toJSON() {
    return {
      error: this.message,
      error_code: this.code,
      context: this.context,
      timestamp: this.timestamp,
    };
  }
}

class ErrorHandler {
  static handleFileNotFound(filePath) {
    return new ValidationError(`File not found at ${filePath}`, 'FILE_NOT_FOUND', { filePath });
  }

  static handleParsingError(message, line = null) {
    return new ValidationError(
      `Parsing error: ${message}${line ? ` (line ${line})` : ''}`,
      'PARSE_ERROR',
      { message, line }
    );
  }

  static handleValidationTimeout() {
    return new ValidationError(
      'Validation exceeded maximum time limit of 10 seconds',
      'VALIDATION_TIMEOUT',
      { maxSeconds: 10 }
    );
  }

  static handleGitHubAPIError(statusCode, message) {
    return new ValidationError(`GitHub API error: ${statusCode} - ${message}`, 'GITHUB_API_ERROR', {
      statusCode,
      message,
    });
  }

  static handleRateLimitExceeded(resetTime) {
    return new ValidationError(
      `GitHub API rate limit exceeded. Resets at ${resetTime}`,
      'RATE_LIMIT_EXCEEDED',
      { resetTime }
    );
  }

  static handleConfigError(message, configPath = null) {
    return new ValidationError(
      `Configuration error: ${message}${configPath ? ` in ${configPath}` : ''}`,
      'CONFIG_ERROR',
      { message, configPath }
    );
  }

  static handleMissingEnvironmentVariable(varName) {
    return new ValidationError(
      `Required environment variable missing: ${varName}`,
      'MISSING_ENV_VAR',
      { varName }
    );
  }

  static handleInvalidEntry(entryId, reason) {
    return new ValidationError(`Invalid entry ${entryId}: ${reason}`, 'INVALID_ENTRY', {
      entryId,
      reason,
    });
  }

  static async withRetry(fn, options = {}) {
    const maxAttempts = options.maxAttempts || 3;
    const delayMs = options.initialDelayMs || 1000;
    const backoffMultiplier = options.backoffMultiplier || 2;
    const maxDelayMs = options.maxDelayMs || 30000;

    let lastError;
    let currentDelay = delayMs;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;

        if (attempt < maxAttempts) {
          await ErrorHandler.delay(Math.min(currentDelay, maxDelayMs));
          currentDelay *= backoffMultiplier;
        }
      }
    }

    throw lastError;
  }

  static delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  static async withTimeout(promise, timeoutMs) {
    return Promise.race([
      promise,
      new Promise((_, reject) =>
        setTimeout(() => reject(ErrorHandler.handleValidationTimeout()), timeoutMs)
      ),
    ]);
  }

  static formatError(error, outputFormat = 'text') {
    if (outputFormat === 'json') {
      if (error instanceof ValidationError) {
        return JSON.stringify(error.toJSON(), null, 2);
      }

      return JSON.stringify(
        {
          error: error.message || 'Unknown error',
          error_code: 'UNKNOWN_ERROR',
          timestamp: new Date().toISOString(),
        },
        null,
        2
      );
    }

    if (error instanceof ValidationError) {
      return `${error.name} [${error.code}]: ${error.message}`;
    }

    return `Error: ${error.message || String(error)}`;
  }

  static getRecoverySteps(error) {
    const steps = [];

    if (error instanceof ValidationError) {
      switch (error.code) {
        case 'FILE_NOT_FOUND':
          steps.push('1. Verify CHANGELOG.md exists in the repository root');
          steps.push('2. Run git status to confirm file is tracked');
          steps.push('3. Check file permissions');
          break;

        case 'PARSE_ERROR':
          steps.push('1. Verify CHANGELOG.md follows Keep a Changelog 1.1.0 format');
          steps.push('2. Check for syntax errors near the line mentioned in the error');
          steps.push('3. Ensure [Unreleased] section header is properly formatted');
          break;

        case 'GITHUB_API_ERROR':
          steps.push('1. Check GitHub API status at https://www.githubstatus.com');
          steps.push('2. Verify GITHUB_TOKEN is valid and not expired');
          steps.push('3. Check network connectivity');
          break;

        case 'RATE_LIMIT_EXCEEDED':
          steps.push('1. Wait for the rate limit to reset');
          steps.push('2. Use cached link validation results if available');
          steps.push('3. Reduce concurrent validation runs');
          break;

        case 'VALIDATION_TIMEOUT':
          steps.push('1. Check system performance and available memory');
          steps.push('2. Reduce the number of changelog entries to validate');
          steps.push('3. Run validation locally to debug performance');
          break;

        case 'MISSING_ENV_VAR':
          steps.push(`1. Set the missing environment variable: ${error.context.varName}`);
          steps.push('2. Check CI/CD configuration for variable definition');
          steps.push('3. Verify secrets are properly configured');
          break;

        case 'CONFIG_ERROR':
          steps.push('1. Check configuration file syntax (YAML/JSON)');
          steps.push('2. Verify all required configuration keys are present');
          steps.push('3. Review configuration against schema');
          break;

        default:
          steps.push('1. Review error message for specific details');
          steps.push('2. Check logs for additional context');
          steps.push('3. Contact support if issue persists');
      }
    } else {
      steps.push('1. Check error message for details');
      steps.push('2. Review application logs');
      steps.push('3. Retry the operation');
    }

    return steps;
  }

  static logError(error, context = {}) {
    const timestamp = new Date().toISOString();
    const errorInfo = {
      timestamp,
      error: error instanceof ValidationError ? error.code : 'UNKNOWN',
      message: error.message,
      context,
    };

    console.error(JSON.stringify(errorInfo));

    return errorInfo;
  }

  static createErrorReport(error, context = {}) {
    const report = {
      error: {
        type: error instanceof ValidationError ? error.code : 'UNKNOWN_ERROR',
        message: error.message,
        timestamp: new Date().toISOString(),
      },
      context,
      recovery_steps: ErrorHandler.getRecoverySteps(error),
    };

    if (error instanceof ValidationError) {
      report.error.details = error.context;
    }

    if (process.env.DEBUG) {
      report.error.stack = error.stack;
    }

    return report;
  }
}

export { ValidationError, ErrorHandler };
export default ErrorHandler;
