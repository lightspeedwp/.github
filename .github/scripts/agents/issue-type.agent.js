/**
 * issue-type.agent.js
 * @deprecated This agent has been merged into labeling.agent.js (Dec 2024)
 * @module scripts/agents/issue-type.agent.js
 * @see ./labeling.agent.js for unified label and type management
 *
 * DEPRECATION NOTICE:
 * Issue type detection is now handled by the unified labeling agent.
 * This file is kept for backward compatibility only and will be removed in a future release.
 * Please update any references to use labeling.agent.js instead.
 *
 * Migration path:
 * - Old: issue-type.agent.js detectIssueType(content)
 * - New: labeling.agent.js detectIssueTypeFromContent(title, body)
 */

// Re-export from unified agent for backward compatibility
// Use dynamic import or CommonJS for Jest compatibility

let detectIssueTypeFromContent;
try {
  const labelingAgent = require("./labeling.agent.js");
  detectIssueTypeFromContent = labelingAgent.detectIssueTypeFromContent;
} catch (e) {
  // Fallback for ES module import
  // This will be handled at runtime when called as an agent
}

/**
 * @deprecated Use detectIssueTypeFromContent from labeling.agent.js
 * @param {string} content Issue or PR body/title text.
 * @returns {string|null} Canonical type label or null if none matched.
 */
function detectIssueType(content = "") {
  console.warn(
    "[DEPRECATED] issue-type.agent.js is deprecated. Use labeling.agent.js instead.",
  );
  // Split content naively for backward compatibility
  return detectIssueTypeFromContent(content, "");
}

/**
 * @deprecated Use runLabelingAgent from labeling.agent.js
 * @param {object} context Optional execution context.
 * @returns {Promise<object>} Summary payload.
 */
async function run(context = {}) {
  console.warn(
    "[DEPRECATED] issue-type.agent.js is deprecated. Use labeling.agent.js instead.",
  );
  return {
    ok: true,
    detected: detectIssueType(context.content || ""),
    deprecated: true,
    message: "This agent has been merged into labeling.agent.js",
  };
}

module.exports = {
  run,
  detectIssueType,
};

// TODO: Remove this shim once all consumers exclusively import labeling.agent.js.
