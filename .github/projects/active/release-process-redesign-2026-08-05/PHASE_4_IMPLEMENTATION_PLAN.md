---
file_type: documentation
title: "Phase 4 Implementation Plan — Release Process V2"
description: "Detailed implementation roadmap for Phase 4 (Workflow + Agents + Documentation + Testing)"
status: active
version: "1.1"
last_updated: "2026-08-08"
owners: ["Ash Shaw"]
tags: ["implementation", "phase-4", "workflow", "agents", "release"]
category: "release-engineering"
---

# Phase 4 Implementation Plan

**Release Process V2: Core Implementation**

---

## Overview

This document outlines the detailed implementation plan for Phase 4, derived from the OpenSpec Analysis Report (47 implementation tasks, 18-day timeline).

**Phase 4 Scope:** Workflow refactoring, agent implementation, portable architecture, WordPress support, documentation rewrite, and comprehensive testing.

**Timeline:** 18 days (estimated 2026-08-08 through 2026-08-25)

**Success Metric:** All 47 Phase 4 tasks completed with zero regressions; all tests passing; documentation 100% accurate.

---

## Validation Against OpenSpec Specification

This plan directly implements requirements from [OPENSPEC_ANALYSIS_REPORT.md](./OPENSPEC_ANALYSIS_REPORT.md):

| Requirement | Task(s) | Status |
|------------|---------|--------|
| F1: Develop-first flow (2-PR stacked) | CHILD-020, CHILD-021 | Planned |
| F2: Multi-repo version detection | CHILD-023, CHILD-025/026 | Planned |
| F3: Authorization & gating | CHILD-020 (release.yml update) | Planned |
| F4: Pre-release checklist (enforced) | CHILD-020 (release.yml validation) | Planned |
| F5: Changelog validation (2-gate) | CHILD-024, CHILD-021 (agent update) | Planned |
| F6: Rollback automation | CHILD-022 (rollback.cjs) | Planned |
| F7: Portable release agents | CHILD-023, CHILD-024 | Planned |

**Validation Result:** ✅ All 7 functional requirements covered by Phase 4 tasks.

---

## Task Breakdown by Priority

### Priority 1: Workflow Refactoring (Days 1-3, 6 days effort)

**Objective:** Update release infrastructure for develop-first flow with proper authorization and validation.

#### CHILD-020: Update `.github/workflows/release.yml`

**Current State:**

- Targets `main` directly (incorrect per ADR-001)
- Has broken badges
- Missing pre-release checklist validation
- Authorization gate has `continue-on-error: true` (incorrect)

**Implementation Tasks:**

1. **Workflow Structure Refactoring**
   - Add `release-to-develop` job (creates PR to develop)
   - Add `release-to-main` job (creates PR to main from develop)
   - Make jobs sequential (develop PR first, then main PR)
   - Update PR templates to reference stacked flow

2. **Authorization Gates**
   - Remove `continue-on-error: true` from trigger-telemetry job
   - Make authorization hard fail (workflow stops if unauthorized)
   - Log all attempts (successful & failed) to audit trail

3. **Pre-Release Checklist Validation**
   - Validate CHANGELOG.md has [Unreleased] section
   - Validate VERSION file exists and matches SemVer
   - Validate all tests pass (npm test)
   - Validate all linting passes (npm run lint)
   - Validate git working tree is clean
   - Hard fail if any validation fails

4. **Version Bumping**
   - Delegate to release.agent.js (two-PR creation logic)
   - Agent bumps VERSION in all version files simultaneously
   - Agent creates develop PR with version bump commit

5. **Changelog Processing**
   - Delegate to changelog agent (CHILD-024)
   - Validate [Unreleased] format before processing
   - Convert [Unreleased] to [X.Y.Z] during release
   - Validate no empty sections remain

**Deliverables:**

- Updated `.github/workflows/release.yml` (develop-first flow)
- All tests passing
- Authorization gates enforced
- Pre-release checklist in place

**Effort:** 2 days | **Branch:** `docs/release-process-phase-4-implementation`

#### CHILD-021: Modify `scripts/agents/release.agent.js`

**Current State:**

- Targets `main` directly (per line 865)
- No multi-repo version detection
- No stacked PR creation logic
- Missing changelog integration

**Implementation Tasks:**

1. **Two-PR Creation Logic**
   - Create PR to `develop` (first)
   - Wait for develop PR merge (manual approval)
   - Create PR from `develop` to `main` (second)
   - Update agent state tracking for PR creation

2. **Multi-Repo Version Detection**
   - Detect repo type (control plane, plugin, theme)
   - Identify all version files (VERSION, package.json, plugin header, style.css, readme.txt)
   - Validate all version files are in sync before bumping
   - Bump all simultaneously

3. **Changelog Integration**
   - Validate [Unreleased] section exists and has entries
   - Delegate formatting to changelog agent
   - Pass changelog to develop PR description
   - Link changelog entries to PRs

4. **Error Handling**
   - Clear error messages if version files mismatched
   - Clear error messages if [Unreleased] missing or empty
   - Graceful handling of edge cases (pre-release versions, etc.)

**Deliverables:**

- Updated `scripts/agents/release.agent.js` (two-PR creation)
- Multi-repo version detection working
- All agent tests passing

**Effort:** 2 days | **Branch:** `docs/release-process-phase-4-implementation`

#### CHILD-022: Integrate & Test `scripts/workflows/release/rollback.cjs`

**Current State:** Rollback script exists at `scripts/workflows/release/rollback.cjs`; needs integration testing and validation

**Implementation Tasks:**

1. **Integration & Testing**
   - Verify rollback script accepts `--version=X.Y.Z` argument
   - Test delete local git tag: `git tag -d vX.Y.Z`
   - Test delete remote git tag: `git push origin --delete vX.Y.Z`
   - Test revert VERSION file to previous version
   - Test revert CHANGELOG.md ([X.Y.Z] → [Unreleased])
   - Test delete GitHub Release (via API)
   - Verify rollback commit creation (signed, clear message)
   - Test push rollback commit to main

2. **Error Handling**
   - Graceful if tag doesn't exist (already deleted)
   - Clear error messages (tag not found, API failure, etc.)
   - Atomic operation (all-or-nothing)

3. **Audit Trail**
   - Log rollback attempt (timestamp, version, user)
   - Log success/failure
   - Integrate with release workflow logging

**Deliverables:**

- `scripts/workflows/release/rollback.cjs` (fully functional)
- All rollback tests passing
- Audit trail integration

**Effort:** 2 days | **Branch:** `docs/release-process-phase-4-implementation`

---

### Priority 2: Portable Agent Architecture (Days 4-7, 4 days effort)

**Objective:** Create reusable, multi-repo capable release agents.

#### CHILD-023: Build `agents/release/` (Portable Release Agent)

**Current State:** Utilities scattered in `.github/scripts/`

**Implementation Tasks:**

1. **Agent Structure**

   ```
   agents/release/
   ├── release.agent.js (main agent)
   ├── README.md (agent documentation)
   ├── package.json (dependencies)
   ├── includes/
   │   ├── versionManager.cjs (version file operations)
   │   ├── gitOps.cjs (git operations)
   │   ├── githubOps.cjs (GitHub API operations)
   │   ├── changelogManager.cjs (changelog operations)
   │   ├── repoDetector.cjs (detect repo type)
   │   └── wordpressUtils.cjs (WordPress-specific)
   └── tests/
       ├── versionManager.test.js
       ├── gitOps.test.js
       └── [other test files]
   ```

2. **Repo Type Detection**
   - Detect control-plane repos (VERSION + package.json)
   - Detect WordPress plugin repos (plugin header + readme.txt)
   - Detect WordPress theme repos (style.css header + package.json)
   - Support custom repo types (extensible)

3. **Version File Management**
   - Read all version files for repo type
   - Validate all versions match
   - Bump all versions (patch/minor/major)
   - Write all versions in single commit

4. **Portability**
   - No `.github/` path assumptions
   - Works when cloned into other LightSpeedWP repos
   - Clear installation instructions
   - Full documentation

**Deliverables:**

- Complete `agents/release/` structure
- All version operations working
- Repo detection working for all types
- All tests passing (80%+ coverage)

**Effort:** 2 days | **Branch:** `docs/release-process-phase-4-implementation`

#### CHILD-024: Build `agents/changelog/` (Changelog Agent)

**Current State:** Utilities scattered in `.github/scripts/`

**Implementation Tasks:**

1. **Agent Structure**

   ```
   agents/changelog/
   ├── changelog.agent.js (main agent)
   ├── README.md (agent documentation)
   ├── package.json (dependencies)
   ├── includes/
   │   ├── changelogValidator.cjs (validation)
   │   ├── changelogFormatter.cjs (formatting)
   │   └── keepAChangelogParser.cjs (parser)
   └── tests/
       ├── changelogValidator.test.js
       └── [other test files]
   ```

2. **Validation (Two-Gate)**
   - Gate 1 (PR to develop): Format validation, em-dash check, PR links
   - Gate 2 (Release time): Schema validation, [Unreleased] exists, no empty sections
   - Clear error messages for each validation failure

3. **Formatting**
   - Enforce title < 60 chars
   - Enforce description < 150 chars
   - Enforce em-dash (—) not hyphen (-)
   - Enforce PR link format (#123)
   - Auto-fix when possible, error when not

4. **Processing**
   - Convert [Unreleased] to [X.Y.Z] during release
   - Update [X.Y.Z] date to release date
   - Preserve formatting
   - Generate changelog excerpt for GitHub Release

**Deliverables:**

- Complete `agents/changelog/` structure
- Validation working (both gates)
- Formatting working
- All tests passing (80%+ coverage)

**Effort:** 2 days | **Branch:** `docs/release-process-phase-4-implementation`

---

### Priority 3: WordPress Support (Days 8-9, 2 days effort)

**Objective:** Handle WordPress-specific version files (plugins, themes).

#### CHILD-025/026: WordPress Utilities

**Current State:** No WordPress version handling

**Implementation Tasks:**

1. **Plugin Header Support**
   - Parse plugin header: `Version: X.Y.Z` (in main plugin file)
   - Update plugin header while preserving format
   - Validate plugin header exists and is correct format

2. **Theme CSS Header Support**
   - Parse theme header: `Version: X.Y.Z` (in style.css)
   - Update theme header while preserving format
   - Validate header exists and is correct format

3. **Readme.txt Support**
   - Parse readme.txt: `Stable tag: X.Y.Z`
   - Update stable tag while preserving format
   - Validate stable tag exists and is correct format

4. **Integration**
   - Auto-detect WordPress repo type
   - Include in multi-repo version detection (CHILD-023)
   - Handle version bumping for all WordPress files

**Deliverables:**

- `agents/release/includes/wordpressUtils.cjs` (complete)
- WordPress version file detection working
- WordPress version bumping working
- All tests passing (WordPress plugins + themes)

**Effort:** 2 days | **Branch:** `docs/release-process-phase-4-implementation`

---

### Priority 4: Documentation Rewrite (Days 10-13, 4 days effort)

**Objective:** Rewrite release documentation to match new implementation.

#### CHILD-027: Rewrite RELEASE_PROCESS.md

**Current Content:** Outdated, doesn't match actual workflow

**New Content:**

- Overview (what is release process, why develop-first)
- Prerequisites (branch protection, authorization, tooling)
- Step-by-step guide (how to release)
- Flow diagrams (Mermaid: develop PR → main PR → tag → release)
- Troubleshooting (common issues, rollback procedures)
- FAQ (stacked PRs, version formats, etc.)

**Deliverables:**

- Completely rewritten RELEASE_PROCESS.md
- All links working
- All examples accurate
- Flow diagrams in Mermaid

**Effort:** 1 day | **Branch:** `docs/release-process-phase-4-implementation`

#### CHILD-028: Update BRANCHING_STRATEGY.md

**Current Content:** Has release flow info, but incomplete

**New Content:**

- Add develop-first release flow explanation
- Add stacked PR explanation
- Add release branch naming (release/vX.Y.Z)
- Link to RELEASE_PROCESS.md

**Deliverables:**

- Updated BRANCHING_STRATEGY.md
- Clear release flow section

**Effort:** 0.5 days | **Branch:** `docs/release-process-phase-4-implementation`

#### CHILD-029: Create RELEASE_WORDPRESS.md

**Current Content:** Does not exist

**New Content:**

- WordPress plugin release process (specific version files)
- WordPress theme release process (specific version files)
- Plugin header format
- Theme CSS header format
- readme.txt stable tag format
- Examples with before/after

**Deliverables:**

- New RELEASE_WORDPRESS.md (complete)
- Clear examples for plugins and themes

**Effort:** 1 day | **Branch:** `docs/release-process-phase-4-implementation`

#### CHILD-030: Fix All Broken Badges & Links

**Current Issues:** AUDIT_REPORT.md identified broken links

**Tasks:**

- Identify all broken links in docs/
- Verify links in RELEASE_PROCESS.md
- Verify links in BRANCHING_STRATEGY.md
- Verify links in all agent documentation
- Fix or remove broken badges

**Deliverables:**

- All links working
- All badges functional
- Link checker passing

**Effort:** 0.5 days | **Branch:** `docs/release-process-phase-4-implementation`

#### CHILD-031: Create CI Validation for Doc/Code Drift

**Objective:** Prevent future documentation drift

**Tasks:**

- Create GitHub Action to detect doc/code mismatches
- Check RELEASE_PROCESS.md matches release.yml
- Check examples match actual agent behavior
- Add to CI checks (before PR merge)

**Deliverables:**

- CI workflow checking doc/code alignment
- Clear error messages if drift detected

**Effort:** 1 day | **Branch:** `docs/release-process-phase-4-implementation`

---

### Priority 5: Testing & Validation (Days 14-18, 5 days effort)

**Objective:** Comprehensive testing across all repo types and scenarios.

#### CHILD-040: Test Dry-Run Release (Control Plane)

**Scenario:** Execute `npm run release -- --scope=patch --dry-run` on control plane

**Validations:**

- VERSION file would be bumped correctly
- CHANGELOG.md conversion would work
- Git operations logged (no actual commits)
- No GitHub API calls made (dry-run)
- Output shows what would happen

**Deliverables:**

- Dry-run test passing
- Clear output documentation

**Effort:** 0.5 days | **Branch:** `docs/release-process-phase-4-implementation`

#### CHILD-041: Test Live Patch Release (Control Plane)

**Scenario:** Execute actual patch release on control plane test branch

**Validations:**

- VERSION file bumped (X.Y.Z → X.Y.Z+1)
- CHANGELOG.md [Unreleased] → [X.Y.Z+1]
- PR created to develop (all checks passing)
- PR created to main from develop (all checks passing)
- Both PRs merged successfully
- Git tag created (vX.Y.Z+1)
- GitHub Release created
- Audit trail logged

**Deliverables:**

- Live release test passing
- All automation working end-to-end

**Effort:** 1 day | **Branch:** `docs/release-process-phase-4-implementation`

#### CHILD-042: Test Plugin Release (WordPress)

**Scenario:** Execute release on WordPress plugin test repo

**Validations:**

- VERSION file bumped
- plugin.php header bumped
- readme.txt stable tag bumped
- package.json version bumped
- All versions synchronized
- PR created + merged
- Release created
- Plugin-specific paths correct

**Deliverables:**

- Plugin release test passing
- WordPress support validated

**Effort:** 1 day | **Branch:** `docs/release-process-phase-4-implementation`

#### CHILD-043: Test Theme Release (WordPress)

**Scenario:** Execute release on WordPress theme test repo

**Validations:**

- VERSION file bumped
- style.css header bumped
- package.json version bumped
- All versions synchronized
- PR created + merged
- Release created
- Theme-specific paths correct

**Deliverables:**

- Theme release test passing
- WordPress theme support validated

**Effort:** 1 day | **Branch:** `docs/release-process-phase-4-implementation`

#### CHILD-044: Test Rollback Procedure

**Scenario:** Execute rollback.cjs after release

**Validations:**

- Git tag deleted (local + remote)
- VERSION file reverted
- CHANGELOG.md reverted ([X.Y.Z] → [Unreleased])
- GitHub Release deleted
- Rollback commit created
- Audit trail logged

**Deliverables:**

- Rollback test passing
- Safe recovery verified

**Effort:** 1 day | **Branch:** `docs/release-process-phase-4-implementation`

#### CHILD-045: Test Authorization Gates

**Scenario:** Attempt release from unauthorized user

**Validations:**

- Workflow fails (hard fail, no continue-on-error)
- Clear error message displayed
- Unauthorized attempt logged
- Release prevented

**Deliverables:**

- Authorization test passing
- Security validated

**Effort:** 0.5 days | **Branch:** `docs/release-process-phase-4-implementation`

#### CHILD-046: Team Training & Documentation

**Objective:** Prepare team for new release process

**Tasks:**

- Document release process (README, guides, examples)
- Create step-by-step guides for different scenarios
- Document emergency procedures (rollback, authorization)
- Create video walkthrough (optional)
- Conduct team training session

**Deliverables:**

- Team documentation complete
- Team trained on new process
- Q&A documented

**Effort:** 0.5 days | **Branch:** `docs/release-process-phase-4-implementation`

#### CHILD-047: Final Integration Testing

**Objective:** End-to-end validation of complete process

**Scenarios:**

- Full release cycle (dry-run → live → verify)
- Multi-repo releases (control plane + plugin + theme)
- Error recovery (rollback from failed release)
- Authorization enforcement (unauthorized attempt)

**Deliverables:**

- All integration tests passing
- No regressions in existing functionality

**Effort:** 0.5 days | **Branch:** `docs/release-process-phase-4-implementation`

---

## Implementation Timeline

### Week 1: Workflow & Authorization (Days 1-5)

| Day | Task | Effort | Status |
|-----|------|--------|--------|
| Aug 8 | CHILD-020 (release.yml) | 2d | 🔄 In Progress |
| Aug 9-10 | CHILD-021 (release.agent.js) | 2d | Planned |
| Aug 11-12 | CHILD-022 (rollback.cjs) | 2d | Planned |

### Week 2: Portable Agents (Days 6-13)

| Day | Task | Effort | Status |
|-----|------|--------|--------|
| Aug 13-14 | CHILD-023 (agents/release/) | 2d | Planned |
| Aug 15-16 | CHILD-024 (agents/changelog/) | 2d | Planned |
| Aug 17-18 | CHILD-025/026 (WordPress support) | 2d | Planned |
| Aug 19-22 | CHILD-027 through CHILD-031 (Docs) | 4d | Planned |

### Week 3: Testing & Validation (Days 14-18)

| Day | Task | Effort | Status |
|-----|------|--------|--------|
| Aug 23-27 | CHILD-040 through CHILD-047 (Testing) | 5d | Planned |

**Total:** 18 days (2026-08-08 through 2026-08-25)

---

## Dependencies & Prerequisites

### Branch Protection

- `main` branch protected (PRs required)
- `develop` branch protected (PRs required)
- All PR checks must pass

### Tooling

- Node.js 18+ required
- GitHub CLI (`gh`) installed and authenticated
- Git CLI available
- npm with required packages

### Access Requirements

- Write access to repository
- Authorization to trigger release workflow
- GitHub API token for testing

---

## Risk Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| Stacked PRs break workflow | Low | High | Comprehensive testing (CHILD-040-047) |
| Version file mismatches | Medium | Medium | Validation before bumping |
| Documentation still inaccurate | Medium | Medium | CI drift detection (CHILD-031) |
| Authorization gate too strict | Low | Medium | Clear error messages, documentation |
| Rollback fails in edge case | Low | High | Thorough rollback testing (CHILD-044) |

---

## Success Criteria (Phase 4)

✅ **Phase 4 is successful when:**

1. All 47 tasks complete
2. All tests passing (unit + integration + E2E)
3. Zero regressions in existing release process
4. Documentation 100% accurate (CI validation passing)
5. Authorization gates enforced (security validated)
6. Multi-repo support working (control plane, plugin, theme)
7. Rollback automation tested and working
8. Team trained and confident in new process

---

## Deliverables Checklist

- [ ] Updated `.github/workflows/release.yml` (develop-first flow)
- [ ] Updated `scripts/agents/release.agent.js` (two-PR creation)
- [ ] Created `scripts/workflows/release/rollback.cjs`
- [ ] Created `agents/release/` (portable agent)
- [ ] Created `agents/changelog/` (changelog agent)
- [ ] Created WordPress support utilities
- [ ] Rewrote RELEASE_PROCESS.md (with diagrams)
- [ ] Updated BRANCHING_STRATEGY.md
- [ ] Created RELEASE_WORDPRESS.md
- [ ] Fixed all broken links & badges
- [ ] Created CI doc/code drift validation
- [ ] All tests passing (unit + integration + E2E)
- [ ] Team trained & documentation complete

---

## References

- [OPENSPEC_ANALYSIS_REPORT.md](./OPENSPEC_ANALYSIS_REPORT.md) — Full specification
- [AUDIT_REPORT.md](./AUDIT_REPORT.md) — Audit findings
- [RFC_RELEASE_PROCESS_V2.md](./RFC_RELEASE_PROCESS_V2.md) — Release Process V2 proposal
- [MULTI_REPO_AGENT_STRATEGY.md](./MULTI_REPO_AGENT_STRATEGY.md) — Portable agents architecture

---

*Phase 4 Implementation Plan — Created 2026-08-08*  
*Status: READY FOR EXECUTION*
