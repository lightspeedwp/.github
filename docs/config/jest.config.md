# Jest Configuration

This document describes the Jest setup for LightSpeed projects, supporting unit testing with environment-based overrides and TypeScript support.

## Configuration File

**File:** `jest.config.js`

```javascript
require("dotenv").config();

module.exports = {
  testEnvironment: process.env.JEST_TEST_ENVIRONMENT || "node",
  testMatch: process.env.JEST_TEST_MATCH
    ? process.env.JEST_TEST_MATCH.split(",")
    : ["**/tests/**/*.test.[jt]s?(x)"],
  verbose: process.env.JEST_VERBOSE === "true",
  transform: {
    "^.+\\.[jt]sx?$": "ts-jest",
  },
  moduleFileExtensions: ["js", "jsx", "ts", "tsx", "json"],
  coverageDirectory: process.env.JEST_COVERAGE_DIRECTORY || "./coverage",
  collectCoverage: process.env.JEST_COLLECT_COVERAGE === "true",
  collectCoverageFrom: process.env.JEST_COLLECT_COVERAGE_FROM
    ? process.env.JEST_COLLECT_COVERAGE_FROM.split(",")
    : ["src/**/*.{js,jsx,ts,tsx}"],
  testPathIgnorePatterns: process.env.JEST_TEST_PATH_IGNORE_PATTERNS
    ? process.env.JEST_TEST_PATH_IGNORE_PATTERNS.split(",")
    : [
        "/node_modules/",
        "/build/",
        "/dist/",
        "/coverage/",
        "/playwright-report/",
        "/test-results/",
        "/vendor/",
        "/.next/",
        "/logs/",
      ],
};
```

## Environment Variables

- `JEST_TEST_ENVIRONMENT`: Test environment (default: 'node')
- `JEST_TEST_MATCH`: Comma-separated list of test match globs
- `JEST_VERBOSE`: Verbose output (default: false)
- `JEST_COVERAGE_DIRECTORY`: Coverage output directory (default: './coverage')
- `JEST_COLLECT_COVERAGE`: Enable coverage collection (default: false)
- `JEST_COLLECT_COVERAGE_FROM`: Comma-separated list of files for coverage
- `JEST_TEST_PATH_IGNORE_PATTERNS`: Comma-separated list of ignore patterns

## Usage

Jest is used for unit testing and is integrated with Babel and TypeScript. See [quality-assurance.instructions.md](../../.github/instructions/quality-assurance.instructions.md) for test authoring standards.

## Related Docs

- [LINTING.md](../LINTING.md) — Main linting strategy
- [HUSKY-PRECOMMITS.md](../HUSKY-PRECOMMITS.md) — Pre-commit automation
- [babel.config.md](./babel.config.md) — Babel config
- [prettier.config.md](./prettier.config.md) — Formatting config
- [npm-scripts.md](./npm-scripts.md) — NPM automation
- [workflow-husky.md](./workflow-husky.md) — Husky setup
- [workflow-lint-staged.md](./workflow-lint-staged.md) — Lint-staged setup
- [frontmatter.schema.json](../../schemas/frontmatter.schema.json) — Frontmatter schema

> See [docs/CHECKLIST_CROSSLINKING.md](../CHECKLIST_CROSSLINKING.md) for cross-linking best practices.
