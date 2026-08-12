---
name: GitHub Actions v7 Upgrade — Execution Plan
type: plan
version: 1.0
status: draft
author: claude
date: 2026-08-09
---

# GitHub Actions v7 Upgrade — Detailed Execution Plan

## Quick Reference

| Phase | Duration | Scope | Status |
|-------|----------|-------|--------|
| **1. Audit & Planning** | 2 days | 45 workflows scanned, issues created | 🔄 IN PROGRESS |
| **2. Badge Workflows** | 2 days | 4 files, invalid SHAs → v7 | Planned |
| **3. Standard Workflows** | 3 days | 6 files, v4/v5 → v7 (3 PRs) | Planned |
| **4. Consistency & Minor** | 3 days | Edge cases, final validation | Planned |
| **5. Integration & Closure** | 5 days | E2E testing, documentation, close | Planned |
| **TOTAL** | ~15 days | 45 workflows ✅ | Estimate |

---

## Phase 1: Audit & Planning (Days 1-2)

### 1.1 Audit All Workflows

**Status:** ✅ COMPLETE

**Executed:**

```bash
# Audit results:
# - 45 workflows total
# - 31 on v7 (68%)
# - 14 require updates (32%)
# - 8 invalid SHA references
# - 6 workflows with v4/v5 pins
```

**Findings:**

1. **4 Badge Workflows** (invalid SHAs):
   - `badges-readme-status.yml` — checkout, setup-node SHAs
   - `badges-health-check.yml` — checkout, setup-node SHAs
   - `badges-documentation-update.yml` — checkout, setup-node SHAs
   - `badges-workflow-audit.yml` — checkout, setup-node SHAs

2. **6 Standard Workflows** (v4/v5 pins):
   - `cleanup-branches.yml` — v4
   - `issue-labeling-automation.yml` — v4
   - `release.yml` — v4
   - `template-enforcement.yml` — v4
   - `validate-pr-template.yml` — v4
   - `awesome-github-site.yml` — v5

3. **Edge Cases:**
   - `upload-artifact@v4` (22 instances) — v4 is stable, check if upgrade needed
   - `create-github-app-token` — mix of v2/v3, standardise
   - `deploy-pages@v5` — v5 is stable, keep as-is

### 1.2 Create Planning Documents

**Status:** ✅ COMPLETE

**Deliverables:**

- ✅ PROJECT_README.md — Overview, timeline, metrics
- ✅ OPENSPEC_ANALYSIS.md — Formal specification, RFC
- ✅ UPGRADE_PLAN.md — This file

### 1.3 Create GitHub Issues

**Status:** 🔄 IN PROGRESS (next step)

**Issues to create:**

1. **Epic:** GitHub Actions v7 Upgrade Initiative
   - Title: `GitHub Actions v7 Upgrade Initiative`
   - Type: `epic`
   - Labels: `type:feature`, `area:ci`, `priority:important`
   - Milestone: (TBD)
   - Description: References PROJECT_README.md

2. **Child Issues (5):**

   **Issue #1 — Phase 1: Audit & Planning**
   - Type: `task`
   - Status: In Progress
   - Assigned to: claude
   - DoR: Workflows audited, findings documented
   - DoD: Planning docs created, child issues created

   **Issue #2 — Phase 2: Badge Workflows Upgrade**
   - Type: `task`
   - Status: Planned
   - Scope: 4 badge workflow files
   - DoR: OPENSPEC reviewed, files identified
   - DoD: PR merged, Phase 4 integration tests pass

   **Issue #3 — Phase 3A: Automation Workflows Upgrade**
   - Type: `task`
   - Scope: cleanup-branches, issue-labeling-automation
   - DoR: Files identified, validation plan ready
   - DoD: PR merged, CI passes

   **Issue #4 — Phase 3B: Release & Template Workflows**
   - Type: `task`
   - Scope: release, template-enforcement, validate-pr-template
   - DoR: Files identified, validation plan ready
   - DoD: PR merged, CI passes

   **Issue #5 — Phase 3C: Site Generation Workflow**
   - Type: `task`
   - Scope: awesome-github-site
   - DoR: File identified, upgrade validated
   - DoD: PR merged, CI passes

   **Issue #6 — Phase 4: Consistency & Final Validation**
   - Type: `task`
   - Scope: Edge cases (upload-artifact, create-github-app-token, deploy-pages)
   - DoR: Phase 3 complete, edge cases identified
   - DoD: All workflows consistent, CI passes

   **Issue #7 — Phase 5: Integration Testing & Closure**
   - Type: `task`
   - Scope: Full validation, documentation, project closure
   - DoR: Phase 4 complete, ready for E2E testing
   - DoD: Phase 4 integration tests pass, project archived

### 1.4 Rename Branch (Pre-PR)

**Status:** Pending

**Action:** Rename current worktree branch from `claude/github-actions-v7-upgrade-828690` to `feat/github-actions-v7-upgrade`

**Rationale:** CLAUDE.md forbids `claude/` prefix; must follow `{type}/{scope}-{short-title}` pattern

```bash
git branch -m claude/github-actions-v7-upgrade-828690 feat/github-actions-v7-upgrade
```

---

## Phase 2: Badge Workflows Upgrade (Days 3-4)

### 2.1 Files to Update

1. `.github/workflows/badges-readme-status.yml`
2. `.github/workflows/badges-health-check.yml`
3. `.github/workflows/badges-documentation-update.yml`
4. `.github/workflows/badges-workflow-audit.yml`

### 2.2 Changes Required

**For each file, update:**

```yaml
# ❌ BEFORE
- uses: actions/checkout@6d0aea72b9a5f25ac9f0adfbbad656007faf0907 # v4.2.0
- uses: actions/setup-node@1e60f620b9541d910af73a0410c36514fad91657 # v4.0.3

# ✅ AFTER
- uses: actions/checkout@v7
- uses: actions/setup-node@v7
```

### 2.3 Execution Steps

1. **Update files:**

   ```bash
   # For each badge workflow file:
   sed -i 's/@6d0aea72b9a5f25ac9f0adfbbad656007faf0907/@v7/g' .github/workflows/badges-*.yml
   sed -i 's/@1e60f620b9541d910af73a0410c36514fad91657/@v7/g' .github/workflows/badges-*.yml
   ```

2. **Verify changes:**

   ```bash
   grep -n "checkout\|setup-node" .github/workflows/badges-*.yml
   # Should show all v7 references
   ```

3. **Run validation:**
   - Full CI/CD suite on develop
   - Verify workflows trigger correctly

4. **Create PR:**
   - Title: `fix: Upgrade badge workflows to GitHub Actions v7`
   - Template: `pr_bug.md` (fixing invalid SHAs)
   - Link to Epic #[TBD]
   - Link to Issue #1641 (Badges Phase 4)
   - Add CHANGELOG entry

5. **Merge to develop:**
   - Use squash merge
   - Delete branch after merge

### 2.4 Validation Checklist

- [ ] All 4 badge files updated
- [ ] No invalid SHA references remain
- [ ] CI/CD passes on develop
- [ ] Badges Phase 4 integration tests pass
- [ ] PR merged successfully
- [ ] Branch deleted

---

## Phase 3: Standard Workflow Upgrades (Days 5-7)

### 3.1 Group A: Automation Workflows (Days 5-6)

**Files:**

1. `.github/workflows/cleanup-branches.yml`
2. `.github/workflows/issue-labeling-automation.yml`

**Changes:**

```yaml
# ❌ BEFORE
uses: actions/checkout@v4
uses: actions/setup-node@v4

# ✅ AFTER
uses: actions/checkout@v7
uses: actions/setup-node@v7
```

**Execution:**

1. Update both files (find/replace)
2. Run full CI/CD validation
3. Create PR: `chore: Upgrade automation workflows to GitHub Actions v7`
4. Merge to develop
5. Delete branch

### 3.2 Group B: Release & Template Workflows (Days 6-7)

**Files:**

1. `.github/workflows/release.yml`
2. `.github/workflows/template-enforcement.yml`
3. `.github/workflows/validate-pr-template.yml`

**Changes:**

```yaml
# Same as Group A
uses: actions/checkout@v4 → @v7
uses: actions/setup-node@v4 → @v7
```

**Execution:**

1. Update all 3 files
2. Run full CI/CD validation
3. Create PR: `chore: Upgrade release & template workflows to GitHub Actions v7`
4. Merge to develop
5. Delete branch

### 3.3 Group C: Site Generation Workflow (Day 7)

**Files:**

1. `.github/workflows/awesome-github-site.yml`

**Changes:**

```yaml
uses: actions/setup-node@v5 → @v7
```

**Execution:**

1. Update file
2. Run full CI/CD validation
3. Create PR: `chore: Upgrade site generation workflow to GitHub Actions v7`
4. Merge to develop
5. Delete branch

### 3.4 Phase 3 Validation

- [ ] All 6 files updated
- [ ] All v4/v5 pins replaced with v7
- [ ] 3 separate PRs created and merged
- [ ] Full CI/CD passes after each PR merge

---

## Phase 4: Consistency & Final Validation (Days 8-10)

### 4.1 Audit Edge Cases

**Review:**

1. **`upload-artifact@v4`** (22 instances)
   - Check if v5+ available
   - If v5+ available and compatible, create upgrade PR
   - If v4 is stable, document and mark as complete

2. **`create-github-app-token`** (mix of v2/v3)
   - Standardise to v2 (stable) or upgrade to v3
   - Create PR if standardisation needed

3. **`deploy-pages@v5`** (1 instance)
   - v5 is stable, no upgrade needed
   - Mark as complete

4. **`github-script`** (mix of v7/v9)
   - v7 is standard (42/43 instances)
   - Check if v9 has breaking changes
   - If safe, upgrade remaining v9 references to v7

### 4.2 Final Audit Run

```bash
# Verify no invalid SHAs remain
grep -rn "6d0aea72\|1e60f620" .github/workflows/
# Should output: 0 results

# Verify no v4 checkout
grep -rn "checkout@v4" .github/workflows/
# Should output: 0 results

# Verify no v4/v5 setup-node (except edge cases)
grep -rn "setup-node@v4\|setup-node@v5" .github/workflows/
# Should output: 0 results
```

### 4.3 Consistency Report

Document findings in `CONSISTENCY_REPORT.md`:

- ✅ All critical issues fixed
- ✅ All standard workflows upgraded
- ⚠️ Edge cases (if any)
- ✅ Ready for integration testing

### 4.4 Phase 4 Validation

- [ ] No invalid SHAs remain
- [ ] No v4 checkout references
- [ ] No v4 setup-node references (except edge cases)
- [ ] Consistency report created
- [ ] Ready for Phase 5

---

## Phase 5: Integration Testing & Closure (Days 11-15)

### 5.1 Full Integration Testing

**Tests to run:**

1. **CI/CD Pipeline:**
   - [ ] Trigger all 45 workflows
   - [ ] Verify all workflows pass
   - [ ] Check workflow run times (no significant change expected)
   - [ ] Verify GitHub Actions cache still works

2. **Badges Phase 4 Integration:**
   - [ ] Badges workflow schema validation ✅
   - [ ] Badge status workflows pass ✅
   - [ ] Documentation generation succeeds ✅
   - [ ] Health checks pass ✅

3. **Release Workflow:**
   - [ ] Trigger release workflow
   - [ ] Verify CHANGELOG generation
   - [ ] Verify tag creation

### 5.2 Documentation Updates

**Update files:**

1. **CHANGELOG.md**

   ```markdown
   ## [Unreleased]

   ### Changed
   - chore: Upgrade all GitHub Actions workflows to v7 (#[TBD])
     - Replaced invalid SHA references in badge workflows
     - Upgraded 6 standard workflows from v4/v5 to v7
     - Standardised action versions across 45 total workflows
   ```

2. **docs/AUTOMATION.md** (if exists)
   - Document standard action versions (v7 for checkout, setup-node)
   - Update any action troubleshooting guides

3. **docs/CI-CD.md** (if exists)
   - Document CI/CD workflow updates
   - Update action version matrix

### 5.3 Final Report

**Create `FINAL_REPORT.md` with:**

- ✅ Audit results (before/after)
- ✅ Files updated (45 workflows)
- ✅ Invalid SHAs fixed (8 references)
- ✅ Standard workflows upgraded (6 files)
- ✅ Edge cases handled (upload-artifact, etc.)
- ✅ CI/CD validation passed
- ✅ Phase 4 integration tests passed
- ✅ Documentation updated
- 📊 Metrics: Upgrade time, files changed, lines modified

### 5.4 Project Closure

1. **Archive project:**

   ```bash
   mv .github/projects/active/github-actions-v7-upgrade-2026-08-09 \
      .github/projects/archive/github-actions-v7-upgrade-2026-08-09-completed
   ```

2. **Close Epic issue:**
   - Mark as complete
   - Link final report

3. **Close all child issues:**
   - Mark as completed
   - Link to merged PRs

4. **Merge final PR (if any):**
   - Merge CHANGELOG and documentation updates
   - Ensure all PRs are merged to develop

### 5.5 Phase 5 Validation

- [ ] All workflows pass CI/CD
- [ ] Badges Phase 4 integration tests pass
- [ ] Release workflow validated
- [ ] Documentation updated
- [ ] CHANGELOG updated
- [ ] Project archived
- [ ] Epic and all child issues closed

---

## Success Metrics

### Quantitative

| Metric | Target | Status |
|--------|--------|--------|
| Workflows updated | 14 / 45 (31%) | In Progress |
| Invalid SHAs fixed | 8 / 8 (100%) | In Progress |
| v4/v5 → v7 upgrades | 6 / 6 (100%) | In Progress |
| PRs created | 5-7 | Planned |
| CI/CD passes | 100% | Planned |
| Phase 4 tests pass | 100% | Planned |

### Qualitative

✅ **Success:**

- All workflows running with valid, maintained action versions
- No security concerns from outdated actions
- Consistent version pins across workflows
- Badges feature Phase 4 unblocked and passing tests
- Clear documentation of upgrade process

---

## Risk Mitigation & Rollback

### If Issues Arise

1. **Minor issues** (e.g., formatting):
   - Fix and re-push to branch
   - Re-merge PR

2. **Breaking changes** (e.g., workflow fails with v7):
   - Revert PR
   - Investigate root cause
   - Create issue for investigation
   - Re-attempt after fixing

3. **Merge conflicts:**
   - Resolve conflicts on branch
   - Re-run CI/CD
   - Re-merge

### Rollback Procedure

If entire Phase 2-3 needs to rollback:

```bash
git log --oneline | grep "GitHub Actions v7"
# Find latest affected commit
git revert -m 1 {commit-hash}
git push origin feat/github-actions-v7-upgrade
```

---

## Timeline & Checkpoints

```
Day 1-2:   Phase 1 (Audit & Planning) ✅
Day 2-3:   Create issues, rename branch
Day 3-4:   Phase 2 (Badge Workflows)
Day 5-7:   Phase 3 (Standard Workflows)
Day 8-10:  Phase 4 (Consistency & Validation)
Day 11-15: Phase 5 (Integration & Closure)

Target: Complete by 2026-08-23
```

---

## Approvals & Sign-off

**Phase 1 Review:** (Awaiting stakeholder feedback)

- [ ] Audit findings approved
- [ ] Scope and timeline approved
- [ ] Phasing strategy approved
- [ ] Risk assessment acknowledged

**Phase 2-5 Reviews:** (Before each phase)

- [ ] Phase checklist reviewed
- [ ] Changes validated
- [ ] Ready for PR/merge

---

**Status:** Draft (awaiting Phase 1 completion and stakeholder approval)  
**Last updated:** 2026-08-09  
**Next step:** Create GitHub issues and complete Phase 1
