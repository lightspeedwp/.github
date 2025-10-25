---
file_type: documentation
version: "2.0"
created_date: "2025-10-25"
last_updated: "2025-10-25"
author: "LightSpeedWP Team"
maintainer: "Ash Shaw"
tags:
  - "cli"
  - "bats"
  - "test-helpers"
  - "automation"
domain: "governance"
stability: "stable"
mode: "information"
deprecated: false
references:
  - path: "../../../schemas/frontmatter.schema.json"
    description: "Unified frontmatter schema definition"
  - path: "../enhanced-test-helpers.bash"
    description: "Enhanced test utilities"
---

# CLI Tests

This directory contains tests for command-line interface utilities and helper functions.

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

## Test Flow & Dependencies

```mermaid
graph TD
    A[test-cli-utils.bats] --> B[CLI Utility Functions]
    B --> C[Command-line Tools]
    B --> D[User Interface Utilities]
    A --> E[Enhanced Test Helpers]
    E --> F[Unified Frontmatter Schema]
```

## Dependencies

- Bats testing framework
- CLI utilities and tools being tested
- Test helpers from parent includes directory

## References

- [Unified Frontmatter Schema](../../../schemas/frontmatter.schema.json)
- [Enhanced Test Helpers](../enhanced-test-helpers.bash)
