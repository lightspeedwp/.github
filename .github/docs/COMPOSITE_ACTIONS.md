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
| **collect-metrics** | Collect workflow execution metrics | `.github/actions/collect-metrics/action.yml` | labeling-unified.yml |

Every action listed here is called by an active workflow. That is enforced by
`workflow-reachability.test.js`, which fails if a composite action has no
caller or if a `uses:` reference does not resolve — see
[Maintenance & Updates](#maintenance--updates).

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

---

## Maintenance & Updates

- **Versioning:** Use semantic versioning (v1, v2, etc.)
- **Breaking Changes:** Major version bump required
- **Testing:** Every composite action is covered by
  `workflow-consolidation-actions.test.js`, which asserts its declared outputs
  and exercises each step's script. Run it with
  `npx jest --config .jest.config.cjs .github/actions/__tests__/`.
- **Reachability:** `workflow-reachability.test.js` fails if an action has no
  caller in an active workflow, if a local `uses:` does not resolve, or if a
  workflow-shaped file sits outside `.github/workflows/`. Add a composite
  action and its contract test in the same change, or that suite fails.
- **Documentation:** Update this file when adding inputs/outputs

---

## Related Documents

- [plan.md](../specs/011-workflow-consolidation-phase-2/plan.md) — Implementation plan
- [PERFORMANCE_TARGETS.md](./PERFORMANCE_TARGETS.md) — Minutes budgets
- [WORKFLOW_CONSOLIDATION_MAPPING.md](./WORKFLOW_CONSOLIDATION_MAPPING.md) — Workflow mapping
