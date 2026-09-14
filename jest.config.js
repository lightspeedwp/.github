module.exports = {
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: [
    'agents/changelog/includes/**/*.cjs',
    '!agents/changelog/includes/**/*.test.cjs',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  testMatch: [
    'agents/changelog/tests/**/*.test.js',
    'agents/changelog/tests/**/*.test.cjs',
  ],
  moduleFileExtensions: ['js', 'cjs', 'json'],
  testTimeout: 10000,
};
