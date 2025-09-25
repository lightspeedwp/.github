---
title: "Playwr  - documentation
  - instructions
  - guides
version: "1.0.0"
permalink: "/instructions/playwright-tests"
license: "GPL-3.0"
type: "instructions"
mode: "agent"
author: "LightSpeedWP Team"
contributors:
  - name: "Ash Shaw"
    github: "ashleyshaw"
  - name: "LightSpeedWP"
    github: "lightspeedwp"
tags:
    - playwright
    - testing
    - automation
    - browser
    - MCP
    - CI/CD
    - best-practices
categories:
    - documentation
    - instructions
    - guides
version: "1.0.0"
permalink: "/instructions/playwright-tests"

type: "instructions"
mode: "agent"
---
# Playwright Test Instructions

These guidelines outline best practices for writing, organizing, and maintaining Playwright tests for LightSpeed projects, with a focus on WordPress themes, blocks, and custom patterns.

---

## Directory & Setup

- Place Playwright tests in a dedicated directory, e.g. `/tests/playwright/` within your project.
- Install Playwright and its dependencies:
  ```bash
  npm install --save-dev @playwright/test
  npx playwright install
  ```
- Install WordPress-specific E2E helpers:
  ```bash
  npm install --save-dev @wordpress/e2e-test-utils-playwright
  ```

  Reference: [WordPress E2E Test Utils](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-e2e-test-utils-playwright/)

---

## Writing Tests

- Create test files with `.spec.ts` or `.spec.js` extensions.
- Use descriptive test and file names reflecting the feature, pattern, or block under test.
- Example:
  ```js
  import { test, expect } from '@playwright/test';

  test.describe('Homepage', () => {
    test('should load and display main banner', async ({ page }) => {
      await page.goto('https://your-site.test');
      await expect(page.locator('.main-banner')).toBeVisible();
    });
  });
  ```
- For WordPress block/editor tests, use E2E Test Utils for common editor actions.

---

## Best Practices

- **Isolation:** Each test should run independently, with its own setup and teardown.
- **Selectors:** Use robust selectors (`data-*` attributes or ARIA labels) instead of CSS classes.
- **Assertions:** Assert only what matters for the scenario; avoid over-asserting.
- **Test Speed:** Avoid unnecessary waits; use Playwright's automatic waiting for elements.
- **Coverage:** Focus on critical user paths, accessibility, and edge cases.
- **Maintainability:** Refactor repeated code into helpers or fixtures.

See: [Playwright Best Practices](https://playwright.dev/docs/best-practices)

---

## MCP Agents for Test Generation

Leverage [Playwright MCP Agents](https://playwright.dev/agents/playwright-mcp-generating-tests) to automate test generation, especially for UI regression and repeated workflows.

---

## WordPress Theme Testing

Reference [WordPress Theme Testing Guides](https://developer.wordpress.org/themes/advanced-topics/theme-testing/) for comprehensive checklists.

Ensure tests cover:

- Block registration and rendering.
- Theme customizer options.
- Frontend and backend appearance.
- Accessibility and device compatibility.

More resources:

- [Theme Testing](https://developer.wordpress.org/themes/releasing-your-theme/testing/)
- [Build Process Integration](https://developer.wordpress.org/themes/advanced-topics/build-process/)

---

## Organizing Tests

- Group related tests by feature, block, or template.
- Use Playwright’s `test.describe()` to structure suites.
- Use fixtures for setup tasks (login, DB resets, etc.).

---

## Running Tests

- Run all tests:
  ```bash
  npx playwright test
  ```
- Run a specific test:
  ```bash
  npx playwright test path/to/test.spec.ts
  ```
- Generate HTML reports:
  ```bash
  npx playwright test --reporter=html
  ```

---

## CI Integration

- Integrate Playwright into your CI/CD pipeline (e.g., GitHub Actions).
- Ensure your workflow installs dependencies and runs tests on pull requests and merges.
- Reference: [Playwright CI Docs](https://playwright.dev/docs/ci-intro)

---

## Resources

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Agents &amp; Automation](https://playwright.dev/agents)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [WordPress Theme Testing](https://developer.wordpress.org/themes/advanced-topics/theme-testing/)
- [Block Editor E2E Utils](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-e2e-test-utils-playwright/)

---

## Contribution

- Follow [LightSpeed Coding Standards](./coding-standards.instructions.md).
- Submit Playwright tests as part of feature pull requests.
- Review tests for reliability, clarity, and coverage.
- For questions or suggestions, open an issue or discuss with the team.

---

**Maximum for this folder:**

- This file is located in: `@lightspeedwp/.github/files/.github/instructions`
- All instructions files in this folder must follow [LightSpeed organizational guidelines](https://github.com/lightspeedwp/.github/blob/master/.github/custom-instructions.md).

---
