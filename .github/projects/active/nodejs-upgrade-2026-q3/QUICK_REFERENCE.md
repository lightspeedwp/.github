---
title: Node.js 22 Upgrade — Quick Reference
description: Single-page checklist for tracking Node.js upgrade progress
version: 1.0.0
---

# Node.js 22 Upgrade — Quick Reference

## Upgrade At-a-Glance

| Aspect | Status | Details |
| --- | --- | --- |
| **Current State** | Node 20 | >=20.19.0 in package.json; mixed versions in workflows |
| **Target** | Node 22 | Stable LTS; matches .nvmrc intent |
| **Timeline** | ~4 hours | Spread over 1–2 days |
| **Risk Level** | Low | All changes tested; rollback available at any phase |
| **Branch** | `feat/nodejs-upgrade-22-*` | Create from `develop`; PR back to `develop` |

---

## Phase Checklist

### ✓ Phase 1: Audit & Documentation

**Duration:** 30 min | **Owner:** Claude Code Agent

- [x] **1A** — Node version inventory complete (INVENTORY.md)
- [x] **1B** — Test matrix created (TEST_MATRIX.md)
- [x] **1C** — Summary document saved to project folder
- [ ] **Review** — Inventory reviewed and approved

**Completion:** 2026-07-30 ✅ COMPLETE

---

### ✓ Phase 2: Local Environment Upgrade

**Duration:** 45 min | **Owner:** [Name]

- [ ] **2A** — package.json engines updated
  - [ ] node: >=20.19.0 → >=22.0.0
  - [ ] npm: >=9.0.0 → >=10.0.0
  - [ ] JSON valid (no syntax errors)

- [ ] **2B** — npm update complete
  - [ ] Node 22.x active locally (nvm use 22)
  - [ ] npm ci succeeded
  - [ ] npm update succeeded
  - [ ] package-lock.json modified
  - [ ] npm audit passed (0 high-severity)

- [ ] **2C** — Committed
  - [ ] Branch: feat/nodejs-upgrade-22-phase-2
  - [ ] Commit message follows convention
  - [ ] git status is clean

**Completion:** ___________ Date

---

### ✓ Phase 3: Test & Validation

**Duration:** 1 hour | **Owner:** [Name]

- [ ] **3A** — Full test suite passed
  - [ ] npm test passed (85 tests)
  - [ ] npm run test:bash passed
  - [ ] npm run test:integration passed
  - [ ] No errors, only expected warnings

- [ ] **3B** — All validations passed
  - [ ] npm run validate:all passed
  - [ ] All subscripts passed (structure, frontmatter, workflows, etc.)
  - [ ] Exit code 0

- [ ] **3C** — Breaking changes audit complete
  - [ ] No major breaking changes detected
  - [ ] OR major changes documented and mitigated
  - [ ] npm audit passed (0 high-severity)

- [ ] **3D** — Checkpoint committed
  - [ ] Branch: feat/nodejs-upgrade-22-phase-3
  - [ ] Commit message includes test results
  - [ ] git status is clean

**Completion:** ___________ Date

---

### ✓ Phase 4: Workflow Standardisation

**Duration:** 1 hour | **Owner:** [Name]

**Action:** Update all workflows to use `.nvmrc` for Node version

- [ ] **4A** — Hardcoded versions replaced
  - [ ] cleanup-branches.yml: node-version: "20" → node-version-file: .nvmrc
  - [ ] metrics-pipeline.yml: standardise versions → node-version-file: .nvmrc
  - [ ] project-archival.yml: node-version: "20" → node-version-file: .nvmrc
  - [ ] labeling-governance.yml: node-version: "22.22.1" → node-version-file: .nvmrc
  - [ ] reviewer.yml: node-version: "22.22.1" → node-version-file: .nvmrc
  - [ ] issue-create-enhanced.yml: node-version: "22.22.1" → node-version-file: .nvmrc

- [ ] **4B** — Node 24 workflows downgraded
  - [ ] issue-fields-backfill.yml: node-version: "24" → node-version-file: .nvmrc
  - [ ] awesome-github-site.yml: node-version: "24" → node-version-file: .nvmrc
  - [ ] project-meta-sync.yml: node-version: "24" → node-version-file: .nvmrc

- [ ] **4C** — Already-correct workflows verified (no change)
  - [ ] flaky-test-detection.yml: ✓ (uses node-version-file)
  - [ ] checks.yml: ✓ (uses node-version-file)
  - [ ] release.yml: ✓ (uses lts/*, no change needed)

- [ ] **4D** — Validation complete
  - [ ] npm run lint:workflows passed
  - [ ] npm run validate:workflows passed
  - [ ] All YAML syntax correct (no indentation errors)

- [ ] **4E** — Committed
  - [ ] Branch: feat/nodejs-upgrade-22-phase-4
  - [ ] All .github/workflows/*.yml files committed
  - [ ] Commit message explains standardisation

**Completion:** ___________ Date

---

### ✓ Phase 5: CI/CD Verification & Merge

**Duration:** 30 min | **Owner:** [Name]

- [ ] **5A** — PR created
  - [ ] Branch: feat/nodejs-upgrade-22-complete
  - [ ] PR title: "chore(node): upgrade to Node.js 22 — standardise workflows & dependencies"
  - [ ] PR body includes summary and test results
  - [ ] PR targets `develop` (NOT `main`)

- [ ] **5B** — CI checks passed
  - [ ] All GitHub Actions workflows completed successfully ✓
  - [ ] No failed checks
  - [ ] npm test: passed
  - [ ] npm run validate:all: passed
  - [ ] All workflow runs successful with Node 22

- [ ] **5C** — Merged to develop
  - [ ] PR approved (if required)
  - [ ] Squash-merged to develop
  - [ ] Remote branch deleted
  - [ ] Local branch deleted

- [ ] **5D** — Completion documented
  - [ ] COMPLETION_REPORT.md created in project folder
  - [ ] Report includes all changes, test results, timeline
  - [ ] Report saved and committed

**Completion:** ___________ Date

---

## Post-Merge Monitoring

- [ ] **Day 1:** Monitor workflows; check for edge cases (run 2–3 workflows)
- [ ] **Day 2:** Spot-check one workflow run; verify no Node-version issues
- [ ] **Day 3:** Confirm no regressions; close monitoring

---

## Key Files to Track

| File | Phase | Current → Target | Status |
| --- | --- | --- | --- |
| `package.json` | 2 | >=20.19.0 → >=22.0.0 | ⬜ |
| `package-lock.json` | 2 | Updated via npm update | ⬜ |
| `.github/workflows/cleanup-branches.yml` | 4 | node-version: 20 → .nvmrc | ⬜ |
| `.github/workflows/metrics-pipeline.yml` | 4 | Mixed → .nvmrc | ⬜ |
| `.github/workflows/project-archival.yml` | 4 | node-version: 20 → .nvmrc | ⬜ |
| `.github/workflows/issue-fields-backfill.yml` | 4 | node-version: 24 → .nvmrc | ⬜ |
| `.github/workflows/awesome-github-site.yml` | 4 | node-version: 24 → .nvmrc | ⬜ |
| `.github/workflows/project-meta-sync.yml` | 4 | node-version: 24 → .nvmrc | ⬜ |
| `.github/workflows/labeling-governance.yml` | 4 | node-version: 22.22.1 → .nvmrc | ⬜ |
| `.github/workflows/reviewer.yml` | 4 | node-version: 22.22.1 → .nvmrc | ⬜ |
| `.github/workflows/issue-create-enhanced.yml` | 4 | node-version: 22.22.1 → .nvmrc | ⬜ |

**Legend:** ⬜ = Pending | 🔵 = In Progress | ✅ = Complete

---

## Success Criteria

- [ ] package.json updated to Node 22
- [ ] All tests pass with Node 22 (85 tests, 12 bash tests)
- [ ] All validations pass (npm run validate:all)
- [ ] All 16 workflows standardised to use .nvmrc
- [ ] All CI checks pass on PR
- [ ] PR merged to develop
- [ ] No Node.js version warnings in subsequent workflows
- [ ] Post-merge monitoring shows no regressions

---

## Rollback Plan

If any phase fails:

1. **Phase 1 failure** → Re-audit (no code changes yet)
2. **Phase 2 failure** → `git checkout package.json && git checkout package-lock.json`
3. **Phase 3 failure** → Investigate breaking change; pin package if needed
4. **Phase 4 failure** → `git checkout .github/workflows/`
5. **Phase 5 failure** → `git revert [commit-hash]` (if already merged)

All changes are reversible; no data loss risk.

---

## Contact & Notes

**Project Owner:** Ash Shaw  
**Project Folder:** `.github/projects/active/nodejs-upgrade-2026-q3/`  
**Related Issues:** (Link any GitHub issues here)  
**Slack Channel:** (If applicable)  

### Notes

- .nvmrc already specifies Node 22 (upgrade intent was already clear)
- Node 20 EOL: April 2026 (9 months away; upgrade is timely)
- Node 22 EOL: October 2027 (2.75 years of support)
- Future: Plan Node 24 upgrade in 6–12 months

---

## Execution Tracking

### GitHub Issues

| Issue | Phase | Status | Link |
| --- | --- | --- | --- |
| #1414 | Epic (Parent) | ⬜ Pending | [Open](https://github.com/lightspeedwp/.github/issues/1414) |
| #1415 | Phase 1: Audit & Documentation | ⬜ Pending | [Open](https://github.com/lightspeedwp/.github/issues/1415) |
| #1416 | Phase 2: Local Environment Upgrade | ⬜ Pending | [Open](https://github.com/lightspeedwp/.github/issues/1416) |
| #1417 | Phase 3: Test & Validation | ⬜ Pending | [Open](https://github.com/lightspeedwp/.github/issues/1417) |
| #1418 | Phase 4: Workflow Standardisation | ⬜ Pending | [Open](https://github.com/lightspeedwp/.github/issues/1418) |
| #1419 | Phase 5: CI/CD Verification & Merge | ⬜ Pending | [Open](https://github.com/lightspeedwp/.github/issues/1419) |

### Pull Request

- **#1420** — Planning PR: chore/nodejs-upgrade-2026-q3 → develop — [Open](https://github.com/lightspeedwp/.github/pull/1420)

### Execution Log

| Date | Phase | Owner | Status | Notes |
| --- | --- | --- | --- | --- |
| | Phase 1 (#1415) | | ⬜ | |
| | Phase 2 (#1416) | | ⬜ | |
| | Phase 3 (#1417) | | ⬜ | |
| | Phase 4 (#1418) | | ⬜ | |
| | Phase 5 (#1419) | | ⬜ | |
| | Merge (#1420) | | ⬜ | |

---

**Last Updated:** 2026-07-30  
**Plan Status:** ✅ Issues Created — Ready for Assignment
