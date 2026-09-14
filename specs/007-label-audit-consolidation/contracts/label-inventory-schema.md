# Label Inventory Output Schema

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
