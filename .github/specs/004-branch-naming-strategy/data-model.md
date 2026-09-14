# Data Model: Branch Naming System

**Phase**: Phase 1 | **Created**: 2026-09-12

## Core Entities

### BranchName
```json
{
  "full_name": "feat/payment-processing-timeout",
  "type": "feat",
  "scope": "payment-processing",
  "title": "timeout",
  "valid": true,
  "compliance_status": "compliant"
}
```

**Validation Rules**:
- Type must be from authorized list (24 types)
- Scope must be kebab-case (no underscores, spaces)
- Title ≥3 characters
- No forbidden prefixes: `claude/`, `copilot/`, `openai/`

### BranchType
```json
{
  "type": "feat",
  "category": "feature",
  "description": "New feature development",
  "template": "pr_feature.md",
  "labels": ["type:feature", "area:core"],
  "severity": "normal"
}
```

### PRTemplate
Routes based on branch type:
- `feat/` → `pr_feature.md`
- `fix/` → `pr_bugfix.md`
- `security/` → `pr_security.md`
- etc.

### ComplianceMetrics
```json
{
  "date": "2026-09-12",
  "total_branches": 145,
  "compliant": 138,
  "compliance_percent": 95.2,
  "violations_by_type": {
    "invalid_format": 4,
    "forbidden_prefix": 2,
    "invalid_type": 1
  }
}
```

---

## Phase 1 Complete

Data model defined. Ready for contract definitions and quickstart.
