---
title: "Python Test Instructions"
description: "How to set up and write tests for Python projects at LightSpeed."
version: "1.0.0"
apply_to: "Python projects"
last_updated: "2025-10-22"
owners: ["LightSpeed Engineering"]
references:
  - "../tests.instructions.md"
  - "https://docs.github.com/en/copilot/customizing-copilot/adding-organization-custom-instructions-for-github-copilot"
---

# Python Test Instructions

These are the standards for Python testing using [pytest](https://docs.pytest.org/) and related tools.

See [Tests Index](../tests.instructions.md) for all test standards.

---

## Directory & Setup

- Place Python tests in `/tests/python/` or `tests/` with files named `test_*.py`.
- Use `pytest` for running tests. Install via pip: `pip install pytest`.
- For coverage: `pip install pytest-cov`.

## Best Practices

- Structure tests by module or feature.
- Use fixtures for setup/teardown.
- Prefer isolated, deterministic tests.

## Type Checking

- Use [mypy](https://mypy-lang.org/) for static type checks.

## Resources

- [pytest documentation](https://docs.pytest.org/)
- [pytest-cov](https://pytest-cov.readthedocs.io/)
- [mypy](https://mypy-lang.org/)

---