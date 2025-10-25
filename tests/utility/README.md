---
file_type: documentation
name: Utility Test Suite
folder: utility
last_updated: 2025-10-25
description: |
  Bats tests for utility scripts and functions in scripts/utility/. Covers logging, validation, release checks, and core utility logic for LightSpeed WP.
domain: tests
version: 2.0
owners:
  - lightspeedwp
references:
  - ../README.md
  - ../../README.md
  - ../../../schemas/frontmatter.schema.json
  - ../../../docs/YAML.md
  - ../../../docs/FRONTMATTER-SCHEMA.md
---

# Utility Test Suite

This folder contains Bats tests for utility scripts and functions in `scripts/utility/`. These tests cover logging, validation, release checks, and core utility logic.

```mermaid
flowchart TD
    A[bats .] --> B[test-run-utility-tests.bats]
    A --> C[test-standardize-logging.bats]
    A --> D[test-utility-functions.bats]
    A --> E[test-validate-release.bats]
    B --> F[Batch Run]
    C --> G[Validate Logging]
    D --> H[Test Utility Functions]
    E --> I[Validate Release]
    A --> J[fixtures/]
    J --> K[Utility Script Fixtures]
```

## Test Files

- `test-run-utility-tests.bats` — Batch runner for utility tests
- `test-standardize-logging.bats` — Validates logging functions
- `test-utility-functions.bats` — Tests core utility functions
- `test-validate-release.bats` — Validates release logic
- `fixtures/` — Test fixtures for utility scripts

## Coverage

- Logging and output formatting
- Utility function correctness
- Release validation
- Edge cases and error handling
- Dry-run and CI/CD integration

## Running Tests

```bash
bats .
```

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for details.

---

## References

- [Main Tests README](../README.md)
- [Root README](../../README.md)
- [Frontmatter Schema](../../../schemas/frontmatter.schema.json)
- [YAML Documentation](../../../docs/YAML.md)
- [Frontmatter Schema Documentation](../../../docs/FRONTMATTER-SCHEMA.md)
