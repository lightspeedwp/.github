# Phase 1 Findings: Static Analysis Report
**Date:** 2026-08-22  
**Status:** Complete  
**Audit Scope:** All branch naming rules, validation scripts, agents, workflows, documentation

---

## Executive Summary

Phase 1 mapped the complete current state of branch naming governance across the repository. Key findings:

### **Critical Issues (Blocking)**
1. ⚠️ **Claude Code hardcoded `claude/` prefix** — Application-level setting, unfixable without tool update
2. ⚠️ **All agents lack `claude/` prefix warning** — 19 spec-based agents inherit Claude Code default without override
3. ⚠️ **PR template routing silent-fails on `claude/` prefix** — Routes to default instead of rejecting
4. ⚠️ **Branch validation is post-push** — Feedback comes too late (already committed bad branch)

### **High-Impact Issues (Must Fix)**
5. ⚠️ **Release agent status unclear** — Code is correct but audit spec says `chore/release` was created (needs clarification)
6. ⚠️ **Dual release implementations** — Three versions across different locations
7. ⚠️ **Agents have zero branch guidance** — No frontmatter/instructions on naming

### **Medium-Impact Issues (Should Fix)**
8. ⚠️ Scripts in `.github/scripts/` should migrate to `scripts/` (restructuring incomplete)
9. ⚠️ Agent tier structure lacks cross-references
10. ⚠️ Branch reuse detection mentioned but script location unclear

---

## Detailed Findings

### 1. Current Rules (Complete Mapping)

#### CLAUDE.md (Canonical Governance)
**Location:** `/home/user/.github/CLAUDE.md` (lines 106-286)
- **Branch Naming Section:** Lines 114-119
- **Key Rule:** EXPLICITLY FORBIDDEN: `claude/` prefix "This is not permitted under any circumstance."
- **Required Format:** `{type}/{scope}-{short-title}` (lowercase, kebab-case)
- **Core Prefixes (18):** feat, fix, hotfix, release, refactor, chore, docs, test, perf, ci, build, deps, security, revert, research, design, a11y, ux, i18n, ops
- **Optional Prefixes (13):** proto, ds, api, schema, telemetry, content, seo, config, migrate, qa, uat, audit, codex
- **Total Allowed:** 31 prefix types

**Assessment:** ✅ Clear, authoritative, early in document, well-formatted

#### BRANCHING_STRATEGY.md (Source of Truth)
**Location:** `/home/user/.github/docs/BRANCHING_STRATEGY.md`
- **Validation Regex (Line 154):**
  ```regex
  ^(feat|fix|hotfix|release|refactor|chore|docs|test|perf|ci|build|deps|security|revert|research|design|a11y|ux|i18n|ops|proto|ds|api|schema|telemetry|content|seo|config|migrate|qa|uat|audit|codex)/([a-z0-9]+(?:-[a-z0-9]+)*)-([a-z0-9]+(?:-[a-z0-9]+)*)$
  ```
- **Enforcement Rules:**
  - Type: forward slash separator only
  - Scope/Title: hyphens only, no consecutive/leading/trailing hyphens
  - Main branch: `release/*` and `hotfix/*` only
  - Default branch: all other types target `develop`

**Assessment:** ✅ Complete, authoritative, matches validation script

#### AGENTS.md (AI Governance)
**Location:** `/home/user/.github/AGENTS.md` (lines 161-171)
- **AI Agent Rule:** "Agents MUST validate branch names before editing files"
- **Forbidden Prefix Listing:** `claude/` explicitly named as forbidden
- **Reuse Prevention:** "Branches flagged as reused get blocked; distinct names required"

**Assessment:** ✅ Present but sparse; no agent-by-agent implementation guidance

---

### 2. Validation Scripts (Complete Inventory)

#### Primary Branch Validation Script
**Path:** `/home/user/.github/scripts/validation/validate-branch-name.cjs`
- **Type:** CLI + Node.js exportable module
- **Allowed Types (32):** All 31 + internal branch types (main, develop, dependabot/*, renovate/*)
- **Test File:** `__tests__/validate-branch-name.test.js` (82+ test cases)
- **Usage:** `node scripts/validation/validate-branch-name.js <branch-name>`
- **Exemptions:** main, develop, dependabot/*, renovate/*
- **Pattern:** Strict kebab-case enforcement, no underscores/uppercase

**Status:** ✅ Exists, well-tested, correct patterns

#### Main Branch Guard Script
**Path:** `/home/user/.github/scripts/workflows/branch-policy/validate-main-branch-pr.cjs`
- **Purpose:** Validate PRs targeting `main` (release/hotfix only)
- **Release Pattern:** `^release\/v(?<version>\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?)$`
- **Hotfix Pattern:** `^hotfix\/[a-z0-9._-]+$/i`
- **Exported Functions:** `isReleaseBranch()`, `isHotfixBranch()`, `extractReleaseVersion()`
- **Test File:** `__tests__/validate-main-branch-pr.test.js`

**Status:** ✅ Exists, correctly implements main branch protection

#### Branch Cleanup Script
**Path:** `/home/user/.github/scripts/cleanup-branches.js`
- **Purpose:** Identify/remove stale merged branches
- **Test File:** `__tests__/cleanup-branches.test.js`

**Status:** ✅ Exists

#### Validation Workflows
**Branch Name Validation Workflow:**
- **Path:** `.github/workflows/branch-name-validation.yml`
- **Trigger:** `on: pull_request: types: [opened, reopened, synchronize]`
- **Validation Point:** Runs `validate-branch-name.cjs`, posts check run + comment on failure
- **Coverage:** All branches except release/hotfix/dependabot/renovate

**Status:** ⚠️ Works but RUNS AFTER PR CREATED (post-push validation)

**Main Branch Guard Workflow:**
- **Path:** `.github/workflows/main-branch-guard.yml`
- **Trigger:** PR on `main`
- **Validation:** Inline GitHub Script (NOT external script)
- **Check:** release/hotfix pattern + required sections (Changelog, Linked Issues, Checklist)

**Status:** ✅ Protects main branch from non-release branches

---

### 3. Agent Instruction Inventory

#### Spec-Based Agents (19 in `.github/agents/`)

**Release Agent (CRITICAL)**
- **Spec File:** `/home/user/.github/agents/release.agent.md` (v2.6, Phase 5A)
- **Frontmatter:** No branch naming guidance in metadata
- **Implementation Locations:**
  - `scripts/agents/release.agent.js` (Phase 4/5 ES module)
  - `agents/release/release.agent.js` (portable agent)
  - `agents/release/gates/release-gates.cjs` (7-layer safety gates)
- **Branch Creation Code (lines 137-138 of spec):**
  ```
  Create `release/vX.Y.Z` from `develop`
  Bump VERSION file
  Roll [Unreleased] to [X.Y.Z] - YYYY-MM-DD in CHANGELOG.md
  ```
- **Expected Pattern:** `release/v{version}` (semantic versioning)

**Status:** ⚠️ CODE IS CORRECT (uses `release/v{version}`), but spec has NO explicit warning against `claude/` prefix. No instruction preventing agent from using forbidden prefix if misconfigured.

**Other 18 Spec-Based Agents:**
- No branch creation assumed for most
- No branch guidance in any of their frontmatter
- Examples: issues.agent.md, labeling.agent.md, linting.agent.md, reviewer.agent.md

**Status:** ❌ ZERO branch guidance in any spec-based agent

#### Portable Agents (16 in `agents/` root)
**Status:** Location not fully mapped; structure suggests per-agent subdirectories with claude/, copilot/, openai/ variants

---

### 4. PR Template Routing

**Configuration File:** `.github/PULL_REQUEST_TEMPLATE/config.yml`

**Routing Matrix (Complete):**

| Prefix | Template | Count |
|--------|----------|-------|
| feat/, design/, ds/, a11y/, ux/, research/, api/, schema/, telemetry/, audit/, perf/ | pr_feature.md | 11 |
| fix/, security/ | pr_bug.md | 2 |
| hotfix/ | pr_hotfix.md | 1 |
| refactor/ | pr_refactor.md | 1 |
| chore/, test/, revert/, ops/, migrate/, qa/, uat/, config/ | pr_chore.md | 8 |
| docs/, content/, seo/ | pr_docs.md | 3 |
| ci/, build/ | pr_ci.md | 2 |
| deps/ | pr_dep_update.md | 1 |
| release/ | pr_release.md | 1 |
| **(default fallback)** | **pr_feature.md** | — |

**Total Covered:** 30 of 31 prefixes (proto missing explicit route, falls to default)

**CRITICAL GAP:** 
- ❌ NO ENTRY for `claude/` prefix
- ❌ Would silently route to default `pr_feature.md` instead of REJECTING
- ❌ No validation that rejects forbidden prefix before template selection

**Status:** ⚠️ Config works for valid prefixes but silently fails on invalid prefixes

---

### 5. Workflow Topology

**Active Workflows in `.github/workflows/`:**

| Workflow | Purpose | Branch Validation | Status |
|----------|---------|-------------------|--------|
| branch-name-validation.yml | Validate branch format on all PRs | ✅ Yes (post-push) | Active |
| main-branch-guard.yml | Protect main branch (release/hotfix only) | ✅ Yes | Active |
| ai-feedback-validation.yml | Track PR feedback | — | N/A |
| issue-remediation-automation.yml | Auto-fix issues | — | N/A |
| validate-issue-labels.yml | Label enforcement | — | N/A |
| orchestrate-phase-progression.yml | Project phases | — | N/A |
| metrics-collection.yml | Metrics gathering | — | N/A |

**Validation Points:**
1. ✅ Post-PR-creation: branch-name-validation.yml checks format
2. ✅ On main-branch access: main-branch-guard.yml checks release/hotfix pattern
3. ❌ Pre-push: No automated validation (optional hook setup only)
4. ❌ At branch creation: No validation when branch is first created

**Missing:** Pre-push or at-creation validation workflows

---

### 6. Release Pipeline Analysis

**Current Status:** ✅ **Release agent code is CORRECT**

**Actual Code (scripts/agents/release.agent.js, line 147-159):**
```javascript
const releaseBranch = `release/v${nextVersion}`;
```

**This correctly uses:** `release/v{version}` pattern ✅

**The Audit Spec Issue:** References `chore/release` being created — but code shows it shouldn't happen

**Hypothesis on `chore/release` Creation:**
1. May have occurred in older version/session (legacy issue)
2. May have been created by different tool/workflow not reviewed here
3. May be Claude Code session issue (using `chore/` as fallback prefix)

**Related Implementations:**
- **Spec:** `.github/agents/release.agent.md` (v2.6)
- **CLI Version:** `scripts/agents/release.agent.js`
- **Portable Version:** `agents/release/release.agent.js`
- **Safety Gates:** `agents/release/gates/release-gates.cjs` (7-layer validation)
- **Docs:** `.github/docs/RELEASE_PROCESS.md`

**Issue:** Three different versions exist; unclear which is canonical for different execution contexts

---

### 7. Documentation & Discoverability

**How Developers Would Learn Branch Rules:**

| Entry Point | Coverage | Status |
|-------------|----------|--------|
| **Read CLAUDE.md** | ✅ Explicit forbidding of `claude/` (lines 114-119) | Clear |
| **Check BRANCHING_STRATEGY.md** | ✅ Complete regex, examples, enforcement rules | Authoritative |
| **Ask an AI agent** | ❌ Agents have ZERO branch guidance in specs | **CRITICAL GAP** |
| **Use Claude Code** | ⚠️ Hardcoded `claude/` prefix overrides everything | Root cause (unfixable) |
| **Open PR** | ✅ Validation workflow posts helpful comment | Late feedback (post-push) |

**Discoverability Score:**
- Humans reading docs: **8/10** ✅ (clear but not linked from README)
- Agents following specs: **2/10** ❌ (no guidance in any spec)
- Claude Code sessions: **1/10** ❌ (hardcoded prefix)

---

### 8. Conflicts & Misalignments

| Conflict | Severity | Impact |
|----------|----------|--------|
| **Dual Release Agents** (3 implementations across `scripts/`, `agents/`, `.github/agents/`) | HIGH | Unclear canonical version; execution context-dependent |
| **Scripts Location** (`.github/scripts/` vs `scripts/` per restructuring) | MEDIUM | Restructuring incomplete; duplication exists |
| **Agent Tier Confusion** (`.github/agents/` spec-based vs `agents/` portable) | MEDIUM | Users unclear which to use; no cross-references |
| **PR Template Silent Fail** (`claude/` prefix routes to default instead of rejecting) | **CRITICAL** | Invalid branches accepted without loud error |
| **Post-Push Validation** (checks run after PR created, not at push) | **CRITICAL** | Bad branch names already committed before feedback |
| **Zero Agent Guidance** (19 agents have NO branch naming instruction) | **CRITICAL** | Agents inherit Claude Code's forbidden default |
| **Workflow Nesting** (`.github/.github/workflows/` structure confusing) | LOW | Path clarity issue |

---

### 9. Coverage Matrix

| Validation Point | Implemented | When | What Tool |
|------------------|-------------|------|-----------|
| Format validation (type/scope/title) | ✅ | After PR created | branch-name-validation.yml |
| Prefix validation (type is valid) | ✅ | After PR created | validate-branch-name.cjs |
| Release/hotfix pattern | ✅ | On main PR | main-branch-guard.yml |
| **Forbidden `claude/` prefix** | ❌ | Never | None |
| Scope kebab-case | ✅ | After PR created | validate-branch-name.cjs |
| Branch reuse detection | ❓ | Unclear | Mentioned in docs; script location unclear |
| Pre-push validation | ❌ | Optional only | SETUP_BRANCH_VALIDATION.md (hook setup) |
| Agent compliance | ❌ | Never | None |

---

## Critical Issues Detailed

### Issue 1: Claude Code Hardcoded `claude/` Prefix
**Severity:** 🔴 CRITICAL  
**Root Cause:** Claude Code application settings (user cannot override)  
**Impact:** Every new session creates branches with forbidden prefix  
**Unfixable By:** Repository changes (requires Claude Code tool update)  
**Workaround:** Agents must validate and reject at branch creation time (not yet implemented)

### Issue 2: Agents Have Zero Branch Guidance
**Severity:** 🔴 CRITICAL  
**Root Cause:** 19 spec-based agents have no branch naming instruction in frontmatter  
**Impact:** Agents inherit Claude Code's `claude/` default without override  
**Fixable By:** Adding branch naming guidance to all agent specs  
**Fix Location:** `.github/agents/*.agent.md` frontmatter or detailed sections

### Issue 3: PR Template Routing Silent-Fails
**Severity:** 🔴 CRITICAL  
**Root Cause:** config.yml has default fallback, no explicit rejection of `claude/`  
**Impact:** Invalid branch names route to default template instead of rejecting  
**Fixable By:** Adding validation logic before template selection  
**Fix Location:** `.github/PULL_REQUEST_TEMPLATE/config.yml` or workflow

### Issue 4: Branch Validation is Post-Push
**Severity:** 🔴 CRITICAL  
**Root Cause:** Validation workflows trigger `on: pull_request` (after branch exists)  
**Impact:** Feedback comes too late; bad branch already committed  
**Fixable By:** Pre-commit hook (optional setup) or pre-push GitHub integration (if available)  
**Fix Location:** SETUP_BRANCH_VALIDATION.md (for hook) or new pre-push workflow (if supported)

### Issue 5: Release Agent `chore/release` Creation
**Severity:** 🔴 CRITICAL (Status Unclear)  
**Root Cause:** Unknown — code shows correct `release/v{version}` pattern  
**Impact:** If happening, breaks release pipeline  
**Fixable By:** Clarification needed from user (when/where did this occur?)  
**Fix Location:** TBD based on root cause

### Issue 6: Dual Release Implementations
**Severity:** 🟠 HIGH  
**Root Cause:** Three versions across `scripts/`, `agents/`, `.github/agents/`  
**Impact:** Unclear which is canonical; maintenance burden  
**Fixable By:** Consolidate to single canonical location  
**Fix Location:** Designate `agents/release/` as portable; others as deprecated

### Issue 7: Zero Branch Guidance in Agent Specs
**Severity:** 🟠 HIGH  
**Root Cause:** None of 19 spec-based agents mention branch naming  
**Impact:** Agents are unaware of rules; inherit Claude Code default  
**Fixable By:** Add branch guidance to all agent specs  
**Fix Location:** `.github/agents/`.agent.md` files

### Issue 8: Scripts Location Inconsistency
**Severity:** 🟡 MEDIUM  
**Root Cause:** Restructuring incomplete; scripts in `.github/scripts/` vs `scripts/`  
**Impact:** Maintenance confusion; not portable  
**Fixable By:** Migrate to `scripts/` per Phase 2 restructuring  
**Fix Location:** Move from `.github/scripts/` to `scripts/`

---

## Next Steps (Phases 2-6)

**Phase 2:** Validation Coverage Testing
- Run validation scripts manually with test branches
- Confirm what gets caught and when
- Test `claude/` prefix handling specifically

**Phase 3:** Agent Cross-Reference Audit
- Check all 35 agents for branch creation patterns
- Identify missing instructions
- Map conflicts between spec and portable versions

**Phase 4:** Release Pipeline Root Cause
- Clarify when/where `chore/release` was created
- Confirm release agent canonical version
- Document fix requirements

**Phase 5:** Documentation Audit
- Verify CLAUDE.md discoverability
- Cross-reference all branch-related docs
- Check agent frontmatter completeness

**Phase 6:** Remediation Planning
- Propose ordered fixes (critical → high → medium)
- Define implementation steps
- Assign owners and timeline

---

**Phase 1 Complete. Awaiting Phase 2 initiation.**
