---
title: "Contract Tests"
description: "Test suite for validating schema compliance, template contracts, and data integrity across configurations"
version: "1.0"
last_updated: "2025-11-18"
author: "LightSpeed WP Team"
category: "tests"
tags: ["contracts", "testing", "schemas", "validation", "jest"]
standards:
  - "https://github.com/lightspeedwp/.github/blob/develop/.github/instructions/coding-standards.instructions.md"
  - "https://github.com/lightspeedwp/.github/blob/develop/.github/custom-instructions.md"
references:
  - "../README.md"
  - "../../docs/TESTING.md"
  - "../../.github/automation/labels.yml"
  - "../includes/README.md"
---

# Contract Tests

Comprehensive test suite for validating that templates, configurations, and data structures comply with their defined contracts and schemas. Ensures consistency and integrity across the LightSpeed WP ecosystem.

## Overview

The contract test suite ensures:

- **Schema compliance** - All data matches defined JSON/YAML schemas
- **Template integrity** - Issue/PR templates reference only canonical labels
- **Data consistency** - Cross-file references are valid
- **Contract adherence** - APIs and interfaces meet their contracts
- **Breaking changes** - Schema changes don't break existing data

## Test Files

| File                      | Purpose                   | Test Count | Status    |
| ------------------------- | ------------------------- | ---------- | --------- |
| `test-template-labels.js` | Template label validation | 1+         | ✅ Active |

## Test Categories

### 1. Template Contract Validation

**Purpose:** Ensure templates reference only defined, canonical labels.

**Tests:**

- Issue template label validation
- PR template label validation
- Label existence in canonical source
- Label format compliance
- Template schema validation

**Coverage:**

- `.github/ISSUE_TEMPLATE/*.yml` files
- `.github/PULL_REQUEST_TEMPLATE/*.md` files
- `.github/automation/labels.yml` canonical labels

### 2. Schema Compliance

**Purpose:** Validate data structures against their JSON/YAML schemas.

**Tests (Planned):**

- Frontmatter schema validation
- Workflow schema compliance
- Configuration file validation
- API response contracts
- Data structure integrity

**Coverage:**

- Documentation frontmatter
- GitHub Actions workflows
- Configuration files
- Agent contracts

### 3. Cross-Reference Integrity

**Purpose:** Ensure references between files are valid and maintained.

**Tests (Planned):**

- Label references valid
- Documentation links exist
- Workflow dependencies present
- Agent compatibility
- Configuration cascades

**Coverage:**

- Label system
- Documentation network
- Workflow dependencies
- Agent ecosystem

### 4. API Contract Testing

**Purpose:** Validate internal and external API contracts.

**Tests (Planned):**

- GitHub API compatibility
- Agent interface contracts
- Helper function signatures
- Module exports
- Type definitions

**Coverage:**

- Agent APIs
- Helper utilities
- Shared libraries
- External integrations

## Running the Tests

### Run All Contract Tests

```bash
# From repository root
npm run test:contracts

# Or using Jest directly
npx jest tests/contracts/

# Or using Node directly
node tests/contracts/test-template-labels.js
```

### Run Specific Test

```bash
# Run specific test file
npx jest tests/contracts/test-template-labels.js

# Run with pattern
npx jest -t "template labels"
```

### With Verbose Output

```bash
# See detailed test execution
npx jest --verbose tests/contracts/

# See actual vs expected values
npx jest --verbose --expand tests/contracts/
```

## Test Infrastructure

### Dependencies

- **Node.js**: JavaScript runtime for Jest tests
- **Jest**: Testing framework (optional, can run standalone)
- **js-yaml**: YAML parsing for configuration files
- **JSON Schema**: Schema validation libraries

### File Structure

```
tests/contracts/
├── README.md                    (This file)
├── test-template-labels.js     (Template label validation)
└── [future test files]
```

### Data Sources

Contract tests validate against these sources:

| Source          | Purpose                     | Location                         |
| --------------- | --------------------------- | -------------------------------- |
| `labels.yml`    | Canonical label definitions | `.github/automation/labels.yml`  |
| Issue templates | Issue form schemas          | `.github/ISSUE_TEMPLATE/`        |
| PR templates    | Pull request templates      | `.github/PULL_REQUEST_TEMPLATE/` |
| Schemas         | JSON/YAML schemas           | `schemas/` directory             |

## Writing Contract Tests

### Test Template (Node.js)

```javascript
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

// Load canonical source of truth
const canonical = yaml.load(fs.readFileSync("path/to/canonical.yml", "utf8"));

// Load data to validate
const templates = findTemplateFiles();

// Validate each template
let failed = false;
for (const file of templates) {
  const data = yaml.load(fs.readFileSync(file, "utf8"));

  // Validate contract
  for (const item of data.items || []) {
    if (!canonical.has(item)) {
      console.error(`[ERROR] ${file} references unknown: ${item}`);
      failed = true;
    }
  }
}

if (failed) process.exit(1);
console.log("[OK] All contracts validated");
```

### Test Template (Jest)

```javascript
describe("Contract Validation", () => {
  it("should validate all items against canonical source", () => {
    const canonical = loadCanonical();
    const templates = loadTemplates();

    templates.forEach((template) => {
      template.items.forEach((item) => {
        expect(canonical).toContain(item);
      });
    });
  });
});
```

### Best Practices

1. **Canonical Source** - Always define single source of truth
2. **Clear Errors** - Report exactly what failed and why
3. **File Paths** - Include file paths in error messages
4. **Exit Codes** - Use non-zero exit on validation failure
5. **Fast Execution** - Keep contract tests fast (<1s)

### Common Assertions

```javascript
// Item exists in canonical source
expect(canonical.has(item)).toBe(true);

// Schema valid
expect(validateSchema(data, schema)).toBe(true);

// Reference exists
expect(fs.existsSync(referencedPath)).toBe(true);

// Format correct
expect(item).toMatch(/^[a-z-]+$/);
```

## Contract Standards

All contracts must comply with:

1. **Single Source of Truth** - Define canonical data source
2. **Schema Definitions** - Document expected structure
3. **Validation Logic** - Automated validation for all contracts
4. **Error Reporting** - Clear, actionable error messages
5. **Documentation** - Document contract requirements

## Current Contract Validations

### Template Labels Contract

**Source:** `.github/automation/labels.yml`

**Validates:**

- All issue template labels exist in `labels.yml`
- All PR template labels exist in `labels.yml`
- No undefined labels used in templates

**Files Checked:**

- `.github/ISSUE_TEMPLATE/*.yml`
- `.github/ISSUE_TEMPLATE/*.yaml`

**Example Error:**

```
[ERROR] .github/ISSUE_TEMPLATE/bug-report.yml references non-canonical label: typo-label
```

## Planned Contract Validations

### Frontmatter Schema

**Source:** `schemas/frontmatter.schema.json`

**Will Validate:**

- Documentation frontmatter structure
- Required fields presence
- Field type correctness
- Valid reference links

### Workflow Schema

**Source:** GitHub Actions schema

**Will Validate:**

- Workflow YAML syntax
- Job dependencies
- Secret references
- Required workflow fields

### Agent Interface Contract

**Source:** Agent base class/interface

**Will Validate:**

- Required methods implemented
- Method signatures correct
- Return types consistent
- Error handling present

## Test Coverage Goals

| Area                | Current | Target | Status      |
| ------------------- | ------- | ------ | ----------- |
| Template labels     | 100%    | 100%   | 🟢 Complete |
| Frontmatter schemas | 0%      | 90%    | 🔴 Planned  |
| Workflow schemas    | 0%      | 85%    | 🔴 Planned  |
| API contracts       | 0%      | 80%    | 🔴 Planned  |

## Related Documentation

- [Main Test Documentation](../README.md)
- [Test Coverage Summary](../TEST_COVERAGE_SUMMARY.md)
- [Label Automation](../../docs/label-automation/README.md)
- [Frontmatter Schema](../../docs/frontmatter-schema.md)
- [Validation Scripts](../../scripts/validation/README.md)

## Continuous Integration

Contract tests run automatically:

- **On PR creation** - Validate templates and schemas
- **On configuration changes** - When labels/templates modified
- **Pre-commit** - Via Husky hooks (optional)
- **Pre-release** - Required before version bumps

## Troubleshooting

### Test Failures

**Label not found:**

```bash
# Check label exists in canonical source
grep "label-name" .github/automation/labels.yml

# Fix: Add label to labels.yml or fix typo in template
```

**YAML parsing error:**

```bash
# Validate YAML syntax
npx js-yaml .github/ISSUE_TEMPLATE/bug-report.yml

# Check for:
# - Incorrect indentation
# - Missing colons
# - Invalid characters
```

**File not found:**

```bash
# Verify file paths
ls .github/ISSUE_TEMPLATE/
ls .github/automation/

# Check path resolution
echo "$PWD"
```

### Common Issues

**Templates not found:**

- Verify template directory exists
- Check file extensions (.yml, .yaml)
- Ensure relative paths correct

**Canonical source missing:**

- Verify `labels.yml` exists
- Check file has expected structure
- Validate YAML syntax

**False positives:**

- Review validation logic
- Check for case sensitivity
- Verify string matching

## Example: Template Label Validation

```javascript
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

// Load canonical labels
const labelsYaml = yaml.load(
  fs.readFileSync(path.resolve(".github/automation/labels.yml"), "utf8"),
);
const labels = new Set(Object.keys(labelsYaml.labels || {}));

// Find all templates
function findTemplates(dir) {
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".yml") || f.endsWith(".yaml"))
    .map((f) => path.join(dir, f));
}

const templatesDir = path.resolve(".github/ISSUE_TEMPLATE");
const templates = fs.existsSync(templatesDir)
  ? findTemplates(templatesDir)
  : [];

// Validate each template
let failed = false;

for (const file of templates) {
  const tpl = yaml.load(fs.readFileSync(file, "utf8"));
  const declared = new Set(tpl.labels || []);

  for (const l of declared) {
    if (!labels.has(l)) {
      console.error(`[ERROR] ${file} references non-canonical label: ${l}`);
      failed = true;
    }
  }
}

if (failed) process.exit(1);
console.log("[OK] All template labels exist in automation/labels.yml");
```

## Contributing

When adding new contract tests:

1. Identify the contract and canonical source
2. Create clear validation logic
3. Provide specific error messages with file paths
4. Update this README with contract description
5. Add examples of valid and invalid data
6. Document expected behavior
7. Include contract in CI pipeline

## Maintenance

- **Review quarterly** - Ensure contracts align with current needs
- **Update schemas** - Keep schemas in sync with data structures
- **Monitor failures** - Track and fix recurring validation issues
- **Expand coverage** - Add contracts for new data structures
- **Document changes** - Update README when contracts change

## Future Enhancements

Planned contract validations:

1. **Frontmatter Schema Validation** - Validate all doc frontmatter
2. **Workflow Schema Validation** - Check GitHub Actions workflows
3. **Agent Interface Contracts** - Validate agent implementations
4. **API Response Contracts** - Validate external API contracts
5. **Type Definitions** - TypeScript interface validation

---

**Last Updated:** 2025-11-18
**Maintained By:** LightSpeed WP Team
**Test Framework:** Node.js / Jest
**Status:** ✅ Active | 🟢 Passing
