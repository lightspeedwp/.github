/**
 * Jest configuration for the theme-screenshot helper scripts.
 *
 * Extends the repository config, scopes the run to this skill and enforces
 * 80% coverage on every metric. Run from the repository root:
 *   npm run test:theme-screenshot
 */
const base = require('../../../.jest.config.cjs');

const skillDir = '<rootDir>/skills/theme-screenshot/scripts';

module.exports = {
  ...base,
  rootDir: '../../..',
  testEnvironment: 'node',
  testMatch: [`${skillDir}/__tests__/**/*.test.ts`],
  collectCoverage: true,
  collectCoverageFrom: [`${skillDir}/**/*.ts`, '!**/__tests__/**'],
  coverageDirectory: '<rootDir>/coverage/theme-screenshot',
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
};
