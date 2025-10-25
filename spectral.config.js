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
require('dotenv').config();

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
} = require('@stoplight/spectral-functions');

/**
 * Configuration constants with environment variable overrides
 */
const strictMode = process.env.SPECTRAL_STRICT_MODE === 'true';
const enableGitHubActions = process.env.SPECTRAL_GITHUB_ACTIONS !== 'false';
const enableOpenAPI = process.env.SPECTRAL_OPENAPI === 'true';
const customRulesDir = process.env.SPECTRAL_CUSTOM_RULES;

/**
 * Dynamic extends array based on environment configuration
 */
const extendsRulesets = [
    'spectral:recommended',
    ...(enableOpenAPI ? ['spectral:oas'] : []),
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
        './docs/config/spectral-workflows.ruleset.js',
        // Include JSON Schema validation rules
        './docs/config/spectral-schemas.ruleset.js',
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
            if (typeof input !== 'string') return [];

            const issues = [];

            // Check for consistent LightSpeedWP branding
            const brandingVariants =
                /\b(light\s*speed\s*wp?|lightspeed\s*wp?)\b/gi;
            if (
                brandingVariants.test(input) &&
                !/\bLightSpeedWP\b/.test(input)
            ) {
                issues.push({
                    message: 'Use consistent "LightSpeedWP" branding',
                });
            }

            return issues;
        },

        /**
         * Custom function: Validate GitHub Actions workflow structure
         */
        validateWorkflow: function (workflow) {
            const issues = [];

            // Check for required fields in GitHub Actions
            if (!workflow.on) {
                issues.push({
                    message: 'Workflow must define trigger events (on)',
                });
            }

            if (!workflow.jobs) {
                issues.push({ message: 'Workflow must define jobs' });
            }

            return issues;
        },
    },

    /**
     * Custom validation rules
     * Each rule defines validation logic for specific document patterns
     */
    rules: {
        /**
         * Ensure YAML/JSON documents are properly structured
         */
        'document-defined': true,

        /**
         * Prevent empty object keys (strict mode only)
         */
        'no-empty-keys': strictMode,

        /**
         * Allow GitHub Actions matrix expressions
         * GitHub Actions use ${{ matrix.* }} syntax which Spectral flags as unused
         */
        'no-unused-variables': false,

        /**
         * GitHub Actions specific rules (enabled by default)
         */
        ...(enableGitHubActions && {
            /**
             * GitHub Action workflows must have a name
             */
            'github-action-mandatory-name': {
                description: 'GitHub Action must have a descriptive name',
                given: '$.name',
                then: {
                    function: 'truthy',
                },
                severity: 'error',
            },

            /**
             * GitHub Action workflows should have proper trigger events
             */
            'github-action-triggers': {
                description:
                    'GitHub Action should define appropriate trigger events',
                given: '$',
                then: {
                    function: 'validateWorkflow',
                },
                severity: 'warn',
            },

            /**
             * GitHub Action jobs should have meaningful names
             */
            'github-action-job-names': {
                description: 'GitHub Action jobs should have descriptive names',
                given: '$.jobs.*',
                then: {
                    field: 'name',
                    function: 'truthy',
                },
                severity: 'info',
            },

            /**
             * GitHub Action steps should have names for clarity
             */
            'github-action-step-names': {
                description:
                    'GitHub Action steps should have descriptive names',
                given: '$.jobs.*.steps[*]',
                then: {
                    field: 'name',
                    function: 'truthy',
                },
                severity: strictMode ? 'warn' : 'info',
            },
        }),

        /**
         * LightSpeedWP branding consistency
         */
        'lightspeed-branding': {
            description: 'Use consistent LightSpeedWP branding',
            given: '$..description',
            then: {
                function: 'lightspeedNaming',
            },
            severity: 'info',
        },

        /**
         * YAML structure validation
         */
        'yaml-structure': {
            description: 'YAML files should follow proper structure',
            given: '$',
            then: {
                function: 'schema',
                functionOptions: {
                    schema: {
                        type: 'object',
                        additionalProperties: true,
                        not: {
                            type: 'null',
                        },
                    },
                },
            },
            severity: 'error',
        },

        /**
         * Consistent indentation (strict mode only)
         */
        'consistent-indentation': strictMode
            ? {
                  description: 'YAML should use consistent 2-space indentation',
                  given: '$',
                  then: {
                      function: 'pattern',
                      functionOptions: {
                          match: '^(?:  )*[^ ]',
                      },
                  },
                  severity: 'warn',
              }
            : false,
    },
};
