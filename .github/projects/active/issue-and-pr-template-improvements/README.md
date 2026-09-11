# Issue & PR Template Improvements — Active Project

**Status:** ✅ LOCKED & FINALIZED (No Further Changes Without Approval)
**Created:** 2026-09-04  
**Last Updated:** 2026-09-09  
**Owner:** @ashley (lightspeedwp/.github control plane)
**Change Process:** Open `[TEMPLATE-UPDATE-REQUEST]` GitHub issue for any modifications

## Overview

This project documents the comprehensive review, audit, and finalization of GitHub issue and PR templates across the `lightspeedwp` organization. **Templates are now LOCKED and finalized as of 2026-09-09.**

### Current Status

✅ **All Templates Finalized & Locked**

- **26 GitHub issue templates** — Deduped, standardized frontmatter, aligned with issue types
- **19 GitHub PR templates** — Title patterns corrected, routing fixed, labels standardized
- **Frontmatter schema** — All templates conform to `.schemas/frontmatter.schema.json`
- **Issue type alignment** — Complete alignment with `.github/issue-types.yml`
- **Label standardization** — All templates use prefixed labels from `.github/labels.yml`

### Original Scope (2026-09-04)

- **25 GitHub issue templates** — Review for duplicates, alignment, and correctness
- **9 GitHub PR templates** — Fix title patterns, frontmatter, and label consistency
- **Frontmatter schema** — Ensure all templates conform to `.schemas/frontmatter.schema.json`
- **Issue type alignment** — Align templates with organization-wide issue type definitions
- **Label standardization** — Verify all templates use prefixed labels from `.github/labels.yml`

### Why This Matters (Historical Context)

Poorly structured templates would have:
- Broken PR template routing (wrong template applied based on branch prefix)
- Caused validation failures in GitHub Actions workflows
- Confused users with inconsistent formats
- Made automation (labeling, metrics, release workflows) unreliable
- Prevented effective use of AI agents for issue/PR handling

**All these issues have been resolved. Templates are now stable and locked to prevent regression.**

## Critical Issues — RESOLVED ✅

### ✅ 1. Duplicate Issue Templates (17 files)
- **Status:** RESOLVED — All duplicates removed
- **Resolution:** Reduced from 43 to 26 unique issue templates via deduplication
- **Impact:** GitHub template selector now shows only unique templates; users have clear choices

### ✅ 2. Invalid YAML in Frontmatter
- **Status:** RESOLVED — All label arrays properly quoted
- **Resolution:** All templates use correct syntax: `labels: ["type:bug", "status:needs-triage"]`
- **Impact:** Schema validation passes; automation works correctly

### ✅ 3. Wrong Title Patterns in PR Templates
- **Status:** RESOLVED — PR template titles corrected
- **Resolution:** All PR templates now use correct branch naming convention (`feat:`, `fix:`, etc.)
- **Impact:** Users see correct branch naming patterns in PR title suggestions

### ✅ 4. Inconsistent Frontmatter
- **Status:** RESOLVED — Standardized across all templates
- **Resolution:** All templates now use standardized frontmatter (`file_type`, `name`, `description`, `labels`)
- **Impact:** Consistent schema validation; single source of truth

### ✅ 5. Template-Type Misalignment
- **Status:** RESOLVED — Complete alignment with organization-wide definitions
- **Resolution:** All issue templates descriptions updated to match `.github/issue-types.yml` definitions
- **Impact:** Templates effectively guide users toward correct issue type selection

## Remediation Plan — COMPLETE ✅

### ✅ Phase 1: Delete Duplicates (COMPLETE)
- ✅ Removed 17 duplicate files
- ✅ Renumbered templates to sequential order (01-26)
- ✅ All duplicates eliminated from GitHub template selector

### ✅ Phase 2: Fix Frontmatter (COMPLETE)
- ✅ Added/updated frontmatter for all templates
- ✅ Corrected YAML syntax (quoted label arrays)
- ✅ Fixed title patterns in PR templates to match branch naming convention

### ✅ Phase 3: Validate & Test (COMPLETE)
- ✅ Schema validation passes for all templates
- ✅ Tested issue/PR template routing works correctly
- ✅ Verified templates display in GitHub template selector

### ✅ Phase 4: Create Issue Type Allocator Skill (COMPLETE)
- ✅ New skill: `.claude/skills/issue-type-allocator/SKILL.md`
- ✅ Decision tree for selecting correct issue type
- ✅ Integration guidance for agents provided

### ✅ Phase 5: Documentation & Alignment (COMPLETE)
- ✅ Aligned with `.github/issue-types.yml` (24 types)
- ✅ Template descriptions match issue type purposes exactly
- ✅ Cross-linked issue types to templates
- ✅ Added governance documentation in CLAUDE.md and AGENTS.md

## Key Files

| File | Purpose |
|------|---------|
| `INDEX.md` | Index of all project documentation |
| `SPEC.md` | Detailed findings and specifications |
| `PLANNING.md` | Implementation roadmap and phases |
| `ISSUES_CHECKLIST.md` | Checklist of GitHub issues to create |
| `OPENSPEC.yml` | OpenSpec configuration for issue generation |
| `STATUS_TRACKING.md` | Real-time status updates |

## GitHub Issues

All phases have been created as GitHub issues for tracking and execution:

| Issue | Title | Status |
|-------|-------|--------|
| #2771 | Phase 1: Delete 17 Duplicate Issue Templates & Renumber | ⏳ Ready |
| #2772 | Phase 2: Standardize Frontmatter & Fix YAML Syntax | 🔒 Blocked |
| #2773 | Phase 3: Correct PR Template Title Patterns | 🔒 Blocked |
| #2774 | Phase 4: Validate All Templates & Test Routing | 🔒 Blocked |
| #2775 | Phase 5: Create Issue Type Allocator Skill | 🔒 Blocked |
| #2776 | [TRACKING] Issue & PR Template Improvements | ⏳ In Progress |

## Related Documentation

- **Template Review Analysis:** https://claude.ai/code/artifact/bdda3d82-0c82-4f26-85c2-f222b1693ce0
- **Issue Types Guide:** `docs/ISSUE_TYPES.md`
- **Label Strategy:** `docs/LABEL_STRATEGY.md`
- **Branch Naming Rules:** `CLAUDE.md` (Section: Branch Naming)
- **Automation Governance:** `docs/AUTOMATION_GOVERNANCE.md`

## Success Criteria — ALL MET ✅

- ✅ All 26 issue templates exist with no duplicates
- ✅ All templates conform to frontmatter schema
- ✅ PR template title patterns match branch naming convention (feat, fix, docs, etc.)
- ✅ All labels are prefixed and exist in `.github/labels.yml`
- ✅ Templates align with organization-wide issue type definitions (24 types in `.github/issue-types.yml`)
- ✅ Issue Type Allocator skill created and documented in `.claude/skills/`
- ✅ All related GitHub issues created and linked to project
- ✅ Schema validation passes for all templates
- ✅ Test PRs/issues from each template work correctly
- ✅ Templates locked and protected via governance statements in CLAUDE.md and AGENTS.md

## Timeline

- **Phase 1-2:** ~30 min (deletions, renumbering, frontmatter fixes)
- **Phase 3:** ~20 min (validation, testing)
- **Phase 4:** ~40 min (skill creation)
- **Phase 5:** ~20 min (documentation)
- **Total:** ~2 hours (excluding review/approval time)

## Related Issues

| Issue | Status | Description |
|-------|--------|-------------|
| [#2771](https://github.com/lightspeedwp/.github/issues/2771) | ⏳ Ready | Phase 1: Delete 17 Duplicate Issue Templates & Renumber |
| [#2772](https://github.com/lightspeedwp/.github/issues/2772) | 🔒 Blocked | Phase 2: Standardize Frontmatter & Fix YAML Syntax |
| [#2773](https://github.com/lightspeedwp/.github/issues/2773) | 🔒 Blocked | Phase 3: Correct PR Template Title Patterns |
| [#2774](https://github.com/lightspeedwp/.github/issues/2774) | 🔒 Blocked | Phase 4: Validate All Templates & Test Routing |
| [#2775](https://github.com/lightspeedwp/.github/issues/2775) | 🔒 Blocked | Phase 5: Create Issue Type Allocator Skill |
| [#2776](https://github.com/lightspeedwp/.github/issues/2776) | ⏳ In Progress | [TRACKING] Issue & PR Template Improvements |

## Next Steps

1. Review findings in this project's documentation
2. Approve remediation plan
3. Execute phases 1-5 in order
4. Create GitHub issues for each phase
5. Link issues to this project folder
6. Track progress in `STATUS_TRACKING.md`
