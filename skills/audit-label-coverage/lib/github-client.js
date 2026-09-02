class GitHubClient {
  constructor(octokit, owner, repo, options = {}) {
    this.octokit = octokit;
    this.owner = owner;
    this.repo = repo;
    this.maxRetries = options.maxRetries || 3;
    this.baseDelay = options.baseDelay || 2000; // 2 seconds
    this.labelCache = new Map();
    this.labelCacheTTL = options.labelCacheTTL || 3600000; // 1 hour
    this.labelCacheTime = null;
  }

  async fetchIssues(options = {}) {
    const {
      state = "open",
      labels,
      perPage = 30,
      sort = "created",
      direction = "desc",
    } = options;

    const issues = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const params = {
        owner: this.owner,
        repo: this.repo,
        state,
        per_page: perPage,
        page,
        sort,
        direction,
      };

      if (labels) {
        params.labels = labels;
      }

      const response = await this._retryAsync(() =>
        this.octokit.rest.issues.listForRepo(params),
      );

      issues.push(...response.data);
      hasMore = response.data.length === perPage;
      page += 1;
    }

    return issues;
  }

  async addLabels(issueNumber, labels) {
    if (!labels || labels.length === 0) {
      return;
    }

    await this._retryAsync(() =>
      this.octokit.rest.issues.addLabels({
        owner: this.owner,
        repo: this.repo,
        issue_number: issueNumber,
        labels,
      }),
    );
  }

  async removeLabel(issueNumber, labelName) {
    await this._retryAsync(() =>
      this.octokit.rest.issues.removeLabel({
        owner: this.owner,
        repo: this.repo,
        issue_number: issueNumber,
        name: labelName,
      }),
    );
  }

  async validateLabels(labels) {
    const canonicalLabels = await this._getCanonicalLabels();
    const validLabelSet = new Set(canonicalLabels.map((l) => l.name));

    const valid = [];
    const invalid = [];

    for (const label of labels) {
      if (validLabelSet.has(label)) {
        valid.push(label);
      } else {
        invalid.push(label);
      }
    }

    return { valid, invalid };
  }

  async _getCanonicalLabels() {
    const now = Date.now();
    if (
      this.labelCache.has("canonical") &&
      this.labelCacheTime &&
      now - this.labelCacheTime < this.labelCacheTTL
    ) {
      return this.labelCache.get("canonical");
    }

    try {
      const response = await this.octokit.repos.getContent({
        owner: this.owner,
        repo: this.repo,
        path: ".github/labels.yml",
      });

      const content = Buffer.from(response.data.content, "base64").toString(
        "utf-8",
      );
      const labels = this._parseYaml(content);

      this.labelCache.set("canonical", labels);
      this.labelCacheTime = now;

      return labels;
    } catch (error) {
      if (error.status === 404) {
        return [];
      }
      throw error;
    }
  }

  _parseYaml(content) {
    // Simple YAML parser for labels.yml format
    const lines = content.split("\n");
    const labels = [];
    let currentLabel = null;

    for (const line of lines) {
      const trimmed = line.trim();

      if (trimmed.startsWith("- name:")) {
        if (currentLabel && currentLabel.name) {
          labels.push(currentLabel);
        }
        currentLabel = { name: trimmed.substring(8).trim() };
      } else if (trimmed.startsWith("color:") && currentLabel) {
        currentLabel.color = trimmed.substring(7).trim();
      } else if (trimmed.startsWith("description:") && currentLabel) {
        currentLabel.description = trimmed
          .substring(13)
          .trim()
          .replace(/^['"]|['"]$/g, "");
      }
    }

    if (currentLabel && currentLabel.name) {
      labels.push(currentLabel);
    }

    return labels;
  }

  async _retryAsync(fn, attempt = 0) {
    try {
      return await fn();
    } catch (error) {
      if (attempt >= this.maxRetries) {
        throw error;
      }

      const isRetryable = this._isRetryableError(error);
      if (!isRetryable) {
        throw error;
      }

      const delay = this._calculateDelay(error, attempt);
      await this._sleep(delay);

      return this._retryAsync(fn, attempt + 1);
    }
  }

  _isRetryableError(error) {
    if (!error.status) {
      return true; // Network errors are retryable
    }

    // Rate limit
    if (
      error.status === 403 &&
      error.response?.headers?.["x-ratelimit-reset"]
    ) {
      return true;
    }

    // Server errors
    if (error.status >= 500) {
      return true;
    }

    // Timeout
    if (error.status === 408) {
      return true;
    }

    return false;
  }

  _calculateDelay(error, attempt) {
    // Rate limit: respect reset time
    if (
      error.status === 403 &&
      error.response?.headers?.["x-ratelimit-reset"]
    ) {
      const resetTime = parseInt(
        error.response.headers["x-ratelimit-reset"],
        10,
      );
      const now = Math.ceil(Date.now() / 1000);
      const waitSeconds = Math.max(resetTime - now, 1);
      return waitSeconds * 1000 + 100; // Add 100ms buffer
    }

    // Exponential backoff: 2s, 4s, 8s
    return this.baseDelay * Math.pow(2, attempt);
  }

  _sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

module.exports = { GitHubClient };
