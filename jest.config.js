require('dotenv').config();
// Jest configuration for TypeScript testing
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { defaults: tsjPreset } = require('ts-jest/presets'); // TypeScript Jest presets

module.exports = {
    testEnvironment: process.env.JEST_ENVIRONMENT || 'node',
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
    collectCoverage:
        process.env.JEST_COLLECT_COVERAGE === 'false' ? false : true,
    collectCoverageFrom: [
        process.env.JEST_COVERAGE_FROM_1 || 'src/**/*.{js,ts}',
        process.env.JEST_COVERAGE_FROM_2 || 'tests/**/*.{js,ts}',
    ],
    testPathIgnorePatterns: [
        process.env.JEST_IGNORE_PATTERN || '<rootDir>/node_modules/',
    ],
};
