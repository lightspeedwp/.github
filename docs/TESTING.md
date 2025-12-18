---
*Note: This file follows LightSpeedWP governance, frontmatter, naming, and versioning conventions as described in [VERSIONING.md](./VERSIONING.md) and [FRONTMATTER_SCHEMA.md](./FRONTMATTER_SCHEMA.md).*
---

# Testing Guide

This guide describes how to run, write, and automate tests for LightSpeed projects. It covers our end-to-end testing process using Jest (JavaScript/TypeScript), Playwright (browser/E2E/accessibility), and Bats (Bash scripting), as well as linting, troubleshooting, and CI/CD integration.

---

## 1. Testing Philosophy

- **Automated testing is required** for all code contributions.
- **Test early, test often:** Write tests as you build. Ensure tests pass before pushing code.
- **Accessibility, security, and performance** are testable requirements. Use automation and review for validation.

---

## 2. Types of Tests in LightSpeed Projects

- **Unit Tests:** Test individual functions or components in isolation (Jest).
- **Integration Tests:** Verify interactions between modules or services (Jest, Playwright).
- **Linting & Static Analysis:** Automated checks for code style, formatting, and security (ESLint, PHPCS, markdownlint).
- **Security Tests:** Dependency scanning, secret detection, and code review.

---

## 3. Running Tests Locally

### JavaScript/TypeScript with Jest

- **Run all Jest unit/integration tests:**

  ```bash
  npm test
  # or
  npm run test
  ```

- **Run a specific test file:**

  ```bash
  npx jest src/components/Button.test.js
  ```

- **Watch mode (auto-re-run on changes):**

  ```bash
  npm run test:watch
  ```

### Playwright (E2E, Accessibility, Visual)

- **Run all Playwright tests:**

  ```bash
  npx playwright test
  ```

- **Run tests for a specific file or suite:**

  ```bash
  npx playwright test tests/e2e/login.spec.ts
  ```

- **Run accessibility checks (if configured):**

  ```bash
  npx playwright test --project=a11y
  ```

- **Open Playwright Test Runner UI:**

  ```bash
  npx playwright test --ui
  ```

- **Generate/update screenshots for visual regression:**

  ```bash
  npx playwright test --update-snapshots
  ```

### Bash Scripts with Bats

- **Run all Bats tests:**

  ```bash
  bats tests/bash/
  ```

- **Run a specific Bats test file:**

  ```bash
  bats tests/bash/deploy.bats
  ```

### Linting

- **JavaScript/TypeScript (ESLint + Prettier):**

  ```bash
  npm run lint
  ```

- **PHP (PHPCS):**

  ```bash
  composer lint
  ```

- **Markdown:**

  ```bash
  npm run lint:md
  ```

---

## 4. Writing New Tests

### Jest

- Place test files alongside source files (e.g., `Button.js` and `Button.test.js`) or in a `tests/` directory.
- Use descriptive test names.
- Mock dependencies for unit tests.
- Cover edge cases and error conditions.

### Playwright

- Place E2E tests in `tests/e2e/` or similar.
- Use realistic user journeys.
- Add accessibility assertions using axe-core or built-in a11y checks.
- Add visual regression snapshots if relevant.

### Bats

- Place tests in `tests/bash/`.
- Test common and edge-case CLI flows.
- Use setup/teardown for environment isolation.

---

## 5. Accessibility & Performance

- **Accessibility:**
  Integrate Playwright accessibility audits using axe-core or Playwright’s built-in roles/assertions.
  All new UI must meet WCAG 2.1 AA.
- **Performance:**
  Run Lighthouse or Web Vitals on main user flows. Flag regressions in PRs.

---

## 6. Continuous Integration (CI/CD)

All PRs and main branch pushes are tested via GitHub Actions:

- **CI runs:** Linting, Jest, Playwright, Bats, and coverage.
- **Status checks:** All must pass before merging.
- **Coverage:** Minimum thresholds enforced for core code.
- **Artifacts:** Test results and coverage reports available in CI.

**CI Example:**
See `.github/workflows/` for workflow definitions.

---

## 7. Troubleshooting

- **Tests fail locally, not in CI:**
  - Check for unstaged files or local environment differences.
- **CI fails, passes locally:**
  - Check Node, PHP, or dependency versions.
  - Look for missing env variables or secrets.
- **Flaky Playwright tests:**
  - Add waits, ensure selectors are stable, and reset state between tests.
- **Accessibility failures:**
  - Review failure output, use browser dev tools for further debugging.
- **Bats shell script issues:**
  - Add `set -x` for debugging, check for cross-shell compatibility.

---

## 8. Best Practices

- **Write small, focused tests** – one assertion per test where possible.
- **Mock external dependencies** in unit tests.
- **Use real-world data** for E2E/integration tests.
- **Keep tests deterministic and isolated.**
- **Update or add tests when fixing bugs.**
- **Review test coverage before merging.**
- **Use Playwright’s `test.describe` and `test.beforeEach/afterEach` for setup/teardown.**

---

## 9. Coverage & Quality Gates

- **Coverage reports** generated and enforced in CI.
- **Minimum thresholds** must be met before merging.
- **Review coverage reports** for gaps and add missing tests.

---

## 10. Need Help?

- Check error output and logs.
- Review [GitHub Discussions](https://github.com/orgs/lightspeedwp/discussions) for community support.
- Tag a maintainer, or open a support issue if you are stuck.

---

*Keep this document up to date as our testing process evolves. PRs are welcome!*

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)
