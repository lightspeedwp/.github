# Contract: AuditRule

**Purpose**: Define the interface contract for audit rules that validate governance files.

**Version**: 1.0.0 | **Date**: 2026-09-14

## Overview

An `AuditRule` encapsulates a single validation check that can be applied to governance files. Rules are declarative, reusable, and map to constitutional principles.

## JSON Schema

```json
{
  "type": "object",
  "required": ["id", "name", "applicableTo", "severity", "check", "constitutionalBasis", "enabled"],
  "properties": {
    "id": {
      "type": "string",
      "pattern": "^[a-z-]+$",
      "description": "Unique identifier (kebab-case). Example: 'label-prefix-check'"
    },
    "name": {
      "type": "string",
      "description": "Human-readable rule name. Example: 'Label Prefix Validation'"
    },
    "description": {
      "type": "string",
      "description": "What this rule validates and why (2-3 sentences)"
    },
    "applicableTo": {
      "type": "array",
      "items": {
        "enum": ["labels", "issue-types", "templates", "workflows"]
      },
      "description": "File types this rule applies to"
    },
    "severity": {
      "enum": ["critical", "high", "medium", "low"],
      "description": "Impact level if violated. 'critical' = blocks merge, 'high' = breaks automation"
    },
    "check": {
      "type": "object",
      "required": ["type"],
      "properties": {
        "type": {
          "enum": [
            "prefix-required",
            "naming-convention",
            "reference-exists",
            "duplicate-detection",
            "routing-validation",
            "format-validation",
            "content-check"
          ],
          "description": "Category of check to perform"
        },
        "pattern": {
          "type": ["string", "array"],
          "description": "Regex pattern or list of allowed values to match against"
        },
        "requirements": {
          "type": "array",
          "items": { "type": "string" },
          "description": "Specific requirements to validate (human-readable)"
        },
        "excludePatterns": {
          "type": "array",
          "items": { "type": "string" },
          "description": "Patterns to explicitly exclude from validation"
        }
      }
    },
    "constitutionalBasis": {
      "type": "string",
      "description": "Constitution section/principle this enforces. Example: 'Section VIII: Branch Strategy Compliance'"
    },
    "enabled": {
      "type": "boolean",
      "description": "Whether this rule is active in audits"
    }
  }
}
```

## Example Rules

### Rule 1: Label Prefix Check

```json
{
  "id": "label-prefix-check",
  "name": "Label Prefix Validation",
  "description": "All labels must include a required prefix to group them into governance families (type:, status:, priority:, area:, meta:). Unprefixed labels cause labeling system inconsistency.",
  "applicableTo": ["labels"],
  "severity": "critical",
  "check": {
    "type": "prefix-required",
    "pattern": "^(type:|status:|priority:|area:|meta:)",
    "requirements": [
      "Every label must start with one of: type:, status:, priority:, area:, meta:"
    ]
  },
  "constitutionalBasis": "Section VIII: Branch Strategy Compliance & Automated Enforcement",
  "enabled": true
}
```

### Rule 2: Duplicate Detection

```json
{
  "id": "label-duplicate-detection",
  "name": "Duplicate Label Detection",
  "description": "Detects labels with identical or near-identical names (e.g., 'bug' and 'type:bug') that represent the same concept. Duplicates cause confusion and inconsistent automation.",
  "applicableTo": ["labels"],
  "severity": "high",
  "check": {
    "type": "duplicate-detection",
    "requirements": [
      "No two labels should have identical meaning (semantic duplicates)",
      "No bare labels (missing required prefix) should exist alongside prefixed equivalent"
    ]
  },
  "constitutionalBasis": "Section II: Curated Assets with Locked Governance",
  "enabled": true
}
```

### Rule 3: Template Routing Validation

```json
{
  "id": "template-routing-validation",
  "name": "PR Template Routing Consistency",
  "description": "Each branch prefix (feat/, fix/, docs/, etc.) must map to exactly one PR template. Misconfigured routing causes wrong templates to be assigned to PRs.",
  "applicableTo": ["templates"],
  "severity": "critical",
  "check": {
    "type": "routing-validation",
    "requirements": [
      "Each branch type must have exactly one corresponding PR template",
      "No branch type should have multiple valid templates",
      "All 34+ branch types must be covered by routing rules"
    ]
  },
  "constitutionalBasis": "Section V: Branch Naming Strategy is Non-Negotiable",
  "enabled": true
}
```

## Usage Guidelines

**When to Create a Rule**:
- A compliance requirement exists in the constitution
- The requirement can be checked programmatically
- The check applies consistently across governance files
- The violation has measurable impact on downstream systems

**Rule Ordering**:
1. Apply format validation rules first (syntax, structure)
2. Then apply semantic rules (naming, prefixes, duplicates)
3. Finally apply relationship rules (references, routing)

**Severity Guidelines**:
- **critical**: Violating this breaks automation, routes PRs to wrong templates, or violates security constraints
- **high**: Violating this causes inconsistency across repos or misaligns with governance
- **medium**: Violating this is a quality/maintainability issue
- **low**: Violating this is a style or documentation improvement

## Validation Checklist

Before using a rule in audit:

- [ ] ID is unique, kebab-cased, descriptive
- [ ] Name is action-verb phrase ("X Validation", "Y Checking")
- [ ] Description explains WHAT and WHY (2-3 sentences)
- [ ] `applicableTo` list matches rule's intent
- [ ] `severity` matches downstream impact
- [ ] `check.type` matches the validation category
- [ ] `constitutionalBasis` references correct section
- [ ] Rule can be implemented as a function/regex
- [ ] Rule has been tested against sample violations
- [ ] `enabled` is false until rule is production-ready

---

**Schema Version**: 1.0.0 | **Last Updated**: 2026-09-14
