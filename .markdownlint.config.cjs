/**
 * Markdownlint Configuration for LightSpeedWP Documentation Standards
 *
 * Markdownlint enforces consistent Markdown formatting across documentation.
 * This configuration provides:
 * - Comprehensive rule set for professional documentation
 * - Environment variable overrides for CI/CD customization
 * - Ignore patterns for generated content
 * - Custom functions for organization-specific validation
 *
 * Environment Variables:
 * - MARKDOWNLINT_LINE_LENGTH: Override max line length (default: 120)
 * - MARKDOWNLINT_STRICT: Enable strict mode for CI (default: false)
 * - MARKDOWNLINT_IGNORE_GENERATED: Ignore auto-generated files (default: true)
 */

/**
 * Load environment variables with fallback defaults
 */
require("dotenv").config();

const fs = require("fs");
const path = require("path");

/**
 * Configuration constants with environment variable overrides
 */
const lineLength = parseInt(process.env.MARKDOWNLINT_LINE_LENGTH) || 120;
const strictMode = process.env.MARKDOWNLINT_STRICT === "true";
const ignoreGenerated = process.env.MARKDOWNLINT_IGNORE_GENERATED !== "false";

/**
 * Load ignore patterns from .markdownlintignore file
 */
function loadIgnorePatterns() {
  const ignoreFilePath = path.join(__dirname, ".markdownlintignore");

  if (!fs.existsSync(ignoreFilePath)) {
    return [];
  }

  try {
    const content = fs.readFileSync(ignoreFilePath, "utf-8");
    return content
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"))
      .map((line) => {
        // Convert bare filenames to glob patterns
        if (!line.includes("/") && !line.includes("*")) {
          return `**/${line}`;
        }
        return line;
      });
  } catch (error) {
    console.warn("Could not read .markdownlintignore:", error.message);
    return [];
  }
}

/**
 * Markdownlint Configuration Object
 *
 * @type {import('markdownlint').Configuration}
 */
module.exports = {
  /**
   * Use default rules as base (enables most common formatting rules)
   */
  default: true,

  /**
   * Files and directories to ignore
   * These patterns are loaded from .markdownlintignore (canonical source)
   */
  ignorePaths: [
    ...loadIgnorePatterns(),
  ],

  /**
   * Specific files to ignore (supports glob patterns)
   */
  ignoreFiles: ["README.template.md", "*.draft.md"],

  /**
   * Rule customizations
   * Each rule can be enabled (true), disabled (false), or configured with options
   */
  rules: {
    /**
     * MD013 - Line length limit
     * DISABLED - Line length enforcement removed per project requirements
     */
    MD013: false,

    /**
     * MD025 - Single title/single H1
     * DISABLED: Technical documentation often needs multiple H1 headers for structure.
     */
    MD025: false,

    /**
     * MD036 - No emphasis as heading
     * DISABLED: Some documentation uses emphasis for section markers.
     */
    MD036: false,

    /**
     * MD033 - Inline HTML
     * Allow HTML in Markdown for enhanced formatting
     */
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
      ],
    },

    /**
     * MD041 - First line in file should be a top-level heading
     * Disabled to allow frontmatter and other content before headings
     */
    MD041: false,

    /**
     * MD024 - Multiple headings with the same content
     * DISABLED: Technical docs often reuse heading names in different sections.
     */
    MD024: false,

    /**
     * MD029 - Ordered list item prefix
     * Enforce consistent numbering (1. 2. 3. vs 1. 1. 1.)
     */
    MD029: {
      style: "ordered",
    },

    /**
     * MD040 - Fenced code blocks should have a language specified
     * Require language tags for syntax highlighting
     */
    MD040: strictMode,

    /**
     * MD046 - Code block style
     * Prefer fenced code blocks over indented
     */
    MD046: {
      style: "fenced",
    },

    /**
     * MD049 - Emphasis style
     * Use asterisks for emphasis instead of underscores
     */
    MD049: {
      style: "asterisk",
    },

    /**
     * MD050 - Strong style
     * Use asterisks for strong text instead of underscores
     */
    MD050: {
      style: "asterisk",
    },

    /**
     * MD060 - Table column style
     * DISABLED: Flexible table formatting for readability.
     */
    MD060: false,
  },

  /**
   * Custom functions for advanced validation
   * These can be used in custom rules for organization-specific checks
   */
  functions: {
    /**
     * Check for LightSpeedWP branding consistency
     */
    checkBranding: function (token, content) {
      const brandingTerms = ["lightspeed", "light speed", "light-speed"];
      const correctTerm = "LightSpeedWP";

      for (const term of brandingTerms) {
        if (
          content.toLowerCase().includes(term) &&
          !content.includes(correctTerm)
        ) {
          return {
            lineNumber: token.lineNumber,
            detail: `Use '${correctTerm}' for consistent branding`,
          };
        }
      }
      return null;
    },
  },

  /**
   * Extends additional rulesets
   * Can reference external ruleset files or npm packages
   */
  extends: [
    // Example: '@lightspeedwp/markdownlint-config' - if we had an org package
  ],

  /**
   * Include additional configuration files
   * Allows modular configuration management
   */
  includes: [
    // Example: './docs/markdownlint-docs.config.js' - for docs-specific rules
  ],
};
