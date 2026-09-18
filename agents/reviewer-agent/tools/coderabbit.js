/**
 * CodeRabbit Integration
 * Triggers and polls CodeRabbit API for PR reviews
 *
 * API: https://api.coderabbit.ai/
 * Endpoint: POST /api/pr-reviews
 * Response: {status: 'pending' | 'completed', findings: Array}
 */

const https = require("https");
const toolRegistry = require("../tool-registry");

const CODERABBIT_API_HOST = "api.coderabbit.ai";
const CODERABBIT_API_VERSION = "v1";

/**
 * Make HTTPS request to CodeRabbit API
 * @private
 */
async function _makeRequest(method, path, token, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: CODERABBIT_API_HOST,
      path: `/${CODERABBIT_API_VERSION}${path}`,
      method,
      headers: {
        Authorization: `Bearer ${token}`,
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
              `CodeRabbit API error: ${res.statusCode} ${data}`,
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
      const error = new Error("CodeRabbit API request timeout");
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
 * Normalize CodeRabbit findings to standard format
 * @private
 */
function _normalizeFindings(rawFindings) {
  if (!Array.isArray(rawFindings)) {
    return [];
  }

  return rawFindings.map((finding) => ({
    id: `coderabbit-${finding.id || `${finding.file}-${finding.line}`}`,
    tool: "coderabbit",
    severity: _mapSeverity(finding.severity),
    category: _categorizeIssue(finding.type),
    file: finding.file,
    line: finding.line || 0,
    column: finding.column || 0,
    status: "open",
    resolved_in_commit: null,
    suggestion: finding.suggestion || finding.message || "",
    type: finding.type,
  }));
}

/**
 * Map CodeRabbit severity to standard levels
 * @private
 */
function _mapSeverity(severity) {
  const severityMap = {
    critical: "critical",
    high: "major",
    medium: "major",
    low: "minor",
    info: "minor",
  };
  return severityMap[severity?.toLowerCase()] || "minor";
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
    style: "style",
    lint: "style",
    accessibility: "accessibility",
    a11y: "accessibility",
    architecture: "architecture",
    logic: "architecture",
    test: "testing",
    documentation: "documentation",
    bug: "correctness",
    error: "correctness",
  };
  return categoryMap[issueType?.toLowerCase()] || "architecture";
}

/**
 * Trigger a CodeRabbit review
 * @param {Object} prContext - GitHub PR context
 * @returns {Promise<string>} - Review request ID
 */
async function trigger(prContext) {
  const tokens = toolRegistry._resolveTokens();
  const token = tokens.coderabbit_token;

  if (!token) {
    throw new Error("CODERABBIT_API_TOKEN not configured");
  }

  if (!prContext.repo || !prContext.number) {
    throw new Error("PR context missing required fields (repo, number)");
  }

  const payload = {
    repo: {
      owner: prContext.repo.owner,
      name: prContext.repo.name,
    },
    pr: {
      number: prContext.number,
      title: prContext.title,
      head_sha: prContext.head?.sha,
      base_sha: prContext.base?.sha,
    },
    files: (prContext.files || []).map((f) => ({
      filename: f.filename,
      patch: f.patch,
      additions: f.additions,
      deletions: f.deletions,
      status: f.status,
    })),
  };

  const response = await _makeRequest("POST", "/pr-reviews", token, payload);

  if (!response.id) {
    throw new Error("CodeRabbit API response missing review ID");
  }

  return response.id;
}

/**
 * Poll CodeRabbit for review results
 * @param {string} requestId - Review request ID
 * @returns {Promise<Object|null>} - Review result or null if pending
 */
async function poll(requestId) {
  const tokens = toolRegistry._resolveTokens();
  const token = tokens.coderabbit_token;

  if (!token) {
    throw new Error("CODERABBIT_API_TOKEN not configured");
  }

  const response = await _makeRequest("GET", `/pr-reviews/${requestId}`, token);

  if (response.status === "completed" || response.status === "success") {
    return {
      status: "completed",
      findings: _normalizeFindings(response.findings || []),
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
      `CodeRabbit review failed: ${response.error || response.message}`,
    );
  }

  // Unknown status, treat as pending
  return {
    status: "pending",
    findings: [],
  };
}

module.exports = {
  trigger,
  poll,
  _normalizeFindings,
  _mapSeverity,
  _categorizeIssue,
};
