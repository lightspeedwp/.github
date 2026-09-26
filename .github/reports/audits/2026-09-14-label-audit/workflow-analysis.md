---
file_type: 'report'
category: 'audits'
title: 'Archived Labelling Workflow Analysis'
description: 'Assessment of the 11 labelling workflows archived on 2026-09-11 against labeling-unified.yml, with archival reasons, restoration feasibility, automation gaps and a restoration roadmap (spec 008 T026 to T030)'
version: '1.0'
created_date: '2026-09-24'
last_updated: '2026-09-24'
author: 'LightSpeed Team'
maintainer: 'Ash Shaw'
owners: ['lightspeedwp/maintainers']
tags: ['labels', 'workflows', 'audit', 'labeling', 'spec-008']
status: 'active'
---

# Archived Labelling Workflow Analysis

**Analysis Date**: 2026-09-24
**Scope**: the 11 workflows in `.github/workflows/archived/2026-09-11/labeling/`, compared with `.github/workflows/labeling-unified.yml`, `scripts/agents/labeling.agent.js` and the other active workflows
**Spec**: `.github/specs/008-label-audit-consolidation/` (tasks T026 to T030)
**Evidence**: `evidence/workflow-*.json`, `evidence/workflow-archival-analysis.json`, `evidence/workflow-restoration-feasibility.json`, `evidence/automation-gaps.json`

---

## Executive Summary

The 11 labelling workflows were archived in two commits dated 2026-09-12, under the 2026-09-11 archive:

- `13195c31e6` moved 9 workflows.
- `84fd6e569d` moved `manage-blocking-status-labels.yml` and `openspec-validate-labels.yml`.

The stated reason is the Workflow Consolidation Initiative (archive `README.md:14`). The README cites these problems (lines 72-77):

- duplicate implementations
- "4+ scheduled job collisions at 3am UTC"
- "PR merge blockers from overlapping checks"
- about 500 lines of duplicate labelling and validation code

The manifest (`ARCHIVED_WORKFLOWS_MANIFEST.md:43-53`) maps all 11 to `labeling-unified.yml`. No reason is recorded for any single workflow. The per-workflow reasons below are inferred from that rationale and from reading the code.

| Archival reason | Count | Workflows                                                                                                              |
| --------------- | ----- | ---------------------------------------------------------------------------------------------------------------------- |
| superseded      | 6     | batch-label-prs, issue-labeling-automation, label-audit-report, labeling, remediate-bare-labels, validate-issue-labels |
| conflicts       | 1     | labeling-governance                                                                                                    |
| performance     | 2     | manage-blocking-status-labels, meta-labels-sync                                                                        |
| obsolete        | 2     | openspec-sync-labels, openspec-validate-labels                                                                         |

Key findings:

1. **The consolidation dropped functions it said it kept.** The manifest maps all 11 files to `labeling-unified.yml`, but that workflow does only this:
   - file/branch labels on PRs
   - a triage label on new issues
   - the per-item labelling agent

   It has no logic for the following, and **14 automation gaps** remain:
   - `meta:has-pr`
   - `meta:stale`
   - `status:blocked`
   - bulk backfill
   - label audit reports
   - close-time clean-up
   - a required label check
   - Dependabot security labelling

2. **Several archived workflows had never worked.** The problems found:
   - `issue-labeling-automation.yml` calls a missing script, and its dry-run flag could never be switched off.
   - Both `openspec-*` workflows call handler modules that have no CLI entrypoint.
   - `label-sync.js` has no entrypoint either.
   - `report-writer.js` throws `ReferenceError` under ESM. This was reproduced locally.
3. **The active unified workflow has defects of its own:**
   - `dry_run` is ignored.
   - The scheduled "audit" job does nothing.
   - The template guardrail calls the wrong script, which always fails and is hidden by `continue-on-error`.
   - The agent can add several `type:*` labels in one run.
   - The agent emits three non-canonical type labels.
   - The agent deletes every non-canonical label, including its own opt-out label `meta:skip-labeling`, because `labels.yml` defines no aliases.
4. **Recommendations:**
   - Restore 2 workflows: `meta-labels-sync.yml` and `label-audit-report.yml`.
   - Rebuild 5 as jobs or modes of `labeling-unified.yml`.
   - Retire 4: `labeling.yml`, `validate-issue-labels.yml` and both `openspec-*` workflows. Spec 008 FR-011 renames `openspec:*` to `spec:*`, and FR-013 replaces OpenSpec with Spec Kit.
5. **The retention window ends tomorrow.** The archive README gives a retention period of "2 weeks (Sep 11 - Sep 25)" (`README.md:164`). The restore commands in `ARCHIVED_WORKFLOWS_MANIFEST.md:186` read from branch `refactor/workflow-consolidation-and-archiving`, which is not among the fetched remote branches. Keep the in-tree copies until the rebuilds in the roadmap below are done.

---

## Workflow Inventory

| File                                | Purpose                                        | Archival reason | Recommendation | Effort   |
| ----------------------------------- | ---------------------------------------------- | --------------- | -------------- | -------- |
| `batch-label-prs.yml`               | Manual bulk labelling of open PRs              | superseded      | rebuild        | moderate |
| `issue-labeling-automation.yml`     | Daily type/area/priority backfill on issues    | superseded      | rebuild        | moderate |
| `label-audit-report.yml`            | Monthly meta/status label audit reports        | superseded      | restore        | minimal  |
| `labeling-governance.yml`           | Combined governance and required label check   | conflicts       | rebuild        | moderate |
| `labeling.yml`                      | Original unified labelling engine              | superseded      | retire         | minimal  |
| `manage-blocking-status-labels.yml` | `status:blocked` from "Blocked by" references  | performance     | rebuild        | moderate |
| `meta-labels-sync.yml`              | `meta:has-pr` sync and `meta:stale` detection  | performance     | restore        | minimal  |
| `openspec-sync-labels.yml`          | OpenSpec phase-progression label sync          | obsolete        | retire         | minimal  |
| `openspec-validate-labels.yml`      | OpenSpec label validation and suggestion       | obsolete        | retire         | minimal  |
| `remediate-bare-labels.yml`         | Weekly bare-to-canonical label migration       | superseded      | rebuild        | moderate |
| `validate-issue-labels.yml`         | Warning comment for non-canonical issue labels | superseded      | retire         | minimal  |

Feasibility, from `evidence/workflow-restoration-feasibility.json`:

- **high:** batch-label-prs, label-audit-report, manage-blocking-status-labels, meta-labels-sync, validate-issue-labels
- **medium:** remediate-bare-labels
- **low:** issue-labeling-automation, labeling-governance, labeling, both openspec-* workflows

### Active workflows that overlap

| Active workflow                                                 | Overlap                                                                                                                                                                                                                                         |
| --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `labeling-unified.yml`                                          | Successor named in the manifest for all 11 files. It is the only active workflow that applies labels to issues.                                                                                                                                 |
| `pr-template-routing.yml`                                       | Adds PR labels from the branch name through `scripts/pr-template-router.js` (lines 222-246). This duplicates the branch-to-type logic in `labeling.agent.js:88-105`, `.github/labeler.yml` and the archived `scripts/batch-label-prs.js:24-40`. |
| `changelog-unified.yml`                                         | Reads `meta:no-changelog` (lines 81, 115), which the agent's changelog nudge depends on (`labeling.agent.js:489-515`).                                                                                                                          |
| `documentation.yml`, `branch-validation-metrics-aggregator.yml` | Apply fixed labels to bot PRs. `documentation.yml:289, 456` use `type:documentation`, which is not canonical.                                                                                                                                   |

For `docs/` branches, `.github/labeler.yml` and the PR template router both add `type:docs`. The agent adds `type:documentation` (`labeling.agent.js:94`).

---

## Individual Workflow Assessments

Paths below are relative to `.github/workflows/archived/2026-09-11/labeling/` unless shown in full.

### 1. batch-label-prs.yml (1,734 bytes)

- **Purpose**: labels every open PR, or the one given in `pr_number`, from branch, files and content, using `scripts/batch-label-prs.js`. The script exists.
- **Triggers**: `workflow_dispatch` only. Dry-run is the default.
- **Permissions**: `pull-requests: write`, `issues: write`, `contents: read`.
- **Failure points**:
  - `npm ci || true` hides install failures (line 41).
  - `inputs.pr_number` is interpolated directly into the shell (lines 47, 55, 57).
  - The script's branch map emits `type:documentation` and `type:dependencies`, which are not in `labels.yml` (`scripts/batch-label-prs.js:26, 35`).
  - OWNER and REPO are hard-coded (`scripts/batch-label-prs.js:14-15`).
- **Archival**: superseded by `labeling-unified.yml`. The agent labels only the item in the event payload (`labeling.agent.js:290-295`), so bulk labelling was lost.
- **Recommendation**: rebuild as a dispatch backfill mode of `labeling-unified.yml` that loops the agent over open PRs. This avoids a fourth branch map.

### 2. issue-labeling-automation.yml (5,652 bytes)

- **Purpose**: daily backfill (02:00 UTC) of type, area and priority labels on issues with no `type:*` label.
- **Triggers**: schedule `0 2 * * *` and `workflow_dispatch`.
- **Permissions**: `issues: write`, `contents: read`.
- **Failure points**:
  - `scripts/workflows/apply-labels-workflow.js` does not exist (line 124).
  - `DRY_RUN: ${{ inputs.dry_run == 'true' || 'true' }}` always evaluates to `true` (line 127), so the workflow could never write labels.
  - Fetch errors are turned into a green run with count 0 (lines 116-119).
  - `state: 'all'` includes closed issues (line 79).
- **Archival**: superseded. The agent now sets type labels on each issue event (`status-enforcer.js:283`, `labeling.agent.js:166-190`). Backfilling existing issues is not covered.
- **Recommendation**: rebuild, as part of the same backfill mode as item 1.

### 3. label-audit-report.yml (3,248 bytes)

- **Purpose**: monthly reports on `meta:*` coverage and on `status:needs-review` / `status:needs-triage` age. It uses `review-meta-labels.js` and `review-status-labels.js`, both of which exist.
- **Triggers**: schedule `0 4 1 * *` and `workflow_dispatch`.
- **Permissions**: read-only (`contents`, `issues`, `pull-requests`).
- **Failure points**:
  - Reports survive only as a 30-day artefact (lines 92-98).
  - `review-meta-labels.js:23` audits `meta:dependabot-security`, which is not canonical.
  - It runs at 04:00 UTC, inside the cluster the unified workflow avoids (`labeling-unified.yml:15`).
- **Archival**: superseded, but only in name. The `scheduled-cleanup` job (`labeling-unified.yml:114-141`) is labelled "Audit report", yet it runs the agent without an issue or PR, and the agent returns straight away (`labeling.agent.js:290-295`).
- **Recommendation**: restore, with a staggered cron. Alternatively, move its two script steps into `scheduled-cleanup`.

### 4. labeling-governance.yml (21,273 bytes)

- **Purpose**: five jobs: standard labelling, bare-label detection, Dependabot security label, status clean-up on issue close, and a required "Labeling Governance Check".
- **Triggers**:
  - `push` and `pull_request` on `develop`
  - `issues` (opened, edited, reopened, closed)
  - `discussion`
  - `workflow_dispatch`
- **Permissions**: `issues`, `pull-requests` and `discussions` write at workflow level. The `labeling-check` job adds `checks: write`.
- **Failure points**:
  - `validate-issue-fields.cjs` (line 69) exits 1 today. When run locally it reports 10 project Type mappings missing from `labels.yml`, and `docs/ISSUE_FIELDS.md` missing `type:docs`. The required check would therefore fail on every PR.
  - `label-sync.js` (line 76) has no entrypoint (`label-sync.js:441-446`).
  - `report-writer.js` (line 95) throws `ReferenceError: require is not defined in ES module scope` (`report-writer.js:282`; `package.json:50` sets `"type": "module"`).
  - `detect-bare-labels` reads `github.event_name` inside github-script (lines 163, 173), which is always undefined there, so PRs are never checked.
  - `meta:dependabot-security` is created at runtime (line 227). It is not in the locked `labels.yml`.
  - `status` is hard-coded to `success` (line 359), so the failure comment (lines 427-469) is dead code.
  - A `meta:*` label alone passes the required check (line 336).
  - `report_commit` pushes with `contents: read` (lines 26, 114).
- **Archival**: conflicts. It ran on the same events as `labeling.yml` with the same agent, and its "Job 1" is labelled "from labeling.yml" (line 40). It also added a required check on top of overlapping checks.
- **Recommendation**: rebuild. Port three jobs into `labeling-unified.yml`: close-time clean-up, a required check that needs `type:*`, and the Dependabot label once it is approved through `[LABEL-UPDATE-REQUEST]`.

### 5. labeling.yml (3,876 bytes)

- **Purpose**: the original unified engine. It runs label sync, a template guardrail, `actions/labeler`, the agent and a report.
- **Triggers**:
  - push and PR on `develop`
  - issues, including `labeled`, `unlabeled` and `transferred`
  - discussions
  - dispatch
- **Permissions**: workflow-level write on issues, PRs and discussions.
- **Failure points**:
  - Label-change triggers (lines 17-21) and a concurrency key based on `github.event.number` (line 43) caused the event storm in #3531. That incident is described in `labeling-unified.yml:7-9, 27-29`.
  - Every run checks out `develop` (line 62).
  - `label-sync.js` is a no-op (line 75).
  - `report-writer.js` crashes (line 107).
  - `dry_run` is ignored (`labeling.agent.js:277, 575`).
- **Archival**: superseded, having already been copied into `labeling-governance.yml`.
- **Recommendation**: retire. `labeling-unified.yml` keeps its flow with the #3531 fixes applied.

### 6. manage-blocking-status-labels.yml (4,323 bytes)

- **Purpose**: adds `status:blocked` while any `- Blocked by: #N` reference is open, and removes it otherwise.
- **Triggers**: issues (opened, reopened, edited) and a daily run at 09:00 UTC.
- **Permissions**: `issues: write`.
- **Failure points**:
  - Each issue event rescans every open issue (lines 23-32) and makes one API call per blocker (line 81).
  - There is no concurrency group.
  - Only the first "Blocked by" line is read (lines 42-43).
  - Manually applied `status:blocked` labels are removed (lines 61-72).
  - Cross-repository references are ignored (line 46).
- **Archival**: performance (inferred from the code). Commit `84fd6e569d` called it "non-essential". Its mapped successor has no blocking logic.
- **Recommendation**: rebuild. Scope event runs to the triggering issue, keep a staggered daily sweep, add concurrency, and keep manual blocks.

### 7. meta-labels-sync.yml (3,462 bytes)

- **Purpose**: daily `meta:has-pr` sync (`sync-pr-labels.js`) and `meta:stale` detection (`manage-stale-issues.js`). Both scripts exist and use canonical labels.
- **Triggers**: schedule `0 3 * * *` and dispatch.
- **Permissions**: `issues: write`, `pull-requests: read`.
- **Failure points**:
  - It runs at 03:00 UTC, the "3am UTC" collision named in `README.md:75`.
  - `dryRun` is free text, and any value other than `true` or `false` silently runs nothing (lines 58-101).
  - The scheduled threshold is hard-coded (line 54).
  - The scripts hard-code OWNER and REPO.
  - The manifest calls it "Label schema synchronization" (`MANIFEST:46`), which it is not.
- **Archival**: performance, from the schedule collision.
- **Recommendation**: restore, with a new cron, a choice-type input and an entry in the `workflow-lint.yml` file list (lines 60-62).

### 8. openspec-sync-labels.yml (1,326 bytes)

- **Purpose**: OpenSpec phase-progression sync when labels change.
- **Triggers**: issues and PRs (`labeled`, `unlabeled`) and dispatch.
- **Failure points**:
  - `handle-issue-labeled.cjs` only exports functions (line 210), so the step does nothing.
  - PR runs pass `github.event.issue.number` (line 43), which is empty for PRs.
  - The label name is interpolated into the shell (line 44).
  - The state machine uses `openspec:specification-pending`, which is not canonical (`phase-state-machine.cjs:7`).
- **Archival**: obsolete. Spec 008 FR-011 renames `openspec:*` to `spec:*` (`spec.md:179`), and FR-013 replaces OpenSpec with Spec Kit (`spec.md:188`).
- **Recommendation**: retire. If `spec:*` phase automation is wanted, specify it as a new Spec Kit feature.

### 9. openspec-validate-labels.yml (2,057 bytes)

- **Purpose**: suggests an initial OpenSpec label on new issues and validates label combinations.
- **Triggers**: issues (opened, labeled) and dispatch.
- **Permissions**: `issues: read`, although the handlers would need write access.
- **Failure points**:
  - Neither handler has an entrypoint (`handle-issue-created.cjs:149`, `handle-issue-labeled.cjs:210`).
  - The map uses `type:enhancement`, `type:documentation` and `openspec:specification-pending`, none of which are canonical (`handle-issue-created.cjs:17-22`).
  - The label name is interpolated into the shell (line 52).
- **Archival**: obsolete, for the same FR-011 and FR-013 reasons as item 8.
- **Recommendation**: retire.

### 10. remediate-bare-labels.yml (8,396 bytes)

- **Purpose**: weekly migration of bare labels using `.github/reports/label-remediation/bare-label-mapping.json` (77 entries).
- **Triggers**: schedule `0 8 * * 1` and dispatch.
- **Permissions**: `issues` and `pull-requests` write.
- **Failure points**:
  - Scheduled runs write labels, because `DRY_RUN` is empty on schedule (lines 119, 165).
  - It fetches a single page of 100 per label with no pagination (lines 66-72).
  - It replaces the whole label set in one call (lines 143-146).
  - 8 mapping targets are not canonical: `type:documentation`, `type:ui`, `type:ux-feedback` (x2), `type:help` (x2), `type:story` and `type:qa`.
  - Every item is logged as "Issue" (line 149).
  - Configuration is read from a reports folder (line 46).
- **Archival**: superseded by the agent's clean-up step (`labeling.agent.js:204-246`). That step deletes bare labels rather than migrating them, because `labels.yml` has no `aliases` (`label-lookup.js:27-38`).
- **Recommendation**: rebuild. Correct the mapping and move it into `labels.yml` aliases through `[LABEL-UPDATE-REQUEST]`. Then add a paginated backfill that is dry-run by default.

### 11. validate-issue-labels.yml (4,689 bytes)

- **Purpose**: posts a warning comment listing an issue's non-canonical labels.
- **Triggers**: issues (opened, edited, labeled, unlabeled).
- **Permissions**: `issues: write`.
- **Failure points**:
  - The guidance recommends 5 non-canonical labels: `type:documentation`, `area:docs`, `area:labels`, `meta:duplicate` and `meta:blocked` (lines 84-88).
  - The relative link to `labels.yml` is broken in issue comments (line 89).
  - The warning comment is never cleared once the labels are fixed (lines 72-75).
  - The label-change triggers repeat the #3531 pattern.
- **Archival**: superseded. It duplicated `labeling-governance.yml:117-183`.
- **Recommendation**: retire. Add contributor feedback to the agent instead.

---

## Automation Gaps

These archived purposes are not covered by any active workflow or script. The full records are in `evidence/automation-gaps.json`.

| #   | Gap                                                                     | Last attempted in                              | Recommendation               |
| --- | ----------------------------------------------------------------------- | ---------------------------------------------- | ---------------------------- |
| 1   | Bulk backfill of labels on existing PRs and issues                      | batch-label-prs, issue-labeling-automation     | implement in unified agent   |
| 2   | Scheduled label audit reports                                           | label-audit-report                             | restore workflow             |
| 3   | `meta:has-pr` maintenance                                               | meta-labels-sync                               | restore workflow             |
| 4   | `meta:stale` detection                                                  | meta-labels-sync                               | restore workflow             |
| 5   | `status:blocked` from issue dependencies                                | manage-blocking-status-labels                  | implement in unified agent   |
| 6   | Migrating bare labels (not just deleting them)                          | remediate-bare-labels                          | implement in unified agent   |
| 7   | Contributor feedback on non-canonical labels                            | validate-issue-labels, labeling-governance     | implement in unified agent   |
| 8   | Required PR label check (type:\*)                                       | labeling-governance                            | implement in unified agent   |
| 9   | Template label guardrail                                                | labeling, labeling-governance                  | implement in unified agent   |
| 10  | Status clean-up on issue close                                          | labeling-governance                            | implement in unified agent   |
| 11  | Dependabot security label (needs `[LABEL-UPDATE-REQUEST]`)              | labeling-governance                            | implement in unified agent   |
| 12  | Repository label definitions synced with `labels.yml` (never effective) | labeling, labeling-governance                  | implement in unified agent   |
| 13  | Discussion labelling (trigger exists, agent ignores it)                 | labeling, labeling-governance                  | implement in unified agent   |
| 14  | OpenSpec phase progression                                              | openspec-sync-labels, openspec-validate-labels | none needed (FR-011, FR-013) |

---

## Restoration Roadmap

In priority order. Each step is a separate PR from `develop`. Any restored or new workflow file must be added to the explicit list in `workflow-lint.yml:60-62`.

1. **P1: fix the active workflow first** (labels are changing now). All changes are in `labeling-unified.yml` and `scripts/agents/`.
   - Pass `DRY_RUN` through in `run-labeling-agent.js:6`.
   - Refresh the label list between agent steps, so that only one `type:*` label is applied.
   - Map the agent's labels to canonical ones: `type:docs` instead of `type:documentation`, `type:dependency` instead of `type:dependencies`, and `type:a11y` instead of `type:accessibility`.
   - Stop the agent removing `meta:skip-labeling`, or add that label to `labels.yml` through `[LABEL-UPDATE-REQUEST]`.
   - Replace the guardrail script at line 62 with `check-template-labels.js`.
2. **P1: keep the archive until rebuilds land.** The retention period ends on 2026-09-25 (`README.md:164`). Deleting the archive would remove the only copies of the logic for gaps 3 to 5 and 10.
3. **P2: restore `meta-labels-sync.yml`** (minimal effort) with a staggered cron. This closes gaps 3 and 4.
4. **P2: restore `label-audit-report.yml`** (minimal effort), or fold it into `scheduled-cleanup`. This closes gap 2.
5. **P2: rebuild the governance jobs** from `labeling-governance.yml` in `labeling-unified.yml`: close clean-up and a required check that needs `type:*`. Do this after `validate-issue-fields.cjs` passes. This closes gaps 8 and 10.
6. **P3: rebuild `status:blocked`** management, scoped to the event plus a daily sweep. This closes gap 5.
7. **P3: add an agent backfill mode** (dispatch only, paginated, dry-run by default). It replaces `batch-label-prs.yml`, `issue-labeling-automation.yml` and the one-off part of `remediate-bare-labels.yml`. Add `aliases` to `labels.yml` through the spec 008 Stage 2 configuration PR. This closes gaps 1 and 6.
8. **P4: contributor feedback and the Dependabot label.** Add feedback comments to the agent. Add the Dependabot label only after `[LABEL-UPDATE-REQUEST]` approval. This closes gaps 7 and 11.
9. **P4: decide on discussions and label-definition sync.** Either implement discussion labelling or remove the discussion trigger from `labeling-unified.yml:12-13`. For label-definition sync, give `label-sync.js` a dry-run entrypoint, or rely on the spec 008 Stage 3 process. This closes gaps 12 and 13.
10. **Retire** `labeling.yml`, `validate-issue-labels.yml`, `openspec-sync-labels.yml` and `openspec-validate-labels.yml` when the archive is cleaned up. The OpenSpec handlers under `scripts/automation/handlers/` fall under the FR-013 Spec Kit rename.

---

## Unified Labeling Agent Assessment

`labeling-unified.yml` with `scripts/agents/run-labeling-agent.js` and `labeling.agent.js` is an improvement on the archived pair:

- Actions are pinned to commit SHAs.
- Permissions are set per job, and there are timeouts.
- Issue and discussion label-change triggers are removed, and the concurrency key is per item and action (#3531, lines 7-35).
- The schedule is staggered to 05:17 UTC (line 16).

It covers these archived purposes: per-item type, status and priority defaults, file and branch rules, the changelog nudge, and removal of non-canonical labels. It does not cover the 14 gaps above. It also has these defects:

| Defect                                                                                                                                                                                                                                                            | Evidence                                                                                        |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `DRY_RUN` is never read. The runner calls `runLabelingAgent()` with no options and the agent uses only `opts.dryRun`, so `workflow_dispatch` `dry_run` and `scheduled-cleanup`'s `DRY_RUN: "true"` have no effect.                                                | `run-labeling-agent.js:6`; `labeling.agent.js:277`                                              |
| `scheduled-cleanup` ("Audit report") does nothing: schedule and dispatch payloads have no issue or PR.                                                                                                                                                            | `labeling-unified.yml:114-141`; `labeling.agent.js:290-295`                                     |
| The template guardrail runs `validate-labels-before-creation.cjs` without `--labels`. It always exits 1 ("Missing required 'type:\*' label"), and `continue-on-error` hides this. `check-template-labels.js`, which does validate templates, is no longer called. | `labeling-unified.yml:61-63`                                                                    |
| Stale label list: every step checks the original payload labels. In one run the agent can add a branch type (step 2), then `type:chore`/`type:task` (step 4), then a content-detected type (step 5). The one-type rule was enforced earlier, in step 3.           | `labeling.agent.js:335-337, 371-487`; `status-enforcer.js:277-283`                              |
| Non-canonical outputs: `type:documentation`, `type:dependencies` and `type:accessibility`.                                                                                                                                                                        | `labeling.agent.js:54-58, 76-78, 82-84, 94-95, 102, 104`                                        |
| Keyword matching is by substring: "issue" means `type:bug`, and "ci" or "fix" also match inside other words (for example "prefix").                                                                                                                               | `labeling.agent.js:41-85, 166-190`                                                              |
| Every non-canonical label is deleted, because `labels.yml` has no `aliases`. This includes `meta:skip-labeling`, the opt-out that `file-labels` checks. The `agent-labels` job does not check that opt-out.                                                       | `labeling.agent.js:215-245`; `labeling-unified.yml:73, 152-155`                                 |
| The `[skip labeling]` check reads `head_commit.message`, which exists only on push events, and there is no push trigger.                                                                                                                                          | `labeling-unified.yml:155`                                                                      |
| The report artefact is always empty: the agent writes only to the job summary.                                                                                                                                                                                    | `labeling-unified.yml:170-176`; `labeling.agent.js:561`                                         |
| Duplicate writers: `status:needs-triage` comes from both the composite action and the agent. PR type labels come from `actions/labeler`, the agent (steps 1 and 2) and `pr-template-routing.yml`.                                                                 | `labeling-unified.yml:101-106`; `status-enforcer.js:153-156`; `pr-template-routing.yml:222-246` |
| Discussion events trigger `agent-labels`, but the agent handles only issues and PRs.                                                                                                                                                                              | `labeling-unified.yml:12-13`; `labeling.agent.js:282-295`                                       |

Once spec 008 renames `openspec:*` to `spec:*` and `ai-ops:*` to `aiops:*` (FR-011), the agent picks up the new names automatically, because it loads them from `labels.yml`. The archived OpenSpec handlers and `phase-state-machine.cjs` hard-code `openspec:*` names and would need rewriting, so this report recommends retiring them.

### Limitations

- The clone is shallow, so the history of `scripts/workflows/apply-labels-workflow.js` could not be traced.
- Whether branch `refactor/workflow-consolidation-and-archiving` exists on GitHub was not checked. It is simply absent from the fetched remotes.
- GitHub API behaviour was not tested. For example, whether `addLabels` creates missing labels, and the token scope of Dependabot PRs, were not checked.
- Labels were compared with the live `.github/labels.yml` (169 labels, the same count as `evidence/canonical-labels.json`).
