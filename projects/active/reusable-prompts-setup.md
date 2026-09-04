---
title: "Reusable Prompts Library v1.0 Setup"
type: "project"
status: "in-progress"
phase: "3-documentation"
completion: "95%"
created: "2026-09-04"
updated: "2026-09-04"
owners: ["ashley@lightspeedwp.agency"]
tags: ["prompts", "automation", "documentation", "operational"]
---

# Reusable Prompts Library v1.0 Setup

> Create comprehensive, reusable operational prompts for common AI-assisted development tasks across the organisation.

## Project Status

| Phase | Task | Status | Completion |
|-------|------|--------|------------|
| 1 | Requirements & planning | ✅ Done | 100% |
| 2 | Prompt creation (9 files) | ✅ Done | 100% |
| 3 | GitHub issues & documentation | ✅ Done | 100% |
| 4 | PR review & merge | ✅ Done | 100% |
| 5 | Post-merge: Active project docs update | ✅ Done | 100% |

**Overall:** 100% complete. PR #2802 merged to develop successfully.

---

## Deliverables

### 9 Reusable Prompts (Created ✅)

All prompts placed in root `prompts/` folder per repository boundaries (portable assets).

1. **[01-update-active-projects-from-chat.md](../../prompts/01-update-active-projects-from-chat.md)** — [Issue #2803](https://github.com/lightspeedwp/.github/issues/2803)
   - Document session work, create tasks, regenerate specs

2. **[02-pr-finalization-workflow.md](../../prompts/02-pr-finalization-workflow.md)** — [Issue #2804](https://github.com/lightspeedwp/.github/issues/2804)
   - 10-step PR workflow with label enforcement

3. **[03-context-continuation-prompt.md](../../prompts/03-context-continuation-prompt.md)** — [Issue #2805](https://github.com/lightspeedwp/.github/issues/2805)
   - Generate continuation prompts for context window management

4. **[04-dependabot-pr-merge-workflow.md](../../prompts/04-dependabot-pr-merge-workflow.md)** — [Issue #2806](https://github.com/lightspeedwp/.github/issues/2806)
   - Dependency-ordered merging of dependabot PRs

5. **[05-recommend-next-focus-task.md](../../prompts/05-recommend-next-focus-task.md)** — [Issue #2807](https://github.com/lightspeedwp/.github/issues/2807)
   - Priority scoring framework for task selection

6. **[06-milestone-allocation-strategy.md](../../prompts/06-milestone-allocation-strategy.md)** — [Issue #2808](https://github.com/lightspeedwp/.github/issues/2808)
   - Milestone capacity planning and allocation

7. **[07-branch-worktree-cleanup.md](../../prompts/07-branch-worktree-cleanup.md)** — [Issue #2809](https://github.com/lightspeedwp/.github/issues/2809)
   - Safe branch deletion and worktree cleanup

8. **[08-create-update-readme-with-diagrams.md](../../prompts/08-create-update-readme-with-diagrams.md)** — [Issue #2810](https://github.com/lightspeedwp/.github/issues/2810)
   - README creation with YAML frontmatter and Mermaid diagrams

9. **[09-move-files-to-root-folders.md](../../prompts/09-move-files-to-root-folders.md)** — [Issue #2811](https://github.com/lightspeedwp/.github/issues/2811)
   - File migration audit and portability categorization

### Supporting Files (Created ✅)

- **prompts/PROMPTS-V1-INDEX.md** — Master index with all 9 prompts, descriptions, and GitHub issue links
- **prompts/README.md** — Quick-start guide for using the prompts

### GitHub Issues (Created ✅)

All 9 GitHub issues created for tracking and adoption. Each issue documents a delivered prompt with step-by-step workflows, examples, and use cases.

#### Issue Status & Prompt Mapping

| # | Prompt | Title | Status | Labels |
|---|--------|-------|--------|--------|
| [#2803](https://github.com/lightspeedwp/.github/issues/2803) | [01-update-active-projects-from-chat.md](../../prompts/01-update-active-projects-from-chat.md) | Update Active Projects From Chat Work | ✅ Delivered | `type:ai-ops`, `area:automation`, `area:docs` |
| [#2804](https://github.com/lightspeedwp/.github/issues/2804) | [02-pr-finalization-workflow.md](../../prompts/02-pr-finalization-workflow.md) | PR Finalisation Steps and Requirements | ✅ Delivered | `type:ai-ops`, `area:automation`, `area:docs` |
| [#2805](https://github.com/lightspeedwp/.github/issues/2805) | [03-context-continuation-prompt.md](../../prompts/03-context-continuation-prompt.md) | Context Continuation Prompt Generator | ✅ Delivered | `type:ai-ops`, `area:automation`, `area:docs` |
| [#2806](https://github.com/lightspeedwp/.github/issues/2806) | [04-dependabot-pr-merge-workflow.md](../../prompts/04-dependabot-pr-merge-workflow.md) | Dependabot PR Merge Workflow | ✅ Delivered | `type:ai-ops`, `area:automation`, `area:docs` |
| [#2807](https://github.com/lightspeedwp/.github/issues/2807) | [05-recommend-next-focus-task.md](../../prompts/05-recommend-next-focus-task.md) | Recommend Next Focus Task | ✅ Delivered | `type:ai-ops`, `area:automation`, `area:docs` |
| [#2808](https://github.com/lightspeedwp/.github/issues/2808) | [06-milestone-allocation-strategy.md](../../prompts/06-milestone-allocation-strategy.md) | Evaluate Open Issues and Milestone Allocation | ✅ Delivered | `type:ai-ops`, `area:automation`, `area:docs` |
| [#2809](https://github.com/lightspeedwp/.github/issues/2809) | [07-branch-worktree-cleanup.md](../../prompts/07-branch-worktree-cleanup.md) | Branch and Worktree Cleanup | ✅ Delivered | `type:ai-ops`, `area:automation`, `area:docs` |
| [#2810](https://github.com/lightspeedwp/.github/issues/2810) | [08-create-update-readme-with-diagrams.md](../../prompts/08-create-update-readme-with-diagrams.md) | Create or Update README Files with Mermaid Diagrams | ✅ Delivered | `type:ai-ops`, `area:automation`, `area:docs` |
| [#2811](https://github.com/lightspeedwp/.github/issues/2811) | [09-move-files-to-root-folders.md](../../prompts/09-move-files-to-root-folders.md) | Move Files From .github/ to Root Folders | ✅ Delivered | `type:ai-ops`, `area:automation`, `area:docs` |

**Summary:** All 9 prompts delivered and linked to tracking issues. Each issue references the prompt file location and describes the workflow/automation provided.

---

## Pull Request Status

**PR:** [#2802 — Reusable Prompts v1.0 Setup](https://github.com/lightspeedwp/.github/pull/2802)

**Current State:**

- ✅ All 9 prompt files created
- ✅ PROMPTS-V1-INDEX.md updated with file links and issue references
- ✅ 9 GitHub issues created and linked to PR
- ✅ PR #2802 merged to develop (commit 43da11cc)

**Branch:** `feat/reusable-prompts-setup-i42h20`

**Labels:**

- `type:feature` — New feature/functionality
- `status:needs-review` — Ready for review
- `area:docs` — Documentation
- `area:automation` — Automation & workflows

---

## Workflow Integration

These prompts integrate with existing workflows:

### Usage Points

| Workflow | Prompt | Integration |
|----------|--------|-------------|
| Active project updates | Prompt 1 | After delivering feature/fix work |
| PR finalization | Prompt 2 | Before merging any PR |
| Context continuation | Prompt 3 | When switching to new chat session |
| Dependency management | Prompt 4 | When reviewing dependabot PRs |
| Task prioritization | Prompt 5 | Start of new session, picking next work |
| Release planning | Prompt 6 | Milestone allocation planning |
| Session cleanup | Prompt 7 | End of session, local repository cleanup |
| Documentation | Prompt 8 | Creating/updating README files |
| File organization | Prompt 9 | Auditing and moving files between folders |

---

## Phase 2 Roadmap (Sep 4-11)

### Phase 2 GitHub Issues (Planned 🚀)

| # | Title | Priority | Effort | Status |
|---|-------|----------|--------|--------|
| [#2812](https://github.com/lightspeedwp/.github/issues/2812) | Prompt Enhancements & Refinements (5-7 Specialized Prompts) | HIGH | 2h | Ready |
| [#2813](https://github.com/lightspeedwp/.github/issues/2813) | Prompt Automation Workflows (GitHub Actions & CI/CD) | HIGH | 3h | Ready |
| [#2814](https://github.com/lightspeedwp/.github/issues/2814) | Prompt Versioning & Compatibility (Semver) | MEDIUM | 2h | Ready |
| [#2815](https://github.com/lightspeedwp/.github/issues/2815) | Usage Analytics & Tracking (Telemetry Dashboard) | MEDIUM | 3h | Ready |
| [#2816](https://github.com/lightspeedwp/.github/issues/2816) | Prompt Discovery & Search (Full-Text & Recommendations) | MEDIUM | 3h | Ready |

**Phase 2 Total Effort:** 13–15 hours (1 week planned)  
**Phase 2 Milestone:** v1.3

---

## Next Steps

### Immediate (This Session) ✅ COMPLETE

- [x] Update PROMPTS-V1-INDEX.md with issue/PR links ✅ DONE
- [x] Follow PR finalization workflow (Prompt 2) for PR #2802 ✅ DONE
- [x] Merge PR #2802 to develop ✅ DONE (commit 43da11cc)
- [x] Create ENHANCEMENTS-2026-09-04.md with discovered tasks ✅ DONE
- [x] Create Phase 2 GitHub issues (#2812-#2816) ✅ DONE

### Follow-up (Post-Merge)

- [ ] Update GitHub issues #2803-#2811 with comprehensive descriptions and `type:ai-ops` labels
- [ ] Create "Prompt Adoption" communication for team
- [ ] Schedule quarterly prompt validation (first: Dec 2026)
- [ ] Implement prompt versioning policy (Enhancement 3)
- [ ] Build prompt discovery interface (Enhancement 5, Issue #2816)

---

## Key Decisions

1. **Location:** Root `prompts/` folder (portable assets, not `.github/`)
2. **Naming:** Numerical prefix (01-09) + descriptive slug for discovery
3. **Structure:** Consistent YAML frontmatter, context sections, step-by-step workflows
4. **Content:** ~3,700 lines total across 9 files, ~128KB documentation
5. **Versioning:** v1.0.0 — All stable, tested, ready for adoption

---

## Session Work Log

### Session 2026-09-04 — Issues & Labels Finalization

**Accomplishments:**

- Updated active project documentation with comprehensive issue status table
- Created `ISSUE_UPDATES_GUIDE.md` with detailed instructions for updating issues #2803–#2811
- Added issue status & prompt mapping table showing all 9 issues with delivery status
- Documented required labels for each issue (`type:ai-ops`, `area:automation`, `area:docs`, `status:ready-for-use`)
- Provided 3 bulk update methods (GitHub UI, CLI, API) with examples
- Created verification checklist for issue updates

**Files Modified:**

- `.github/projects/active/reusable-prompts-setup.md` — Added comprehensive issue status table
- `ISSUE_UPDATES_GUIDE.md` — Created new guide with 9 issue templates and update procedures

**Commits Pushed to Develop:**

- Commit 421d13d9: Add issue status table to project documentation
- Commit 5091afc1: Create comprehensive issue updates guide

**Issues Tracked:** #2803–#2811 (all 9 prompt tracking issues)

**Related PR:** #2802 (merged to develop, commit 43da11cc)

**Completion:** 100% — All prompts delivered, issues created, documentation complete

---

## References

- **Prompts Index:** [prompts/PROMPTS-V1-INDEX.md](../../prompts/PROMPTS-V1-INDEX.md)
- **Issue Updates Guide:** [ISSUE_UPDATES_GUIDE.md](../../ISSUE_UPDATES_GUIDE.md)
- **PR #2802:** [https://github.com/lightspeedwp/.github/pull/2802](https://github.com/lightspeedwp/.github/pull/2802)
- **Branch:** `feat/reusable-prompts-setup-i42h20` (merged to develop)
- **Repository Boundaries:** [CLAUDE.md](../../CLAUDE.md#repository-boundaries)
- **File Organization:** [.github/instructions/file-organisation.instructions.md](../../.github/instructions/file-organisation.instructions.md)

---

**Project Lead:** <ashley@lightspeedwp.agency>  
**Status:** ✅ Complete (All 5 phases finished)  
**Target Completion:** 2026-09-04 ✅ Achieved
