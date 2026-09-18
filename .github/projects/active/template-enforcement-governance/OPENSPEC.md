---
file_type: openspec
title: "Template Enforcement Governance — Technical Specification"
description: "Complete technical specification for PR and issue template enforcement, validation, and governance"
created_date: "2026-08-12"
last_updated: "2026-09-02"
status: active
version: "1.0.0"
---

# Template Enforcement Governance — OpenSpec Specification

## Overview

This document specifies the technical implementation of template enforcement governance for the LightSpeed `.github` repository. It covers PR template routing, issue template validation, frontmatter standardization, and label enforcement.

## 1. Scope

### 1.1 Templates Covered
- **PR Templates:** 9 total (bug, feature, chore, CI, dependency updates, docs, hotfix, refactor, release)
- **Issue Templates:** 25 total (all issue types defined in `.github/issue-types.yml`)
- **Total:** 34 templates subject to governance

### 1.2 Governance Rules
- Frontmatter standardization with schema validation
- Type-prefixed label enforcement
- Title pattern validation
- Template routing based on branch prefix
- Content structure validation

### 1.3 Components
- `.schemas/frontmatter.schema.json` — JSON Schema for frontmatter validation
- `.github/PULL_REQUEST_TEMPLATE/` — 9 PR templates with routing
- `.github/ISSUE_TEMPLATE/` — 25 issue templates
- `.github/workflows/template-enforcement.yml` — Validation workflow
- `scripts/validation/validate-frontmatter.cjs` — Frontmatter validator

---

## 2. Frontmatter Specification

### 2.1 Required Fields (All Templates)

```yaml
file_type: "pr-template" | "issue-template"
title: "{type}: {scope}"
name: "Human-Readable Name"
description: "Template purpose and when to use it"
labels: ["type:{type}", "status:{status}", "area:{area}?"]
```

### 2.2 Field Definitions

| Field | Type | Required | Values | Example |
|-------|------|----------|--------|---------|
| `file_type` | string | ✅ | `"pr-template"`, `"issue-template"` | `"pr-template"` |
| `title` | string | ✅ | `"{type}: {scope}"` | `"type:bug: {scope}"` |
| `name` | string | ✅ | Human-readable name | `"Bug Fix"` |
| `description` | string | ✅ | Brief purpose statement | `"Fix a defect or regression"` |
| `labels` | array | ✅ | Type-prefixed labels | `["type:bug", "status:needs-review"]` |

### 2.3 Schema Validation

**File:** `.schemas/frontmatter.schema.json`

```json
{
  "type": "object",
  "required": ["file_type", "title", "name", "description", "labels"],
  "properties": {
    "file_type": {
      "type": "string",
      "enum": ["pr-template", "issue-template"]
    },
    "title": {
      "type": "string",
      "pattern": "^[a-z0-9:{}\\- ]+$"
    },
    "name": {
      "type": "string"
    },
    "description": {
      "type": "string"
    },
    "labels": {
      "type": "array",
      "items": {
        "type": "string",
        "pattern": "^[a-z]+:[a-z0-9-]+$"
      }
    }
  }
}
```

---

## 3. Label Enforcement Specification

### 3.1 Label Prefixes (Required)

All labels must use one of the following prefixes:
- `type:` — Issue/PR type (bug, feature, task, etc.)
- `status:` — Current status (needs-review, in-progress, done, etc.)
- `priority:` — Priority level (critical, high, normal, low)
- `area:` — Affected area (ci, docs, labels, security, etc.)
- `meta:` — Metadata (needs-changelog, duplicate, etc.)

### 3.2 Default Labels by Template

**PR Templates:**
- All: `status:needs-review`
- Bug fix: `type:bug, status:needs-review`
- Feature: `type:feature, status:needs-review`
- Chore: `type:chore, status:needs-review`
- CI: `type:ci, status:needs-review, area:ci`
- Dependency: `type:deps, status:needs-review, area:dependencies`
- Docs: `type:docs, status:needs-review, area:documentation`
- Hotfix: `type:hotfix, status:needs-review, priority:critical`
- Refactor: `type:refactor, status:needs-review`
- Release: `type:release, status:needs-review`

**Issue Templates:**
- All: `status:needs-triage`
- Type-specific: `type:{issue-type}` based on issue type
- Optional: `priority:*`, `area:*` based on template

### 3.3 Label Validation Rules

1. **Bare Labels Forbidden:** ❌ `bug`, ❌ `feature`, ❌ `urgent`
2. **Prefix Required:** ✅ `type:bug`, ✅ `type:feature`, ✅ `priority:urgent`
3. **Case Sensitive:** ✅ `type:bug`, ❌ `Type:Bug`
4. **Case Convention:** lowercase with hyphens only (kebab-case)

---

## 4. PR Template Routing Specification

### 4.1 Routing Logic

GitHub does not natively support automatic template routing based on branch name. Instead:

1. Users manually select a template when creating a PR
2. Branch prefix determines expected template type
3. Repository provides documentation on branch-to-template mapping
4. CI validation confirms correct template for branch prefix

### 4.2 Routing Map

| Branch Prefix | Expected Template | Type |
|---------------|-------------------|------|
| `feat/` | `pr_feature.md` | Feature |
| `fix/` | `pr_bug.md` | Bug fix |
| `hotfix/` | `pr_hotfix.md` | Critical fix |
| `refactor/` | `pr_refactor.md` | Refactor |
| `chore/` | `pr_chore.md` | Chore |
| `docs/` | `pr_docs.md` | Documentation |
| `ci/`, `build/` | `pr_ci.md` | CI/Build |
| `deps/` | `pr_dep_update.md` | Dependency |
| `release/` | `pr_release.md` | Release |
| Other | Default template | — |

### 4.3 Validation Process

**File:** `.github/workflows/template-enforcement.yml`

1. On PR creation/update, extract branch name
2. Determine expected template type from branch prefix
3. Validate PR body matches expected template structure
4. Validate frontmatter of template used
5. Comment with results (pass/fail)
6. Block merge if validation fails

---

## 5. Issue Template Specification

### 5.1 Issue Template Structure

Each issue template includes:
- Frontmatter (YAML) with metadata
- Body content with sections and guidance
- Placeholder text and examples
- Checklists for acceptance criteria

### 5.2 Validation Rules

1. All required frontmatter fields present
2. Title follows pattern format
3. Default labels are type-prefixed
4. Template body has required sections
5. No bare labels in frontmatter

### 5.3 Issue Type Mapping

Each issue type has a corresponding template:
- Type mapping defined in `.github/issue-types.yml`
- Issue title pattern: `{type}: {scope}`
- Default label: `type:{issue-type}`

---

## 6. Validation Workflow Specification

### 6.1 Trigger Events

**File:** `.github/workflows/template-enforcement.yml`

- `pull_request`: Template validation on PR
- `pull_request_target`: Validation on PR from forks
- `issues`: Template validation on new issues

### 6.2 Validation Steps

1. **Frontmatter Validation**
   - Parse YAML frontmatter from template
   - Validate against schema
   - Check all required fields present
   - Verify field types and formats

2. **Label Validation**
   - Extract labels from frontmatter
   - Check all labels have proper prefix
   - Verify labels are canonical
   - Reject bare labels

3. **Title Validation**
   - Extract title pattern from frontmatter
   - Verify pattern follows format rules
   - Check for placeholder variables

4. **Structure Validation**
   - PR templates: Check for required sections
   - Issue templates: Check for required content
   - Verify section headers present
   - Validate markdown formatting

### 6.3 Error Handling

**Validation Failure Response:**
- Comment on PR/issue with detailed error
- List specific issues found
- Provide remediation steps
- Block merge until issues resolved

**Success Response:**
- Comment confirming validation passed
- List detected template type
- Confirm labels are valid

---

## 7. Schema Enforcement Specification

### 7.1 Validation Tool

**File:** `scripts/validation/validate-frontmatter.cjs`

**Command:** `npm run validate:frontmatter`

**Options:**
- `--fix`: Attempt to auto-fix validation errors
- `--strict`: Fail on any warnings
- `--path`: Validate specific file/directory
- `--report`: Generate JSON report

### 7.2 Exit Codes

| Code | Meaning |
|------|---------|
| 0 | All templates valid |
| 1 | One or more templates invalid |
| 2 | Configuration error |

### 7.3 Pre-commit Hook

**File:** `.husky/pre-commit`

- Runs validation on changed template files
- Blocks commit if validation fails
- Can be skipped with `--no-verify` (not recommended)

---

## 8. Configuration Files

### 8.1 Schema File

**File:** `.schemas/frontmatter.schema.json`

- JSON Schema format (draft-2020-12)
- Defines all required/optional fields
- Specifies allowed values
- Provides examples

### 8.2 Workflow Configuration

**File:** `.github/workflows/template-enforcement.yml`

- Defines CI validation jobs
- Sets error thresholds
- Configures notification behavior
- Defines rollback procedures

### 8.3 Validation Script Configuration

**File:** `scripts/validation/frontmatter.config.js`

- Path patterns for templates to validate
- Schema file location
- Error message templates
- Fix strategies

---

## 9. Error Scenarios & Handling

### 9.1 Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| Missing required field | Incomplete frontmatter | Add missing field to template |
| Invalid field type | Wrong value type | Use correct type (string/array) |
| Bare labels | Labels without prefix | Add prefix (e.g., `type:bug`) |
| Invalid title pattern | Title format incorrect | Use `{type}: {scope}` format |
| Schema validation failed | YAML parse error | Fix YAML syntax |

### 9.2 Error Messages

**Standard format:**
```
❌ Template validation failed for {template-path}

Issue 1: {field}: {error-description}
Solution: {remediation-step}

Issue 2: {field}: {error-description}
Solution: {remediation-step}

For more info, see: {link-to-docs}
```

---

## 10. Release & Versioning

### 10.1 Frontmatter Schema Versioning

- Current version: `1.0.0`
- Follows semantic versioning
- Breaking changes increment major version
- Backward compatibility maintained within major version

### 10.2 Template Versioning

- Each template can have its own version
- Version in frontmatter: `version: "1.0.0"`
- Major changes documented in changelog
- Deprecation notices for breaking changes

---

## 11. Documentation References

- [PLANNING.md](./PLANNING.md) — Project planning and roadmap
- [GAPS_AND_ENHANCEMENTS.md](./GAPS_AND_ENHANCEMENTS.md) — Outstanding work
- [ENHANCEMENT_TASKS.md](./ENHANCEMENT_TASKS.md) — Optional enhancements
- [CLAUDE.md](../../../../CLAUDE.md) — Developer instructions
- [AGENTS.md](../../../../AGENTS.md) — Agent governance rules
- [docs/BRANCHING_STRATEGY.md](../../../../docs/BRANCHING_STRATEGY.md) — Branch naming

---

**Specification Version:** 1.0.0  
**Last Updated:** 2026-09-02  
**Status:** Active  
**Maintainer:** LightSpeed Team
