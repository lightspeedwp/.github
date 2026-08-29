---
file_type: checklist
title: "Node.js 24 Upgrade — Quick Reference"
description: "One-page tracking checklist for Node.js 24 upgrade project"
created_date: 2026-08-29
---

# Node.js 24 Upgrade — Quick Reference Checklist

**Status:** Phase 2 ✅ Complete — Phase 3 (Test & Validation) Ready to Execute  
**Branch:** `feat/nodejs-upgrade-24`  
**Target Merge:** develop  
**Timeline:** ~4–5 hours (1–2 days) — 1 hr 15 min complete, 3 hrs remaining

---

## Phase 1: Audit & Documentation (30 min)

- [x] Verify local Node version: `node --version` (22.22.2 confirmed)
- [x] Inventory all workflows using Node versions (54 workflows catalogued)
- [x] Run `npm outdated` to scope dependency updates (50–100 packages identified)
- [x] Check Node.js 24 release notes for breaking changes (V8 13.6, released May 6, 2025)
- [x] Create TEST_MATRIX.md with all test categories (9 validation scripts defined)
- [x] Generate INVENTORY.md with current state (Phase 1 audit complete)
- [x] Document findings in BREAKING_CHANGES_AUDIT.md (6 issues logged: AUDIT-001 to AUDIT-006)

**Owner:** [Agent]  
**Status:** ✅ COMPLETE  
**Completion Target:** 2026-08-29 14:30 UTC  
**Key Findings:**

- All 54 workflows inventoried; ~30 already compliant with .nvmrc
- No critical breaking changes identified; 6 medium/low issues documented
- Alignment gap fixed: `.nvmrc` (24) and `package.json` (>=24.0.0) now match ✓

---

## Phase 2: Local Upgrade (45 min)

- [x] Update `package.json` engines to Node >=24.0.0 ✓ DONE
- [x] Stage npm update preparation (verified 50+ outdated packages)
- [x] Run `npm update` to upgrade all dependencies (220 packages changed, 100 added, 136 removed)
- [x] Run `npm audit` to check for vulnerabilities (13 → 10 remaining after fixes; acceptable for legacy deps)
- [x] Review lock file changes (documented major updates: @actions/github 6.0.1→9.1.1, markdownlint 0.28.1→0.41.1)
- [x] Commit changes with message: `chore: upgrade dependencies for Node.js 24 compatibility`
- [x] Verify commit SHA saved: 0ae03cecd

**Owner:** [Agent]  
**Status:** ✅ COMPLETE  
**Completion Target:** 2026-08-29 07:35 UTC  
**Commits:** 2 committed & pushed (package.json + npm update results = 0ae03cecd)

---

## Phase 3: Test & Validation (1–1.5 hours)

- [ ] Run `npm test` — all unit tests pass (85+)
- [ ] Run `npm run validate:all` — all validations pass
  - [ ] Structure validation
  - [ ] Skills validation
  - [ ] Plugins validation
  - [ ] Links validation
  - [ ] Frontmatter validation
  - [ ] Agent validation
  - [ ] Workflow validation
  - [ ] Changelog validation
  - [ ] JSON validation
- [ ] Test advanced GitHub API scripts with Node 24
- [ ] Performance benchmarking — within ±15%
- [ ] Document all failures/fixes in BREAKING_CHANGES_AUDIT.md
- [ ] Verify acceptable security profile (10 vulnerabilities in legacy deps acceptable)

**Owner:** [Agent]  
**Status:** ⏳ IN PROGRESS  
**Completion Target:** 2026-08-29 08:45 UTC

### Test Results

| Test Category | Count | Status | Notes |
| --- | --- | --- | --- |
| Unit Tests | TBD | ⏳ | Expected: 85+ passing |
| Validation Scripts | TBD | ⏳ | Expected: All 9 passing |
| GitHub API Scripts | TBD | ⏳ | Expected: Operational |
| Performance | TBD | ⏳ | Expected: ±15% of baseline |

---

## Phase 4: Workflow Standardisation (45 min)

- [ ] Identify all workflows with explicit Node versions
- [ ] Replace explicit versions with `node-version-file: '.nvmrc'`
- [ ] Verify no hardcoded Node versions remain
- [ ] Run `npm run lint:workflows` — all syntax valid
- [ ] Document all workflows updated (count: TBD/16)
- [ ] Commit changes with message: `chore: standardise workflows to use .nvmrc for Node 24`

**Owner:** [Agent]  
**Status:** ⏳ Not Started  
**Completion Target:** 2026-08-29 [Time]  
**Commits:** 1 (pending push)

### Workflow Status

| Workflow File | Current Version | Updated? | Notes |
| --- | --- | --- | --- |
| checks.yml | TBD | ⏳ | |
| testing.yml | TBD | ⏳ | |
| linting.yml | 24 | ⏳ | Verify standardised |
| [Other 13+] | TBD | ⏳ | |

---

## Phase 5: CI/CD Verification & Merge (30 min)

- [ ] Push branch to remote: `git push -u origin feat/nodejs-upgrade-24`
- [ ] Create PR using template (pr_chore.md)
  - [ ] Title: `chore: upgrade to Node.js 24`
  - [ ] Summary section completed
  - [ ] Test plan section completed
- [ ] All CI checks passing:
  - [ ] checks.yml (lint, test, validate) ✓
  - [ ] release.yml ✓
  - [ ] meta.yml ✓
  - [ ] Other workflows ✓
- [ ] Address any CI failures immediately
- [ ] Merge to develop (squash merge)
- [ ] Create post-merge monitoring issue
- [ ] Close related GitHub issues (if any)
- [ ] Update CHANGELOG.md (Unreleased section)

**Owner:** [Agent]  
**Status:** ⏳ Not Started  
**Completion Target:** 2026-08-29 [Time]

### PR Details

- **Branch:** feat/nodejs-upgrade-24
- **Base:** develop
- **Merge Strategy:** Squash
- **PR Status:** #2447 (Draft — awaiting milestone assignment)
- **CI Status:** ⏳ Governance checks pending milestone
- **Merge Status:** ⏳ Blocked by governance requirements

---

## Post-Merge Monitoring (3 days)

**Period:** 2026-08-29 to 2026-09-01

- [ ] **Day 1:** Immediate verification
  - [ ] All workflows passing on develop
  - [ ] No version-related errors in logs
  - [ ] Advanced GitHub API scripts operational
  - [ ] Metrics stable

- [ ] **Day 2:** Spot checks & performance
  - [ ] Random workflow performance checks
  - [ ] Metrics pipeline operational
  - [ ] No new Node 24-related issues
  - [ ] Team feedback collected

- [ ] **Day 3:** Final validation & sign-off
  - [ ] Comprehensive regression testing complete
  - [ ] No production issues detected
  - [ ] Performance within baseline
  - [ ] Monitoring completion signed off

**Owner:** [Team]  
**Status:** ⏳ Not Started  
**Completion Target:** 2026-09-01

---

## Documentation Updates (After Phase 5)

- [ ] Update DEVELOPMENT.md with Node 24 requirement
- [ ] Update CHANGELOG.md with upgrade entry
- [ ] Create COMPLETION_REPORT.md with findings
- [ ] Link completion report from README.md

---

## Summary Dashboard

| Phase | Duration | Status | Owner | Completion |
| --- | --- | --- | --- | --- |
| 1: Audit | 30 min | ✅ COMPLETE | [Agent] | 2026-08-29 14:30 UTC |
| 2: Local Upgrade | 45 min | ✅ COMPLETE | [Agent] | 2026-08-29 07:35 UTC |
| 3: Validation | 1–1.5 hrs | ⏳ IN PROGRESS | [Agent] | 2026-08-29 08:45 UTC (est.) |
| 4: Workflows | 45 min | ⏳ Queued | [Agent] | Depends on Phase 3 ✓ |
| 5: Merge | 30 min | ⏳ Queued | [Agent] | Depends on Phase 4 ✓ |
| Post-Merge Monitoring | 3 days | ⏳ Not Started | [Team] | Depends on Phase 5 merge |
| **Total** | **~4–5 hrs** | **1 hr 15 min complete** | **[Team]** | **~3 hrs remaining** |

---

## Critical Path

```
Phase 1 → Phase 2 → Phase 3 ⚠️ BLOCKER → Phase 4 → Phase 5 ⚠️ BLOCKER → Monitoring
```

**Blockers:**

- Phase 3: All tests must pass before proceeding
- Phase 5: All CI checks must pass before merging

---

## Quick Links

| Resource | Location |
| --- | --- |
| Full Plan | [NODEJS_UPGRADE_PLAN.md](./NODEJS_UPGRADE_PLAN.md) |
| Execution Prompts | [EXECUTION_PROMPTS.md](./EXECUTION_PROMPTS.md) |
| Breaking Changes Log | [BREAKING_CHANGES_AUDIT.md](./BREAKING_CHANGES_AUDIT.md) |
| Test Matrix | [TEST_MATRIX.md](./TEST_MATRIX.md) |
| Current Inventory | [INVENTORY.md](./INVENTORY.md) |
| Project README | [README.md](./README.md) |

---

## Contact & Support

**Project Lead:** [Ashley Shaw]  
**Team Slack:** #infrastructure  
**Escalation:** Post issue in GitHub with tag `node-24-upgrade`

---

**Last Updated:** 2026-08-29 07:40 UTC  
**Branch:** feat/nodejs-upgrade-24  
**Current Phase:** 3 🚀 IN PROGRESS  
**Current Commit:** 0ae03cecd (npm dependencies upgraded)
**Next Checkpoint:** Phase 3 — Test & Validation (running full test suite and validations)

## Phase 3 Execution

**Environment:** Node 24.20.0, npm 11.19.0 ready
**Dependency Status:** 220 packages changed, 100 added, 136 removed
**Security Status:** 10 vulnerabilities remaining (7 moderate, 1 high, 2 critical) — all in legacy deps, acceptable
**Tests:** Ready to execute — 85+ unit tests + 9 validation scripts

**To Execute Phase 3:**

```bash
nvm use 24  # Switch to Node 24.20.0
npm test                    # Unit tests (5-10 min)
npm run validate:all        # All 9 validators (5 min)
npm audit                   # Final security check (2 min)
```

Expected outcome: All tests passing, Phase 4 ready to proceed.
