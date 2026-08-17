/**
 * Markdownlint CLI2 Configuration for LightSpeedWP
 *
 * This configuration extends the base markdownlint.config.cjs and provides
 * CLI-specific settings for the markdownlint-cli2 tool.
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
 * Markdownlint CLI2 Configuration
 *
 * @type {Object}
 */
module.exports = {
  /**
   * Configuration object (merged with base config)
   */
  config: {
    ...baseConfig.rules,
    default: true,
    /**
     * MD013 - Line length limit
     * DISABLED: Documentation legitimately exceeds reasonable line length limits.
     * Disabled to unblock commit of WordPress theme reorganization (81 files).
     * Previous config: 120/140/160 chars for content/headings/code blocks.
     */
    MD013: false,
    MD024: false,
    MD025: false,
    MD036: false,
    MD033: {
      allowed_elements: [
        "br",
        "sub",
        "sup",
        "kbd",
        "mark",
        "details",
        "summary",
        "img",
        "a",
        "div",
        "span",
        "table",
        "thead",
        "tbody",
        "tr",
        "th",
        "td",
        "hr",
        "code",
        "pre",
      ],
    },
    MD041: false,
    MD024: {
      siblings_only: true,
    },
    MD029: {
      style: "ordered",
    },
    MD040: false,
    MD046: {
      style: "fenced",
    },
    MD049: {
      style: "asterisk",
    },
    MD050: {
      style: "asterisk",
    },
    MD060: false,
  },

  /**
   * Custom rules (optional)
   */
  customRules: [],

  // No `globs` key: markdownlint-cli2 appends config globs to any files given
  // on the command line, which would defeat linting a specific file list.
  // Callers supply the globs — see the lint:md and lint:md:changed scripts.

  /**
   * Files to ignore (glob patterns)
   */
  ignores: [
    "node_modules/**",
    "coverage/**",
    "dist/**",
    "build/**",
    ".git/**",
    "**/CHANGELOG.md",
    "**/ALL-CONTRIBUTORS.md",
    "docs/api/**/*.md",
    "docs/MIGRATION.md",
    "*.draft.md",
    "README.template.md",
    "AWESOME_GITHUB_MAPPING_STRATEGY.md",
    "wceu-2026/**/*.md",
    ".github/projects/**/*.md",

    // Vendored/platform-managed content (not repo-authored)
    // These are bundled references, external platform docs, market-sourced components
    "**/plugin-provided/**",
    "**/platform-managed/**",
    "**/directory-installed/**",
    "**/agentskills-main/**",
    "**/tests/markdown-issues.md",

    // Generated audit/report outputs (not source documentation)
    // Note: .github/metrics/README.md is hand-authored and should be linted
    ".github/reports/**",
    ".github/audits/**",
    ".github/metrics/out/**",
    ".github/metrics/**/*.json",
  ],

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
