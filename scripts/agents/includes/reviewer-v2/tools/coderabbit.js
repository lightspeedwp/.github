/**
 * CodeRabbit Integration
 * Triggers and polls CodeRabbit API for PR reviews
 *
 * API: https://api.coderabbit.ai/
 * Endpoint: POST /api/pr-reviews
 * Response: {status: 'pending' | 'completed', findings: Array}
 */

const toolRegistry = require("../tool-registry");

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

  // TODO: Implement actual API call
  // POST to https://api.coderabbit.ai/api/pr-reviews with PR context
  // Returns {id: string}

  // Stub: return mock request ID
  return `coderabbit-${prContext.number}-${Date.now()}`;
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

  // TODO: Implement actual polling
  // GET /api/reviews/{requestId}
  // Returns {status: 'pending' | 'completed', findings: Array}

  // Stub: return null (still pending)
  return null;
}

module.exports = {
  trigger,
  poll,
};
