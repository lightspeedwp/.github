/**
 * Retrieve repository branch metadata from the GitHub API.
 */
class BranchesAPI {
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
          module: "branches",
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
   * List branches for a repository.
   *
   * @param {object} [options] - Query options.
   * @param {string} options.owner - Repository owner.
   * @param {string} options.repo - Repository name.
   * @param {number} [options.perPage=30] - Number of branches to fetch.
   * @param {boolean} [options.protectedOnly=false] - Filter to protected branches.
   * @param {Array<object>} [options.fallback] - Fallback branch payload.
   * @returns {Promise<Array<object>>} Normalised branch metadata.
   */
  async getBranches(options = {}) {
    const {
      owner,
      repo,
      perPage = 30,
      protectedOnly = false,
      fallback = undefined,
    } = options;

    if (!owner || !repo) {
      throw new Error("owner and repo are required");
    }

    const response = await this._execute(
      () =>
        this.client.repos.listBranches({
          owner,
          repo,
          per_page: perPage,
          protected: protectedOnly,
        }),
      "fetch branches",
      fallback,
    );

    const branches = Array.isArray(response) ? response : response?.data || [];

    return branches.map((branch) => ({
      name: branch.name,
      sha: branch.commit?.sha || null,
      isProtected: !!branch.protected,
    }));
  }

  /**
   * Fetch the repository default branch.
   *
   * @param {object} [options] - Query options.
   * @param {string} options.owner - Repository owner.
   * @param {string} options.repo - Repository name.
   * @param {string} [options.fallback="main"] - Fallback default branch value.
   * @returns {Promise<string>} Default branch name.
   */
  async getDefaultBranch(options = {}) {
    const { owner, repo, fallback = "main" } = options;

    if (!owner || !repo) {
      throw new Error("owner and repo are required");
    }

    const response = await this._execute(
      () => this.client.repos.get({ owner, repo }),
      "fetch repository metadata",
      { default_branch: fallback },
    );

    const repository = response?.data || response;
    return repository.default_branch;
  }
}

module.exports = BranchesAPI;
