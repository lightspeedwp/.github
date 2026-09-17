---
title: "Composite Action Contracts"
date: "2026-09-17"
version: "1.0"
---

# Composite Action Contracts

**Reference:** See `.github/specs/011-workflow-consolidation-phase-2/contracts/composite-action-contracts.md` for complete specifications.

This document provides quick-reference information about the 4 reusable composite actions created for Phase 2. Each action encapsulates shared workflow logic and is used across all 5 unified workflows.

## Quick Reference

| Action | Purpose | Location | Used By |
|--------|---------|----------|---------|
| `apply-labels` | Apply labels to PR/issue | `.github/actions/apply-labels/` | labeling-unified.yml |
| `validate-check` | Report validation results | `.github/actions/validate-check/` | validation, linting, quality-gates |
| `aggregate-tests` | Aggregate test results | `.github/actions/aggregate-tests/` | testing-unified.yml |
| `collect-metrics` | Collect GitHub Actions metrics | `.github/actions/collect-metrics/` | All workflows |

## Action Specifications

### 1. apply-labels

**File:** `.github/actions/apply-labels/action.yml`

**Purpose:** Apply labels to PR/issue based on metadata, frontmatter, or custom rules

**Key Inputs:**

- `target_type` (required): "pull_request" or "issue"
- `target_id` (required): GitHub API ID
- `labels` (required): Comma-separated label names
- `dry_run` (optional): Validate without applying

**Key Outputs:**

- `labels_applied`: JSON array of applied labels
- `status`: "success", "partial_success", or "failure"
- `error_message`: Error details if applicable

**Test Coverage:** ≥80% line coverage (reusable shared logic)

### 2. validate-check

**File:** `.github/actions/validate-check/action.yml`

**Purpose:** Report validation results as GitHub check runs and comments

**Key Inputs:**

- `check_name` (required): Check identifier (e.g., "validation-unified")
- `status` (required): "success", "failure", or "neutral"
- `summary` (required): Markdown-formatted summary
- `post_comment` (optional): Post PR comment with results

**Key Outputs:**

- `check_id`: GitHub check run ID
- `comment_id`: PR comment ID (if posted)
- `status`: Reporting status

**Test Coverage:** ≥80% line coverage

### 3. aggregate-tests

**File:** `.github/actions/aggregate-tests/action.yml`

**Purpose:** Aggregate test results from unit, integration, and E2E test suites

**Key Inputs:**

- `unit_test_result`: Path to unit test JSON results
- `integration_test_result`: Path to integration test results
- `e2e_test_result`: Path to E2E test results
- `coverage_threshold`: Minimum coverage % (default: 80)

**Key Outputs:**

- `aggregated_results`: Complete results JSON
- `total_tests`: Total test count
- `failed_count`: Failed test count
- `coverage_percent`: Overall coverage percentage
- `status`: Aggregation status

**Test Coverage:** ≥80% line coverage

### 4. collect-metrics

**File:** `.github/actions/collect-metrics/action.yml`

**Purpose:** Collect and report GitHub Actions minute usage per workflow

**Key Inputs:**

- `workflow_name` (required): Workflow identifier
- `workflow_run_id` (optional): GitHub Actions run ID
- `metric_type`: Type of metric to collect (default: "all")
- `output_format`: Output format: json|markdown|csv (default: json)

**Key Outputs:**

- `metrics_json`: Formatted metrics output
- `minutes_used`: Total minutes consumed
- `duration_seconds`: Workflow duration in seconds
- `status`: Collection status

**Test Coverage:** ≥80% line coverage

---

## Usage Examples

### apply-labels in labeling-unified.yml

```yaml
- name: "Apply labels"
  uses: ./.github/actions/apply-labels@v1
  with:
    target_type: pull_request
    target_id: ${{ github.event.pull_request.id }}
    source: frontmatter
    labels: "type:feature,area:ci,priority:high"
    github_token: ${{ secrets.GITHUB_TOKEN }}
```

### validate-check in validation-unified.yml

```yaml
- name: "Report validation"
  uses: ./.github/actions/validate-check@v1
  with:
    check_name: validation-unified
    status: ${{ steps.validate.outcome }}
    title: "Validation Results"
    summary: "Branch naming validation passed"
    post_comment: true
    github_token: ${{ secrets.GITHUB_TOKEN }}
```

### aggregate-tests in testing-unified.yml

```yaml
- name: "Aggregate test results"
  uses: ./.github/actions/aggregate-tests@v1
  with:
    unit_test_result: test-results/unit.json
    integration_test_result: test-results/integration.json
    e2e_test_result: test-results/e2e.json
    coverage_file: coverage/lcov.info
    coverage_threshold: "80"
    output_file: test-results/aggregated.json
```

### collect-metrics in all workflows

```yaml
- name: "Collect metrics"
  uses: ./.github/actions/collect-metrics@v1
  with:
    workflow_name: ${{ github.workflow }}
    workflow_run_id: ${{ github.run_id }}
    metric_type: all
    output_format: json
    github_token: ${{ secrets.GITHUB_TOKEN }}
```

---

## Error Handling

### apply-labels Errors

| Error | Status | Recovery |
|-------|--------|----------|
| Invalid label | partial_success | Verify label in `.github/labels.yml` |
| Permission denied | failure | Check token permissions |
| API rate limit | failure | Automatic retry on next run |

### validate-check Errors

| Error | Handling |
|-------|----------|
| Invalid status | Validation fails; check input value |
| API error | Check logs; retry on next run |
| Missing PR context | Neutral status; no comment posted |

### aggregate-tests Errors

| Error | Handling |
|-------|----------|
| Missing results file | Warning; continue with available results |
| Invalid JSON | Failure; check test result format |
| Coverage below threshold | Failure; add tests to increase coverage |

### collect-metrics Errors

| Error | Handling |
|-------|----------|
| Invalid workflow ID | Failure; verify workflow name |
| API permission denied | Failure; check token permissions |
| Rate limit exceeded | Failure; retry after rate limit reset |

---

## Performance Characteristics

| Action | Expected Duration | GitHub Actions Minutes |
|--------|------------------|----------------------|
| apply-labels | 10-30 seconds | 0.2 minutes |
| validate-check | 5-10 seconds | 0.1 minutes |
| aggregate-tests | 10-20 seconds | 0.3 minutes |
| collect-metrics | 5-15 seconds | 0.1 minutes |

---

## Test Coverage

All composite actions meet ≥80% line coverage requirement:

- ✅ apply-labels: Critical path coverage (label validation, removal, error handling)
- ✅ validate-check: Check reporting path, status mapping, comment posting
- ✅ aggregate-tests: Results aggregation, coverage calculation, threshold validation
- ✅ collect-metrics: API calls, metric collection, format conversion

---

## References

- **Complete Specifications:** `.github/specs/011-workflow-consolidation-phase-2/contracts/composite-action-contracts.md`
- **Data Model:** `.github/specs/011-workflow-consolidation-phase-2/data-model.md`
- **Workflow Interfaces:** `.github/specs/011-workflow-consolidation-phase-2/contracts/workflow-interfaces.md`
