# GitHub Issues Checklist

**Project:** Branch Naming Enforcement Workflow  
**Parent Epic:** [#1755 - Branch Naming Enforcement Workflow](https://github.com/lightspeedwp/.github/issues/1755)  
**Status:** 🚀 All issues created and linked  
**Last Updated:** 2026-08-11

## Issue Roadmap

### 📋 Initiative & Planning

- [**#1755**](https://github.com/lightspeedwp/.github/issues/1755) — [Initiative] Branch Naming Enforcement Workflow
  - **Type:** Epic  
  - **Status:** 🚀 Active  
  - **Parent:** None (initiative root)  
  - **Description:** Master epic coordinating all implementation phases

---

### 🔧 Phase 2: Validation Script Implementation

- [**#1756**](https://github.com/lightspeedwp/.github/issues/1756) — [Phase 2.1] Create branch name validation script
  - **Type:** Task  
  - **Status:** ⏳ Ready  
  - **Parent:** #1755  
  - **Depends On:** None  
  - **Effort:** 2 hours  
  - **Description:** Node.js validation script with CLI interface  
  - **Deliverables:** `.github/scripts/validation/validate-branch-name.cjs`  

---

- [**#1757**](https://github.com/lightspeedwp/.github/issues/1757) — [Phase 2.2] Write unit tests for validation script
  - **Type:** Testing  
  - **Status:** ⏳ Ready  
  - **Parent:** #1755  
  - **Depends On:** #1756 (Phase 2.1)  
  - **Effort:** 3 hours  
  - **Description:** Jest tests for validation script (50+ test cases)  
  - **Deliverables:** `.github/scripts/validation/__tests__/validate-branch-name.test.js`  

---

### 🎣 Phase 3: Pre-Commit Hook

- [**#1758**](https://github.com/lightspeedwp/.github/issues/1758) — [Phase 3.1] Create pre-commit hook for branch name validation
  - **Type:** Task  
  - **Status:** ⏳ Ready  
  - **Parent:** #1755  
  - **Depends On:** #1756 (Phase 2.1)  
  - **Effort:** 2 hours  
  - **Description:** Bash pre-commit hook with local validation  
  - **Deliverables:** `.github/hooks/pre-commit`  

---

- [**#1759**](https://github.com/lightspeedwp/.github/issues/1759) — [Phase 3.2–3.3] Setup command and multi-platform testing
  - **Type:** Task  
  - **Status:** ⏳ Ready  
  - **Parent:** #1755  
  - **Depends On:** #1758 (Phase 3.1)  
  - **Effort:** 5 hours (2h setup + 3h testing)  
  - **Description:** npm setup:hooks command + macOS/Linux/Windows testing  
  - **Deliverables:**
    - npm script in `package.json`
    - Testing on 3 platforms
    - Setup documentation

---

### 🚀 Phase 4: GitHub Actions Workflow

- [**#1760**](https://github.com/lightspeedwp/.github/issues/1760) — [Phase 4.1–4.2] GitHub Actions workflow and testing
  - **Type:** Task  
  - **Status:** ⏳ Ready  
  - **Parent:** #1755  
  - **Depends On:** #1756 (Phase 2.1)  
  - **Effort:** 5 hours (2h workflow + 3h testing)  
  - **Description:** PR validation workflow with mandatory status check  
  - **Deliverables:**
    - `.github/workflows/branch-name-validation.yml`
    - Workflow tests (valid/invalid branches)
    - PR comment on failure

---

### 📚 Phase 5: Documentation

- [**#1761**](https://github.com/lightspeedwp/.github/issues/1761) — [Phase 5.1–5.3] Documentation (setup guide and troubleshooting)
  - **Type:** Documentation  
  - **Status:** ⏳ Ready  
  - **Parent:** #1755  
  - **Depends On:** All phases 2–4  
  - **Effort:** 4.5 hours  
  - **Description:** Setup guide, BRANCHING_STRATEGY.md updates, troubleshooting  
  - **Deliverables:**
    - `docs/SETUP_BRANCH_VALIDATION.md`
    - Updated `docs/BRANCHING_STRATEGY.md`
    - Troubleshooting guide

---

### 🌍 Phase 6: Rollout & Monitoring

- [**#1762**](https://github.com/lightspeedwp/.github/issues/1762) — [Phase 6] Team rollout, deployment, and monitoring
  - **Type:** Task  
  - **Status:** ⏳ Ready  
  - **Parent:** #1755  
  - **Depends On:** All phases 2–5  
  - **Effort:** 4 hours/week (ongoing)  
  - **Description:** Workflow deployment, team announcement, monitoring metrics  
  - **Key Activities:**
    - Configure as required status check
    - Send team announcement
    - Track adoption & violation metrics
    - Collect feedback

---

## Dependency Graph

```
#1755 (Initiative Epic)
  ├── #1756 (Phase 2.1: Validation Script)
  │   ├── #1757 (Phase 2.2: Unit Tests)
  │   ├── #1758 (Phase 3.1: Pre-Commit Hook)
  │   │   └── #1759 (Phase 3.2–3.3: Setup & Testing)
  │   └── #1760 (Phase 4: Workflow)
  └── #1761 (Phase 5: Documentation) — Depends on all phases
      └── #1762 (Phase 6: Rollout) — Depends on all phases
```

## Progress Tracking

### Overall Project Progress

| Phase | Component | Issue | Status | Progress |
| --- | --- | --- | --- | --- |
| 1 | Spec & Planning | #1755 | ✅ Complete | 100% |
| 2 | Validation Script | #1756 | ⏳ Ready | 0% |
| 2 | Unit Tests | #1757 | ⏳ Blocked by #1756 | 0% |
| 3 | Pre-Commit Hook | #1758 | ⏳ Ready | 0% |
| 3 | Setup & Testing | #1759 | ⏳ Blocked by #1758 | 0% |
| 4 | Workflow & Tests | #1760 | ⏳ Ready | 0% |
| 5 | Documentation | #1761 | ⏳ Blocked by phases 2–4 | 0% |
| 6 | Rollout & Monitoring | #1762 | ⏳ Blocked by phase 5 | 0% |

### Timeline

- **Phase 1:** 2026-08-11 (Complete)
- **Phase 2:** 2026-08-12 (5 hours)
- **Phase 3:** 2026-08-12 (7 hours)
- **Phase 4:** 2026-08-13 (5 hours)
- **Phase 5:** 2026-08-13 (4.5 hours)
- **Phase 6:** 2026-08-14+ (4 hours/week)

**Total Effort:** ~30 hours (split across team)

---

## Critical Path

1. **#1756** (Phase 2.1) — Validation script *must* be created first
   - All other components depend on this
   - Effort: 2 hours

2. **#1757** (Phase 2.2) → Parallel with other phases
   - Tests validation script
   - Can run alongside #1758, #1760
   - Effort: 3 hours

3. **#1758** (Phase 3.1) → **#1759** (Phase 3.2–3.3)
   - Hook must be created before testing
   - Sequential dependency
   - Total Effort: 7 hours

4. **#1760** (Phase 4)
   - Can start in parallel with Phase 3
   - Depends on #1756
   - Effort: 5 hours

5. **#1761** (Phase 5)
   - Blocker for rollout
   - Depends on all phases 2–4
   - Effort: 4.5 hours

6. **#1762** (Phase 6)
   - Final phase
   - Requires completion of Phase 5
   - Ongoing monitoring

---

## Issue Labels

All issues include these labels:

| Label | Purpose |
| --- | --- |
| `type:task` | Task, implementation work |
| `type:testing` | Testing & QA |
| `type:documentation` | Documentation |
| `area:ci` | CI/CD & automation |
| `priority:important` | High priority |
| `meta:needs-changelog` | Requires changelog entry |

---

## Interlinking & Cross-References

### Parent-Child Relationships

| Parent | Child | Type |
| --- | --- | --- |
| #1755 | #1756 | Epic ⇒ Task |
| #1755 | #1757 | Epic ⇒ Testing |
| #1755 | #1758 | Epic ⇒ Task |
| #1755 | #1759 | Epic ⇒ Task |
| #1755 | #1760 | Epic ⇒ Task |
| #1755 | #1761 | Epic ⇒ Documentation |
| #1755 | #1762 | Epic ⇒ Task |

### Dependency Relationships

| Blocker | Blocked | Type |
| --- | --- | --- |
| #1756 | #1757 | Depends On (test needs script) |
| #1756 | #1758 | Depends On (hook needs validation) |
| #1756 | #1760 | Depends On (workflow needs validation) |
| #1758 | #1759 | Depends On (testing needs hook) |
| #1756–#1760 | #1761 | Depends On (docs need implementation) |
| #1761 | #1762 | Depends On (rollout needs docs) |

---

## How to Use This Document

### For Daily Work

1. Find your assigned issue(s) in the table above
2. Click the issue link to open it in GitHub
3. Check the description and acceptance criteria
4. Work on deliverables
5. Mark issue complete when done
6. Unblock dependent issues

### For Project Updates

1. Update the "Progress" column as you complete work
2. Update the "Timeline" if estimates change
3. Add blockers or risks under the issue
4. Keep this document in sync with GitHub issues

### For Dependencies & Sequencing

1. Check the "Dependency Graph" to understand order
2. Look at "Critical Path" for highest-priority issues
3. Run dependent issues in parallel where possible
4. Watch for blocked issues that are waiting on upstream work

---

## Next Steps

1. **Immediate:** Review all issues and assign owners
2. **2026-08-12 morning:** Start Phase 2.1 (#1756 — validation script)
3. **2026-08-12 afternoon:** Start Phase 3 & 4 in parallel (#1758, #1760)
4. **2026-08-13:** Complete Phases 2–4, start Phase 5 (#1761)
5. **2026-08-14:** Deploy Phase 6 (#1762 — rollout & monitoring)

---

**Document Status:** ✅ Complete  
**Last Updated:** 2026-08-11  
**Next Review:** After Phase 2 completion (2026-08-12)
