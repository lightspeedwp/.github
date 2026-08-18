#!/usr/bin/env node

/**
 * Metrics Agent — Universal metrics collection and analysis for multi-context repositories
 * Supports GitHub control plane and WordPress plugin/theme repositories
 * Phase 2.1: Real GitHub API Integration with pagination, error handling, rate limiting
 */

const fs = require("fs");
const path = require("path");

// ============================================================================
// 1. CONFIGURATION MODULE (~50 LOC)
// ============================================================================

class ConfigurationLoader {
  static loadConfig(configPath) {
    if (!fs.existsSync(configPath)) {
      throw new Error(`Configuration file not found: ${configPath}`);
    }

    const configFile = fs.readFileSync(configPath, "utf-8");
    const config = JSON.parse(configFile);

    return this.validateConfig(config);
  }

  static validateConfig(config) {
    const required = [
      "context",
      "repositories",
      "metrics",
      "collection_period",
    ];
    const missing = required.filter((field) => !config[field]);

    if (missing.length > 0) {
      throw new Error(`Missing required config fields: ${missing.join(", ")}`);
    }

    // Validate context
    const validContexts = [
      "github-control-plane",
      "wordpress-plugin",
      "wordpress-theme",
    ];
    if (!validContexts.includes(config.context)) {
      throw new Error(
        `Invalid context: ${config.context}. Must be one of: ${validContexts.join(", ")}`,
      );
    }

    // Validate repositories
    if (!Array.isArray(config.repositories) || config.repositories.length === 0) {
      throw new Error("repositories must be a non-empty array");
    }

    config.repositories.forEach((repo, idx) => {
      if (!repo.owner || !repo.name) {
        throw new Error(
          `Repository ${idx} missing owner or name`,
        );
      }
    });

    // Validate collection_period
    if (typeof config.collection_period !== "number" || config.collection_period <= 0) {
      throw new Error("collection_period must be a positive number");
    }

    return config;
  }

  static getDefaultMetrics(context) {
    const allMetrics = {
      issues: [
        "total",
        "closed",
        "ttf",
        "active",
        "stale",
        "reopened",
        "labels",
      ],
      pull_requests: [
        "total",
        "merged",
        "ttm",
        "review_time",
        "participation",
        "size",
        "ci_pass_rate",
      ],
      contributors: [
        "active",
        "breakdown",
        "top",
        "retention",
        "new_vs_returning",
      ],
      health: [
        "milestone_progress",
        "epic_status",
        "backlog",
        "label_distribution",
        "velocity",
      ],
    };

    if (context === "github-control-plane") {
      return allMetrics;
    } else if (context === "wordpress-plugin") {
      return {
        issues: allMetrics.issues.slice(0, 5),
        pull_requests: allMetrics.pull_requests.slice(0, 4),
        contributors: allMetrics.contributors.slice(0, 3),
      };
    } else if (context === "wordpress-theme") {
      return {
        issues: allMetrics.issues.slice(0, 4),
        pull_requests: allMetrics.pull_requests.slice(0, 3),
        contributors: allMetrics.contributors.slice(0, 2),
      };
    }

    return allMetrics;
  }

  static getMetricsSubset(config) {
    const defaults = this.getDefaultMetrics(config.context);
    if (!config.metrics) {
      return defaults;
    }

    const subset = {};
    Object.entries(config.metrics).forEach(([key, val]) => {
      if (defaults[key]) {
        subset[key] = Array.isArray(val) ? val : defaults[key];
      }
    });

    return Object.keys(subset).length > 0 ? subset : defaults;
  }
}

// ============================================================================
// 2. GITHUB API CLIENT (~150 LOC)
// ============================================================================

class GitHubAPIClient {
  constructor(token, cache = {}, cacheTtl = 3600000) {
    this.token = token || process.env.GITHUB_TOKEN;
    if (!this.token) {
      throw new Error(
        "GitHub token required: set GITHUB_TOKEN env var or pass via config",
      );
    }

    this.cache = cache;
    this.cacheTtl = cacheTtl;
    this.baseUrl = "https://api.github.com";
    this.headers = {
      Authorization: `token ${this.token}`,
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "Metrics-Agent/2.0",
    };
    this.retryCount = 0;
    this.maxRetries = 3;
    this.rateLimitRemaining = 5000;
    this.rateLimitReset = null;
  }

  getErrorMessage(status) {
    const errorMap = {
      401: "Authentication failed: Invalid or expired token. Check GITHUB_TOKEN env var.",
      403: "Permission denied: Token lacks required scopes or rate limit exceeded.",
      404: "Repository not found: Check owner and repository name.",
      422: "Unprocessable Entity: Invalid request parameters or invalid state.",
      429: "Rate limited: GitHub API quota exceeded. Retrying with exponential backoff.",
    };
    return errorMap[status] || `GitHub API error ${status}`;
  }

  async requestPage(endpoint, params = {}, page = 1) {
    try {
      const url = new URL(`${this.baseUrl}${endpoint}`);
      const pageParams = { ...params, page, per_page: 100 };
      Object.entries(pageParams).forEach(([key, val]) => {
        url.searchParams.append(key, val);
      });

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: this.headers,
      });

      this.rateLimitRemaining = parseInt(
        response.headers.get("x-ratelimit-remaining") || "5000",
      );
      this.rateLimitReset = parseInt(
        response.headers.get("x-ratelimit-reset") || "0",
      ) * 1000;

      if (response.status === 429 || response.status === 403) {
        const resetTime = this.rateLimitReset;
        const waitTime = Math.max(1000, resetTime - Date.now());

        if (this.retryCount < this.maxRetries) {
          this.retryCount++;
          const backoffDelay = Math.min(waitTime, 60000 * this.retryCount);
          console.warn(
            `Rate limited. Waiting ${(backoffDelay / 1000).toFixed(1)}s before retry...`,
          );
          await new Promise((resolve) => setTimeout(resolve, backoffDelay));
          return this.requestPage(endpoint, params, page);
        }

        throw new Error(
          `${this.getErrorMessage(response.status)} Reset at ${new Date(resetTime).toISOString()}`,
        );
      }

      if (!response.ok) {
        throw new Error(
          `${this.getErrorMessage(response.status)} (${response.statusText})`,
        );
      }

      const data = await response.json();
      this.retryCount = 0;

      const hasNextPage = response.headers
        .get("link")
        ?.includes('rel="next"');
      return { data, hasNextPage };
    } catch (error) {
      if (error.message.includes("Failed to fetch") || error.message.includes("fetch")) {
        if (this.retryCount < this.maxRetries) {
          this.retryCount++;
          const delay = 1000 * Math.pow(2, this.retryCount);
          console.warn(`Network error. Retrying in ${delay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          return this.requestPage(endpoint, params, page);
        }
      }
      throw new Error(`Failed to query GitHub API: ${error.message}`);
    }
  }

  async request(endpoint, params = {}) {
    const cacheKey = `${endpoint}:${JSON.stringify(params)}`;

    if (this.cache[cacheKey]) {
      const { data, timestamp } = this.cache[cacheKey];
      if (Date.now() - timestamp < this.cacheTtl) {
        console.debug(`Cache hit: ${endpoint}`);
        return data;
      } else {
        delete this.cache[cacheKey];
      }
    }

    try {
      const allData = [];
      let page = 1;
      let hasNextPage = true;

      while (hasNextPage) {
        const { data, hasNextPage: more } = await this.requestPage(
          endpoint,
          params,
          page,
        );
        allData.push(...(Array.isArray(data) ? data : [data]));
        hasNextPage = more;
        page++;

        if (page > 100) {
          console.warn(
            `Reached 100 pages for ${endpoint}. Stopping pagination.`,
          );
          break;
        }
      }

      this.cache[cacheKey] = { data: allData, timestamp: Date.now() };

      console.debug(
        `Fetched ${allData.length} items from ${endpoint} (${this.rateLimitRemaining} quota remaining)`,
      );
      return allData;
    } catch (error) {
      throw error;
    }
  }

  cleanupExpiredCache() {
    const now = Date.now();
    let cleaned = 0;
    Object.keys(this.cache).forEach((key) => {
      if (now - this.cache[key].timestamp > this.cacheTtl * 2) {
        delete this.cache[key];
        cleaned++;
      }
    });
    if (cleaned > 0) {
      console.debug(`Cleaned up ${cleaned} expired cache entries`);
    }
  }

  async getIssues(owner, repo, since, until) {
    return this.request(`/repos/${owner}/${repo}/issues`, {
      state: "all",
      since: since.toISOString(),
      per_page: 100,
    });
  }

  async getPullRequests(owner, repo, since, until) {
    return this.request(`/repos/${owner}/${repo}/pulls`, {
      state: "all",
      sort: "created",
      since: since.toISOString(),
      per_page: 100,
    });
  }

  async getContributors(owner, repo) {
    return this.request(`/repos/${owner}/${repo}/contributors`, {
      per_page: 100,
    });
  }

  async getRepositoryStats(owner, repo) {
    return this.request(`/repos/${owner}/${repo}`);
  }
}

module.exports = { ConfigurationLoader, GitHubAPIClient };
