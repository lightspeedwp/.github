/**
 * Load environment variables from .env file
 * Enables Jest configuration customization via environment variables
 */
require('dotenv').config();

/**
 * Import TypeScript Jest presets for TypeScript support
 * eslint-disable-next-line @typescript-eslint/no-require-imports - Required for CommonJS compatibility
 */
const { defaults: tsjPreset } = require('ts-jest/presets');

/**
 * Jest Configuration for JavaScript and TypeScript Testing
 *
 * This configuration provides:
 * - Cross-platform Node.js test environment
 * - TypeScript and JavaScript test discovery
 * - Babel transformation pipeline
 * - Code coverage collection and reporting
 * - Performance optimization through selective ignoring
 *
 * @type {import('jest').Config}
 */
module.exports = {
    /**
     * Test environment setup
     * 'node' provides Node.js globals and APIs for server-side testing
     * Override via JEST_ENVIRONMENT environment variable
     */
    testEnvironment: process.env.JEST_ENVIRONMENT || 'node',

    /**
     * Test file discovery patterns
     * Finds test files in multiple conventional locations:
     * - tests/ directory with .test.js/.test.ts extensions
     * - __tests__/ directories with .test.js/.test.ts extensions
     * Each pattern can be overridden via environment variables
     */
    testMatch: [
        process.env.JEST_TEST_MATCH_1 || '**/tests/**/*.test.js', // Standard tests directory (JS)
        process.env.JEST_TEST_MATCH_2 || '**/tests/**/*.test.ts', // Standard tests directory (TS)
        process.env.JEST_TEST_MATCH_3 || '**/__tests__/**/*.test.js', // Co-located tests (JS)
        process.env.JEST_TEST_MATCH_4 || '**/__tests__/**/*.test.ts', // Co-located tests (TS)
    ],

    /**
     * Enable verbose output for detailed test reporting
     * Shows individual test names and results
     * Set JEST_VERBOSE=false to disable
     */
    verbose: process.env.JEST_VERBOSE === 'false' ? false : true,

    /**
     * File transformation configuration
     * Transforms TypeScript and modern JavaScript using Babel
     * Matches .js, .jsx, .ts, .tsx file extensions
     */
    transform: {
        '^.+\\.[jt]sx?$': process.env.JEST_TRANSFORM || 'babel-jest',
    },

    /**
     * Supported module file extensions
     * Jest will resolve these extensions when importing modules
     */
    moduleFileExtensions: ['js', 'ts', 'jsx', 'tsx', 'json'],

    /**
     * Coverage report output directory
     * Override via JEST_COVERAGE_DIR environment variable
     */
    coverageDirectory: process.env.JEST_COVERAGE_DIR || './coverage',

    /**
     * Enable code coverage collection by default
     * Set JEST_COLLECT_COVERAGE=false to disable
     */
    collectCoverage:
        process.env.JEST_COLLECT_COVERAGE === 'false' ? false : true,

    /**
     * Code coverage collection patterns
     * Includes source files from multiple directories:
     * - src/ directory (main source code)
     * - tests/ directory (test utilities and helpers)
     * - __tests__/ directories (co-located source files)
     *
     * Excludes actual test files to focus on source code coverage
     */
    collectCoverageFrom: [
        process.env.JEST_COVERAGE_FROM_1 || 'src/**/*.{js,ts}', // Main source code
        process.env.JEST_COVERAGE_FROM_2 || 'tests/**/*.{js,ts}', // Test utilities
        process.env.JEST_COVERAGE_FROM_3 || '**/__tests__/**/*.{js,ts}', // Co-located source

        // Exclusion patterns: Remove test files from coverage calculation
        '!**/*.test.{js,ts}', // Standard test files
        '!**/*.spec.{js,ts}', // Specification test files
        '!**/test-*.{js,ts}', // Test helper files
    ],

    /**
     * Test execution ignore patterns
     * Excludes directories that don't contain tests or would cause issues:
     * - Build artifacts (dist, build, coverage)
     * - Dependencies (node_modules, vendor)
     * - Deployment files (.vercel, .netlify)
     * - Template files (docs/mustache-repo-templates)
     *
     * Uses <rootDir> prefix for absolute path matching
     */
    testPathIgnorePatterns: [
        process.env.JEST_IGNORE_PATTERN || '<rootDir>/node_modules/', // Default + custom override
        '<rootDir>/dist/', // Build output
        '<rootDir>/build/', // Alternative build output
        '<rootDir>/coverage/', // Coverage reports (avoid recursive testing)
        '<rootDir>/playwright-report/', // E2E test reports
        '<rootDir>/test-results/', // Test artifacts
        '<rootDir>/logs/', // Application logs
        '<rootDir>/tmp/', // Temporary files
        '<rootDir>/.cache/', // Cache directories
        '<rootDir>/.husky/', // Git hooks
        '<rootDir>/.vercel/', // Vercel deployment
        '<rootDir>/.netlify/', // Netlify deployment
        '<rootDir>/.storybook/', // Storybook build
        '<rootDir>/docs/mustache-repo-templates/', // Template files
    ],
};
