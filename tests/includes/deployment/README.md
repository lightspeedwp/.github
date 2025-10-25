---
file_type: documentation
name: Deployment Test Suite
folder: includes/deployment
last_updated: 2025-10-25
description: |
  Bats tests for deployment automation scripts in scripts/deployment/. Validates deployment logic, environment setup, and CI/CD integration for LightSpeed WP.
domain: tests
version: 2.0
owners:
  - lightspeedwp
references:
  - ../../README.md
  - ../../../README.md
  - ../../../schemas/frontmatter.schema.json
  - ../../../docs/YAML.md
  - ../../../docs/FRONTMATTER-SCHEMA.md
---

# Deployment Test Suite

This folder contains Bats tests for deployment automation scripts in `scripts/deployment/`. These tests validate deployment logic, environment setup, and integration with CI/CD workflows.

```mermaid
graph TD
    A[test-example-deployment.bats] --> B[Deployment Automation Scripts]
    C[test-run-deployment-tests.bats] --> B
    B --> D[Environment Setup]
    B --> E[CI/CD Integration]
    D & E --> F[Unified Frontmatter Schema]
```

## Test Files

- `test-example-deployment.bats` — Example deployment test
- `test-run-deployment-tests.bats` — Batch runner for deployment tests

## Coverage

- Deployment logic and automation
- Environment setup and validation
- CI/CD integration
- Edge cases and error handling
- Dry-run and preview modes

## Running Tests

```bash
bats .
```

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for details.

---

## References

- [Main Includes README](../README.md)
- [Root README](../../README.md)
- [Frontmatter Schema](../../../schemas/frontmatter.schema.json)
- [YAML Documentation](../../../docs/YAML.md)
- [Frontmatter Schema Documentation](../../../docs/FRONTMATTER-SCHEMA.md)
