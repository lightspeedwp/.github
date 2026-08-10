/**
 * Label Management Utilities
 * Abstract label operations for GitHub issues with rate limiting and error handling
 * @module scripts/automation/includes/label-management.js
 */

import { Octokit } from "octokit";

const DEFAULT_OWNER = "lightspeedwp";
const DEFAULT_REPO = ".github";
const DEFAULT_RATE_LIMIT_MS = 100; // ms between API calls

/**
 * LabelManager provides abstracted label operations with rate limiting
 */
export class LabelManager {
  constructor(options = {}) {
    this.owner = options.owner || DEFAULT_OWNER;
    this.repo = options.repo || DEFAULT_REPO;
    this.token = options.token || process.env.GITHUB_TOKEN;
    this.rateLimitMs = options.rateLimitMs || DEFAULT_RATE_LIMIT_MS;
    this.verbose = options.verbose || false;

    if (!this.token) {
      throw new Error("GitHub token required (GITHUB_TOKEN env var)");
    }

    this.octokit = new Octokit({
      auth: this.token,
    });

    this.lastRequestTime = 0;
  }

  /**
   * Apply rate limiting between requests
   * @private
   */
  async rateLimit() {
    const elapsed = Date.now() - this.lastRequestTime;
    if (elapsed < this.rateLimitMs) {
      await new Promise((resolve) =>
        setTimeout(resolve, this.rateLimitMs - elapsed),
      );
    }
    this.lastRequestTime = Date.now();
  }

  /**
   * Add a label to an issue
   * @param {number} issueNumber - Issue number
   * @param {string} label - Label to add
   * @returns {Promise<boolean>} True if label was added
   */
  async addLabel(issueNumber, label) {
    try {
      await this.rateLimit();
      if (this.verbose) {
        console.log(`Adding label "${label}" to issue #${issueNumber}`);
      }

      await this.octokit.rest.issues.addLabels({
        owner: this.owner,
        repo: this.repo,
        issue_number: issueNumber,
        labels: [label],
      });

      return true;
    } catch (error) {
      if (this.verbose) {
        console.error(
          `Failed to add label to issue #${issueNumber}: ${error.message}`,
        );
      }
      throw error;
    }
  }

  /**
   * Remove a label from an issue
   * @param {number} issueNumber - Issue number
   * @param {string} label - Label to remove
   * @returns {Promise<boolean>} True if label was removed
   */
  async removeLabel(issueNumber, label) {
    try {
      await this.rateLimit();
      if (this.verbose) {
        console.log(`Removing label "${label}" from issue #${issueNumber}`);
      }

      await this.octokit.rest.issues.removeLabel({
        owner: this.owner,
        repo: this.repo,
        issue_number: issueNumber,
        name: label,
      });

      return true;
    } catch (error) {
      if (error.status === 404) {
        // Label doesn't exist on this issue
        return false;
      }
      if (this.verbose) {
        console.error(
          `Failed to remove label from issue #${issueNumber}: ${error.message}`,
        );
      }
      throw error;
    }
  }

  /**
   * Check if an issue has a specific label
   * @param {number} issueNumber - Issue number
   * @param {string} label - Label to check
   * @returns {Promise<boolean>} True if issue has label
   */
  async hasLabel(issueNumber, label) {
    try {
      await this.rateLimit();
      const response = await this.octokit.rest.issues.listLabelsOnIssue({
        owner: this.owner,
        repo: this.repo,
        issue_number: issueNumber,
      });

      return response.data.some((l) => l.name === label);
    } catch (error) {
      if (this.verbose) {
        console.error(
          `Failed to check label on issue #${issueNumber}: ${error.message}`,
        );
      }
      throw error;
    }
  }

  /**
   * Get all labels on an issue
   * @param {number} issueNumber - Issue number
   * @returns {Promise<string[]>} Array of label names
   */
  async getLabels(issueNumber) {
    try {
      await this.rateLimit();
      const response = await this.octokit.rest.issues.listLabelsOnIssue({
        owner: this.owner,
        repo: this.repo,
        issue_number: issueNumber,
      });

      return response.data.map((l) => l.name);
    } catch (error) {
      if (this.verbose) {
        console.error(
          `Failed to get labels for issue #${issueNumber}: ${error.message}`,
        );
      }
      throw error;
    }
  }

  /**
   * Sync labels on an issue to match expected set
   * Adds missing labels, removes extra labels
   * @param {number} issueNumber - Issue number
   * @param {string[]} expectedLabels - Expected label names
   * @returns {Promise<{added: string[], removed: string[]}>} Changes made
   */
  async syncLabels(issueNumber, expectedLabels) {
    const current = await this.getLabels(issueNumber);
    const added = [];
    const removed = [];

    // Add missing labels
    for (const label of expectedLabels) {
      if (!current.includes(label)) {
        await this.addLabel(issueNumber, label);
        added.push(label);
      }
    }

    // Remove extra labels
    for (const label of current) {
      if (!expectedLabels.includes(label)) {
        await this.removeLabel(issueNumber, label);
        removed.push(label);
      }
    }

    return { added, removed };
  }

  /**
   * Fetch all issues with a specific label (paginated)
   * @param {string} label - Label to search for
   * @param {object} options - Pagination options
   * @returns {Promise<object[]>} Array of issues
   */
  async fetchIssuesWithLabel(label, options = {}) {
    const { state = "open", limit = 100 } = options;
    const issues = [];
    let page = 1;

    try {
      while (issues.length < limit) {
        await this.rateLimit();
        if (this.verbose) {
          console.log(
            `Fetching issues with label "${label}" (page ${page}, limit ${limit})`,
          );
        }

        const response = await this.octokit.rest.issues.listForRepo({
          owner: this.owner,
          repo: this.repo,
          labels: label,
          state,
          per_page: 100,
          page,
        });

        if (response.data.length === 0) {
          break;
        }

        // Filter out PRs (issues.listForRepo returns both)
        const filterData = response.data.filter((item) => !item.pull_request);
        issues.push(...filterData);
        page++;

        if (response.data.length < 100) {
          break;
        }
      }

      return issues.slice(0, limit);
    } catch (error) {
      if (this.verbose) {
        console.error(
          `Failed to fetch issues with label "${label}": ${error.message}`,
        );
      }
      throw error;
    }
  }

  /**
   * Fetch all open issues (paginated)
   * @param {object} options - Query options
   * @returns {Promise<object[]>} Array of issues
   */
  async fetchAllIssues(options = {}) {
    const { state = "open", limit = 1000 } = options;
    const issues = [];
    let page = 1;

    try {
      while (issues.length < limit) {
        await this.rateLimit();
        if (this.verbose) {
          console.log(
            `Fetching all issues (page ${page}, total ${issues.length})`,
          );
        }

        const response = await this.octokit.rest.issues.listForRepo({
          owner: this.owner,
          repo: this.repo,
          state,
          per_page: 100,
          page,
        });

        if (response.data.length === 0) {
          break;
        }

        // Filter out PRs (issues.listForRepo returns both)
        const filterData = response.data.filter((item) => !item.pull_request);
        issues.push(...filterData);
        page++;

        if (response.data.length < 100) {
          break;
        }
      }

      return issues.slice(0, limit);
    } catch (error) {
      if (this.verbose) {
        console.error(`Failed to fetch all issues: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Get issue details by number
   * @param {number} issueNumber - Issue number
   * @returns {Promise<object>} Issue details
   */
  async getIssue(issueNumber) {
    try {
      await this.rateLimit();
      const response = await this.octokit.rest.issues.get({
        owner: this.owner,
        repo: this.repo,
        issue_number: issueNumber,
      });

      return response.data;
    } catch (error) {
      if (this.verbose) {
        console.error(`Failed to get issue #${issueNumber}: ${error.message}`);
      }
      throw error;
    }
  }
}

export default LabelManager;
