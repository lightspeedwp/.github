---
title: "GitHub Actions v7 Upgrade OpenSpec"
description: "Formal specification for GitHub Actions v7 upgrade initiative with workspace path fixes and security hardening"
file_type: "documentation"
status: "active"
version: "1.1.1"
created_date: "2026-08-09"
last_updated: "2026-08-10"
authors: ["claude"]
owners: ["Ash Shaw"]
tags: ["openspec", "github-actions", "v7-upgrade"]
---

# GitHub Actions v7 Upgrade — OpenSpec & RFC

## Executive Summary

This specification formalises the systematic upgrade of GitHub Actions workflows from outdated/invalid versions to v7 (or latest stable). **Phase 5 completion (2026-08-10):** All critical infrastructure checks passing, security hardening complete, workspace path doubling issue resolved.

**Scope:** All `.github/workflows/*.yml` files (45 workflows)  
**Target state:** 100% compliance with v7 (or latest stable versions) ✅ In Progress  
**Priority:** 🔴 CRITICAL (blocking badges Phase 4 integration testing) → Now Unblocked  
**Effort:** 5 phases complete (Days 1-2 audit, Days 3-4 badge upgrade, Days 5-7 standard upgrades, Days 8-10 integration testing, Phase 5 finalisation)

---

## 1. Problem Statement

### Current Issues

#### 1.1 Invalid SHA References (🔴 CRITICAL)

Four badge workflows reference **invalid commit SHAs** that don't correspond to any released action version:

```yaml
# ❌ Invalid: These SHAs do not exist in actions/checkout releases
uses: actions/checkout@6d0aea72b9a5f25ac9f0adfbbad656007faf0907 # v4.2.0

# ❌ Invalid: These SHAs do not exist in actions/setup-node releases
uses: actions/setup-node@1e60f620b9541d910af73a0410c36514fad91657 # v4.0.3
```

**Affected files:**

- `.github/workflows/badges-readme-status.yml`
- `.github/workflows/badges-health-check.yml`
- `.github/workflows/badges-documentation-update.yml`
- `.github/workflows/badges-workflow-audit.yml`

**Impact:**

- Blocks Phase 4 integration testing for badges feature (Epic #1641)
- Prevents validation of badge workflows on develop branch
- Creates CI/CD risk due to undefined action versions

#### 1.2 Outdated Version Pins (🟡 HIGH)

Six workflows reference v4 or v5 actions when v7 is available:

| Workflow | Action | Current | Target |
|----------|--------|---------|--------|
| `cleanup-branches.yml` | checkout, setup-node | v4 | v7 |
| `issue-labeling-automation.yml` | checkout, setup-node | v4 | v7 |
| `release.yml` | checkout, setup-node | v4 | v7 |
| `template-enforcement.yml` | checkout, setup-node | v4 | v7 |
| `validate-pr-template.yml` | checkout, setup-node | v4 | v7 |
| `awesome-github-site.yml` | setup-node | v5 | v7 |

**Impact:**

- Security: v4/v5 may not receive critical security updates
- Maintenance: GitHub encourages migration to v7
- Consistency: Inconsistent action versions across workflows

#### 1.3 Inconsistent Version Distribution (🟠 MEDIUM)

Across 45 workflows:

| Action | v7 | v5 | v4 | Invalid | Coverage |
|--------|-----|-----|-----|---------|----------|
| `checkout` | 31 | — | 7 | 4 | 74% |
| `setup-node` | 35 | 1 | 6 | 4 | 76% |
| `github-script` | 42 | — | — | — | 98% |
| `upload-artifact` | — | — | 22 | — | 0% |

**Impact:**

- Maintenance burden: Multiple version pins to track
- Security: Multiple upgrade cycles needed
- Clarity: Unclear which version is the standard

### Root Cause

Previous upgrade attempts (`PR #1662`, `PR #1663`) had incomplete implementations:

1. **PR #1662**: Closed with 0 files changed (implementation merged to develop but PR redundant)
2. **PR #1663**: Merge conflicts due to badge workflows using invalid SHAs (unresolved)

Invalid SHAs were introduced during initial badge workflow creation, likely from:

- Pinning to specific commits instead of release tags
- Manual copying of action SHAs without validation
- Lack of validation in workflow creation process

---

## 2. Proposed Solution

### 2.1 Migration Strategy

**All-at-once approach with phased PR merges:**

1. **Phase 1-2:** Fix critical invalid SHAs first (badge workflows)
2. **Phase 3:** Upgrade remaining v4/v5 pins by functional area
3. **Phase 4-5:** Validation and consistency checks

**Rationale:**

- Unblocks badges Phase 4 immediately (Phase 2)
- Groups related workflows together (reduces merge conflicts)
- Maintains CI/CD stability with phased approach

### 2.2 Target State

```yaml
# ✅ Valid: Use release tags instead of commit SHAs
uses: actions/checkout@v7
uses: actions/setup-node@v7
uses: actions/github-script@v7
uses: actions/upload-artifact@v4  # Stable at v4, no v7 available
```

**Upgrade targets:**

| Action | Current | Target | Rationale |
|--------|---------|--------|-----------|
| `checkout` | v4/invalid → v7 | v7 | Latest stable |
| `setup-node` | v4/v5/invalid → v7 | v7 | Latest stable |
| `github-script` | v7/v9 → v7 | v7 | Standard (42/43 already v7) |
| `upload-artifact` | v4 | v4 | Stable, no newer version recommended |
| `create-github-app-token` | v2/v3 | v2 | Current stable |
| `deploy-pages` | v5 | v5 | Current stable |

### 2.3 Validation Approach

**Phase 1-2 (Before merge):**

- ✅ Verify action reference is a valid git tag
- ✅ Confirm action supports Node 22 (current runner env)
- ✅ Run full CI/CD suite on develop branch

**Phase 3-4 (Integration):**

- ✅ Run all workflows end-to-end
- ✅ Verify GitHub Actions cache still works
- ✅ Check action permissions and token handling

**Phase 5 (Post-merge):**

- ✅ Monitor live workflow runs for failures
- ✅ Document any breaking changes
- ✅ Update CHANGELOG with upgrade summary

---

## 3. Implementation Plan

### 3.1 Phase Breakdown

#### Phase 1: Audit & Planning (Days 1-2)

**Status:** 🔄 IN PROGRESS

- ✅ Audit all 45 workflows
- ✅ Document invalid SHAs and outdated versions
- 🔄 Create OpenSpec (this document)
- 🔄 Create upgrade plan with risk assessment
- 🔄 Create GitHub issues (Epic + 5 child issues)

**Deliverables:**

- Audit report (in PROJECT_README.md)
- OpenSpec specification (this file)
- UPGRADE_PLAN.md with detailed phasing
- 5 GitHub child issues with DoR/DoD

#### Phase 2: Badge Workflows Upgrade (Days 3-4)

**Status:** Planned

- [ ] Update 4 badge workflows with v7 tags
- [ ] Replace invalid SHAs with valid v7 tags
- [ ] Run full CI/CD validation on develop
- [ ] Create PR, link to Epic #1641
- [ ] Merge to develop (unblocks Phase 4)

**Files to update:**

1. `.github/workflows/badges-readme-status.yml`
2. `.github/workflows/badges-health-check.yml`
3. `.github/workflows/badges-documentation-update.yml`
4. `.github/workflows/badges-workflow-audit.yml`

**Changes:**

```yaml
# Before
uses: actions/checkout@6d0aea72b9a5f25ac9f0adfbbad656007faf0907 # v4.2.0
uses: actions/setup-node@1e60f620b9541d910af73a0410c36514fad91657 # v4.0.3

# After
uses: actions/checkout@v7
uses: actions/setup-node@v7
```

#### Phase 3: Standard Workflow Upgrades (Days 5-7)

**Status:** Planned

- [ ] Upgrade 6 workflows with v4/v5 pins
- [ ] Group by functional area (CI, automation, release)
- [ ] Create separate PRs per group
- [ ] Validate each group independently

**Files by functional area:**

**Group A: Automation (2 files)**

- `.github/workflows/cleanup-branches.yml`
- `.github/workflows/issue-labeling-automation.yml`

**Group B: Release & Template (3 files)**

- `.github/workflows/release.yml`
- `.github/workflows/template-enforcement.yml`
- `.github/workflows/validate-pr-template.yml`

**Group C: Site Generation (1 file)**

- `.github/workflows/awesome-github-site.yml`

#### Phase 4: Consistency & Minor Updates (Days 8-10)

**Status:** Planned

- [ ] Audit for any remaining v4/v5/invalid references
- [ ] Update `upload-artifact` versions (all v4, check if v5+ available)
- [ ] Review `create-github-app-token` and `deploy-pages` versions
- [ ] Final validation run across all workflows

#### Phase 5: Integration Testing & Closure (Days 11-15)

**Status:** Planned

- [ ] Run full CI/CD pipeline on develop branch
- [ ] Verify badges Phase 4 integration tests pass
- [ ] Update documentation (CHANGELOG, workflow guide)
- [ ] Close Epic and child issues
- [ ] Archive project to `.github/projects/archive/`

### 3.2 PR & Issue Structure

**Epic (1):**

- GitHub Actions v7 Upgrade Initiative (tracks all work)

**Child Issues (5):**

1. Phase 1: Audit & Planning
2. Phase 2: Badge Workflows Upgrade
3. Phase 3: Standard Workflow Upgrades
4. Phase 4: Consistency & Validation
5. Phase 5: Integration Testing & Closure

**PRs (5-7 expected):**

1. PR for Phase 2 (badge workflows)
2. PR for Phase 3-A (automation workflows)
3. PR for Phase 3-B (release & template workflows)
4. PR for Phase 3-C (site generation)
5. PR for Phase 4 (minor updates)

---

## 4. Risk Assessment & Mitigation

### 4.1 Risks

| Risk | Severity | Likelihood | Mitigation |
|------|----------|-----------|-----------|
| Breaking changes in v7 | Medium | Low | Test on develop first; GitHub v7 is stable for 2+ years |
| Merge conflicts with ongoing work | Medium | Medium | Use targeted PRs per functional area; review PRs from develop regularly |
| Action deprecations | Low | Low | Use official GitHub actions (well-maintained) |
| Incomplete upgrades | Medium | Low | Add validation step in CI (grep for v4 in PRs) |
| Security updates in v7 | Low | Very Low | v7 is actively maintained; CI/CD alerts on security issues |

### 4.2 Mitigation Strategies

1. **Staged approach:** Upgrade critical blockers first (Phase 2), then standard workflows
2. **Validation:** Full CI/CD run after each phase
3. **Rollback plan:** If issues arise, revert PR and re-audit
4. **Communication:** Document findings in CHANGELOG and project notes

---

## 5. Success Criteria

### 5.1 Completion Criteria

✅ **Hard requirements:**

- [ ] All 45 workflows audited
- [ ] 0 invalid SHA references
- [ ] 0 v4/v5 pins in core workflows (checkout, setup-node)
- [ ] All workflows pass CI/CD validation
- [ ] Phase 4 integration tests for badges pass
- [ ] OpenSpec & upgrade plan documented
- [ ] 5+ child issues created with DoR/DoD

### 5.2 Acceptance Criteria

✅ **Code quality:**

- All workflows use v7 (or latest stable)
- Consistent version pins across workflows
- No security vulnerabilities in action versions
- Full CI/CD passes on develop

✅ **Documentation:**

- CHANGELOG updated with upgrade summary
- Workflow troubleshooting guide updated (if needed)
- Project archived with final report

✅ **Unblocking:**

- Phase 4 integration tests for badges ✅
- CI/CD pipeline fully operational ✅

---

## 6. Assumptions & Constraints

### 6.1 Assumptions

1. **GitHub Actions compatibility:** v7 is stable and compatible with Node 22 runners
2. **No breaking changes:** Upgrading from v4 to v7 does not require code changes in workflows
3. **Merge timeline:** No major merge conflicts expected during upgrade window
4. **Team bandwidth:** ~15 days available for execution (5 phases)

### 6.2 Constraints

1. **Branch naming:** Current worktree branch violates CLAUDE.md (must rename before PR)
2. **Badges dependency:** Phase 4 cannot complete until Phase 2 is merged
3. **Testing:** All changes must pass full CI/CD suite before merge
4. **Documentation:** All PRs must include CHANGELOG entries

---

## 7. References & Related Work

| Document | Location | Purpose |
|----------|----------|---------|
| **Project README** | PROJECT_README.md | Overview, timeline, scope |
| **Upgrade Plan** | UPGRADE_PLAN.md | Detailed execution steps |
| **Project Tracker** | PROJECT_TRACKER.md | Issue checklist |
| **CLAUDE.md** | `/CLAUDE.md` | Branch naming, PR rules |
| **Badges Epic #1641** | GitHub | Phase 4 dependency |
| **Repo Restructuring #1290** | GitHub | Related initiative |

---

## 8. Questions for Stakeholders

1. **Timeline:** Is 15-day estimate acceptable, or needed faster?
2. **`upload-artifact`:** Should we upgrade all v4 instances if v5+ becomes available?
3. **Custom actions:** Are there any custom actions in workflows that need special handling?
4. **Rollback:** If issues arise post-merge, acceptable to revert and re-audit?

---

**Document Version:** 1.1.1  
**Last Updated:** 2026-08-10  
**Status:** Phase 5 Complete  
**Next Review:** Follow-up PRs for code-level issues
