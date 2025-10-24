/**
 * Central Spectral Configuration for YAML/JSON Linting
 *
 * Spectral is a JSON/YAML linter with support for OpenAPI, AsyncAPI, and custom rulesets.
 * This configuration provides:
 * - Base Spectral recommended rules
 * - Custom GitHub Actions validation
 * - YAML/JSON structure validation
 *
 * File exclusions are handled via .spectralignore (Spectral's native ignore mechanism)
 * Additional dynamic filtering could be added via wrapper scripts if needed.
 */

/**
 * Import Spectral built-in functions
 * These functions provide common validation logic for rules
 */
const { truthy } = require('@stoplight/spectral-functions');

/**
 * Spectral Configuration Object
 *
 * @type {import('@stoplight/spectral-core').RulesetDefinition}
 */
module.exports = {
    /**
     * Extend base rulesets
     * 'spectral:recommended' provides common YAML/JSON validation rules
     */
    extends: ['spectral:recommended'],

    /**
     * Register custom functions for rule validation
     * Functions can be used in rule definitions for complex validation logic
     */
    functions: {
        truthy, // Validates that a field exists and has a truthy value
    },

    /**
     * Custom validation rules
     * Each rule defines validation logic for specific document patterns
     */
    rules: {
        /**
         * Ensure YAML/JSON documents are properly structured
         * Validates that documents have required root elements
         */
        'document-defined': true,

        /**
         * Prevent empty object keys
         * Catches common YAML formatting issues
         */
        'no-empty-keys': true,

        /**
         * Allow GitHub Actions matrix expressions
         * GitHub Actions use ${{ matrix.* }} syntax which Spectral flags as unused
         * Disabled to prevent false positives in workflow files
         */
        'no-unused-variables': false,

        /**
         * Custom rule: GitHub Action workflows must have a name
         * Ensures all workflow files include descriptive names
         *
         * Rule structure:
         * - description: Human-readable rule description
         * - given: JSONPath selector ($ = document root)
         * - then: Validation logic (field must be truthy)
         */
        'github-action-mandatory-name': {
            description: 'GitHub Action must have a name',
            given: '$', // Apply to document root
            then: {
                field: 'name', // Check 'name' field
                function: 'truthy', // Must exist and be truthy
            },
        },
    },
};
