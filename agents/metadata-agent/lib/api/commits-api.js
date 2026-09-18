/**
 * Retrieve repository commit metadata from the GitHub API.
 */
class CommitsAPI {
  /**
   * @param {object} client - Octokit client.
   * @param {object} [options] - Optional behaviour overrides.
   * @param {object|null} [options.retryStrategy] - Retry strategy with execute().
   * @param {Function|null} [options.fallbackHandler] - Fallback resolver callback.
   */
  constructor(client, options = {}) {
    if (!client?.repos) {
      throw new Error("Octokit client with repos scope is required");
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
          module: "commits",
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
   * List commits for a repository.
   *
   * @param {object} [options] - Query options.
   * @param {string} options.owner - Repository owner.
   * @param {string} options.repo - Repository name.
   * @param {string} [options.branch] - Branch or SHA reference.
   * @param {number} [options.perPage=30] - Number of commits to fetch.
   * @param {string} [options.since] - ISO date string lower bound.
   * @param {Array<object>} [options.fallback] - Fallback commit payload.
   * @returns {Promise<Array<object>>} Normalised commit metadata.
   */
  async getCommits(options = {}) {
    const {
      owner,
      repo,
      branch = undefined,
      perPage = 30,
      since = undefined,
      fallback = undefined,
    } = options;

    if (!owner || !repo) {
      throw new Error("owner and repo are required");
    }

    const response = await this._execute(
      () =>
        this.client.repos.listCommits({
          owner,
          repo,
          sha: branch,
          per_page: perPage,
          since,
        }),
      "fetch commits",
      fallback,
    );

    const commits = Array.isArray(response) ? response : response?.data || [];

    return commits.map((commit) => ({
      sha: commit.sha,
      message: commit.commit?.message || "",
      author: commit.author?.login || commit.commit?.author?.name || null,
      authorDate: commit.commit?.author?.date || null,
      url: commit.html_url,
    }));
  }

  /**
   * Fetch a single commit by SHA.
   *
   * @param {object} [options] - Query options.
   * @param {string} options.owner - Repository owner.
   * @param {string} options.repo - Repository name.
   * @param {string} options.sha - Commit SHA.
   * @param {object|null} [options.fallback] - Fallback commit payload.
   * @returns {Promise<object|null>} Normalised commit metadata.
   */
  async getCommit(options = {}) {
    const { owner, repo, sha, fallback = null } = options;

    if (!owner || !repo || !sha) {
      throw new Error("owner, repo, and sha are required");
    }

    const response = await this._execute(
      () => this.client.repos.getCommit({ owner, repo, ref: sha }),
      "fetch commit",
      fallback,
    );

    const commit = response?.data || response;
    if (commit === null) {
      return null;
    }

    return {
      sha: commit.sha,
      message: commit.commit?.message || "",
      author: commit.author?.login || commit.commit?.author?.name || null,
      authorDate: commit.commit?.author?.date || null,
      url: commit.html_url,
      parents: commit.parents?.map((parent) => parent.sha) || [],
    };
  }
}

module.exports = CommitsAPI;
