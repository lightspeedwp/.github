# Contract: RemediationPlan

**Purpose**: Define the structure and format of remediation plans that guide governance file fixes.

**Version**: 1.0.0 | **Date**: 2026-09-14

## Overview

A `RemediationPlan` is generated from audit violations and provides step-by-step instructions for fixing governance compliance issues. Plans include effort estimates, risk assessments, rollback procedures, and approval gates.

## JSON Schema

```json
{
  "type": "object",
  "required": [
    "id", "timestamp", "sourceReport", "steps", "estimatedTotalEffort",
    "estimatedRisk"
  ],
  "properties": {
    "id": {
      "type": "string",
      "pattern": "^remediation-\\d{8}-\\d{3}$",
      "description": "Plan identifier. Example: 'remediation-20260914-001'"
    },
    "timestamp": {
      "type": "string",
      "format": "date-time",
      "description": "ISO 8601 datetime when plan was generated"
    },
    "sourceReport": {
      "type": "string",
      "description": "ID of the audit report this plan addresses"
    },
    "title": {
      "type": "string",
      "description": "Descriptive title for this remediation plan"
    },
    "summary": {
      "type": "string",
      "description": "Executive summary of violations and fixes (2-3 sentences)"
    },
    "violations": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["violationId", "severity", "description"],
        "properties": {
          "violationId": { "type": "string" },
          "severity": { "enum": ["critical", "high", "medium", "low"] },
          "description": { "type": "string" },
          "rule": { "type": "string" }
        }
      },
      "description": "List of violations covered by this plan (sorted by priority)"
    },
    "steps": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "stepNumber", "title", "affectedFile", "changeType", "effort", "risk"
        ],
        "properties": {
          "stepNumber": {
            "type": "integer",
            "description": "Execution order (1, 2, 3, ...)"
          },
          "title": {
            "type": "string",
            "description": "Short title for this step"
          },
          "description": {
            "type": "string",
            "description": "Detailed explanation of what to do"
          },
          "affectedFile": {
            "type": "string",
            "description": "Path to governance file to modify. Example: '.github/labels.yml'"
          },
          "currentState": {
            "type": "string",
            "description": "Current (violating) content (code snippet or quoted text)"
          },
          "targetState": {
            "type": "string",
            "description": "Desired (compliant) content"
          },
          "changeType": {
            "enum": ["add", "remove", "modify", "rename"],
            "description": "Type of change to make"
          },
          "effort": {
            "enum": ["trivial", "simple", "moderate", "complex"],
            "description": "Time/complexity estimate. trivial=<1min, simple=1-5min, moderate=5-30min, complex=>30min"
          },
          "risk": {
            "enum": ["low", "medium", "high"],
            "description": "Risk level if this change introduces issues"
          },
          "affectedRepositories": {
            "type": "array",
            "items": { "type": "string" },
            "description": "Which repos depend on this governance file"
          },
          "verificationSteps": {
            "type": "array",
            "items": { "type": "string" },
            "description": "How to confirm change succeeded"
          },
          "rollbackProcedure": {
            "type": "string",
            "description": "Instructions to undo this change if it breaks anything"
          },
          "dependencies": {
            "type": "array",
            "items": { "type": "integer" },
            "description": "Step numbers that must complete before this one"
          }
        }
      },
      "description": "Remediation steps in execution order"
    },
    "estimatedTotalEffort": {
      "type": "string",
      "description": "Overall effort estimate. Example: '15 minutes', '1-2 hours'"
    },
    "estimatedRisk": {
      "enum": ["low", "medium", "high"],
      "description": "Overall risk assessment for the entire plan"
    },
    "prerequisitesAndDependencies": {
      "type": "string",
      "description": "Any setup, ordering, or blocking requirements"
    },
    "approvalGates": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "stepNumber": { "type": "integer" },
          "requiredApprovals": {
            "type": "array",
            "items": { "type": "string" },
            "description": "Roles or users who must approve (e.g., ['GitHub admin', '@ashley'])"
          },
          "reason": { "type": "string" }
        }
      },
      "description": "Approval gates for each step"
    },
    "postRemediationValidation": {
      "type": "string",
      "description": "How to verify full compliance after all steps complete"
    },
    "generatedBy": {
      "type": "string",
      "description": "Identifier of generation process/version"
    },
    "archiveLocation": {
      "type": "string",
      "description": "Where this plan is stored"
    }
  }
}
```

## Example Plan (Minimal)

```json
{
  "id": "remediation-20260914-001",
  "timestamp": "2026-09-14T14:35:00Z",
  "sourceReport": "audit-20260914-143022",
  "title": "Fix Label Prefix Violations",
  "summary": "Three labels are missing required prefixes. Adding prefixes restores governance compliance and fixes PR labeling automation.",
  "violations": [
    {
      "violationId": "violation-20260914-001",
      "severity": "critical",
      "description": "Label 'bug' missing prefix 'type:'",
      "rule": "label-prefix-check"
    }
  ],
  "steps": [
    {
      "stepNumber": 1,
      "title": "Add 'type:' prefix to 'bug' label",
      "description": "In .github/labels.yml, find the 'bug' label entry and rename to 'type:bug'.",
      "affectedFile": ".github/labels.yml",
      "currentState": "- name: bug\n  description: Something isn't working",
      "targetState": "- name: type:bug\n  description: Something isn't working",
      "changeType": "rename",
      "effort": "trivial",
      "risk": "low",
      "affectedRepositories": [".", "50+ consuming repos"],
      "verificationSteps": [
        "Run `npm run validate:labels` to confirm syntax",
        "Push to branch and verify CI validation passes",
        "Check that CodeRabbit uses new label in PR reviews"
      ],
      "rollbackProcedure": "Revert the commit or revert labels.yml to prior version",
      "dependencies": []
    }
  ],
  "estimatedTotalEffort": "5 minutes",
  "estimatedRisk": "low",
  "prerequisitesAndDependencies": "No prerequisites. Changes can be applied independently.",
  "approvalGates": [
    {
      "stepNumber": 1,
      "requiredApprovals": ["GitHub admin"],
      "reason": "Locked governance file requires approval"
    }
  ],
  "postRemediationValidation": "Run full governance audit (`npm run audit:governance`) to confirm zero violations",
  "generatedBy": "governance-audit-v1.0.0",
  "archiveLocation": ".github/reports/remediation-plan-20260914-001.md"
}
```

## Step Types & Patterns

### Type: Add (Adding new governance items)

```
Title: "Add [entity] to [file]"
ChangeType: add
Effort: simple (new item) to moderate (with docs)
Risk: low (additive) to medium (if affects automation)
Verification: Item appears in file, passes validation, used in test scenario
Rollback: Remove the added lines
```

### Type: Remove (Deleting deprecated items)

```
Title: "Remove deprecated [entity] from [file]"
ChangeType: remove
Effort: simple (if unused) to complex (if widely used)
Risk: medium to high (must verify no dependencies)
Verification: Item removed, no references remain, workflows still work
Rollback: Re-add the removed lines
```

### Type: Modify (Changing existing item properties)

```
Title: "Update [entity] in [file]"
ChangeType: modify
Effort: simple (rename) to moderate (change behavior)
Risk: medium (could break dependent systems)
Verification: Change correct, syntax valid, dependent systems tested
Rollback: Revert properties to original values
```

### Type: Rename (Changing entity names/IDs)

```
Title: "Rename [old-name] to [new-name]"
ChangeType: rename
Effort: trivial (rename only) to moderate (rename + update references)
Risk: high (breaks references)
Verification: New name in file, all references updated, searches work, no old name remains
Rollback: Revert to old name everywhere
```

## Markdown Output Format

Remediation plans are also rendered as Markdown for team review:

```markdown
# Remediation Plan: [Title]

**Generated**: [timestamp] | **Estimated Effort**: [time] | **Risk Level**: [risk]

## Violations Addressed

- [Violation 1 description]
- [Violation 2 description]

## Remediation Steps

### Step 1: [Step Title]

**File**: `.github/[file]` | **Effort**: [effort] | **Risk**: [risk]

[Detailed description]

**Current State**:
\`\`\`yaml
[Current content]
\`\`\`

**Target State**:
\`\`\`yaml
[Target content]
\`\`\`

**Verification**:
1. [Check 1]
2. [Check 2]

**Rollback**: [Instructions]

---
```

## Validation Checklist

Before publishing a remediation plan:

- [ ] `id` matches format remediation-YYYYMMDD-###
- [ ] `sourceReport` references valid audit report
- [ ] All violation IDs in `violations` exist in source report
- [ ] Step numbers are sequential (1, 2, 3, ...)
- [ ] All `affectedFile` paths are valid and within `.github/`
- [ ] `currentState` and `targetState` are accurate (quote verbatim from file)
- [ ] `changeType` matches the modification being described
- [ ] `effort` and `risk` estimates are realistic
- [ ] All `dependencies` reference prior steps
- [ ] `verificationSteps` are testable and concrete
- [ ] `rollbackProcedure` is clear and reversible
- [ ] Approval gates exist for critical/high-severity changes
- [ ] Total effort estimate is realistic sum of steps
- [ ] `postRemediationValidation` is specific and runnable

---

**Schema Version**: 1.0.0 | **Last Updated**: 2026-09-14
