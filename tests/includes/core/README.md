---
description: |
  Bats test suite for core shared utilities: logging, color formatting, and input validation. Ensures output consistency, error handling, and integration with enhanced test helpers.
last_updated: 2025-10-25
version: 2.1
owners:
- lightspeedwp

references:
- ../README.md
- ../../README.md
- ../../../README.md
- ../../../schemas/frontmatter.schema.json
- ../../../docs/YAML.md
- ../../../docs/FRONTMATTER-SCHEMA.md
---
---

# Core Tests 🧩

Badges: (placeholder – will be auto-inserted by global badge workflow)
> Jest ⬡ Bats ✅ ShellCheck 🔍 Coverage % 📊 Frontmatter ✓

## Overview

Automated tests for foundational utility functions: logging, color formatting, and input validation. These ensure:

- Consistent output and error reporting
- Reliable color/terminal formatting
- Robust input validation and sanitization
- Integration with shared includes helpers

## Structure

```mermaid
graph TD
    subgraph tests/includes/core
      A[test-colors.bats]
      B[test-logging.bats]
      C[test-validation.bats]
    end
    A --> D[Color Utilities]
    B --> E[Logging Functions]
    C --> F[Validation Utilities]
    A & B & C --> G[Includes Shared Helpers]
    G --> H[enhanced-test-helpers.bash]
    G --> I[agent-test-helpers.bash]
---
description: |
  Bats test suite for core shared utilities: logging, color formatting, and input validation. Ensures output consistency, error handling, and integration with enhanced test helpers.
last_updated: 2025-10-25
version: 2.1
owners:
- lightspeedwp

references:
- ../README.md
- ../../README.md
- ../../../README.md
- ../../../schemas/frontmatter.schema.json
- ../../../docs/YAML.md
- ../../../docs/FRONTMATTER-SCHEMA.md
---
# Core Tests 🧩

Badges: (placeholder – will be auto-inserted by global badge workflow)
> Jest ⬡ Bats ✅ ShellCheck 🔍 Coverage % 📊 Frontmatter ✓

## Overview

Automated tests for foundational utility functions: logging, color formatting, and input validation. These ensure:

- Consistent output and error reporting
- Reliable color/terminal formatting
- Robust input validation and sanitization
- Integration with shared includes helpers

## Structure

```mermaid
graph TD
    subgraph tests/includes/core
      A[test-colors.bats]
      B[test-logging.bats]
      C[test-validation.bats]
    end
    A --> D[Color Utilities]
    B --> E[Logging Functions]
    C --> F[Validation Utilities]
    A & B & C --> G[Includes Shared Helpers]
    G --> H[enhanced-test-helpers.bash]
    G --> I[agent-test-helpers.bash]
```

## Test Files

| File | Purpose |
| ---- | ------- |
| `test-colors.bats` | Tests color utilities and terminal formatting |
| `test-logging.bats` | Tests logging functions and output formatting |
| `test-validation.bats` | Tests input validation and data verification |

## Usage

```bash
# Run only core tests
bats tests/includes/core/

# Run all includes tests
bats tests/includes/

# (Optional) With debug / verbose
CORE_TEST_DEBUG=1 bats tests/includes/core/
```

## Environment

| Variable | Effect |
| -------- | ------ |
| `CORE_TEST_DEBUG` | Enables verbose diagnostic logging in helpers |
| `NO_COLOR` | Forces plain output for snapshot comparisons |

## Validation & Quality

| Check | Tool | Notes |
| ----- | ---- | ----- |
| Shell lint | ShellCheck | Applied to any sourced helper scripts |
| Frontmatter | Validation script | Ensures metadata matches `frontmatter.schema.json` |
| Markdown | MD Lint | Spacing, headings, fenced code block rules |

## Dependencies

- Bats (test runner)
- Shared helper scripts in `tests/includes/`
- Core utility source functions (located in corresponding scripts/includes paths)
- Terminal color support for color testing

## CI/CD Integration

Pipeline runs these tests in the includes phase. Failures here gate downstream integration tests. Coverage for shell functions is aggregated into the global coverage report.

## Limitations & Future Work

- Expand color tests for edge-case terminal types
- Add snapshot tests for logging output
- Integrate input fuzzing for validation utilities

## References

- [Parent Includes README](../README.md)
- [Tests Root README](../../README.md)
- [Repository Root README](../../../README.md)
- [Frontmatter Schema](../../../schemas/frontmatter.schema.json)
- [YAML Docs](../../../docs/YAML.md)
- [Frontmatter Schema Docs](../../../docs/FRONTMATTER-SCHEMA.md)
