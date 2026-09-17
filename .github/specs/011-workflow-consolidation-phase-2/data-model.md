---
title: "Phase 2 Data Model"
date_created: "2026-09-14"
last_updated: "2026-09-17"
---

# Phase 2 Data Model

## Overview

Phase 2 consolidates 71 archived workflows into 5 unified workflows, each with clear state, input/output contracts, and relationships.

---

## Unified Workflow Entities

### 1. LabelingUnifiedWorkflow

**Consolidates:** 9 archived labeling workflows

**Triggers:**

- `pull_request` (opened, edited, reopened, labeled, unlabeled)
- `issues` (opened, edited, reopened, labeled, unlabeled)
- Schedule: Daily at 2:00 UTC

**State:**

```yaml
LabelingState:
  pr_id: number
  issue_id: number
  current_labels: string[]
  applied_labels: string[]
  removed_labels: string[]
  source: "frontmatter" | "type" | "custom"
  status: "success" | "partial_success" | "failure"
  error_message: string (optional)
  created_at: ISO8601
  updated_at: ISO8601
```

**Composite Actions Used:**

- `apply-labels` — Apply labels to PR/issue
- `collect-metrics` — Record GitHub Actions minutes

**Outputs:**

- Applied labels visible on PR/issue
- PR/issue comments with summary (optional)
- Metrics artifact (labels_applied, labels_removed, cleanup_count)

**Acceptance Criteria:**

- ✅ All 9 labeling workflows consolidated to single YAML
- ✅ Labels match `.github/labels.yml` taxonomy with prefixes
- ✅ CI passes ≥3 consecutive times
- ✅ No regression vs archived workflows

---

### 2. ValidationUnifiedWorkflow

**Consolidates:** 12 archived validation workflows

**Triggers:**

- `pull_request` (opened, edited, synchronize)
- `workflow_dispatch`

**State:**

```yaml
ValidationState:
  pr_id: number
  branch_name: string
  branch_valid: boolean
  validations: ValidationCheck[]
  pr_comment_id: number (optional)
  status: "success" | "failure"
  created_at: ISO8601
  updated_at: ISO8601

ValidationCheck:
  type: "branch_naming" | "pr_template" | "changelog" | "commits"
  status: "passed" | "failed" | "skipped"
  message: string
```

**Composite Actions Used:**

- `validate-check` — Report validation results
- `collect-metrics` — Record GitHub Actions minutes

**Outputs:**

- PR comments with validation results and remediation steps
- Status check (aggregated pass/fail)
- Metrics artifact (validation_checks_run, passed, failed, skipped)

**Acceptance Criteria:**

- ✅ All 12 validation workflows consolidated
- ✅ Branch naming validation enforces `{type}/{scope}-{title}` format
- ✅ Invalid branches (claude/, copilot/, openai/) rejected with comment
- ✅ Failed validations post PR comments
- ✅ CI passes ≥3 consecutive times

---

### 3. TestingUnifiedWorkflow

**Consolidates:** 8 archived testing workflows

**Triggers:**

- `pull_request` (opened, synchronize, reopened)
- `push` (develop, main branches)
- `workflow_dispatch`

**State:**

```yaml
TestExecutionState:
  pr_id: number
  push_ref: string (optional)
  test_suite_results: TestSuiteResult[]
  coverage: CoverageMetrics
  status: "success" | "failure"
  created_at: ISO8601
  updated_at: ISO8601

TestSuiteResult:
  type: "unit" | "integration" | "e2e"
  total: number
  passed: number
  failed: number
  skipped: number
  duration_seconds: number

CoverageMetrics:
  line_percent: number
  branch_percent: number
  function_percent: number
```

**Composite Actions Used:**

- `aggregate-tests` — Aggregate test results and coverage
- `collect-metrics` — Record GitHub Actions minutes

**Outputs:**

- Test results JSON in artifacts/
- Coverage report (LCOV, HTML) in artifacts/
- Failure logs for debugging
- Metrics artifact (test_execution_time, coverage%, failures)

**Acceptance Criteria:**

- ✅ All 8 testing workflows consolidated
- ✅ Unit + Integration + E2E tests run in parallel
- ✅ 100% functional coverage (all critical paths, primary/error/edge cases)
- ✅ Test results and coverage uploaded to artifacts
- ✅ CI passes ≥3 consecutive times with stable results

---

### 4. LintingUnifiedWorkflow

**Consolidates:** 2 archived linting workflows

**Triggers:**

- `pull_request` (opened, edited, synchronize)
- `push` (develop, main branches)

**State:**

```yaml
LintingState:
  pr_id: number
  push_ref: string (optional)
  eslint_results: LintResults
  markdownlint_results: LintResults
  status: "success" | "failure"
  created_at: ISO8601
  updated_at: ISO8601

LintResults:
  status: "passed" | "failed"
  errors: number
  warnings: number
  files_checked: number
```

**Composite Actions Used:**

- `validate-check` — Report linting status
- `collect-metrics` — Record GitHub Actions minutes

**Outputs:**

- Linting report JSON
- PR comments with auto-fix suggestions
- Metrics artifact (linting_duration, total_issues)

**Acceptance Criteria:**

- ✅ Both linting workflows consolidated
- ✅ ESLint and Markdown linting rules deduplicated
- ✅ Linting failures post PR comments with auto-fix suggestions
- ✅ No regressions vs archived workflows
- ✅ CI passes ≥3 consecutive times

---

### 5. QualityGatesWorkflow

**Consolidates:** 5 utility workflows (security, compliance, quality)

**Triggers:**

- `pull_request` (opened, synchronize)
- `push` (develop, main branches)
- Schedule: Weekly (Monday) at 4:00 UTC

**State:**

```yaml
QualityGateState:
  pr_id: number
  push_ref: string (optional)
  security_scans: SecurityScan[]
  quality_metrics: QualityMetrics
  status: "success" | "failure" | "error"
  created_at: ISO8601
  updated_at: ISO8601

SecurityScan:
  type: "codeql" | "secret_scanning" | "dependency_check"
  status: "passed" | "failed"
  critical_findings: number
  high_findings: number
  medium_findings: number

QualityMetrics:
  maintainability_index: number
  cyclomatic_complexity: number
  technical_debt_ratio: number
```

**Composite Actions Used:**

- `validate-check` — Report quality gate status
- `collect-metrics` — Record GitHub Actions minutes

**Outputs:**

- CodeQL SARIF report
- Security findings summary
- Quality metrics dashboard
- Metrics artifact (scan_duration, github_actions_minutes)

**Acceptance Criteria:**

- ✅ All 5 utilities consolidated
- ✅ Security scans execute with findings reported to PR
- ✅ License compliance enforced; prohibited licenses rejected
- ✅ Code quality metrics reported with trends
- ✅ No new critical vulnerabilities introduced
- ✅ CI passes ≥3 consecutive times

---

## Relationships & Dependencies

```yaml
WorkflowDependencies:
  labeling-unified:
    depends_on:
      - ".github/labels.yml (read-only)"
      - "GitHub API (write labels)"
    feeds_to:
      - "downstream automation (uses labels for routing)"
    parallel_with:
      - validation, testing, linting, quality-gates

  validation-unified:
    depends_on:
      - ".github/ISSUE_TEMPLATE/*.md (read-only)"
      - ".github/branch-exceptions.yml (read-only)"
      - "GitHub API (read PR context, write comments)"
    feeds_to:
      - "PR merge gate (can block merge)"
    parallel_with:
      - labeling, testing, linting, quality-gates

  testing-unified:
    depends_on:
      - "Repository code (tests, coverage)"
      - "npm test (or language-appropriate)"
    feeds_to:
      - "Deployment gates (blocks if tests fail)"
    parallel_with:
      - labeling, validation, linting, quality-gates

  linting-unified:
    depends_on:
      - ".github/eslint.config.js (read-only)"
      - ".markdownlintrc (read-only)"
    feeds_to:
      - "PR merge gate (blocks if errors found)"
    parallel_with:
      - labeling, validation, testing, quality-gates

  quality-gates:
    depends_on:
      - ".github/config/LICENSE_ALLOWLIST.json (read-only)"
      - "CodeQL analysis"
      - "GitHub secret scanning"
    feeds_to:
      - "Security gates (may block merge)"
    parallel_with:
      - labeling, validation, testing, linting
```

---

## Composite Action Entities

### CompositeAction

```yaml
CompositeAction:
  name: string
  location: string (.github/actions/{name}/)
  purpose: string
  inputs: ActionInput[]
  outputs: ActionOutput[]
  performance:
    expected_duration_seconds: number
    github_actions_minutes: number
  test_coverage:
    line_coverage_percent: number (≥80% required)
    critical_paths: string[]
    edge_cases: string[]
  idempotent: boolean
  dependencies: string[]
```

**Instances:**

1. **apply-labels**
   - Purpose: Apply labels to PR/issue
   - Line Coverage: ≥80% (reusable shared logic)
   - Idempotent: Yes

2. **validate-check**
   - Purpose: Report validation results as PR status checks and comments
   - Line Coverage: ≥80% (reusable shared logic)
   - Idempotent: Yes

3. **aggregate-tests**
   - Purpose: Aggregate test results from multiple suites
   - Line Coverage: ≥80% (reusable shared logic)
   - Idempotent: Yes

4. **collect-metrics**
   - Purpose: Collect GitHub Actions minute usage per workflow
   - Line Coverage: ≥80% (reusable shared logic)
   - Idempotent: Yes

---

## Error Isolation & State Management

### Isolated Failure Model

**Definition:** When one unified workflow type fails, other workflow types continue independently.

```yaml
ErrorIsolationGuarantee:
  when_labeling_fails:
    other_workflows: "continue independently ✅"
    pr_status_check: "labeling-unified: failed"
    downstream_systems: "use last-known-good state or retry next run"

  when_validation_fails:
    other_workflows: "continue independently ✅"
    pr_status_check: "validation-unified: failed"
    downstream_systems: "can proceed with manual override"

  when_testing_fails:
    other_workflows: "continue independently ✅"
    pr_status_check: "testing-unified: failed"
    downstream_systems: "merge blocked, deploy blocked"

  when_linting_fails:
    other_workflows: "continue independently ✅"
    pr_status_check: "linting-unified: failed"
    downstream_systems: "merge blocked"

  when_quality_gates_fails:
    other_workflows: "continue independently ✅"
    pr_status_check: "quality-gates: failed"
    downstream_systems: "security gate may enforce"
```

---

## State Transitions

```yaml
LabelingUnifiedWorkflow:
  states:
    - "pending" → triggered by event
    - "running" → applying labels
    - "success" → labels applied, metrics recorded
    - "partial_success" → some labels applied, some failed
    - "failure" → label application failed

  terminal_states:
    - "success" (labels applied, workflow complete)
    - "partial_success" (some labels applied, some rejected)
    - "failure" (no labels applied, error logged)
```

Similar state transition diagrams apply to other workflow types.

---

## Consolidation Mapping (71 Archived → 5 Unified)

| Archived Workflow Count | Unified Workflow | New Location |
|------------------------|-----------------|-------------|
| 9 labeling workflows | labeling-unified.yml | `.github/workflows/labeling-unified.yml` |
| 12 validation workflows | validation-unified.yml | `.github/workflows/validation-unified.yml` |
| 8 testing workflows | testing-unified.yml | `.github/workflows/testing-unified.yml` |
| 2 linting workflows | linting-unified.yml | `.github/workflows/linting-unified.yml` |
| 5 quality utility workflows | quality-gates.yml | `.github/workflows/quality-gates.yml` |
| **71 total** | **5 unified** | **Consolidated** |
