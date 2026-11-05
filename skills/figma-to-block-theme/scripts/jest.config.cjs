/**
 * Jest configuration for the figma-to-block-theme helper scripts.
 *
 * Extends the repository config, scopes the run to this skill and enforces
 * 80% coverage on every metric. Run from the repository root:
 *   npm run test:figma-to-block-theme
 */
const base = require('../../../.jest.config.cjs');

const skillDir = '<rootDir>/skills/figma-to-block-theme/scripts';

module.exports = {
  ...base,
  rootDir: '../../..',
  testEnvironment: 'node',
  testMatch: [`${skillDir}/__tests__/**/*.test.ts`],
  collectCoverage: true,
  collectCoverageFrom: [`${skillDir}/*.ts`],
  coverageDirectory: '<rootDir>/coverage/figma-to-block-theme',
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
};
