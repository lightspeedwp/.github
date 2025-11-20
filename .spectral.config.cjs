/**
 * Enhanced Spectral Configuration for YAML/JSON Linting
 *
 * Spectral is a JSON/YAML linter with support for OpenAPI, AsyncAPI, and custom rulesets.
 * This configuration provides:
 * - Base Spectral recommended rules
 * - Custom GitHub Actions validation
 * - YAML/JSON structure validation
 * - Environment variable overrides for CI/CD customization
 * - Modular ruleset includes
 *
 * Environment Variables:
 * - SPECTRAL_STRICT_MODE: Enable strict validation (default: false)
 * - SPECTRAL_GITHUB_ACTIONS: Enable GitHub Actions rules (default: true)
 * - SPECTRAL_OPENAPI: Enable OpenAPI rules (default: false)
 * - SPECTRAL_CUSTOM_RULES: Path to custom rules directory
 *
 * File exclusions are handled via .spectralignore (Spectral's native ignore mechanism)
 */

/**
 * Load environment variables with fallback defaults
 */
require("dotenv").config();

/**
 * Import Spectral built-in functions
 * These functions provide common validation logic for rules
 */
const {
  truthy,
  falsy,
  length,
  pattern,
  enumeration,
  schema,
} = require("@stoplight/spectral-functions");

/**
 * Configuration constants with environment variable overrides
 */
const strictMode = process.env.SPECTRAL_STRICT_MODE === "true";
const enableGitHubActions = process.env.SPECTRAL_GITHUB_ACTIONS !== "false";
const enableOpenAPI = process.env.SPECTRAL_OPENAPI === "true";
const customRulesDir = process.env.SPECTRAL_CUSTOM_RULES;

/**
 * Dynamic extends array based on environment configuration
 */
const extendsRulesets = [
  "spectral:recommended",
  ...(enableOpenAPI ? ["spectral:oas"] : []),
  // Add AsyncAPI support if needed
  // ...(enableAsyncAPI ? ['spectral:asyncapi'] : [])
];

/**
 * Spectral Configuration Object
 *
 * @type {import('@stoplight/spectral-core').RulesetDefinition}
 */
module.exports = {
  /**
   * Extend base rulesets
   * Dynamically includes rulesets based on environment configuration
   */
  extends: extendsRulesets,

  /**
   * Include additional ruleset files
   * Allows modular configuration management
   */
  includes: [
    // Include custom rules if directory specified
    ...(customRulesDir ? [`${customRulesDir}/*.ruleset.json`] : []),
    // Include workflow-specific rules
    "./docs/config/spectral-workflows.ruleset.js",
    // Include JSON Schema validation rules
    "./docs/config/spectral-schemas.ruleset.js",
  ].filter(Boolean), // Remove undefined entries

  /**
   * Register custom functions for rule validation
   * Functions can be used in rule definitions for complex validation logic
   */
  functions: {
    truthy, // Validates that a field exists and has a truthy value
    falsy, // Validates that a field is falsy or doesn't exist
    length, // Validates array/string length
    pattern, // Validates against regex patterns
    enumeration, // Validates against allowed values
    schema, // Validates against JSON Schema

    /**
     * Custom function: Validate LightSpeedWP naming conventions
     */
    lightspeedNaming: function (input) {
      if (typeof input !== "string") return [];

      const issues = [];

      // Check for kebab-case in filenames
      if (!input.match(/^[a-z0-9]+(-[a-z0-9]+)*$/)) {
        issues.push({
          message: "Must use kebab-case for filenames",
          severity: "warn",
        });
      }

      return issues;
    },

    /**
     * Custom function: Validate GitHub Actions workflow structure
     */
    githubWorkflowValidation: function (input) {
      if (typeof input !== "object" || !input) return [];

      const issues = [];

      // Check for required fields
      if (!input.name) issues.push({ message: "Missing workflow name" });
      if (!input.on)
        issues.push({ message: "Missing trigger definition (on)" });
      if (!input.jobs) issues.push({ message: "Missing jobs definition" });

      return issues;
    },
  },

  /**
   * Custom rules for GitHub Actions workflows
   */
  ...(enableGitHubActions && {
    rules: {
      "workflow-name-required": {
        given: "$",
        message: "Workflow must have a name",
        then: {
          function: truthy,
          functionOptions: {
            property: "name",
          },
        },
      },
      "workflow-trigger-required": {
        given: "$",
        message: "Workflow must define triggers (on)",
        then: {
          function: truthy,
          functionOptions: {
            property: "on",
          },
        },
      },
      "workflow-jobs-required": {
        given: "$",
        message: "Workflow must define jobs",
        then: {
          function: truthy,
          functionOptions: {
            property: "jobs",
          },
        },
      },
      "action-description-required": {
        given: "$.description",
        message: "Action must have a description",
        then: {
          function: truthy,
        },
      },
    },
  }),

  /**
   * Environment variable overrides
   */
  env: {
    strictMode,
    enableGitHubActions,
    enableOpenAPI,
    customRulesDir,
  },
};
