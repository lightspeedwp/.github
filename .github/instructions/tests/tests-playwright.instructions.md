---
file_type: "instructions"
title: "Playwright Test Instructions"
description: "How to write and organize Playwright browser/E2E tests for LightSpeed projects."
version: "1.0.0"
apply_to: "browser/E2E testing"
last_updated: "2025-10-22"
owners: ["LightSpeed Engineering"]
references:
  - "../tests.instructions.md"
  - "https://docs.github.com/en/copilot/customizing-copilot/adding-organization-custom-instructions-for-github-copilot"
---

# Playwright Test Instructions

These guidelines outline best practices for writing, organizing, and maintaining Playwright tests for LightSpeed projects, with a focus on WordPress themes, blocks, and custom patterns.

See [Tests Index](../tests.instructions.md) for all test standards.

---

## Directory & Setup

- Place Playwright tests in `/tests/playwright/` or similar.
- Install Playwright via npm: `npm install --save-dev @playwright/test`
- Add a `"test:e2e"` script to `package.json`:

  ```json
  "scripts": {
    "test:e2e": "playwright test"
  }
  ```

## Best Practices

- Use test fixtures for setup/teardown.
- Keep tests isolated and idempotent.
- Use built-in locators and expect assertions.
- Prefer clear test naming and structure.
- Skip or tag tests as needed.

## Example

```js
import { test, expect } from "@playwright/test";

test("homepage loads", async ({ page }) => {
  await page.goto("https://your-site.local");
  await expect(page).toHaveTitle(/Home/);
});
```

## CI Integration

- Run `npm run test:e2e` in CI.
- Use Playwright reporters for artifacts.

---

For more, see [Playwright docs](https://playwright.dev/docs/intro).
