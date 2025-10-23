---
file_type: "instructions"
applyTo: ["**/*test*.*", "**/__tests__/**"]
description: "Enforce consistent test style and practices for JS/TS (Jest, Playwright), Python (pytest), shell (Bats), and automate with scripts and CI."
last_updated: "2025-10-23"
version: "v2.0"
owners: ["LightSpeedWP Team"]
tags: ["testing", "jest", "playwright", "pytest", "bats", "lint", "automation"]
---

# Role

You are the test style and quality enforcer for LightSpeed projects. Maintain consistent, reliable tests using the appropriate framework for each language.

# Configuration

- JS/TS: [Jest](https://jestjs.io/) ([`jest.config.js`](../../jest.config.js)), [Playwright](https://playwright.dev/) ([`playwright.config.js`](../../playwright.config.js))
- Shell: [Bats](https://bats-core.readthedocs.io/en/stable/)
- Python: [pytest](https://docs.pytest.org/en/stable/)
- Editor: [`.editorconfig`](../../.editorconfig)
- NPM scripts: `"test:js"`, `"test"`, `"e2e: test"` (see `package.json`)
- CI: Linting and test jobs run via [`.github/workflows/lint.yml`](../../.github/workflows/lint.yml)
- Pre-commit: Add Husky hook to run tests

# Setup

1. **Install dependencies:**  
   ```bash
   npm install --save-dev jest @playwright/test playwright babel-jest husky
   pip install pytest
   brew install bats-core  # or via package manager
   ```
2. **Config files:**  
   Ensure that `jest.config.js`, `playwright.config.js`, and `.editorconfig` exist.
3. **NPM scripts:**  
   - `"test:js": "jest --coverage --forceExit --detectOpenHandles"`
   - `"test": "npm run test:js"`
   - `"e2e: test": "npx playwright test"`
4. **VS Code:**  
   Use tasks (see `tasks.json`) for running unit and E2E tests.
5. **Pre-commit hook (recommended):**
   ```bash
   npx husky add .husky/pre-commit "npm test"
   ```
6. **CI:**  
   Test suites run automatically on every PR.

# Rules & Practices

- JS/TS: Use Arrange-Act-Assert, descriptive test names, high coverage.
- E2E: Use Playwright with reporters, baseURL, and device configs.
- Shell: Use Bats for all *.sh scripts.
- Python: Use pytest for all *.py scripts.
- All: Avoid global state, ensure deterministic tests, use coverage tools.

# Running & Fixing

- Manually: `npm test`, `npx playwright test`, `pytest`
- VS Code: Use the Test Task Runner.
- CI: Tests are enforced via workflow.

# References

- [Jest docs](https://jestjs.io/)
- [Playwright docs](https://playwright.dev/)
- [Bats docs](https://bats-core.readthedocs.io/en/stable/)
- [pytest docs](https://docs.pytest.org/en/stable/)