/**
 * GitHub Copilot Integration
 * Triggers and polls GitHub Copilot for code review suggestions
 *
 * Uses GitHub's Copilot API endpoint for code review suggestions
 * Endpoint: POST /copilot/reviews (via GitHub REST API)
 * Response: {suggestions: Array}
 */

const https = require("https");
const toolRegistry = require("../tool-registry");

const GITHUB_API_HOST = "api.github.com";

/**
 * Make HTTPS request to GitHub API
 * @private
 */
async function _makeRequest(method, path, token, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: GITHUB_API_HOST,
      path,
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
        "User-Agent": "reviewer-agent-v2/1.0",
      },
      timeout: 30000,
    };

    const req = https.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(JSON.parse(data));
          } else {
            const error = new Error(
              `GitHub Copilot API error: ${res.statusCode} ${data}`,
            );
            error.status = res.statusCode;
            error.body = data;
            reject(error);
          }
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on("error", reject);
    req.on("timeout", () => {
      req.destroy();
      const error = new Error("GitHub Copilot API request timeout");
      error.code = "ETIMEDOUT";
      reject(error);
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

/**
 * Normalize Copilot suggestions to standard findings format
 * @private
 */
function _normalizeSuggestions(suggestions) {
  if (!Array.isArray(suggestions)) {
    return [];
  }

  return suggestions.map((suggestion) => ({
    id: `copilot-${suggestion.id || `${suggestion.file}-${suggestion.line}`}`,
    tool: "copilot",
    severity: _mapPriority(suggestion.priority),
    category: _categorizeIssue(suggestion.category || suggestion.type),
    file: suggestion.file,
    line: suggestion.line || 0,
    column: suggestion.column || 0,
    status: "open",
    resolved_in_commit: null,
    suggestion: suggestion.suggestion || suggestion.message || "",
    confidence: suggestion.confidence || 0.5,
    priority: suggestion.priority,
  }));
}

/**
 * Map Copilot priority to standard severity levels
 * @private
 */
function _mapPriority(priority) {
  const priorityMap = {
    critical: "critical",
    high: "major",
    medium: "major",
    low: "minor",
    info: "minor",
  };
  return priorityMap[priority?.toLowerCase()] || "minor";
}

/**
 * Categorize issue type to standard categories
 * @private
 */
function _categorizeIssue(issueType) {
  const categoryMap = {
    security: "security",
    vulnerability: "security",
    performance: "performance",
    optimization: "performance",
    style: "style",
    naming: "style",
    accessibility: "accessibility",
    a11y: "accessibility",
    architecture: "architecture",
    design: "architecture",
    readability: "architecture",
    testing: "testing",
    documentation: "documentation",
    best_practice: "architecture",
    correctness: "correctness",
    bug: "correctness",
  };
  return categoryMap[issueType?.toLowerCase()] || "architecture";
}

/**
 * Trigger a Copilot code review
 * Calls GitHub Copilot API to start a code review
 *
 * @param {Object} prContext - GitHub PR context
 * @returns {Promise<string>} - Review request ID
 */
async function trigger(prContext) {
  const tokens = toolRegistry._resolveTokens();
  const token = tokens.copilot_token;

  if (!token) {
    throw new Error("COPILOT_API_TOKEN not configured");
  }

  if (!prContext.repo || !prContext.number) {
    throw new Error("PR context missing required fields (repo, number)");
  }

  const payload = {
    owner: prContext.repo.owner,
    repo: prContext.repo.name,
    pull_number: prContext.number,
    files: (prContext.files || []).map((f) => ({
      filename: f.filename,
      patch: f.patch,
      status: f.status,
    })),
  };

  try {
    const path = `/repos/${prContext.repo.owner}/${prContext.repo.name}/copilot/reviews`;
    const response = await _makeRequest("POST", path, token, payload);

    if (!response.id) {
      throw new Error("Copilot API response missing review ID");
    }

    return response.id;
  } catch (error) {
    // Copilot API may not be available for all repos
    // Return a synthetic request ID to allow polling
    if (error.status === 404 || error.status === 403) {
      console.warn(`Copilot review not available: ${error.message}`);
      return `copilot-unavailable-${prContext.number}`;
    }
    throw error;
  }
}

/**
 * Poll Copilot for review suggestions
 * Fetches suggestions from a previously triggered review
 *
 * @param {string} requestId - Review request ID
 * @param {Object} prContext - GitHub PR context (optional, for fallback)
 * @returns {Promise<Object|null>} - Review result or null if pending
 */
async function poll(requestId, _prContext = null) {
  const tokens = toolRegistry._resolveTokens();
  const token = tokens.copilot_token;

  if (!token) {
    throw new Error("COPILOT_API_TOKEN not configured");
  }

  // Handle unavailable reviews
  if (requestId.includes("unavailable")) {
    return {
      status: "completed",
      findings: [],
      available: false,
    };
  }

  try {
    const path = `/copilot/reviews/${requestId}`;
    const response = await _makeRequest("GET", path, token);

    if (response.status === "completed" || response.status === "success") {
      return {
        status: "completed",
        findings: _normalizeSuggestions(response.suggestions || []),
        raw_response: response,
      };
    }

    if (response.status === "pending" || response.status === "in_progress") {
      return {
        status: "pending",
        findings: [],
      };
    }

    if (response.status === "failed" || response.status === "error") {
      throw new Error(
        `Copilot review failed: ${response.error || response.message}`,
      );
    }

    // Unknown status, treat as pending
    return {
      status: "pending",
      findings: [],
    };
  } catch (error) {
    // If review endpoint not available, return empty findings
    if (error.status === 404) {
      return {
        status: "completed",
        findings: [],
        available: false,
      };
    }
    throw error;
  }
}

/**
 * Get Copilot suggestions from API directly
 * Alternative method for fetching suggestions
 *
 * @param {string} token - GitHub API token
 * @param {Object} prContext - PR context for the request
 * @returns {Promise<Array>} - Copilot suggestions
 */
async function getSuggestions(token, prContext) {
  if (!prContext) {
    return [];
  }

  try {
    const path = `/repos/${prContext.repo.owner}/${prContext.repo.name}/copilot/suggestions?pr=${prContext.number}`;
    const response = await _makeRequest("GET", path, token);
    return _normalizeSuggestions(response.suggestions || []);
  } catch (error) {
    console.error("Failed to get Copilot suggestions:", error.message);
    return [];
  }
}

module.exports = {
  trigger,
  poll,
  getSuggestions,
  _normalizeSuggestions,
  _mapPriority,
  _categorizeIssue,
};
