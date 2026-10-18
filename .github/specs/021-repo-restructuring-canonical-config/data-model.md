# Phase 1 Data Model: Governance Configuration Entities

**Date**: 2026-10-18  
**Status**: Complete  
**Output**: Data structures for governance consolidation

---

## Governance Entities

### Entity 1: Label

**Purpose**: Categorize and filter issues and PRs by type, status, priority, and area.

**Source of Truth**: `lightspeedwp/.github/labels.yml`

**Structure**:
```yaml
- name: type:feature
  description: New feature or user-facing enhancement
  color: 0075ca
  
- name: status:in-progress
  description: Work is actively progressing
  color: ffd700
```

**Fields**:
| Field | Type | Required | Example | Validation |
|-------|------|----------|---------|-----------|
| name | string | Yes | `type:feature` | Must have prefix (type:, status:, priority:, area:, meta:) |
| description | string | Yes | "New feature..." | Max 100 chars |
| color | string | Yes | `0075ca` | Valid hex color code (no #) |

**Uniqueness**: Each label name is globally unique across all consuming repos.

**Constraints**:
- Label names MUST be prefixed (type:, status:, priority:, area:, meta:)
- No bare labels (bug, feature, urgent, etc.)
- All 158 canonical labels in source of truth; no local additions in consumer repos

**State Transitions**: Labels are static; no lifecycle states (created → never deleted once used).

**Relationships**:
- Labels reference Issue Types (many-to-one)
- Labels reference PR Templates (many-to-one)
- Branch Types map to default labels (one-to-many)

---

### Entity 2: Issue Type

**Purpose**: Define GitHub issue categories that automatically route to appropriate templates.

**Source of Truth**: `lightspeedwp/.github/issue-types.yml`

**Structure**:
```yaml
- id: 1
  name: Task
  description: Scoped work unit
  aboutUrl: null
  body:
    - type: markdown
      id: body
      attributes:
        value: |
          ## Description
          [Task description]
```

**Fields**:
| Field | Type | Required | Example | Validation |
|-------|------|----------|---------|-----------|
| id | integer | Yes | 1 | Unique, 1-25 (GitHub limit) |
| name | string | Yes | `Task` | Max 50 chars |
| description | string | Yes | "Scoped work unit" | Max 200 chars |
| aboutUrl | string | No | null | Valid URL if provided |

**Uniqueness**: Each issue type ID is globally unique; name is human-readable.

**Constraints**:
- GitHub limits 25 issue types per org
- Current: 24 canonical types; 1 reserved for future
- All types defined in canonical .github/issue-types.yml
- No local overrides in consumer repos

**Relationships**:
- Issue Type → Issue Template (one-to-one)
- Issue Type → Label (many-to-one; e.g., Task → type:task)

---

### Entity 3: PR Template

**Purpose**: Guide PR authors through required information based on branch type.

**Source of Truth**: `lightspeedwp/.github/PULL_REQUEST_TEMPLATE/`

**Structure**:
```markdown
---
type: feature
label: type:feature
---

# Summary
[1-3 sentence summary of changes]

## Testing
- [ ] Unit tests added
- [ ] Manual testing completed
```

**Files**:
| File | Branch Type | Type Label | Purpose |
|------|-------------|-----------|---------|
| pr_feature.md | feat/, proto/, perf/, api/, research/, seo/ | type:feature | New features/enhancements |
| pr_bug.md | fix/, revert/ | type:bug | Bug fixes |
| pr_release.md | release/, hotfix/ | type:release | Release/hotfix |
| pr_refactor.md | refactor/, schema/, migrate/ | type:refactor | Refactoring/migrations |
| pr_chore.md | chore/, config/ | type:chore | Maintenance |
| pr_docs.md | docs/, doc/, content/, i18n/ | type:docs | Documentation |
| pr_test.md | test/, qa/, uat/ | type:test | Testing |
| pr_ci.md | ci/, build/, ops/, telemetry/ | type:ci | CI/CD |
| pr_design.md | design/, ds/, ux/ | type:design | Design |
| pr_a11y.md | a11y/ | type:a11y | Accessibility |
| pr_audit.md | audit/ | type:audit | Audits |
| pr_dep_update.md | deps/ | type:dependency | Dependencies |
| pr_security.md | security/ | type:security | Security |
| pr_aiops.md | aiops/, automation/, codex/ | type:aiops | AI Ops |
| pr_epic.md | epic/ | type:epic | Epics |

**Constraints**:
- All templates live in canonical `.github/PULL_REQUEST_TEMPLATE/`
- No local template copies in consumer repos
- Each template has frontmatter specifying branch type → label mapping

**Relationships**:
- PR Template → Branch Type (many-to-one)
- PR Template → Type Label (one-to-one)

---

### Entity 4: Issue Template

**Purpose**: Guide issue reporters through required information by issue type.

**Source of Truth**: `lightspeedwp/.github/ISSUE_TEMPLATE/`

**Structure**:
```markdown
---
name: Task
about: Scoped unit of work
title: '[TASK] '
labels: 'type:task'
---

## Description
[Task description]

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
```

**Files**: 26 templates (001-task.md through 025-build.md), one per issue type

**Constraints**:
- All templates live in canonical `.github/ISSUE_TEMPLATE/`
- No local template copies in consumer repos
- Automatic routing by issue type selection (GitHub native)

**Relationships**:
- Issue Template → Issue Type (one-to-one)
- Issue Template → Label (one-to-one)

---

### Entity 5: Branch Type

**Purpose**: Map branch prefixes to PR templates and default labels.

**Source of Truth**: `lightspeedwp/.github/branch-types.yml`

**Structure**:
```yaml
routing:
  feat:
    template: pr_feature.md
    label: type:feature
    description: New feature
  fix:
    template: pr_bug.md
    label: type:bug
    description: Bug fix
  # ... [38 types total]
```

**Fields**:
| Field | Type | Example | Validation |
|-------|------|---------|-----------|
| branch_type | string | `feat` | One of 38 authorized types |
| template | string | `pr_feature.md` | Must exist in `.github/PULL_REQUEST_TEMPLATE/` |
| label | string | `type:feature` | Must exist in labels.yml |
| description | string | "New feature" | Max 50 chars |

**Uniqueness**: Each branch type is unique and maps to exactly one template.

**Constraints**:
- Exactly 38 authorized branch types (from CLAUDE.md)
- FORBIDDEN prefixes: claude/, copilot/, openai/
- Each type maps to exactly one PR template
- Each type maps to exactly one type label

**Relationships**:
- Branch Type → PR Template (many-to-one)
- Branch Type → Type Label (many-to-one)

---

### Entity 6: Custom Workflow

**Purpose**: Repository-specific automation that uses canonical governance.

**Source of Truth**: `lightspeedwp/ThisOneTimeOnAcidCom/.github/workflows/`

**Structure**:
```yaml
name: WordPress CI

on:
  pull_request:
    branches: [develop, main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run WordPress tests
        run: npm test
```

**Constraints**:
- Custom workflows are maintained locally in consumer repo
- Must NOT duplicate governance files (labels, templates, issue types)
- CAN reference canonical labels via GitHub API
- CAN use PR/issue templates via routing workflows

**Relationships**:
- Custom Workflow → Labels (via API reference, not duplication)
- Custom Workflow → PR Templates (via routing, not duplication)

---

## Data Validation Rules

### Label Validation
- ✅ Prefix check: name starts with type:, status:, priority:, area:, or meta:
- ✅ Uniqueness check: name doesn't exist in canonical labels.yml
- ✅ Color check: valid hex code (6 chars, no #)
- ❌ Reject if: unprefixed, duplicate, invalid color

### Issue Type Validation
- ✅ ID range check: 1-25 (GitHub hard limit)
- ✅ Uniqueness check: ID and name both unique
- ✅ Template link check: corresponding template exists
- ❌ Reject if: ID out of range, duplicate, template missing

### PR Template Validation
- ✅ Frontmatter check: contains type and label fields
- ✅ Label check: label exists in labels.yml
- ✅ Branch type check: all 38 types have templates
- ❌ Reject if: missing frontmatter, invalid label, branch type without template

### Branch Type Validation
- ✅ Type check: one of 38 authorized types
- ✅ Template existence check: template file exists
- ✅ Label existence check: label exists in labels.yml
- ✅ FORBIDDEN prefix check: not claude/, copilot/, openai/
- ❌ Reject if: unauthorized type, template missing, label missing, forbidden prefix

---

## Entity Relationships Diagram

```
Label
  ↑
  ├── (assigned by) ← PR Template
  ├── (assigned by) ← Issue Template
  └── (assigned by) ← Branch Type

Branch Type → PR Template → (frontmatter references) → Label

Issue Type → Issue Template → (frontmatter references) → Label

Custom Workflow → (uses via API) → Label
Custom Workflow → (uses via routing) → PR Template (from .github/)
```

---

## Migration State

**Current State** (before Phase 2):
- lightspeedwp/.github/: All canonical files ✅
- ThisOneTimeOnAcidCom/: Likely has duplicate labels.yml, templates (to be audited and removed)

**Target State** (after Phase 2):
- lightspeedwp/.github/: Canonical files (unchanged) ✅
- ThisOneTimeOnAcidCom/: Only custom workflows, no governance file duplication ✅
- Drift Prevention: Active, blocks new duplicate governance files ✅
