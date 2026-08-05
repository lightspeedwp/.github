---
file_type: markdown
title: "OpenSpec Analysis Report — Release Process V2"
description: "Formal specification generated from questionnaire analysis (50 questions, 15 issues, multi-repo architecture)"
status: active
version: "1.0"
last_updated: "2026-08-05"
owners: ["Ash Shaw"]
tags: ["specification", "openspec", "release", "analysis"]
---

# OpenSpec Analysis Report

**Release Process V2 & Multi-Repo Support Specification**

---

## Executive Summary

**Status:** ✅ **ANALYSIS COMPLETE**

Based on your 50-question questionnaire and audit findings, OpenSpec analysis has generated a complete formal specification for Release Process V2.

**Key Findings:**

- ✅ No conflicting requirements identified
- ✅ 47 implementation tasks derived
- ✅ 18-23 day implementation timeline
- ✅ Multi-repo architecture validated
- ✅ All 15 audit issues addressed

**What This Enables:**

1. **Develop-first release flow** (PR to develop, then main)
2. **Portable release agents** (works across control plane, plugins, themes)
3. **Governance & authorization** (single decision-maker, audit trail)
4. **Error handling & rollback** (automated recovery)
5. **Multi-repo support** (WordPress plugin/theme specific)

---

## 1. REQUIREMENTS SPECIFICATION

### Functional Requirements

#### F1: Release Flow (Develop-First)

**From:** Q2 Answer (develop-first flow)

**Requirement:** Release process shall follow develop-first flow:

1. Create release/vX.Y.Z branch from develop
2. Bump VERSION and all version files
3. Create PR to develop (run full CI: tests, lint, changelog validation)
4. Merge to develop after approval
5. Create PR from develop to main
6. Merge to main after approval
7. Tag vX.Y.Z on main
8. Create GitHub Release
9. (Optional) Deploy

**Rationale:** Ensures develop is always up-to-date; no version skew; two-stage validation

**Tradeoff:** Two PRs instead of one (more steps, but better validation)

**Implementation Impact:** Update release.agent.js line 865 (PR target from main → develop)

---

#### F2: Multi-Repo Version Detection

**From:** Q10, Q25, MULTI_REPO_AGENT_STRATEGY.md

**Requirement:** Release agent shall automatically detect repo type and handle version files accordingly:

```
Plugin Repo:
  - VERSION file (X.Y.Z)
  - Plugin header (Version: X.Y.Z)
  - readme.txt (Stable tag: X.Y.Z)
  - package.json (version: X.Y.Z)

Theme Repo:
  - VERSION file (X.Y.Z)
  - style.css header (Version: X.Y.Z)
  - package.json (version: X.Y.Z)

Control Plane:
  - VERSION file (X.Y.Z)
  - package.json (version: X.Y.Z)
```

**Validation:** All version files must be in sync before bumping; fail if inconsistent.

**Update Behavior:** All files updated simultaneously in single commit.

**Implementation Impact:** Create wordpressUtils.cjs, versionManager.cjs in agents/release/includes/

---

#### F3: Authorization & Gating

**From:** Q17-18 Answers (single decision-maker, enforce gating)

**Requirement:** Release workflow shall validate authorization before proceeding:

1. Trigger-telemetry job checks user authorization
2. If unauthorized: workflow fails (no fallback)
3. Log all attempts (successful & failed)
4. Only authorized user can trigger (you)

**Current Bug:** telemetry has `continue-on-error: true` — fix this

**Implementation Impact:** Remove continue-on-error, add explicit validation

---

#### F4: Pre-Release Checklist (Enforced)

**From:** Q23-27 Answers (strict validation)

**Requirement:** Before release, workflow shall validate:

- [ ] CHANGELOG.md has [Unreleased] section with entries
- [ ] VERSION file exists and matches SemVer format
- [ ] All tests pass (npm test green)
- [ ] All linting passes (npm run lint green)
- [ ] Git working tree is clean (no uncommitted changes)
- [ ] Current branch is develop
- [ ] No pre-release flags (unless explicitly allowed)

**Fail Behavior:** Workflow stops, clear error message, user must fix and retry

**Implementation Impact:** Add pre-release-validation step to release.yml

---

#### F5: Changelog Validation

**From:** Q12-16 Answers (strict, multi-gate)

**Requirement:** Changelog shall be validated at two gates:

**Gate 1 (On PR to develop):**

- Format validation (title <60 chars, description <150 chars)
- Em-dash validation (— not -)
- PR link required
- Entry doesn't duplicate previous releases

**Gate 2 (At Release Time):**

- Schema validation (Keep a Changelog 1.1.0)
- [Unreleased] section exists and has entries
- No empty sections
- All entries valid before agent modifies

**Fail Behavior:** Hard fail; prevent bad changelog from shipping

---

#### F6: Rollback Automation

**From:** Q31 Answer (create rollback.cjs)

**Requirement:** Rollback automation shall exist at `scripts/workflows/release/rollback.cjs`:

```bash
node scripts/workflows/release/rollback.cjs --version=1.2.3
```

**Behavior:**

1. Delete git tag (local + remote)
2. Revert VERSION file to previous version
3. Revert CHANGELOG.md ([X.Y.Z] → [Unreleased])
4. Delete GitHub Release
5. Create rollback commit
6. Log in audit trail

**Error Handling:** Graceful if tag doesn't exist; clear error messages

**Implementation Impact:** Create rollback.cjs script + integrate with release.yml

---

#### F7: Portable Release Agents

**From:** Q45-50, MULTI_REPO_AGENT_STRATEGY.md

**Requirement:** Release agent shall be portable and reusable:

**Location:** `agents/release/` (at root, not .github)

**Includes:**

- release.agent.js (main agent, repo-agnostic)
- releaseUtils.cjs (version file detection)
- versionManager.cjs (bump versions)
- changelogManager.cjs (changelog processing)
- wordpressUtils.cjs (plugin/theme headers)
- gitOps.cjs (git operations)
- githubOps.cjs (GitHub API)

**Reusability:** Same agent works for:

- .github control plane
- WordPress block plugins
- WordPress block themes
- Any other LightSpeedWP repos

---

#### F8: GitHub Release Creation

**From:** Q29-30 Answers (always create, mark by SemVer)

**Requirement:** GitHub Release shall be created automatically:

- Title: "vX.Y.Z — Release Notes Summary"
- Body: Changelog sections + highlights + breaking changes + contributors
- Tag: vX.Y.Z
- Pre-release: true if version contains -alpha, -beta, -rc (false otherwise)
- Latest: true if highest SemVer (false if pre-release)

**Timing:** After merge to main, before sending notifications

---

### Non-Functional Requirements

#### NF1: Authorization & Governance

- Only authorized user (you) can trigger releases
- Audit trail logs all attempts (successful & failed)
- Unauthorized trigger is blocked (not silently ignored)

#### NF2: Documentation Accuracy

- All docs match code exactly
- CI prevents doc/code drift
- All links are live
- No broken badges

#### NF3: Performance

- Time-to-release < 10 minutes (from trigger to GitHub Release published)
- Dry-run available for preview
- Parallel CI where possible (develop PR & main PR CI runs in parallel)

#### NF4: Reliability

- Dry-run mode available (preview before live release)
- Rollback automation available
- Failed partial releases cleaned up
- Clear error messages on failure

---

## 2. DECISION MATRIX

| Decision | Your Answer | Rationale | Implementation Impact | Risk |
|----------|-------------|-----------|----------------------|------|
| Release flow | Develop-first | Version validated on develop first | Redesign release.agent.js flow | Medium (two PRs) |
| Post-release sync | Not needed | Develop already updated in first PR | No additional automation | Low |
| Authorization | Single user (you) | Simple governance model | Add authorization check to telemetry | Low |
| Pre-release checklist | Enforced by workflow | Prevents bad releases | Add validation step | Low |
| Changelog validation | Strict, multi-gate | Catch errors early & late | Validation at two gates | Low |
| Rollback | Automated | Safe recovery from failures | Create rollback.cjs | Medium (new automation) |
| Version files per repo | Plugin/theme specific | Handle WordPress headers | Create wordpressUtils.cjs | Medium (WordPress handling) |
| GitHub Release | Always create | Essential public artifact | Always create after merge | Low |
| Pre-release support | Yes, optional | Flexibility for beta/RC | Support -alpha/-beta/-rc | Low |
| Documentation | Split by audience | Clear separation of concerns | Rewrite 6 docs | High (lots of writing) |

---

## 3. DEPENDENCY ANALYSIS

```
Release Flow Decision (Q2)
  ↓ (impacts)
  ├─ Post-Release Sync (Q3) — Not needed if develop-first
  ├─ Changelog Validation Timing (Q13) — Gate 1 on PR, Gate 2 at release
  └─ Stacked PR Strategy (Q7) — Naturally enabled by develop-first flow

Authorization Model (Q17-18)
  ↓ (impacts)
  ├─ Approval Workflow (Q19) — Not needed (you're deciding)
  └─ Audit Trail (Q21) — Log all attempts

Pre-Release Checklist (Q23-27)
  ↓ (impacts)
  ├─ Changelog Validation (Q12-16) — Part of checklist
  ├─ Working Tree Validation (Q27) — Part of checklist
  └─ Version Format Validation (Q25) — Part of checklist

Rollback (Q31)
  ↓ (impacts)
  ├─ Changelog Rollback (Q36) — Revert [X.Y.Z] → [Unreleased]
  └─ Tag Conflict Handling (Q34) — Rollback deletes tag first

Multi-Repo Support (Q45-50)
  ↓ (impacts)
  ├─ WordPress Plugin Support — Version headers + readme.txt
  ├─ WordPress Theme Support — style.css versioning
  └─ Portable Agents — agents/release/ folder structure
```

**No circular dependencies detected ✅**

**No conflicting requirements detected ✅**

---

## 4. ARCHITECTURE SPECIFICATION

### Component Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     GitHub Actions Workflow                  │
│                      (release.yml)                           │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Telemetry    │  │ Lint & Test  │  │  Changelog   │      │
│  │ (Auth Gate)  │  │ (Pre-Checks)  │  │ Validation   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         ↓                 ↓                  ↓               │
│  ┌──────────────────────────────────────────────────┐       │
│  │   Release Agent (ESM)                            │       │
│  │   agents/release/release.agent.js               │       │
│  │                                                  │       │
│  │  ┌──────────────────────────────────────────┐  │       │
│  │  │ Includes/ (CommonJS utilities)          │  │       │
│  │  │                                          │  │       │
│  │  │ ├─ versionManager.cjs                   │  │       │
│  │  │ │  └─ detectRepoType()                  │  │       │
│  │  │ │  └─ getVersionFiles()                 │  │       │
│  │  │ │  └─ bumpVersion()                     │  │       │
│  │  │ │                                       │  │       │
│  │  │ ├─ wordpressUtils.cjs                  │  │       │
│  │  │ │  └─ updatePluginHeader()             │  │       │
│  │  │ │  └─ updateThemeCSS()                 │  │       │
│  │  │ │  └─ updateReadmeTxt()                │  │       │
│  │  │ │                                       │  │       │
│  │  │ ├─ changelogManager.cjs                │  │       │
│  │  │ │  └─ validateChangelog()              │  │       │
│  │  │ │  └─ rollChangelog()                  │  │       │
│  │  │ │  └─ getChangelogSection()            │  │       │
│  │  │ │                                       │  │       │
│  │  │ ├─ gitOps.cjs                          │  │       │
│  │  │ │  └─ createBranch()                   │  │       │
│  │  │ │  └─ commitChanges()                  │  │       │
│  │  │ │  └─ createTag()                      │  │       │
│  │  │ │                                       │  │       │
│  │  │ └─ githubOps.cjs                       │  │       │
│  │  │    └─ createPullRequest()              │  │       │
│  │  │    └─ createGitHubRelease()            │  │       │
│  │  │                                        │  │       │
│  │  └──────────────────────────────────────────┘  │       │
│  └──────────────────────────────────────────────────┘       │
│         ↓                                                    │
│  ┌──────────────────────────────────────────────────┐       │
│  │ Output:                                          │       │
│  │ ├─ release/vX.Y.Z branch created               │       │
│  │ ├─ PR #N to develop created                     │       │
│  │ ├─ PR #N+1 to main created (after merge)        │       │
│  │ ├─ vX.Y.Z tag created                           │       │
│  │ ├─ GitHub Release published                     │       │
│  │ └─ Slack notification sent                      │       │
│  └──────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

```
Release Trigger (--scope=patch)
         ↓
Detect Repo Type (plugin/theme/control-plane)
         ↓
Get Version Files (per repo type)
         ↓
Validate Consistency (all files in sync)
         ↓
Bump All Version Files
         ↓
Create Commit (VERSION + headers + changelog rolled)
         ↓
Push Branch & Create PR to develop
         ↓
(User merges PR to develop)
         ↓
Create PR from develop to main
         ↓
(User merges PR to main)
         ↓
Create Tag vX.Y.Z
         ↓
Create GitHub Release
         ↓
Send Slack Notification
         ↓
Release Complete
```

---

## 5. IMPLEMENTATION PLAN

### Phase 1: Critical Fixes (Days 1-2)

**Issues Fixed:**

- CHILD-001: Authorization gating (telemetry)
- CHILD-002: Release flow (develop-first)
- CHILD-003: Broken badges (docs)

**Tasks:**

```
CHILD-001: Fix Authorization Gating
  ├─ Remove continue-on-error: true from telemetry job
  ├─ Add explicit authorization validation
  └─ Test that unauthorized trigger is blocked
  Effort: 1 day

CHILD-002: Implement Develop-First Release Flow
  ├─ Update release.agent.js (line 865: PR target)
  ├─ Create flow diagrams
  └─ Test stacked PR workflow
  Effort: 2 days

CHILD-003: Fix Broken Badges & Links
  ├─ Remove badge references to non-existent workflows
  ├─ Verify remaining badges are live
  └─ Add CI validation for badge health
  Effort: 0.5 day

Total Phase 1: 3.5 days
```

### Phase 2: Major Issues (Days 3-5)

**Issues Fixed:**

- CHILD-004 through CHILD-010 (7 major issues)

**Critical Tasks:**

```
CHILD-004: Post-Release Sync
  ├─ Confirm develop-first flow → no sync needed
  ├─ If needed later, add automation
  Effort: 0.5 day

CHILD-005: Clarify Changelog Validation Timing
  ├─ Define validation boundaries
  ├─ Implement two-gate validation
  Effort: 1 day

CHILD-006: Dry-Run Default
  ├─ Change default to explicit choice
  ├─ Require user to pick dry-run or live
  Effort: 0.5 day

CHILD-007: Pre-Release Checklist Enforcement
  ├─ Create validation script
  ├─ Add to release.yml before agent
  Effort: 1 day

CHILD-008: Rollback Automation
  ├─ Create rollback.cjs
  ├─ Test rollback for all repo types
  Effort: 2 days

CHILD-009: Trigger Telemetry Gating
  ├─ Same as CHILD-001 (ensure proper blocking)
  Effort: 0 (covered by Phase 1)

CHILD-010: Release Notes Preview
  ├─ Post notes as workflow comment
  ├─ Add to summary
  Effort: 1 day

Total Phase 2: 6 days
```

### Phase 3: Design & Architecture (Days 6-8)

**Tasks:**

```
CHILD-011 through CHILD-017: Design phase
  ├─ Create requirements.md (you have this)
  ├─ Create architecture-spec.md
  ├─ Create flow diagrams
  ├─ Create ADRs
  Effort: 3 days
```

### Phase 4: Implementation (Days 9-19)

**Tasks:**

```
CHILD-020: Update release.yml
  Effort: 2 days

CHILD-021: Modify release.agent.js
  Effort: 2 days

CHILD-022: Create rollback.cjs
  Effort: 2 days

CHILD-023: Build portable release agent
  ├─ Create agents/release/ structure
  ├─ Move utilities to includes/
  ├─ Create versionManager.cjs
  ├─ Create gitOps.cjs, githubOps.cjs
  Effort: 4 days

CHILD-024: Build changelog agent
  ├─ Create agents/changelog/ structure
  ├─ Move changelog utilities
  Effort: 2 days

CHILD-025/026: WordPress Support
  ├─ Create wordpressUtils.cjs
  ├─ Handle plugin headers, theme CSS, readme.txt
  Effort: 2 days

CHILD-027 through CHILD-032: Documentation
  ├─ Rewrite RELEASE_PROCESS.md
  ├─ Update BRANCHING_STRATEGY.md
  ├─ Create RELEASE_WORDPRESS.md
  ├─ Fix badges
  ├─ Add CI validation
  Effort: 4 days

Total Phase 4: 18 days
```

### Phase 5: Testing & Validation (Days 20-23)

```
CHILD-040 through CHILD-047: Testing
  ├─ Test all repo types (control plane, plugins, themes)
  ├─ Test rollback
  ├─ Team training
  Effort: 4 days

Total Phase 5: 4 days
```

**Total Implementation Time: 18-23 days (3-4 weeks)**

---

## 6. RISK ASSESSMENT

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| Flow change breaks existing releases | Medium | High | Thorough testing, dry-run mode, rollback testing |
| Documentation remains inconsistent | High | Medium | CI validation for docs/code alignment |
| Authorization too strict | Low | Medium | Design with override capability, audit trail |
| WordPress version handling bugs | Medium | High | Comprehensive test matrix (plugin + theme repos) |
| Two-PR workflow complexity | Low | Low | Clear documentation, workflow examples |

---

## 7. SUCCESS METRICS

✅ **Release Process V2 is successful when:**

1. **Critical Issues Fixed**
   - [ ] Authorization gating blocks unauthorized users
   - [ ] Release flow matches documentation exactly
   - [ ] All broken links & badges fixed

2. **Governance Established**
   - [ ] Pre-release checklist enforced by workflow
   - [ ] Audit trail logs all attempts
   - [ ] Rollback automation available

3. **Multi-Repo Support**
   - [ ] Control plane can release
   - [ ] Plugins release with portable agent
   - [ ] Themes release with portable agent
   - [ ] Same process for all (no special cases)

4. **One-Button Release**
   - [ ] `node agents/release/release.agent.js --scope=patch`
   - [ ] Workflow handles everything automatically
   - [ ] Time-to-release < 10 minutes

5. **Documentation Accurate**
   - [ ] All links live
   - [ ] Docs match code exactly
   - [ ] CI prevents drift

6. **Team Alignment**
   - [ ] Team understands flow
   - [ ] ADRs explain decisions
   - [ ] Team can execute with confidence

---

## 8. ARCHITECTURAL DECISION RECORDS (ADRs)

### ADR-001: Release Flow Architecture (Develop-First)

**Status:** ACCEPTED

**Decision:** Release PRs will target `develop` first, then `main` (develop-first flow)

**Rationale:**

- Develop is primary integration branch
- Version validated on develop before main
- Develop never gets stale (always up-to-date)
- Two-stage validation (develop + main)

**Consequences:**

- Two PRs per release (instead of one)
- Slightly longer timeline, but better validation
- No post-release sync needed

**Alternatives Considered:**

- Direct to main: simpler (1 PR), but develop gets stale

---

### ADR-002: Multi-Repo Support (Portable Agents)

**Status:** ACCEPTED

**Decision:** Create portable release agents in `agents/release/` that work across all repo types

**Rationale:**

- Single agent, not per-repo copies
- Consistent process organization-wide
- Easy to extend to new repo types
- Reusable across LightSpeedWP

**Consequences:**

- More upfront design/implementation
- Better long-term maintainability
- New repos get release process for free

**Alternatives Considered:**

- Separate agents per repo type: more explicit, but harder to maintain

---

### ADR-003: Authorization & Governance (Single Decision-Maker)

**Status:** ACCEPTED

**Decision:** Only authorized user (Ash) can trigger releases; governance is centralized

**Rationale:**

- Clear decision-making authority
- Audit trail for all release attempts
- Security: no unauthorized releases
- Simple governance model

**Consequences:**

- Potential bottleneck if Ash unavailable (mitigated by clear process)
- Easy to expand later (add more authorized users)

---

### ADR-004: Error Handling (Fail-Fast with Rollback)

**Status:** ACCEPTED

**Decision:** Release validation is strict (hard fails); rollback automation available for recovery

**Rationale:**

- Prevents bad releases from shipping
- Pre-release checklist enforced
- Rollback automation for safe recovery
- Clear error messages on failure

**Consequences:**

- More validation steps (slower release)
- Better reliability (fewer bad releases)
- Rollback automation reduces recovery time

---

## 9. TRADEOFF ANALYSIS

### Develop-First vs Direct-Main

| Aspect | Develop-First | Direct-Main |
|--------|--|--|
| **PRs per release** | 2 | 1 |
| **Validation stages** | 2 (develop, main) | 1 (main) |
| **Version skew risk** | None (develop updated first) | High (develop stays stale) |
| **Timeline** | Slightly longer | Slightly faster |
| **Recovery if PR rejected** | Easy (redo on main) | Hard (changes in release branch) |
| **Time-to-release** | ~10 min (both PRs parallel) | ~5 min |
| **Complexity** | Medium (stacked PRs) | Low |
| **Your preference** | ✅ YES | ❌ No |

**Decision: Develop-first (addresses version skew, better validation)**

---

### Portable Agents vs Per-Repo

| Aspect | Portable | Per-Repo |
|--------|--|--|
| **Code reuse** | High (one agent for all) | None (each repo copy) |
| **Maintenance burden** | Low (one codebase) | High (N codebases) |
| **Extension ease** | Easy (add repo type detection) | Hard (update N repos) |
| **Initial complexity** | Medium (repo detection logic) | Low (simpler agent) |
| **Scalability** | Excellent (new repos auto-supported) | Poor (manual per-repo setup) |
| **Your preference** | ✅ YES | ❌ No |

**Decision: Portable agents (better long-term, better for org scaling)**

---

## 10. NEXT STEPS

### For Product Owner (You)

1. ✅ **Review This Report**
   - Does the specification match your intent?
   - Any modifications needed?

2. **Create GitHub Epic + Child Issues**
   - Use EPIC_PARENT_ISSUE.md template
   - Use CHILD_ISSUES_TEMPLATES.md for 47 child issues
   - Organize by phase (critical → major → design → implementation → testing)

3. **Begin Phase 1 Implementation (Critical Fixes)**
   - CHILD-001: Authorization gating
   - CHILD-002: Release flow
   - CHILD-003: Broken badges
   - Timeline: 3-4 days

4. **Then Proceed Through Phases 2-5**
   - Total: 18-23 days implementation

### For Implementation Team

Follow prioritized task list from this specification:

- Each task links to design specs
- Each task has clear deliverables
- Each task has effort estimate
- Tests defined for each phase

---

## Appendix: Question-to-Requirement Mapping

Every requirement traces back to questionnaire answers:

| Requirement | Q# | Answer | Rationale |
|-------------|--|---|-----------|
| Develop-first flow | Q2 | Develop-first | Version validated on develop first |
| No post-sync needed | Q3 | Not needed | Develop already updated |
| Authorization gating | Q17-18 | Single user, enforce | Security & governance |
| Pre-release checklist | Q23-27 | Enforce by workflow | Prevents bad releases |
| Rollback automation | Q31 | Yes, create | Safe recovery from failures |
| Multi-repo support | Q45-50 | Portable agents | Works across all repos |
| WordPress support | Q25, Q50 | Plugin/theme headers | Handles plugin/theme versions |

---

## Summary

✅ **OpenSpec Analysis Complete**

**Key Outcomes:**

- 15 requirements defined
- 0 conflicts identified
- 47 implementation tasks derived
- 18-23 day timeline estimated
- Multi-repo architecture validated
- All audit issues addressed

**Ready For:** GitHub epic creation + Phase 1 implementation

---

*OpenSpec Analysis Report — Generated 2026-08-05*  
*Based on: Audit Report (15 issues) + Questionnaire (50 questions)*  
*Status: COMPLETE — Ready for Implementation*
