# GitHub Actions v7 Upgrade Initiative

## Overview

This project systematically upgrades all GitHub Actions workflows to **v7** (or latest stable versions) across the LightSpeed `.github` control plane. The initiative addresses:

1. **Invalid SHA references** in 4 badge workflows (blocking Phase 4 integration testing)
2. **Outdated version pins** (v4, v5) in 6 additional workflows
3. **Standardisation** of action versions across 45 total workflows

## Current State

### Phase Status (2026-08-10)

**Phase 5: Integration Testing & Closure** — 🔄 FINALISING

- ✅ Phase 1-4: Complete
- 🔄 PR #1703: Phase 5 completion + portable agents (in review)
- ⚠️ Known blockers: Workspace path doubling in CI workflows (being fixed)
- 📋 Ready for: Follow-up session for code-level fixes

### Audit Results (2026-08-09)

| Issue | Count | Files Affected | Priority |
|-------|-------|-----------------|----------|
| Invalid checkout SHA | 4 | badge workflows (4 files) | 🔴 CRITICAL |
| Invalid setup-node SHA | 4 | badge workflows (4 files) | 🔴 CRITICAL |
| Old setup-node (v4, v5) | 7 | 5 workflows | 🟡 HIGH |
| Old checkout (v4) | 7 | 5 workflows | 🟡 HIGH |
| Inconsistent versions | Multiple | Various | 🟠 MEDIUM |

### Total Workflows Scanned

- **45 workflows** in `.github/workflows/`
- **31 workflows** already on v7 (68% compliant)
- **14 workflows** require updates (32% non-compliant)

### Action Version Distribution

| Action | v7 | v5 | v4 | Invalid SHA | Total |
|--------|-----|-----|-----|------------|-------|
| `checkout` | 31 | — | 7 | 4 | 42 |
| `setup-node` | 35 | 1 | 6 | 4 | 46 |
| `github-script` | 42 | — | — | — | 43 |
| `upload-artifact` | — | — | 22 | — | 22 |
| `create-github-app-token` | 2 | — | — | — | 4 |
| Other | Various | — | — | — | — |

## Scope & Deliverables

### Phase 1: Audit & Planning (Days 1-2) — ✅ COMPLETE

- ✅ Audit all 45 workflows for action versions
- ✅ Document current state and blockers
- ✅ Create OpenSpec specification
- ✅ Create upgrade plan with phasing strategy
- ✅ Create GitHub issues (Epic + 5 child issues)

### Phase 2: Badge Workflows Upgrade (Days 3-4) — ✅ COMPLETE

- ✅ Upgrade 4 badge workflows (invalid SHAs → v7) — PR #1693 merged 2026-08-09
- ✅ Create PR with validation
- ✅ Merge to develop
- ✅ Unblock Phase 4 integration testing

### Phase 3: Standard Workflow Upgrades (Days 5-7) — 🔄 IN PROGRESS

- 🔄 Upgrade 6 workflows with v4/v5 pins
- 🔄 Group updates by functional area (CI, automation, release)
- 🔄 Create separate PRs per functional area

### Phase 4: Consistency & Validation (Days 8-10) — 📋 PLANNED

- Audit for remaining v4/v5/invalid references
- Update any remaining outliers
- Full test run on develop

### Phase 5: Integration Testing & Closure (Days 11-15) — 📋 PLANNED

- Full CI/CD validation with upgraded actions
- Verify all workflows pass with v7
- Documentation updates
- Close project

## Dependencies & Blockers

### Current Blockers

1. ⚠️ **Invalid SHAs in badge workflows** — These prevent Phase 4 integration testing for badges feature
   - Affects: PR #1663 (merge conflicts from prior attempt)
   - Resolution: Phase 2 upgrade will unblock

2. ⚠️ **Branch naming violation** — Current worktree branch is `claude/github-actions-v7-upgrade-828690`
   - CLAUDE.md forbids `claude/` prefix
   - Action: Rename to `feat/github-actions-v7-upgrade` before PR creation

### Dependencies

- Depends on: Epic #1641 (Badges Workflow Integration) Phase 1-3 being complete ✅
- Blocks: Phase 4 integration testing for badges feature (PR #1663)
- Related to: Epic #1290 (Repository Restructuring)

## Success Metrics

✅ **Completion criteria:**

- All 45 workflows audited and documented
- Invalid SHAs replaced with v7 (or latest stable)
- No workflows pinned to v4 or invalid SHAs
- All workflows pass CI/CD validation
- OpenSpec and upgrade plan documented
- 5+ child issues created with DoR/DoD

📊 **Target coverage:**

- 100% of workflows using v7 (or latest stable)
- 0 invalid SHA references
- 0 unmaintained action versions

## Risk Assessment

| Risk | Severity | Mitigation |
|------|----------|-----------|
| Breaking changes in v7 | Medium | Test on develop branch first, validate with CI/CD |
| Merge conflicts with ongoing work | Medium | Cherry-pick approach per functional area |
| Action deprecations | Low | Use official GitHub actions (well-maintained) |

## Timeline Estimate

| Phase | Duration | Status |
|-------|----------|--------|
| Phase 1: Audit & Planning | 2 days | 🔄 IN PROGRESS |
| Phase 2: Badge Workflows | 2 days | Planned |
| Phase 3: Standard Workflows | 3 days | Planned |
| Phase 4: Consistency & Testing | 3 days | Planned |
| Phase 5: Integration & Closure | 5 days | Planned |
| **Total** | **~15 days** | Estimate |

**Target completion: 2026-08-23** (assuming start on 2026-08-09)

## Key Resources

| Document | Location | Purpose |
|----------|----------|---------|
| **Audit Report** | This folder | Current action versions, blockers |
| **OpenSpec Analysis** | OPENSPEC_ANALYSIS.md | Formal specification & RFC |
| **Upgrade Plan** | UPGRADE_PLAN.md | Detailed phased execution plan |
| **Project Tracker** | PROJECT_TRACKER.md | Issue checklist and progress |
| **Phase 5 Completion** | phase-5-completion-report.md | Final delivery status & test results |
| **Known Issues** | KNOWN_ISSUES_FOR_FOLLOWUP.md | Code-level issues requiring follow-up PRs |
| **Workspace Path Fix** | WORKSPACE_PATH_DOUBLING_FIX.md | Ready-to-copy prompt for fixing CI path issue |
| **CLAUDE.md** | `/CLAUDE.md` | Repository governance & branch rules |

## Related Epics & Issues

- **Epic #1641** — Badges Workflow Integration (Phase 1-3 ✅, Phase 4 blocked by this initiative)
- **Epic #1290** — Repository Restructuring Initiative (parent epic for related work)
- **PR #1659** — Badges workflow schema & validation (merged to develop)
- **PR #1663** — Badges workflow integration (merge conflicts, blocked by action versions)

## Outstanding Issues & Follow-Up Work

### PR #1703 Status

- **Merge Conflict:** ✅ Resolved (04d9a4b7d)
- **Workflow Action Versions:** ✅ Fixed v4→v1 (63e5bbbbc)
- **Orphaned Test Files:** ✅ Removed (408fe8cf9)
- **Workspace Path Doubling:** ✅ Fixed (f6d338ccc) — all critical CI checks passing
- **Known Code Issues:** 📋 Documented in KNOWN_ISSUES_FOR_FOLLOWUP.md — Ready for separate follow-up PRs

### Immediate Next Steps (Priority Order)

1. **Merge PR #1703** (Workspace path fixes complete):
   - All critical CI checks passing (documentation, labeling, planner agents)
   - CodeRabbit review feedback being addressed
   - Completes Phase 5 delivery

2. **Address Known Code Issues** (separate follow-up PRs):
   - **Priority 1:** Release agent shell injection fix (security)
   - **Priority 2:** Changelog agent regex fixes (correctness)
   - **Priority 3:** Test API alignment (quality)
   - **Reference:** KNOWN_ISSUES_FOR_FOLLOWUP.md

---

*Project initiated: 2026-08-09 | Last updated: 2026-08-10 (Phase 5 finalising)*
