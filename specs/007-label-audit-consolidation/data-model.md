# Label Audit Data Model

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
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![branch-validation-metrics-aggregator](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![events-issue-pr-metadata](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml)
[![issue-management](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml)
[![pr-template-routing](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml)
[![pr-workflow](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml)
[![project-management](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml)
[![release-orchestration](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml)
[![reporting-metrics](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml)
<!-- BADGES-END -->

**Scope**: Entity definitions for GitHub label audit and governance analysis  
**Date**: 2026-09-14 | **Version**: 1.0

---

## Core Entities

### 1. Label Family

**Definition**: Top-level category grouping related labels by function or domain

**Purpose**: Organize ~150 labels into manageable, conceptual buckets for consistency and auditing

**Attributes**:

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | ✅ | Family identifier (e.g., "status", "priority", "type", "area") |
| `name` | string | ✅ | Human-readable family name |
| `total_count` | integer | ✅ | Number of labels in this family (from canonical file) |
| `description` | string | ✅ | Family purpose and usage guidelines |
| `is_immutable` | boolean | ✅ | True for `type:*` family (25 labels, never change) |
| `canonical_count` | integer | ✅ | Labels defined in canonical labels.yml |
| `source_files` | string[] | ✅ | Files defining this family (e.g., [".github/labels.yml", ".github/issue-types.yml"]) |

**Example**:

```json
{
  "id": "type",
  "name": "Issue Type",
  "total_count": 25,
  "description": "Categorize work by nature (bug, feature, docs, test, etc.). Immutable - tied to GitHub issue types.",
  "is_immutable": true,
  "canonical_count": 25,
  "source_files": [".github/labels.yml", ".github/issue-types.yml"]
}
```

---

### 2. Label

**Definition**: Individual GitHub label with complete metadata, validation rules, and usage tracking

**Purpose**: Atomic unit of label governance; enables reconciliation and duplicate detection

**Attributes**:

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| `family` | string | ✅ | Label family ID (e.g., "status", "type", "area") |
| `name` | string | ✅ | Full label name with family prefix (e.g., "status:in-progress") |
| `color` | string | ✅ | Hex color code (e.g., "1D76DB") for GitHub UI |
| `description` | string | ✅ | Purpose and usage of this label |
| `canonical_name` | string | ✅ | Canonical name (source of truth) if different from current name |
| `in_canonical_file` | boolean | ✅ | Present in `.github/labels.yml` |
| `in_issue_types` | boolean | ✅ | Present in `.github/issue-types.yml` (type: family only) |
| `in_governance_policy` | boolean | ✅ | Present in never-delete list in governance policy |
| `in_documentation` | boolean | ✅ | Referenced in docs (LABEL_*.md, ISSUE_*.md, PR_*.md) |
| `referenced_in_workflows` | boolean | ✅ | Used in archived or active GitHub Actions workflows |
| `currently_in_api` | boolean | ✅ | Exists on GitHub repository via API (in use) |
| `is_orphan` | boolean | ✅ | Exists in GitHub API but NOT in canonical file (undocumented) |
| `duplication_status` | enum | ✅ | "unique" \| "duplicate_of:X" \| "consolidation_candidate" |
| `validation_errors` | string[] | ✅ | Any validation/consistency issues (empty if valid) |

**Validation Rules**:

1. **Canonical File Rule**: If `in_canonical_file` = false AND `currently_in_api` = true → Issue: orphan label
2. **Type Family Rule**: If `family` = "type" → MUST have `is_immutable` = true, `in_issue_types` = true
3. **Name Consistency Rule**: If `canonical_name` != `name` → Flag as mismatch
4. **Governance Rule**: If `in_governance_policy` = true but `in_canonical_file` = false → Governance gap
5. **Documentation Rule**: If `in_documentation` = true but `in_canonical_file` = false → Documentation gap

**Example**:

```json
{
  "family": "status",
  "name": "status:in-progress",
  "color": "1D76DB",
  "description": "Work in progress",
  "canonical_name": "status:in-progress",
  "in_canonical_file": true,
  "in_issue_types": false,
  "in_governance_policy": false,
  "in_documentation": true,
  "referenced_in_workflows": true,
  "currently_in_api": true,
  "is_orphan": false,
  "duplication_status": "unique",
  "validation_errors": []
}
```

**Duplicate Example**:

```json
{
  "family": "type",
  "name": "type:documentation",
  "color": "9198A1",
  "description": "Documentation",
  "canonical_name": "type:docs",
  "in_canonical_file": false,
  "in_issue_types": false,
  "in_governance_policy": true,
  "in_documentation": true,
  "referenced_in_workflows": false,
  "currently_in_api": false,
  "is_orphan": false,
  "duplication_status": "duplicate_of:type:docs",
  "validation_errors": [
    "Governance policy references non-canonical name",
    "Duplicate of canonical label type:docs"
  ]
}
```

---

### 3. Label Family Reconciliation Report

**Definition**: Analysis output for a single family showing completeness and consistency

**Purpose**: Enable family-by-family audit review and gap identification

**Attributes**:

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| `family_id` | string | ✅ | Family identifier |
| `total_canonical` | integer | ✅ | Labels defined in canonical file |
| `total_governance_only` | integer | ✅ | Labels in governance policy but NOT canonical |
| `total_documentation_gaps` | integer | ✅ | Labels undocumented in docs |
| `total_orphans` | integer | ✅ | Labels in GitHub API but not canonical |
| `total_duplicates` | integer | ✅ | Duplicate/consolidation candidate labels |
| `completeness_score` | float | ✅ | 0-100 percentage (100 = all labels canonical + documented + in-use) |
| `findings` | object[] | ✅ | Specific issues for this family (see Reconciliation Finding) |

**Example**:

```json
{
  "family_id": "type",
  "total_canonical": 25,
  "total_governance_only": 8,
  "total_documentation_gaps": 0,
  "total_orphans": 0,
  "total_duplicates": 2,
  "completeness_score": 76,
  "findings": [
    { "issue": "Governance policy references type:documentation (not canonical)", "severity": "high" },
    { "issue": "Governance policy references type:ai-ops (canonical is type:aiops)", "severity": "high" }
  ]
}
```

---

### 4. Reconciliation Finding

**Definition**: Specific inconsistency or gap identified during audit

**Purpose**: Enable traceability from finding to root cause to recommendation

**Attributes**:

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | ✅ | Unique finding ID (e.g., "F-001") |
| `finding_type` | enum | ✅ | "missing" \| "misnamed" \| "mismatched_color" \| "duplicate" \| "orphan" \| "governance_gap" \| "documentation_gap" |
| `severity` | enum | ✅ | "critical" \| "high" \| "medium" \| "low" |
| `title` | string | ✅ | Short description of issue |
| `description` | string | ✅ | Detailed explanation |
| `source_label` | string | ✅ | Label name as it appears in source (may be non-canonical) |
| `canonical_reference` | string | ✅ | What the canonical/correct reference should be |
| `affected_files` | object[] | ✅ | Files where inconsistency appears (with line numbers) |
| `impact_analysis` | string | ✅ | How this affects automation, workflows, or users |
| `recommendation` | string | ✅ | Suggested remediation action |
| `evidence` | object | ✅ | Supporting evidence (quotes from source files) |

**Example**:

```json
{
  "id": "F-001",
  "finding_type": "duplicate",
  "severity": "high",
  "title": "Type label naming inconsistency: documentation vs docs",
  "description": "The governance policy references 'type:documentation' as a protected label, but the canonical labels.yml defines it as 'type:docs'. This inconsistency could cause automation failures and governance violations.",
  "source_label": "type:documentation",
  "canonical_reference": "type:docs",
  "affected_files": [
    {
      "file": ".github/label-governance-policy.yml",
      "line": 15,
      "context": "- type:documentation"
    },
    {
      "file": ".github/labels.yml",
      "line": 183,
      "context": "- name: type:docs"
    },
    {
      "file": ".github/issue-types.yml",
      "line": 81,
      "context": "label: type:docs"
    }
  ],
  "impact_analysis": "If governance enforcement or label cleanup scripts check for 'type:documentation', they will find nothing and may treat it as missing. This breaks governance compliance for issues tagged with the canonical 'type:docs' label.",
  "recommendation": "Update .github/label-governance-policy.yml to reference 'type:docs' (canonical) instead of 'type:documentation'.",
  "evidence": {
    "governance_references_non_canonical": true,
    "canonical_file_has_correct_name": true,
    "issue_types_use_canonical_name": true
  }
}
```

---

### 5. Archived Workflow Analysis

**Definition**: Assessment of why a labeling workflow was archived and its restoration feasibility

**Purpose**: Understand automation gaps and plan future workflow improvements

**Attributes**:

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| `workflow_file` | string | ✅ | Path to archived workflow (e.g., ".github/workflows/archived/2026-09-11/labeling/issue-labeling-automation.yml") |
| `workflow_name` | string | ✅ | Friendly name extracted from workflow definition |
| `original_purpose` | string | ✅ | What this workflow was designed to automate |
| `labels_referenced` | string[] | ✅ | All label names used in this workflow |
| `triggers` | string[] | ✅ | GitHub events that would trigger workflow (e.g., "issues", "pull_request") |
| `actions_performed` | string[] | ✅ | Operations on labels (e.g., "add-label", "remove-label", "validate") |
| `archival_reason` | string | ✅ | Why it was archived (conflicts, performance, obsolete, superseded) |
| `root_cause` | string | ✅ | Technical reason for failure (e.g., "conflicts with unified-labeling-agent") |
| `restoration_feasibility` | enum | ✅ | "high" \| "medium" \| "low" (can it be fixed/restored?) |
| `gap_filled_by` | string or null | ✅ | If superseded, what covers its purpose now (e.g., "labeling.agent.js") |
| `recommendation` | enum | ✅ | "restore" \| "rebuild" \| "retire" \| "merge_into_unified_agent" |
| `effort_to_restore` | enum | ✅ | "minimal" \| "moderate" \| "significant" |

**Example**:

```json
{
  "workflow_file": ".github/workflows/archived/2026-09-11/labeling/issue-labeling-automation.yml",
  "workflow_name": "Issue Labeling Automation",
  "original_purpose": "Automatically apply labels to issues based on content, templates, and file changes",
  "labels_referenced": ["status:needs-triage", "type:bug", "type:feature", "area:ci"],
  "triggers": ["issues", "pull_request"],
  "actions_performed": ["add-label", "remove-label"],
  "archival_reason": "Conflicts with unified labeling agent",
  "root_cause": "Duplicate label application causing race conditions and inconsistent state",
  "restoration_feasibility": "high",
  "gap_filled_by": "labeling.agent.js + labeling.yml",
  "recommendation": "retire",
  "effort_to_restore": "minimal",
  "note": "Functionality fully superseded by unified labeling agent. Safe to keep archived."
}
```

---

## Entity Relationships

```
LabelFamily ─┬─ contains ─ Label
            └─ defines ─ IssueType (for type: family only)

Label ─┬─ has-many ─ ReconciliationFinding
       ├─ appears-in ─ CanonicalFile
       ├─ referenced-by ─ ArchivedWorkflow
       └─ governed-by ─ GovernancePolicy

ReconciliationFinding ─┬─ affects ─ SourceFile
                      └─ recommends ─ RemediationAction

ArchivedWorkflow ─┬─ references ─ Label[]
                 └─ replaces ─ UnifiedLabelingAgent (if superseded)
```

---

## Validation & Quality Assurance

### Label Validation Rules

Each label MUST pass these checks:

1. **Name Format**: Must match `{family}:{name}` pattern (e.g., `status:in-progress`)
2. **Family Membership**: Family must exist in families list
3. **Color Code**: Must be valid hex color (6 characters)
4. **Description**: Must be non-empty and descriptive
5. **Type Family Immutability**: All 25 type: labels must be present and unchanged
6. **Consistency**: If canonical, should not have duplication_status != "unique"

### Audit Completeness Checks

1. **Coverage**: All labels in canonical file accounted for
2. **Governance**: All governance policy labels either in canonical or documented as gap
3. **API Sync**: All GitHub API labels either in canonical or flagged as orphan
4. **Workflow Analysis**: All 11 archived workflows analyzed with findings

---

## Success Criteria for Data Model

✅ All entities defined with clear attributes and validation rules  
✅ Relationships between entities documented  
✅ Example JSON provided for each entity type  
✅ Validation rules testable and automatable  
✅ Audit completeness criteria defined  
✅ Ready for task decomposition and implementation

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)
