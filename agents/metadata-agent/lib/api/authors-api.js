class AuthorsAPI {
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

  async getTopAuthors(options = {}) {
    const { limit = 5, ...rest } = options;
    const authors = await this.getAuthorsFromCommits(rest);
    return authors.slice(0, Math.max(0, limit));
  }
}

module.exports = AuthorsAPI;
