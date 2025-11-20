/**
 * Load environment variables from .env file
 * Enables configuration customization via environment variables
 */
import 'dotenv/config';
import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
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
    // Global ignores apply to all configurations
    {
        ignores: ignoreFolders,
    },
    // Base JavaScript recommended rules
    js.configs.recommended,
    // TypeScript specific configuration
    {
        files: ['**/*.ts', '**/*.tsx'],
        files: ['**/*.ts', '**/*.tsx'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 2024,
                sourceType: 'module',
            },
            globals: {
                ...globals.node,
                ...globals.es2021,
            },
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
            prettier,
        },
        // Merge recommended TypeScript rules
        rules: {
            ...tsPlugin.configs.recommended.rules,
            'prettier/prettier': 'warn',
        },
    },
    // JavaScript/CommonJS/ESM configuration
    {
        files: ['**/*.{js,jsx,cjs,mjs}'],
        plugins: { prettier },
        rules: {
            'prettier/prettier': 'warn',
        },
    },
];
