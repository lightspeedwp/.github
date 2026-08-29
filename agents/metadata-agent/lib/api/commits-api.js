class CommitsAPI {
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
