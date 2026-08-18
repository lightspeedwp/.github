const { Octokit } = require("octokit");
const { throttling } = require("@octokit/plugin-throttling");
const { retry } = require("@octokit/plugin-retry");

/**
 * Octokit client factory supporting PAT, OAuth, and GitHub App authentication.
 * Includes built-in rate limit monitoring and exponential backoff retry strategy.
 */

class OctokitClientFactory {
  constructor(config = {}) {
    this.config = {
      baseUrl: config.baseUrl || "https://api.github.com",
      userAgent: config.userAgent || "@lightspeedwp/metadata-agent",
      timeout: config.timeout || 15000,
      ...config,
    };

    this.client = null;
    this.authType = null;
  }

  /**
   * Create client with Personal Access Token (PAT)
   * @param {string} token - GitHub personal access token
   * @returns {Octokit} Configured Octokit client
   */
  createWithPAT(token) {
    if (!token || typeof token !== "string") {
      throw new Error("PAT token must be a non-empty string");
    }

    this.authType = "PAT";
    this.client = this._createOctokitInstance({
      auth: token,
    });

    return this.client;
  }

  /**
   * Create client with OAuth token (for user authentication)
   * @param {string} token - GitHub OAuth token
   * @returns {Octokit} Configured Octokit client
   */
  createWithOAuth(token) {
    if (!token || typeof token !== "string") {
      throw new Error("OAuth token must be a non-empty string");
    }

    this.authType = "OAuth";
    this.client = this._createOctokitInstance({
      auth: token,
    });

    return this.client;
  }

  /**
   * Create client with GitHub App credentials
   * @param {Object} appCredentials - App ID, private key, and installation ID
   * @param {number} appCredentials.appId - GitHub App ID
   * @param {string} appCredentials.privateKey - Private key (PEM format)
   * @param {number} appCredentials.installationId - Installation ID (optional, for app auth)
   * @returns {Octokit} Configured Octokit client
   */
  createWithAppAuth(appCredentials) {
    if (!appCredentials.appId || !appCredentials.privateKey) {
      throw new Error("AppAuth requires appId and privateKey");
    }

    this.authType = "AppAuth";

    const auth = {
      appId: appCredentials.appId,
      privateKey: appCredentials.privateKey,
      installationId: appCredentials.installationId,
    };

    this.client = this._createOctokitInstance({ auth });

    return this.client;
  }

  /**
   * Create unauthenticated client (limited rate limits)
   * @returns {Octokit} Configured Octokit client
   */
  createUnauthenticated() {
    this.authType = "Unauthenticated";
    this.client = this._createOctokitInstance({});
    return this.client;
  }

  /**
   * Get the current Octokit client instance
   * @returns {Octokit|null} Current client or null if not created
   */
  getClient() {
    if (!this.client) {
      throw new Error(
        "Client not initialized. Call a createWith* method first.",
      );
    }
    return this.client;
  }

  /**
   * Get authentication type
   * @returns {string} Auth type (PAT, OAuth, AppAuth, Unauthenticated)
   */
  getAuthType() {
    return this.authType;
  }

  /**
   * Internal: Create and configure Octokit instance
   * @private
   */
  _createOctokitInstance(authConfig) {
    // Create custom Octokit class with plugins
    const OctokitWithPlugins = Octokit.plugin(throttling, retry);

    const client = new OctokitWithPlugins({
      baseUrl: this.config.baseUrl,
      userAgent: this.config.userAgent,
      timeout: this.config.timeout,
      ...authConfig,
      throttle: {
        onRateLimit: (retryAfter, options, octokit) => {
          octokit.log.warn(
            `Rate limit hit for ${options.method} ${options.url}. Retrying after ${retryAfter} seconds.`,
          );
          return true;
        },
        onAbuseLimit: (retryAfter, options, octokit) => {
          octokit.log.warn(
            `Abuse limit hit for ${options.method} ${options.url}. Retrying after ${retryAfter} seconds.`,
          );
          return true;
        },
      },
    });

    return client;
  }

  /**
   * Get current rate limit status
   * @returns {Promise<Object>} Rate limit information
   */
  async getRateLimit() {
    if (!this.client) {
      throw new Error("Client not initialized");
    }

    try {
      const response = await this.client.rateLimit.get();
      return response.data.rate_limit;
    } catch (error) {
      throw new Error(`Failed to get rate limit: ${error.message}`);
    }
  }

  /**
   * Check if rate limit is approaching threshold
   * @param {number} threshold - Percentage threshold (0-100), default 15
   * @returns {Promise<boolean>} True if approaching threshold
   */
  async isApproachingRateLimit(threshold = 15) {
    const rateLimit = await this.getRateLimit();
    const percentageRemaining = (rateLimit.remaining / rateLimit.limit) * 100;
    return percentageRemaining <= threshold;
  }

  /**
   * Get time until rate limit reset
   * @returns {Promise<number>} Milliseconds until reset
   */
  async getTimeUntilReset() {
    const rateLimit = await this.getRateLimit();
    const resetTime = new Date(rateLimit.reset * 1000);
    return Math.max(0, resetTime - new Date());
  }
}

module.exports = OctokitClientFactory;
