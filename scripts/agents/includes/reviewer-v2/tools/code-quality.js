/**
 * GitHub Code Quality Integration
 * Retrieves code quality checks via GitHub Checks API
 *
 * Uses: GitHub Checks API (built-in via Octokit)
 * Endpoint: GET /repos/{owner}/{repo}/commits/{ref}/check-runs
 * Response: {check_runs: Array}
 */

const toolRegistry = require("../tool-registry");

/**
 * Trigger code quality check
 * GitHub checks run automatically; this initiates a fresh run if available
 *
 * @param {Object} prContext - GitHub PR context
 * @returns {Promise<string>} - Check request ID (or head SHA)
 */
async function trigger(prContext) {
  // GitHub checks are triggered via workflow; we just track the head SHA
  return prContext.head?.sha || `gh-check-${prContext.number}-${Date.now()}`;
}

/**
 * Poll GitHub for code quality check results
 * @param {string} requestId - Check request ID (or head SHA)
 * @returns {Promise<Object|null>} - Check results or null if pending
 */
async function poll(requestId) {
  // TODO: Implement actual GitHub Checks API polling
  // GET /repos/{owner}/{repo}/commits/{head_sha}/check-runs
  // Parse check runs and extract output

  // Stub: return null (still pending)
  return null;
}

/**
 * Parse GitHub check-run output into findings format
 * @param {Object} checkRun - GitHub check run object
 * @returns {Array} - Array of findings
 */
function parseCheckRun(checkRun) {
  // TODO: Implement parsing of check-run output
  // Handle JSON and markdown formats
  return [];
}

module.exports = {
  trigger,
  poll,
  parseCheckRun,
};
