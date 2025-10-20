---
applyTo: ['**/*test*.*', '**/__tests__/**']
description: "Consistent test style across Jest, Playwright, Python and Bats."
last_updated: "2025-10-19"
version: "v1.0"
owners: ["LightSpeed Engineering"]
---

# Mission
Provide guidance on structuring and linting test files across supported languages and frameworks.

# Linter & Tools
- For JavaScript and TypeScript tests, use ESLint with the Jest and Playwright plugins.
- For shell tests, use **Bats** combined with `shellcheck`.
- For Python tests, use `pytest` and configure Ruff/Black for test files.

# Rules & Practices
- Keep tests deterministic by isolating side effects and avoiding external state.
- Use the **Arrange‑Act‑Assert (AAA)** pattern to structure tests clearly.
- Name test files descriptively (e.g. `component.test.js`, `user_flow.spec.ts`).
- When using Playwright, include trace generation and proper cleanup between tests.
- Ensure each test has a single responsibility and checks a single behaviour.

# Running & Fixing
- Include a test script in your package management (e.g. `npm test`, `composer test`, `pytest`).
- Use coverage tools (e.g. `jest --coverage`, `pytest --cov`) and set thresholds. Increment thresholds gradually.

# References
- https://jestjs.io/docs/getting-started
- https://playwright.dev/docs/intro
- https://bats-core.readthedocs.io/en/stable/
- https://docs.pytest.org/en/stable/
