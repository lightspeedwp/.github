---
title: "Test Standards Index"
description: "Index of all LightSpeed test standards: workflows, agents, Bats, Playwright, Jest, PHPUnit, Python, etc."
version: "1.1"
apply_to: "all projects"
last_updated: "2025-10-22"
owners: ["LightSpeed Engineering"]
references:
  - "https://docs.github.com/en/copilot/customizing-copilot/adding-organization-custom-instructions-for-github-copilot"
  - "./tests.instructions.md"
---

# Test Standards Index

This is the canonical index for all LightSpeed test-related instruction files.

Below you will find direct links and short descriptions for each specific testing standard. See each guide for language/framework specifics.

---

## Test Standards

- [tests-bats.instructions.md](./tests/tests-bats.instructions.md)  
  *Shell/unit testing with Bats. See tips for idempotency and shellcheck.*

- [tests-jest.instructions.md](./tests/tests-jest.instructions.md)  
  *Jest JavaScript/TypeScript testing. Setup, config, and best practices.*

- [tests-playwright.instructions.md](./tests/tests-playwright.instructions.md)  
  *Browser/E2E testing with Playwright. Setup, structure, and CI integration.*

- [tests-phpunit.instructions.md](./tests/tests-phpunit.instructions.md)  
  *PHPUnit for PHP/WordPress. Unit/integration test setup and conventions.*

- [tests-python.instructions.md](./tests/tests-python.instructions.md)  
  *Python testing with pytest. Structure, coverage, and type checks.*

---

> **How this index works:**  
> All files matching `tests-*.instructions.md` in this folder are included as canonical test standards.

For overall guidance, see the [LightSpeed Coding Standards](./coding-standards.instructions.md).

---