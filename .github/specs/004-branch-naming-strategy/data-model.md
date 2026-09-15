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

**Validation Rules** (per Constitution Section VIII):

- Type must be from the 38 authorised types (feat, fix, hotfix, release, refactor, chore, task, doc, docs, test, perf, ci, build, deps, security, revert, research, design, a11y, ux, i18n, ops, proto, ds, api, schema, telemetry, content, seo, config, migrate, qa, uat, audit, codex, aiops, automation, epic)
- Scope must be kebab-case (no underscores, spaces), 2-50 characters
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

Routes based on branch type (canonical mappings from 17 templates):

- `feat/`, `task/`, `epic/` → `pr_feature.md`
- `fix/`, `hotfix/`, `revert/` → `pr_bug.md`
- `security/` → `pr_security.md`
- `doc/`, `docs/`, `content/`, `seo/` → `pr_docs.md`
- `design/`, `ds/`, `a11y/`, `ux/` → `pr_design.md`
- Full mappings in contracts/branch-naming.contract.md

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
