class TagsAPI {
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
          module: "tags",
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

  async getTags(options = {}) {
    const { owner, repo, perPage = 30, fallback = undefined } = options;

    if (!owner || !repo) {
      throw new Error("owner and repo are required");
    }

    const response = await this._execute(
      () => this.client.repos.listTags({ owner, repo, per_page: perPage }),
      "fetch tags",
      fallback,
    );

    const tags = Array.isArray(response) ? response : response?.data || [];

    return tags.map((tag) => ({
      name: tag.name,
      sha: tag.commit?.sha || null,
      url: tag.commit?.url || null,
    }));
  }

  async getLatestTag(options = {}) {
    const { owner, repo, fallback = null } = options;
    const tags = await this.getTags({ owner, repo, perPage: 1, fallback: [] });

    if (!tags.length) {
      return fallback;
    }

    return tags[0];
  }
}

module.exports = TagsAPI;
