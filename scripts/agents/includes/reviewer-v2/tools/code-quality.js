/**
 * GitHub Code Quality Integration
 * Retrieves code quality checks via GitHub Checks API
 *
 * Uses: GitHub Checks API (built-in via Octokit)
 * Endpoint: GET /repos/{owner}/{repo}/commits/{ref}/check-runs
 * Response: {check_runs: Array}
 */

// Module-level state for GitHub client (set by main agent)
let githubClient = null;

/**
 * Set the GitHub API client
 * Called by main agent during initialization
 */
function setGitHubClient(client) {
  githubClient = client;
}

/**
 * Parse GitHub check-run output into findings format
 * Handles both JSON and markdown formats
 * @private
 */
function _parseCheckRun(checkRun) {
  if (!checkRun || !checkRun.output) {
    return [];
  }

  const findings = [];
  const { output } = checkRun;

  // Try to parse JSON output first
  if (output.summary) {
    try {
      const summary = JSON.parse(output.summary);
      if (summary.findings && Array.isArray(summary.findings)) {
        return summary.findings.map((f) =>
          _normalizeCheckRunFinding(f, checkRun.name),
        );
      }
    } catch (e) {
      // Not JSON, try markdown parsing below
    }
  }

  // Parse markdown format (check-run text output)
  if (output.text) {
    const text = output.text;
    // Simple regex-based parsing for common patterns
    const lines = text.split("\n");
    let currentFile = null;

    for (const line of lines) {
      // Match file patterns like "src/app.js:42"
      const fileMatch = line.match(/^#+\s+(.+\.js|\.ts|\.py|\.php)(?::(\d+))?/);
      if (fileMatch) {
        currentFile = {
          filename: fileMatch[1],
          line: parseInt(fileMatch[2]) || 0,
        };
        continue;
      }

      // Match issue patterns
      const issueMatch = line.match(
        /^-\s+(\[.*?\])?\s*(.+?)(?:\s*\(([^)]+)\))?$/,
      );
      if (issueMatch && currentFile) {
        findings.push({
          id: `github-quality-${findings.length}`,
          tool: "code-quality",
          severity: _extractSeverity(line, issueMatch[3]),
          category: _extractCategory(issueMatch[2], checkRun.name),
          file: currentFile.filename,
          line: currentFile.line,
          status: "open",
          resolved_in_commit: null,
          suggestion: issueMatch[2],
          check_name: checkRun.name,
        });
      }
    }
  }

  return findings;
}

/**
 * Normalize check-run finding to standard format
 * @private
 */
function _normalizeCheckRunFinding(finding, checkName) {
  return {
    id: `github-quality-${finding.id || `${finding.file}-${finding.line}`}`,
    tool: "code-quality",
    severity: finding.severity || "minor",
    category: finding.category || "architecture",
    file: finding.file || "unknown",
    line: finding.line || 0,
    column: finding.column || 0,
    status: "open",
    resolved_in_commit: null,
    suggestion: finding.suggestion || finding.message || "",
    check_name: checkName,
  };
}

/**
 * Extract severity from markdown text
 * @private
 */
function _extractSeverity(text, context) {
  const lowerText = (text + (context || "")).toLowerCase();
  if (
    lowerText.includes("critical") ||
    lowerText.includes("error") ||
    lowerText.includes("must")
  ) {
    return "critical";
  }
  if (
    lowerText.includes("warning") ||
    lowerText.includes("major") ||
    lowerText.includes("should")
  ) {
    return "major";
  }
  return "minor";
}

/**
 * Extract category from issue text
 * @private
 */
function _extractCategory(issueText, checkName) {
  const lower = (issueText + (checkName || "")).toLowerCase();
  if (
    lower.includes("security") ||
    lower.includes("vulnerability") ||
    lower.includes("injection")
  ) {
    return "security";
  }
  if (lower.includes("performance") || lower.includes("speed")) {
    return "performance";
  }
  if (
    lower.includes("accessibility") ||
    lower.includes("a11y") ||
    lower.includes("wcag")
  ) {
    return "accessibility";
  }
  if (
    lower.includes("style") ||
    lower.includes("lint") ||
    lower.includes("format")
  ) {
    return "style";
  }
  if (lower.includes("test") || lower.includes("coverage")) {
    return "testing";
  }
  return "architecture";
}

/**
 * Trigger code quality check
 * GitHub checks run automatically; this returns the head SHA for polling
 *
 * @param {Object} prContext - GitHub PR context
 * @returns {Promise<string>} - Check request ID (head SHA)
 */
async function trigger(prContext) {
  // GitHub checks are triggered via workflow; we return the commit SHA
  if (!prContext.head?.sha) {
    throw new Error("PR context missing head SHA for code quality checks");
  }
  return prContext.head.sha;
}

/**
 * Poll GitHub for code quality check results
 * Fetches all check runs for a commit and extracts findings
 *
 * @param {string} requestId - Commit SHA to check
 * @param {Object} prContext - GitHub PR context (added for client context)
 * @returns {Promise<Object|null>} - Check results or null if pending
 */
async function poll(requestId, prContext = null) {
  if (!githubClient && !prContext) {
    // Return pending if we don't have a client (will be set by main agent)
    return {
      status: "pending",
      findings: [],
    };
  }

  try {
    const client = githubClient;
    if (!client || !prContext) {
      return {
        status: "pending",
        findings: [],
      };
    }

    // Fetch check runs for this commit
    const response = await client.rest.checks.listForRef({
      owner: prContext.repo.owner,
      repo: prContext.repo.name,
      ref: requestId,
    });

    if (!response.data || response.data.check_runs.length === 0) {
      // No checks yet, still pending
      return {
        status: "pending",
        findings: [],
      };
    }

    const checkRuns = response.data.check_runs;
    const findings = [];
    let allComplete = true;

    for (const checkRun of checkRuns) {
      // Skip checks that aren't code quality related
      if (!_isCodeQualityCheck(checkRun.name)) {
        continue;
      }

      if (checkRun.status !== "completed") {
        allComplete = false;
        continue;
      }

      const checkFindings = _parseCheckRun(checkRun);
      findings.push(...checkFindings);
    }

    // If all code quality checks are complete, return completed
    if (allComplete || findings.length > 0) {
      return {
        status: "completed",
        findings,
        check_runs_count: checkRuns.length,
      };
    }

    // Still waiting for checks
    return {
      status: "pending",
      findings: [],
    };
  } catch (error) {
    console.error("GitHub Code Quality check failed:", error.message);
    // Return as pending on error to allow retry
    return {
      status: "pending",
      findings: [],
      error: error.message,
    };
  }
}

/**
 * Determine if a check is code quality related
 * @private
 */
function _isCodeQualityCheck(checkName) {
  const qualityKeywords = [
    "lint",
    "eslint",
    "prettier",
    "code quality",
    "quality",
    "check",
    "test",
    "coverage",
    "static analysis",
  ];
  const lower = checkName?.toLowerCase() || "";
  return qualityKeywords.some((kw) => lower.includes(kw));
}

module.exports = {
  trigger,
  poll,
  setGitHubClient,
  _parseCheckRun,
  _isCodeQualityCheck,
  _extractSeverity,
  _extractCategory,
};
