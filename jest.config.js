// Jest configuration for TypeScript testing
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { defaults: tsjPreset } = require('ts-jest/presets'); // TypeScript Jest presets

module.exports = {
  testEnvironment: "node",
  testMatch: [
    "**/tests/**/*.test.js",
    "**/tests/**/*.test.ts",
    "**/__tests__/**/*.test.js",
    "**/__tests__/**/*.test.ts"
  ],
  verbose: true,
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest"
  },
  moduleFileExtensions: ["js", "ts", "jsx", "tsx", "json"],
  coverageDirectory: "./coverage",
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.{js,ts}", "tests/**/*.{js,ts}"],
  testPathIgnorePatterns: ["<rootDir>/node_modules/"],
};
