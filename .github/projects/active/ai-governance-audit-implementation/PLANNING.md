---
title: "AI Governance Audit Implementation — Detailed Planning"
description: "Week-by-week work plan with all issues, specs, and dependencies"
version: "1.0"
date: "2026-08-30"
---

# AI Governance Audit Implementation — Detailed Planning

**Project:** AI Governance Audit Implementation (Phase 3)  
**Branch:** `feat/ai-governance-audit-implementation`  
**Milestone:** `v1.1`  
**Duration:** 3-4 weeks

---

## Work Breakdown Structure

### PHASE 3, WEEK 1: Visibility + Fallback Routing (4 Issues)

#### Issue 1.1: Move Branch Naming Rules to Top of CLAUDE.md
- **Type:** `docs`
- **Scope:** governance
- **Issue Template:** Documentation
- **Labels:** `type:documentation`, `area:governance`, `priority:critical`
- **Effort:** 1 hour
- **Deliverable:** Branch naming rules moved to top of CLAUDE.md with:
  - Clear pattern explanation
  - All 34 allowed type values listed
  - Explicit forbidding of `claude/`, `copilot/`, `openai/`
  - Consequences explained
  - Examples for each type
- **Related Audit Findings:** CLAUDE.md lines 38-53 are mid-document; needs move to top
- **Validation:** CLAUDE.md diff shows branch rules before line 50

#### Issue 1.2: Add Branch Naming Section to AGENTS.md
- **Type:** `docs`
- **Scope:** governance
- **Issue Template:** Documentation
- **Labels:** `type:documentation`, `area:governance`, `priority:critical`
- **Effort:** 1.5 hours
- **Deliverable:** New top-level section in AGENTS.md:
  - Reference to moved CLAUDE.md rules
  - Summary of allowed prefixes
  - Forbidden prefixes with rationale
  - Link to detailed instructions
- **Related Audit Findings:** AGENTS.md has no branch naming section
- **Validation:** AGENTS.md includes new "Branch Naming" section

#### Issue 1.3: Add Branch Naming to custom-instructions.md (Copilot)
- **Type:** `docs`
- **Scope:** governance
- **Issue Template:** Documentation
- **Labels:** `type:documentation`, `area:governance`, `priority:high`
- **Effort:** 1 hour
- **Deliverable:** New section in .github/custom-instructions.md:
  - Copilot-specific branch naming requirements
  - Why `copilot/` prefix is forbidden
  - Consequences for PR templates
- **Related Audit Findings:** custom-instructions.md has no branch guidance
- **Validation:** custom-instructions.md updated with branch guidance

#### Issue 1.4: Update PR Template Config with Fallback Routes
- **Type:** `build`
- **Scope:** ci
- **Issue Template:** Build & CI
- **Labels:** `type:build`, `area:ci`, `priority:high`
- **Effort:** 2 hours
- **Deliverable:** Updated `.github/PULL_REQUEST_TEMPLATE/config.yml`:
  - Add fallback routes for `claude/` and `copilot/` prefixes
  - Define fallback strategy (linked issue type → PR label → description)
  - Document fallback precedence
- **Related Audit Findings:** config.yml only routes standard prefixes; no fallback
- **Validation:** config.yml includes `claude:/` and `copilot:/` route entries with fallback logic
- **Dependencies:** Requires Issue 2.1 (GitHub Action) to implement the fallback logic

---

### PHASE 3, WEEK 2: Fallback Routing Action + Scripts (4 Issues)

#### Issue 2.1: Create PR Template Resolver GitHub Action
- **Type:** `build`
- **Scope:** ci
- **Issue Template:** Build & CI
- **Labels:** `type:build`, `area:ci`, `priority:high`
- **Effort:** 4 hours
- **Deliverable:** `.github/workflows/pr-template-resolver.yml`:
  - Triggers on PR opened/synchronize
  - Detects `claude/*` or `copilot/*` branch
  - Queries linked issue via GitHub API
  - Extracts issue type or type: label
  - Comments on PR with correct template recommendation
  - (Optional) Adds comment with template content
- **Related Audit Findings:** No fallback mechanism for wrong prefixes
- **Validation:** Action comments on test PRs with correct template name
- **Testing:** Test with real PR from `claude/*` branch

#### Issue 2.2: Create Title Normalization Script
- **Type:** `build`
- **Scope:** automation
- **Issue Template:** Build & CI
- **Labels:** `type:build`, `area:automation`, `priority:high`
- **Effort:** 6 hours
- **Deliverable:** `scripts/automation/normalize-issue-pr-titles.js`:
  - CLI tool for batch title normalization
  - Options: `--dry-run`, `--state open|closed|all`, `--since YYYY-MM-DD`
  - Logic for issues: type field or `type:*` label → prefix title
  - Logic for PRs: linked issue type → PR label → description
  - Format: `{TYPE}: {existing-title}`
  - Output: summary report + detailed log
  - Idempotent (can run multiple times safely)
- **Related Audit Findings:** No automated title prefixing currently
- **Validation:** Script runs without errors on test data
- **Testing:** See Issue 3.2

#### Issue 2.3: Add Comprehensive Tests for Title Normalization
- **Type:** `test`
- **Scope:** automation
- **Issue Template:** Build & CI
- **Labels:** `type:test`, `area:automation`, `priority:high`
- **Effort:** 4 hours
- **Deliverable:** `.github/agents/pr-creation-agent/__tests__/normalize-titles.test.js`:
  - Unit tests for type detection logic
  - Tests for all type families (bug, feature, docs, etc.)
  - Tests for title format generation
  - Tests for idempotency (running twice doesn't double-prefix)
  - Tests for edge cases (empty title, already-prefixed, special chars)
  - 100% coverage of script logic
- **Validation:** All tests pass; coverage > 95%
- **Dependencies:** Requires Issue 2.2

#### Issue 2.4: Create Title Normalization GitHub Action Workflow
- **Type:** `build`
- **Scope:** ci
- **Issue Template:** Build & CI
- **Labels:** `type:build`, `area:ci`, `priority:high`
- **Effort:** 2 hours
- **Deliverable:** `.github/workflows/normalize-titles.yml`:
  - On-demand workflow (workflow_dispatch)
  - Accepts input filters (--state, --since)
  - Calls normalize-issue-pr-titles.js script
  - Creates summary comment or issue with report
  - Links to all renamed items
- **Validation:** Workflow runs successfully on demand
- **Dependencies:** Requires Issue 2.2

---

### PHASE 3, WEEK 2-3: PR-Issue Linking Enforcement (2 Issues)

#### Issue 3.1: Create PR-Issue Linking Enforcement Workflow
- **Type:** `build`
- **Scope:** ci
- **Issue Template:** Build & CI
- **Labels:** `type:build`, `area:ci`, `priority:high`
- **Effort:** 3 hours
- **Deliverable:** `.github/workflows/enforce-pr-issue-linking.yml`:
  - Triggers on PR opened/synchronize
  - Checks if PR has linked issue via GitHub API
  - If no linked issue: add comment with requirement + link to docs
  - (Optional) Request changes or block merge (test impact first)
- **Related Audit Findings:** PR-issue linking currently optional
- **Validation:** Action comments on PR with no linked issue
- **Testing:** Create test PR without linked issue

#### Issue 3.2: Update PR Templates with Linking Requirements
- **Type:** `docs`
- **Scope:** governance
- **Issue Template:** Documentation
- **Labels:** `type:documentation`, `area:governance`, `priority:normal`
- **Effort:** 1 hour
- **Deliverable:** Update all PR templates in `.github/PULL_REQUEST_TEMPLATE/`:
  - Add "Linked Issue" section to each template
  - Provide example: `Closes #123`
  - Explain requirement
- **Validation:** All PR templates updated with linking section

---

### PHASE 3, WEEK 3: Validation & Testing (3 Issues)

#### Issue 4.1: Add Branch Validation Tests
- **Type:** `test`
- **Scope:** validation
- **Issue Template:** Build & CI
- **Labels:** `type:test`, `area:testing`, `priority:high`
- **Effort:** 2 hours
- **Deliverable:** `.github/agents/pr-creation-agent/__tests__/validate-branch-name.test.js` (additions):
  - Test that `claude/something` → FAILS with "branch-prefix-forbidden"
  - Test that `copilot/something` → FAILS with "branch-prefix-forbidden"
  - Test that `feat/valid-name` → PASSES
  - Test all 34 allowed prefixes individually
  - Test invalid characters, missing parts, etc.
- **Validation:** All tests pass
- **Coverage:** 100% of allowed/forbidden prefixes

#### Issue 4.2: Add Template Routing Tests
- **Type:** `test`
- **Scope:** validation
- **Issue Template:** Build & CI
- **Labels:** `type:test`, `area:testing`, `priority:high`
- **Effort:** 3 hours
- **Deliverable:** New test file `.github/tests/pr-template-routing.test.js`:
  - Test branch `feat/x` + no linked issue → `pr_feature.md` ✓
  - Test branch `fix/x` → `pr_bug.md` ✓
  - Test branch `claude/x` + linked issue has `type:bug` → `pr_bug.md` ✓
  - Test all 9 templates + all 34 prefixes
  - Test fallback precedence (linked issue > PR label > description)
- **Validation:** All tests pass
- **Coverage:** 100% of routing paths

#### Issue 4.3: Test Title Normalization on Existing Issues/PRs
- **Type:** `test`
- **Scope:** automation
- **Issue Template:** Build & CI
- **Labels:** `type:test`, `area:automation`, `priority:high`
- **Effort:** 4 hours
- **Deliverable:** Run title normalization script in dry-run mode on all issues/PRs:
  - Generate report of what would be renamed
  - Validate script doesn't corrupt data (dry-run)
  - Identify any edge cases (special titles, existing prefixes)
  - Create follow-up issues for edge cases
- **Validation:** Dry-run report generated; no errors
- **Next Step:** Issue 5.2 will run actual normalization

---

### PHASE 3, WEEK 3-4: Documentation & Preparation (2 Issues)

#### Issue 5.1: Create/Update BRANCHING_STRATEGY.md
- **Type:** `docs`
- **Scope:** governance
- **Issue Template:** Documentation
- **Labels:** `type:documentation`, `area:governance`, `priority:normal`
- **Effort:** 2 hours
- **Deliverable:** `docs/BRANCHING_STRATEGY.md`:
  - Complete branching rules
  - All 34 allowed type values with descriptions
  - Forbidden prefixes and why
  - Consequences of violations (PR template, automation)
  - Examples for each type
  - Validation commands
  - Link to custom-instructions.md for Copilot
  - Link to instructions/branch-naming.instructions.md for detailed rules
- **Validation:** Document is comprehensive and clear

#### Issue 5.2: Run Title Normalization on All Existing Issues/PRs
- **Type:** `build`
- **Scope:** automation
- **Issue Template:** Build & CI
- **Labels:** `type:build`, `area:automation`, `priority:normal`
- **Effort:** 2 hours (including review and edge case handling)
- **Deliverable:** Execute title normalization script on all open/closed issues and PRs:
  - Run with `--state all --since 2025-01-01`
  - Generate summary report
  - Handle any edge cases (verify no data corruption)
  - Create follow-up issues for items that can't be auto-normalized
- **Dependencies:** Requires Issues 2.2, 4.3 (script must be tested)
- **Validation:** All issues/PRs have properly-prefixed titles

---

## Issue Dependencies & Critical Path

```
Week 1:
├─ Issue 1.1: Move CLAUDE.md rules (1h) ✓
├─ Issue 1.2: Add AGENTS.md section (1.5h) ✓
├─ Issue 1.3: Add custom-instructions section (1h) ✓
└─ Issue 1.4: Update PR template config (2h) → depends on Issue 2.1

Week 2:
├─ Issue 2.1: PR template resolver action (4h)
├─ Issue 2.2: Title normalization script (6h)
├─ Issue 2.3: Title normalization tests (4h) → depends on Issue 2.2
├─ Issue 2.4: Title normalization workflow (2h) → depends on Issue 2.2
├─ Issue 3.1: PR-issue linking enforcement (3h)
└─ Issue 3.2: Update PR templates (1h)

Week 3:
├─ Issue 4.1: Branch validation tests (2h)
├─ Issue 4.2: Template routing tests (3h)
├─ Issue 4.3: Test title normalization (4h) → depends on Issue 2.2
├─ Issue 5.1: Create BRANCHING_STRATEGY.md (2h)
└─ Issue 5.2: Run actual normalization (2h) → depends on Issue 2.2, 4.3
```

**Critical Path:** Issues 2.2 → 2.3 → 4.3 → 5.2 (Script development and testing)

---

## Effort Estimates

| Phase | Week | Issues | Effort | Status |
|-------|------|--------|--------|--------|
| 3 | Week 1 | 1.1-1.4 | ~7.5h | 🔄 In Progress |
| 3 | Week 2 | 2.1-3.2 | ~20h | ⏳ Planned |
| 3 | Week 3 | 4.1-5.2 | ~22h | ⏳ Planned |
| **Total** | **3-4 weeks** | **11 issues** | **~49.5h** | **~1.3 weeks FTE** |

---

## Success Metrics

- [ ] All 11 issues completed and merged
- [ ] Branch validation tests show 100% coverage (claude/ and copilot/ fail)
- [ ] Template routing tests show fallback works for all 9 templates
- [ ] Title normalization runs without errors on all issues/PRs
- [ ] All issues/PRs have type-prefixed titles
- [ ] All PRs link to issues (enforced at merge)
- [ ] Zero manual workarounds by human
- [ ] Rules portable and documented for rollout

---

## Related Audit Reports

**Phase 1-2 Audit Report:**  
`/tmp/claude-0/-home-user--github/1dd12737-b8e3-5e97-ae4d-092880e59e1b/scratchpad/governance-audit-phase-1-2-report.md`

**Audit Findings Summary:**
- Branch naming rules spread across 3 files; mid-document or buried
- PR template routing branch-prefix-only; no fallback
- Validation runs but doesn't block merges
- Platform defaults conflict with documented rules

---

## Issue Templates & Labels

**All issues use these labels:**
- `type:{doc|build|test}` — Issue type (from `.github/labels.yml`)
- `area:{governance|ci|automation|testing}` — Domain
- `priority:{critical|high|normal}` — Priority
- `meta:needs-changelog` — (added after implementation)

**Issue templates to use:**
- Documentation issues → `.github/ISSUE_TEMPLATE/documentation.md`
- Build & CI issues → `.github/ISSUE_TEMPLATE/build-ci.md`
- Test issues → `.github/ISSUE_TEMPLATE/build-ci.md` (or build-ci)

---

## Appendix: Audit Findings Reference

### Visibility Problem
- **CLAUDE.md:** Lines 38-53, mid-document
- **AGENTS.md:** No branch naming section
- **custom-instructions.md:** No branch naming section
- **Instructions:** branch-naming.instructions.md exists but buried in `.github/instructions/`

### Clarity Problem
- Rules don't explain **why** wrong branch names matter
- Rules don't mention **forbidden prefixes** in entry-point files
- Rules don't link **consequences to PR templates or automation**

### Platform Conflict Problem
- Claude Code defaults to `claude/*`
- Copilot defaults to `copilot/*`
- But these are forbidden in rules that aren't visible in entry-point files
- Platform defaults override documented rules

### Validation Problem
- Validation runs but doesn't block merges
- No warning when wrong PR template assigned
- No fallback routing via linked issue type
- No PR-issue linking enforcement

---

**Next Steps:** Create GitHub issues from this plan using correct templates and labels, assign to milestone v1.1
