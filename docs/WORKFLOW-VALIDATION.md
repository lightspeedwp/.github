---
file_type: "documentation"
title: "GitHub Actions Workflow Validation"
description: "Automated validation framework for GitHub Actions workflows with security, performance, quality, and consistency guardrails"
version: "v1.0"
last_updated: "2025-11-25"
created_date: "2025-11-25"
authors: ["LightSpeed Team"]
maintainer: "Ash Shaw"
license: "GPL-3.0"
tags:
  [
    "github-actions",
    "workflows",
    "validation",
    "guardrails",
    "quality-assurance",
  ]
domain: "governance"
stability: "stable"
---

# GitHub Actions Workflow Validation Framework

## Overview

This document describes the automated validation framework for GitHub Actions workflows in the LightSpeedWP organization. The framework ensures that all workflows meet organizational standards for security, performance, quality, and consistency.

## Purpose

The workflow validation system:

- **Enforces Security Best Practices**: Validates permissions, secret handling, and action versions
- **Ensures Performance**: Detects missing optimizations like caching and concurrency
- **Maintains Quality**: Checks for descriptive step names, proper error handling, and documentation
- **Promotes Consistency**: Verifies adherence to organizational standards

## Validation Categories

### 🔒 Security Guardrails

Security-related validations that are **strict** (errors block validation):

- **Explicit Permissions**: Workflows should declare explicit `permissions:` blocks
- **No Secrets in Shell**: Prevents accidental exposure of secrets through shell output
- **Action Version Pinning**: Requires full commit SHA pinning for security
- **Checkout Permissions**: Verifies safe checkout configuration

### ⚡ Performance Guardrails

Performance optimizations that are **warnings** (allow workflows to pass):

- **Caching Strategy**: Recommends caching for npm, pip, and other package managers
- **Concurrency Control**: Suggests concurrency configuration to prevent overlapping runs
- **Checkout Optimization**: Recommends fetch-depth settings for faster checkouts
- **Matrix Efficiency**: Checks for efficient matrix configurations

### ✅ Quality Guardrails

Code quality validations that are **warnings**:

- **Descriptive Step Names**: All run steps should have descriptive names
- **Error Handling**: Checks for proper error handling and cleanup steps
- **Timeout Configuration**: Validates timeout settings for long-running jobs
- **Resource Limits**: Ensures appropriate resource allocation

### 🔄 Consistency Guardrails

Organizational consistency checks that are **warnings**:

- **Consistent Trigger Events**: Encourages standard event triggers
- **Ubuntu Version**: Recommends ubuntu-latest for consistency
- **Action Organization**: Suggests organizing steps logically

## Running Validation

### Via npm Script

```bash
# Run all workflow validations
npm run validate:workflows

# Check results
# - ✅ Passed: 33
# - ❌ Failed: 0
# - ⚠️  Warnings: 97
```

### In CI/CD Pipeline

The validation runs automatically on:

- **Pull Requests**: When workflow files are modified
- **Scheduled**: Weekly validation of all workflows
- **Manual**: Via workflow_dispatch trigger

### Validation Output

The validator produces structured output including:

```
🔍 Workflow Validation Results

❌ ERRORS:
   [Only critical security issues shown]

⚠️  WARNINGS:
   [Best practice recommendations]

📊 Summary:
   Total workflows: 33
   ✅ Passed: 33
   ❌ Failed: 0
   ⚠️  Warnings: 97
```

## Configuration

### Guardrails File

The validation rules are defined in:

```javascript
// Location: scripts/validation/validate-workflows.js
// Contains: SecurityGuardrails, PerformanceGuardrails, QualityGuardrails, ConsistencyGuardrails
```

### Key Configuration

Each guardrail category includes:

```javascript
{
  enabled: true,                    // Enable/disable the entire category
  rules: {
    specificRule: {
      enabled: true,                // Enable/disable individual rules
      message: "Description",       // Error/warning message
      level: "warning" | "error"   // Severity level
    }
  }
}
```

## Workflow Improvements

Common recommendations from validation:

### 1. Add Permissions Block

```yaml
permissions:
  contents: read
  pull-requests: write
```

### 2. Add Concurrency Control

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

### 3. Optimize Checkout

```yaml
- uses: actions/checkout@v4
  with:
    fetch-depth: 0 # Full history when needed
```

### 4. Add Caching

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: "20"
    cache: "npm"
```

### 5. Descriptive Step Names

```yaml
- name: Run tests with coverage
  run: npm run test:coverage
```

## Validation Results

Current workflow validation results:

- **Total Workflows**: 33
- **Security Status**: ✅ All workflows follow security best practices
- **Performance**: 25 workflows could benefit from caching optimizations
- **Quality**: 20 workflows have steps without descriptive names
- **Consistency**: All workflows follow organizational patterns

## Best Practices

### When Creating New Workflows

1. **Always Include Permissions**

   ```yaml
   permissions:
     contents: read
   ```

2. **Pin Action Versions**

   ```yaml
   uses: actions/checkout@a1b82bbb3dd0ef16261a2ba3b91b4603d2e2d46b # v4
   ```

3. **Use Concurrency**

   ```yaml
   concurrency:
     group: ${{ github.workflow }}-${{ github.ref }}
   ```

4. **Name All Steps**

   ```yaml
   - name: Build application
     run: npm run build
   ```

5. **Cache Dependencies**

   ```yaml
   - uses: actions/setup-node@v4
     with:
       cache: "npm"
   ```

## Workflow Examples

### Secure, Optimized Workflow

```yaml
name: Build and Test

on:
  push:
    branches: [develop]
  pull_request:
    branches: [develop]

permissions:
  contents: read
  pull-requests: write

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    timeout-minutes: 30

    steps:
      - name: Checkout code
        uses: actions/checkout@a1b82bbb3dd0ef16261a2ba3b91b4603d2e2d46b # v4
        with:
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@60edb3dd545a775178fbb3d1d2aaf32c4631a3bb # v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run tests with coverage
        run: npm test:coverage

      - name: Upload coverage
        uses: actions/upload-artifact@65462800fd760344d3fbb3e7f58a62d3e9ce1e25 # v4
        if: always()
        with:
          name: coverage-report
          path: coverage/
```

## Troubleshooting

### Common Validation Errors

**Error: "Missing permissions block"**

- Solution: Add `permissions:` block to job or workflow level

**Error: "Action version not pinned to commit SHA"**

- Solution: Use full commit SHA instead of tag (find via GitHub UI)

**Error: "Secrets found in shell output"**

- Solution: Use GitHub's secret masking or avoid logging sensitive data

### Getting Detailed Results

```bash
# View full validation output with all warnings
npm run validate:workflows 2>&1 | less

# Check specific workflow
node scripts/validation/validate-workflows.js .github/workflows/lint.yml
```

## Integration with Development Workflow

### Local Development

1. **Before Committing Workflow Changes**

   ```bash
   npm run validate:workflows
   ```

2. **Fix Issues**
   - Address all errors (red)
   - Consider addressing warnings (yellow)

3. **Commit Changes**

   ```bash
   git add .github/workflows/your-workflow.yml
   git commit -m "feat(workflows): improve security and performance"
   ```

### CI/CD Integration

The validation automatically runs in:

- **PR Workflow**: Validates modified workflows
- **Scheduled Jobs**: Weekly comprehensive validation
- **Pre-commit Hooks**: Local validation via Husky

## References

- [GitHub Actions Security Documentation](https://docs.github.com/en/actions/security-guides)
- [Workflow Best Practices](https://docs.github.com/en/actions/guides)
- [LightSpeed Coding Standards](./../.github/instructions/coding-standards.instructions.md)
- [Automation Governance](./../.github/AUTOMATION_GOVERNANCE.md)

## Maintenance

The validation framework is maintained by the LightSpeed team. To propose improvements:

1. Open an issue with the `type:improvement` label
2. Include examples of workflows that should pass/fail
3. Link to relevant GitHub Actions documentation

---

**Last Updated**: 2025-11-25  
**Status**: ✅ Active  
**Maintainer**: Ash Shaw (@ashshaw)
