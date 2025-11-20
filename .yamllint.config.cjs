/**
 * Enhanced Yamllint Configuration for LightSpeedWP
 *
 * NOTE: yamllint is a Python tool that natively uses YAML configuration files.
 * This JavaScript configuration is provided for:
 * - Documentation and reference purposes
 * - Potential future JavaScript-based YAML linting tools
 * - Integration with Node.js build processes
 * - Environment variable customization for CI/CD
 *
 * To use with yamllint, this configuration would need to be converted to YAML format.
 * For direct yamllint usage, refer to the .yamllint file in the repository root.
 *
 * Environment Variables:
 * - YAMLLINT_LINE_LENGTH: Maximum line length (default: 120)
 * - YAMLLINT_INDENT_SPACES: Number of spaces for indentation (default: 2)
 * - YAMLLINT_STRICT_MODE: Enable strict mode (default: false)
 * - YAMLLINT_IGNORE_PATTERNS: Comma-separated ignore patterns
 * - YAMLLINT_COMMENTS_INDENT_DISABLE: Disable comment indentation checks (default: true)
 * - YAMLLINT_DOCUMENT_START_DISABLE: Disable document start checks (default: true)
 * - YAMLLINT_TRAILING_SPACES_DISABLE: Disable trailing spaces checks (default: true)
 */

/**
 * Load environment variables with fallback defaults
 */
require("dotenv").config();

/**
 * Configuration constants with environment variable overrides
 */
const lineLength = process.env.YAMLLINT_LINE_LENGTH
  ? parseInt(process.env.YAMLLINT_LINE_LENGTH, 10)
  : 120;

const indentSpaces = process.env.YAMLLINT_INDENT_SPACES
  ? parseInt(process.env.YAMLLINT_INDENT_SPACES, 10)
  : 2;

const strictMode = process.env.YAMLLINT_STRICT_MODE === "true";

const ignorePatterns = process.env.YAMLLINT_IGNORE_PATTERNS
  ? process.env.YAMLLINT_IGNORE_PATTERNS.split(",").map((p) => p.trim())
  : [
      "*.min.yml",
      "*.min.yaml",
      "node_modules/**/*.yml",
      "node_modules/**/*.yaml",
      "vendor/**/*.yml",
      "vendor/**/*.yaml",
      ".git/**/*.yml",
      ".git/**/*.yaml",
    ];

const commentsIndentDisable =
  process.env.YAMLLINT_COMMENTS_INDENT_DISABLE !== "false";
const documentStartDisable =
  process.env.YAMLLINT_DOCUMENT_START_DISABLE !== "false";
const trailingSpacesDisable =
  process.env.YAMLLINT_TRAILING_SPACES_DISABLE !== "false";

/**
 * Custom validation functions for YAML content
 */
const customValidation = {
  /**
   * Validate GitHub workflow syntax
   */
  validateWorkflow: function (yamlContent) {
    const requiredWorkflowKeys = ["name", "on", "jobs"];
    const errors = [];

    try {
      const yaml = require("yaml");
      const parsed = yaml.parse(yamlContent);

      requiredWorkflowKeys.forEach((key) => {
        if (!parsed[key]) {
          errors.push(`Missing required workflow key: ${key}`);
        }
      });
    } catch (e) {
      errors.push(`YAML parsing error: ${e.message}`);
    }

    return errors;
  },

  /**
   * Validate GitHub Actions syntax
   */
  validateAction: function (yamlContent) {
    const requiredActionKeys = ["name", "description", "runs"];
    const errors = [];

    try {
      const yaml = require("yaml");
      const parsed = yaml.parse(yamlContent);

      requiredActionKeys.forEach((key) => {
        if (!parsed[key]) {
          errors.push(`Missing required action key: ${key}`);
        }
      });
    } catch (e) {
      errors.push(`YAML parsing error: ${e.message}`);
    }

    return errors;
  },

  /**
   * Validate Docker Compose syntax
   */
  validateDockerCompose: function (yamlContent) {
    const errors = [];

    try {
      const yaml = require("yaml");
      const parsed = yaml.parse(yamlContent);

      if (!parsed.services) {
        errors.push("Missing required docker-compose key: services");
      }
    } catch (e) {
      errors.push(`YAML parsing error: ${e.message}`);
    }

    return errors;
  },

  /**
   * Validate LightSpeedWP specific YAML structures
   */
  validateLightSpeedWP: function (yamlContent, filename) {
    const errors = [];

    try {
      const yaml = require("yaml");
      const parsed = yaml.parse(yamlContent);

      // Check for frontmatter in markdown files
      if (filename && filename.endsWith(".md")) {
        if (!parsed["file_type"]) {
          errors.push(
            "Missing file_type in YAML frontmatter (required for LightSpeedWP)",
          );
        }
        if (!parsed["description"]) {
          errors.push("Missing description in YAML frontmatter (recommended)");
        }
      }

      // Check for required workflow fields
      if (filename && filename.includes("workflow")) {
        if (!parsed["name"]) errors.push("Missing workflow name");
        if (!parsed["on"]) errors.push("Missing workflow trigger (on)");
        if (!parsed["jobs"]) errors.push("Missing workflow jobs");
      }
    } catch (e) {
      errors.push(`YAML validation error: ${e.message}`);
    }

    return errors;
  },
};

/**
 * Generate yamllint compatible YAML configuration
 * This function can be used to export the configuration to YAML format
 */
function generateYamlConfig() {
  return {
    extends: "default",
    rules: {
      line_length: {
        max: lineLength,
        level: strictMode ? "error" : "warning",
      },
      indentation: {
        spaces: indentSpaces,
        level: "error",
      },
      comments: {
        min_spaces_from_content: 1,
      },
      comments_indentation: commentsIndentDisable ? "disable" : "enable",
      document_start: documentStartDisable ? "disable" : "enable",
      trailing_spaces: trailingSpacesDisable ? "disable" : "enable",
    },
    ignore: ignorePatterns,
  };
}

/**
 * Yamllint Configuration Object (CommonJS format)
 *
 * This configuration matches the .yamllint file but provides additional
 * JavaScript-based functionality for validation and customization.
 *
 * @typedef {Object} YamllintConfig
 * @property {Array<string>} ignorePaths - File paths to ignore during linting
 * @property {Array<string>} ignoreFiles - File patterns to ignore during linting
 * @property {Object} rules - Yamllint rule configuration with environment variable support
 * @property {Object} functions - Custom validation functions for specific YAML types
 * @property {string} extends - Base configuration that extends default yamllint rules
 * @property {Array<string>} plugins - Additional plugins for extended functionality
 * @property {Object} includes - Additional configuration includes and utilities
 */
module.exports = {
  /**
   * Configuration metadata
   */
  extends: "default",
  rules: {
    line_length: {
      max: lineLength,
      level: strictMode ? "error" : "warning",
    },
    indentation: {
      spaces: indentSpaces,
      level: "error",
    },
    comments: {
      min_spaces_from_content: 1,
    },
    comments_indentation: commentsIndentDisable ? "disable" : "enable",
    document_start: documentStartDisable ? "disable" : "enable",
    trailing_spaces: trailingSpacesDisable ? "disable" : "enable",
  },

  /**
   * Ignore patterns
   */
  ignore: ignorePatterns,

  /**
   * Custom validation functions
   */
  customValidation,

  /**
   * Export configuration generator
   */
  generateYamlConfig,

  /**
   * Environment variable overrides
   */
  env: {
    lineLength,
    indentSpaces,
    strictMode,
    ignorePatterns,
    commentsIndentDisable,
    documentStartDisable,
    trailingSpacesDisable,
  },
};
