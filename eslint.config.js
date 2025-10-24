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
         * ESLint rules configuration
         * - prettier/prettier: Report Prettier formatting violations as warnings
         */
        rules: {
            'prettier/prettier': 'warn', // Non-blocking formatting warnings
        },
    },
];
