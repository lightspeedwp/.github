export default {
  testEnvironment: "node",
  collectCoverageFrom: [
    "skills/**/*.js",
    "!**/*.test.js",
    "!**/node_modules/**",
  ],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  testMatch: ["**/__tests__/**/*.test.js", "**/__integration__/**/*.test.js"],
  moduleFileExtensions: ["js"],
  transform: {},
  testTimeout: 10000,
  projects: [
    {
      displayName: "unit",
      testMatch: ["**/__tests__/*.test.js"],
    },
    {
      displayName: "integration",
      testMatch: ["**/__tests__/integration/*.test.js"],
      testTimeout: 15000,
    },
  ],
};
