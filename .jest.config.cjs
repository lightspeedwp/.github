/**
 * Jest configuration (CommonJS) for JavaScript and TypeScript tests.
 * Uses Babel for transforming JS/TS; no ts-jest required.
 * Loaded via --config jest.config.cjs in package.json scripts.
 */
require('dotenv').config();

/** @type {import('jest').Config} */
module.exports = {
    // Switch to jsdom to provide window/localStorage, mitigating the SecurityError seen under node.
    testEnvironment: process.env.JEST_ENVIRONMENT || 'jsdom',
    // Provide a setup file that polyfills localStorage (defensive if environment overridden).
    setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.localstorage.js'],
    testMatch: [
        process.env.JEST_TEST_MATCH_1 || '**/tests/**/*.test.js',
        process.env.JEST_TEST_MATCH_2 || '**/tests/**/*.test.ts',
        process.env.JEST_TEST_MATCH_3 || '**/__tests__/**/*.test.js',
        process.env.JEST_TEST_MATCH_4 || '**/__tests__/**/*.test.ts',
    ],
    verbose: process.env.JEST_VERBOSE === 'false' ? false : true,
    transform: {
        '^.+\\.[jt]sx?$': process.env.JEST_TRANSFORM || 'babel-jest',
    },
    moduleFileExtensions: ['js', 'ts', 'jsx', 'tsx', 'json'],
    coverageDirectory: process.env.JEST_COVERAGE_DIR || './coverage',
    collectCoverage: process.env.JEST_COLLECT_COVERAGE === 'false' ? false : true,
    collectCoverageFrom: [
        process.env.JEST_COVERAGE_FROM_1 || 'src/**/*.{js,ts}',
        process.env.JEST_COVERAGE_FROM_2 || 'tests/**/*.{js,ts}',
        process.env.JEST_COVERAGE_FROM_3 || '**/__tests__/**/*.{js,ts}',
        '!**/*.test.{js,ts}',
        '!**/*.spec.{js,ts}',
        '!**/test-*.{js,ts}',
    ],
    testPathIgnorePatterns: [
        process.env.JEST_IGNORE_PATTERN || '<rootDir>/node_modules/',
        '<rootDir>/dist/',
        '<rootDir>/build/',
        '<rootDir>/coverage/',
        '<rootDir>/playwright-report/',
        '<rootDir>/test-results/',
        '<rootDir>/logs/',
        '<rootDir>/tmp/',
        '<rootDir>/.cache/',
        '<rootDir>/.husky/',
        '<rootDir>/.vercel/',
        '<rootDir>/.netlify/',
        '<rootDir>/.storybook/',
        '<rootDir>/docs/mustache-repo-templates/',
    ],
};
