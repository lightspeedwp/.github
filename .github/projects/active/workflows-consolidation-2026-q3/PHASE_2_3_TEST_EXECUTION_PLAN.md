---
name: Phase 2.3 Test Execution Plan
description: Fresh test execution plan with corrected setup after PR #1317 merge
file_type: documentation
metadata:
  status: active
  phase: 2.3
  created: 2026-07-24
---

# Phase 2.3: Integration Testing — Corrected Execution Plan

## Status Update

**Issues Found & Fixed:**

1. ❌ First test PRs (#1365, #1366) created from wrong base branch (cleanup branch instead of develop)
2. ❌ PR #1317 (cleanup) had merge conflicts preventing merge
3. ❌ Documentation.yml workflow not triggering because legacy workflows still in develop
4. ✅ **FIXED:** PR #1317 rebased and merged successfully
5. ✅ **FIXED:** Legacy workflows deleted from develop
6. ✅ **FIXED:** Push trigger re-enabled in documentation.yml
7. ✅ **READY:** Fresh Phase 2.3 test execution plan ready

---

## Prerequisite Status

### ✅ Phase 2.4 Cleanup Complete (PR #1317)

- [x] Legacy workflows deleted from develop:
  - readme-audit.yml (189 lines) — ✅ DELETED
  - readme-regen.yml (111 lines) — ✅ DELETED
  - readme-update.yml (149 lines) — ✅ DELETED
- [x] Push trigger re-enabled in documentation.yml
- [x] No race conditions (only documentation.yml exists)
- [x] PR #1317 merged to develop

### ✅ Documentation.yml Workflow Ready

- [x] Pull_request trigger: Enabled ✓
  - Branches: develop ✓
  - Path filters: `**/*.md` + `.github/workflows/**` ✓
  - Types: opened, edited, synchronize, reopened, ready_for_review ✓
- [x] Workflow_dispatch: Enabled ✓
- [x] Push trigger: NOW ENABLED ✓

---

## Phase 2.3 Test Execution Plan (Fresh)

### Setup: Create Clean Test Branches from develop

**Timing:** Execute immediately after PR #1317 merge confirmation

```bash
# Ensure we're on latest develop
git fetch origin develop
git checkout develop

# Create test branches from clean develop
git checkout -b test/phase-2-3-scenario-1-readme-pr
git checkout -b test/phase-2-3-scenario-2-readme-push
git checkout -b test/phase-2-3-scenario-3-audit
git checkout -b test/phase-2-3-scenario-4-maintain
```

---

## Scenario Execution

### ✅ Scenario 1: PR Dry-Run Regeneration

**Branch:** `test/phase-2-3-scenario-1-readme-pr`

**Test Setup:**

```bash
git checkout test/phase-2-3-scenario-1-readme-pr
# Make minimal README change
echo "Test: PR dry-run ($(date))" >> .github/projects/active/README.md
git add .github/projects/active/README.md
git commit -m "test: Phase 2.3 Scenario 1 - PR dry-run regeneration"
git push -u origin test/phase-2-3-scenario-1-readme-pr
```

**PR Creation:**

```bash
gh pr create \
  --title "test(phase-2-3): Scenario 1 - PR dry-run regeneration" \
  --body "Phase 2.3 test: Regenerate job should run with dry-run on PR" \
  --base develop
```

**Expected Results:**

- ✅ PR created targeting develop
- ✅ documentation.yml workflow triggers on pull_request event
- ✅ regenerate job runs with dry-run flag
- ✅ No commits added to test branch
- ✅ Artifacts uploaded: documentation-regeneration-*
- ✅ Step summary appears in PR checks

---

### ✅ Scenario 2: Push Auto-Commit Regeneration

**Branch:** `test/phase-2-3-scenario-2-readme-push`

**Test Setup:**

```bash
git checkout test/phase-2-3-scenario-2-readme-push
# Make minimal README change
echo "Test: Push auto-commit ($(date))" >> .github/projects/active/workflows-consolidation-2026-q3/README.md
git add .github/projects/active/workflows-consolidation-2026-q3/README.md
git commit -m "test: Phase 2.3 Scenario 2 - Push auto-commit regeneration"
git push -u origin test/phase-2-3-scenario-2-readme-push
```

**PR Creation:** (for tracking purposes)

```bash
gh pr create \
  --title "test(phase-2-3): Scenario 2 - Push auto-commit regeneration" \
  --body "Phase 2.3 test: Regenerate job should auto-commit changes on push" \
  --base develop
```

**Expected Results:**

- ✅ PR created targeting develop
- ✅ documentation.yml workflow triggers on push event
- ✅ regenerate job runs without dry-run
- ✅ Changes auto-committed by workflow
- ✅ Commit message follows convention: `chore(docs): regenerate impacted README files [skip ci]`
- ✅ Artifacts uploaded: documentation-regeneration-*

---

### ✅ Scenario 3: Manual Audit Dispatch

**Trigger:** Workflow dispatch from Actions UI

```bash
gh workflow run documentation.yml \
  -f action=audit \
  -f scope=all
```

**Expected Results:**

- ✅ audit job triggers on workflow_dispatch event
- ✅ All 5 validation sub-jobs run:
  - ✅ Syntax validation
  - ✅ Accessibility validation (accTitle/accDescr)
  - ✅ Colour contrast validation (WCAG 2.2 AA)
  - ✅ Staleness check
  - ✅ Validation outcomes collection
- ✅ Audit report generated
- ✅ Artifacts uploaded: documentation-audit-report-*
- ✅ Step summary shows validation results table

---

### ✅ Scenario 4A & 4B: Manual Maintain Dispatch

**Test 4A - Dry-Run Mode:**

```bash
gh workflow run documentation.yml \
  -f action=maintain \
  -f scope=all \
  -f dry_run=true
```

**Expected Results:**

- ✅ maintain job triggers with dry_run=true
- ✅ Mermaid diagrams analyzed (not committed)
- ✅ Staleness updates calculated (not committed)
- ✅ Preview artifacts generated
- ✅ NO commits created (preview mode)

**Test 4B - Commit Mode:**

```bash
gh workflow run documentation.yml \
  -f action=maintain \
  -f scope=all \
  -f dry_run=false
```

**Expected Results:**

- ✅ maintain job triggers with dry_run=false
- ✅ Mermaid diagrams fixed and committed
- ✅ Staleness updates applied and committed
- ✅ Commit message generated: `docs: maintenance updates (Mermaid + staleness)...`
- ✅ Artifacts uploaded: documentation-maintenance-report-*

---

### ✅ Scenario 5: Conditional Job Execution

**Verification Checklist:**

| Condition | Expected | Verification |
|-----------|----------|--------------|
| PR to develop with `.md` changes | regenerate runs | Check PR checks in Scenario 1 |
| Push to develop with `.md` changes | regenerate runs | Check workflow history for Scenario 2 |
| Dispatch with action=audit | audit runs | Check workflow history for Scenario 3 |
| Dispatch with action=maintain | maintain runs | Check workflow history for Scenario 4 |
| PR to develop with non-.md files | regenerate does NOT run | Path filter working ✓ |
| Dispatch without action param | No job runs | Input validation working ✓ |

---

## Execution Timeline

| Step | Status | Action | Timeline |
|------|--------|--------|----------|
| 1 | ⏳ Pending | PR #1317 merge confirm | Now |
| 2 | ⏳ Pending | Create fresh test branches | After merge |
| 3 | ⏳ Pending | Execute Scenario 1 | 2-3 min |
| 4 | ⏳ Pending | Execute Scenario 2 | 2-3 min |
| 5 | ⏳ Pending | Execute Scenario 3 | 2-3 min |
| 6 | ⏳ Pending | Execute Scenario 4A | 2-3 min |
| 7 | ⏳ Pending | Execute Scenario 4B | 2-3 min |
| 8 | ⏳ Pending | Verify Scenario 5 | 5-10 min |
| 9 | ⏳ Pending | Document results | 10 min |
| 10 | ⏳ Pending | Mark Phase 2.3 complete | Final |

**Total Estimated Time:** 30-50 minutes (mostly waiting for workflows)

---

## Success Criteria

- ✅ All 5 scenarios execute successfully
- ✅ Workflows trigger correctly for all event types
- ✅ Expected outputs match documentation
- ✅ No errors in workflow logs
- ✅ Artifacts uploaded correctly
- ✅ Conditional job execution verified
- ✅ Results documented in PHASE_2_3_INTEGRATION_TESTING.md

---

## Next Steps After Phase 2.3 Complete

1. **Phase 2.3 Sign-Off** ✅
   - Update PHASE_2_3_INTEGRATION_TESTING.md with final results
   - Mark all scenarios PASSED or identify issues

2. **Phase 3 Readiness** ✅
   - PHASE_3_LABELING_CONSOLIDATION_PLAN.md ready
   - 3 workflows identified for consolidation
   - Design complete, ready for implementation

3. **Documentation** ✅
   - Update PROJECT_INDEX.md with Phase 2/3 status
   - Create Phase 3 issues (#3.1-#3.4)
   - Update Epic #1227

---

**Ready to Execute:** After PR #1317 merge confirmation  
**Phase 2.3 Status:** ⏳ READY FOR FRESH EXECUTION
