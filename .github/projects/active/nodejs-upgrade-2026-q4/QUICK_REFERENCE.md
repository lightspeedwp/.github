---
file_type: checklist
title: "Node.js 24 Upgrade — Quick Reference"
description: "One-page tracking checklist for Node.js 24 upgrade project"
created_date: 2026-08-29
---

# Node.js 24 Upgrade — Quick Reference Checklist

**Status:** Phase 1 ✅ Complete — Phase 2 Blocked (Node 24 environment required)  
**Branch:** `feat/nodejs-upgrade-24`  
**Target Merge:** develop  
**Timeline:** ~4–5 hours (1–2 days) — 30 min complete, 3 hrs 30 min remaining

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
- [ ] **[BLOCKED ON NODE 24 ENV]** Run `npm update` to upgrade all dependencies
- [ ] **[BLOCKED ON NODE 24 ENV]** Run `npm audit` to check for vulnerabilities
- [ ] Review lock file changes
- [ ] Commit changes with message: `chore: upgrade dependencies for Node.js 24 compatibility`
- [ ] Verify commit SHA saved for Phase 5

**Owner:** [Agent]  
**Status:** ⏳ Blocked (waiting Node 24 environment)  
**Completion Target:** Once Node 24 environment available  
**Commits:** 1 committed & pushed (package.json); 1 pending (npm update results)

---

## Phase 3: Test & Validation (1–1.5 hours)

- [ ] Run `npm test` — all unit tests pass (85+)
- [ ] Run `npm run validate:all` — all validations pass
  - [ ] Structure validation ✓
  - [ ] Skills validation ✓
  - [ ] Plugins validation ✓
  - [ ] Links validation ✓
  - [ ] Frontmatter validation ✓
  - [ ] Agent validation ✓
  - [ ] Workflow validation ✓
  - [ ] Changelog validation ✓
  - [ ] JSON validation ✓
- [ ] Test advanced GitHub API scripts with Node 24
- [ ] Performance benchmarking — within ±15%
- [ ] Document all failures/fixes in BREAKING_CHANGES_AUDIT.md
- [ ] Verify zero high/critical security vulnerabilities

**Owner:** [Agent]  
**Status:** ⏳ Not Started  
**Completion Target:** 2026-08-29 [Time]

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
| 2: Local Upgrade | 45 min | ⏳ BLOCKED (Node 24 env) | [Agent] | Awaiting Node 24 environment |
| 3: Validation | 1–1.5 hrs | ⏳ Queued | [Agent] | Depends on Phase 2 ⚠️ |
| 4: Workflows | 45 min | ⏳ Queued | [Agent] | Depends on Phase 3 ✓ |
| 5: Merge | 30 min | ⏳ Queued | [Agent] | Depends on Phase 4 ✓ |
| Post-Merge Monitoring | 3 days | ⏳ Not Started | [Team] | Depends on Phase 5 merge |
| **Total** | **~4–5 hrs** | **30 min + prep complete** | **[Team]** | **3 hrs remaining** |

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

**Last Updated:** 2026-08-29 14:30 UTC  
**Branch:** feat/nodejs-upgrade-24  
**Current Phase:** 1 ✅ Complete  
**Next Checkpoint:** Phase 2 — Local Upgrade (requires Node 24 environment to run `npm update`)

## Phase 2 Environment Note

**Current Blocker:** Environment is Node v22.22.2; package.json now requires >=24.0.0

**Why:** Package engine validation is working correctly—npm refuses to run under incompatible Node version, protecting against accidental use of wrong Node version during development.

**To Proceed:** Switch to Node 24 environment and run:

```bash
git checkout feat/nodejs-upgrade-24
npm update        # Upgrades 50+ dependencies for Node 24 compatibility
npm audit         # Security validation
npm test          # Verify tests pass with new dependencies
```

Once Phase 2 completes in Node 24 environment, results will be committed to the branch and PR #2447 will be ready for Phase 3 validation.
