/**
 * Reviewer Agent v2 - Orchestrator Module
 * Coordinates parallel tool triggering, polling, and result aggregation
 *
 * Responsibility:
 * - Load configuration and detect repo type
 * - Select which tools to run based on PR characteristics
 * - Trigger all tools in parallel with API calls
 * - Implement polling logic with exponential backoff (10s → 20s → 40s, max 60s)
 * - Aggregate results from all tools
 * - Handle timeouts and tool failures gracefully
 */

const toolRegistry = require("./tool-registry");

class Orchestrator {
  constructor(config = {}) {
    this.config = config;
    this.defaultPollingIntervals = [10000, 20000, 40000]; // ms
    this.maxPollingInterval = 60000; // ms
    this.reviewTimeout = 30 * 60 * 1000; // 30 minutes
  }

  /**
   * Select tools to run based on PR characteristics
   * Decision criteria:
   * - PR size (lines changed)
   * - File types (JS, PHP, etc.)
   * - Repository type (.github, WordPress plugin, etc.)
   *
   * @param {Object} prContext - GitHub PR context
   * @param {Object} config - Configuration object
   * @returns {string[]} - Array of tool names to run
   */
  selectTools(prContext, config) {
    const selectedTools = [];

    if (!prContext) {
      return selectedTools;
    }

    const prSize = prContext.additions + prContext.deletions;
    const files = prContext.files || [];
    const repoType = config.repo_type || "github";

    // CodeRabbit: Universal, good for all PR sizes
    if (config.tools?.coderabbit?.enabled !== false) {
      selectedTools.push("coderabbit");
    }

    // GitHub Code Quality: Native checks, always available
    if (config.tools?.code_quality?.enabled !== false) {
      selectedTools.push("code-quality");
    }

    // Copilot: Enhanced suggestions for larger PRs
    if (
      config.tools?.copilot?.enabled !== false &&
      prSize > 50 &&
      files.some((f) => this._isCodeFile(f.filename))
    ) {
      selectedTools.push("copilot");
    }

    // WordPress-specific: PHP linters for WordPress repos
    if (
      repoType.includes("wordpress") &&
      config.wordpress_categories?.enabled !== false &&
      files.some((f) => f.filename.endsWith(".php"))
    ) {
      selectedTools.push("wordpress-quality");
    }

    return selectedTools;
  }

  /**
   * Determine if a file is a code file (not docs, config, etc.)
   * @private
   */
  _isCodeFile(filename) {
    const codeExtensions = [
      ".js",
      ".ts",
      ".tsx",
      ".jsx",
      ".php",
      ".py",
      ".go",
      ".rs",
      ".java",
    ];
    return codeExtensions.some((ext) => filename.endsWith(ext));
  }

  /**
   * Trigger all selected tools in parallel
   * Returns tool request tracking objects (for polling)
   *
   * @param {string[]} tools - Tool names to trigger
   * @param {Object} prContext - GitHub PR context
   * @returns {Promise<Object>} - {toolName: requestId} mapping
   */
  async triggerTools(tools, prContext) {
    const requests = {};

    const promises = tools.map(async (toolName) => {
      try {
        const tool = toolRegistry.getTool(toolName);
        if (!tool) {
          console.warn(`Tool not found: ${toolName}`);
          return;
        }

        const requestId = await tool.trigger(prContext);
        requests[toolName] = requestId;
      } catch (error) {
        console.error(`Failed to trigger tool ${toolName}:`, error.message);
      }
    });

    await Promise.all(promises);
    return requests;
  }

  /**
   * Poll tool for results with exponential backoff
   * Stops when results available or timeout exceeded
   *
   * @private
   * @param {string} toolName - Tool to poll
   * @param {string} requestId - Request identifier from trigger()
   * @param {number} maxWaitMs - Maximum wait time
   * @returns {Promise<Object|null>} - Results or null on timeout
   */
  async _pollTool(toolName, requestId, maxWaitMs = this.reviewTimeout) {
    const tool = toolRegistry.getTool(toolName);
    if (!tool) return null;

    const startTime = Date.now();
    let intervalIndex = 0;

    while (Date.now() - startTime < maxWaitMs) {
      try {
        const result = await tool.poll(requestId);

        if (result && result.status === "completed") {
          return result;
        }

        // Wait before next poll
        const interval = this._getNextPollingInterval(intervalIndex);
        await new Promise((resolve) => setTimeout(resolve, interval));
        intervalIndex++;
      } catch (error) {
        console.error(`Error polling ${toolName}:`, error.message);
        const interval = this._getNextPollingInterval(intervalIndex);
        await new Promise((resolve) => setTimeout(resolve, interval));
        intervalIndex++;
      }
    }

    // Timeout reached
    console.warn(`Tool polling timeout for ${toolName}`);
    return null;
  }

  /**
   * Get next polling interval with exponential backoff
   * @private
   */
  _getNextPollingInterval(intervalIndex) {
    if (intervalIndex >= this.defaultPollingIntervals.length) {
      return this.maxPollingInterval;
    }
    return this.defaultPollingIntervals[intervalIndex];
  }

  /**
   * Collect results from all triggered tools
   * Uses graceful degradation: continues even if some tools fail
   *
   * @param {Object} requests - {toolName: requestId} mapping
   * @returns {Promise<Object>} - {toolName: results} with null for failures
   */
  async collectResults(requests) {
    const results = {};

    const promises = Object.entries(requests).map(
      async ([toolName, requestId]) => {
        try {
          const result = await this._pollTool(toolName, requestId);
          results[toolName] = result;
        } catch (error) {
          console.error(
            `Failed to collect results for ${toolName}:`,
            error.message,
          );
          results[toolName] = null;
        }
      },
    );

    await Promise.all(promises);
    return results;
  }

  /**
   * Main orchestration method: trigger and collect
   * Implements the complete flow: select → trigger → poll → aggregate
   *
   * @param {Object} prContext - GitHub PR context
   * @param {Object} config - Configuration object
   * @returns {Promise<Object>} - Aggregated results from all tools
   */
  async orchestrate(prContext, config) {
    const startTime = Date.now();

    // 1. Select tools based on PR characteristics
    const selectedTools = this.selectTools(prContext, config);
    if (selectedTools.length === 0) {
      console.warn("No tools selected for review");
      return {
        success: true,
        duration_ms: Date.now() - startTime,
        tools_triggered: [],
        results: {},
      };
    }

    // 2. Trigger all tools in parallel
    const requests = await this.triggerTools(selectedTools, prContext);

    if (Object.keys(requests).length === 0) {
      console.warn("Failed to trigger any tools");
      return {
        success: false,
        duration_ms: Date.now() - startTime,
        tools_triggered: selectedTools,
        results: {},
        error: "Failed to trigger any tools",
      };
    }

    // 3. Collect results from all tools
    const results = await this.collectResults(requests);

    // 4. Aggregate and return
    return {
      success: true,
      duration_ms: Date.now() - startTime,
      tools_triggered: Object.keys(requests),
      results,
    };
  }
}

module.exports = Orchestrator;
