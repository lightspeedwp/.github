/**
 * Load environment variables from .env file
 * Enables configuration customization via environment variables
 */
import 'dotenv/config';
import js from '@eslint/js';
import ts from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';

/**
 * Generate ignore patterns for ESLint
 *
 * Supports environment variable override via ESLINT_IGNORE (comma-separated list)
 * Default patterns exclude build artifacts, dependencies, and template files
 *
 * @type {string[]} Array of glob patterns to ignore
 */
const ignoreFolders = process.env.ESLINT_IGNORE
    ? process.env.ESLINT_IGNORE.split(',')
    : [
          'node_modules/**', // Third-party dependencies
          'build/**', // Build output
          'dist/**', // Distribution files
          'coverage/**', // Test coverage reports
          'playwright-report/**', // E2E test reports
          'test-results/**', // Test artifacts
          'vendor/**', // Vendor libraries
          '.next/**', // Next.js build cache
          'logs/**', // Application logs
          'tmp/**', // Temporary files
          '.cache/**', // Cache directories
          '.husky/**', // Git hooks
          '.vercel/**', // Vercel deployment
          '.netlify/**', // Netlify deployment
          '.storybook/**', // Storybook build
          'docs/mustache-repo-templates/**', // Template files
          'scripts/utility/__tests__/**', // Test files
          'scripts/utility/__fixtures__/**', // Test fixtures
      ];

/**
 * ESLint Flat Configuration
 *
 * Uses the new flat config format (ESLint 9.0+) with:
 * - JavaScript recommended rules
 * - TypeScript recommended rules
 * - Prettier integration for code formatting
 * - Performance-optimized ignore patterns
 *
 * @type {import('eslint').Linter.FlatConfig[]}
 */
export default [
    // Apply JavaScript recommended rules as base configuration
    js.configs.recommended,

    // Spread TypeScript recommended rules (includes parser and plugin setup)
    ...ts.configs.recommended,

    {
        /**
         * Target JavaScript and TypeScript files across all module formats
         * Includes: .js, .jsx, .ts, .tsx, .cjs (CommonJS), .mjs (ES modules)
         */
        files: ['**/*.{js,jsx,ts,tsx,cjs,mjs}'],

        /**
         * Apply ignore patterns for performance optimization
         * Excludes build artifacts, dependencies, and template files
         */
        ignores: ignoreFolders,

        /**
         * Register Prettier plugin for code formatting integration
         * Allows ESLint to report Prettier formatting issues
         */
        plugins: { prettier },

        /**
         * Language options for JavaScript/TypeScript parsing
         * Enables Node.js globals (require, module, process, console, etc.)
         */
        languageOptions: {
            globals: {
                // Node.js globals
                require: 'readonly',
                module: 'readonly',
                exports: 'readonly',
                process: 'readonly',
                console: 'readonly',
                Buffer: 'readonly',
                __dirname: 'readonly',
                __filename: 'readonly',
                global: 'readonly',
                setTimeout: 'readonly',
                clearTimeout: 'readonly',
                setInterval: 'readonly',
                clearInterval: 'readonly',
                setImmediate: 'readonly',
                clearImmediate: 'readonly',
            },
        },

        /**
         * ESLint rules configuration
         * - prettier/prettier: Report Prettier formatting violations as warnings
         * - @typescript-eslint/no-require-imports: Allow require() in CommonJS files
         * - @typescript-eslint/no-unused-vars: Warn on unused variables instead of error
         * - no-useless-escape: Warn on unnecessary escape characters
         * - no-prototype-builtins: Warn on direct prototype method access
         */
        rules: {
            'prettier/prettier': 'warn', // Non-blocking formatting warnings
            '@typescript-eslint/no-require-imports': 'off', // Allow require() for CommonJS compatibility
            '@typescript-eslint/no-unused-vars': 'warn', // Warn on unused variables
            'no-useless-escape': 'warn', // Warn on unnecessary escape characters
            'no-prototype-builtins': 'warn', // Warn on prototype method access
        },
    },

    /**
     * Jest test file configuration
     * Adds Jest globals for test files and test helpers
     */
    {
        files: [
            '**/*.test.{js,jsx,ts,tsx}',
            '**/__tests__/**/*.{js,jsx,ts,tsx}',
            '**/test-helpers.{js,jsx,ts,tsx}',
            '**/tests/**/*.{js,jsx,ts,tsx}',
        ],
        languageOptions: {
            globals: {
                // Node.js globals (inherited from above but explicitly defined here)
                require: 'readonly',
                module: 'readonly',
                exports: 'readonly',
                process: 'readonly',
                console: 'readonly',
                global: 'readonly',
                // Jest globals
                describe: 'readonly',
                test: 'readonly',
                it: 'readonly',
                expect: 'readonly',
                jest: 'readonly',
                beforeAll: 'readonly',
                beforeEach: 'readonly',
                afterAll: 'readonly',
                afterEach: 'readonly',
                context: 'readonly',
            },
        },
        rules: {
            // Make unused vars warnings in test files for better developer experience
            '@typescript-eslint/no-unused-vars': 'warn',
        },
    },

    /**
     * GitHub Actions agent file configuration
     * Adds common globals used in GitHub Actions and agent scripts
     */
    {
        files: [
            '**/*.agent.{js,jsx,ts,tsx}',
            '.github/agents/**/*.{js,jsx,ts,tsx}',
        ],
        languageOptions: {
            globals: {
                // Node.js globals
                require: 'readonly',
                module: 'readonly',
                exports: 'readonly',
                process: 'readonly',
                console: 'readonly',
                __dirname: 'readonly',
                __filename: 'readonly',
                Buffer: 'readonly',
                // GitHub Actions globals
                core: 'readonly',
                github: 'readonly',
                context: 'readonly',
                // Common agent script globals
                log: 'readonly',
                config: 'readonly',
                Octokit: 'readonly',
                path: 'readonly',
                fs: 'readonly',
            },
        },
        rules: {
            // Be more lenient with agent files as they may have incomplete implementations
            '@typescript-eslint/no-unused-vars': 'warn',
            'no-undef': 'warn', // Warn instead of error for undefined variables
            'no-redeclare': 'warn', // Warn instead of error for redeclarations
        },
    },
];
