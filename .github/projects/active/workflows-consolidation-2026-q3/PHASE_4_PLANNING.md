---
name: Phase 4 Planning
title: Phase 4 — Issue Lifecycle & Deprecated Workflow Cleanup
description: Concrete execution plan for Phase 4 consolidations, taking the workflow count from 33 (post-Phase 3.3) to the original target of 25.
metadata:
  created: 2026-07-29
  updated: 2026-07-29
  phase: 4
  status: in-progress
  epic: "#1227"
  blockers: "Phase 3.3 must complete before Phase 4.1 can run"
---

# Phase 4: Issue Lifecycle & Deprecated Workflow Cleanup

**Status:** 🔄 IN PROGRESS (Phase 4.1 ✅ Complete) | **Goal:** 33 → 25 workflows (−8)

> **Revised 2026-07-29:** PR #1377 (issue triage automation) added `issue-create-enhanced.yml` and `issue-remediation-bulk.yml`, bringing the pre-Phase-4 total to 36. After Phase 3.3 removes 3 legacy labeling workflows, Phase 4 starts at 33 and must remove 8 (not 6) to reach 25. Sub-phases 4.5 and 4.6 address the two new additions.

---

## Executive Summary

Phase 4 reaches the original target of 25 workflows by completing two categories of work:

1. **Cleanup** — delete workflows that are already deprecated or fully superseded
2. **Consolidation** — merge overlapping issue-lifecycle and project-sync workflows added during Q3

| Sub-phase | Title | Type | Net Δ | Effort | Issue | Status |
|-----------|-------|------|-------|--------|-------|--------|
| 4.1 | Delete deprecated workflows | Cleanup | −2 | 1h | [#1406](https://github.com/lightspeedwp/.github/issues/1406) | ✅ Complete |
| 4.2 | Issue-close governance | Consolidation | −2 | 4-5h | [#1407](https://github.com/lightspeedwp/.github/issues/1407) | 📋 Pending |
| 4.3 | Project sync unification | Consolidation | −1 | 3-4h | [#1408](https://github.com/lightspeedwp/.github/issues/1408) | 📋 Pending |
| 4.4 | Flaky test absorption | Consolidation | −1 | 1-2h | [#1409](https://github.com/lightspeedwp/.github/issues/1409) | 📋 Pending |
| 4.5 | Delete superseded issue-create workflow | Cleanup | −1 | 0.5h | [#1410](https://github.com/lightspeedwp/.github/issues/1410) | 📋 Pending |
| 4.6 | Consolidate issue audit + remediation | Consolidation | −1 | 3-4h | [#1411](https://github.com/lightspeedwp/.github/issues/1411) | 📋 Pending |
| **Total** | | | **−8** | **13-16h** | | |

---

## Pre-Phase State

After Phase 3.3 removes the 3 legacy labeling workflows, the inventory will be:

```
33 workflows total  (36 current − 3 deleted in Phase 3.3)
```

> PR #1377 added `issue-create-enhanced.yml` (306 lines) and `issue-remediation-bulk.yml` (260 lines) after the original Phase 4 plan was drafted. These are assessed in sub-phases 4.5 and 4.6.

| Workflow | Lines | Keep? | Notes |
|----------|-------|-------|-------|
| actions-minute-savings-watch.yml | — | ✅ Keep | No overlap |
| awesome-github-site.yml | — | ✅ Keep | No overlap |
| changelog-management.yml | — | ✅ Keep | Phase 1B result |
| checklist-finalisation.yml | 222 | ⚠️ Phase 4.2 | Merge → issue-compliance.yml |
| checks.yml | — | ✅ Keep + expand | Absorbs flaky-test-detection |
| cleanup-branches.yml | — | ✅ Keep | No overlap |
| docs-maintenance.yml | — | ✅ Keep | Phase 2 result |
| docs-validation.yml | — | ✅ Keep | Phase 2 result |
| documentation.yml | — | ✅ Keep | No overlap |
| flaky-test-detection.yml | 42 | ⚠️ Phase 4.4 | Absorb into checks.yml |
| issue-close-label-hygiene.yml | — | ❌ Deleted in 3.3 | — |
| issue-create-enhanced.yml | 306 | ✅ Keep | Added PR #1377; replaces issue-create-from-template.yml |
| issue-create-from-template.yml | — | ⚠️ Phase 4.5 | Superseded by issue-create-enhanced.yml → delete |
| issue-fields-backfill.yml | 342 | ⚠️ Phase 4.3 | Merge → project-field-sync.yml |
| issue-health-audit.yml | 267 | ⚠️ Phase 4.6 | Merge with issue-remediation-bulk.yml → issue-audit-remediation.yml |
| issue-project-field-sync.yml | 386 | ⚠️ Phase 4.3 | Merge → project-field-sync.yml |
| issue-remediation-bulk.yml | 260 | ⚠️ Phase 4.6 | Merge with issue-health-audit.yml → issue-audit-remediation.yml |
| issues.yml | — | ✅ Keep | No overlap |
| labeling-governance.yml | 232 | ✅ Keep | Phase 3.1 result |
| labeling.yml | — | ❌ Deleted in 3.3 | — |
| main-branch-guard.yml | — | ✅ Keep | No overlap |
| meta.yml | — | ✅ Keep | No overlap |
| metadata-governance.yml | — | ✅ Keep | Extended 2026-07-29 |
| metrics-pipeline.yml | 308 | ⚠️ Phase 4.1 | Superseded by metrics-reporting.yml |
| metrics-reporting.yml | 236 | ✅ Keep | Phase 1B result; replaces pipeline |
| planner.yml | — | ✅ Keep | No overlap |
| project-archival.yml | — | ✅ Keep | Different scope from project-meta-sync |
| project-meta-sync.yml | — | ✅ Keep | Distinct from project-field-sync |
| release.yml | — | ✅ Keep | No overlap |
| reporting.yml | — | ✅ Keep | No overlap |
| reviewer.yml | — | ✅ Keep | No overlap |
| dependabot-security-label.yml | — | ❌ Deleted in 3.3 | — |
| template-enforcement.yml | 388 | ⚠️ Phase 4.2 | Absorb into issue-compliance.yml |
| validate-issue-dod-before-close.yml | 113 | ⚠️ Phase 4.2 | Merge → issue-compliance.yml |
| validate-mermaid-pr.yml | — | ⚠️ Phase 4.1 | Already disabled/deprecated |
| validate-pr-template.yml | 102 | ✅ Keep | `pull_request_target` trust boundary; keep standalone |

---

## Phase 4.1 — Delete Deprecated Workflows

**Effort:** 1 hour | **Net:** −2 (31 → 29)

Both workflows are safe to remove with zero re-implementation work.

### 4.1.a: Delete `validate-mermaid-pr.yml`

**Reason:** Already deprecated and disabled. Comments in the file state it was consolidated into `docs-validation.yml` during Phase 2.3. The workflow's `on:` block references an empty `workflows: []` array, so it never runs.

**Steps:**

1. `git rm .github/workflows/validate-mermaid-pr.yml`
2. Verify `docs-validation.yml` covers all Mermaid diagram PR checks
3. Commit: `refactor(ci): delete deprecated validate-mermaid-pr.yml (consolidated in Phase 2)`

### 4.1.b: Delete `metrics-pipeline.yml`

**Reason:** `metrics-reporting.yml` (308 lines, Phase 1B consolidation result) supersedes `metrics-pipeline.yml` (236 lines). Both run on `schedule: cron: "0 6 * * 1"` (Monday 6 AM), duplicating execution.

**Verification before deletion:**

- [x] Confirm `metrics-reporting.yml` covers all jobs from `metrics-pipeline.yml`
- [x] Run `metrics-reporting.yml` manually (`workflow_dispatch`) and verify output
- [x] Check CHANGELOG.md or Phase 1B docs for confirmation of supersession

**Steps:**

1. `git rm .github/workflows/metrics-pipeline.yml`
2. Commit: `refactor(ci): delete metrics-pipeline.yml (superseded by metrics-reporting.yml, Phase 1B)`
3. Monitor next Monday's 6 AM run to confirm metrics-reporting.yml fires correctly

**Risk:** Low — metrics-reporting.yml already co-exists and runs on the same schedule.

---

## Phase 4.2 — Issue-Close Governance Consolidation

**Effort:** 4-5 hours | **Net:** −2 (29 → 27)

Three workflows share the `issues: [closed]` trigger and all deal with issue compliance. Consolidating them eliminates duplicate GitHub API calls, reduces scheduling overhead, and creates a single authoritative location for issue closure behaviour.

### Current workflows

| Workflow | Triggers | Behaviour |
|----------|----------|-----------|
| `template-enforcement.yml` (388 lines) | `issues: [opened, edited, reopened, closed]`, `push: [develop]` | Validates issue template completeness, applies compliance labels |
| `checklist-finalisation.yml` (222 lines) | `issues: [closed]`, `pull_request_target: [closed]` | Marks checklist items, updates project fields on close |
| `validate-issue-dod-before-close.yml` (113 lines) | `issues: [closed]` | Validates DoD checkboxes are checked before allowing close |

### Consolidation design

**New workflow:** `.github/workflows/issue-compliance.yml`

```yaml
on:
  issues:
    types: [opened, edited, reopened, closed]
  pull_request_target:
    types: [closed]
  push:
    branches: [develop]

jobs:
  enforce-template:        # From template-enforcement.yml (all events except closed)
  validate-dod-on-close:  # From validate-issue-dod-before-close.yml (closed only)
  finalise-checklists:    # From checklist-finalisation.yml (closed only)
```

**Conditional guards:**

- `enforce-template`: `if: github.event.action != 'closed' || github.event_name == 'push'`
- `validate-dod-on-close`: `if: github.event.action == 'closed' && github.event_name == 'issues'`
- `finalise-checklists`: `if: github.event.action == 'closed'`

**Steps:**

1. Create `.github/workflows/issue-compliance.yml` from template above
2. Copy and adapt jobs from all three source files (preserve all logic, no behaviour change)
3. Test with:
   - [ ] Open new issue → `enforce-template` fires
   - [ ] Close issue with incomplete DoD → `validate-dod-on-close` blocks/warns
   - [ ] Close PR → `finalise-checklists` fires
   - [ ] Push to develop → template validation step fires
4. Disable old workflows with `if: false` on all jobs; monitor 24h
5. Delete `template-enforcement.yml`, `checklist-finalisation.yml`, `validate-issue-dod-before-close.yml`
6. Commit: `refactor(ci): consolidate issue compliance workflows into issue-compliance.yml (#phase-4.2)`

**Risk:** Medium — these workflows touch issue labeling and project fields. The 24-hour disable-before-delete window is mandatory.

**DoD / close-loop safety:** `issue-compliance.yml` and `issue-health-audit.yml` do not create a close/reopen loop. `issue-health-audit.yml` runs on a weekly schedule and only reopens closed issues when unchecked DoD items are detected; it does not react to `labeled`/`unlabeled` events on closed issues in a way that retriggers the compliance workflow.

---

## Phase 4.3 — Project Sync Unification

**Effort:** 3-4 hours | **Net:** −1 (27 → 26)

`issue-fields-backfill.yml` (342 lines) and `issue-project-field-sync.yml` (386 lines) were both added on 2026-07-29. They share the same underlying GraphQL operations and secrets but serve different use cases:

| | `issue-fields-backfill.yml` | `issue-project-field-sync.yml` |
|---|---|---|
| **Mode** | Bulk — all open issues | Targeted — specific issues or labels |
| **Trigger** | `workflow_dispatch` | `workflow_dispatch` |
| **Scope** | Native types + project fields | Project fields only |
| **Config** | `LS_APP_CLIENT_ID` / `LS_APP_PRIVATE_KEY` | `GH_PROJECT_TOKEN` (PAT) |

> ⚠️ **Note:** The two workflows use different auth mechanisms (GitHub App token vs PAT). Unification requires standardising on the App token approach before merging.

### Consolidation design

**New workflow:** `.github/workflows/project-field-sync.yml`

```yaml
on:
  workflow_dispatch:
    inputs:
      mode:
        description: "Sync mode"
        type: choice
        options:
          - bulk          # All open issues (from backfill)
          - targeted      # Specific issue list or label filter (from sync)
      sync_native_types:
        description: "Set GitHub native issue types"
        type: choice
        default: "true"
      sync_project_fields:
        description: "Sync project board fields"
        type: choice
        default: "true"
      issue_filter:
        description: "Label or issue numbers to target (targeted mode only)"
      dry_run:
        description: "Dry run (no changes)"
        default: "false"
```

**Prerequisites:**

- [ ] Migrate `issue-project-field-sync.yml` from PAT (`GH_PROJECT_TOKEN`) to GitHub App token (`LS_APP_CLIENT_ID` + `LS_APP_PRIVATE_KEY`) — aligns with `issue-fields-backfill.yml` and `metadata-governance.yml`
- [ ] Confirm both workflows' scripts can be combined or called from a shared entrypoint
- [ ] Update `scripts/agents/includes/sync-issue-fields.cjs` to accept a mode parameter

**Steps:**

1. Standardise auth to GitHub App token in `issue-project-field-sync.yml`
2. Create `project-field-sync.yml` with the unified interface above
3. Test both modes (`bulk` and `targeted`) in dry-run mode
4. Disable old workflows; monitor 24h
5. Delete `issue-fields-backfill.yml` and `issue-project-field-sync.yml`
6. Commit: `refactor(ci): unify project field sync workflows (#phase-4.3)`

**Risk:** Medium — the auth migration adds complexity. The dry-run mode allows safe validation before production runs.

---

## Phase 4.4 — Flaky Test Absorption

**Effort:** 1-2 hours | **Net:** −1 (26 → 25) ✅ Target reached

`flaky-test-detection.yml` is 42 lines and runs every 12 hours Mon-Fri. It is a simple wrapper around the Jest test suite that detects non-deterministic tests by running them multiple times.

### Assessment

The workflow is small enough that its logic fits cleanly as a conditional job in `checks.yml`:

```yaml
# Add to checks.yml
flaky-detection:
  name: Flaky Test Detection
  if: github.event_name == 'schedule'
  runs-on: ubuntu-latest
  strategy:
    matrix:
      run_number: [1, 2, 3]
  steps:
    # ... (verbatim from flaky-test-detection.yml)
```

**Alternative:** Keep `flaky-test-detection.yml` standalone if `checks.yml` is already complex. Acceptable — the -1 target can be met in Phase 4.4 via either path.

**Decision criteria:** If `checks.yml` exceeds 400 lines after absorption, keep standalone. Document decision here.

**Steps:**

1. Review `checks.yml` current size
2. If ≤350 lines: add `flaky-detection` job with `if: github.event_name == 'schedule'` guard
3. Add the `schedule: cron: "0 */12 * * 1-5"` trigger to `checks.yml`
4. Disable `flaky-test-detection.yml`; monitor one full schedule cycle (12h)
5. Delete `flaky-test-detection.yml`
6. Commit: `refactor(ci): absorb flaky-test-detection into checks.yml (#phase-4.4)`

**Risk:** Low — small workflow, straightforward absorption.

---

## Phase 4.5 — Delete Superseded Issue-Create Workflow

**Effort:** 0.5 hours | **Net:** −1 (27 → 26) | **Issue:** [#1410](https://github.com/lightspeedwp/.github/issues/1410)

`issue-create-enhanced.yml` (added in PR #1377) supersedes `issue-create-from-template.yml`. Both accept the same `template_key` choice list and perform the same core function. `issue-create-enhanced.yml` adds additional inputs and improved template resolution logic.

**Steps:**

1. Cross-check input parity: confirm all `issue-create-from-template.yml` inputs are present or intentionally superseded in `issue-create-enhanced.yml`
2. Search for references to the old workflow name in agents, prompts, instructions, and docs
3. Update any references to `issue-create-enhanced`
4. `git rm .github/workflows/issue-create-from-template.yml`
5. Commit: `chore(ci): delete issue-create-from-template.yml (superseded by issue-create-enhanced.yml, #1377)`

**Risk:** Low — the enhanced version is the direct replacement; no behaviour change.

---

## Phase 4.6 — Consolidate Issue Audit & Remediation

**Effort:** 3-4 hours | **Net:** −1 (26 → 25) ✅ Target reached | **Issue:** [#1411](https://github.com/lightspeedwp/.github/issues/1411)

`issue-health-audit.yml` (267 lines, PR #1399) and `issue-remediation-bulk.yml` (260 lines, PR #1377) both apply missing `type:`/`priority:` labels to open issues. Running independently risks redundant API calls if both fire close together.

### Consolidation design

**New workflow:** `.github/workflows/issue-audit-remediation.yml`

```yaml
on:
  schedule:
    - cron: "0 8 * * 1"  # Weekly Monday (from health-audit)
  workflow_dispatch:
    inputs:
      mode:
        description: 'Operation mode'
        type: choice
        options: [audit, remediate, full]
      days:
        description: 'Scope: issues from last N days (remediate mode)'
      dry_run:
        default: 'true'

jobs:
  audit:      # From issue-health-audit.yml — reopen closed issues with unchecked DoD
    if: inputs.mode == 'audit' || inputs.mode == 'full' || github.event_name == 'schedule'
  remediate:  # From issue-remediation-bulk.yml — fix labels/milestones/templates
    if: inputs.mode == 'remediate' || inputs.mode == 'full'
```

**Interaction chain:** When `issue-audit-remediation.yml` applies a `type:` label, `metadata-governance.yml` fires on the `labeled` event and syncs the native issue type. This is the expected behaviour — no conflict.

**Steps:**

1. Create `issue-audit-remediation.yml` from the design above
2. Validate `audit` mode with dry-run on a test repo
3. Validate `remediate` mode with dry-run (scope: last 3 days)
4. Disable old workflows; monitor one full weekly cycle
5. Delete `issue-health-audit.yml` and `issue-remediation-bulk.yml`
6. Commit: `refactor(ci): consolidate issue audit + remediation into issue-audit-remediation.yml (#phase-4.6)`

**Risk:** Medium — both source workflows are recent (added 2026-07-29). Allow at least one live production run of each before consolidation.

---

After all Phase 4 sub-phases complete:

| # | Workflow | Category |
|---|----------|----------|
| 1 | `actions-minute-savings-watch.yml` | Monitoring |
| 2 | `awesome-github-site.yml` | Site |
| 3 | `changelog-management.yml` | Release |
| 4 | `checks.yml` | CI (+ flaky detection) |
| 5 | `cleanup-branches.yml` | Maintenance |
| 6 | `docs-maintenance.yml` | Docs |
| 7 | `docs-validation.yml` | Docs |
| 8 | `documentation.yml` | Docs |
| 9 | `issue-audit-remediation.yml` | Issue governance (**new** in 4.6) |
| 10 | `issue-compliance.yml` | Issue governance (**new** in 4.2) |
| 11 | `issue-create-enhanced.yml` | Issue governance |
| 12 | `issues.yml` | Issue governance |
| 13 | `labeling-governance.yml` | Labels |
| 14 | `main-branch-guard.yml` | Branch protection |
| 15 | `meta.yml` | Metadata |
| 16 | `metadata-governance.yml` | Metadata |
| 17 | `metrics-reporting.yml` | Metrics |
| 18 | `planner.yml` | Planning |
| 19 | `project-archival.yml` | Projects |
| 20 | `project-field-sync.yml` | Projects (**new** in 4.3) |
| 21 | `project-meta-sync.yml` | Projects |
| 22 | `release.yml` | Release |
| 23 | `reporting.yml` | Reporting |
| 24 | `reviewer.yml` | Review |
| 25 | `validate-pr-template.yml` | PR governance |
| 17 | `metrics-reporting.yml` | Metrics |
| 18 | `planner.yml` | Planning |
| 19 | `project-archival.yml` | Projects |
| 20 | `project-field-sync.yml` | Projects (**new**) |
| 21 | `project-meta-sync.yml` | Projects |
| 22 | `release.yml` | Release |
| 23 | `reporting.yml` | Reporting |
| 24 | `reviewer.yml` | Review |
| 25 | `validate-pr-template.yml` | PR governance |

> `validate-pr-template.yml` is kept standalone due to its `pull_request_target` trust boundary — merging it into `issue-compliance.yml` (which runs issue events) would conflate trust levels.

---

## Dependency Graph

```
Phase 3.3 (delete legacy labeling)
    └─► Phase 4.1 (delete deprecated — no code dependency, can start in parallel)
    └► Phase 4.5 (delete superseded issue-create — independent, can start immediately)
Phase 4.1
    └► Phase 4.2 (issue-compliance consolidation)
        └► Phase 4.3 (project sync — independent, can run in parallel with 4.2)
Phase 4.2 + 4.3
    └► Phase 4.4 (flaky test — independent)
Phase 4.5 (independent of all above)
Phase 4.6 (independent — wait for both source workflows to have 1+ production run)
```

Phases 4.1, 4.2, 4.3, 4.4, 4.5, and 4.6 are mutually independent from a code perspective. The only prerequisite is Phase 3.3 completing.

---

## Success Criteria

| Metric | Target | How to verify |
|--------|--------|---------------|
| Workflow count | 25 | `ls .github/workflows/*.yml \| wc -l` |
| No duplicate `issues: [closed]` triggers | 0 duplicates | `grep -l "types: \[closed\]" .github/workflows/*.yml` |
| No disabled/deprecated workflows remaining | 0 | Manual audit |
| Monday 6 AM metrics run | 1 run (not 2) | Check Actions run history |
| All existing behaviour preserved | No regressions | Integration tests per phase |

---

## GitHub Issues

| Issue | Title | Template | Effort |
|-------|-------|----------|--------|
| [#1406](https://github.com/lightspeedwp/.github/issues/1406) | Phase 4.1: Delete deprecated workflows | Chore | 1h |
| [#1407](https://github.com/lightspeedwp/.github/issues/1407) | Phase 4.2: Consolidate issue-close governance | Code Refactor | 4-5h |
| [#1408](https://github.com/lightspeedwp/.github/issues/1408) | Phase 4.3: Unify project field sync | Code Refactor | 3-4h |
| [#1409](https://github.com/lightspeedwp/.github/issues/1409) | Phase 4.4: Absorb flaky-test-detection | Code Refactor | 1-2h |
| [#1410](https://github.com/lightspeedwp/.github/issues/1410) | Phase 4.5: Delete superseded issue-create-from-template.yml | Chore | 0.5h |
| [#1411](https://github.com/lightspeedwp/.github/issues/1411) | Phase 4.6: Consolidate issue audit + remediation | Code Refactor | 3-4h |

---

## Related Documents

- [README.md](./README.md) — Project overview and phase status dashboard
- [PHASE_3_STATUS.md](./PHASE_3_STATUS.md) — Phase 3 status (must complete 3.3 before Phase 4)
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) — Executive overview
- [PHASE_3_CONTINUATION_PROMPT.md](./PHASE_3_CONTINUATION_PROMPT.md) — Context for resuming Phase 3

---

**Project Owner:** Ash Shaw
**Last Updated:** 2026-07-29
