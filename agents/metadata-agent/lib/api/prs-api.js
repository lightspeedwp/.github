class PRsAPI {
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
