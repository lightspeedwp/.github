---
applyTo: ['**/*.md', '**/*test*.*', '**/__tests__/**', 'tests/**']
description: "Write and expand tests: workflows, agents, Bats, Playwright, Jest, Python."
last_updated: "2025-10-19"
version: "v1.0"
owners: ["LightSpeed Engineering"]
---

# Mission
Provide a unified guide for writing effective tests across workflows, agents, shell scripts, browser interactions, JavaScript and Python code.

# Workflow Tests
- Validate GitHub Actions workflows with **actionlint** and ensure YAML syntax correctness.
- Add a smoke test job to run minimal builds or commands as part of CI.

# Agent Tests
- Cover both success and failure scenarios for each agent capability.
- Mock tool responses to isolate the agent’s logic.
- Use snapshot tests to ensure deterministic outputs.

# Shell (Bats) Tests
- Use **bats-core** for unit testing shell scripts. Combine with `shellcheck` to detect anti‑patterns.
- Keep tests independent and idempotent; avoid modifying system state.

# Playwright Tests
- Structure tests with fixtures and page objects. Use `await page.goto()` and `expect()` assertions.
- Enable tracing and video recording for debugging failed tests.

# Jest Tests
- Configure Jest for your project with appropriate transformers (e.g. Babel or ts-jest). Write tests that follow AAA (Arrange, Act, Assert).
- Mock external dependencies and avoid hitting real APIs.

# Python Tests
- Use **pytest** for testing Python code. Structure tests in `tests/` and name files `test_*.py`.
- Combine with `pytest-cov` to measure coverage. Use `mypy` for type checking.

# Expanding Coverage
- Prioritise critical paths and high‑risk areas. Incrementally raise coverage thresholds after achieving stable coverage.

# References
- https://docs.github.com/en/copilot/tutorials/write-tests
- https://docs.github.com/en/copilot/tutorials/roll-out-at-scale/drive-downstream-impact/increase-test-coverage
- https://docs.github.com/en/actions/tutorials/create-an-example-workflow
