/**
 * Spectral Configuration for YAML/JSON Linting
 *
 * Spectral is a JSON/YAML linter with support for OpenAPI, AsyncAPI, and custom rulesets.
 * This configuration provides:
 * - Base YAML validation
 * - Passes all non-workflow YAML files without errors
 *
 * For GitHub Actions workflow-specific validation, use lint:workflows which targets
 * only .github/workflows/*.yml files.
 *
 * File exclusions are handled via .spectralignore (Spectral's native ignore mechanism)
 *
 * @see https://docs.stoplight.io/docs/spectral/
 */

/**
 * Spectral Configuration Object
 *
 * @type {import('@stoplight/spectral-core').RulesetDefinition}
 */
module.exports = {
  /**
   * No extended rulesets - this is a minimal config for general YAML
   */
  extends: [],

  /**
   * No custom rules for general YAML files
   * Workflow-specific rules are in .spectral-workflows.yaml
   */
  rules: {},
};
