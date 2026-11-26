/**
 * Jest configuration (CommonJS) for JavaScript and TypeScript tests.
 * Uses Babel for transforming JS/TS; no ts-jest required.
 * Supports both CommonJS and ES modules via Babel transformation.
 * Loaded via --config jest.config.cjs in package.json scripts.
 */
require('dotenv').config();

/** @type {import('jest').Config} */
module.exports = {
  // Switch to jsdom to provide window/localStorage, mitigating the SecurityError seen under node.
  testEnvironment: process.env.JEST_ENVIRONMENT || 'jsdom',
  // Provide a setup file that polyfills localStorage (defensive if environment overridden).
  setupFilesAfterEnv: [
    '<rootDir>/.github/tests/jest.setup.localstorage.js',
    // Names the running test file for the read tracer; a no-op unless a trace is being recorded.
    '<rootDir>/tests/jest.setup.read-trace.cjs',
  ],
  // Fail the run if any test writes into the repository (#3498).
  globalSetup: '<rootDir>/tests/jest.global-setup.cjs',
  globalTeardown: '<rootDir>/tests/jest.global-teardown.cjs',
  globals: {
    'babel-jest': {
      useESM: true,
    },
  },
  // Treat TypeScript as ESM so import.meta and top-level await work in tests (.mjs is already ESM)
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  testMatch: [
    process.env.JEST_TEST_MATCH_1 || '**/tests/**/*.test.js',
    process.env.JEST_TEST_MATCH_2 || '**/tests/**/*.test.ts',
    process.env.JEST_TEST_MATCH_3 || '**/tests/**/*.test.mjs',
    process.env.JEST_TEST_MATCH_4 || '**/__tests__/**/*.test.js',
    process.env.JEST_TEST_MATCH_5 || '**/__tests__/**/*.test.ts',
    process.env.JEST_TEST_MATCH_6 || '**/__tests__/**/*.test.mjs',
    // CommonJS suites (GIT-2913). A `.cjs` suite that uses `node:test` or its own harness is
    // excluded below and run by `npm run test:cjs-node` instead.
    process.env.JEST_TEST_MATCH_7 || '**/tests/**/*.test.cjs',
    process.env.JEST_TEST_MATCH_8 || '**/__tests__/**/*.test.cjs',
  ],
  verbose: process.env.JEST_VERBOSE === 'false' ? false : true,
  transform: {
    '^.+\\.(js|mjs|ts|tsx|jsx)?$': [
      process.env.JEST_TRANSFORM || 'babel-jest',
      { configFile: './babel.config.cjs' },
    ],
  },
  // Enable Babel to transform ES modules in scripts directory
  transformIgnorePatterns: [
    'node_modules/(?!(scripts|@actions|octokit|@octokit)/)',
    '<rootDir>/scripts/agents/includes/sync-version.js',
  ],
  // Module name mapper is disabled to allow proper .cjs resolution
  // moduleNameMapper: {
  //     '^(\.{1,2}/.*)\.js$': '$1',
  // },
  moduleFileExtensions: ['js', 'cjs', 'mjs', 'ts', 'tsx', 'jsx', 'json'],
  coverageDirectory: process.env.JEST_COVERAGE_DIR || './coverage',
  collectCoverage: process.env.JEST_COLLECT_COVERAGE === 'false' ? false : true,
  collectCoverageFrom: [
    process.env.JEST_COVERAGE_FROM_1 || 'scripts/**/*.js',
    process.env.JEST_COVERAGE_FROM_2 || 'tests/**/*.{js,ts,mjs}',
    process.env.JEST_COVERAGE_FROM_3 || '**/__tests__/**/*.{js,ts,mjs}',
    '!**/*.test.{js,ts,mjs}',
    '!**/*.spec.{js,ts,mjs}',
    '!**/test-*.{js,ts,mjs}',
  ],
  testPathIgnorePatterns: [
    process.env.JEST_IGNORE_PATTERN || '<rootDir>/node_modules/',
    '<rootDir>/dist/',
    '<rootDir>/build/',
    '<rootDir>/coverage/',
    '<rootDir>/test-results/',
    '<rootDir>/logs/',
    '<rootDir>/tmp/',
    '<rootDir>/.cache/',
    '<rootDir>/.husky/',
    '<rootDir>/.vercel/',
    '<rootDir>/.netlify/',
    '<rootDir>/.storybook/',
    '<rootDir>/docs/mustache-repo-templates/',
    // Standalone CLI validation scripts, not Jest suites: each defines
    // its own test()/assert helpers and calls process.exit() directly,
    // which crashes the Jest worker instead of reporting a failure.
    // They already run via dedicated `npm run test:*` scripts.
    '<rootDir>/.github/scripts/__tests__/create-agent-spec.test.js',
    '<rootDir>/.github/scripts/__tests__/generate-agent-index.test.js',
    '<rootDir>/.github/scripts/__tests__/validate-agent-specs.test.js',
    '<rootDir>/.github/scripts/__tests__/workflow-integration.test.js',
    // Runs under the changelog package's own node:test runner.
    '<rootDir>/.github/validation/changelog/test/unit/check-run-annotations.test.js',
    '<rootDir>/.github/validation/changelog/test/integration/check-run-annotations.test.js',
    // CommonJS suites written for `node:test` or with their own test()/assert harness. Jest
    // reports "must contain at least one test" for them, so `npm run test:cjs-node` runs them.
    '<rootDir>/agents/changelog-agent/includes/tests/changelogValidator.test.cjs',
    '<rootDir>/agents/changelog-agent/includes/tests/keepAChangelogParser.test.cjs',
    '<rootDir>/agents/release-agent/includes/tests/repoDetector.test.cjs',
    '<rootDir>/agents/release-agent/includes/tests/versionManager.test.cjs',
    '<rootDir>/scripts/workflows/changelog/__tests__/changelog-management.test.cjs',
    '<rootDir>/scripts/workflows/changelog/__tests__/checkout-pr-head.test.cjs',
    '<rootDir>/scripts/workflows/changelog/__tests__/merge-entries.integration.test.cjs',
    '<rootDir>/scripts/workflows/changelog/__tests__/merge-entries.test.cjs',
    '<rootDir>/scripts/workflows/metrics/__tests__/metrics-reporting.test.cjs',
    // These four never require the script they describe: they call a mocked `fs` and assert
    // on the mock, so they pass or fail without exercising any code. Excluded until they are
    // rewritten against scan-completion.cjs, archive-projects.cjs, update-projects-status.cjs
    // and orchestrate-phase-progression.cjs (GIT-2913).
    '<rootDir>/scripts/workflows/projects/__tests__/scan-completion.test.cjs',
    '<rootDir>/scripts/workflows/projects/__tests__/archive-projects.test.cjs',
    '<rootDir>/scripts/automation/__tests__/update-projects-status.test.cjs',
    '<rootDir>/scripts/workflows/__tests__/orchestrate-phase-progression.test.cjs',
  ],
};
