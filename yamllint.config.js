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
require('dotenv').config();

/**
 * Configuration constants with environment variable overrides
 */
const lineLength = process.env.YAMLLINT_LINE_LENGTH
    ? parseInt(process.env.YAMLLINT_LINE_LENGTH, 10)
    : 120;

const indentSpaces = process.env.YAMLLINT_INDENT_SPACES
    ? parseInt(process.env.YAMLLINT_INDENT_SPACES, 10)
    : 2;

const strictMode = process.env.YAMLLINT_STRICT_MODE === 'true';

const ignorePatterns = process.env.YAMLLINT_IGNORE_PATTERNS
    ? process.env.YAMLLINT_IGNORE_PATTERNS.split(',').map((p) => p.trim())
    : [
          '*.min.yml',
          '*.min.yaml',
          'node_modules/**/*.yml',
          'node_modules/**/*.yaml',
          'vendor/**/*.yml',
          'vendor/**/*.yaml',
          '.git/**/*.yml',
          '.git/**/*.yaml',
      ];

const commentsIndentDisable =
    process.env.YAMLLINT_COMMENTS_INDENT_DISABLE !== 'false';
const documentStartDisable =
    process.env.YAMLLINT_DOCUMENT_START_DISABLE !== 'false';
const trailingSpacesDisable =
    process.env.YAMLLINT_TRAILING_SPACES_DISABLE !== 'false';

/**
 * Custom validation functions for YAML content
 */
const customValidation = {
    /**
     * Validate GitHub workflow syntax
     */
    validateWorkflow: function (yamlContent) {
        const requiredWorkflowKeys = ['name', 'on', 'jobs'];
        const errors = [];

        try {
            const yaml = require('yaml');
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
        const requiredActionKeys = ['name', 'description', 'runs'];
        const errors = [];

        try {
            const yaml = require('yaml');
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
            const yaml = require('yaml');
            const parsed = yaml.parse(yamlContent);

            if (!parsed.version && !parsed.services) {
                errors.push(
                    'Docker Compose file must have either version or services key'
                );
            }
        } catch (e) {
            errors.push(`YAML parsing error: ${e.message}`);
        }

        return errors;
    },

    /**
     * Validate LightSpeedWP specific YAML files
     */
    validateLightSpeedWP: function (yamlContent, filename) {
        const errors = [];

        // Label files validation
        if (
            filename.includes('labels.yml') ||
            filename.includes('labels.yaml')
        ) {
            try {
                const yaml = require('yaml');
                const parsed = yaml.parse(yamlContent);

                if (Array.isArray(parsed)) {
                    parsed.forEach((label, index) => {
                        if (!label.name || !label.color) {
                            errors.push(
                                `Label at index ${index} missing required 'name' or 'color' field`
                            );
                        }

                        // Validate color format (hex without #)
                        if (
                            label.color &&
                            !/^[0-9A-Fa-f]{6}$/.test(label.color)
                        ) {
                            errors.push(
                                `Label '${label.name}' has invalid color format: ${label.color}`
                            );
                        }
                    });
                }
            } catch (e) {
                errors.push(`YAML parsing error: ${e.message}`);
            }
        }

        return errors;
    },
};

/**
 * Generate yamllint compatible YAML configuration
 * This function can be used to export the configuration to YAML format
 */
function generateYamlConfig() {
    const yaml = require('yaml');

    const config = {
        extends: 'default',
        rules: {
            'line-length': {
                max: lineLength,
                level: strictMode ? 'error' : 'warning',
            },
            indentation: {
                spaces: indentSpaces,
                'indent-sequences': true,
                'check-multi-line-strings': false,
            },
            'key-duplicates': {
                level: 'error',
            },
            'new-line-at-end-of-file': {
                level: 'error',
            },
            'trailing-spaces': trailingSpacesDisable ? 'disable' : 'enable',
            'document-start': documentStartDisable ? 'disable' : 'enable',
            'document-end': 'disable',
            'comments-indentation': commentsIndentDisable
                ? 'disable'
                : 'enable',
            comments: {
                'min-spaces-from-content': 2,
            },
            brackets: {
                'min-spaces-inside': 0,
                'max-spaces-inside': 1,
            },
            braces: {
                'min-spaces-inside': 0,
                'max-spaces-inside': 1,
            },
            colons: {
                'max-spaces-before': 0,
                'max-spaces-after': 1,
            },
            commas: {
                'max-spaces-before': 0,
                'max-spaces-after': 1,
            },
            hyphens: {
                'max-spaces-after': 1,
            },
            'empty-lines': {
                max: 2,
                'max-start': 0,
                'max-end': 1,
            },
            'float-values': {
                'forbid-inf': true,
                'forbid-nan': true,
                'forbid-scientific-notation': false,
            },
            'key-ordering': 'disable',
            'octal-values': {
                'forbid-implicit-octal': true,
                'forbid-explicit-octal': false,
            },
            'quoted-strings': {
                'quote-type': 'any',
                required: 'only-when-needed',
            },
            truthy: {
                'allowed-values': ['true', 'false', 'yes', 'no'],
                'check-keys': true,
            },
        },
    };

    return yaml.stringify(config);
}

/**
 * Yamllint Configuration Object (JavaScript format)
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
     * File paths to ignore during linting
     * @type {Array<string>}
     */
    ignorePaths: [
        'node_modules/',
        'dist/',
        'build/',
        'coverage/',
        'vendor/',
        '.git/',
        'logs/',
        'tmp/',
        'temp/',
        '.cache/',
        '.nyc_output/',
        'public/',
        'static/',
        '.next/',
        '.nuxt/',
        '.vuepress/dist/',
        '.docusaurus/',
    ],

    /**
     * File patterns to ignore during linting
     * Supports environment variable customization
     * @type {Array<string>}
     */
    ignoreFiles: ignorePatterns,

    /**
     * Yamllint rule configuration with environment variable support
     * @type {Object}
     */
    rules: {
        /**
         * Line length configuration
         * Controls maximum line length for YAML files
         */
        'line-length': {
            max: lineLength,
            level: strictMode ? 'error' : 'warning',
            'allow-non-breakable-words': true,
            'allow-non-breakable-inline-mappings': true,
        },

        /**
         * Indentation configuration
         * Controls spacing and indentation rules
         */
        indentation: {
            spaces: indentSpaces,
            'indent-sequences': true,
            'check-multi-line-strings': false,
        },

        /**
         * Key and structure validation
         */
        'key-duplicates': {
            level: 'error',
        },
        'key-ordering': 'disable', // Allow flexible key ordering

        /**
         * File structure rules
         */
        'new-line-at-end-of-file': {
            level: 'error',
        },
        'trailing-spaces': trailingSpacesDisable ? 'disable' : 'enable',
        'document-start': documentStartDisable ? 'disable' : 'enable',
        'document-end': 'disable', // Don't require document end markers

        /**
         * Comment and formatting rules
         */
        'comments-indentation': commentsIndentDisable ? 'disable' : 'enable',
        comments: {
            'min-spaces-from-content': 2,
        },

        /**
         * Bracket and brace formatting
         */
        brackets: {
            'min-spaces-inside': 0,
            'max-spaces-inside': 1,
        },
        braces: {
            'min-spaces-inside': 0,
            'max-spaces-inside': 1,
        },

        /**
         * Punctuation spacing
         */
        colons: {
            'max-spaces-before': 0,
            'max-spaces-after': 1,
        },
        commas: {
            'max-spaces-before': 0,
            'max-spaces-after': 1,
        },
        hyphens: {
            'max-spaces-after': 1,
        },

        /**
         * Empty line management
         */
        'empty-lines': {
            max: 2,
            'max-start': 0,
            'max-end': 1,
        },

        /**
         * Value formatting rules
         */
        'float-values': {
            'forbid-inf': true,
            'forbid-nan': true,
            'forbid-scientific-notation': false,
        },
        'octal-values': {
            'forbid-implicit-octal': true,
            'forbid-explicit-octal': false,
        },
        'quoted-strings': {
            'quote-type': 'any',
            required: 'only-when-needed',
        },
        truthy: {
            'allowed-values': ['true', 'false', 'yes', 'no'],
            'check-keys': true,
        },
    },

    /**
     * Custom validation functions for specific YAML types
     * Extends yamllint with LightSpeedWP-specific validation
     * @type {Object}
     */
    functions: customValidation,

    /**
     * Base configuration - extends default yamllint rules
     * @type {string}
     */
    extends: 'default',

    /**
     * Additional plugins for extended functionality
     * @type {Array<string>}
     */
    plugins: [
        'yaml-validation',
        'github-actions-validator',
        'docker-compose-validator',
        'lightspeedwp-validator',
    ],

    /**
     * Additional configuration includes and utilities
     * @type {Object}
     */
    includes: {
        /**
         * Utility functions for configuration management
         */
        utils: {
            /**
             * Generate yamllint-compatible YAML configuration
             * Useful for exporting this config to native yamllint format
             */
            generateYamlConfig,

            /**
             * Validate environment variable configuration
             */
            validateEnvironment: function () {
                const warnings = [];

                if (lineLength < 80) {
                    warnings.push(
                        'Line length is set below 80 characters, which may be too restrictive'
                    );
                }

                if (indentSpaces !== 2 && indentSpaces !== 4) {
                    warnings.push(
                        'Indent spaces should typically be 2 or 4 for best compatibility'
                    );
                }

                return warnings;
            },

            /**
             * Get effective configuration values
             */
            getEffectiveConfig: function () {
                return {
                    lineLength,
                    indentSpaces,
                    strictMode,
                    ignorePatterns,
                    commentsIndentDisable,
                    documentStartDisable,
                    trailingSpacesDisable,
                };
            },
        },

        /**
         * Configuration metadata
         */
        meta: {
            name: 'LightSpeedWP Yamllint Configuration',
            version: '1.0.0',
            description:
                'Enhanced yamllint configuration with JavaScript integration',
            author: 'LightSpeedWP',
            homepage: 'https://github.com/lightspeedwp/.github',
            compatibility: {
                yamllint: '>=1.26.0',
                node: '>=14.0.0',
            },
            environmentVariables: {
                YAMLLINT_LINE_LENGTH: 'Maximum line length (default: 120)',
                YAMLLINT_INDENT_SPACES:
                    'Number of spaces for indentation (default: 2)',
                YAMLLINT_STRICT_MODE: 'Enable strict mode (default: false)',
                YAMLLINT_IGNORE_PATTERNS: 'Comma-separated ignore patterns',
                YAMLLINT_COMMENTS_INDENT_DISABLE:
                    'Disable comment indentation checks (default: true)',
                YAMLLINT_DOCUMENT_START_DISABLE:
                    'Disable document start checks (default: true)',
                YAMLLINT_TRAILING_SPACES_DISABLE:
                    'Disable trailing spaces checks (default: true)',
            },
        },
    },
};
