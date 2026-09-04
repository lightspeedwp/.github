/**
 * Retrieve commit-author metadata from the GitHub API.
 */
class AuthorsAPI {
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
          module: "authors",
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
   * Aggregate commit authors from repository history.
   *
   * @param {object} [options] - Query options.
   * @param {string} options.owner - Repository owner.
   * @param {string} options.repo - Repository name.
   * @param {string} [options.branch] - Branch or SHA reference.
   * @param {number} [options.perPage=100] - Number of commits to inspect.
   * @param {Array<object>} [options.fallback] - Fallback commit or author payload.
   * @returns {Promise<Array<object>>} Author summaries sorted by commit count.
   */
  async getAuthorsFromCommits(options = {}) {
    const {
      owner,
      repo,
      branch = undefined,
      perPage = 100,
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
        }),
      "fetch author metadata",
      fallback,
    );

    const commits = Array.isArray(response) ? response : response?.data || [];

    if (
      commits.every(
        (item) =>
          typeof item === "object" &&
          item !== null &&
          typeof item.commits === "number" &&
          typeof item.id === "string",
      )
    ) {
      return commits;
    }

    const authorMap = new Map();

    for (const commit of commits) {
      const login = commit.author?.login || null;
      const name = commit.commit?.author?.name || null;
      const email = commit.commit?.author?.email || null;
      const key = login || email || name || "unknown";

      if (!authorMap.has(key)) {
        authorMap.set(key, {
          id: key,
          login,
          name,
          email,
          commits: 0,
        });
      }

      authorMap.get(key).commits += 1;
    }

    return Array.from(authorMap.values()).sort((a, b) => b.commits - a.commits);
  }

  /**
   * Return the top N commit authors for a repository.
   *
   * @param {object} [options] - Query options.
   * @param {number} [options.limit=5] - Maximum number of authors.
   * @returns {Promise<Array<object>>} Top author summaries.
   */
  async getTopAuthors(options = {}) {
    const { limit = 5, ...rest } = options;
    const authors = await this.getAuthorsFromCommits(rest);
    return authors.slice(0, Math.max(0, limit));
  }
}

module.exports = AuthorsAPI;
