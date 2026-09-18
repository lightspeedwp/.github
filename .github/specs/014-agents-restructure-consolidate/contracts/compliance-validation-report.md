# Compliance Validation Report: agentskills.io Specification

**Version**: 1.0 | **Date**: 2026-09-18 | **Contract Type**: Machine-Readable Output Format

## Overview

Report documenting compliance of agent skills against agentskills.io specification. Output is JSON format for machine parsing and human review.

## Top-Level Structure

```json
{
  "timestamp": "ISO 8601 datetime when validation ran",
  "validation_scope": "Description of what was validated (e.g., 'all skills in agents/ and skills/' folders)",
  "repository_state": "Git commit hash when validation ran",
  "specification_version": "agentskills.io specification version used for validation",
  "summary": {
    "total_skills_validated": "number",
    "compliant_count": "number",
    "violations_count": "number",
    "blocking_violations": "number",
    "compliance_percentage": "number (0-100)"
  },
  "violation_summary": {
    "missing_required_fields": "count",
    "invalid_field_values": "count",
    "formatting_issues": "count"
  },
  "skills": [
    { ... },
    { ... }
  ]
}
```

## Skill Entry Schema

Each skill validation entry has:

```json
{
  "skill_id": "Unique skill identifier",
  "location": "Location: 'root' or agent-id if agent-specific",
  "name": "Human-readable skill name",
  "file_path": "Path to skill definition file",
  "compliance": "One of: passed, failed",
  "violations": [
    {
      "field": "Name of field with violation",
      "issue": "Description of the issue",
      "required": "Boolean: is this field required?",
      "severity": "One of: blocking, warning, info"
    }
  ],
  "blocking": "Boolean: prevents restructuring completion if true",
  "blocking_violations": [
    "List of blocking violation descriptions"
  ],
  "remediation_steps": [
    "Step 1: action required",
    "Step 2: action required"
  ],
  "auto_fixable": "Boolean: can violations be fixed automatically",
  "remediation_effort": "One of: trivial, low, medium, high",
  "last_validated": "ISO 8601 datetime of last validation"
}
```

## Violation Severity Levels

**Blocking** (prevents restructuring completion)

- Required field is missing
- Field has invalid value that breaks functionality
- Example: `description` field missing (required by agentskills.io)

**Warning** (should be fixed, but non-critical)

- Recommended field is missing
- Field value is non-standard but technically valid
- Example: `author` field missing (recommended by agentskills.io)

**Info** (nice-to-have improvements)

- Minor formatting or documentation issues
- Non-critical improvements to compliance
- Example: Description could be more detailed

## Examples

### Example 1: Passed Compliance

```json
{
  "skill_id": "prd-template-loader",
  "location": "prd-agent",
  "name": "PRD Template Loader",
  "file_path": "agents/prd-agent/skills/prd-template-loader.md",
  "compliance": "passed",
  "violations": [],
  "blocking": false,
  "blocking_violations": [],
  "remediation_steps": [],
  "auto_fixable": false,
  "remediation_effort": "trivial",
  "last_validated": "2026-09-18T12:00:00Z"
}
```

### Example 2: Failed Compliance - Missing Required Field

```json
{
  "skill_id": "analyze-data",
  "location": "data-agent",
  "name": "Data Analysis Skill",
  "file_path": "agents/data-agent/skills/analyze-data.md",
  "compliance": "failed",
  "violations": [
    {
      "field": "description",
      "issue": "Required field 'description' is missing",
      "required": true,
      "severity": "blocking"
    },
    {
      "field": "examples",
      "issue": "Recommended field 'examples' is missing",
      "required": false,
      "severity": "warning"
    }
  ],
  "blocking": true,
  "blocking_violations": [
    "Required field 'description' is missing"
  ],
  "remediation_steps": [
    "Step 1: Open agents/data-agent/skills/analyze-data.md",
    "Step 2: Add 'description:' field with 2-3 sentence summary of skill purpose",
    "Step 3: (Optional) Add 'examples:' section with usage examples",
    "Step 4: Re-run compliance validation to confirm fix"
  ],
  "auto_fixable": false,
  "remediation_effort": "trivial",
  "last_validated": "2026-09-18T12:00:00Z"
}
```

### Example 3: Failed Compliance - Invalid Field Value

```json
{
  "skill_id": "process-text",
  "location": "root",
  "name": "Text Processing Utility",
  "file_path": "skills/process-text.md",
  "compliance": "failed",
  "violations": [
    {
      "field": "type",
      "issue": "Invalid value 'unknown'; must be one of: [action, query, transform, utility, integration]",
      "required": true,
      "severity": "blocking"
    }
  ],
  "blocking": true,
  "blocking_violations": [
    "Field 'type' has invalid value; must be one of: [action, query, transform, utility, integration]"
  ],
  "remediation_steps": [
    "Step 1: Determine correct skill type from skill implementation",
    "Step 2: Update 'type:' field in skills/process-text.md to correct value",
    "Step 3: Re-run compliance validation to confirm fix"
  ],
  "auto_fixable": false,
  "remediation_effort": "low",
  "last_validated": "2026-09-18T12:00:00Z"
}
```

## Compliance Categories

### Required Fields (agentskills.io specification)

- `title` — Skill name/title
- `description` — Purpose and capability (2+ sentences)
- `type` — Skill type (one of: action, query, transform, utility, integration)

### Recommended Fields

- `author` — Skill author/maintainer
- `version` — Semantic version number
- `examples` — Usage examples (1+)

### Conditional Fields

- `inputs` (if skill accepts parameters) — Parameter definitions
- `outputs` (if skill returns values) — Return value definitions

## Remediation Workflow

For each failing skill:

1. **Blocking violations must be fixed**
   - Apply fixes listed in remediation_steps
   - Re-run compliance validation
   - Blocking violations prevent agent from completing restructuring

2. **Warning violations should be fixed**
   - Apply fixes when convenient
   - Contribute to overall compliance percentage
   - Can be batched with other improvements

3. **Info violations are optional**
   - Nice-to-have improvements
   - Low priority unless compliance percentage is critical goal

## Validation Report Validation

Reports are valid if:

- All required fields present in skill entries
- Violation severity matches allowed values (blocking, warning, info)
- Compliance values match (passed, failed)
- timestamp is ISO 8601 format
- No duplicate skill IDs
- Remediation effort values match allowed values

---

**Contract Complete**: Report format ready for implementation
