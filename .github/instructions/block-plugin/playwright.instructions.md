# Playwright Testing Instructions (Blocks & Themes)

## Overview

This document provides best practices for using Playwright to test WordPress blocks and themes, including TypeScript usage and test structure.

---

## 1. Setup

- Use Playwright with TypeScript for robust, type-safe tests.
- Install with `npm install --save-dev playwright @playwright/test`.
- Configure Playwright in `playwright.config.ts`.

---

## 2. Writing Tests

- Place tests in `tests/` directory, e.g., `tests/theme-json-validation.test.js`.
- Use descriptive test names and group related tests with `describe()`.
- Use Playwright's page API to interact with the WordPress editor and front end.
- Example:

```typescript
import { test, expect } from "@playwright/test";

test("Block renders in editor", async ({ page }) => {
  await page.goto("http://localhost:8888/wp-admin/post-new.php");
  // Add block, check for output, etc.
});
```

---

## 3. Best Practices

- Use fixtures for setup/teardown.
- Test both editor and frontend rendering.
- Validate block attributes and output.
- Use [playwright-typescript.instructions.md](https://github.com/lightspeedwp/ai-block-theme-template/blob/develop/.github/instructions/playwright-typescript.instructions.md) for advanced TypeScript usage.

---

## 4. Resources

- [Playwright Docs](https://playwright.dev/)
- [playwright-tests.instructions.md](https://github.com/lightspeedwp/ai-block-theme-template/blob/develop/.github/instructions/playwright-tests.instructions.md)
