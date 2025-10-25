---
file_type: documentation
version: "2.0"
created_date: "2025-10-25"
last_updated: "2025-10-25"
author: "LightSpeedWP Team"
maintainer: "Ash Shaw"
tags:
  - "core"
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

# Core Tests

This directory contains tests for core functionality and shared utilities.

## Test Files

- `test-colors.bats`: Tests for color utilities and terminal formatting
- `test-logging.bats`: Tests for logging functions and output formatting
- `test-validation.bats`: Tests for input validation and data verification utilities

## Purpose

These tests validate:

- Core utility functions used across the project
- Logging and output formatting consistency
- Color and terminal display functionality
- Input validation and sanitization
- Error handling and reporting mechanisms

## Running Tests

```bash
# Run core tests specifically
bats tests/includes/core/

# Run all includes tests
bats tests/includes/
```

## Test Flow & Dependencies

```mermaid
graph TD
    A[test-colors.bats] --> B[Color Utilities]
    C[test-logging.bats] --> D[Logging Functions]
    E[test-validation.bats] --> F[Validation Utilities]
    A & C & E --> G[Enhanced Test Helpers]
    G --> H[Unified Frontmatter Schema]
```

## Dependencies

- Bats testing framework
- Core utility scripts and functions
- Test helpers from parent includes directory
- Terminal color support for color testing

## References

- [Unified Frontmatter Schema](../../../schemas/frontmatter.schema.json)
- [Enhanced Test Helpers](../enhanced-test-helpers.bash)
