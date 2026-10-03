---
title: "Composite Action Interface Contracts"
description: "Defines input parameters, outputs, and behavior for reusable composite actions"
---

# Composite Action Interface Contracts

## Overview

Composite actions are reusable workflow components that encapsulate shared logic. Each action defines:

- **Input Contract:** Required and optional parameters
- **Output Contract:** Returned values and artifacts
- **Error Handling:** Failure modes and recovery
- **Performance:** Expected execution time and GitHub Actions minute usage
- **Test Coverage:** ≥80% line coverage requirement

---

## apply-labels

**Location:** `.github/actions/apply-labels/action.yml`

**Purpose:** Apply labels to PR/issue based on metadata, PR template frontmatter, or custom rules

### Input Contract

```yaml
inputs:
  target_type:
    description: "Target entity type: 'pull_request' or 'issue'"
    required: true
    type: "string"
    values: ["pull_request", "issue"]
  
  target_id:
    description: "GitHub API ID of PR or issue"
    required: true
    type: "integer"
  
  source:
    description: "Where labels come from: 'frontmatter' (PR template), 'type' (issue type), 'custom' (rules-based)"
    required: true
    type: "string"
    values: ["frontmatter", "type", "custom"]
  
  labels:
    description: "Comma-separated label names (must exist in .github/labels.yml with prefix)"
    required: true
    type: "string"
    example: "type:feature,area:ci,priority:high"
  
  remove_labels:
    description: "Comma-separated labels to remove (optional)"
    required: false
    type: "string"
    example: "status:needs-triage"
  
  dry_run:
    description: "If 'true', log labels but don't apply (for validation)"
    required: false
    type: "boolean"
    default: false
  
  github_token:
    description: "GitHub API token with write permissions to PR/issue"
    required: true
    type: "string"
    sensitive: true
```

### Output Contract

```yaml
outputs:
  labels_applied:
    description: "JSON array of labels successfully applied"
    type: "string"
    example: '["type:feature","area:ci","priority:high"]'
  
  labels_removed:
    description: "JSON array of labels removed"
    type: "string"
    example: '["status:needs-triage"]'
  
  total_labels:
    description: "Total number of labels on target after operation"
    type: "integer"
    example: 5
  
  status:
    description: "Status of operation: 'success', 'partial_success', 'failure'"
    type: "string"
    values: ["success", "partial_success", "failure"]
  
  error_message:
    description: "Error details if status is 'failure' or 'partial_success'"
    type: "string"
    example: "Label 'invalid-label' not found in .github/labels.yml"
```

### Error Handling

```json
{
  "invalid_label_error": {
    "scenario": "Label not in .github/labels.yml",
    "status": "partial_success",
    "behavior": "Skip invalid label, apply valid ones, report in error_message",
    "recovery": "Verify label exists with correct prefix in .github/labels.yml"
  },
  "permission_error": {
    "scenario": "Token lacks write permissions",
    "status": "failure",
    "behavior": "Exit with error, no labels applied",
    "recovery": "Verify github_token has repo:write permission"
  },
  "api_rate_limit": {
    "scenario": "GitHub API rate limit exceeded",
    "status": "failure",
    "behavior": "Exit with error, retry on next workflow run",
    "recovery": "Wait for rate limit reset (typically 1 hour)"
  },
  "network_error": {
    "scenario": "Network timeout or connection failure",
    "status": "failure",
    "behavior": "Workflow fails; workflow engine retries",
    "recovery": "Automatic retry by GitHub Actions"
  }
}
```

### Performance Characteristics

```yaml
expected_duration: "10-30 seconds"
github_actions_minutes: 0.2
parallelizable: "yes"
idempotent: "yes (safe to re-run)"
dependencies:
  - ".github/labels.yml (read-only)"
  - "GitHub API (write)"
```

### Test Coverage Requirement

- ✅ **Line Coverage:** ≥80% (reusable shared logic)
- ✅ **Critical Paths:** Label application, removal, validation, error handling
- ✅ **Edge Cases:** Empty labels, duplicate labels, stale labels, permission errors

---

## validate-check

**Location:** `.github/actions/validate-check/action.yml`

**Purpose:** Report validation results as PR status checks and comments

### Input Contract

```yaml
inputs:
  check_name:
    description: "Name of the check to report (e.g., 'validation-unified')"
    required: true
    type: "string"
    example: "branch-naming-validation"
  
  status:
    description: "Validation result: 'success', 'failure', 'neutral'"
    required: true
    type: "string"
    values: ["success", "failure", "neutral"]
  
  title:
    description: "Short title for the check result"
    required: true
    type: "string"
    example: "Branch Name Validation"
  
  summary:
    description: "Detailed summary of validation result (Markdown)"
    required: true
    type: "string"
    example: "Branch 'feat/feature-name' matches pattern {type}/{scope}-{title}"
  
  details:
    description: "Additional validation details or error messages (JSON array, optional)"
    required: false
    type: "string"
    example: '[{"check":"branch_naming","passed":true},{"check":"changelog","passed":false}]'
  
  post_comment:
    description: "If 'true', post PR comment with validation results"
    required: false
    type: "boolean"
    default: false
  
  github_token:
    description: "GitHub API token with write permissions to PR checks"
    required: true
    type: "string"
    sensitive: true
```

### Output Contract

```yaml
outputs:
  check_id:
    description: "GitHub check run ID (for later updates)"
    type: "string"
    example: "1234567890"
  
  comment_id:
    description: "PR comment ID (if post_comment=true)"
    type: "string"
    example: "987654321"
  
  status:
    description: "Status of check reporting: 'success', 'failure'"
    type: "string"
  
  message:
    description: "Confirmation message"
    type: "string"
    example: "Check 'branch-naming-validation' reported as success"
```

### Error Handling

```json
{
  "invalid_status_error": {
    "scenario": "Status not one of: success, failure, neutral",
    "status": "failure",
    "behavior": "Exit with error, no check reported",
    "recovery": "Verify status is valid"
  },
  "check_reporting_error": {
    "scenario": "GitHub API error when creating check run",
    "status": "failure",
    "behavior": "Exit with error message",
    "recovery": "Retry on next workflow run"
  },
  "comment_posting_error": {
    "scenario": "PR comment posting fails",
    "status": "failure (if post_comment=true)",
    "behavior": "Check reported, comment fails, error returned",
    "recovery": "Retry comment posting in separate action"
  }
}
```

### Performance Characteristics

```yaml
expected_duration: "5-10 seconds"
github_actions_minutes: 0.1
parallelizable: "yes"
idempotent: "yes"
dependencies:
  - "GitHub API (write)"
  - "PR context (github.event.pull_request)"
```

### Test Coverage Requirement

- ✅ **Line Coverage:** ≥80%
- ✅ **Critical Paths:** Check reporting, status assignment, comment posting
- ✅ **Edge Cases:** API errors, missing PR context, invalid status values

---

## aggregate-tests

**Location:** `.github/actions/aggregate-tests/action.yml`

**Purpose:** Aggregate test results from multiple test suites (unit, integration, E2E) into unified report

### Input Contract

```yaml
inputs:
  unit_test_result:
    description: "Path to unit test results JSON (or 'skip' to omit)"
    required: false
    type: "string"
    example: "test-results/unit.json"
  
  integration_test_result:
    description: "Path to integration test results JSON (or 'skip')"
    required: false
    type: "string"
    example: "test-results/integration.json"
  
  e2e_test_result:
    description: "Path to E2E test results JSON (or 'skip')"
    required: false
    type: "string"
    example: "test-results/e2e.json"
  
  coverage_file:
    description: "Path to coverage report (LCOV format, optional)"
    required: false
    type: "string"
    example: "coverage/lcov.info"
  
  coverage_threshold:
    description: "Minimum coverage percentage required (fail if below)"
    required: false
    type: "integer"
    default: 80
    example: 80
  
  output_file:
    description: "Path to write aggregated results JSON"
    required: false
    type: "string"
    default: "test-results/aggregated.json"
```

### Output Contract

```yaml
outputs:
  aggregated_results:
    description: "JSON string with aggregated test results"
    type: "string"
    example: |
      {
        "total_tests": 180,
        "passed": 180,
        "failed": 0,
        "skipped": 0,
        "duration_seconds": 225,
        "coverage_percent": 87,
        "status": "success"
      }
  
  total_tests:
    description: "Total number of tests executed"
    type: "integer"
    example: 180
  
  failed_count:
    description: "Number of failed tests"
    type: "integer"
    example: 0
  
  coverage_percent:
    description: "Overall code coverage percentage"
    type: "number"
    example: 87.5
  
  status:
    description: "Aggregation status: 'success', 'failure' (if threshold not met)"
    type: "string"
    values: ["success", "failure"]
  
  summary:
    description: "Human-readable summary (Markdown)"
    type: "string"
    example: "Tests: 180/180 passed | Coverage: 87.5% ✅"
```

### Error Handling

```json
{
  "missing_results_error": {
    "scenario": "Test results file not found",
    "status": "failure",
    "behavior": "Report error, skip missing suite",
    "recovery": "Verify test suite ran and results saved to expected path"
  },
  "invalid_json_error": {
    "scenario": "Test results JSON malformed",
    "status": "failure",
    "behavior": "Exit with parse error",
    "recovery": "Verify test results are valid JSON format"
  },
  "coverage_threshold_failure": {
    "scenario": "Coverage < coverage_threshold",
    "status": "failure",
    "behavior": "Report coverage shortfall, fail aggregation",
    "recovery": "Add tests to increase coverage to threshold"
  },
  "test_failure": {
    "scenario": "One or more tests failed",
    "status": "failure",
    "behavior": "Report failed test count, fail aggregation",
    "recovery": "Fix failing tests"
  }
}
```

### Performance Characteristics

```yaml
expected_duration: "10-20 seconds"
github_actions_minutes: 0.3
parallelizable: "yes"
idempotent: "yes"
dependencies:
  - "Test results files (read-only)"
  - "Coverage report file (read-only)"
```

### Test Coverage Requirement

- ✅ **Line Coverage:** ≥80%
- ✅ **Critical Paths:** Results aggregation, coverage calculation, threshold validation
- ✅ **Edge Cases:** Missing results, invalid JSON, coverage threshold failures

---

## collect-metrics

**Location:** `.github/actions/collect-metrics/action.yml`

**Purpose:** Collect GitHub Actions minute usage per workflow and report metrics for audit trail

### Input Contract

```yaml
inputs:
  workflow_name:
    description: "Name of workflow to collect metrics for"
    required: true
    type: "string"
    example: "labeling-unified"
  
  workflow_run_id:
    description: "GitHub Actions run ID (or 'current' for current run)"
    required: false
    type: "string"
    default: "current"
  
  metric_type:
    description: "Metric to collect: 'minutes_used', 'duration_seconds', 'job_count', 'all'"
    required: false
    type: "string"
    default: "all"
    values: ["minutes_used", "duration_seconds", "job_count", "all"]
  
  output_format:
    description: "Output format: 'json', 'markdown', 'csv'"
    required: false
    type: "string"
    default: "json"
    values: ["json", "markdown", "csv"]
  
  github_token:
    description: "GitHub API token (requires read:repo permission)"
    required: true
    type: "string"
    sensitive: true
```

### Output Contract

```yaml
outputs:
  metrics_json:
    description: "Metrics as JSON string"
    type: "string"
    example: |
      {
        "workflow_name": "labeling-unified",
        "workflow_run_id": "1234567890",
        "minutes_used": 0.25,
        "duration_seconds": 15,
        "job_count": 2,
        "timestamp": "2026-09-17T10:30:00Z"
      }
  
  minutes_used:
    description: "GitHub Actions minutes consumed by this run"
    type: "number"
    example: 0.25
  
  duration_seconds:
    description: "Total duration of workflow in seconds"
    type: "integer"
    example: 15
  
  status:
    description: "Status of metric collection: 'success', 'failure'"
    type: "string"
```

### Error Handling

```json
{
  "invalid_workflow_error": {
    "scenario": "Workflow not found or run_id invalid",
    "status": "failure",
    "behavior": "Exit with error",
    "recovery": "Verify workflow_name and workflow_run_id are correct"
  },
  "api_permission_error": {
    "scenario": "Token lacks read:repo permission",
    "status": "failure",
    "behavior": "Exit with permission denied error",
    "recovery": "Verify github_token has read:repo permission"
  },
  "rate_limit_error": {
    "scenario": "GitHub API rate limit exceeded",
    "status": "failure",
    "behavior": "Exit with rate limit error",
    "recovery": "Retry after rate limit reset (typically 1 hour)"
  }
}
```

### Performance Characteristics

```yaml
expected_duration: "5-15 seconds"
github_actions_minutes: 0.1
parallelizable: "yes"
idempotent: "yes"
dependencies:
  - "GitHub API (read-only)"
```

### Test Coverage Requirement

- ✅ **Line Coverage:** ≥80%
- ✅ **Critical Paths:** Metrics collection, API calls, data aggregation
- ✅ **Edge Cases:** Invalid workflow IDs, rate limit errors, missing data

---

## Composite Action Dependencies and Ordering

```yaml
workflow_execution_order:
  1_labeling:
    actions:
      - apply-labels  # Apply labels to PR/issue
      - collect-metrics  # Collect metrics after completion

  2_validation:
    actions:
      - validate-check  # Report validation status
      - collect-metrics  # Collect metrics

  3_testing:
    actions:
      - aggregate-tests  # Aggregate test results
      - collect-metrics  # Collect metrics

  4_linting:
    actions:
      - validate-check  # Report linting status
      - collect-metrics  # Collect metrics

  5_quality_gates:
    actions:
      - validate-check  # Report quality gate status
      - collect-metrics  # Collect metrics
```

**Key Guarantees:**

- Composite actions are idempotent (safe to re-run)
- Actions do not depend on each other (parallel execution safe)
- Each action has ≥80% line coverage requirement
- Error in one action does not cascade to others
- Each action independently reports success/failure
