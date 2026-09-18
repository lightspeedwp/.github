---
file_type: "documentation"
title: "GitHub Issues Templates for Phase 4"
description: "Issue templates for Phase 4 sub-phases (#1406-#1411) ready for creation"
created_date: "2026-08-07"
last_updated: "2026-08-25"
status: active
---

# Phase 4 GitHub Issue Templates

These issue templates are ready to be created as GitHub issues #1406-#1411. Each follows the repository's issue template standards with Definition of Ready (DoR) and Definition of Done (DoD).

---

## Issue #1406: Phase 4.1 — Delete Deprecated Workflows

**Type:** Chore  
**Effort:** 1 hour  
**Dependency:** Phase 3.3 (labeling consolidation) must be complete

````markdown
# Phase 4.1: Delete Deprecated Workflows

## Summary

Remove 2 deprecated workflows that are fully superseded by other workflows:
- `validate-mermaid-pr.yml` — already consolidated into `docs-validation.yml`
- `metrics-pipeline.yml` — superseded by `metrics-reporting.yml`

**Part of:** Epic #1227 (GitHub Workflows Consolidation Initiative)  
**Effort:** 1 hour  
**Net Workflow Reduction:** −2 (31 → 29)

## Definition of Ready (DoR)

- [x] Phase 3.3 labeling consolidation complete and stable
- [x] Target workflows identified and verified for deprecation
- [x] Replacement functionality confirmed in existing workflows
- [x] No external references to deleted workflows found
- [x] Rollback plan documented

## Definition of Done (DoD)

- [ ] validate-mermaid-pr.yml deleted
- [ ] metrics-pipeline.yml deleted
- [ ] Verified docs-validation.yml covers all Mermaid checks
- [ ] Verified metrics-reporting.yml covers all metrics jobs
- [ ] No broken workflow dependencies
- [ ] GitHub Actions history reviewed (no failures)
- [ ] Code committed with message: `refactor(ci): delete deprecated workflows (#phase-4.1)`
- [ ] PR created and reviewed
- [ ] Merged to develop

## Detailed Steps

### 1. Verify Replacements

1. Review `docs-validation.yml` — confirm it validates Mermaid diagrams
   - Check for mermaid-related steps in workflow jobs
   - Verify it runs on PR and push events

2. Review `metrics-reporting.yml` — confirm it covers all metrics jobs
   - Compare job names and logic with `metrics-pipeline.yml`
   - Verify it runs on same schedule (Monday 6 AM)

### 2. Search for References

1. `grep -r "validate-mermaid-pr" .` — Search repository
2. `grep -r "metrics-pipeline" .` — Search repository
3. Check GitHub Actions workflow run history
4. Check AI agents/scripts for references

### 3. Delete Workflows

```bash
git rm .github/workflows/validate-mermaid-pr.yml
git rm .github/workflows/metrics-pipeline.yml
````

### 4. Verify

1. Run `ls .github/workflows/*.yml | wc -l` → Should be 39 (down from 41)
2. Commit and push
3. Monitor Actions for any missing workflow errors
4. Wait for Monday 6 AM metrics run to verify metrics-reporting.yml fires

### 5. Verification Checklist

- [ ] No broken workflow references
- [ ] No GitHub Actions errors in recent runs
- [ ] Metrics still reporting on Monday morning
- [ ] Mermaid validation still working in docs PRs
- [ ] Team notified of removed workflows

## Related Issues

- **Epic #1227** — GitHub Workflows Consolidation Initiative
- **Phase 3.3** — Labeling workflows consolidation (dependency)
- **Phase 4.2-4.6** — Other Phase 4 sub-phases (parallel execution)

## Rollback Plan

If issues discovered:

1. `git revert <commit-hash>`
2. Restore deleted workflow files
3. Re-enable workflows
4. Investigate root cause

## Notes

- Both workflows are confirmed deprecated (already consolidated in Phase 2-3)
- No complex logic to preserve (straightforward deletion)
- Low risk cleanup operation

```

---

## Issue #1407: Phase 4.2 — Consolidate Issue-Close Governance

**Type:** Code Refactor  
**Effort:** 4-5 hours  
**Dependency:** Phase 4.1 (can run parallel)

````markdown
# Phase 4.2: Consolidate Issue-Close Governance Workflows

## Summary

Merge 3 overlapping issue-close workflows into single `issue-compliance.yml`:
- `template-enforcement.yml` (388 lines) → enforce template completeness
- `checklist-finalisation.yml` (222 lines) → finalize checklists on close
- `validate-issue-dod-before-close.yml` (113 lines) → validate DoD on close

**Part of:** Epic #1227 (GitHub Workflows Consolidation Initiative)  
**Effort:** 4-5 hours  
**Net Workflow Reduction:** −2 (29 → 27)  
**Code Reduction:** ~200 lines (duplicate logic eliminated)

## Problem

Three workflows respond to overlapping events (`issues: [closed]`), each making redundant GitHub API calls:
- All run on same triggers (issue open/edit/close events)
- Duplicate logic for checking issue state
- Duplicate GitHub API calls for getting issue content
- Increased GitHub Actions minute usage

## Solution

Create single `issue-compliance.yml` with conditional jobs:
- Each job runs only when relevant
- Single source of API calls
- Clear responsibility per job
- Reduced Actions minute usage (~30% for this family)

## Definition of Ready (DoR)

- [x] All three source workflows reviewed and documented
- [x] Job logic extracted and documented
- [x] Conditional guards defined for each job
- [x] Testing plan prepared
- [x] Rollback procedure documented
- [x] Team aware of consolidation plan

## Definition of Done (DoD)

- [ ] `issue-compliance.yml` created with all 3 jobs
- [ ] All conditional logic tested
- [ ] Old workflows disabled (with `if: false` on all jobs)
- [ ] Monitored 24 hours with old workflows disabled
- [ ] All jobs firing correctly:
  - [ ] `enforce-template` fires on issue open/edit/reopen
  - [ ] `validate-dod-on-close` fires when issue closed with incomplete DoD
  - [ ] `finalise-checklists` fires on issue/PR close
  - [ ] Template validation fires on push to develop
- [ ] No regressions in template validation
- [ ] No regressions in checklist management
- [ ] No regressions in DoD validation
- [ ] Old workflows deleted after 24h stability
- [ ] Code committed with message: `refactor(ci): consolidate issue compliance workflows (#phase-4.2)`
- [ ] PR created and reviewed
- [ ] Merged to develop

## Consolidation Design

### New Workflow Structure

```yaml
name: Issue Compliance

on:
  issues:
    types: [opened, edited, reopened, closed]
  pull_request_target:
    types: [closed]
  push:
    branches: [develop]

jobs:
  enforce-template:        # From template-enforcement.yml
    if: github.event.action != 'closed'
    # ... validation logic
    
  validate-dod-on-close:  # From validate-issue-dod-before-close.yml
    if: github.event.action == 'closed' && github.event_name == 'issues'
    # ... DoD validation logic
    
  finalise-checklists:    # From checklist-finalisation.yml
    if: github.event.action == 'closed'
    # ... checklist finalization logic
````

### Testing Protocol

1. **Functional Testing:**
   - [ ] Open new issue → `enforce-template` fires
   - [ ] Edit existing issue → `enforce-template` fires
   - [ ] Reopen issue → `enforce-template` fires
   - [ ] Close issue with complete DoD → no block
   - [ ] Close issue with incomplete DoD → validation warning/block
   - [ ] Close PR → `finalise-checklists` fires
   - [ ] Push to develop → `enforce-template` fires

2. **Integration Testing:**
   - [ ] Verify no broken dependencies on labeled event
   - [ ] Verify no loops with metadata-governance.yml
   - [ ] Verify project field updates still work

3. **Monitoring (24-72 hours):**
   - [ ] Old workflows disabled, monitoring for errors
   - [ ] No duplicate API calls in logs
   - [ ] Team feedback positive
   - [ ] Actions minute usage unchanged or reduced

## Detailed Implementation Steps

1. **Extract Logic** from 3 source workflows
2. **Create** `issue-compliance.yml` with consolidated logic
3. **Test** all conditions in isolation
4. **Disable** old workflows (add `if: false` to all jobs)
5. **Monitor** 24-72 hours
6. **Delete** old workflows after successful monitoring
7. **Verify** all metrics and dependencies

## Rollback Plan

If regressions found during monitoring:

1. Re-enable old workflows
2. Keep new workflow disabled
3. Investigate root cause
4. Fix issues and re-test
5. Schedule re-execution for next iteration

## Related Issues

- **Epic #1227** — GitHub Workflows Consolidation Initiative
- **Phase 4.1** — Delete deprecated (parallel)
- **Phase 4.3, 4.4, 4.6** — Other consolidations (parallel)
- **#1399** — issue-health-audit.yml (related compliance workflow)
- **#1376** — Issue Triage Automation (related)

## Notes

- **No breaking changes:** All existing behavior preserved
- **Efficiency gain:** ~30% reduction in Actions minutes for this family
- **Maintainability:** Single file easier to audit/modify than 3
- **Medium complexity:** Careful testing required due to multiple event types

```

---

## Issue #1408: Phase 4.3 — Unify Project Field Sync Workflows

**Type:** Code Refactor  
**Effort:** 3-4 hours  
**Dependency:** Phase 4.1 (can run parallel)

```markdown
# Phase 4.3: Unify Project Field Sync Workflows

## Summary

Merge 2 project field sync workflows with unified interface:
- `issue-fields-backfill.yml` (342 lines) → bulk mode, all open issues
- `issue-project-field-sync.yml` (386 lines) → targeted mode, specific issues

**Part of:** Epic #1227 (GitHub Workflows Consolidation Initiative)  
**Effort:** 3-4 hours  
**Net Workflow Reduction:** −1 (27 → 26)  
**Code Reduction:** ~200 lines

## Problem

Two workflows perform similar project field syncing:
- Same underlying GraphQL operations
- Different interfaces (bulk vs targeted)
- Different auth mechanisms (App token vs PAT)
- Duplicated error handling and retry logic

## Solution

Create single `project-field-sync.yml` with:
- Unified interface supporting both modes
- Standardized auth (GitHub App token)
- Single source of field sync logic
- Input parameters for mode selection

## Definition of Ready (DoR)

- [x] Both source workflows analyzed
- [x] GraphQL operations documented
- [x] Auth mechanism differences identified
- [x] Unified interface designed
- [x] Testing plan prepared
- [x] Rollback procedure documented

## Definition of Done (DoD)

- [ ] Standardize `issue-project-field-sync.yml` auth to GitHub App token
- [ ] Create `project-field-sync.yml` with unified interface
- [ ] Support `bulk`, `targeted`, and `dry-run` modes
- [ ] All mode combinations tested:
  - [ ] Bulk mode with dry-run
  - [ ] Bulk mode with apply
  - [ ] Targeted mode with dry-run (scope: last 3 days)
  - [ ] Targeted mode with apply
- [ ] Verify GraphQL parity between source workflows
- [ ] Old workflows disabled for 24-72 hours monitoring
- [ ] No regressions in field sync operations
- [ ] No broken project board updates
- [ ] Old workflows deleted after monitoring
- [ ] Code committed with message: `refactor(ci): unify project field sync workflows (#phase-4.3)`
- [ ] PR created and reviewed
- [ ] Merged to develop

## Detailed Implementation

### Pre-Consolidation

1. **Auth Migration:**
   - Migrate `issue-project-field-sync.yml` from PAT to GitHub App token
   - Test in isolated environment
   - Verify same results as PAT-based version

2. **Interface Design:**
   - Define input parameters for new workflow
   - Document all mode combinations
   - Add dry-run support

### Consolidation

1. Create `project-field-sync.yml` with unified interface
2. Copy logic from both source workflows
3. Add conditional logic for mode selection
4. Implement error handling (unified across modes)

### Testing

1. Test bulk mode (all open issues)
2. Test targeted mode (specific labels/issue numbers)
3. Test dry-run in both modes
4. Verify field sync accuracy

### Monitoring

- Disable old workflows
- Run unified workflow in both modes
- Monitor for errors and performance
- Verify project board updates work

## Rollback Plan

If issues occur:
1. Revert auth migration
2. Re-enable old workflows
3. Disable new workflow
4. Investigate root cause
5. Reschedule for next iteration

## Related Issues

- **Epic #1227** — GitHub Workflows Consolidation Initiative
- **#1408** — github-projects-creation-system project (related)
- **Phase 4.1-4.6** — Other consolidations

## Notes

- **Medium complexity:** Auth migration adds complexity
- **Dry-run essential:** Must test thoroughly before production use
- **Reversible:** Can easily revert if issues found
```

---

## Issue #1409: Phase 4.4 — Absorb Flaky Test Detection

**Type:** Code Refactor  
**Effort:** 1-2 hours  
**Dependency:** Phase 4.1 (can run parallel)

````markdown
# Phase 4.4: Absorb Flaky Test Detection into Checks Workflow

## Summary

Absorb `flaky-test-detection.yml` (42 lines) into `checks.yml`:
- Detects non-deterministic tests by running them multiple times
- Runs every 12 hours Mon-Fri
- Simple wrapper around Jest test suite

**Part of:** Epic #1227 (GitHub Workflows Consolidation Initiative)  
**Effort:** 1-2 hours  
**Net Workflow Reduction:** −1 (26 → 25) ✅ TARGET ACHIEVED

## Problem

`flaky-test-detection.yml` is small (42 lines) with clear single purpose, but still a separate workflow. Can be consolidated into `checks.yml` as a conditional job.

## Solution

Add `flaky-detection` job to `checks.yml` with:
- `if: github.event_name == 'schedule'` guard
- Same test logic as original workflow
- Same schedule trigger (every 12h Mon-Fri)

## Definition of Ready (DoR)

- [x] `checks.yml` reviewed for size
- [x] Flaky detection logic extracted
- [x] Schedule trigger documented
- [x] Testing plan prepared

## Definition of Done (DoD)

- [ ] Review `checks.yml` current size (must be ≤400 lines)
- [ ] Add `flaky-detection` job to `checks.yml`
- [ ] Add schedule trigger to `checks.yml` (if not already present)
- [ ] Add conditional guard: `if: github.event_name == 'schedule'`
- [ ] Copy flaky detection test logic verbatim
- [ ] Test schedule fires every 12h Mon-Fri
- [ ] Run flaky detection tests successfully
- [ ] Disable `flaky-test-detection.yml` for monitoring
- [ ] Monitor one full 12-hour cycle
- [ ] Delete `flaky-test-detection.yml` after successful monitoring
- [ ] Code committed with message: `refactor(ci): absorb flaky-test-detection into checks.yml (#phase-4.4)`
- [ ] PR created and reviewed
- [ ] Merged to develop

## Detailed Implementation

1. Review `checks.yml` — verify it's ≤400 lines
2. Add job to `checks.yml`:
   ```yaml
   flaky-detection:
     name: Flaky Test Detection
     if: github.event_name == 'schedule'
     runs-on: ubuntu-latest
     strategy:
       matrix:
         run_number: [1, 2, 3]
     steps:
       # ... copy steps from flaky-test-detection.yml
````

1. Add schedule trigger to `checks.yml`
2. Test locally
3. Disable old workflow
4. Monitor one cycle (12 hours)
5. Delete old workflow

## Rollback Plan

If issues occur:

1. Remove flaky-detection job from `checks.yml`
2. Re-enable `flaky-test-detection.yml`
3. Investigate root cause
4. Reschedule for next iteration

## Related Issues

- **Epic #1227** — GitHub Workflows Consolidation Initiative
- **Phase 4.1-4.6** — Other consolidations

## Notes

- **Low complexity:** Simple job addition
- **Low risk:** Schedule jobs isolated from main checks
- **Verified approach:** Test job conditions safe to use
- **This achieves target:** After consolidation, count reaches 25 ✅

```

---

## Issue #1410: Phase 4.5 — Delete Superseded Issue-Create Workflow

**Type:** Chore  
**Effort:** 0.5 hours  
**Dependency:** Phase 4.1 (can run parallel)

```markdown
# Phase 4.5: Delete Superseded Issue-Create Workflow

## Summary

Delete `issue-create-enhanced.yml` — superseded by `issue-create-enhanced.yml` (PR #1377)

**Part of:** Epic #1227 (GitHub Workflows Consolidation Initiative)  
**Effort:** 0.5 hours  
**Net Workflow Reduction:** −1 (25 → 24)

## Problem

`issue-create-enhanced.yml` (created in PR #1377) is the direct replacement for `issue-create-enhanced.yml`:
- Same input parameters (`template_key`, etc.)
- Enhanced logic and metadata handling
- All old features preserved + new features added
- Old workflow superseded

## Solution

Delete the old workflow — consolidated functionality in enhanced version

## Definition of Ready (DoR)

- [x] `issue-create-enhanced.yml` reviewed and verified
- [x] All old inputs present in enhanced version
- [x] Enhanced version deployed and tested
- [x] No references to old workflow found

## Definition of Done (DoD)

- [ ] Search for all references to `issue-create-enhanced.yml`
  - [ ] Check GitHub Actions history
  - [ ] Check AI agents and prompts
  - [ ] Check documentation
  - [ ] Check scripts and workflow references
- [ ] Update any documentation pointing to old workflow
- [ ] Delete `issue-create-enhanced.yml`
- [ ] Verify no broken workflow references
- [ ] Code committed with message: `chore(ci): delete issue-create-enhanced.yml (superseded by issue-create-enhanced.yml, #1377)`
- [ ] PR created and reviewed
- [ ] Merged to develop

## Reference Update Checklist

- [ ] Update any agent scripts using old workflow name
- [ ] Update documentation/READMEs
- [ ] Update workflow dispatch references
- [ ] Check for hardcoded references in prompts/instructions

## Rollback Plan

If issues occur:
1. Git restore `issue-create-enhanced.yml`
2. Commit restore
3. Investigate what was using old workflow

## Related Issues

- **Epic #1227** — GitHub Workflows Consolidation Initiative
- **PR #1377** — Issue Triage Automation (created enhanced version)
- **Phase 4.6** — Issue audit + remediation (uses issue-remediation-bulk)

## Notes

- **Low risk:** Direct replacement, no complex logic
- **Quick cleanup:** 0.5 hour effort
- **Verified replacement:** Enhanced version tested and deployed
```

---

## Issue #1411: Phase 4.6 — Consolidate Issue Audit & Remediation

**Type:** Code Refactor  
**Effort:** 3-4 hours  
**Dependency:** Both source workflows must have ≥1 production run

````markdown
# Phase 4.6: Consolidate Issue Audit & Remediation Workflows

## Summary

Merge 2 issue governance workflows into single `issue-audit-remediation.yml`:
- `issue-health-audit.yml` (267 lines) — weekly audit, reopen with unchecked DoD
- `issue-remediation-bulk.yml` (260 lines) — bulk fix labels/milestones/templates

**Part of:** Epic #1227 (GitHub Workflows Consolidation Initiative)  
**Effort:** 3-4 hours  
**Net Workflow Reduction:** −1 (24 → 23)  
**Code Reduction:** ~150 lines
**Note:** Brings total from 25 to 23; overachieves target by 2 workflows

## Problem

Two workflows both operate on issue metadata:
- Same trigger patterns (`workflow_dispatch` + schedule)
- Similar GitHub API operations
- Shared error handling
- Running independently risks redundant API calls if both fire together

## Solution

Create single `issue-audit-remediation.yml` with mode selection:
- `audit` mode: reopen issues with unchecked DoD (weekly)
- `remediate` mode: fix labels/milestones/templates
- `full` mode: run both in sequence
- Dry-run support for safe testing

## Definition of Ready (DoR)

- [x] Both source workflows have ≥1 production run (PR #1399, #1377)
- [x] Interaction chain with metadata-governance.yml documented
- [x] Mode logic designed
- [x] Testing plan prepared
- [x] Dry-run strategy documented

## Definition of Done (DoD)

- [ ] `issue-audit-remediation.yml` created with all modes
- [ ] Test `audit` mode with dry-run on test repo
- [ ] Test `remediate` mode with dry-run (last 3 days)
- [ ] Test `full` mode with dry-run
- [ ] Verify no close/reopen loops with issue-compliance.yml
- [ ] Verify interaction with metadata-governance.yml (labeled event)
- [ ] Old workflows disabled for monitoring
- [ ] Monitor one full weekly cycle (Monday 8 AM)
- [ ] All modes execute successfully
- [ ] No unexpected issue reopens/relabels
- [ ] Old workflows deleted after monitoring
- [ ] Code committed with message: `refactor(ci): consolidate issue audit + remediation (#phase-4.6)`
- [ ] PR created and reviewed
- [ ] Merged to develop

## Workflow Design

```yaml
name: Issue Audit & Remediation

on:
  schedule:
    - cron: "0 8 * * 1"  # Weekly Monday
  workflow_dispatch:
    inputs:
      mode:
        type: choice
        options: [audit, remediate, full]
      days:
        description: Scope (remediate only)
      dry_run:
        default: "true"

jobs:
  audit:      # From issue-health-audit.yml
    if: inputs.mode == 'audit' || inputs.mode == 'full' || github.event_name == 'schedule'
    
  remediate:  # From issue-remediation-bulk.yml
    if: inputs.mode == 'remediate' || inputs.mode == 'full'
````

## Interaction Chain (Safe)

When `issue-audit-remediation.yml` applies `type:` label:

1. Labeled event triggers
2. `metadata-governance.yml` fires (on `labeled` event)
3. `metadata-governance.yml` syncs native issue type
4. **Expected behavior** — no conflict

**Why safe:** `issue-compliance.yml` doesn't react to `labeled` events on closed issues, so no close/reopen loop.

## Testing Protocol

1. **Dry-Run Testing:**
   - [ ] Test `audit` mode on test repo (see what would reopen)
   - [ ] Test `remediate` mode scoped to last 3 days
   - [ ] Test `full` mode (both operations)

2. **Production Testing:**
   - [ ] Disable old workflows
   - [ ] Monitor one full weekly cycle
   - [ ] Verify audit fires Monday 8 AM
   - [ ] Check for unexpected issue state changes

3. **Integration Verification:**
   - [ ] No conflicts with issue-compliance.yml
   - [ ] metadata-governance.yml fires correctly on labels
   - [ ] No duplicate API calls

## Detailed Steps

1. Extract logic from both source workflows
2. Create `issue-audit-remediation.yml` with mode selection
3. Implement dry-run logic
4. Test all modes locally
5. Disable old workflows
6. Run in production for one week
7. Monitor for issues
8. Delete old workflows after successful monitoring

## Rollback Plan

If issues occur:

1. Disable new workflow
2. Re-enable old workflows
3. Investigate root cause
4. Schedule re-execution after fixes

## Related Issues

- **Epic #1227** — GitHub Workflows Consolidation Initiative
- **PR #1399** — Issue health audit creation
- **PR #1377** — Issue remediation bulk creation
- **Phase 4.2** — Issue compliance (related governance)
- **Phase 4.4** — Flaky test absorption (parallel)

## Notes

- **Medium complexity:** Two workflows with different logic
- **Important pre-req:** Both source workflows must have production runs
- **Interaction tested:** No loops with other workflows
- **Dry-run essential:** Must test in dry-run before production
- **Overachieves:** Brings count to 23 (below 25 target) ✅

```

---

## Summary Table

| Phase | Issue | Type | Effort | Net Δ | Running Total |
|-------|-------|------|--------|-------|---|
| 4.1 | #1406 | Chore | 1h | −2 | 39 |
| 4.2 | #1407 | Code Refactor | 4-5h | −2 | 37 |
| 4.3 | #1408 | Code Refactor | 3-4h | −1 | 36 |
| 4.4 | #1409 | Code Refactor | 1-2h | −1 | 25 ✅ |
| 4.5 | #1410 | Chore | 0.5h | −1 | 24 |
| 4.6 | #1411 | Code Refactor | 3-4h | −1 | 23 |

**Total Effort:** 13-16 hours  
**Total Reduction:** −8 workflows  
**Final Count:** 23 (below target of 25) ✅✅

---

## How to Create Issues

1. Copy template from section above
2. Create issue on GitHub with type (Chore, Code Refactor, etc.)
3. Paste template content into issue body
4. Link to Epic #1227
5. Set milestone/assignee as needed

---

**Ready for posting to GitHub:** ✅  
**Prerequisite:** Phase 3.3 completion + audit agent completion
