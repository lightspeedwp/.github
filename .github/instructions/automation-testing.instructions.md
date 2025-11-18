---
file_type: "instructions"
title: "Automation Testing & Includes Strategy"
description: "Testing and shared utility module strategy for LightSpeedWP automation agents."
version: "v1.0"
apply_to: "all repositories"
last_updated: "2025-10-22"
owners: ["LightSpeedWP Automation Team"]
---

# Automation Testing & Includes Strategy

## Includes Folder

All shared JavaScript modules for workflow automation agents are stored in:
```
.github/agents/includes/
```
- Each `*.js` file in this folder provides reusable utilities for agents (e.g., `readmeUtils.js`, `badgeUtils.js`).
- Agents import these modules to enforce standards, automate doc updates, and validate project state.

## Test Folder and Naming Convention

All Jest tests for automation agents and includes are stored in:
```
.github/agents/tests/
```
**Naming convention:**  
- Each test file is named after the module tested:  
  - `readmeUtils.test.js`
  - `badgeUtils.test.js`
  - `footerUtils.test.js`
  - etc.

**Why not `__tests__` or `/tests/jest/`?**  
Centralizing tests under `.github/agents/tests/`:
- Keeps all automation/agent tests in one place.
- Makes them easy to discover, run in CI, and enforce standards.
- Reduces duplication or confusion with other project-level tests.

## Running Tests

We use [Jest](https://jestjs.io/) as our test runner.

```bash
npm install
npx jest .github/agents/tests/
```

Or add an npm script:
```json
"scripts": {
  "test-agents": "jest .github/agents/tests/"
}
```

## Coverage

- All exported functions in includes/agents must have unit tests.
- Mocks are used for filesystem and side-effect APIs.
- 100% function coverage is required for all new modules.

## Index Reference

This structure and convention is referenced in:
- [Agent Instructions Index](./agents.instructions.md)
- [Coding Standards](./coding-standards.instructions.md)
- [README.md](../../README.md) (automation section)

---

_Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team_  
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)