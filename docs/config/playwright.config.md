# Playwright Configuration

This document describes the Playwright setup for LightSpeed projects, supporting E2E testing with environment-based overrides.

## Configuration File

**File:** `playwright.config.js`

```javascript
require('dotenv').config();

const config = {
    testDir: process.env.PLAYWRIGHT_TEST_DIR || './tests',
    reporter: process.env.PLAYWRIGHT_REPORTER || 'list',
    use: {
        baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
        headless: process.env.PLAYWRIGHT_HEADLESS !== 'false',
    },
    projects: [
        {
            name: 'chromium',
            use: { ...require('@playwright/test').devices['Desktop Chrome'] },
        },
        {
            name: 'firefox',
            use: { ...require('@playwright/test').devices['Desktop Firefox'] },
        },
        {
            name: 'webkit',
            use: { ...require('@playwright/test').devices['Desktop Safari'] },
        },
    ],
};

module.exports = config;
```

## Environment Variables

- `PLAYWRIGHT_TEST_DIR`: Directory for tests (default: './tests')
- `PLAYWRIGHT_REPORTER`: Reporter type (default: 'list')
- `PLAYWRIGHT_BASE_URL`: Base URL for tests (default: '<http://localhost:3000>')
- `PLAYWRIGHT_HEADLESS`: Run in headless mode (default: true)

## Usage

Playwright is used for end-to-end (E2E) testing. See [playwright-tests.instructions.md](../../.github/instructions/playwright-tests.instructions.md) for test authoring standards.

## Related Docs

- [LINTING.md](../LINTING.md) — Main linting strategy
- [HUSKY-PRECOMMITS.md](../HUSKY-PRECOMMITS.md) — Pre-commit automation
- [jest.config.md](./jest.config.md) — Unit test config
- [babel.config.md](./babel.config.md) — Babel config
- [npm-scripts.md](./npm-scripts.md) — NPM automation
- [workflow-husky.md](./workflow-husky.md) — Husky setup
- [workflow-lint-staged.md](./workflow-lint-staged.md) — Lint-staged setup
- [frontmatter.schema.json](../../schemas/frontmatter.schema.json) — Frontmatter schema

> See [docs/CHECKLIST_CROSSLINKING.md](../CHECKLIST_CROSSLINKING.md) for cross-linking best practices.
