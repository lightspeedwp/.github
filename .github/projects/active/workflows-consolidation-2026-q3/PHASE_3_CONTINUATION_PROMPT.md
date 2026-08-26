---
file_type: documentation
title: "GitHub Workflows Consolidation — Phase 3 Execution (Labeling Workflows)"
description: "Continuation prompt for Phase 3 execution. Use this to resume work in a new chat session."
last_updated: "2026-08-25"
status: active
---

# Phase 3 Continuation Prompt: GitHub Workflows Consolidation

## Context

You are continuing **Phase 3** of the **GitHub Workflows Consolidation Initiative** (#1227 Epic). This phase consolidates 4 labeling-related workflows into 2 streamlined workflows while maintaining all label governance and metadata functionality.

**Current Status:** 🔄 Phase 3.1 complete (PR #1367 merged to develop); Phase 3.2–3.4 pending

---

## Key References

### Epic & Issues

- **Epic:** [#1227](https://github.com/lightspeedwp/.github/issues/1227) — GitHub Workflows Consolidation Initiative
- **Phase 3 Child Issues (Status: READY):**
  - [#1322](https://github.com/lightspeedwp/.github/issues/1322) — Phase 3.1: Create `labeling-governance.yml` Workflow (2h, status:ready)
  - [#1323](https://github.com/lightspeedwp/.github/issues/1323) — Phase 3.2: Integration Testing — Labeling Workflows (2.5h, status:ready)
  - [#1324](https://github.com/lightspeedwp/.github/issues/1324) — Phase 3.3: Cleanup & Deprecate Legacy Labeling Workflows (1.5h, status:ready)
  - [#1325](https://github.com/lightspeedwp/.github/issues/1325) — Phase 3.4: Code Review & Merge Phase 3 Changes (1.5h, status:ready)

### Active Project Documentation

- **Main Project Folder:** `.github/projects/active/workflows-consolidation-2026-q3/`
- **Key Documents:**
  - `PHASE_3_ISSUES.md` — Detailed issue templates and work breakdown
  - `PHASE_3_READINESS.md` — Readiness assessment and blocker check
  - `PHASE_3_EXECUTION.md` — Step-by-step execution guide
  - `PROJECT_INDEX.md` — Project overview and timeline

### Related PRs (Merged)

- ✅ **PR #1276** — Phase 1: Consolidate core workflows (31 → 25)
- ✅ **PR #1313** — Phase 2: Documentation & validation workflows
- 🔄 **Phase 3 PR** — To be created during #1322-#1325 execution

### Related Branches

- `refactor/labeling-consolidation-phase-3` — Will be created when Phase 3.1 starts

---

## What Phase 3 Entails

### Phase 3.1: Create `labeling-governance.yml` Workflow

**Issue:** [#1322](https://github.com/lightspeedwp/.github/issues/1322)  
**Effort:** 2 hours

Consolidate labeling logic from:

- `.github/workflows/labeling.yml` (PR/issue labeling by patterns)
- `.github/workflows/dependabot-security-label.yml` (security labels for Dependabot PRs)
- `.github/workflows/issue-close-label-hygiene.yml` (remove in-progress labels on close)

**Deliverable:** New `.github/workflows/labeling-governance.yml` with 4 consolidated jobs

### Phase 3.2: Integration Testing — Labeling Workflows

**Issue:** [#1323](https://github.com/lightspeedwp/.github/issues/1323)  
**Effort:** 2.5 hours

Test scenarios:

- PR branch-based labeling (feat/, fix/, docs/, refactor/ branches)
- Dependabot security labeling
- Issue type labeling
- Label cleanup on close
- Manual dispatch

**Deliverable:** Comprehensive test results, no regressions

### Phase 3.3: Cleanup & Deprecate Legacy Labeling Workflows

**Issue:** [#1324](https://github.com/lightspeedwp/.github/issues/1324)  
**Effort:** 1.5 hours

- Disable legacy workflows with `if: false`
- Wait 24 hours for monitoring
- Delete legacy workflow files
- Update `.github/workflows/README.md`
- Create `docs/LABELING_GOVERNANCE.md`
- Update `CHANGELOG.md`

**Deliverable:** Clean workflow directory, updated documentation

### Phase 3.4: Code Review & Merge Phase 3 Changes

**Issue:** [#1325](https://github.com/lightspeedwp/.github/issues/1325)  
**Effort:** 1.5 hours

- Final code review across all Phase 3 work
- Verify all tests passing
- Merge to develop
- Delete feature branch
- Close issue with summary

**Deliverable:** Phase 3 merged to develop, ready for production

---

## Blockers & Dependencies

**Current Blockers:** ✅ NONE

**Dependencies Satisfied:**

- ✅ Phase 2 dependencies fully met (PR #1313 merged)
- ✅ All 4 child issues created and status:ready
- ✅ Duplicate issues (#1360-#1363) cleaned up
- ✅ No blocking issues identified

---

## Immediate Next Steps

1. **Start with Issue #1322** (Phase 3.1: Create labeling-governance.yml)
   - Create feature branch: `refactor/labeling-consolidation-phase-3`
   - Create new workflow file: `.github/workflows/labeling-governance.yml`
   - Consolidate logic from 3 source workflows
   - Implement 4 jobs: label-pr, label-dependabot-security, label-issue, cleanup-on-close

2. **Reference:** See `PHASE_3_ISSUES.md` for detailed work breakdown and Definition of Done checklists

3. **Timeline:** ~7.5 hours total (2 + 2.5 + 1.5 + 1.5 hours per issue)

---

## Quick Command Reference

```bash
# Clone/navigate repo
cd /Users/ash/Studio/LightSpeedWP.Agency/.github

# Create feature branch for Phase 3
git checkout -b refactor/labeling-consolidation-phase-3

# Verify Phase 2 completion (should be merged)
git log --oneline origin/develop | grep -i "phase.*2"

# Check current workflow files
ls -la .github/workflows/ | grep -E "label|dependabot"

# Run linting on workflows
npm run lint:workflows

# Validate changes before commit
npm run validate:all
```

---

## Documentation & Resources

**In `.github/projects/active/workflows-consolidation-2026-q3/`:**

- `PHASE_3_ISSUES.md` — Detailed issue templates (read this first!)
- `PHASE_3_READINESS.md` — Current readiness assessment
- `PHASE_3_EXECUTION.md` — Step-by-step execution guide
- `PHASE_3_KICKOFF.md` — Phase 3 kickoff summary

**Related Documentation:**

- `.github/CLAUDE.md` — Project AI instructions
- `.github/AGENTS.md` — Agent governance
- `.github/docs/CHANGELOG_AUTOMATION.md` — Changelog rules

---

## Communication & Status

**Status:** Ready for Phase 3 execution  
**Last Updated:** 2026-07-24  
**Current Phase:** 3 (Labeling Workflows Consolidation)  
**Timeline:** Weeks 5-6 of initiative  
**Effort Remaining:** ~7.5 hours total

**Contact/Owner:** @lightspeedwp/maintainers

---

## Success Criteria

Phase 3 is complete when:

- ✅ `labeling-governance.yml` created with all 4 jobs
- ✅ All integration tests passing (branch labeling, Dependabot, issue close cleanup)
- ✅ Legacy workflows disabled/deleted
- ✅ Documentation updated (LABELING_GOVERNANCE.md, workflows README, CHANGELOG)
- ✅ PR created, reviewed, and merged to develop
- ✅ All 4 child issues (#1322-#1325) marked complete

---

## Next Session Prompt

**Use this prompt when starting a new chat to continue Phase 3:**

```
Context: Continue Phase 3 execution of the GitHub Workflows Consolidation Initiative (#1227 Epic).

Current status: Ready for execution (all blockers cleared, no dependencies blocking)

Key issues: #1322-#1325 (4 child issues, all status:ready)
Active project: .github/projects/active/workflows-consolidation-2026-q3/
Main docs: PHASE_3_ISSUES.md, PHASE_3_EXECUTION.md, PROJECT_INDEX.md

Phase 3 scope: Consolidate 4 labeling workflows into 2 streamlined workflows
- #1322: Create labeling-governance.yml (2h)
- #1323: Integration Testing (2.5h)
- #1324: Cleanup & Deprecate (1.5h)
- #1325: Code Review & Merge (1.5h)

Next step: Start with #1322 - create labeling-governance.yml by consolidating labeling.yml, dependabot-security-label.yml, and issue-close-label-hygiene.yml

Branch: refactor/labeling-consolidation-phase-3
Related: Epic #1227, PR #1276 (Phase 1), PR #1313 (Phase 2)

See PHASE_3_CONTINUATION_PROMPT.md for full context.
```

---

*Continuation prompt created: 2026-07-24*  
*Ready for: Phase 3 execution*  
*Status: ALL GREEN ✅*
