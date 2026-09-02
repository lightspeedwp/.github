/**
 * Native Fetch Client with Retry & Rate Limit Handling
 *
 * Provides a unified HTTP client for GitHub API calls using native fetch
 * with exponential backoff retry logic and automatic rate limit detection.
 *
 * Usage:
 *   const client = new NativeFetchClient({ token: process.env.GITHUB_TOKEN });
 *   const response = await client.get('/repos/owner/repo/issues');
 */

import fetch from "node-fetch";
import { URLSearchParams } from "url";

export class NativeFetchClient {
  constructor(options = {}) {
    this.token = options.token;
    this.baseURL = options.baseURL || "https://api.github.com";
    this.defaultHeaders = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "lightspeed-automation",
      ...(this.token && { Authorization: `token ${this.token}` }),
      ...options.headers,
    };
    this.retryConfig = {
      maxAttempts: options.maxAttempts || 3,
      initialDelay: options.initialDelay || 1000, // 1 second
      maxDelay: options.maxDelay || 32000, // 32 seconds
      backoffMultiplier: options.backoffMultiplier || 2,
    };
  }

  /**
   * Build full URL with query parameters
   */
  buildURL(endpoint, query = {}) {
    let url = endpoint.startsWith("http")
      ? endpoint
      : `${this.baseURL}${endpoint}`;
    const params = new URLSearchParams(query);
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    return url;
  }

  /**
   * Parse rate limit headers from response
   */
  parseRateLimitHeaders(headers) {
    return {
      limit: parseInt(headers.get("x-ratelimit-limit") || "60"),
      remaining: parseInt(headers.get("x-ratelimit-remaining") || "60"),
      reset: parseInt(headers.get("x-ratelimit-reset") || "0"),
    };
  }

  /**
   * Check if error is retryable
   */
  isRetryable(status) {
    return status === 429 || status >= 500;
  }

  /**
   * Calculate exponential backoff delay
   */
  calculateBackoff(attempt) {
    const delay =
      this.retryConfig.initialDelay *
      Math.pow(this.retryConfig.backoffMultiplier, attempt - 1);
    return Math.min(delay, this.retryConfig.maxDelay);
  }

  /**
   * Make HTTP request with retry logic
   */
  async request(endpoint, options = {}) {
    const method = options.method || "GET";
    const headers = { ...this.defaultHeaders, ...options.headers };
    const url = this.buildURL(endpoint, options.query);

    let lastError;
    let attempt = 1;

    while (attempt <= this.retryConfig.maxAttempts) {
      try {
        const fetchOptions = {
          method,
          headers,
          ...(options.body && { body: JSON.stringify(options.body) }),
        };

        const response = await fetch(url, fetchOptions);
        const rateLimits = this.parseRateLimitHeaders(response.headers);

        // Success
        if (response.ok) {
          return {
            ok: true,
            status: response.status,
            data: await response.json(),
            rateLimits,
          };
        }

        // Rate limited
        if (response.status === 429) {
          const resetTime = rateLimits.reset * 1000;
          const now = Date.now();
          const waitTime = Math.max(0, resetTime - now + 1000);

          if (attempt < this.retryConfig.maxAttempts) {
            await this.delay(waitTime);
            attempt++;
            continue;
          }
        }

        // Retryable error
        if (this.isRetryable(response.status)) {
          if (attempt < this.retryConfig.maxAttempts) {
            const delay = this.calculateBackoff(attempt);
            await this.delay(delay);
            attempt++;
            continue;
          }
        }

        // Non-retryable error
        const errorData = await response.json().catch(() => ({}));
        return {
          ok: false,
          status: response.status,
          error: errorData.message || response.statusText,
          rateLimits,
        };
      } catch (error) {
        lastError = error;
        if (attempt < this.retryConfig.maxAttempts) {
          const delay = this.calculateBackoff(attempt);
          await this.delay(delay);
          attempt++;
          continue;
        }
      }
    }

    // All retries exhausted
    return {
      ok: false,
      status: 0,
      error: lastError?.message || "Max retries exceeded",
    };
  }

  /**
   * GET request
   */
  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: "GET" });
  }

  /**
   * POST request
   */
  async post(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: "POST", body });
  }

  /**
   * PATCH request
   */
  async patch(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: "PATCH", body });
  }

  /**
   * DELETE request
   */
  async delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: "DELETE" });
  }

  /**
   * Delay utility for retry logic
   */
  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export default NativeFetchClient;
