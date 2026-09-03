---
title: "Phase 4: Automation & Guardrails — Implementation Kickoff"
description: "Execute Phase 4 deliverables: validation workflow, PR-to-changelog linking, review checklist, merge safeguards"
phase: 4
epic: "#1271"
branch: "feat/changelog-phase-4-guardrails"
target_date: "2026-08-07"
file_type: "documentation"
type: "project-documentation"
status: "active"
owner: "lightspeedwp/maintainers"
---

# Phase 4: Automation & Guardrails — Implementation Kickoff

**Status:** 🔄 Active  
**Branch:** `feat/changelog-phase-4-guardrails`  
**Epic:** [#1271](https://github.com/lightspeedwp/.github/issues/1271)  
**Timeline:** 2026-07-24 — 2026-08-07 (40–50 hours)

---

## 📋 Executive Summary

Phase 4 implements automated validation, safeguards, and contributor tooling to prevent future changelog corruption. It includes:

1. **4A: Automated PR-to-Changelog Linking** — Auto-add entries on merge
2. **4B: Maintainer Review Checklist** — 10-item review protocol
3. **4C: Enhanced Merge Safeguards** — Pre/post-write validation & rollback
4. **4D: Integration Testing & Monitoring** — 10 PR test & monitoring dashboard

---

## 📂 Branch Name

```
feat/changelog-phase-4-guardrails
```

Follow CLAUDE.md naming convention: `feat/` (type) + `changelog-phase-4-guardrails` (scope-title)

---

## 🎯 Sub-Task Breakdown

### **4A: Automated PR-to-Changelog Linking**

**GitHub Issue:** [#1316](https://github.com/lightspeedwp/.github/issues/1316)  
**Estimated:** 8–10 hours  
**Trigger:** On PR merge to develop

#### Objective

Auto-add changelog entries on merge if criteria are met:

- PR has `changelog:included` label OR
- PR title matches changelog-worthy pattern (feat/, fix/, etc.) OR
- User explicitly added CHANGELOG.md entry

#### Deliverables

1. **Script:** `scripts/workflows/changelog/auto-link-pr.cjs` (new)
   - Read PR metadata (title, labels, changed files)
   - Check if CHANGELOG.md was modified
   - If not, attempt to auto-generate entry based on PR title
   - Add to [Unreleased] section
   - Run validation before write

2. **Workflow Integration:** Extend `.github/workflows/changelog-automation.yml`
   - Trigger on PR merge event
   - Call `auto-link-pr.cjs`
   - Report success/skip in commit comment

3. **Test Cases:** 5 PR scenarios
   - PR with `changelog:included` label
   - PR with `feat/` prefix (auto-match)
   - PR with manual CHANGELOG.md entry (skip auto-generation)
   - PR with `chore/` prefix (skip)
   - PR with neither label nor pattern match (skip)

4. **Documentation:** Update PR template guidance
   - Add optional section: "Changelog Entry (if applicable)"
   - Checklist for manual entry
   - Guidance on using `changelog:included` label

#### Implementation Steps

1. Create `scripts/workflows/changelog/auto-link-pr.cjs`
2. Add extraction logic (PR title, labels, changed files)
3. Implement auto-generation from PR title
4. Call existing validation rules
5. Write entry if valid, skip if not
6. Add 5 test cases
7. Update `.github/PULL_REQUEST_TEMPLATE/` with guidance
8. Document in `CHANGELOG_GUIDELINES.md`

---

### **4B: Maintainer Review Checklist**

**GitHub Issue:** [#1317](https://github.com/lightspeedwp/.github/issues/1317)  
**Estimated:** 4–6 hours  
**When:** Before merging PRs that touch CHANGELOG.md

#### Objective

Create a 10-item checklist for maintainers to verify changelog entries before merge.

#### Deliverables

1. **Document:** `CHANGELOG_REVIEW_CHECKLIST.md` (new)

   ```markdown
   # Changelog Entry Review Checklist
   
   Before merging a PR that touches CHANGELOG.md, verify:
   
   - [ ] All entries are user-facing (not internal refactor, docs-only, test-only)
   - [ ] All entries are concise (1-2 sentences, <150 chars)
   - [ ] All PR/issue links are valid and formatted correctly
   - [ ] Section headers are correct (### Added, ### Fixed, etc.)
   - [ ] No duplicate entries exist in [Unreleased]
   - [ ] Entries follow format: `- **Title** — description ([PR #N](url))`
   - [ ] Referenced PRs/issues actually exist and are accurate
   - [ ] No internal jargon without explanation
   - [ ] Date/version frontmatter is correct (if applicable)
   - [ ] Credit section lists all contributors
   ```

2. **Integration:** Add to PR review comment template
   - Post checklist as review guide
   - Flag for review if CHANGELOG.md modified

3. **Automation:** Optional comment bot
   - Detect CHANGELOG.md changes
   - Post checklist as reminder in PR comments

4. **Documentation:** Link from `CHANGELOG_GUIDELINES.md`
   - Include in maintainer runbook
   - Link from CLAUDE.md process docs

#### Implementation Steps

1. Create `CHANGELOG_REVIEW_CHECKLIST.md`
2. Add to PR template as optional link
3. Document in maintainer workflow (if exists)
4. Test with 3 sample PRs

---

### **4C: Enhanced Merge Safeguards**

**GitHub Issue:** [#1318](https://github.com/lightspeedwp/.github/issues/1318)  
**Estimated:** 12–16 hours  
**Location:** `scripts/workflows/changelog/merge-entries.cjs`

#### Objective

Harden the changelog merge script against corruption:

- Pre-write validation (all rules pass)
- Backup mechanism (snapshot before changes)
- Post-write verification (verify correctness)
- Rollback instructions (recovery guidance)
- Enhanced logging (audit trail)

#### Deliverables

1. **Pre-Write Validation**
   - Run all rules before write:
     - Entry format validation
     - Link validation (PR/issue URLs exist)
     - Section header correctness
     - No duplicate entries
     - Max verbosity check
   - **Fail if any rule violated**
   - Log violations to console

2. **Backup Mechanism**
   - Before writing, create backup:

     ```bash
     cp CHANGELOG.md CHANGELOG.md.backup-{timestamp}
     ```

   - Store in same directory
   - Keep last 5 backups
   - Document recovery procedure

3. **Post-Write Verification**
   - After write, re-validate file:
     - File exists and is readable
     - Frontmatter is valid
     - All sections parse correctly
     - No syntax errors
   - On failure: restore from backup, throw error

4. **Rollback Instructions**
   - On error, output recovery steps:

     ```
     Error: Changelog merge failed. Recovery steps:
     1. Restore from backup: cp CHANGELOG.md.backup-{timestamp} CHANGELOG.md
     2. Run validation: npm run validate:changelog
     3. Review CHANGELOG_GUIDELINES.md
     4. Create new PR with corrected entry
     ```

5. **Enhanced Logging**
   - Log to `scripts/logs/changelog-merge.log`:
     - Start/end times
     - Files processed
     - Validation results
     - Entries added/modified
     - Any errors/warnings
   - Include in CI artifact uploads

6. **Test Cases**
   - Test backup creation & restoration
   - Test validation failure & rollback
   - Test post-write verification
   - Test logging output

#### Implementation Steps

1. Update `merge-entries.cjs` with validation hooks
2. Add backup mechanism (copy + cleanup)
3. Implement post-write verification
4. Create rollback instruction generator
5. Add logging to dedicated log file
6. Create 6 test scenarios (normal, failures, recovery)
7. Document in `CHANGELOG_GUIDELINES.md` → Recovery section

---

### **4D: Integration Testing & Monitoring**

**GitHub Issue:** [#1319](https://github.com/lightspeedwp/.github/issues/1319)  
**Estimated:** 16–20 hours  
**When:** After 4A, 4B, 4C deployed

#### Objective

Monitor 10 PRs to verify:

- Automated linking works correctly
- Validation catches errors
- No failures occur
- All links remain valid
- Section structure is preserved

#### Deliverables

1. **Test Plan Document**
   - 10 PR scenarios to monitor:
     1. Feature PR with auto-link (should add entry)
     2. Bug fix with auto-link (should add entry)
     3. Chore PR (should skip auto-link)
     4. PR with manual CHANGELOG entry (should validate only)
     5. PR with invalid entry format (should fail validation)
     6. PR with duplicate entry (should fail validation)
     7. PR with broken link (should fail validation)
     8. PR with verbose entry (should fail validation)
     9. PR with non-changelog content (should fail validation)
     10. PR with multiple entries (should validate all)

2. **Monitoring Dashboard**
   - Document: `.github/projects/active/changelog-automation-hardening/PHASE_4_MONITORING.md`
   - Track each PR:
     - PR number & title
     - Auto-link attempted? Y/N
     - Validation passed? Y/N
     - Entry added? Y/N
     - All links valid? Y/N
     - Date/time
   - Summary stats:
     - Total PRs monitored
     - Success rate (%)
     - Failures (count + details)
     - Average processing time

3. **Failure Response Protocol**
   - If validation fails:
     1. Check PR for issues
     2. Comment with specific errors
     3. Suggest corrected format
     4. Require user to fix before merge
   - Log all failures for post-analysis

4. **Success Criteria** (all must pass)
   - ✅ 10/10 PRs processed successfully
   - ✅ 0 validation failures
   - ✅ 0 broken links
   - ✅ 0 section corruption
   - ✅ 100% auto-link accuracy (when applicable)

#### Implementation Steps

1. Create test plan document
2. Set up monitoring spreadsheet/dashboard
3. Execute 10 PR test scenarios
4. Log results (success/failure, reasons)
5. Document any issues found
6. Generate monitoring report
7. Close Phase 4D issue when all tests pass

---

## 🔄 Workflow: Creating Issues & Completing Phases

### Step 1: Create GitHub Issues (4A–4D)

Create 4 new issues on GitHub, linked to Epic #1271:

**Template for each:**

```markdown
---
## Issue Title
Phase 4X: [Deliverable Name]

## Description
[Copy from corresponding section above: 4A, 4B, 4C, or 4D]

## Objective
[Copy from section]

## Deliverables
[Copy from section]

## Related
- Epic: #1271
- Related Phase issues: #1275, #1272, #1273
- Branch: feat/changelog-phase-4-guardrails

## Labels
- `changelog`
- `automation`
- `phase-4`
- `epic:#1271`
```

### Step 2: Close Completed Phase Issues

**Issues to close with completion notes:**

| Issue | Phase | Completion Note |
|-------|-------|-----------------|
| #1275 | 1 | Section header preservation verified in 3+ merges; fix stable |
| #1272 | 2 | 127 entries recovered & merged; [Unreleased] complete |
| #1273 | 3 | Guidelines deployed; contributor checklist active |
| #1314 | 2.5 | 51 additional entries recovered; merge complete |

**Closure steps:**

1. Add comment with completion note
2. Add `status:complete` label (if exists)
3. Close issue

### Step 3: Implement 4A–4D in Parallel

Use branch `feat/changelog-phase-4-guardrails` for all work:

```bash
git checkout feat/changelog-phase-4-guardrails
# Implement 4A, 4B, 4C, 4D in feature branches or commits
# Commit regularly with clear messages
git push origin feat/changelog-phase-4-guardrails
```

### Step 4: Create PR & Merge

When all 4A–4D deliverables are complete:

1. **Create PR** from `feat/changelog-phase-4-guardrails` → `develop`
2. **Use template:** `pr_feature.md` (from PULL_REQUEST_TEMPLATE/config.yml)
3. **Link issues:** #1316, #1317, #1318, #1319
4. **Merge when approved** (squash merge recommended)
5. **Close branch** after merge

### Step 5: Mark Phase 4 Complete

After PR merges:

1. **Update PROJECT_PLAN.md**

   ```markdown
   | Phase 4 | Automation setup | ✅ Complete | #1316-#1319 | 2026-08-07 |
   | **Epic** | **All phases** | **✅ Complete** | **#1271** | **2026-08-14** |
   ```

2. **Update README.md**

   ```markdown
   | 4 | Validation & guardrails | ✅ Complete | #1316–#1319 | 2026-08-07 |
   ```

3. **Close Epic #1271** with completion note:

   ```
   ✅ All 4 phases complete!
   - Phase 1: Fix automation ✅
   - Phase 2: Rebuild history ✅  
   - Phase 3: Rules & guidelines ✅
   - Phase 4: Validation & guardrails ✅
   
   Ready for v1.0 release.
   ```

---

## 📊 Success Criteria

### Quality Gates

All must be true to mark Phase 4 complete:

- ✅ **Script:** `auto-link-pr.cjs` deployed & tested (5 scenarios)
- ✅ **Checklist:** `CHANGELOG_REVIEW_CHECKLIST.md` documented & integrated
- ✅ **Safeguards:** `merge-entries.cjs` hardened with backup, validation, logging
- ✅ **Testing:** 10 PR scenarios monitored; 0 failures
- ✅ **Documentation:** All guidelines updated with Phase 4 changes

### Success Metrics

| Metric | Target | Status |
|--------|--------|--------|
| 0 broken links | 0 | Verify with validation |
| 0 verbose entries | 0 | Enforce in validation |
| Auto-link accuracy | 100% | Test on 10 PRs |
| Validation failure rate | 0% | Monitor 10 PRs |
| Merge safeguards | Deployed | Check merge-entries.cjs |
| Documentation complete | 100% | Review all guides |

---

## 📅 Timeline & Estimates

| Task | Estimate | Start | End | Owner |
|------|----------|-------|-----|-------|
| 4A: Auto-linking | 8–10h | 2026-07-24 | 2026-07-27 | Team |
| 4B: Review checklist | 4–6h | 2026-07-25 | 2026-07-27 | Team |
| 4C: Merge safeguards | 12–16h | 2026-07-26 | 2026-07-31 | Team |
| 4D: Testing & monitoring | 16–20h | 2026-08-01 | 2026-08-07 | Team |
| **Total** | **40–50h** | **2026-07-24** | **2026-08-07** | **Team** |

---

## 🔗 Related Documentation

- **[PROJECT_PLAN.md](./PROJECT_PLAN.md)** — Full strategic overview
- **[README.md](./README.md)** — Quick reference & status
- **[CHANGELOG_GUIDELINES.md](./CHANGELOG_GUIDELINES.md)** — Entry format & rules
- **[EXECUTION_PROMPT.md](./EXECUTION_PROMPT.md)** — Quick checklist

---

## ✅ Pre-Implementation Checklist

Before starting Phase 4:

- [ ] All Phase 1–3 issues closed (#1275, #1272, #1273, #1314)
- [ ] Branch created: `feat/changelog-phase-4-guardrails`
- [ ] GitHub issues 4A–4D created & linked to #1271
- [ ] PROJECT_PLAN.md updated with Phase 4 status
- [ ] README.md updated with Phase 4 links
- [ ] Team members assigned to 4A–4D
- [ ] This document reviewed & understood
- [ ] Changelog GUIDELINES reviewed (reference during implementation)

---

## 🚀 Getting Started

1. **Read this document** ← You are here
2. **Create issues** for 4A–4D (link to #1271)
3. **Close Phase 1–3 issues** with completion notes
4. **Start implementation** of 4A in parallel with 4B
5. **Monitor progress** via branch commits
6. **Test Phase 4D** after 4A, 4B, 4C deployed
7. **Create final PR** when all deliverables complete
8. **Close Epic #1271** when merged

---

## 📞 Questions & Support

- **Stuck on 4A?** Check `scripts/workflows/changelog/` for similar script patterns
- **Stuck on 4B?** Review existing checklists in `.github/` for format examples
- **Stuck on 4C?** Check `merge-entries.cjs` for existing validation hooks
- **Stuck on 4D?** Create monitoring doc in same folder as PROJECT_PLAN.md

---

**Phase 4 Kickoff Created:** 2026-07-24  
**Branch:** `feat/changelog-phase-4-guardrails`  
**Status:** 🔄 Ready to Implement
