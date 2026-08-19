/**
 * Markdownlint CLI2 Configuration for LightSpeedWP
 *
 * This configuration reuses the canonical base configuration and only defines
 * CLI2-specific behaviour (formatters and fix mode).
 *
 * @see https://github.com/DavidAnson/markdownlint-cli2
 * @see ./markdownlint.config.cjs for base configuration
 */

const path = require("path");

/**
 * Load base configuration from markdownlint.config.cjs
 */
let baseConfig = {};
try {
  const configPath = path.join(__dirname, ".markdownlint.config.cjs");
  const configModule = require(configPath);
  baseConfig = configModule || {};
} catch (error) {
  console.warn("Could not load markdownlint.config.cjs, using defaults");
}

/**
 * Markdownlint CLI2 configuration
 */
module.exports = {
  /**
   * Reuse canonical rules from .markdownlint.config.cjs
   */
  config: {
    default: true,
    ...(baseConfig.rules || {}),
  },

  /**
   * Custom rules (optional)
   */
  customRules: [],

  // No `globs` key: markdownlint-cli2 appends config globs to any files given
  // on the command line, which would defeat linting a specific file list.
  // Callers supply the globs — see the lint:md and lint:md:changed scripts.

  /**
   * Reuse ignore patterns from canonical base config
   */
  ignores: baseConfig.ignorePaths || [],

  /**
   * Fix mode (auto-fix violations where possible)
   */
  fix: false,

  /**
   * Output formatter
   */
  outputFormatters: [
    ["markdownlint-cli2-formatter-default"],
    // Uncomment for JSON output in CI
    // ['markdownlint-cli2-formatter-json', { name: 'markdownlint-results.json' }]
  ],
};
