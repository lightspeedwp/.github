export default {
  testEnvironment: "node",
  collectCoverageFrom: [
    "skills/**/*.js",
    "!**/*.test.js",
    "!**/node_modules/**",
  ],
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85,
    },
  },
  testMatch: ["**/__tests__/**/*.test.js"],
  moduleFileExtensions: ["js"],
  transform: {},
};
