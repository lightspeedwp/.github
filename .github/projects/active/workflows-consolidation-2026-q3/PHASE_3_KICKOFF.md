---
name: Phase 3 Kickoff
title: Phase 3 Labeling & Metadata Consolidation — Implementation Kickoff
description: Ready-to-execute prompt and context for Phase 3 work
metadata:
  phase: 3
  status: kickoff
  created: 2026-07-24
  expected_start: 2026-07-26
---

# 🚀 Phase 3 Kickoff — Labeling & Metadata Consolidation

## Context

Phase 2 (Documentation Workflows Consolidation) is **complete and merged**. Phase 2.2 monitoring ends on **2026-07-26**. Phase 3 is ready to begin upon Phase 2 cleanup completion.

**Phase 3 consolidates 4 labeling-related workflows into 2 streamlined workflows**, reducing GitHub Actions minutes and eliminating duplication while maintaining all labeling and metadata governance functionality.

---

## What is Phase 3?

**Phase 3 focuses on labeling and metadata governance workflows.**

### Current State

- 4 separate labeling workflows:
  - `labeling.yml` (250 lines) — Core labeling rules by branch/content
  - `dependabot-security-label.yml` (85 lines) — Add security label to Dependabot PRs
  - `issue-close-label-hygiene.yml` (95 lines) — Remove labels when closing issues
  - `metadata-governance.yml` (140 lines) — Enforce milestone/capacity labels

### Target State

- 2-3 consolidated workflows:
  - `labeling-governance.yml` — All PR/issue labeling + cleanup (consolidated from 3 workflows)
  - `metadata-governance.yml` — Unchanged (different scope: milestones vs. labels)

### Expected Outcomes

- 33-50% workflow reduction (3-4 → 2)
- ~180 lines of duplication eliminated
- ~20 GHA minutes/week savings (~85/month)
- All labeling behavior preserved
- Better maintainability

---

## Phase 3 Work Breakdown

### Phase 3.1: Create `labeling-governance.yml` (2 hours)

**Goal:** Consolidate PR labeling, Dependabot security labeling, and label cleanup into one workflow

**What to do:**

1. Create `.github/workflows/labeling-governance.yml`
2. Migrate Job 1: Standard PR/issue labeling (from `labeling.yml`)
3. Migrate Job 2: Dependabot security labeling (from `dependabot-security-label.yml`)
4. Migrate Job 3: Label cleanup on close (from `issue-close-label-hygiene.yml`)
5. Set up conditional logic so each job runs only when applicable

**Key Files:**

- [PHASE_3_EXECUTION.md](./PHASE_3_EXECUTION.md) — Detailed implementation plan
- [PHASE_3_ISSUES.md](./PHASE_3_ISSUES.md) — Issue templates for this phase
- Reference: [PHASE_2_EXECUTION.md](./PHASE_2_EXECUTION.md) for similar consolidation pattern

**Success Criteria:**

- ✅ New workflow created and YAML valid
- ✅ All labeling logic migrated
- ✅ Conditional jobs work correctly
- ✅ No linting errors

---

### Phase 3.2: Integration Testing (2.5 hours)

**Goal:** Verify all labeling works correctly and nothing broke

**What to test:**

- PR branch-based labeling (`feat/`, `fix/`, `docs/`, etc.)
- Dependabot PR security labeling
- Issue type and priority labeling
- Label cleanup on issue/PR close
- Regression: all old behaviors preserved

**Key Files:**

- [PHASE_3_ISSUES.md](./PHASE_3_ISSUES.md) — Detailed test scenarios
- Reference: [PHASE_2_2_TEST_RESULTS.md](./PHASE_2_2_TEST_RESULTS.md) for testing pattern

**Success Criteria:**

- ✅ All test scenarios passing
- ✅ No regressions detected
- ✅ Performance acceptable

---

### Phase 3.3: Cleanup & Deprecate (1.5 hours)

**Goal:** Disable and delete legacy workflows after 24-hour monitoring

**What to do:**

1. Add `if: false` to legacy workflows (disable them)
2. Monitor for 24 hours (watch for any issues)
3. Delete old workflow files
4. Update documentation

**Key Files:**

- [PHASE_3_ISSUES.md](./PHASE_3_ISSUES.md) — Deprecation checklist
- Reference: [PHASE_2_EXECUTION.md](./PHASE_2_EXECUTION.md#phase-23-deprecation--cleanup-2-3-hours) for cleanup pattern

**Success Criteria:**

- ✅ Old workflows disabled/deleted
- ✅ Documentation updated
- ✅ No broken references

---

### Phase 3.4: Code Review & Merge (1.5 hours)

**Goal:** Final review and merge all Phase 3 changes to develop

**What to do:**

1. Create PR: `refactor/labeling-consolidation-phase-3`
2. Link to GitHub issues
3. Get code review approval
4. Squash merge to develop

**Key Files:**

- [PHASE_3_ISSUES.md](./PHASE_3_ISSUES.md) — Review checklist
- Reference: [PHASE_2_ISSUES.md](./PHASE_2_ISSUES.md) for PR template pattern

**Success Criteria:**

- ✅ PR merged to develop
- ✅ All issues closed
- ✅ Branch deleted after merge

---

## How to Start Phase 3

### 1. **Read the Planning Documents** (10 minutes)

- [PHASE_3_EXECUTION.md](./PHASE_3_EXECUTION.md) — Detailed execution plan
- [PHASE_3_ISSUES.md](./PHASE_3_ISSUES.md) — Issue templates and checklist

### 2. **Create GitHub Issues** (5 minutes)

   ```bash
   # Use the templates in PHASE_3_ISSUES.md to create:
   # - Issue #3.1: Create labeling-governance.yml
   # - Issue #3.2: Integration Testing
   # - Issue #3.3: Cleanup & Deprecate
   # - Issue #3.4: Code Review & Merge
   # Link all to Epic #1227
   ```

### 3. **Create Branch** (1 minute)

   ```bash
   git checkout -b refactor/labeling-consolidation-phase-3 develop
   ```

### 4. **Start Phase 3.1 — Create Workflow** (2 hours)

- Follow [PHASE_3_EXECUTION.md](./PHASE_3_EXECUTION.md#new-workflow-1-labeling-governanceyml)
- Copy logic from source workflows
- Test YAML syntax: `npm run lint:yaml`

### 5. **Run Integration Tests** (2.5 hours)

- Follow test scenarios in [PHASE_3_ISSUES.md](./PHASE_3_ISSUES.md)
- Test on sample PRs/issues
- Verify all labels apply correctly

### 6. **Create PR and Merge** (2 hours)

- Use [PHASE_3_ISSUES.md](./PHASE_3_ISSUES.md) review checklist
- Link to Phase 3 issues
- Squash merge to develop after approval

---

## Key Differences from Phase 2

| Aspect | Phase 2 | Phase 3 |
|--------|---------|---------|
| **Workflows consolidated** | 4 (docs) | 3-4 (labeling) |
| **Effort** | 12-16 hours | 6-8 hours |
| **Complexity** | Medium (validation + maintenance) | Low (labeling logic straightforward) |
| **Testing** | Mermaid validation, README structure | Label application, cleanup |
| **Dependencies** | Pull request payloads | GitHub actor, event action |

Phase 3 is **simpler and faster** than Phase 2 because:

- Fewer workflows to consolidate
- Simpler conditional logic (branch prefix, actor name)
- Less complex testing (label presence/absence vs. content validation)
- Similar pattern to Phase 2 consolidation

---

## Reference Documents

### Planning & Execution

- [PHASE_3_EXECUTION.md](./PHASE_3_EXECUTION.md) — Step-by-step execution plan
- [PHASE_3_ISSUES.md](./PHASE_3_ISSUES.md) — Issue templates and checklists

### Phase 2 Reference (Similar Pattern)

- [PHASE_2_EXECUTION.md](./PHASE_2_EXECUTION.md) — Phase 2 execution plan (similar structure)
- [PHASE_2_ISSUES.md](./PHASE_2_ISSUES.md) — Phase 2 issue templates (reference)
- [PHASE_2_2_TEST_RESULTS.md](./PHASE_2_2_TEST_RESULTS.md) — Phase 2 test scenarios (reference)

### Project Overview

- [README.md](./README.md) — Project overview and status dashboard
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) — 4-phase strategy
- [EXECUTION_PLAYBOOK.md](./EXECUTION_PLAYBOOK.md) — General execution framework

### GitHub

- [Epic #1227](https://github.com/lightspeedwp/.github/issues/1227) — Main tracking issue
- Issues #3.1-#3.4 (to be created from PHASE_3_ISSUES.md)

---

## Timeline

**Start Date:** 2026-07-26 (upon Phase 2 cleanup completion)  
**Duration:** Weeks 9-10  
**Total Effort:** ~6-8 hours (spread over 2 weeks)

| Task | Week | Hours |
|------|------|-------|
| Phase 3.1 (Create Workflow) | 9 | 2 |
| Phase 3.2 (Integration Testing) | 9-10 | 2.5 |
| Phase 3.3 (Cleanup & Delete) | 10 | 1.5 |
| Phase 3.4 (Code Review & Merge) | 10 | 1.5 |
| **Total** | **9-10** | **~9h** |

---

## Success Criteria

**Phase 3 is complete when:**

✅ `labeling-governance.yml` created and tested  
✅ All PR/issue labeling working correctly  
✅ Label cleanup on close functioning  
✅ Dependabot security labeling working  
✅ All old workflows deleted  
✅ Documentation updated  
✅ PR #3 merged to develop  
✅ All Phase 3 issues closed  

---

## Next Steps After Phase 3

Once Phase 3 completes and Phase 3.3 cleanup finishes:

- **Workflow count:** 31 → 27 (13% reduction, halfway to target of 25)
- **Code duplication:** ~500 lines → ~140 lines eliminated (72% progress)
- **GHA minutes saved:** ~60/week so far (42% of 15-20% target)
- **Phase 4 ready:** Consolidate remaining workflows (issue lifecycle, advanced patterns)

---

## Questions or Issues?

Refer to:

1. [PHASE_3_EXECUTION.md](./PHASE_3_EXECUTION.md) — Implementation details
2. [PHASE_3_ISSUES.md](./PHASE_3_ISSUES.md) — Checklists and requirements
3. [PHASE_2_EXECUTION.md](./PHASE_2_EXECUTION.md) — Similar consolidation pattern
4. [Epic #1227](https://github.com/lightspeedwp/.github/issues/1227) — Main issue tracker

---

**Phase 3 is ready to start!**  
Expected start: 2026-07-26  
Estimated completion: 2026-08-07

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
