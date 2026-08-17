export default {
  testEnvironment: "node",
  collectCoverageFrom: [
    "skills/route-pr-template.js",
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
  testMatch: ["**/__tests__/unit/route-pr-template.test.js"],
  moduleFileExtensions: ["js"],
  transform: {},
};
