---
title: Labeling Unified Workflow
date_created: "2026-09-17"
last_updated: "2026-09-17"
---

# Labeling Unified Workflow

**Workflow Location:** `.github/workflows/labeling-unified.yml`

## Overview

The Labeling Unified workflow consolidates 11 archived labeling workflows into a single, unified workflow for managing labels across issues, pull requests, and discussions.

**Consolidation Scope:** 9+ archived labeling workflows → 1 unified workflow

**Key Metrics:**

- Baseline: 450 min/month
- Target: ≤315 min/month (30% reduction)
- Expected savings: ~135 min/month

---

## Trigger Patterns

### Reactive (Event-Based)

Labeling Unified responds to the following GitHub events:

#### Pull Request Events

```yaml
pull_request:
  types: [opened, edited, synchronize, reopened, ready_for_review, labeled, unlabeled]
```

**Triggers:**

- `pr-labeling` job on PR open/edit/sync/reopen
- `governance-check` job when labels are applied/removed
- `blocking-status` job on label changes

**Labels Applied:**

- `type:*` — Detected from branch name prefix (e.g., `feat/feature-name` → `type:feat`)
- `area:*` — Applied by `.github/labeler.yml` rules (file-based)
- `status:*`, `priority:*` — Applied by custom labeling agent
- `meta:*` — Applied based on blocking status or special patterns

#### Issue Events

```yaml
issues:
  types: [opened, edited, reopened, labeled, unlabeled, transferred]
```

**Triggers:**

- `issue-labeling` job on issue open/edit/reopen
- `governance-check` job on label changes
- `blocking-status` job on label changes

**Labels Applied:**

- `type:*` — Detected from issue template or title/body patterns:
  - `type:bug` — Issue contains "Bug Report" section or title has "bug"
  - `type:feature` — Issue contains "Feature Request" section or title has "feature"
  - `type:documentation` — Issue contains "Documentation" section
  - `type:security` — Issue contains "Security" section
  - `type:design` — Issue contains "Design" section
  - `type:task` — Default for unclassified issues
- `priority:*` — Applied by custom labeling agent
- `area:*` — Applied by custom labeling agent

#### Discussion Events

```yaml
discussion:
  types: [created, edited, answered, labeled, unlabeled]
```

**Triggers:**

- `pr-labeling` job (shared logic) when discussions are created/edited
- Labels applied: `type:discussion`, `status:*`, `priority:*`

### Scheduled (Cron-Based)

Scheduled jobs run at fixed times to catch up on unlabeled items:

| Time (UTC) | Job | Purpose |
|---|---|---|
| 02:00 Daily | `scheduled-issue-catch-up` | Catch-up labeling for issues updated in last 7 days |
| 03:00 Daily | `scheduled-pr-catch-up` | Catch-up labeling for PRs updated in last 7 days |
| 04:00 Daily | `scheduled-label-sync` | Sync labels with canonical `.github/labels.yml` |
| Monday 08:00 | `scheduled-remediate-bare` | Remediate bare labels (bare-label-mapping.json) |
| Saturday 09:00 | `scheduled-audit-report` | Generate label audit report (last 7 days) |

---

## Jobs and Step Breakdown

### 1. pr-labeling (Reactive)

**Trigger:** `pull_request` event

**Steps:**

1. Checkout code with full history
2. Setup Node.js environment
3. Install dependencies
4. Sync labels with canonical set (`.github/labels.yml`)
5. Validate PR branch naming (`{type}/{scope}-{title}`)
6. Apply file/branch-based labels via `actions/labeler`
7. Apply custom PR labels via labeling agent
8. Apply branch-based type label (if valid branch name)
9. Collect metrics via `collect-metrics` composite action

**Outputs:**

- Labels applied to PR
- Metrics JSON artifact (GitHub Actions minutes, labels applied count)

**Error Handling:**

- `continue-on-error: true` for `apply-labels` composite action
- Failures do not block subsequent steps
- Metrics collected even if labeling fails

---

### 2. issue-labeling (Reactive)

**Trigger:** `issues` event

**Steps:**

1. Checkout code with full history
2. Setup Node.js environment
3. Install dependencies
4. Sync labels with canonical set
5. Detect issue type from body/title patterns
6. Apply issue type labels via `apply-labels` composite action
7. Apply custom issue labels via labeling agent
8. Collect metrics

**Issue Type Detection:**

- Scans issue body for template sections: "Bug Report", "Feature Request", "Documentation", "Security", "Design"
- Scans issue title for keywords: "bug", "feature", "doc", "security", "design"
- Applies matching `type:*` label; defaults to `type:task` if no match

**Outputs:**

- Labels applied to issue
- Metrics JSON artifact

---

### 3. governance-check (Reactive)

**Trigger:** `pull_request` and `issues` events

**Steps:**

1. Checkout code
2. Setup Node.js environment
3. Install dependencies
4. Check label governance compliance
5. Report governance status via `validate-check` composite action
6. Collect metrics

**Validations:**

- All applied labels exist in `.github/labels.yml`
- All labels have required prefix (`type:`, `status:`, `priority:`, `area:`, `meta:`)
- No deprecated labels are applied
- Label naming conventions followed

**Outputs:**

- Governance check status (success/failure)
- Optional PR comment with violations (if `post_comment: true`)
- Metrics JSON artifact

---

### 4. blocking-status (Reactive)

**Trigger:** `pull_request` and `issues` events with label changes

**Steps:**

1. Checkout code
2. Setup Node.js environment
3. Install dependencies
4. Detect blocking status changes (looks for `status:blocked` or `status:needs-review`)
5. Apply/remove related meta labels (`meta:blocked`)
6. Collect metrics

**Blocking Status Handling:**

- When `status:blocked` label added → also adds `meta:blocked` label
- When `status:needs-review` label added → tracks blocking on review
- Helps downstream systems identify blocked items

**Outputs:**

- Updated labels on PR/issue
- Metrics JSON artifact

---

### 5. scheduled-issue-catch-up (Scheduled — 02:00 UTC)

**Trigger:** Cron schedule `0 2 * * *`

**Purpose:** Catch-up labeling for issues without type labels

**Steps:**

1. Checkout code
2. Setup Node.js environment
3. Install dependencies
4. Fetch issues updated in last 7 days without type labels
5. Apply labels via labeling workflow script
6. Generate labeling report
7. Upload report artifact (30-day retention)
8. Collect metrics

**Scope:** Issues only, excludes PRs, filters for `updated_within_days: 7`

---

### 6. scheduled-pr-catch-up (Scheduled — 03:00 UTC)

**Trigger:** Cron schedule `0 3 * * *`

**Purpose:** Catch-up labeling for PRs without type labels

**Steps:**

1. Same as issue catch-up but for PRs
2. Filters by PR type only

**Scope:** PRs only, filters for `updated_within_days: 7`

---

### 7. scheduled-label-sync (Scheduled — 04:00 UTC)

**Trigger:** Cron schedule `0 4 * * *`

**Purpose:** Sync all labels with canonical set

**Steps:**

1. Checkout code
2. Setup Node.js environment
3. Install dependencies
4. Sync labels with `.github/labels.yml` (adds missing, removes extra)
5. Collect metrics

**Ensures:**

- All labels in `.github/labels.yml` exist in repository
- No stale or orphaned labels remain
- Label colors and descriptions match canonical set

---

### 8. scheduled-remediate-bare (Scheduled — Monday 08:00 UTC)

**Trigger:** Cron schedule `0 8 * * 1` (Mondays)

**Purpose:** Remediate bare labels (labels without prefix)

**Steps:**

1. Checkout code
2. Setup Node.js environment
3. Install dependencies
4. Load bare label mapping (`.github/reports/label-remediation/bare-label-mapping.json`)
5. Scan for bare labels in last 30 days
6. Apply remediation (replace bare labels with prefixed versions)
7. Generate remediation report
8. Upload report artifact (30-day retention)
9. Collect metrics

**Bare Label Mapping Example:**

```json
{
  "bug": "type:bug",
  "feature": "type:feature",
  "urgent": "priority:critical",
  "ci": "area:ci"
}
```

**Helps prevent:** Inconsistent label application and human error in manual labeling

---

### 9. scheduled-audit-report (Scheduled — Saturday 09:00 UTC)

**Trigger:** Cron schedule `0 9 * * 6` (Saturdays)

**Purpose:** Generate label usage audit report

**Steps:**

1. Checkout code
2. Setup Node.js environment
3. Install dependencies
4. Scan all issues/PRs from last 7 days
5. Aggregate label usage statistics
6. Generate audit report (JSON/Markdown)
7. Upload report artifact (30-day retention)
8. Collect metrics

**Report Contents:**

- Total labels applied
- Most-used labels
- Least-used labels
- Orphaned labels (in use but not in canonical set)
- Missing type/priority/area labels

---

### 10. labeling-summary (Final Status)

**Trigger:** Always (runs after all other jobs)

**Purpose:** Summarize workflow execution and report status

**Steps:**

1. Check status of all previous jobs
2. Log summary of results
3. Fail if any critical job failed

**Output:** Summary comment on PR (if applicable)

---

## Label Taxonomy Reference

### Type Labels

Define the nature/category of the item

| Label | Usage | Applies To |
|---|---|---|
| `type:bug` | Bug report or defect | Issues, PRs |
| `type:feature` | New feature request | Issues, PRs |
| `type:task` | General task or work item | Issues |
| `type:documentation` | Documentation only | Issues, PRs, Discussions |
| `type:security` | Security issue or fix | Issues, PRs |
| `type:design` | Design-related work | Issues, PRs |

### Status Labels

Indicate current state/progress

| Label | Usage |
|---|---|
| `status:needs-triage` | Awaiting initial review |
| `status:ready` | Groomed and ready to start |
| `status:in-progress` | Work actively underway |
| `status:blocked` | Blocked by dependency |
| `status:needs-review` | Awaiting code review |
| `status:done` | Completed |

### Priority Labels

Indicate urgency/importance

| Label | Usage |
|---|---|
| `priority:critical` | Must fix immediately |
| `priority:high` | High urgency |
| `priority:normal` | Normal priority |
| `priority:low` | Low priority / nice-to-have |

### Area Labels

Indicate code area or component

| Label | Usage |
|---|---|
| `area:ci` | CI/CD, GitHub Actions |
| `area:docs` | Documentation |
| `area:backend` | Backend code |
| `area:frontend` | Frontend/UI code |

### Meta Labels

Special metadata labels

| Label | Usage |
|---|---|
| `meta:skip-labeling` | Skip all labeling for this item |
| `meta:blocked` | Item is blocking something else |
| `meta:duplicate` | Duplicate of another issue |
| `meta:needs-changelog` | Requires CHANGELOG entry |

---

## Workflow Configuration

### Inputs (via workflow_dispatch)

When manually triggering, the following inputs are available:

| Input | Type | Default | Description |
|---|---|---|---|
| `dry_run` | boolean | true | Run without writing labels; show preview only |
| `scope` | choice | all | Limit to specific labeling scope (all/pr-only/issue-only/governance-only) |

**Example:**

```bash
gh workflow run labeling-unified.yml \
  -f dry_run=false \
  -f scope=pr-only
```

### Environment Variables

| Variable | Value | Purpose |
|---|---|---|
| `LABELS_CONFIG` | `.github/labels.yml` | Canonical label definitions |
| `ISSUE_TYPES_CONFIG` | `.github/issue-types.yml` | Issue type definitions |
| `LABELER_RULES` | `.github/labeler.yml` | File-based label rules |

### Concurrency

- **Group:** `labeling-{event_name}-{issue_number_or_run_id}`
- **Cancel in Progress:** false (allows multiple labeling runs to complete)

---

## Troubleshooting Guide

### Issue: Labels not applied

**Symptoms:** PR/issue created but no labels applied despite matching rules

**Root Causes:**

1. Label does not exist in `.github/labels.yml` → Check canonical set and verify prefix
2. Label application skipped due to `meta:skip-labeling` → Remove skip label
3. Labeling agent failed silently → Check workflow run logs for errors

**Resolution:**

1. Verify label exists in `.github/labels.yml`
2. Remove `meta:skip-labeling` label if present
3. Check workflow run logs: Actions > labeling-unified > Logs
4. Manually apply label: `gh issue edit --add-label {label} {issue_number}`

---

### Issue: Duplicate labels applied

**Symptoms:** Same label applied multiple times to same item

**Root Causes:**

1. Multiple jobs applying same label without deduplication
2. Label sync job re-applying labels unnecessarily
3. Custom agent and file-based labeler both applying same label

**Resolution:**

1. File issues with root cause analysis in `.github/specs/011-workflow-consolidation-phase-2/`
2. Temporary fix: Add `meta:skip-labeling` to prevent re-labeling
3. Permanent fix: Update labeling rules to deduplicate

---

### Issue: Governance check failures

**Symptoms:** Governance check reports violations; PR comments posted

**Root Causes:**

1. Applied label not in `.github/labels.yml`
2. Applied label missing required prefix (e.g., bare `bug` instead of `type:bug`)
3. Deprecated label was applied

**Resolution:**

1. Check workflow logs for specific violations
2. Review PR comments posted by governance-check job
3. Remove violating labels: `gh issue edit --remove-label {label} {issue_number}`
4. Add correct prefixed labels: `gh issue edit --add-label {label} {issue_number}`

---

### Issue: Scheduled jobs not running

**Symptoms:** Scheduled jobs skip or don't execute at expected times

**Root Causes:**

1. Workflow file syntax error prevents parsing
2. Cron schedule disabled or branch not configured
3. GitHub Actions runner issues

**Resolution:**

1. Check workflow syntax: `gh workflow view labeling-unified`
2. Verify cron schedule is correct (UTC times)
3. Check GitHub Actions status page
4. Manually trigger: `gh workflow run labeling-unified.yml`

---

### Issue: High GitHub Actions minute usage

**Symptoms:** Workflow consuming more minutes than expected

**Root Causes:**

1. Duplicate or parallel labeling operations
2. Label sync or remediation scanning all items (not filtered)
3. Report generation scanning large time windows

**Resolution:**

1. Review metrics from `collect-metrics` action output
2. Check if scheduled jobs are running in parallel (should be sequential)
3. Optimize filters: reduce `updated_within_days` window for catch-up jobs
4. Consider disabling low-value jobs (e.g., audit report if rarely used)

---

## Performance Characteristics

### Expected Runtimes

| Job | Est. Duration | Min Usage |
|---|---|---|
| pr-labeling | 30-60s | 0.01 |
| issue-labeling | 30-60s | 0.01 |
| governance-check | 20-30s | 0.01 |
| blocking-status | 15-20s | 0.005 |
| scheduled-issue-catch-up | 120-180s | 0.05 |
| scheduled-pr-catch-up | 120-180s | 0.05 |
| scheduled-label-sync | 60-90s | 0.02 |
| scheduled-remediate-bare | 90-120s | 0.03 |
| scheduled-audit-report | 120-180s | 0.05 |

**Total Monthly Budget:** ≤315 min/month (30% reduction from 450 min baseline)

---

## Metrics Reporting

All jobs integrate the `collect-metrics` composite action to report:

- **Workflow name:** labeling-unified
- **Run ID:** GitHub Actions run ID
- **Metric type:** all (minutes_used, duration_seconds, job_count)
- **Output format:** JSON
- **Storage:** Metrics artifact (30-day retention)

**Metrics JSON Structure:**

```json
{
  "workflow_name": "labeling-unified",
  "workflow_run_id": "1234567890",
  "minutes_used": 0.15,
  "duration_seconds": 45,
  "job_count": 2,
  "timestamp": "2026-09-17T12:30:00Z"
}
```

---

## Maintenance & Updates

### Adding New Labels

1. Update `.github/labels.yml` with new label definition
2. Workflow automatically syncs on next run (04:00 UTC or manual trigger)
3. Document label in Label Taxonomy Reference section above

### Modifying Label Rules

1. Update `.github/labeler.yml` for file-based rules
2. Update `scripts/agents/labeling.agent.js` for custom logic
3. Test by manually triggering workflow with `dry_run: true`
4. Deploy with confidence in CI validation ≥3 consecutive runs

### Disabling/Enabling Jobs

1. Edit `.github/workflows/labeling-unified.yml`
2. Add/remove job from `needs:` in summary job
3. Add/remove `if:` condition on job
4. Test thoroughly; commit and push

---

## References

- **Specification:** `.github/specs/011-workflow-consolidation-phase-2/`
- **Analysis:** `.github/specs/011-workflow-consolidation-phase-2/labeling-analysis.md`
- **Labels:** `.github/labels.yml` (canonical label definitions)
- **Label Rules:** `.github/labeler.yml` (file-based labeling)
- **Composite Actions:**
  - `apply-labels` — Apply labels to PR/issue
  - `collect-metrics` — Collect GitHub Actions minutes
  - `validate-check` — Report validation results
