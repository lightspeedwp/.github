---
file_type: documentation
name: Test Fixtures
folder: projects/fixtures
last_updated: 2025-10-25
description: |
  Contains sample data, mock files, and reference outputs for project-related tests. All data is sanitized and used for automated test scenarios.
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
# Test Fixtures


### References

- [Project Tests README](../README.md)
- [Main Tests README](../../README.md)
- [Frontmatter Schema](../../../schemas/frontmatter.schema.json)
- [YAML Documentation](../../../docs/YAML.md)
- [Frontmatter Schema Documentation](../../../docs/FRONTMATTER-SCHEMA.md)
      A[Run Bats Test] --> B[Load Fixture Data]
      B --> C[Mock Auth/Data]
      B --> D[CSV Sample]
      B --> E[Reference Output]
      B --> F[Error Scenario]
      C --> G[Test Auth]
      D --> H[Test Project Creation]
      E --> I[Validate Output]
      F --> J[Negative Testing]
    end
```

## Purpose

Test fixtures provide:

- Sample CSV files for testing project creation and management
- Mock data for authentication and access control testing
- Reference files for validation and comparison
- Test scenarios for edge cases and error conditions

## Usage

These fixtures are automatically used by the test suite when running:

```bash
# Run all project tests (uses fixtures automatically)
bats ../

# Run specific tests that use fixtures
bats ../test-client-delivery-project-csv.bats
bats ../test-product-dev-project-csv.bats
bats ../test-update-projects.bats
```

## File Structure

```mermaid


## References

- [Project Tests README](../README.md)
- [Main Tests README](../../README.md)
- [Frontmatter Schema](../../../schemas/frontmatter.schema.json)
- [YAML Documentation](../../../docs/YAML.md)
- [Frontmatter Schema Documentation](../../../docs/FRONTMATTER-SCHEMA.md)
