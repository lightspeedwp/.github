---
name: Issue Structure & Epic Plan
description: Proposed issue hierarchy for repository restructuring consolidation
metadata:
  created: 2026-08-04
  status: pending_approval
---

# Proposed Issue Structure

## Epic Issue (Parent)

### Title

`fix: Consolidate repository restructuring projects under canonical slug`

### Description

**Summary:** Consolidate the repository restructuring project files under a single canonical slug location to eliminate broken links and duplication.

**Context:**

The repository restructuring project exists in two locations with different slugs:

- `.github/projects/active/repository-restructuring-phase-1/` (canonical per CLAUDE.md:312)
- `projects/active/repo-restructuring-2026-07-25/` (needs migration)

This duplication causes:

- Broken relative links in moved files
- Inconsistent path references in CLAUDE.md (lines 64 and 312)
- Failed `lint-and-links` workflow checks
- MD032 Markdown formatting violations that gate link validation

**Solution:** Consolidate all project files under one canonical slug (to be determined in Phase 1).

**Type:** Epic  
**Labels:** `type:epic`, `area:documentation`, `lang:md`, `priority:normal`  
**Milestone:** v1.0

---

## Phase 1: Planning & Governance (Child Issues)

### Issue 1: Evaluate PR #1449 Status & Consolidation Impact

**Title:** `docs: Analyze PR #1449 closure and consolidation impact on issue #1448`

**Description:**

PR #1449 fixed three broken relative links but was closed unmerged due to additional issues discovered during review.

**Tasks (Definition of Ready):**

- [ ] Verify PR #1449 changes NOT in develop branch
- [ ] Document why PR was closed unmerged
- [ ] Identify all blockers to landing the fix

**Success Criteria (Definition of Done):**

- [ ] Report prepared with findings
- [ ] Blockers documented
- [ ] Consolidated plan created

**Type:** Task  
**Labels:** `type:task`, `area:documentation`, `status:in-triage`  
**Assignee:** @ashleyshaw (you) or @eleshar

---

### Issue 2: Choose Canonical Slug for Repository Restructuring Project

**Title:** `docs: Choose canonical slug for repository restructuring project consolidation`

**Description:**

Two competing slug options need governance decision:

**Option A:** `.github/projects/active/repository-restructuring-phase-1/`

- Canonical per CLAUDE.md:312
- Includes phase identifier
- Clearer for future phases

**Option B:** `.github/projects/active/repo-restructuring-2026-07-25/`

- Shorter slug
- Date-focused
- Matches existing file naming

**Additional context:** See `.github/projects/active/pr-review-project-planning-2026-08-04/CONSOLIDATION_PLAN.md`

**Tasks (Definition of Ready):**

- [ ] Both options documented with tradeoffs
- [ ] CLAUDE.md canonical rule reviewed (line 312)
- [ ] Future phase naming considered (Phase 2, 3, etc.)

**Success Criteria (Definition of Done):**

- [ ] One slug chosen
- [ ] Decision documented
- [ ] CLAUDE.md reference identified for update

**Type:** Task  
**Labels:** `type:task`, `area:documentation`, `priority:normal`  
**Assignee:** @eleshar (decision maker)

---

## Phase 2: Execution (Child Issues — Create After Phase 1 Approval)

### Issue 3: Fix MD032 Violations in Project Documentation

**Title:** `docs: Fix MD032 violations blocking lint-and-links workflow`

**Description:**

Markdown list formatting violations gate the `Check Links` workflow. Must be resolved before moving/consolidating project files.

**Violations to fix:**

- `CLAUDE.md` — Add blank lines around lists
- `.github/projects/active/repository-restructuring-phase-1/PHASE-1-COMPLETION-STATUS.md` — Add blank lines around lists

**Type:** Task  
**Labels:** `type:task`, `area:documentation`, `lang:md`  
**Milestone:** v1.0

---

### Issue 4: Consolidate Project Files Under Canonical Slug

**Title:** `docs: Migrate repository restructuring files to canonical location`

**Description:**

Move all four project documentation files to the canonical slug location chosen in Phase 1. Update all relative links to work from new location.

**Files to migrate:**

- `PHASE_1_KICKOFF_PROMPT.md`
- `DECISIONS_FRAMEWORK-50-QUESTIONS.md`
- And two others from `projects/active/repo-restructuring-2026-07-25/`

**Tasks (Definition of Ready):**

- [ ] Canonical slug chosen (Phase 1 complete)
- [ ] MD032 violations fixed
- [ ] Relative link path corrections documented

**Success Criteria (Definition of Done):**

- [ ] All files in canonical location
- [ ] All relative links corrected
- [ ] Lint and link checks pass
- [ ] Original locations cleaned up (empty directories deleted)

**Type:** Task  
**Labels:** `type:task`, `area:documentation`  
**Milestone:** v1.0

---

### Issue 5: Update CLAUDE.md References

**Title:** `docs: Update CLAUDE.md references to canonical restructuring project location`

**Description:**

After consolidation, update CLAUDE.md references that point to project files:

- **Line 64:** Update reference from `./projects/active/repo-restructuring-2026-07-25/` to chosen canonical location
- **Line 312:** Verify canonical rule still applies and is consistent

**Type:** Task  
**Labels:** `type:task`, `area:documentation`  
**Milestone:** v1.0

---

### Issue 6: Close Issue #1448 (Resolution)

**Title:** `docs: Verify and close issue #1448 — broken links resolved`

**Description:**

Final verification that all broken links are resolved and `lint-and-links` passes.

**Success Criteria:**

- [ ] All relative links in project files are correct
- [ ] `lint-and-links` workflow passes
- [ ] No MD032 violations remain
- [ ] Issue #1448 closed as resolved

**Type:** Task  
**Labels:** `type:task`, `area:documentation`  
**Milestone:** v1.0

---

## Summary

| Phase | Issues | Est. Timeline |
|-------|--------|---------------|
| Phase 1: Planning & Governance | Issues 1–2 | Today (approval) |
| Phase 2: Execution | Issues 3–6 | After Phase 1 approval |

## Next Steps

1. ✅ Create active project folder & documentation (this document)
2. ⏳ **@eleshar to review and provide feedback on:**
   - Issue structure appropriateness
   - Slug choice recommendation (Option A vs B)
   - Any adjustments to task breakdown
3. ✅ Create GitHub issues once approved
4. ✅ Begin Phase 2 execution
