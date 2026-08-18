/**
 * Reviewer Agent v2 - Tool Registry
 * Unified interface for all code review tools
 *
 * Responsibility:
 * - Load available tools dynamically
 * - Resolve authentication tokens (hierarchy: env → repo secrets → defaults)
 * - Provide consistent interface for tool operations
 * - Handle tool availability checking
 */

const tools = {
  coderabbit: null,
  "code-quality": null,
  copilot: null,
  "wordpress-quality": null,
};

let tokensResolved = false;
let resolvedTokens = {};

/**
 * Resolve authentication tokens from environment variables
 * Priority: Organization env var > Repository secret > Fallback
 *
 * @private
 * @returns {Object} - Resolved tokens
 */
function _resolveTokens() {
  if (tokensResolved) {
    return resolvedTokens;
  }

  resolvedTokens = {
    coderabbit_token:
      process.env.ORG_CODERABBIT_API_TOKEN ||
      process.env.CODERABBIT_API_TOKEN ||
      "",
    github_token: process.env.GITHUB_TOKEN || "",
    copilot_token:
      process.env.COPILOT_API_TOKEN || process.env.GITHUB_TOKEN || "",
  };

  tokensResolved = true;
  return resolvedTokens;
}

/**
 * Load a tool module lazily
 * @private
 */
function _loadTool(toolName) {
  if (tools[toolName] !== null && tools[toolName] !== undefined) {
    return tools[toolName];
  }

  try {
    // Dynamically require tool modules
    const toolPath = `./tools/${toolName}`;
    tools[toolName] = require(toolPath);
    return tools[toolName];
  } catch (error) {
    console.error(`Failed to load tool ${toolName}:`, error.message);
    tools[toolName] = null;
    return null;
  }
}

/**
 * Get a tool instance by name
 * @param {string} toolName - Tool identifier
 * @returns {Object|null} - Tool module or null if unavailable
 */
function getTool(toolName) {
  if (!toolName || typeof toolName !== "string") {
    throw new Error("Invalid toolName: must be a non-empty string");
  }
  return _loadTool(toolName);
}

/**
 * Get available tools based on configuration
 * Checks both config enablement and token availability
 *
 * @param {Object} config - Configuration object with tool settings
 * @returns {string[]} - Array of available tool names
 */
function getAvailableTools(config = {}) {
  const tokens = _resolveTokens();
  const available = [];

  // Check each tool's availability
  const toolConfigs = {
    coderabbit: {
      name: "coderabbit",
      requiresToken: true,
      tokenKey: "coderabbit_token",
    },
    "code-quality": {
      name: "code-quality",
      requiresToken: false, // GitHub native, uses repo access
    },
    copilot: {
      name: "copilot",
      requiresToken: true,
      tokenKey: "copilot_token",
    },
    "wordpress-quality": {
      name: "wordpress-quality",
      requiresToken: false,
    },
  };

  for (const [key, toolConfig] of Object.entries(toolConfigs)) {
    // Check if tool is enabled in config
    const toolEnabled =
      config.tools?.[key.replace("-", "_")]?.enabled !== false;

    if (!toolEnabled) {
      continue;
    }

    // Check if required token is available
    if (toolConfig.requiresToken && !tokens[toolConfig.tokenKey]) {
      console.warn(
        `Tool ${key} enabled but token not available (${toolConfig.tokenKey})`,
      );
      continue;
    }

    // Try to load the tool
    const tool = _loadTool(key);
    if (tool) {
      available.push(key);
    }
  }

  return available;
}

/**
 * Call a tool method with unified error handling
 * Implements retry logic (max 3 retries) for transient failures
 *
 * @param {string} toolName - Tool identifier
 * @param {string} method - Method name (trigger, poll, etc.)
 * @param {Array} args - Arguments to pass to method
 * @param {number} maxRetries - Maximum retry attempts
 * @returns {Promise<*>} - Result from tool method
 */
async function callTool(toolName, method, args = [], maxRetries = 3) {
  const tool = getTool(toolName);
  if (!tool || !tool[method]) {
    throw new Error(`Tool ${toolName} or method ${method} not found`);
  }

  let lastError;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await tool[method](...args);
    } catch (error) {
      lastError = error;
      const isRetryable =
        error.status >= 500 ||
        error.code === "ETIMEDOUT" ||
        error.code === "ECONNRESET";
      if (!isRetryable || attempt === maxRetries - 1) {
        throw error;
      }
      // Exponential backoff: 100ms, 200ms, 400ms
      const delayMs = 100 * Math.pow(2, attempt);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  throw lastError;
}

/**
 * Set GitHub client for tools that need it (e.g., code-quality)
 * @param {Object} client - Octokit GitHub client instance
 */
function setGitHubClient(client) {
  if (!client) {
    throw new Error("GitHub client is required");
  }
  const codeQualityTool = _loadTool("code-quality");
  if (codeQualityTool && codeQualityTool.setGitHubClient) {
    codeQualityTool.setGitHubClient(client);
  }
}

module.exports = {
  getTool,
  getAvailableTools,
  callTool,
  setGitHubClient,
  _resolveTokens, // Export for testing
};
