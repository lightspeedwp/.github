---
title: "Phase 3 Analysis — Archived Labeling Workflows"
date_created: "2026-09-17"
last_updated: "2026-09-17"
feature: "Workflow Consolidation Phase 2 — US1 labeling-unified.yml"
---

# Archived Labeling Workflows Analysis (US1)

## Overview

This analysis examines the 11 archived labeling workflows that will be consolidated into **labeling-unified.yml**. The analysis identifies trigger patterns, job structures, composite action opportunities, and dependencies to inform unified workflow design.

---

## Archived Workflow Inventory

### 1. **labeling.yml** — Main Labeling Engine

- **Status:** Core labeling workflow
- **Triggers:**
  - `push` → `develop` branch
  - `pull_request` → `develop` with types: opened, edited, synchronize, reopened, ready_for_review, labeled, unlabeled
  - `issues` → types: opened, edited, reopened, labeled, unlabeled, transferred
  - `discussion` → types: created, edited, answered, labeled, unlabeled
  - `workflow_dispatch` → dry_run, report_commit inputs
- **Jobs:** Single unified labeling job
- **Key Steps:**
  - Sync labels with canonical `.github/labels.yml`
  - Check template labels (guardrail)
  - Apply file/branch-based labels via `actions/labeler`
  - Run labeling agent (`labeling.agent.js`)
  - Generate and upload report artifact
- **Dependencies:**
  - `.github/labels.yml` (canonical label definitions)
  - `.github/issue-types.yml` (issue type definitions)
  - `.github/labeler.yml` (labeler rules)
  - `scripts/agents/labeling.agent.js` (main labeling logic)
- **Permissions:** contents:read, issues:write, pull-requests:write, discussions:write
- **Concurrency:** `labeling-{event_name}-{issue_number_or_run_id}`, cancel-in-progress: false

**Consolidation Priority:** HIGH — Core workflow, contains main labeling agent logic

---

### 2. **issue-labeling-automation.yml** — Issue-Only Labeling

- **Status:** Scheduled + manual issue labeling
- **Triggers:**
  - `schedule` → Daily at 02:00 UTC (cron: "0 2 ** *")
  - `workflow_dispatch` → dry_run, updated_within_days, label_types, batch_size inputs
- **Jobs:** Single `label-issues` job
- **Key Steps:**
  - Fetch issues updated in last N days (via GitHub API)
  - Filter issues without type labels
  - Apply labels via `scripts/workflows/apply-labels-workflow.js`
  - Generate labeling report
- **Dependencies:**
  - GitHub API (REST)
  - `.github/labels.yml` (canonical labels)
  - `scripts/workflows/apply-labels-workflow.js` (label application logic)
- **Permissions:** issues:write, contents:read
- **Key Parameters:**
  - `updated_within_days` (default: 7) — time window for issue filtering
  - `label_types` (default: all) — type/area/priority
  - `batch_size` (default: 50) — processing batch size
  - `dry_run` (default: true) — preview mode

**Consolidation Priority:** HIGH — Scheduled labeling for catch-up; consolidate with job scheduling

---

### 3. **batch-label-prs.yml** — PR Batch Labeling

- **Status:** Scheduled PR labeling
- **Triggers:**
  - `schedule` → Daily at 03:00 UTC (cron: "0 3 ** *")
  - `workflow_dispatch` → dry_run input
- **Jobs:** Single batch labeling job
- **Key Steps:** Similar to issue-labeling-automation but for PRs
- **Dependencies:** `.github/labels.yml`, labeling scripts
- **Permissions:** pull-requests:write, contents:read

**Consolidation Priority:** MEDIUM — Batch PR labeling; can merge with issue labeling under shared schedule

---

### 4. **meta-labels-sync.yml** — Meta Label Synchronization

- **Status:** Scheduled label sync
- **Triggers:**
  - `schedule` → Daily at 04:00 UTC (cron: "0 4 ** *")
  - `workflow_dispatch` → no inputs
- **Jobs:** Single sync job
- **Key Steps:**
  - Sync meta labels (status:*, meta:*, etc.) across repo
  - Compare current labels vs canonical `.github/labels.yml`
  - Apply corrections
- **Dependencies:** `.github/labels.yml`, GitHub API
- **Permissions:** issues:write, pull-requests:write

**Consolidation Priority:** MEDIUM — Can consolidate with scheduled cleanup job

---

### 5. **remediate-bare-labels.yml** — Bare Label Remediation

- **Status:** Scheduled remediation (Phase 2 enhancement)
- **Triggers:**
  - `schedule` → Weekly (Monday 08:00 UTC, cron: "0 8 ** 1")
  - `workflow_dispatch` → dry_run input
- **Jobs:** Single remediation job
- **Key Steps:**
  - Load bare label mapping from `.github/reports/label-remediation/bare-label-mapping.json`
  - Scan PRs/issues for bare labels (without prefix)
  - Replace bare labels with prefixed versions (e.g., `bug` → `type:bug`)
  - Generate report
- **Dependencies:**
  - `.github/reports/label-remediation/bare-label-mapping.json` (bare label mapping)
  - GitHub API
- **Permissions:** issues:write, pull-requests:write

**Consolidation Priority:** LOW-MEDIUM — Cleanup task; consolidate with label sync

---

### 6. **labeling-governance.yml** — Label Governance

- **Status:** Policy enforcement
- **Triggers:**
  - `pull_request` → opened, edited, synchronize, reopened
  - `issues` → opened, edited, reopened
  - `workflow_dispatch`
- **Jobs:** Governance enforcement job
- **Key Steps:**
  - Validate label naming conventions
  - Check for deprecated labels
  - Enforce prefix requirements (type:, status:, area:, etc.)
  - Post PR comments if violations found
- **Dependencies:** `.github/labels.yml`, governance rules
- **Permissions:** issues:write, pull-requests:write

**Consolidation Priority:** MEDIUM — Governance checks; integrate with validation flow

---

### 7. **openspec-sync-labels.yml** — OpenSpec Label Sync

- **Status:** External sync (OpenSpec integration)
- **Triggers:**
  - `schedule` → Daily at 05:00 UTC (cron: "0 5 ** *")
  - `workflow_dispatch`
- **Jobs:** Single OpenSpec sync job
- **Key Steps:**
  - Sync labels with OpenSpec schema
  - Apply OpenSpec-specific labels (spec:*, design:*, etc.)
  - Validate schema compliance
- **Dependencies:** OpenSpec schema, `.github/labels.yml`
- **Permissions:** issues:write, pull-requests:write

**Consolidation Priority:** LOW — Specialized integration; may require separate handling or skip if OpenSpec deprecated

---

### 8. **openspec-validate-labels.yml** — OpenSpec Validation

- **Status:** OpenSpec label validation
- **Triggers:**
  - `pull_request` → opened, edited, synchronize, reopened
  - `workflow_dispatch`
- **Jobs:** Single validation job
- **Key Steps:**
  - Validate PR labels against OpenSpec schema
  - Check for required OpenSpec labels
  - Post validation comment if non-compliant
- **Dependencies:** OpenSpec schema
- **Permissions:** pull-requests:write

**Consolidation Priority:** LOW — Specialized; skip if OpenSpec deprecated

---

### 9. **manage-blocking-status-labels.yml** — Blocking Status Labels

- **Status:** Blocking label management
- **Triggers:**
  - `pull_request` → labeled, unlabeled
  - `issues` → labeled, unlabeled
  - `workflow_dispatch` → target_label, action inputs
- **Jobs:** Single blocking status job
- **Key Steps:**
  - Monitor status:blocked, status:blocked-on-review, etc.
  - Apply/remove related labels (meta:*, status:*)
  - Notify team if blocking detected
- **Dependencies:** `.github/labels.yml`, GitHub API
- **Permissions:** issues:write, pull-requests:write

**Consolidation Priority:** MEDIUM — Specialized blocking status; consolidate with main labeling

---

### 10. **validate-issue-labels.yml** — Issue Label Validation

- **Status:** Issue label validation
- **Triggers:**
  - `issues` → opened, edited, reopened
  - `workflow_dispatch` → issue_number input
- **Jobs:** Single validation job
- **Key Steps:**
  - Validate issue has required labels (type:*, priority:*, etc.)
  - Check label taxonomy compliance
  - Post comment if validation fails
- **Dependencies:** `.github/labels.yml`, validation rules
- **Permissions:** issues:write

**Consolidation Priority:** MEDIUM — Issue-specific validation; integrate with main flow

---

### 11. **label-audit-report.yml** — Label Audit Report

- **Status:** Reporting/audit
- **Triggers:**
  - `schedule` → Weekly (Saturday 09:00 UTC, cron: "0 9 ** 6")
  - `workflow_dispatch`
- **Jobs:** Single audit job
- **Key Steps:**
  - Scan all PRs/issues in last 7 days
  - Generate label usage report
  - Identify unused labels, missing labels, etc.
  - Upload audit artifact
- **Dependencies:** GitHub API, `.github/labels.yml`
- **Permissions:** contents:read, issues:read, pull-requests:read

**Consolidation Priority:** LOW — Reporting; can consolidate with metrics collection

---

## Trigger Pattern Analysis

### Event Type Coverage

| Trigger Type | Workflows | Patterns |
|---|---|---|
| `pull_request` → opened | 6 workflows | Main labeling, governance, OpenSpec validation, blocking status, issue validation |
| `pull_request` → edited | 6 workflows | Same as above |
| `pull_request` → labeled/unlabeled | 3 workflows | Main labeling, blocking status, other |
| `issues` → opened | 5 workflows | Main labeling, governance, issue validation, etc. |
| `issues` → edited | 5 workflows | Same |
| `issues` → labeled/unlabeled | 3 workflows | Main labeling, blocking status |
| `discussion` → created/edited/answered | 1 workflow | Main labeling (discussions support) |
| `schedule` → cron | 8 workflows | Catch-up labeling (02:00), batch PRs (03:00), sync (04:00), remediate (08:00 Mon), OpenSpec sync (05:00), audit (09:00 Sat) |
| `workflow_dispatch` | 9 workflows | Manual trigger support |

### Schedule Coverage

- 02:00 UTC — Issue catch-up labeling
- 03:00 UTC — PR batch labeling
- 04:00 UTC — Meta label sync
- 05:00 UTC — OpenSpec sync
- 08:00 UTC (Monday) — Bare label remediation
- 09:00 UTC (Saturday) — Label audit report

**Consolidation Opportunity:** Merge all scheduled jobs into single unified workflow with multiple scheduled triggers or distributed cronjobs

---

## Composite Action Opportunities

### Reusable Patterns Identified

1. **Label Application** (Common to labeling.yml, issue-labeling-automation.yml, batch-label-prs.yml)
   - Extracted: `apply-labels` composite action (T006, Phase 2)
   - Inputs: target_type, target_id, labels, remove_labels, dry_run
   - Output: labels_applied, labels_removed, status

2. **Label Validation** (Common to labeling-governance.yml, openspec-validate-labels.yml, validate-issue-labels.yml)
   - Can use `validate-check` composite action (T007, Phase 2)
   - Validates labels against taxonomy/rules

3. **Metrics Collection** (All workflows should report)
   - Use `collect-metrics` composite action (T009, Phase 2)
   - Track labels applied, errors, duration

### Job Structure for labeling-unified.yml

**Proposed Jobs:**

1. **Synchronized on PR/Issue events (reactive):**
   - `pr-labeling` → Pull request labeling
   - `issue-labeling` → Issue labeling
   - `governance-check` → Label governance validation
   - `blocking-status` → Blocking status label management

2. **Scheduled jobs (periodic catch-up):**
   - `scheduled-issue-catch-up` → Run on 02:00 UTC (cron)
   - `scheduled-pr-catch-up` → Run on 03:00 UTC (cron)
   - `scheduled-label-sync` → Run on 04:00 UTC (cron)
   - `scheduled-remediate-bare` → Run on Monday 08:00 UTC
   - `scheduled-openspec-sync` → Run on 05:00 UTC (conditional if OpenSpec enabled)
   - `scheduled-audit-report` → Run on Saturday 09:00 UTC

**Total Jobs in Unified:** 9-10 jobs depending on OpenSpec deprecation status

---

## Dependencies & Configuration Files

### Required Files

1. `.github/labels.yml` — Canonical label definitions (read-only, 158 labels)
2. `.github/issue-types.yml` — Issue type definitions (read-only, 24 types)
3. `.github/labeler.yml` — labeler rules for file/branch-based labeling
4. `.github/reports/label-remediation/bare-label-mapping.json` — Bare label mappings
5. OpenSpec schema (if applicable) — External dependency

### Scripts/Agents to Integrate

1. `scripts/agents/labeling.agent.js` — Main labeling logic (from labeling.yml)
2. `scripts/workflows/apply-labels-workflow.js` — Label application
3. `scripts/agents/includes/label-sync.js` — Label sync logic
4. `scripts/agents/includes/check-template-labels.js` — Template label validation
5. `scripts/agents/includes/report-writer.js` — Report generation

### Permissions Required

```yaml
permissions:
  contents: read
  issues: write
  pull-requests: write
  discussions: write
```

---

## Consolidation Strategy

### Phase 3 MVP Scope

**Consolidate:** 11 archived labeling workflows → **labeling-unified.yml**

**Scope Breakdown:**

1. **Reactive (PR/Issue event-triggered) jobs:**
   - PR labeling (from labeling.yml, batch-label-prs.yml)
   - Issue labeling (from labeling.yml, issue-labeling-automation.yml)
   - Governance checks (from labeling-governance.yml)
   - Blocking status (from manage-blocking-status-labels.yml)

2. **Scheduled (cron-triggered) jobs:**
   - Catch-up labeling (02:00, 03:00 UTC)
   - Label sync (04:00 UTC)
   - Bare label remediation (Monday 08:00 UTC)
   - Audit report (Saturday 09:00 UTC)

3. **OpenSpec jobs (conditional/skip if deprecated):**
   - OpenSpec sync (05:00 UTC)
   - OpenSpec validation (on PR events)

### Expected GitHub Actions Minutes Reduction

**Baseline:** 450 min/month (18% of total)

**Optimizations:**

1. **Consolidation:** Merge 11 workflows into 1 (eliminate 10 workflow setup overheads) → ~40 min savings
2. **Parallelization:** Run non-blocking jobs in parallel where possible → ~20 min savings
3. **Deduplication:** Eliminate duplicate label checks across workflows → ~15 min savings
4. **Conditional execution:** Skip jobs when not needed (e.g., no recent issues) → ~10 min savings

**Target:** ≤315 min/month (30% reduction) = **135 min savings**

---

## Test Coverage Requirements

### Unit Tests (≥80% line coverage)

- `apply-labels` composite action
- Label validation logic
- Bare label remediation
- Report generation

### Functional Tests (100% for critical paths)

- PR labeling: Trigger on PR open, verify labels applied correctly
- Issue labeling: Trigger on issue open, verify type/priority labels applied
- Governance checks: Verify violations detected and commented
- Blocking status: Verify blocking labels applied/removed
- Scheduled catch-up: Verify old issues relabeled on schedule
- Audit report: Verify report generated with correct statistics

---

## Consolidation Acceptance Criteria (Phase 3 Complete)

- ✅ labeling-unified.yml triggers on all 9 event types (PR opened/edited/labeled, issues opened/edited/labeled, discussions, workflow_dispatch, schedule)
- ✅ All 11 archived workflows' functionality consolidated into unified workflow
- ✅ No duplicate label application (deduplication logic verified)
- ✅ All labels applied match `.github/labels.yml` taxonomy with required prefixes
- ✅ Governance checks report violations to PR comments
- ✅ Blocking status labels correctly applied/removed
- ✅ Scheduled catch-up jobs run at correct times (02:00, 03:00, 04:00, 08:00 Mon, 09:00 Sat)
- ✅ Metrics collected and reported via `collect-metrics` composite action
- ✅ CI passes ≥3 consecutive times with no regressions vs archived workflows
- ✅ Rollback to archived workflows succeeds without data loss
- ✅ GitHub Actions minutes reduced to ≤315/month (≥30% reduction)

---

## Next Steps (Phase 3 Execution)

1. **T016:** Create skeleton labeling-unified.yml with all jobs defined
2. **T017-T019:** Implement PR, issue, and cleanup jobs in parallel [P]
3. **T020-T021:** Integrate composite actions (apply-labels, collect-metrics)
4. **T022:** Test on feature branch (trigger via PR, verify all patterns)
5. **T023:** Document behavior and troubleshooting in LABELING_UNIFIED.md
6. **T024:** Validate CI passes ≥3 consecutive runs with no regressions
