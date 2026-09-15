# Label Inventory Output Schema

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

**Version**: 1.0 | **Formats**: CSV (human-readable) + JSON (machine-readable)

---

## CSV Format (label-inventory.csv)

### Columns

```
family,label_name,color,description,in_canonical,in_issue_types,in_policy,in_docs,in_workflows,api_present,status,notes
```

### Column Definitions

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `family` | string | ✅ | Label family (status, priority, type, area, etc.) |
| `label_name` | string | ✅ | Full label name (e.g., "status:in-progress") |
| `color` | string | ✅ | Hex color code (e.g., "1D76DB") |
| `description` | string | ✅ | Label purpose and usage |
| `in_canonical` | boolean | ✅ | Present in .github/labels.yml (Y/N) |
| `in_issue_types` | boolean | ✅ | Mapped in .github/issue-types.yml (Y/N, type: family only) |
| `in_policy` | boolean | ✅ | In governance never-delete list (Y/N) |
| `in_docs` | boolean | ✅ | Documented in LABEL_*.md or ISSUE_*.md (Y/N) |
| `in_workflows` | boolean | ✅ | Referenced in archived or active workflows (Y/N) |
| `api_present` | boolean | ✅ | Currently exists on GitHub repository (Y/N) |
| `status` | enum | ✅ | "OK" \| "ORPHAN" \| "DUPLICATE" \| "MISMATCH" \| "DEPRECATED" \| "GAP" |
| `notes` | string | ✅ | Additional context (e.g., "Duplicate of status:blocked") |

### Example Rows

```csv
family,label_name,color,description,in_canonical,in_issue_types,in_policy,in_docs,in_workflows,api_present,status,notes
status,status:needs-planning,BFD4F2,Awaiting planning / scoping,Y,N,N,Y,Y,Y,OK,
status,status:in-progress,1D76DB,Work in progress,Y,N,N,Y,Y,Y,OK,
priority,priority:critical,B60205,Production/launch-blocking,Y,N,N,Y,Y,Y,OK,
type,type:task,4393F8,Task or to-do,Y,Y,N,Y,Y,Y,OK,Immutable - issue type mapping
type,type:docs,9198A1,Documentation,Y,Y,N,Y,Y,Y,OK,Immutable - issue type mapping
type,type:documentation,9198A1,Documentation,N,N,Y,Y,N,N,DUPLICATE,Duplicate of type:docs - in policy only
area,area:ci,BFD4F2,Build and CI pipelines,Y,N,N,Y,Y,Y,OK,
area,area:unknown-new,FF0000,Unknown label,Y,N,N,N,N,Y,ORPHAN,Found in GitHub API but not in canonical file
meta,meta:missing-label,E1E4E8,Missing label,N,N,N,N,N,N,GAP,In governance policy but not canonical file
```

---

## JSON Format (label-inventory.json)

### Schema

```json
{
  "audit_date": "2026-09-14",
  "repository": "lightspeedwp/.github",
  "total_labels": 147,
  "families": {
    "status": {
      "count": 20,
      "immutable": false,
      "labels": [
        {
          "name": "status:needs-planning",
          "color": "BFD4F2",
          "description": "Awaiting planning / scoping",
          "in_canonical": true,
          "in_issue_types": false,
          "in_governance_policy": false,
          "in_documentation": true,
          "referenced_in_workflows": true,
          "currently_in_api": true,
          "status": "OK",
          "notes": null
        },
        {
          "name": "status:in-progress",
          "color": "1D76DB",
          "description": "Work in progress",
          "in_canonical": true,
          "in_issue_types": false,
          "in_governance_policy": false,
          "in_documentation": true,
          "referenced_in_workflows": true,
          "currently_in_api": true,
          "status": "OK",
          "notes": null
        }
      ]
    },
    "type": {
      "count": 25,
      "immutable": true,
      "labels": [
        {
          "name": "type:task",
          "color": "4393F8",
          "description": "Task or to-do",
          "in_canonical": true,
          "in_issue_types": true,
          "in_governance_policy": false,
          "in_documentation": true,
          "referenced_in_workflows": true,
          "currently_in_api": true,
          "status": "OK",
          "notes": "Immutable - issue type mapping"
        },
        {
          "name": "type:docs",
          "color": "9198A1",
          "description": "Documentation",
          "in_canonical": true,
          "in_issue_types": true,
          "in_governance_policy": false,
          "in_documentation": true,
          "referenced_in_workflows": true,
          "currently_in_api": true,
          "status": "OK",
          "notes": "Immutable - issue type mapping"
        }
      ]
    }
  },
  "summary": {
    "total_canonical": 147,
    "total_in_api": 147,
    "total_orphans": 0,
    "total_duplicates": 2,
    "total_ok": 145,
    "total_gaps": 1,
    "families_with_issues": ["type"]
  }
}
```

---

## CSV Column Usage Guidelines

### for Parsing/Analysis

```
# Extract all labels with issues
grep -v "^status," label-inventory.csv | grep -vE ",OK," | sort -t, -k11

# Count by status
cut -d, -f11 label-inventory.csv | sort | uniq -c

# Identify orphans
grep ",ORPHAN," label-inventory.csv
```

### for Reporting

```
# Summary by family
cut -d, -f1 label-inventory.csv | tail -n +2 | sort | uniq -c | sort -rn

# Status distribution
cut -d, -f11 label-inventory.csv | tail -n +2 | sort | uniq -c
```

---

## JSON Schema Validation

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Label Inventory",
  "type": "object",
  "required": ["audit_date", "repository", "total_labels", "families", "summary"],
  "properties": {
    "audit_date": { "type": "string", "format": "date" },
    "repository": { "type": "string" },
    "total_labels": { "type": "integer", "minimum": 1 },
    "families": {
      "type": "object",
      "additionalProperties": {
        "type": "object",
        "required": ["count", "immutable", "labels"],
        "properties": {
          "count": { "type": "integer", "minimum": 1 },
          "immutable": { "type": "boolean" },
          "labels": {
            "type": "array",
            "items": {
              "type": "object",
              "required": ["name", "color", "description", "status"],
              "properties": {
                "name": { "type": "string" },
                "color": { "type": "string", "pattern": "^[0-9A-Fa-f]{6}$" },
                "description": { "type": "string" },
                "in_canonical": { "type": "boolean" },
                "in_issue_types": { "type": "boolean" },
                "in_governance_policy": { "type": "boolean" },
                "in_documentation": { "type": "boolean" },
                "referenced_in_workflows": { "type": "boolean" },
                "currently_in_api": { "type": "boolean" },
                "status": { "enum": ["OK", "ORPHAN", "DUPLICATE", "MISMATCH", "DEPRECATED", "GAP"] },
                "notes": { "type": ["string", "null"] }
              }
            }
          }
        }
      }
    },
    "summary": {
      "type": "object",
      "required": ["total_canonical", "total_in_api", "total_orphans", "total_duplicates"],
      "properties": {
        "total_canonical": { "type": "integer" },
        "total_in_api": { "type": "integer" },
        "total_orphans": { "type": "integer" },
        "total_duplicates": { "type": "integer" },
        "total_ok": { "type": "integer" },
        "total_gaps": { "type": "integer" },
        "families_with_issues": { "type": "array", "items": { "type": "string" } }
      }
    }
  }
}
```

---

## Delivery Contract

**Deliverable**:

- `label-inventory.csv` (human-readable, importable into spreadsheets)
- `label-inventory.json` (machine-readable, for programmatic processing)

**Location**: `.github/reports/audits/2026-09-14-label-audit/`

**Completeness**:

- ✅ Every label in canonical file has one row
- ✅ All 147 labels accounted for
- ✅ Status field provides audit conclusion for each label

**Formats**: Both CSV and JSON must be consistent with each other.

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)
