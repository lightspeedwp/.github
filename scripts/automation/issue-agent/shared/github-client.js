/**
 * GitHub API Client Wrapper
 * Provides high-level abstractions for issue management operations
 * Implements error handling, caching, and retry logic
 *
 * @module github-client
 */

const https = require("https");

/**
 * Configuration for GitHub API client
 */
const CONFIG = {
  API_URL: "api.github.com",
  RATE_LIMIT_WINDOW: 60000, // 1 minute in ms
  RETRY_MAX_ATTEMPTS: 3,
  RETRY_BACKOFF_MS: 1000,
  CACHE_TTL: 300000, // 5 minutes for milestone caches
};

/**
 * Internal cache for API responses (milestones, labels, etc.)
 */
const cache = new Map();

/**
 * Make an authenticated request to GitHub API
 * @param {string} method - HTTP method (GET, POST, PATCH, etc.)
 * @param {string} path - API endpoint path
 * @param {object} data - Request body (for POST/PATCH)
 * @param {object} options - Additional options
 * @returns {Promise<object>} API response
 * @throws {Error} If request fails after retries
 */
async function makeRequest(method, path, data = null, options = {}) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error("GITHUB_TOKEN environment variable not set");
  }

  const url = new globalThis.URL(`https://${CONFIG.API_URL}${path}`);
  const { retryCount = 0 } = options;

  const requestOptions = {
    hostname: CONFIG.API_URL,
    path: url.pathname + url.search,
    method,
    headers: {
      Authorization: `token ${token}`,
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "Issue-Management-Agent/1.0",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  };

  if (data) {
    const body = JSON.stringify(data);
    requestOptions.headers["Content-Type"] = "application/json";
    requestOptions.headers["Content-Length"] = Buffer.byteLength(body);
  }

  return new Promise((resolve, reject) => {
    const req = https.request(requestOptions, (res) => {
      let responseData = "";

      res.on("data", (chunk) => {
        responseData += chunk;
      });

      res.on("end", () => {
        try {
          const parsed = JSON.parse(responseData);

          // Handle rate limiting
          if (
            res.statusCode === 403 &&
            parsed.message &&
            parsed.message.includes("API rate limit")
          ) {
            if (retryCount < CONFIG.RETRY_MAX_ATTEMPTS) {
              const delay = CONFIG.RETRY_BACKOFF_MS * Math.pow(2, retryCount);
              setTimeout(() => {
                makeRequest(method, path, data, {
                  ...options,
                  retryCount: retryCount + 1,
                })
                  .then(resolve)
                  .catch(reject);
              }, delay);
              return;
            }
            reject(
              new Error(
                `GitHub API rate limit exceeded after ${CONFIG.RETRY_MAX_ATTEMPTS} retries`,
              ),
            );
            return;
          }

          // Handle other error responses
          if (res.statusCode >= 400) {
            const errorMsg = parsed.message || `HTTP ${res.statusCode}`;
            reject(new Error(`GitHub API error: ${errorMsg}`));
            return;
          }

          resolve(parsed);
        } catch (e) {
          reject(
            new Error(`Failed to parse GitHub API response: ${e.message}`),
          );
        }
      });
    });

    req.on("error", (err) => {
      if (retryCount < CONFIG.RETRY_MAX_ATTEMPTS) {
        const delay = CONFIG.RETRY_BACKOFF_MS * Math.pow(2, retryCount);
        setTimeout(() => {
          makeRequest(method, path, data, {
            ...options,
            retryCount: retryCount + 1,
          })
            .then(resolve)
            .catch(reject);
        }, delay);
      } else {
        reject(err);
      }
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

/**
 * Create an issue via GitHub API
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {object} issueData - Issue data (title, body, labels, milestone, assignees)
 * @returns {Promise<object>} Created issue object
 */
async function createIssueViaAPI(owner, repo, issueData) {
  const {
    title,
    body,
    labels = [],
    milestone = null,
    assignees = [],
  } = issueData;

  if (!title) {
    throw new Error("Issue title is required");
  }

  const payload = {
    title,
    body: body || "",
    labels: Array.isArray(labels) ? labels : [],
  };

  if (milestone) {
    payload.milestone = milestone;
  }

  if (assignees && assignees.length > 0) {
    payload.assignees = assignees;
  }

  const path = `/repos/${owner}/${repo}/issues`;
  const response = await makeRequest("POST", path, payload);

  return {
    number: response.number,
    html_url: response.html_url,
    title: response.title,
    labels: response.labels,
    milestone: response.milestone,
  };
}

/**
 * Fetch available milestones for a repository
 * Caches results with 5-minute TTL
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {string} state - Milestone state: 'open' or 'closed' (default: 'open')
 * @returns {Promise<array>} Array of milestone objects
 */
async function fetchMilestones(owner, repo, state = "open") {
  const cacheKey = `milestones:${owner}:${repo}:${state}`;
  const cached = cache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CONFIG.CACHE_TTL) {
    return cached.data;
  }

  const path = `/repos/${owner}/${repo}/milestones?state=${state}&per_page=100`;
  const response = await makeRequest("GET", path);

  const milestones = Array.isArray(response) ? response : [];
  const parsed = milestones.map((m) => ({
    title: m.title,
    number: m.number,
    state: m.state,
    description: m.description,
  }));

  cache.set(cacheKey, {
    data: parsed,
    timestamp: Date.now(),
  });

  return parsed;
}

/**
 * Add labels to an issue
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {number} issueNumber - Issue number
 * @param {array} labels - Array of label names
 * @returns {Promise<array>} Updated labels array
 */
async function addLabelsToIssue(owner, repo, issueNumber, labels) {
  if (!Array.isArray(labels) || labels.length === 0) {
    return [];
  }

  const path = `/repos/${owner}/${repo}/issues/${issueNumber}/labels`;
  const payload = { labels };

  const response = await makeRequest("POST", path, payload);
  return Array.isArray(response) ? response : [];
}

/**
 * Create a comment on an issue
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {number} issueNumber - Issue number
 * @param {string} body - Comment body text
 * @returns {Promise<object>} Created comment object
 */
async function createComment(owner, repo, issueNumber, body) {
  if (!body || typeof body !== "string") {
    throw new Error("Comment body is required and must be a string");
  }

  const path = `/repos/${owner}/${repo}/issues/${issueNumber}/comments`;
  const payload = { body };

  const response = await makeRequest("POST", path, payload);

  return {
    id: response.id,
    url: response.html_url,
    body: response.body,
    author: response.user.login,
  };
}

/**
 * Add issue to GitHub project board (via GraphQL)
 * @param {string} projectId - GitHub project (v2) ID
 * @param {number} issueNumber - Issue number
 * @param {string} status - Status field value (e.g., 'Backlog', 'In Progress', 'Done')
 * @returns {Promise<object>} Project card update result
 */
async function addToProjectBoard(projectId, issueNumber, status) {
  // Note: This is a simplified stub for GraphQL integration
  // Full implementation requires GraphQL client and project schema discovery
  if (!projectId || !issueNumber) {
    throw new Error("Project ID and issue number are required");
  }

  // TODO: Implement GraphQL mutation for project board integration
  // This would require:
  // 1. GraphQL client setup
  // 2. Project schema discovery (custom fields, field IDs)
  // 3. Mutation for adding item to project with custom field values

  return {
    projectId,
    issueNumber,
    status,
    message: "Project board integration pending GraphQL implementation",
  };
}

/**
 * Clear cache for testing or manual cache invalidation
 */
function clearCache() {
  cache.clear();
}

/**
 * Get cache statistics (for debugging)
 */
function getCacheStats() {
  return {
    size: cache.size,
    entries: Array.from(cache.keys()),
  };
}

module.exports = {
  createIssueViaAPI,
  fetchMilestones,
  addLabelsToIssue,
  createComment,
  addToProjectBoard,
  makeRequest,
  clearCache,
  getCacheStats,
  CONFIG,
};
