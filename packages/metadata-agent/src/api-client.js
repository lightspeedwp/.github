/**
 * GitHub API Client Module
 *
 * Provides authenticated GitHub API access via Octokit for metadata agent operations:
 * - Fetching issues and pull requests
 * - Applying/removing labels
 * - Setting project field values
 * - Rate limit handling and automatic retry
 *
 * @module api-client
 */

import { Octokit } from '@octokit/rest';
import pino from 'pino';

/**
 * Logger instance for API client operations
 * @type {pino.Logger}
 */
const logger = pino({
  name: 'metadata-agent:api-client',
  level: process.env.LOG_LEVEL || 'info'
});

/**
 * Default rate limit wait time (milliseconds) when hitting GitHub API limits
 * @type {number}
 */
const DEFAULT_RATE_LIMIT_WAIT = 60000; // 1 minute

/**
 * Default maximum number of retry attempts for transient errors
 * @type {number}
 */
const DEFAULT_MAX_RETRIES = 3;

/**
 * GitHub API Client Class
 *
 * Wraps Octokit with additional functionality for:
 * - Error handling and retry logic
 * - Rate limit management
 * - Batch label operations
 * - Project field synchronization
 */
class GitHubAPIClient {
  /**
   * Initialize the GitHub API client
   *
   * @param {Object} options - Configuration options
   * @param {string} options.token - GitHub Personal Access Token (PAT) or OAuth token
   * @param {string} [options.baseUrl] - GitHub API base URL (for GHES compatibility)
   * @param {number} [options.maxRetries] - Maximum retry attempts (default: 3)
   * @param {number} [options.rateLimitWait] - Wait time on rate limit (default: 60000ms)
   */
  constructor(options = {}) {
    const {
      token,
      baseUrl = 'https://api.github.com',
      maxRetries = DEFAULT_MAX_RETRIES,
      rateLimitWait = DEFAULT_RATE_LIMIT_WAIT
    } = options;

    if (!token) {
      throw new Error('GitHub API token is required. Set GITHUB_TOKEN env var or pass token option.');
    }

    this.octokit = new Octokit({
      auth: token,
      baseUrl
    });

    this.maxRetries = maxRetries;
    this.rateLimitWait = rateLimitWait;
    this.rateLimitRemaining = null;
    this.rateLimitReset = null;

    logger.info({ baseUrl }, 'GitHub API client initialized');
  }

  /**
   * Authenticate with GitHub and verify token validity
   *
   * @async
   * @returns {Promise<Object>} User info object { login, name, email, type }
   * @throws {Error} If authentication fails
   *
   * @example
   * const client = new GitHubAPIClient({ token: process.env.GITHUB_TOKEN });
   * const user = await client.authenticate();
   * console.log(user.login); // 'octocat'
   */
  async authenticate() {
    try {
      const { data } = await this.octokit.users.getAuthenticated();
      logger.info({ user: data.login }, 'Authentication successful');
      return {
        login: data.login,
        name: data.name,
        email: data.email,
        type: data.type
      };
    } catch (error) {
      logger.error({ error: error.message }, 'Authentication failed');
      throw new Error(`GitHub authentication failed: ${error.message}`);
    }
  }

  /**
   * Fetch issues from a repository with optional filtering
   *
   * @async
   * @param {Object} options - Fetch options
   * @param {string} options.owner - Repository owner
   * @param {string} options.repo - Repository name
   * @param {string} [options.state] - Filter by state ('open', 'closed', 'all')
   * @param {string[]} [options.labels] - Filter by labels
   * @param {number} [options.per_page] - Items per page (max 100)
   * @param {number} [options.page] - Page number for pagination
   * @returns {Promise<Object[]>} Array of issue objects
   * @throws {Error} If the API request fails
   *
   * @example
   * const issues = await client.getIssues({
   *   owner: 'lightspeedwp',
   *   repo: '.github',
   *   state: 'open',
   *   labels: ['type:bug']
   * });
   */
  async getIssues(options = {}) {
    const {
      owner,
      repo,
      state = 'open',
      labels = [],
      per_page = 30,
      page = 1
    } = options;

    if (!owner || !repo) {
      throw new Error('owner and repo are required');
    }

    try {
      const { data } = await this.octokit.issues.listForRepo({
        owner,
        repo,
        state,
        labels: labels.join(','),
        per_page,
        page
      });

      logger.info({ owner, repo, count: data.length }, 'Fetched issues');
      return data.map(issue => ({
        number: issue.number,
        title: issue.title,
        state: issue.state,
        labels: issue.labels.map(l => l.name),
        url: issue.html_url,
        created_at: issue.created_at,
        updated_at: issue.updated_at,
        milestone: issue.milestone ? issue.milestone.title : null,
        isPR: !!issue.pull_request
      }));
    } catch (error) {
      logger.error({ error: error.message, owner, repo }, 'Failed to fetch issues');
      throw new Error(`Failed to fetch issues: ${error.message}`);
    }
  }

  /**
   * Apply labels to an issue or pull request
   *
   * @async
   * @param {Object} options - Apply options
   * @param {string} options.owner - Repository owner
   * @param {string} options.repo - Repository name
   * @param {number} options.issue_number - Issue or PR number
   * @param {string[]} options.labels - Label names to apply
   * @returns {Promise<Object>} Response with applied labels
   * @throws {Error} If the API request fails
   *
   * @example
   * await client.applyLabels({
   *   owner: 'lightspeedwp',
   *   repo: '.github',
   *   issue_number: 123,
   *   labels: ['type:bug', 'priority:high']
   * });
   */
  async applyLabels(options = {}) {
    const { owner, repo, issue_number, labels } = options;

    if (!owner || !repo || !issue_number || !labels) {
      throw new Error('owner, repo, issue_number, and labels are required');
    }

    try {
      const { data } = await this.octokit.issues.addLabels({
        owner,
        repo,
        issue_number,
        labels
      });

      logger.info(
        { owner, repo, issue_number, count: labels.length },
        'Applied labels'
      );

      return {
        success: true,
        issue_number,
        labels: data.map(l => l.name),
        count: labels.length
      };
    } catch (error) {
      logger.error(
        { error: error.message, owner, repo, issue_number },
        'Failed to apply labels'
      );
      throw new Error(`Failed to apply labels: ${error.message}`);
    }
  }

  /**
   * Remove labels from an issue or pull request
   *
   * @async
   * @param {Object} options - Remove options
   * @param {string} options.owner - Repository owner
   * @param {string} options.repo - Repository name
   * @param {number} options.issue_number - Issue or PR number
   * @param {string[]} options.labels - Label names to remove
   * @returns {Promise<Object>} Response with removed labels
   * @throws {Error} If the API request fails
   *
   * @example
   * await client.removeLabels({
   *   owner: 'lightspeedwp',
   *   repo: '.github',
   *   issue_number: 123,
   *   labels: ['status:in-progress']
   * });
   */
  async removeLabels(options = {}) {
    const { owner, repo, issue_number, labels } = options;

    if (!owner || !repo || !issue_number || !labels) {
      throw new Error('owner, repo, issue_number, and labels are required');
    }

    try {
      for (const label of labels) {
        await this.octokit.issues.removeLabel({
          owner,
          repo,
          issue_number,
          name: label
        });
      }

      logger.info(
        { owner, repo, issue_number, count: labels.length },
        'Removed labels'
      );

      return {
        success: true,
        issue_number,
        removed: labels,
        count: labels.length
      };
    } catch (error) {
      logger.error(
        { error: error.message, owner, repo, issue_number },
        'Failed to remove labels'
      );
      throw new Error(`Failed to remove labels: ${error.message}`);
    }
  }

  /**
   * Set project field values for an issue (GitHub Projects integration)
   *
   * @async
   * @param {Object} options - Set field options
   * @param {string} options.owner - Repository owner
   * @param {string} options.repo - Repository name
   * @param {number} options.issue_number - Issue number
   * @param {Object} options.fields - Field name → value mapping
   * @returns {Promise<Object>} Response with updated fields
   * @throws {Error} If the API request fails
   *
   * @example
   * await client.setProjectFields({
   *   owner: 'lightspeedwp',
   *   repo: '.github',
   *   issue_number: 123,
   *   fields: { Type: 'Bug', Status: 'In Progress', Priority: 'High' }
   * });
   */
  async setProjectFields(options = {}) {
    const { owner, repo, issue_number, fields } = options;

    if (!owner || !repo || !issue_number || !fields) {
      throw new Error('owner, repo, issue_number, and fields are required');
    }

    logger.info(
      { owner, repo, issue_number, fieldCount: Object.keys(fields).length },
      'Setting project fields (stub implementation)'
    );

    // Stub implementation: GitHub Projects v2 API requires project ID
    // Real implementation would query projects, find matching project,
    // then update field values via GraphQL
    return {
      success: true,
      issue_number,
      fields: Object.keys(fields),
      count: Object.keys(fields).length,
      note: 'Full implementation requires GitHub Projects v2 API setup'
    };
  }

  /**
   * Check rate limit status
   *
   * @async
   * @returns {Promise<Object>} Rate limit info { remaining, reset, limit }
   * @throws {Error} If the API request fails
   *
   * @example
   * const limits = await client.getRateLimit();
   * console.log(`Remaining: ${limits.remaining}/${limits.limit}`);
   */
  async getRateLimit() {
    try {
      const { data } = await this.octokit.rateLimit.get();
      const core = data.resources.core;

      this.rateLimitRemaining = core.remaining;
      this.rateLimitReset = core.reset;

      logger.info(
        { remaining: core.remaining, limit: core.limit, reset: core.reset },
        'Rate limit status'
      );

      return {
        remaining: core.remaining,
        limit: core.limit,
        reset: core.reset,
        resetTime: new Date(core.reset * 1000)
      };
    } catch (error) {
      logger.error({ error: error.message }, 'Failed to check rate limit');
      throw new Error(`Failed to check rate limit: ${error.message}`);
    }
  }

  /**
   * Handle rate limit by waiting and retrying
   *
   * If rate limit is hit, waits for the reset time (or a fallback wait period)
   * then allows retry.
   *
   * @async
   * @returns {Promise<void>} Resolves when it's safe to retry
   *
   * @example
   * try {
   *   // API call
   * } catch (error) {
   *   if (error.status === 403) {
   *     await client.handleRateLimit();
   *     // Retry the operation
   *   }
   * }
   */
  async handleRateLimit() {
    try {
      const limits = await this.getRateLimit();
      const now = Date.now();
      const resetTime = limits.resetTime.getTime();
      const waitMs = Math.max(0, resetTime - now + 1000); // Add 1s buffer

      logger.warn(
        { waitMs, resetTime: limits.resetTime },
        'Rate limit hit, waiting before retry'
      );

      await new Promise(resolve => setTimeout(resolve, waitMs));
    } catch (error) {
      // Fallback wait if rate limit check itself fails
      logger.warn({ waitMs: this.rateLimitWait }, 'Using fallback wait time');
      await new Promise(resolve => setTimeout(resolve, this.rateLimitWait));
    }
  }

  /**
   * Retry a function with exponential backoff on transient errors
   *
   * Automatically retries on:
   * - Network timeouts
   * - 5xx server errors
   * - Rate limit (429) errors
   *
   * Does not retry on 4xx client errors (except 429)
   *
   * @async
   * @param {Function} fn - Async function to retry
   * @param {Object} [options] - Retry options
   * @param {number} [options.maxAttempts] - Max retry attempts
   * @param {number} [options.backoffMs] - Initial backoff time (ms)
   * @returns {Promise<any>} Result of the function
   * @throws {Error} If all retries are exhausted
   *
   * @example
   * const result = await client.retry(
   *   () => client.getIssues({ owner: 'lightspeedwp', repo: '.github' }),
   *   { maxAttempts: 3, backoffMs: 1000 }
   * );
   */
  async retry(fn, options = {}) {
    const {
      maxAttempts = this.maxRetries,
      backoffMs = 1000
    } = options;

    let lastError;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;

        const isTransient = this._isTransientError(error);
        const isRateLimit = error.status === 429;

        if (!isTransient && !isRateLimit) {
          throw error; // Don't retry on permanent errors
        }

        if (attempt >= maxAttempts) {
          break; // Don't wait after final attempt
        }

        if (isRateLimit) {
          await this.handleRateLimit();
        } else {
          const waitTime = backoffMs * Math.pow(2, attempt - 1);
          logger.warn(
            { attempt, waitTime, error: error.message },
            'Transient error, retrying'
          );
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
      }
    }

    throw new Error(
      `Failed after ${maxAttempts} attempts: ${lastError.message}`
    );
  }

  /**
   * Check if an error is transient (retriable)
   *
   * @private
   * @param {Error} error - Error to check
   * @returns {boolean} True if the error is transient
   */
  _isTransientError(error) {
    // Network timeouts
    if (error.code === 'ETIMEDOUT' || error.code === 'ECONNRESET') {
      return true;
    }

    // 5xx server errors
    if (error.status && error.status >= 500) {
      return true;
    }

    // Rate limit errors
    if (error.status === 429) {
      return true;
    }

    return false;
  }
}

/**
 * Factory function to create an authenticated API client
 *
 * @param {Object} options - Client options (includes token)
 * @returns {GitHubAPIClient} Configured API client instance
 *
 * @example
 * const client = createClient({
 *   token: process.env.GITHUB_TOKEN
 * });
 */
export function createClient(options = {}) {
  return new GitHubAPIClient(options);
}

/**
 * Create client and authenticate in one step
 *
 * @async
 * @param {Object} options - Client options
 * @returns {Promise<GitHubAPIClient>} Authenticated client
 *
 * @example
 * const client = await authenticateClient({
 *   token: process.env.GITHUB_TOKEN
 * });
 * const user = await client.authenticate();
 */
export async function authenticateClient(options = {}) {
  const client = createClient(options);
  await client.authenticate();
  return client;
}

/**
 * API Client export object
 * Provides factory functions and the client class
 *
 * @type {Object}
 * @exports api-client
 */
export const apiClient = {
  createClient,
  authenticateClient,
  GitHubAPIClient
};

export default apiClient;
