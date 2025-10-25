---
file_type: documentation
name: CLI Tests
folder: includes/cli
last_updated: 2025-10-25
description: |
  Tests for command-line interface utilities and helper functions. Validates CLI argument parsing, tool functionality, and user interface utilities for LightSpeed WP.
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

# CLI Tests

This directory contains tests for command-line interface utilities and helper functions.

```mermaid
graph TD
    A[test-cli-utils.bats] --> B[CLI Utility Functions]
    B --> C[Command-line Tools]
    B --> D[User Interface Utilities]
    A --> E[Enhanced Test Helpers]
    E --> F[Unified Frontmatter Schema]
```

## Test Files

- `test-cli-utils.bats`: Bats tests for CLI utility functions and command-line tools

## Purpose

These tests validate:

- CLI argument parsing and validation
- Command-line tool functionality
- User interface utilities
- Interactive command behaviors
- Help text and usage information

## Running Tests

```bash
# Run CLI tests specifically
bats tests/includes/cli/

# Run all includes tests
bats tests/includes/
```

## Dependencies

- Bats testing framework
- CLI utilities and tools being tested
- Test helpers from parent includes directory

---

## References

- [Main Includes README](../README.md)
- [Root README](../../README.md)
- [Frontmatter Schema](../../../schemas/frontmatter.schema.json)
- [YAML Documentation](../../../docs/YAML.md)
- [Frontmatter Schema Documentation](../../../docs/FRONTMATTER-SCHEMA.md)
