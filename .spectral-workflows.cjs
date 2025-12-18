/**
 * Spectral Configuration for GitHub Actions Workflow Validation
 *
 * This configuration provides workflow-specific rules for validating
 * GitHub Actions YAML files in .github/workflows/
 *
 * @see https://docs.stoplight.io/docs/spectral/
 */

const { truthy } = require("@stoplight/spectral-functions");

/**
 * Spectral Configuration Object
 *
 * @type {import('@stoplight/spectral-core').RulesetDefinition}
 */
module.exports = {
  /**
   * No extended rulesets
   */
  extends: [],

  /**
   * Custom rules for GitHub Actions workflows
   */
  rules: {
    /**
     * Validate that workflow files have a name
     */
    "workflow-name-required": {
      description: "Workflow must have a name",
      message: "Workflow must have a name property",
      severity: "warn",
      given: "$",
      then: {
        field: "name",
        function: truthy,
      },
    },

    /**
     * Validate that workflow files have triggers defined
     */
    "workflow-trigger-required": {
      description: "Workflow must define triggers",
      message: "Workflow must define triggers (on property)",
      severity: "error",
      given: "$",
      then: {
        field: "on",
        function: truthy,
      },
    },

    /**
     * Validate that workflow files have jobs defined
     */
    "workflow-jobs-required": {
      description: "Workflow must define jobs",
      message: "Workflow must define at least one job",
      severity: "error",
      given: "$",
      then: {
        field: "jobs",
        function: truthy,
      },
    },
  },
};
