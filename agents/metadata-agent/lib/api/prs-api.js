/**
 * Retrieve pull request metadata from the GitHub API.
 */
class PRsAPI {
  /**
   * @param {object} client - Octokit client.
   * @param {object} [options] - Optional behaviour overrides.
   * @param {object|null} [options.retryStrategy] - Retry strategy with execute().
   * @param {Function|null} [options.fallbackHandler] - Fallback resolver callback.
   */
  constructor(client, options = {}) {
    if (!client?.pulls) {
      throw new Error("Octokit client with pulls scope is required");
    }

    this.client = client;
    this.retryStrategy = options.retryStrategy || null;
    this.fallbackHandler = options.fallbackHandler || null;
  }

  async _execute(requestFn, operation, fallbackValue) {
    try {
      if (this.retryStrategy?.execute) {
        return await this.retryStrategy.execute(requestFn, operation);
      }

      return await requestFn();
    } catch (error) {
      if (typeof this.fallbackHandler === "function") {
        const fallbackResult = await this.fallbackHandler({
          module: "prs",
          operation,
          error,
        });

        if (fallbackResult !== undefined) {
          return fallbackResult;
        }
      }

      if (fallbackValue !== undefined) {
        return fallbackValue;
      }

      throw new Error(`Failed to ${operation}: ${error.message}`, {
        cause: error,
      });
    }
  }

  /**
   * List pull requests for a repository.
   *
   * @param {object} [options] - Query options.
   * @param {string} options.owner - Repository owner.
   * @param {string} options.repo - Repository name.
   * @param {string} [options.state="open"] - Pull request state.
   * @param {number} [options.perPage=30] - Number of pull requests to fetch.
   * @param {string} [options.sort="updated"] - Sort field.
   * @param {string} [options.direction="desc"] - Sort direction.
   * @param {Array<object>} [options.fallback] - Fallback pull request payload.
   * @returns {Promise<Array<object>>} Normalised pull request metadata.
   */
  async getPullRequests(options = {}) {
    const {
      owner,
      repo,
      state = "open",
      perPage = 30,
      sort = "updated",
      direction = "desc",
      fallback = undefined,
    } = options;

    if (!owner || !repo) {
      throw new Error("owner and repo are required");
    }

    const response = await this._execute(
      () =>
        this.client.pulls.list({
          owner,
          repo,
          state,
          per_page: perPage,
          sort,
          direction,
        }),
      "fetch pull requests",
      fallback,
    );

    const pullRequests = Array.isArray(response)
      ? response
      : response?.data || [];

    return pullRequests.map((pr) => ({
      number: pr.number,
      title: pr.title,
      state: pr.state,
      author: pr.user?.login || null,
      mergedAt: pr.merged_at || null,
      url: pr.html_url,
    }));
  }

  /**
   * Fetch a single pull request by number.
   *
   * @param {object} [options] - Query options.
   * @param {string} options.owner - Repository owner.
   * @param {string} options.repo - Repository name.
   * @param {number} options.pullNumber - Pull request number.
   * @param {object|null} [options.fallback] - Fallback pull request payload.
   * @returns {Promise<object|null>} Normalised pull request metadata.
   */
  async getPullRequest(options = {}) {
    const { owner, repo, pullNumber, fallback = null } = options;

    if (!owner || !repo || !Number.isInteger(pullNumber) || pullNumber < 1) {
      throw new Error("owner, repo, and pullNumber are required");
    }

    const response = await this._execute(
      () => this.client.pulls.get({ owner, repo, pull_number: pullNumber }),
      "fetch pull request",
      fallback,
    );

    const pullRequest = response?.data || response;

    return {
      number: pullRequest.number,
      title: pullRequest.title,
      state: pullRequest.state,
      author: pullRequest.user?.login || null,
      merged: !!pullRequest.merged_at,
      url: pullRequest.html_url,
      headSha: pullRequest.head?.sha || null,
    };
  }
}

module.exports = PRsAPI;
