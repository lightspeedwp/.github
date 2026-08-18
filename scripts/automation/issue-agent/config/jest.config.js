module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  testMatch: ['**/__tests__/**/*.test.js', '**/?(*.)+(spec|test).js'],
  collectCoverageFrom: [
    'scripts/automation/issue-agent/**/*.js',
    '!scripts/automation/issue-agent/**/__tests__/**',
    '!scripts/automation/issue-agent/config/**',
  ],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/scripts/automation/issue-agent/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/scripts/automation/issue-agent/config/jest-setup.js'],
  testPathIgnorePatterns: ['/node_modules/', '/.git/'],
  verbose: true,
};
