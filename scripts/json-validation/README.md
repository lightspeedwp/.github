---
title: "JSON & YAML Validation Scripts"
version: "v1.3"
last_updated: "2025-01-14"
author: "LightSpeedWP Team"
maintainer: "Ash Shaw"
description: "Utilities for validating JSON and YAML configuration files throughout the LightSpeedWP project. Schema validation, YAML parsing, and comprehensive configuration integrity checking."
type: "validation"
status: "production"
tags: ["json", "yaml", "validation", "schema", "configuration", "nodejs", "coderabbit"]
license: "GPL-3.0"
repository: "https://github.com/lightspeedwp/.github"
ai_references:
  - "Use for JSON/YAML configuration validation workflows"
  - "Schema-based validation with automatic download and caching"
  - "CodeRabbit configuration validation and field checking"
  - "Integration with CI/CD pipelines for configuration integrity"
related_files:
  - "schemas/"
  - ".coderabbit.yml"
  - "scripts/includes/"
  - ".github/workflows/"
---

## 🔍 JSON & YAML Validation Scripts

![Validation Badge](https://img.shields.io/badge/validation-automated-brightgreen?style=flat-square)
![Schema Badge](https://img.shields.io/badge/schema-compliant-blue?style=flat-square)
![Configuration Badge](https://img.shields.io/badge/config-validated-orange?style=flat-square)
![Testing Badge](https://img.shields.io/badge/testing-comprehensive-success?style=flat-square)

This directory contains utilities for validating JSON and YAML configuration files used throughout the LightSpeedWP project.

## 📊 Validation Architecture

```mermaid
graph TB
    A[JSON/YAML Validation] --> B[Schema Management]
    A --> C[YAML Parsing]
    A --> D[Field Validation]
    A --> E[Test Framework]
    
    B --> F[Schema Download]
    B --> G[Schema Caching]
    B --> H[Fallback Schemas]
    
    C --> I[Syntax Validation]
    C --> J[Structure Parsing]
    
    D --> K[Required Fields]
    D --> L[Format Validation]
    
    E --> M[Jest Test Suite]
    E --> N[Edge Case Testing]
    
    O[CI/CD Pipeline] --> A
    P[Pre-commit Hooks] --> A
    Q[Manual Validation] --> A
    
    style A fill:#e1f5fe
    style B fill:#f3e5f5
    style C fill:#e8f5e8
    style D fill:#fff3e0
```

## Main Scripts

- __`validate-coderabbit-yml.cjs`__
  - Validates `.coderabbit.yml` configuration files for proper YAML syntax and required fields.
  - Fetches and validates against the official CodeRabbit schema.
  - Used by: CI/CD pipelines, pre-commit hooks, and manual validation workflows.

## Test Files

- __`validate-coderabbit-yml.test.js`__ — Jest test suite for the CodeRabbit YAML validator.
- __`__tests__/validate-coderabbit-yml.test.js`__ — Additional test cases and edge case validation.

## How This Works

The validation scripts in this directory:

1. __Schema Validation__: Download and cache the latest schema from CodeRabbit's official source
2. __YAML Parsing__: Parse YAML files and validate syntax
3. __Field Validation__: Ensure all required fields are present and properly formatted
4. __Logging__: Comprehensive logging to `logs/` directory for debugging and audit trails

## Usage Examples

### Validate CodeRabbit Configuration

```bash
# Validate the main .coderabbit.yml file
node scripts/json-validation/validate-coderabbit-yml.cjs

# Run tests
npm test -- scripts/json-validation/validate-coderabbit-yml.test.js
```

## Integration with Other Scripts

- __`maintenance/`__ — Maintenance scripts use these validators to ensure configuration integrity
- __`includes/validation.sh`__ — Shared validation helpers that may call these Node.js validators
- __CI/CD Workflows__ — Automated validation as part of the build and deployment process

## Schema Management

- Schemas are automatically downloaded and cached in `schemas/` directory
- Local schema files are used as fallback when remote schemas are unavailable
- Schema validation ensures configuration files meet current standards

## Dependencies

- __Node.js__ — Required for running the JavaScript validation scripts
- __js-yaml__ — YAML parsing and validation
- __JSON Schema__ — Schema validation capabilities

## Contributing

- All validation scripts must follow [LightSpeedWP Coding Standards](../../.github/instructions/coding-standards.instructions.md)
- Add tests for any new validation functionality
- Update schema paths and URLs as needed for new configuration types
- See [CONTRIBUTING.md](../../CONTRIBUTING.md) for contribution guidelines

## 🔄 Validation Process Flow

```mermaid
sequenceDiagram
    participant User as User/CI
    participant Validator as Validation Script
    participant Schema as Schema Manager
    participant Parser as YAML Parser
    participant Fields as Field Validator
    participant Logger as Log System
    
    User->>Validator: validate-coderabbit-yml.cjs
    Validator->>Schema: Download/cache schema
    Schema->>Validator: Return schema
    Validator->>Parser: Parse YAML file
    Parser->>Validator: Parsed structure
    Validator->>Fields: Validate fields
    Fields->>Validator: Validation results
    Validator->>Logger: Log results
    Logger->>User: Validation report
    
    Note over User,Logger: Comprehensive validation pipeline
```

---

## 📚 References

### 🔗 Documentation Links

- [LightSpeedWP Main Repository](https://github.com/lightspeedwp/.github)
- [CodeRabbit Documentation](https://docs.coderabbit.ai/)
- [YAML Specification](https://yaml.org/spec/)
- [JSON Schema Documentation](https://json-schema.org/)

### 🛠️ Development Resources

- [Schema Definitions Directory](../../schemas/)
- [Shared Includes Directory](../includes/)
- [Testing Guidelines](../../.github/instructions/tests.instructions.md)
- [Node.js Package Configuration](../../package.json)

### 🎯 AI & Automation

- [Custom Instructions](../../.github/custom-instructions.md)
- [GitHub Actions Workflows](../../.github/workflows/)
- [Contributing Guidelines](../../CONTRIBUTING.md)
- [Coding Standards](../../.github/instructions/coding-standards.instructions.md)

## License

GPL v3. See [LICENSE](../../LICENSE).

---

_✅ Ensuring configuration integrity through automated validation and schema compliance._
