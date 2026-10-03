---
title: "Workflow Interface Contracts"
description: "Defines input triggers, output events, and status checks for each unified workflow"
---

# Workflow Interface Contracts

## Overview

Each unified workflow defines:

- **Trigger Contract:** What GitHub events trigger the workflow
- **Output Contract:** What the workflow reports/produces
- **Status Contract:** How the workflow reports success/failure
- **Error Isolation:** Single workflow failure does not affect others

---

## labeling-unified.yml

### Trigger Contract

```yaml
on:
  pull_request:
    types: [opened, edited, reopened, labeled, unlabeled]
  issues:
    types: [opened, edited, reopened, labeled, unlabeled]
  schedule:
    - cron: '0 2 * * *'  # Daily at 2:00 UTC
```

**Trigger Events:**

- PR creation/edit → Apply labels from PR metadata, PR template frontmatter
- Issue creation/edit → Apply labels from issue type, description
- Daily schedule → Remove stale labels (>90 days old), collect metrics

### Output Contract

```json
{
  "labels_applied": ["type:feature", "area:ci", "priority:high"],
  "labels_removed": ["status:needs-triage"],
  "stale_label_cleanup_count": 5,
  "metrics": {
    "workflow_duration_seconds": 15,
    "github_actions_minutes": 0.25,
    "labels_processed": 12
  }
}
```

**Output Artifacts:**

- Applied labels visible on PR/issue
- PR/issue comments with labeling summary (optional)
- Metrics artifact for GitHub Actions minutes tracking

### Status Contract

```yaml
check_name: "labeling-unified"
status: success | failure
conclusion: success | failure
output:
  summary: "Applied 3 labels (type:feature, area:ci, priority:high)"
  title: "Labeling Complete"
```

**Status Signals:**

- ✅ `success` — Labels applied, no conflicts
- ❌ `failure` — Label application failed (e.g., invalid label, insufficient permissions)

### Error Isolation Behavior

**When labeling-unified.yml fails:**

- Other workflows (validation, testing, linting, quality-gates) continue independently
- PR status check shows only `labeling-unified: failed`
- Dependent systems: Use last-known-good label state or retry labeling in next run
- Downstream automation: Not blocked; can proceed with existing labels

---

## validation-unified.yml

### Trigger Contract

```yaml
on:
  pull_request:
    types: [opened, edited, synchronize]
  workflow_dispatch:
```

**Trigger Events:**

- PR creation/update → Run all validation checks (branch name, template, changelog, commits)
- Manual dispatch → Re-run all validations

### Output Contract

```json
{
  "validations": [
    {
      "type": "branch_naming",
      "status": "passed",
      "message": "Branch 'feat/workflow-consolidation-phase-2' matches {type}/{scope}-{title}"
    },
    {
      "type": "pr_template",
      "status": "passed",
      "message": "PR template fields complete: Summary, Test plan, Screenshots"
    },
    {
      "type": "changelog",
      "status": "failed",
      "message": "PR modifies code but no CHANGELOG.md entry. Add entry or mark as no-changelog-needed"
    }
  ],
  "pr_comment": "Branch validation ✅ | Template validation ✅ | Changelog validation ❌",
  "metrics": {
    "validation_checks_run": 4,
    "passed": 2,
    "failed": 1,
    "skipped": 1,
    "github_actions_minutes": 0.5
  }
}
```

**Output Artifacts:**

- PR comments with validation results and remediation steps
- Status check result (aggregated pass/fail)
- Metrics for audit trail

### Status Contract

```yaml
check_name: "validation-unified"
status: success | failure
conclusion: success | failure
output:
  summary: "3/4 validations passed; see comments for failures"
  title: "Validation Result"
```

**Status Signals:**

- ✅ `success` — All validations passed
- ❌ `failure` — One or more validations failed (branch naming, template, changelog, commits)

### Error Isolation Behavior

**When validation-unified.yml fails:**

- Other workflows continue independently
- PR status check shows only `validation-unified: failed`
- Dependent systems: Can proceed without validation (manual override possible)
- PR merge: Blocked until validation passes or override applied

---

## testing-unified.yml

### Trigger Contract

```yaml
on:
  pull_request:
    types: [opened, synchronize, reopened]
  push:
    branches: [develop, main]
  workflow_dispatch:
```

**Trigger Events:**

- PR creation/update → Run unit, integration, E2E tests in parallel
- Push to develop/main → Run full test suite
- Manual dispatch → Re-run tests

### Output Contract

```json
{
  "test_results": {
    "unit": {
      "total": 150,
      "passed": 150,
      "failed": 0,
      "skipped": 0,
      "duration_seconds": 45
    },
    "integration": {
      "total": 20,
      "passed": 20,
      "failed": 0,
      "duration_seconds": 60
    },
    "e2e": {
      "total": 10,
      "passed": 10,
      "failed": 0,
      "duration_seconds": 120
    }
  },
  "coverage": {
    "line_percent": 87,
    "branch_percent": 82,
    "function_percent": 90
  },
  "metrics": {
    "total_test_duration": 225,
    "github_actions_minutes": 4.5,
    "artifact_size_mb": 50
  }
}
```

**Output Artifacts:**

- Test results JSON in artifacts/
- Coverage report (LCOV, HTML) in artifacts/
- Failure logs for debugging

### Status Contract

```yaml
check_name: "testing-unified"
status: success | failure
conclusion: success | failure
output:
  summary: "Tests: 180/180 passed | Coverage: 87%"
  title: "Test Results"
```

**Status Signals:**

- ✅ `success` — All tests passed, coverage ≥80%
- ❌ `failure` — Test failure OR coverage <80%

### Error Isolation Behavior

**When testing-unified.yml fails:**

- Other workflows continue independently
- PR status check shows only `testing-unified: failed`
- Dependent systems: Can proceed (tests optional for non-critical branches)
- PR merge: Blocked until tests pass

---

## linting-unified.yml

### Trigger Contract

```yaml
on:
  pull_request:
    types: [opened, edited, synchronize]
  push:
    branches: [develop, main]
```

**Trigger Events:**

- PR creation/update → Run ESLint (JS/TS) and markdownlint (Markdown)
- Push to develop/main → Run linting, fail on critical errors

### Output Contract

```json
{
  "linting_results": {
    "eslint": {
      "status": "passed",
      "errors": 0,
      "warnings": 3,
      "files_checked": 45
    },
    "markdownlint": {
      "status": "passed",
      "errors": 0,
      "warnings": 0,
      "files_checked": 12
    }
  },
  "metrics": {
    "linting_duration": 30,
    "github_actions_minutes": 0.75,
    "total_issues": 3
  }
}
```

**Output Artifacts:**

- Linting report JSON
- PR comments with auto-fix suggestions (when applicable)

### Status Contract

```yaml
check_name: "linting-unified"
status: success | failure
conclusion: success | failure
output:
  summary: "ESLint: 0 errors, 3 warnings | Markdownlint: 0 errors"
  title: "Linting Results"
```

**Status Signals:**

- ✅ `success` — All linting errors resolved, warnings acceptable
- ❌ `failure` — Linting errors found

### Error Isolation Behavior

**When linting-unified.yml fails:**

- Other workflows continue independently
- PR status check shows only `linting-unified: failed`
- Dependent systems: Not affected
- PR merge: Blocked until linting passes

---

## quality-gates.yml

### Trigger Contract

```yaml
on:
  pull_request:
    types: [opened, synchronize]
  push:
    branches: [develop, main]
  schedule:
    - cron: '0 4 * * 1'  # Weekly (Monday) at 4:00 UTC
```

**Trigger Events:**

- PR creation/update → Run security scans (CodeQL, secret scanning)
- Push to develop/main → Run full quality gate suite
- Weekly schedule → Scheduled security scanning

### Output Contract

```json
{
  "security_scans": {
    "codeql": {
      "status": "passed",
      "critical_findings": 0,
      "high_findings": 0,
      "medium_findings": 2
    },
    "secret_scanning": {
      "status": "passed",
      "secrets_detected": 0
    },
    "dependency_check": {
      "status": "passed",
      "vulnerabilities": 0
    }
  },
  "quality_metrics": {
    "maintainability_index": 78,
    "cyclomatic_complexity": 12,
    "technical_debt_ratio": 2.5
  },
  "metrics": {
    "scan_duration": 60,
    "github_actions_minutes": 2.0
  }
}
```

**Output Artifacts:**

- CodeQL SARIF report
- Security findings summary
- Quality metrics dashboard

### Status Contract

```yaml
check_name: "quality-gates"
status: success | failure | error
conclusion: success | failure
output:
  summary: "Security: 0 critical, 0 high | Quality: maintainability 78"
  title: "Quality Gate Result"
```

**Status Signals:**

- ✅ `success` — No critical/high vulnerabilities, quality metrics acceptable
- ❌ `failure` — Critical/high vulnerabilities found
- ⚠️ `error` — Scan error (CodeQL failure, API rate limit, etc.)

### Error Isolation Behavior

**When quality-gates.yml fails:**

- Other workflows continue independently
- PR status check shows only `quality-gates: failed`
- Dependent systems: Can proceed (security gates may be advisory only)
- PR merge: Blocked if critical/high vulnerabilities found

---

## Consolidated Error Isolation Matrix

| Workflow | Fails | Status Check | Other Workflows | PR Merge | Downstream Impact |
|----------|-------|--------------|-----------------|----------|------------------|
| labeling-unified | ❌ | Failed | ✅ Continue | May block | Label-dependent tasks retry |
| validation-unified | ❌ | Failed | ✅ Continue | Blocked | Can override manually |
| testing-unified | ❌ | Failed | ✅ Continue | Blocked | Merge blocked; no deploys |
| linting-unified | ❌ | Failed | ✅ Continue | Blocked | Code quality gate enforced |
| quality-gates | ❌ | Failed | ✅ Continue | May block | Security gate may enforce |

**Key Guarantee:** Single workflow type failure does not cascade to other workflows. Each workflow type fails independently, and PR status check reports only that workflow's failure.
