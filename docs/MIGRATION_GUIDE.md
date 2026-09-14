# Agent Specification Migration Guide

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](<https://img.shields.io/badge/Docs> Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](<https://img.shields.io/badge/Labeling> Governance-OK-success.svg)
![Main Branch Guard](<https://img.shields.io/badge/Main> Branch Guard-OK-success.svg)
![Metadata Governance](<https://img.shields.io/badge/Metadata> Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](<https://img.shields.io/badge/Template> Enforcement-OK-success.svg)
![Validate PR Template](<https://img.shields.io/badge/Validate> PR Template-OK-success.svg)
![Badges: Documentation Update](<https://img.shields.io/badge/Badges>: Documentation Update-OK-success.svg)
![Badges: Health Check](<https://img.shields.io/badge/Badges>: Health Check-OK-success.svg)
![Badges: README Status Maintenance](<https://img.shields.io/badge/Badges>: README Status Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](<https://img.shields.io/badge/Badges>: Workflow Inventory Audit-OK-success.svg)
[![branch-management](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![events-issue-pr-metadata](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml)
[![issue-management](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml)
[![pr-workflow](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml)
[![project-management](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml)
[![release-orchestration](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml)
[![reporting-metrics](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml)
<!-- BADGES-END -->

This guide walks you through migrating existing agent definitions to the new agent specification format.

## Overview

The agent specification system provides a standardized format for defining AI agents with comprehensive metadata, validation, and documentation. If you have existing agent definitions in an older or custom format, this guide helps you migrate them.

## Before You Start

### Check Your Current Format

Identify your current agent definition format:

- **Custom YAML:** Agent definitions in loose YAML with limited structure
- **Simple Markdown:** Agent documentation without structured metadata
- **Legacy Format:** Older agent definition system with different field names
- **JSON Configuration:** Agent settings in JSON files
- **Inline Code Comments:** Agent definitions embedded in source code

### What You'll Gain

Migrating to the new format provides:

- ✅ **Standardized Metadata:** Consistent structure across all agents
- ✅ **Validation Support:** Automatic validation of agent specifications
- ✅ **Version Control:** Track agent versions and changes
- ✅ **Approval Workflow:** Formal approval tracking
- ✅ **Integration:** Pre-commit hooks and CI/CD integration
- ✅ **Discovery:** Searchable agent catalog with tags
- ✅ **Documentation:** Automatic documentation generation

## Migration Process

### Step 1: Choose a Reference Example

Find a similar agent in the examples directory to use as a template.

### Step 2: Create Your Specification File

Create a new file: `agents/{agent-name}.agent.md`

### Step 3: Update Required Fields

Fill in all required frontmatter fields with your agent information.

### Step 4: Validate Your Specification

Run validation to check for errors:

```bash
npm run validate:frontmatter -- agents/my-agent.agent.md
```

### Step 5: Run Tests

```bash
npm test
```

All tests should pass before committing.

## Field Mapping Guide

If migrating from other systems:

| Old Field | New Field |
|-----------|-----------|
| `name` | `name` (title case) |
| `description` | `description` (expand if brief) |
| `version` | `version` (semantic X.Y.Z) |
| `created` | `created_date` (YYYY-MM-DD) |
| `modified` | `updated_date` (YYYY-MM-DD) |
| `author` | `created_by` |
| `type` | `category` |
| `tags` | `tags` |

## Validation Checklist

Before committing:

- [ ] All required fields present
- [ ] Dates in YYYY-MM-DD format
- [ ] Version uses semantic versioning
- [ ] Category is from standard list
- [ ] Status is valid (active, draft, deprecated, archived)
- [ ] No sensitive data in specification
- [ ] Implementation directory exists
- [ ] Validation passes

## Common Issues

### Missing Required Fields

Add missing frontmatter fields. All required fields must be present.

### Invalid Date Format

Convert dates to ISO 8601 (YYYY-MM-DD).

### Non-Standard Category

Map to one of: governance, analysis, generation, automation, integration, security, documentation

### Implementation Directory Missing

Create the directory or update the reference path.

## Testing Your Migration

```bash
# Validate
npm run validate:frontmatter -- agents/my-agent.agent.md

# Run tests
npm test

# Lint
npm run lint
```

## Next Steps

After migration:

1. Update documentation links
2. Test integration with tools
3. Verify all use cases work
4. Remove old specification if no longer needed
5. Consider adding as example if useful for others

---

**Last Updated:** 2026-09-03
**Related:** [TROUBLESHOOTING.md](./TROUBLESHOOTING.md), [API_REFERENCE.md](./API_REFERENCE.md)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)
