/**
 * GitHub Copilot Integration
 * Triggers and polls GitHub Copilot for code review suggestions
 *
 * Endpoint: /copilot/reviews (via GitHub CLI or REST API)
 * Response: {suggestions: Array}
 */

const toolRegistry = require("../tool-registry");

/**
 * Trigger Copilot review
 * @param {Object} prContext - GitHub PR context
 * @returns {Promise<string>} - Review request ID
 */
async function trigger(prContext) {
  const tokens = toolRegistry._resolveTokens();
  const token = tokens.copilot_token;

  if (!token) {
    throw new Error("COPILOT_API_TOKEN not configured");
  }

  // TODO: Implement actual Copilot API call
  // POST /copilot/reviews with PR context
  // Returns {id: string}

  // Stub: return mock request ID
  return `copilot-${prContext.number}-${Date.now()}`;
}

/**
 * Poll Copilot for review suggestions
 * @param {string} requestId - Review request ID
 * @returns {Promise<Object|null>} - Suggestions or null if pending
 */
async function poll(requestId) {
  const tokens = toolRegistry._resolveTokens();
  const token = tokens.copilot_token;

  if (!token) {
    throw new Error("COPILOT_API_TOKEN not configured");
  }

  // TODO: Implement actual Copilot polling
  // GET /copilot/reviews/{requestId}
  // Returns {status: 'pending' | 'completed', suggestions: Array}

  // Stub: return null (still pending)
  return null;
}

/**
 * Get Copilot suggestions from API
 * @param {string} token - GitHub API token
 * @returns {Promise<Array>} - Copilot suggestions
 */
async function getSuggestions(token) {
  // TODO: Implement actual suggestion retrieval
  return [];
}

module.exports = {
  trigger,
  poll,
  getSuggestions,
};
