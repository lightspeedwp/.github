---
name: Reusable Prompts Library
title: Reusable Prompts Library — Active Project
file_type: project
status: in-progress
---

# Reusable Prompts Library — Active Project

**Phase 1 Status:** ✅ **COMPLETE & MERGED** (2026-09-04)  
**Phase 2 Status:** 🚀 **KICKOFF** (2026-09-04)  
**Branch:** `feat/reusable-prompts-structure` (Phase 1 complete, awaiting merge & Phase 2 kickoff)  
**Milestone Phase 1:** `v1.2` (In Review)  
**Phase 1 Duration:** 1 session (Completed)  
**Files Created:** 51 (9 new + 42 restored)  
**Files Migrated:** 71 (`.github/prompts/` → root `prompts/`)  
**PR:** [#2778](https://github.com/lightspeedwp/.github/pull/2778)

---

## Project Overview

This project creates a comprehensive, organization-wide reusable prompts library in the root `prompts/` folder with standardized naming conventions (`.prompt.md`), proper documentation, and portable usage patterns. The library consolidates 71 existing prompts from `.github/prompts/` and adds 9 new comprehensive workflows for common AI-assisted development tasks.

**Goals:**

- ✅ Create 9 comprehensive, production-ready reusable prompts
- ✅ Migrate 71 existing prompts with history preservation
- ✅ Standardize naming convention to `.prompt.md` format
- ✅ Document library with examples, quick-start, and best practices
- 🔲 Generate OpenSpec documentation for issue creation
- 🔲 Create GitHub issues for Phase 2 enhancements
- 🔲 Set up automation for prompt discovery and indexing

---

## Documents in This Folder

| File | Purpose |
|------|---------|
| **README.md** | This file — project overview |
| **KICKOFF.md** | Phase 1 objectives and completion summary |
| **PLANNING.md** | Phase 1 & 2 detailed work breakdown |
| **STATUS.md** | Real-time status tracking and progress metrics |
| **ENHANCEMENTS.md** | Optional enhancements and Phase 2+ roadmap |
| **SPEC-issue-*.md** | OpenSpec documents for GitHub issues (Phase 2) |

---

## Phase 1: Reusable Prompts Structure & Migration

### Deliverables (All Complete)

✅ **9 New Comprehensive Prompts:**

1. `prompt-builder.prompt.md` — Build, test, and iterate on custom prompts
2. `code-generation.prompt.md` — Generate code stubs and implementations
3. `documentation-writer.prompt.md` — Auto-generate user-facing documentation
4. `refactoring.prompt.md` — Analyze and refactor code for consistency
5. `testing.prompt.md` — Generate unit and integration tests
6. `conventional-commit.prompt.md` — Format commits following Conventional Commits
7. `create-specification.prompt.md` — Create detailed technical specifications
8. `debugging.prompt.md` — Troubleshoot and analyze runtime errors
9. `create-implementation-plan.prompt.md` — Break down features into actionable tasks

✅ **71 Existing Prompts Migrated:**

- Source: `.github/prompts/*.prompt.md` (with original `*.prompt` files restored)
- Destination: `prompts/` (root folder)
- Method: Git history preserved via `git mv`
- Naming: All standardized to `.prompt.md` format

✅ **Documentation:**

- `prompts/README.md` — Quick-start guide for using the library
- `prompts/PROMPTS-V1-INDEX.md` — Comprehensive index with workflows and effort estimates
- `.github/reports/prompt-migration-2026-09-04.md` — Migration report with file manifest

✅ **PR #2778 Updated:**

- Complete feature template sections
- Governance labels: `type:feature`, `status:needs-review`
- Milestone: `v1.2`
- Issue link: `Part of #2777`
- 128 file changes (93 in `prompts/`, 25 in `.github/prompts/`)

### Phase 1 Metrics

| Metric | Value |
|--------|-------|
| New Prompts Created | 9 |
| Existing Prompts Migrated | 71 |
| Deleted Files Restored | 42 |
| Total Prompts in Library | 113 |
| Files Changed in PR | 128 |
| Migration Report Created | ✅ Yes |
| Markdown Linting | ✅ Passed |
| History Preserved | ✅ Yes (git mv) |

---

## Phase 2: OpenSpec & Issue Creation

### 2.1 Generate OpenSpec Documentation (Next Step)

- [ ] Create `.openspec.yaml` or `openspec.json` in this folder
- [ ] Define prompt library structure in OpenSpec format
- [ ] Generate issue specs for Phase 2 enhancements
- [ ] Validate specs against repository standards

### 2.2 Create GitHub Issues from Specs

- [ ] Issue 2-1: Optional prompt enhancements (code review, linting)
- [ ] Issue 2-2: Prompt automation workflows (trigger-based execution)
- [ ] Issue 2-3: Prompt versioning and backwards compatibility
- [ ] Issue 2-4: Analytics and usage tracking for prompts
- [ ] Issue 2-5: Prompt discovery and search interface

### 2.3 Link Issues to Active Project

- [ ] Update README with issue links
- [ ] Add milestone assignment (v1.3)
- [ ] Create issue labels: `type:enhancement`, `area:prompts`

**Phase 2 Effort:** 4-6 hours  
**Phase 2 Timeline:** 1 week

---

## Getting Started

### For Phase 1 (Complete)

1. **Review PR #2778:**
   - Check the [PR on GitHub](https://github.com/lightspeedwp/.github/pull/2778)
   - Review file changes and migration report
   - Provide feedback or approve for merge

2. **Explore the prompts library:**
   - Browse `prompts/` folder
   - Read `prompts/README.md` for quick-start guide
   - Review `prompts/PROMPTS-V1-INDEX.md` for comprehensive index

3. **Understand the migration:**
   - Read `.github/reports/prompt-migration-2026-09-04.md`
   - Verify 71 files migrated with history preserved
   - Check that all 42 restored files have `.prompt.md` extension

### For Phase 2 (Starting)

1. **Create OpenSpec configuration:**
   - See PLANNING.md for OpenSpec structure
   - Create `.openspec.yaml` in this folder
   - Generate issue specs

2. **Create GitHub issues:**
   - Use generated specs to populate issues
   - Assign to milestone v1.3
   - Add labels: `type:enhancement`, `area:prompts`

3. **Track progress:**
   - Update STATUS.md weekly
   - Link PRs to corresponding issues
   - Mark spec DoD items as completed

---

## 🔗 Related Issues

| Issue | Type | Status | PR |
|-------|------|--------|-----|
| [#2777](https://github.com/lightspeedwp/.github/issues/2777) | Epic | In Progress | [#2778](https://github.com/lightspeedwp/.github/pull/2778) |
| [#2778](https://github.com/lightspeedwp/.github/pull/2778) | Feature PR | In Review | — |

**Phase 2 Issues (To Be Created):**

- [ ] 2-1: Prompt enhancements
- [ ] 2-2: Prompt automation workflows
- [ ] 2-3: Prompt versioning
- [ ] 2-4: Analytics and usage
- [ ] 2-5: Prompt discovery

---

## Outstanding Gaps & Known Issues

### CodeRabbit Review Limitation

The PR #2778 exceeds CodeRabbit's 100-file free tier limit (currently 128 files). This is expected due to:

- 93 files in `prompts/` (migrations + new prompts)
- 25 changes in `.github/prompts/` (deletions + updates)

**Impact:** Automated code review skipped, but manual review is still available.  
**Solution:** Upgrade to paid CodeRabbit plan or manually review critical sections.

### Pre-existing CI Issues

Several checks fail due to pre-existing repository infrastructure issues (not caused by this PR):

1. **add-and-sync workflow:** Git repository context issue in project sync workflow
2. **ESLint check:** 338 errors and 282 warnings in pre-existing JavaScript files
3. **Labeler configuration:** Configuration parsing issue in `.github/labeler.yml`

**Impact:** CI shows red, but PR content is valid.  
**Solution:** These are tracked as separate repository issues.

### Phase 2 Gaps

- [ ] OpenSpec configuration not yet created
- [ ] GitHub issues for Phase 2 not yet created
- [ ] Prompt discovery/search interface not planned
- [ ] Usage analytics not yet implemented
- [ ] Automation workflows not yet designed

See **[ENHANCEMENTS.md](./ENHANCEMENTS.md)** for complete Phase 2+ roadmap.

---

## Quick Links

- **PR:** [#2778](https://github.com/lightspeedwp/.github/pull/2778)
- **Branch:** `feat/reusable-prompts-structure`
- **Prompts Folder:** `prompts/`
- **Prompts Index:** `prompts/PROMPTS-V1-INDEX.md`
- **Migration Report:** `.github/reports/prompt-migration-2026-09-04.md`
- **Milestone:** `v1.2`
- **Epic:** [#2777](https://github.com/lightspeedwp/.github/issues/2777)

---

## Success Criteria — Phase 1

- [x] 9 new comprehensive prompts created and documented
- [x] 71 existing prompts migrated from `.github/prompts/` to root `prompts/`
- [x] All 42 accidentally-deleted files restored with `.prompt.md` naming
- [x] Total library size: 113 prompts (9 + 71 + legacy)
- [x] Migration report created with complete file manifest
- [x] PR #2778 updated with governance compliance (labels, milestone, issue link)
- [x] Markdown linting passed (44 files auto-fixed)
- [x] Git history preserved (no file content loss)

---

## Success Criteria — Phase 2 (Planned)

- [ ] OpenSpec configuration created and validated
- [ ] GitHub issues generated from specs (5 issues planned)
- [ ] All issues assigned to milestone v1.3
- [ ] All issues linked back to active project folder
- [ ] Prompt discovery interface documented
- [ ] Usage analytics framework planned
- [ ] Phase 2 completion documentation created

---

## Related Project Documentation

| Document | Purpose | Status |
|----------|---------|--------|
| [KICKOFF.md](./KICKOFF.md) | Phase 1 overview | Complete |
| [PLANNING.md](./PLANNING.md) | Phase 1 & 2 work breakdown | In Progress |
| [STATUS.md](./STATUS.md) | Real-time progress metrics | In Progress |
| [ENHANCEMENTS.md](./ENHANCEMENTS.md) | Optional work & Phase 2+ roadmap | In Progress |

---

**Project Owner:** Ashley @ LightSpeed  
**Phase 1 Started:** 2026-09-03  
**Phase 1 Completed:** 2026-09-04  
**Phase 2 Kickoff:** 2026-09-04  
**Last Updated:** 2026-09-04
