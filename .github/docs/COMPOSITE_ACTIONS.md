---
title: "Composite Actions Reference"
created: "2026-09-14"
phase: "Phase 2"
---

# Composite Actions Reference

This document defines the contracts, inputs, outputs, and usage patterns for all composite actions used in Phase 2 unified workflows.

---

## Overview

| Action | Purpose | Location | Used By |
|--------|---------|----------|---------|
| **apply-labels** | Apply labels to PR/issue with validation | `.github/actions/apply-labels/action.yml` | labeling-unified.yml |
| **validate-check** | Create/update GitHub check runs | `.github/actions/validate-check/action.yml` | validation-unified.yml |
| **aggregate-tests** | Aggregate test results and coverage | `.github/actions/aggregate-tests/action.yml` | testing-unified.yml |
| **collect-metrics** | Collect workflow execution metrics | `.github/actions/collect-metrics/action.yml` | All unified workflows |

---

## apply-labels

**Purpose:** Apply validated labels to pull requests or issues with duplicate detection and error handling.

### Contract

#### Inputs

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `labels` | string | ✓ | | Comma-separated list of labels (must be prefixed: type:, priority:, status:, area:, meta:) |
| `pr-number` | string | ✓* | | Pull request number (required if issue-number not set) |
| `issue-number` | string | ✓* | | Issue number (required if pr-number not set) |
| `github-token` | string | | `${{ github.token }}` | GitHub API token |

*Either `pr-number` OR `issue-number` must be provided.

#### Outputs

| Name | Type | Description |
|------|------|-------------|
| `applied-labels` | string (JSON array) | List of successfully applied labels |
| `failed-labels` | string (JSON array) | List of labels that failed to apply |
| `total-applied` | string (number) | Count of successfully applied labels |

#### Validation Rules

1. **Label Format:** All labels MUST match one of these prefixes:
   - `type:` — issue/PR type (bug, feature, task, documentation, security, design)
   - `priority:` — priority level (critical, high, normal, low)
   - `status:` — workflow status (needs-triage, in-progress, blocked, done)
   - `area:` — affected area (ci, docs, labels, security, testing, automation)
   - `meta:` — metadata label (needs-changelog, has-pr, duplicate, needs-audit)

2. **Duplicate Prevention:** If a label is already applied, it is counted as successful but not re-applied.

3. **Error Handling:** If any label fails to apply, the action logs a warning but continues processing other labels. The job does not fail unless explicitly configured to do so.

#### Example Usage

```yaml
- name: Apply labels to PR
  uses: ./.github/actions/apply-labels@v1
  with:
    labels: 'type:feature,priority:high,area:ci'
    pr-number: ${{ github.event.pull_request.number }}
    github-token: ${{ secrets.GITHUB_TOKEN }}
```

#### Known Limitations

- Label application is **case-sensitive**
- Does not remove existing labels (only adds)
- Requires `contents: write` permission on the repository

---

## validate-check

**Purpose:** Create or update GitHub check runs with validation results, supporting detailed reporting and annotations.

### Contract

#### Inputs

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `check-name` | string | ✓ | | Name of the check (e.g., "Branch Validation", "PR Template Validation") |
| `status` | enum | ✓ | | Check status: `queued`, `in_progress`, or `completed` |
| `conclusion` | enum | ✓* | | Check conclusion (required if status=completed): `success`, `failure`, `neutral`, `cancelled`, `skipped`, `timed_out` |
| `summary` | string | ✓ | | Short summary of check result |
| `details-url` | string | | | URL to details page (optional) |
| `text` | string | | | Detailed text output (markdown supported) |
| `annotations` | string (JSON) | | | Array of annotations (errors/warnings) |

#### Outputs

| Name | Type | Description |
|------|------|-------------|
| `check-id` | string | GitHub check run ID |
| `status` | string | Check status |

#### Status Transitions

```
queued → in_progress → completed (with conclusion)
```

#### Example Usage

```yaml
- name: Create validation check
  uses: ./.github/actions/validate-check@v1
  with:
    check-name: 'Branch Name Validation'
    status: 'completed'
    conclusion: 'success'
    summary: 'Branch name matches pattern: feat/*, fix/*, docs/*, etc.'
    text: |
      ✓ Branch name is valid
      ✓ Matches required pattern
      ✓ No forbidden prefixes (claude/, copilot/)
```

#### Known Limitations

- Annotations support is pending full implementation
- Check runs are associated with a commit SHA
- Requires `checks: write` permission

---

## aggregate-tests

**Purpose:** Aggregate test results from multiple test jobs and generate coverage reports with automated thresholds.

### Contract

#### Inputs

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `test-results-path` | string | ✓ | | Path to test results directory or glob pattern (e.g., `coverage/` or `**/*.json`) |
| `coverage-threshold` | number | | `80` | Minimum coverage percentage required (0-100) |
| `artifact-name` | string | | `test-results` | Name of artifact to upload results to |
| `github-token` | string | | `${{ github.token }}` | GitHub token for uploading artifacts |

#### Outputs

| Name | Type | Description |
|------|------|-------------|
| `total-tests` | string (number) | Total number of tests |
| `passed-tests` | string (number) | Number of passed tests |
| `failed-tests` | string (number) | Number of failed tests |
| `coverage-percent` | string (number) | Code coverage percentage |
| `coverage-status` | string | Coverage status: `PASS` or `FAIL` |

#### Supported Formats

- **JUnit XML:** `*.xml` files in test results directory
- **Coverage JSON:** `coverage-summary.json` (expected format: `{ total: { lines: { pct: 80 } } }`)

#### Example Usage

```yaml
- name: Run tests
  run: npm test -- --coverage --reporters=junit

- name: Aggregate test results
  uses: ./.github/actions/aggregate-tests@v1
  with:
    test-results-path: './coverage'
    coverage-threshold: 80
    artifact-name: 'unit-test-results'
```

#### Known Limitations

- Coverage file format must be `coverage-summary.json`
- JUnit XML parsing is simplified (grep-based)
- `bc` command required for decimal comparisons

---

## collect-metrics

**Purpose:** Collect GitHub Actions execution metrics including estimated minutes and job duration for Phase 2 performance tracking.

### Contract

#### Inputs

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `workflow-name` | string | ✓ | | Name of the workflow being measured |
| `job-name` | string | ✓ | | Name of the job being measured |
| `metrics-file` | string | | `metrics.json` | Path to metrics output file |
| `github-token` | string | | `${{ github.token }}` | GitHub token for API access |

#### Outputs

| Name | Type | Description |
|------|------|-------------|
| `metrics-file` | string | Path to generated metrics file |
| `workflow-minutes` | string (number) | Estimated GitHub Actions minutes for this job |
| `job-duration` | string (number) | Job duration in seconds |

#### Metrics Output Format

```json
{
  "workflow": "labeling-unified",
  "job": "pr-labeling",
  "run_id": "12345",
  "repository": "owner/repo",
  "timestamp": "2026-09-14T15:30:00Z",
  "timing": {
    "start_time": 1694700600,
    "end_time": 1694700660,
    "duration_seconds": 60
  },
  "metrics": {
    "estimated_github_actions_minutes": 1,
    "job_duration_seconds": 60
  }
}
```

#### Example Usage

```yaml
- name: Collect metrics
  uses: ./.github/actions/collect-metrics@v1
  with:
    workflow-name: labeling-unified
    job-name: pr-labeling
    metrics-file: ./metrics/job-metrics.json
```

#### Known Limitations

- Minutes are **estimated** based on job type until GitHub API integration is complete
- Requires GitHub CLI (`gh`) for full functionality
- Production version requires GitHub GraphQL API for actual billing data

---

## Error Handling Across Composite Actions

### Standard Error Codes

| Code | Meaning | Action |
|------|---------|--------|
| 0 | Success | Continue to next step |
| 1 | Validation error (input validation failed) | Fail the job |
| 1 | API error (GitHub API call failed) | Log warning, continue with fallback |
| 1 | Processing error (file not found, etc.) | Fail the job |

### Retry Strategy

- **API calls:** Automatic retry with exponential backoff (not yet implemented)
- **File operations:** Single attempt, fail fast
- **Validation:** Fail immediately on validation error

---

## Integration Points

### In labeling-unified.yml

```yaml
- uses: ./.github/actions/apply-labels
  with:
    labels: ${{ env.LABELS }}
    pr-number: ${{ github.event.pull_request.number }}

- uses: ./.github/actions/collect-metrics
  with:
    workflow-name: labeling-unified
    job-name: pr-labeling
```

### In validation-unified.yml

```yaml
- uses: ./.github/actions/validate-check
  with:
    check-name: 'Branch Validation'
    status: completed
    conclusion: success
    summary: 'Branch naming validated'
```

### In testing-unified.yml

```yaml
- uses: ./.github/actions/aggregate-tests
  with:
    test-results-path: ./coverage
    coverage-threshold: 80
```

---

## Maintenance & Updates

- **Versioning:** Use semantic versioning (v1, v2, etc.)
- **Breaking Changes:** Major version bump required
- **Testing:** All composite actions tested in workflow-harness.yml
- **Documentation:** Update this file when adding inputs/outputs

---

## Related Documents

- [plan.md](../specs/003-workflow-consolidation-phase-2/plan.md) — Implementation plan
- [PERFORMANCE_TARGETS.md](./PERFORMANCE_TARGETS.md) — Minutes budgets
- [WORKFLOW_CONSOLIDATION_MAPPING.md](./WORKFLOW_CONSOLIDATION_MAPPING.md) — Workflow mapping
