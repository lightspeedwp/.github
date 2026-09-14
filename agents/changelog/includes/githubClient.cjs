/**
 * GitHub API Client
 * Handles PR/issue reference validation with caching and graceful degradation
 */

const https = require("https");

// In-memory cache for API results
// Structure: { key: { data, timestamp } }
const cache = {};
const CACHE_TTL = 60 * 60 * 1000; // 1 hour in milliseconds

/**
 * Check if cached entry is still valid
 * @param {string} key - Cache key
 * @returns {boolean} True if cache entry exists and is not expired
 */
function isCacheValid(key) {
  if (!cache[key]) {
    return false;
  }
  const age = Date.now() - cache[key].timestamp;
  return age < CACHE_TTL;
}

/**
 * Get cached value
 * @param {string} key - Cache key
 * @returns {*} Cached value or null
 */
function getFromCache(key) {
  if (isCacheValid(key)) {
    return cache[key].data;
  }
  // Remove expired entry
  delete cache[key];
  return null;
}

/**
 * Set cache value
 * @param {string} key - Cache key
 * @param {*} data - Data to cache
 */
function setCache(key, data) {
  cache[key] = {
    data,
    timestamp: Date.now(),
  };
}

/**
 * Make a GitHub API request (simplified implementation)
 * In production, would use Octokit library
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {string} path - API path (e.g., /pulls/123)
 * @returns {Promise<Object>} API response or cached result
 */
async function makeGitHubApiRequest(owner, repo, path) {
  const cacheKey = `${owner}/${repo}${path}`;

  // Check cache first
  const cached = getFromCache(cacheKey);
  if (cached !== null) {
    return cached;
  }

  // Graceful degradation: if API unavailable, return null
  // In production with Octokit, this would be proper error handling
  try {
    // Simulated API response - in production would use Octokit
    // This is a placeholder for the actual GitHub API call
    const result = {
      exists: true,
      status: "open",
      number: parseInt(path.split("/").pop()),
    };

    setCache(cacheKey, result);
    return result;
  } catch (error) {
    console.warn(
      `GitHub API error (${owner}/${repo}${path}): ${error.message} - using graceful degradation`,
    );
    // Return null to indicate API unavailable, caller should handle graceful degradation
    return null;
  }
}

/**
 * Validate a PR reference
 * @param {string} owner - Repository owner (e.g., "lightspeedwp")
 * @param {string} repo - Repository name (e.g., "ls-flow")
 * @param {number|string} prNumber - PR number
 * @returns {Promise<Object>} { exists: boolean, status?: string, url?: string }
 */
async function validatePRReference(owner, repo, prNumber) {
  const result = {
    valid: false,
    exists: false,
    status: null,
    url: null,
    error: null,
    cached: false,
  };

  if (!prNumber) {
    result.error = "PR number is required";
    return result;
  }

  try {
    // Check cache first
    const cacheKey = `pr:${owner}/${repo}#${prNumber}`;
    const cached = getFromCache(cacheKey);

    if (cached !== null) {
      result.cached = true;
      result.exists = cached.exists;
      result.status = cached.status;
      result.url = `https://github.com/${owner}/${repo}/pull/${prNumber}`;
      result.valid = cached.exists;
      return result;
    }

    // Make API request (simulated in this version)
    const apiResult = await makeGitHubApiRequest(
      owner,
      repo,
      `/pulls/${prNumber}`,
    );

    if (apiResult === null) {
      // API unavailable - graceful degradation
      // Assume PR is valid if API is down
      result.valid = true;
      result.exists = true;
      result.url = `https://github.com/${owner}/${repo}/pull/${prNumber}`;
      result.error = "GitHub API temporarily unavailable - assuming valid";
      return result;
    }

    // API responded successfully
    result.exists = apiResult.exists;
    result.status = apiResult.status;
    result.url = `https://github.com/${owner}/${repo}/pull/${prNumber}`;
    result.valid = result.exists;

    // Cache result
    setCache(cacheKey, {
      exists: result.exists,
      status: result.status,
    });

    return result;
  } catch (error) {
    result.error = error.message;
    result.valid = false;
    return result;
  }
}

/**
 * Validate an issue reference
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {number|string} issueNumber - Issue number
 * @returns {Promise<Object>} { exists: boolean, status?: string, url?: string }
 */
async function validateIssueReference(owner, repo, issueNumber) {
  const result = {
    valid: false,
    exists: false,
    status: null,
    url: null,
    error: null,
    cached: false,
  };

  if (!issueNumber) {
    result.error = "Issue number is required";
    return result;
  }

  try {
    // Check cache first
    const cacheKey = `issue:${owner}/${repo}#${issueNumber}`;
    const cached = getFromCache(cacheKey);

    if (cached !== null) {
      result.cached = true;
      result.exists = cached.exists;
      result.status = cached.status;
      result.url = `https://github.com/${owner}/${repo}/issues/${issueNumber}`;
      result.valid = cached.exists;
      return result;
    }

    // Make API request (simulated in this version)
    const apiResult = await makeGitHubApiRequest(
      owner,
      repo,
      `/issues/${issueNumber}`,
    );

    if (apiResult === null) {
      // API unavailable - graceful degradation
      result.valid = true;
      result.exists = true;
      result.url = `https://github.com/${owner}/${repo}/issues/${issueNumber}`;
      result.error = "GitHub API temporarily unavailable - assuming valid";
      return result;
    }

    // API responded successfully
    result.exists = apiResult.exists;
    result.status = apiResult.status;
    result.url = `https://github.com/${owner}/${repo}/issues/${issueNumber}`;
    result.valid = result.exists;

    // Cache result
    setCache(cacheKey, {
      exists: result.exists,
      status: result.status,
    });

    return result;
  } catch (error) {
    result.error = error.message;
    result.valid = false;
    return result;
  }
}

/**
 * Clear cache (for testing or reset)
 */
function clearCache() {
  for (const key in cache) {
    delete cache[key];
  }
}

/**
 * Get cache stats (for monitoring)
 * @returns {Object} Cache statistics
 */
function getCacheStats() {
  const keys = Object.keys(cache);
  const now = Date.now();
  const validEntries = keys.filter((k) => isCacheValid(k));

  return {
    total_entries: keys.length,
    valid_entries: validEntries.length,
    expired_entries: keys.length - validEntries.length,
    cache_ttl_ms: CACHE_TTL,
  };
}

module.exports = {
  validatePRReference,
  validateIssueReference,
  makeGitHubApiRequest,
  clearCache,
  getCacheStats,
  getFromCache,
  setCache,
};
