---
file_type: documentation
title: Label Schema Design Specification
description: Comprehensive label schema design with JSON Schema validation, metadata, and cross-repo consistency rules
created_date: 2026-09-03
last_updated: 2026-09-03
status: draft
tags:
  - schema
  - validation
  - design
  - labeling
---

# Label Schema Design Specification

**Status:** 🟡 Draft (Phase 2 specification)  
**Owner:** Task-Planner Agent  
**Version:** 1.0.0  
**Related:** [PLANNING.md](./PLANNING.md) | [RESEARCH_FINDINGS.md](./RESEARCH_FINDINGS.md) | [OPENSPEC.md](./OPENSPEC.md)

---

## Executive Summary

This document specifies the label schema design for the unified labeling agent. Based on Phase 1 research findings, the schema will:

- **Maintain flat, prefixed structure** (type:, status:, priority:, area:, etc.)
- **Add JSON Schema validation** with metadata and rules
- **Support cross-repo consistency** with optional repo-specific extensions
- **Enforce conflict detection** through validation rules
- **Enable automation** via metadata and automation hooks

**Current State:** 158 canonical labels in `.github/labels.yml`  
**Proposed State:** Same labels + JSON Schema validation + metadata layer

---

## 1. Current Schema Analysis

### 1.1 Existing Structure

**File:** `.github/labels.yml`

**Current Format (YAML array):**
```yaml
- name: type:bug
  color: d73a49
  description: Bug report or issue

- name: status:needs-triage
  color: fbca04
  description: Waiting for triage

- name: priority:critical
  color: ff0000
  description: Critical priority
```

**Issues with Current Schema:**
- No validation rules (invalid label combinations allowed)
- No metadata for automation hooks
- No conflict detection
- Manual synchronization across repos
- No formal taxonomy definition

### 1.2 Label Taxonomy

**Current Families (158 total labels):**

| Family | Count | Examples | Purpose |
|--------|-------|----------|---------|
| `type:*` | 33 | bug, feature, task, epic, story | Issue/PR classification |
| `status:*` | 20 | needs-triage, ready, in-progress, done | Workflow state |
| `priority:*` | 4 | critical, high, normal, low | Urgency/importance |
| `area:*` | 30+ | ci, docs, block-editor, theme | Component/domain |
| `comp:*` | 24 | block-button, theme-json | Specific components |
| `lang:*` | 7 | php, js, css, html, md, json, yaml | Programming language |
| `release:*` | 4 | breaking, feature, enhancement, fix | Release scope |
| Other | ~36 | ai-ops, discussion, openspec, contrib, compat | Operational categories |

---

## 2. Proposed Schema Design

### 2.1 Schema Structure

**Decision:** Keep flat, prefixed structure (per Research Question 7)

**Rationale:**
- Existing taxonomy is well-established and understood
- Flat structure is simpler to implement and maintain
- Prefix-based organization is familiar to team
- Easier to integrate with GitHub's label system

**Alternative Considered (Rejected):** Nested hierarchy
```yaml
# NOT CHOSEN - adds complexity
categories:
  type:
    bug: {...}
    feature: {...}
```

### 2.2 Proposed Label Definition Format

```yaml
version: "1.0.0"
labels:
  - name: type:bug
    color: "#d73a49"
    description: Bug report or issue
    family: type
    metadata:
      automation_rules:
        - auto_label_source: code-change-diff
          trigger: contains("bug")
      usage_pattern: automatic
      required_with: []
      conflicts_with: [type:feature, type:task]
      changelog_included: true
      release_scope: breaking|feature|fix|chore
      suggestions:
        - if_keywords: [error, crash, fail]
          suggest: type:bug
```

### 2.3 Metadata Fields

**Each label should include:**

```json
{
  "name": "type:bug",
  "color": "#d73a49",
  "description": "Bug report or issue",
  "family": "type",
  "metadata": {
    "automation_rules": [
      {
        "trigger": "code-change-diff",
        "pattern": "bug.*fix|fix.*bug",
        "confidence": 0.85,
        "auto_apply": true
      }
    ],
    "usage_pattern": "automatic|manual|both",
    "required_with": [],
    "conflicts_with": ["type:feature", "type:task"],
    "changelog_included": true,
    "release_scope": "breaking",
    "version_introduced": "1.0.0",
    "deprecated": false,
    "owner": "team-automation",
    "usage_stats": {
      "total_uses": 1234,
      "avg_per_month": 45,
      "repos_using": 12
    }
  }
}
```

---

## 3. JSON Schema Validation

### 3.1 Label Definition Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "version": {
      "type": "string",
      "pattern": "^[0-9]+\\.[0-9]+\\.[0-9]+$"
    },
    "labels": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["name", "color", "description", "family"],
        "properties": {
          "name": {
            "type": "string",
            "pattern": "^[a-z0-9]+-?[a-z0-9]*:[a-z0-9-]*$"
          },
          "color": {
            "type": "string",
            "pattern": "^#[0-9a-f]{6}$"
          },
          "description": {
            "type": "string",
            "minLength": 5,
            "maxLength": 100
          },
          "family": {
            "type": "string",
            "enum": ["type", "status", "priority", "area", "comp", "lang", "release", "ai-ops", "discussion", "openspec", "contrib", "compat", "cpt", "env"]
          },
          "metadata": {
            "type": "object",
            "properties": {
              "automation_rules": {"type": "array"},
              "usage_pattern": {
                "type": "string",
                "enum": ["automatic", "manual", "both"]
              },
              "required_with": {"type": "array"},
              "conflicts_with": {"type": "array"},
              "changelog_included": {"type": "boolean"},
              "deprecated": {"type": "boolean"}
            }
          }
        }
      }
    }
  },
  "required": ["version", "labels"]
}
```

---

## 4. Conflict Detection & Validation Rules

### 4.1 Conflict Rules Matrix

**Type Label Conflicts:**
```yaml
conflicts:
  type:bug:
    - type:feature
    - type:task
    - type:story
  type:epic:
    - type:bug
    - type:task
    - type:feature
  type:documentation:
    - type:code
```

**Status Progression Rules:**
```yaml
status_transitions:
  needs-triage:
    allowed_next: [ready, blocked, wont-fix]
  ready:
    allowed_next: [in-progress, blocked]
  in-progress:
    allowed_next: [done, blocked, review-needed]
  done:
    allowed_next: [reopened]
```

**Mutual Requirements:**
```yaml
required_with:
  priority:critical:
    - status:needs-review
    - area:* (at least one)
  type:epic:
    - status:* (required)
    - no status:done (until all subtasks done)
```

### 4.2 Validation Algorithm

```
function validate_labels(pr_labels, issue_type):
  1. Check all labels match schema pattern
  2. Verify family prefixes are valid
  3. Detect conflicts using conflict matrix
  4. Enforce required combinations
  5. Validate status transitions
  6. Suggest missing recommended labels
  7. Return validation result with conflicts/suggestions
```

---

## 5. Cross-Repo Consistency Rules

### 5.1 Canonical vs. Custom Labels

**Canonical Labels (Mandatory across all repos):**
- All `type:*` labels (33 total)
- All `status:*` labels (20 total)
- All `priority:*` labels (4 total)
- All `release:*` labels (4 total)

**Extendable Labels (Optional per repo):**
- `area:*` — Repos may add custom areas (e.g., `area:custom-plugin-x`)
- `comp:*` — Repos may add component-specific labels
- Custom families — With approval (documented in SCHEMA_DESIGN.md)

### 5.2 Per-Repo Schema Extension

**Override Mechanism:**
```yaml
# In each repo's .github/schema.yml
version: "1.0.0"
extends: canonical  # Inherits all canonical labels
custom_labels:
  - name: area:custom-integration
    color: "#abcdef"
    description: Custom integration area
    family: area
    metadata:
      repo_specific: true
      required_repos: [plugin-x]
```

### 5.3 Validation at Deployment

- Central validator checks custom labels against canonical set
- Rejects labels that conflict with canonical names
- Enforces naming conventions
- Logs all custom extensions for audit trail

---

## 6. Implementation Examples

### 6.1 Valid Label Combinations

✅ **Correct:**
```yaml
labels:
  - type:bug
  - status:needs-triage
  - priority:high
  - area:ci
  - lang:python
```

❌ **Invalid (conflicts):**
```yaml
labels:
  - type:bug
  - type:feature  # CONFLICT: Cannot have two type: labels
  - status:needs-triage
```

### 6.2 Schema Validation Test Cases

| Input | Expected | Reason |
|-------|----------|--------|
| `type:bug` | ✅ Pass | Valid canonical label |
| `type:INVALID` | ❌ Fail | Case sensitivity |
| `invalid-prefix:bug` | ❌ Fail | Invalid family |
| `type:bug, type:feature` | ❌ Fail | Conflict |
| `priority:high, area:ci` | ✅ Pass | No conflict |
| `area:custom-x` (custom) | ⚠️ Warn | Requires override file |

---

## 7. Rollout Strategy

### 7.1 Schema Deployment Timeline

**Week 1-2:** Validate current labels against schema  
**Week 2-3:** Deploy schema validator to CI  
**Week 3-4:** Add metadata to canonical labels  
**Week 4+:** Enable automation rules and conflict detection  

### 7.2 Backward Compatibility

- All existing labels remain valid
- New metadata is additive (doesn't break existing labels)
- Validation warns before failing
- Gradual enforcement (soft → hard rules over time)

---

## 8. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Schema Validation Coverage | 100% | All 158+ labels pass validation |
| Cross-Repo Label Consistency | 100% | All repos use canonical labels |
| Conflict Detection Accuracy | >95% | Test suite coverage |
| Metadata Completeness | 100% | All labels have automation rules |
| CI Integration | 100% | All PRs validated on merge |

---

## References

- [PLANNING.md](./PLANNING.md) — Project phases and timeline
- [RESEARCH_FINDINGS.md](./RESEARCH_FINDINGS.md) — Research Q7 findings on schema
- [OPENSPEC.md](./OPENSPEC.md) — Architecture overview
- [.github/labels.yml](../../labels.yml) — Current label definitions
- GitHub Label API: https://docs.github.com/en/rest/reference/issues#labels

---

**Schema Version:** 1.0.0  
**Created:** 2026-09-03  
**Last Updated:** 2026-09-03  
**Maintained By:** Claude
