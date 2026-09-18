# Compliance Validation Report Specification

**Version**: 1.0 | **Last Updated**: 2026-09-18

## Purpose

Defines the format for compliance validation reports that assess agent skills against agentskills.io specification.

## JSON Schema

```json
{
  "validation_type": "agentskills.io",
  "timestamp": "2026-09-18T10:30:00Z",
  "spec_version": "1.0.0",
  "summary": {
    "total_skills": 150,
    "compliant": 140,
    "violations": 10,
    "compliance_percentage": 93.3
  },
  "violations": [
    {
      "skill_id": "broken-refs-finder",
      "skill_location": "skills/validation/broken-refs-finder",
      "violations": [
        {
          "field": "description",
          "severity": "blocking",
          "message": "Description field is required",
          "remediation": "Add 'description' field to skill definition"
        }
      ]
    }
  ]
}
```

## Field Definitions

| Field | Type | Description |
|-------|------|-------------|
| `validation_type` | enum | Type of validation (currently: agentskills.io) |
| `timestamp` | ISO 8601 | When validation was run |
| `spec_version` | string | agentskills.io specification version used |
| `summary.total_skills` | number | Total skills validated |
| `summary.compliant` | number | Skills with no violations |
| `summary.violations` | number | Skills with violations |
| `summary.compliance_percentage` | number | Percentage compliant (0-100) |
| `violations[].skill_id` | string | Skill identifier |
| `violations[].skill_location` | string | File path to skill definition |
| `violations[][].field` | string | Field name with violation |
| `violations[][].severity` | enum | blocking or warning |
| `violations[][].message` | string | Description of violation |
| `violations[][].remediation` | string | How to fix the violation |

## Severity Levels

- **blocking**: Must be fixed before the skill can be used; prevents deployment
- **warning**: Should be fixed for full compliance but doesn't block usage; recommend fixing

---

Output: `.github/specs/014-agents-restructure-consolidate/reports/compliance-validation-report.json`
