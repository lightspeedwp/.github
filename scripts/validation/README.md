---
file_type: "documentation"
name: "Validation Scripts & Tests"
description: "Comprehensive validation scripts and tests for frontmatter, JSON, YAML, and branch naming in LightSpeedWP .github repository ensuring schema compliance and governance"
version: "1.1.0"
last_updated: "2026-08-30"
owners:
  - "LightSpeedWP Team"
tags:
  - "validation"
  - "frontmatter"
  - "schema"
  - "testing"
  - "automation"
  - "branch-governance"
apply_to:
  - "repository maintenance"
  - "documentation standards"
  - "quality assurance"
  - "branch naming governance"
---


# JSON, YAML & Frontmatter Validation

This directory contains all validation scripts and tests for JSON, YAML, and Markdown frontmatter used throughout the LightSpeedWP .github repository. All validation logic has been consolidated here from previous locations (including `scripts/coderabbit-validation/`).

## Overview

The validation system provides automated checking of:

- YAML frontmatter in Markdown files (schema and field validation)
- JSON files (linting, formatting, schema validation)
- YAML configuration files (including `.coderabbit.yml`)

All schema files are stored in `../../.schemas/`.

```mermaid
graph TD
  accTitle: Frontmatter validation pipeline
  accDescr: Top-down graph showing the frontmatter validation pipeline from discovery through report generation
    A[File Discovery] --> B[Frontmatter Extraction]
    B --> C[Schema Validation]
    C --> D[LightSpeed Rules Check]
    D --> E[Reference Validation]
    E --> F[Report Generation]
    F --> G[Log Output]

    H[Configuration] --> A
    I[Schema File] --> C
    J[File Patterns] --> A

    style A fill:#e1f5fe,color:#0f172a
    style F fill:#f3e5f5,color:#0f172a
    style G fill:#e8f5e8,color:#0f172a
```

## Main Scripts

- **`validate-frontmatter.js`** — Validates Markdown frontmatter for all .md files in the repo against the canonical schema
- **`validate-json.js`** — Comprehensive JSON linting and validation tool (Prettier, JSONLint, Ajv schema validation)
- **`validate-coderabbit-yml.cjs`** — Validates `.coderabbit.yml` for YAML syntax and required fields, using the latest CodeRabbit schema
- **`update-coderabbit-schema.cjs`** — Downloads and updates the latest CodeRabbit schema for offline validation

## Test Files

- **`__tests__/validate-frontmatter.test.js`** — Test suite for frontmatter validation
- **`__tests__/validate-branch-names.test.js`** — Jest test suite for branch name validation (34 allowed types, forbidden prefix rejection, format validation)
- **`validate-coderabbit-yml.test.js`** — Jest test suite for the CodeRabbit YAML validator

## Features

### ✅ Schema Validation

- Validates frontmatter against `frontmatter.schema.json`
- Validates JSON files against schemas (Ajv)
- Validates `.coderabbit.yml` against the latest CodeRabbit schema

### 🔍 File Type Detection

- Detects file types and applies type-specific validation rules

### 📋 Required Fields Validation

- Enforces required fields for frontmatter and config files

### 💡 Recommended Fields Checking

- Suggests optional but recommended fields for consistency

### 🔗 Reference Policy

- Verifies that the deprecated `references` frontmatter field is not present and that any needed links live inline in the document body

### 📊 Comprehensive Reporting

- Color-coded console output, detailed logs, and summary statistics

## Usage Examples

### Frontmatter Validation

```bash
# Run validation with default settings
node validate-frontmatter.js
```

### Structure Validation

```bash
# Validate required portable source folders without modifying files
npm run validate:structure
```

### JSON Validation & Linting

```bash
# Check whether JSON files would be formatted
node validate-json.js --format-only --read-only

# Validate syntax only (strict, read-only mode)
node validate-json.js --validate-only --strict --read-only

# Format all JSON files
npm run format:json

# Format active schema files
npm run format:json:schemas

# Validate against a schema
node validate-json.js --glob "data/**/*.json" --schema "schema/my-doc.schema.json" --spec draft2020 --validate-only --read-only
```

### Validate CodeRabbit Configuration

```bash
# Validate the main .coderabbit.yml file
node validate-coderabbit-yml.cjs
```

### Update CodeRabbit Schema

```bash
node update-coderabbit-schema.cjs
```

## Configuration

All schema files are stored in `../../.schemas/`.
Default configuration for frontmatter validation is in `validate-frontmatter.js`.

## Validation Rules

See the schema files in `../../.schemas/` for required and recommended fields for each file type.

## Output Examples

See script output and logs for validation results, errors, and warnings.

## Integration

- Automated testing: All validation scripts are run as part of CI/CD pipeline
- Pre-commit hooks: Validate configs and docs before commit
- Logging: Results are logged to `../../logs/validation/`

## Development

### Running Tests

```bash
# Install dependencies
npm install
# Run all tests
npm test
# Run tests with coverage
npm run test:coverage
# Watch mode for development
npm run test:watch
```

### Adding New Validation Rules

1. Update or add schema in `../../.schemas/`
2. Add or update validation script in this folder
3. Add or update test cases
4. Update this README

## Error Handling

All validation scripts provide robust error handling and log errors to the console and log files.

## Dependencies

- **ajv**: JSON Schema validation
- **ajv-formats**: Additional format validators
- **js-yaml**: YAML parsing and processing
- **glob**: File pattern matching
- **jest**: Testing framework (dev dependency)

## Related Documentation

- [Frontmatter Schema](../../.schemas/frontmatter.schema.json)
- [CodeRabbit Schema](../../.schemas/coderabbit-overrides.v2.json)
- [Tagging Conventions](../../.github/instructions/tagging-and-frontmatter-conventions.instructions.md)
- [Mermaid Diagrams](../../.github/instructions/mermaid-diagrams.instructions.md)
- [YAML Documentation](../../docs/YAML.md)
- [Test Coverage Reports](../../coverage/README.md)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)
