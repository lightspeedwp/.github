/**
 * Retrieve repository tag metadata from the GitHub API.
 */
class TagsAPI {
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

  /**
   * List tags for a repository.
   *
   * @param {object} [options] - Query options.
   * @param {string} options.owner - Repository owner.
   * @param {string} options.repo - Repository name.
   * @param {number} [options.perPage=30] - Number of tags to fetch.
   * @param {Array<object>} [options.fallback] - Fallback tag payload.
   * @returns {Promise<Array<object>>} Normalised tag metadata.
   */
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

  /**
   * Fetch the latest tag by highest semantic version.
   *
   * @param {object} [options] - Query options.
   * @param {string} options.owner - Repository owner.
   * @param {string} options.repo - Repository name.
   * @param {object|null} [options.fallback] - Fallback tag.
   * @returns {Promise<object|null>} Latest tag metadata.
   */
  async getLatestTag(options = {}) {
    const { owner, repo, fallback = null } = options;
    const tags = await this.getTags({
      owner,
      repo,
      perPage: 100,
      fallback: [],
    });

    if (!tags.length) {
      return fallback;
    }

    const parseSemverTag = (name) => {
      const match = /^v?(\d+)\.(\d+)\.(\d+)(?:[-+].*)?$/.exec(name || "");

      if (!match) {
        return null;
      }

      return match.slice(1, 4).map((value) => Number.parseInt(value, 10));
    };

    return tags.reduce((latestTag, currentTag) => {
      const latestVersion = parseSemverTag(latestTag?.name);
      const currentVersion = parseSemverTag(currentTag?.name);

      if (!currentVersion) {
        return latestTag;
      }

      if (!latestVersion) {
        return currentTag;
      }

      for (let index = 0; index < latestVersion.length; index += 1) {
        if (currentVersion[index] > latestVersion[index]) {
          return currentTag;
        }

        if (currentVersion[index] < latestVersion[index]) {
          return latestTag;
        }
      }

      return latestTag;
    }, tags[0]);
  }
}

module.exports = TagsAPI;
