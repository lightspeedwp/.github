/**
 * Jest configuration for the site-to-design-tokens helper scripts.
 *
 * Extends the repository config, scopes the run to this skill and enforces
 * 80% coverage on every metric. Run from the repository root:
 *   npm run test:site-to-design-tokens
 */
const base = require('../../../.jest.config.cjs');

const skillDir = '<rootDir>/skills/site-to-design-tokens/scripts';

module.exports = {
  ...base,
  rootDir: '../../..',
  testEnvironment: 'node',
  testMatch: [`${skillDir}/__tests__/**/*.test.ts`],
  collectCoverage: true,
  collectCoverageFrom: [`${skillDir}/**/*.ts`, '!**/__tests__/**'],
  coverageDirectory: '<rootDir>/coverage/site-to-design-tokens',
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
};
