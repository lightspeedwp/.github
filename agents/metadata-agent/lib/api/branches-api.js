class BranchesAPI {
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
