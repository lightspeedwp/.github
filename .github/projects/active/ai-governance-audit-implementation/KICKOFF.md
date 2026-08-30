---
title: "AI Governance Audit Implementation — Project Kickoff"
description: "Fixing critical gaps in AI governance rules causing systematic violations of branch naming, PR templates, and issue/PR titles."
version: "1.0"
date: "2026-08-30"
project_type: "governance"
status: "active"
milestone: "v1.1"
---

# AI Governance Audit Implementation — Kickoff

**Project Goal:** Fix critical gaps in AI governance that cause Claude and Copilot to systematically ignore branch naming conventions, resulting in PR template assignment failures, missed labels, and inconsistent issue/PR titles.

**Impact:** Zero manual workarounds. AI agents follow governance rules. All issues/PRs have consistent, properly-typed titles. All PRs link to issues.

---

## Problem Statement

### Current State
- Claude creates branches as `claude/{scope}-{title}` instead of `{type}/{scope}-{title}`
- Copilot always defaults to `copilot/{scope}-{title}`
- These invalid prefixes break PR template assignment (routing is prefix-based)
- Users must manually fix branches, reassign templates, and normalize titles
- This costs significant time, credits, and human stress

### Root Cause (Phase 1-2 Audit Findings)
Three-layer gap:
1. **Visibility Problem:** Branch naming rules are mid-document in CLAUDE.md, missing entirely from AGENTS.md, and buried in repo-local instructions
2. **Clarity Problem:** Rules don't explain consequences (PR templates won't assign, automation breaks)
3. **Platform Conflict:** Claude Code defaults to `claude/*`, Copilot to `copilot/*`, overriding documented rules that aren't visible in entry-point files

**Evidence:** Branch `claude/test-coverage-analysis-jppjrb` exists in PHASE-3-IMPLEMENTATION.md, proving rules are bypassed.

---

## Solution Overview

**5-Phase Implementation:**

| Phase | Goal | Duration | Status |
|-------|------|----------|--------|
| **Phase 1-2** | Diagnosis & Root Cause | ✅ Complete | Audit Report: `/scratchpad/governance-audit-phase-1-2-report.md` |
| **Phase 3** | Implementation — Fix Rules & Add Fallback | 3-4 weeks | 🔄 In Progress |
| **Phase 4** | Validation & Testing | 2 weeks | ⏳ Planned |
| **Phase 5** | Rollout & Documentation | 2-3 weeks | ⏳ Planned |

---

## Deliverables — Phase 3

### Priority 1: Fix Governance Rule Visibility (Week 1)
- [ ] Move branch naming rules to **top of CLAUDE.md** (above repo description)
- [ ] Add **new "AI Governance" section to AGENTS.md** (top-level)
- [ ] Add **branch naming guidance to .github/custom-instructions.md** (Copilot)
- [ ] Include **consequences and examples** for all `type/` prefixes
- [ ] Explicitly forbid `claude/`, `copilot/`, `openai/` with clear rationale

**Deliverable Issues:**
- `docs/governance: Move branch naming rules to top of CLAUDE.md and AGENTS.md`
- `docs/governance: Add AI branch naming guidance to custom-instructions.md`

### Priority 2: Add Fallback PR Template Routing (Week 1-2)
- [ ] Update `.github/PULL_REQUEST_TEMPLATE/config.yml` to add fallback routes for `claude/*` and `copilot/*`
- [ ] Create GitHub Action `.github/workflows/pr-template-resolver.yml` that:
  - Detects `claude/*` or `copilot/*` branches
  - Queries linked issue for type information
  - Comments with correct template recommendation
  - Auto-assigns correct template (if supported)

**Deliverable Issues:**
- `build/ci: Update PR template routing config with fallback strategy`
- `build/ci: Create PR template resolver GitHub Action`

### Priority 3: Create Title Normalization Script (Week 2)
- [ ] Create `scripts/automation/normalize-issue-pr-titles.js`:
  - Normalize issue/PR titles to include type prefix (e.g., "Bug: ", "Feature: ")
  - Support batch mode (scan all open/closed/both)
  - Support dry-run mode
  - Generate summary report
- [ ] Create comprehensive tests
- [ ] Create GitHub Action `.github/workflows/normalize-titles.yml` (on-demand)

**Deliverable Issues:**
- `build/ci: Create issue/PR title normalization script with tests`
- `build/ci: Create normalize-titles GitHub Action workflow`

### Priority 4: Enforce PR-Issue Linking (Week 2)
- [ ] Create GitHub Action `.github/workflows/enforce-pr-issue-linking.yml` that:
  - Blocks PR merge if no issue linked
  - Provides helpful error message and link to docs
- [ ] Update PR template with linking reminder

**Deliverable Issues:**
- `build/ci: Create PR-issue linking enforcement workflow`
- `docs/governance: Update PR templates with linking requirements`

### Priority 5: Comprehensive Testing (Week 3)
- [ ] Add branch validation tests (claude/ and copilot/ must fail)
- [ ] Add template routing tests (fallback paths)
- [ ] Add title normalization tests (all type families)
- [ ] Add PR-issue linking tests
- [ ] Run on existing issues/PRs to validate robustness

**Deliverable Issues:**
- `test: Add comprehensive branch validation tests`
- `test: Add title normalization tests`
- `test: Add PR-issue linking enforcement tests`

### Priority 6: Documentation & Rollout (Week 3-4)
- [ ] Create/update `docs/BRANCHING_STRATEGY.md`
- [ ] Create/update `docs/PR_CREATION_PROCESS.md`
- [ ] Run title normalization on all existing issues/PRs
- [ ] Create migration guide for teams
- [ ] Plan rollout to other repos (WordPress block themes, plugins)

**Deliverable Issues:**
- `docs/governance: Create/update BRANCHING_STRATEGY.md`
- `docs/governance: Run title normalization on all existing issues/PRs`

---

## Success Criteria

- [ ] Claude and Copilot always use `{type}/{scope}-{title}` pattern (or use fallback routing if they don't)
- [ ] All issues have type-prefixed titles (e.g., "Bug: ", "Feature: ", "Documentation: ")
- [ ] All PRs have type-prefixed titles
- [ ] All PRs must link to an issue (enforced at merge)
- [ ] PR templates always correctly assigned (branch prefix OR linked issue type)
- [ ] All violations blocked or warned about (validation with enforcement)
- [ ] Zero manual workarounds by human
- [ ] Rules portable for rollout to other repos

---

## Timeline

| Week | Focus | Deliverables |
|------|-------|--------------|
| **Week 1** | Visibility + Fallback Routing | 4 issues (governance + template routing) |
| **Week 2** | Title Normalization + Linking Enforcement | 4 issues (scripts + workflows) |
| **Week 3** | Testing + Documentation | 3 issues (tests + docs) |
| **Week 4** | Rollout Planning | Migration guide + other-repo planning |

**Total Duration:** 3-4 weeks (Phase 3)  
**Follow-up:** Phase 4-5 validation and rollout (2-3 weeks each)

---

## Dependencies & Risks

### Dependencies
- Audit reports (Phase 1-2): ✅ Complete
- GitHub API access for automated PR template assignment (may need investigation)
- Ability to run scripts on existing issues/PRs (GitHub CLI or API)

### Risks
- **Risk:** GitHub doesn't support auto-assigning PR templates after PR creation
  - **Mitigation:** Implement as comment-based warning instead
- **Risk:** Title normalization could break existing issue/PR URLs if done carelessly
  - **Mitigation:** Test on non-critical items first; implement idempotent script
- **Risk:** Adding enforcement (block PR merge) could break existing workflows
  - **Mitigation:** Implement as warning first (comments), then escalate to enforcement

---

## Audit Reports & References

### Phase 1-2 Audit Findings
**File:** `/tmp/claude-0/-home-user--github/1dd12737-b8e3-5e97-ae4d-092880e59e1b/scratchpad/governance-audit-phase-1-2-report.md`

**Key Findings:**
- Branch naming rules exist but are spread across 3 files (CLAUDE.md, AGENTS.md buried, custom-instructions.md buried)
- PR template routing is branch-prefix-only with no fallback
- Validation runs but doesn't block merges
- Platform defaults (claude/, copilot/) conflict with documented rules

### Related Documentation
- `.github/CLAUDE.md` — Primary AI rules (branch naming mid-document)
- `.github/AGENTS.md` — Global AI rules (missing branch naming section)
- `.github/instructions/branch-naming.instructions.md` — Comprehensive rules (buried)
- `.github/PULL_REQUEST_TEMPLATE/config.yml` — PR template routing (branch-prefix-only)
- `.github/scripts/validation/validate-branch-name.js` — Validation logic (doesn't block merges)

---

## Team & Ownership

- **Project Owner:** Ashley @ LightSpeed
- **Implementation Lead:** Claude Code (AI agent)
- **Review:** LightSpeed team
- **Rollout:** Cross-team coordination

---

## Next Steps

1. ✅ **Phase 1-2:** Audit complete (diagnosis done)
2. 🔄 **Phase 3 Week 1:** Create GitHub issues from openspec (this kickoff)
3. 🔄 **Phase 3 Week 1:** Move rules to top of CLAUDE.md/AGENTS.md
4. 🔄 **Phase 3 Week 1-2:** Implement fallback routing
5. ⏳ **Phase 3 Week 2:** Create scripts & workflows
6. ⏳ **Phase 3 Week 3:** Testing & documentation
7. ⏳ **Phase 4:** Validation & fix any gaps
8. ⏳ **Phase 5:** Rollout to other repos

---

**Branch:** `feat/ai-governance-audit-implementation`  
**Milestone:** `v1.1`  
**Assigned Issues:** See PLANNING.md for full issue list
