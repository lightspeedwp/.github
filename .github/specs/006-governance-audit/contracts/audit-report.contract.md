# Contract: AuditReport

**Purpose**: Define the structure and format of governance audit reports.

**Version**: 1.0.0 | **Date**: 2026-09-14

## Overview

An `AuditReport` is the primary output of the governance audit system. It documents which files were scanned, which rules were applied, which violations were found, and what the compliance trend is.

## JSON Schema

```json
{
  "type": "object",
  "required": [
    "id", "timestamp", "filesScanned", "rulesApplied", "summary", 
    "violations", "generatedBy"
  ],
  "properties": {
    "id": {
      "type": "string",
      "pattern": "^audit-\\d{8}-\\d{6}$",
      "description": "Report identifier. Example: 'audit-20260914-143022' (YYYYMMDD-HHMMSS)"
    },
    "timestamp": {
      "type": "string",
      "format": "date-time",
      "description": "ISO 8601 datetime when audit was run"
    },
    "filesScanned": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id", "path", "type"],
        "properties": {
          "id": { "type": "string" },
          "path": { "type": "string" },
          "type": { "enum": ["labels", "issue-types", "templates", "workflows"] },
          "status": { "enum": ["scanned", "error", "skipped"] }
        }
      },
      "description": "List of governance files that were scanned"
    },
    "rulesApplied": {
      "type": "array",
      "items": { "type": "string" },
      "description": "List of audit rule IDs that were executed"
    },
    "summary": {
      "type": "object",
      "required": [
        "totalFiles", "totalRules", "totalViolations", 
        "criticalViolations", "compliancePercentage"
      ],
      "properties": {
        "totalFiles": {
          "type": "integer",
          "description": "Count of governance files scanned"
        },
        "totalRules": {
          "type": "integer",
          "description": "Count of validation rules applied"
        },
        "totalViolations": {
          "type": "integer",
          "description": "Total violations found across all files"
        },
        "violationsBySeverity": {
          "type": "object",
          "properties": {
            "critical": { "type": "integer" },
            "high": { "type": "integer" },
            "medium": { "type": "integer" },
            "low": { "type": "integer" }
          },
          "description": "Violations broken down by severity level"
        },
        "compliancePercentage": {
          "type": "number",
          "minimum": 0,
          "maximum": 100,
          "description": "Overall compliance score (0-100)"
        },
        "status": {
          "enum": ["compliant", "warnings", "violations"],
          "description": "Overall audit status"
        }
      }
    },
    "violations": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "id", "ruleId", "severity", "message", "location"
        ],
        "properties": {
          "id": {
            "type": "string",
            "pattern": "^violation-\\d{8}-\\d{3}$",
            "description": "Unique violation ID"
          },
          "ruleId": {
            "type": "string",
            "description": "ID of the rule that was violated"
          },
          "fileId": {
            "type": "string",
            "description": "ID of the file containing the violation"
          },
          "severity": {
            "enum": ["critical", "high", "medium", "low"]
          },
          "message": {
            "type": "string",
            "description": "Human-readable violation description"
          },
          "location": {
            "type": "object",
            "properties": {
              "line": { "type": "integer" },
              "column": { "type": "integer" },
              "path": { "type": "string" }
            },
            "description": "Where in the file the violation occurs"
          },
          "currentValue": {
            "type": "string",
            "description": "The actual value that violated the rule"
          },
          "expectedValue": {
            "type": "string",
            "description": "What the value should be"
          },
          "remediation": {
            "type": "string",
            "description": "Suggested fix for this violation"
          },
          "affectedSystems": {
            "type": "array",
            "items": { "type": "string" },
            "description": "Repos/workflows/agents impacted by this violation"
          }
        }
      },
      "description": "Complete list of all violations found"
    },
    "trends": {
      "type": "object",
      "properties": {
        "previousReportId": {
          "type": "string",
          "description": "ID of the prior audit for trend comparison"
        },
        "violationsTrend": {
          "enum": ["improving", "stable", "declining"],
          "description": "Compliance trend since last audit"
        },
        "violationsFixed": {
          "type": "integer",
          "description": "Count of violations fixed since last audit"
        },
        "newViolations": {
          "type": "integer",
          "description": "Count of new violations introduced since last audit"
        },
        "daysImproving": {
          "type": "integer",
          "description": "Days on improving trend (for streak tracking)"
        }
      },
      "description": "Compliance trend and historical comparison"
    },
    "recommendations": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "priority": { "enum": ["critical", "high", "medium", "low"] },
          "title": { "type": "string" },
          "description": { "type": "string" },
          "affectedViolations": {
            "type": "array",
            "items": { "type": "string" },
            "description": "Violation IDs this recommendation addresses"
          },
          "estimatedEffort": {
            "enum": ["trivial", "simple", "moderate", "complex"]
          }
        }
      },
      "description": "Prioritized remediation recommendations"
    },
    "generatedBy": {
      "type": "string",
      "description": "Identifier of audit process/version. Example: 'governance-audit-v1.0.0'"
    },
    "archiveLocation": {
      "type": "string",
      "description": "Where this report is stored. Example: '.github/reports/governance-audit-20260914-143022.json'"
    }
  }
}
```

## Example Report (Minimal)

```json
{
  "id": "audit-20260914-143022",
  "timestamp": "2026-09-14T14:30:22Z",
  "filesScanned": [
    {
      "id": "labels-yml",
      "path": ".github/labels.yml",
      "type": "labels",
      "status": "scanned"
    }
  ],
  "rulesApplied": [
    "label-prefix-check",
    "label-duplicate-detection"
  ],
  "summary": {
    "totalFiles": 1,
    "totalRules": 2,
    "totalViolations": 3,
    "violationsBySeverity": {
      "critical": 1,
      "high": 2,
      "medium": 0,
      "low": 0
    },
    "compliancePercentage": 98.5,
    "status": "violations"
  },
  "violations": [
    {
      "id": "violation-20260914-001",
      "ruleId": "label-prefix-check",
      "fileId": "labels-yml",
      "severity": "critical",
      "message": "Label 'bug' is missing required prefix 'type:'",
      "location": { "line": 42, "column": 3, "path": "labels" },
      "currentValue": "bug",
      "expectedValue": "type:bug",
      "remediation": "Rename label to 'type:bug' to match canonical taxonomy",
      "affectedSystems": ["CodeRabbit config", "PR labeling", "Issue metrics"]
    }
  ],
  "trends": {
    "previousReportId": "audit-20260913-143022",
    "violationsTrend": "stable",
    "violationsFixed": 0,
    "newViolations": 0,
    "daysImproving": 0
  },
  "recommendations": [
    {
      "priority": "critical",
      "title": "Fix missing label prefixes",
      "description": "3 labels are missing required prefixes. Fix these to restore full compliance.",
      "affectedViolations": ["violation-20260914-001"],
      "estimatedEffort": "simple"
    }
  ],
  "generatedBy": "governance-audit-v1.0.0",
  "archiveLocation": ".github/reports/governance-audit-20260914-143022.json"
}
```

## Output Formats

Reports are generated in two complementary formats:

### JSON Format
- **File**: `.github/reports/governance-audit-[DATE].json`
- **Use**: Machine-readable; consumed by dashboards, CI/CD workflows, metrics collection
- **Retention**: Keep last 90 days; summarize older data

### Markdown Format
- **File**: `.github/reports/governance-audit-[DATE].md`
- **Use**: Human-readable summary for team review; includes violation details, recommendations, and trend analysis
- **Retention**: Keep last 30 days in full detail

## Validation Checklist

Before publishing a report:

- [ ] `id` matches format audit-YYYYMMDD-HHMMSS
- [ ] `timestamp` is valid ISO 8601
- [ ] `filesScanned` includes all expected files
- [ ] `rulesApplied` lists all rules that were executed
- [ ] All violation IDs in `violations` are unique
- [ ] `compliancePercentage` calculation is correct (rules passed / total rules)
- [ ] `status` matches computed state (compliant if 0 violations, etc.)
- [ ] Trend calculations are accurate vs. prior report
- [ ] All `affectedSystems` are accurate and discoverable
- [ ] Report is stored at documented `archiveLocation`

---

**Schema Version**: 1.0.0 | **Last Updated**: 2026-09-14
