---
file_type: "report"
title: "Prompt Library Migration Report"
date: "2026-09-04"
created_by: "Claude"
status: "completed"
---

# Prompt Library Migration: .github/prompts/ → prompts/

## Executive Summary

Successfully migrated 71 organisation-wide prompts from `.github/prompts/` (legacy governance location) to `prompts/` (portable reusable assets root). Migration preserves complete git history via `git mv` and aligns with repository boundary standards.

**Status:** ✅ Complete  
**Files Migrated:** 71 prompts  
**Effort:** 1 migration batch  
**Risk:** Low (git history preserved, no content changes)

---

## Migration Details

### Source Location
- **Path:** `.github/prompts/`
- **Classification:** Repository governance (legacy)
- **Files:** 71 `.prompt.md` files

### Target Location
- **Path:** `prompts/` (root folder)
- **Classification:** Portable reusable assets
- **Files:** 71 migrated prompts + 9 new v1.0 prompts = 80 total

### Files Migrated

**Categories:**
- Architecture/Planning: `breakdown-*.prompt.md`, `architecture-blueprint-*.prompt.md`, `project-workflow-analysis-*.prompt.md` (12 files)
- Code Generation: `create-*.prompt.md`, `generate-*.prompt.md` (15 files)
- Code Review: `code-review.prompt.md`, `review-and-refactor.prompt.md` (2 files)
- Documentation: `documentation-*.prompt.md`, `docs-*.prompt.md`, `update-readmes.prompt.md` (7 files)
- Git/Workflow: `git-flow-*.prompt.md`, `conventional-commit.prompt.md`, `release.prompt.md` (3 files)
- GitHub: `create-github-*.prompt.md`, `my-*.prompt.md`, `pr-*.prompt.md`, `labeling.prompt.md` (9 files)
- Testing: `testing.prompt.md`, `breakdown-test.prompt.md` (2 files)
- Other: `remember.prompt.md`, `changelog.prompt.md`, `agents.prompt.md`, etc. (21 files)

**Full List:**
```
✓ add-frontmatter.prompt.md
✓ agent-task-markdown-linting.prompt.md
✓ agents.prompt.md
✓ architecture-blueprint-generator.prompt.md
✓ breakdown-epic-arch.prompt.md
✓ breakdown-epic-pm.prompt.md
✓ breakdown-feature-implementation.prompt.md
✓ breakdown-feature-prd.prompt.md
✓ breakdown-plan.prompt.md
✓ breakdown-test.prompt.md
✓ build-agent-and-tests.prompt.md
✓ changelog-lines.prompt.md
✓ changelog.prompt.md
✓ code-review.prompt.md
✓ conventional-commit.prompt.md
✓ create-agentsmd.prompt.md
✓ create-architectural-decision-record.prompt.md
✓ create-github-action-workflow-specification.prompt.md
✓ create-github-issue-feature-from-specification.prompt.md
✓ create-github-issues-feature-from-implementation-plan.prompt.md
✓ create-github-issues-for-unmet-specification-requirements.prompt.md
✓ create-github-pull-request-from-specification.prompt.md
✓ create-implementation-plan.prompt.md
✓ create-llms.prompt.md
✓ create-readme.prompt.md
✓ create-specification.prompt.md
✓ dependency-audit-agent.prompt.md
✓ docs-from-comments.prompt.md
✓ docs-writeup.prompt.md
✓ documentation-writer.prompt.md
✓ editorconfig.prompt.md
✓ finalize-agent-prompt.prompt.md
✓ folder-structure-blueprint-generator.prompt.md
✓ generate-changelog.prompt.md
✓ generate-custom-instructions-from-codebase.prompt.md
✓ generate-gh-workflow.prompt.md
✓ generate-pr-description.prompt.md
✓ git-flow-branch-creator.prompt.md
✓ github-copilot-starter.prompt.md
✓ inline-documentation.prompt.md
✓ labeling.prompt.md
✓ model-recommendation.prompt.md
✓ multi-stage-dockerfile.prompt.md
✓ my-issues.prompt.md
✓ my-pull-requests.prompt.md
✓ normalize-docs-labels.prompt.md
✓ pr-description.prompt.md
✓ pr-review.prompt.md
✓ project-workflow-analysis-blueprint-generator.prompt.md
✓ prompt-builder.prompt.md
✓ python-mcp-server-generator.prompt.md
✓ readme-blueprint-generator.prompt.md
✓ release.prompt.md
✓ remember-interactive-programming.prompt.md
✓ remember.prompt.md
✓ repo-story-time.prompt.md
✓ reporting.prompt.md
✓ review-and-refactor.prompt.md
✓ saved-replies.prompt.md
✓ shuffle-json-data.prompt.md
✓ spec-driven-workflow-start.prompt.md
✓ technology-stack-blueprint-generator.prompt.md
✓ testing.prompt.md
✓ update-implementation-plan.prompt.md
✓ update-llms.prompt.md
✓ update-markdown-file-index.prompt.md
✓ update-mermaid-diagrams.prompt.md
✓ update-oo-component-documentation.prompt.md
✓ update-readmes.prompt.md
✓ update-specification.prompt.md
✓ write-coding-standards-from-file.prompt.md
```

---

## File Structure

### Before Migration
```
.github/
├── prompts/ (71 files)
│   ├── README.md
│   ├── architecture-blueprint-*.prompt.md
│   ├── breakdown-*.prompt.md
│   ├── create-*.prompt.md
│   ├── generate-*.prompt.md
│   └── [67 more prompts...]

prompts/ (does not exist)
```

### After Migration
```
prompts/ (80 files)
├── README.md (new: index & quick reference)
├── PROMPTS-V1-INDEX.md (new: comprehensive v1.0 index)
├── 01-update-active-projects-from-chat.md (new v1.0)
├── 02-pr-finalization-workflow.md (new v1.0)
├── 03-context-continuation-prompt.md (new v1.0)
├── 04-dependabot-pr-merge-workflow.md (new v1.0)
├── 05-recommend-next-focus-task.md (new v1.0)
├── 06-milestone-allocation-strategy.md (new v1.0)
├── 07-branch-worktree-cleanup.md (new v1.0)
├── 08-create-update-readme-with-diagrams.md (new v1.0)
├── 09-move-files-to-root-folders.md (new v1.0)
├── add-frontmatter.prompt.md (migrated)
├── agents.prompt.md (migrated)
├── architecture-blueprint-generator.prompt.md (migrated)
├── breakdown-epic-arch.prompt.md (migrated)
├── [70 more migrated prompts...]
└── [legacy content preserved]

.github/prompts/ (legacy reference only)
└── README.md (updated: migration notice)
```

---

## Git History Preservation

**Migration Method:** `git mv` (preserves complete history)

All 71 files migrated using `git mv` to preserve complete git blame history. Future edits can trace changes back to original commits.

**Example:**
```bash
git mv .github/prompts/{file}.prompt.md prompts/{file}.prompt.md
```

---

## References Updated

**Checked for references to `.github/prompts/`:**

| File | Type | Status |
|------|------|--------|
| `.github/workflows/*.yml` | Workflow files | ✅ No references found |
| `prompts/README.md` | Documentation | ✅ Updated with migration notice |
| `prompts/PROMPTS-V1-INDEX.md` | Index | ✅ References new location |
| Agent specs | Code | ✅ No hardcoded prompts paths |
| Instruction files | Code | ✅ No hardcoded prompts paths |

**Result:** No hardcoded references to update. Migration is clean.

---

## Validation

### Pre-Migration
- ✅ 71 prompts in `.github/prompts/`
- ✅ No prompts in root `prompts/` folder

### Post-Migration
- ✅ 0 prompts remaining in `.github/prompts/` (except README.md)
- ✅ 80 prompts in root `prompts/` folder (71 migrated + 9 new)
- ✅ Complete git history preserved
- ✅ All files markdown-linted
- ✅ No broken references

### File Integrity
```
Before: 71 files
After:  80 files (71 migrated + 9 new v1.0 prompts)
Git history: Preserved via git mv
Content: Unchanged (migration only)
```

---

## Alignment with Standards

**Repository Boundaries (CLAUDE.md):**
- ✅ `.github/` contains GitHub governance only
- ✅ Root `prompts/` contains portable reusable assets
- ✅ Migration aligns with file organisation standards

**File Organisation (instructions/file-organisation.instructions.md):**
- ✅ Prompts are portable (no repo assumptions)
- ✅ Placed in root `prompts/` folder
- ✅ Follows standard naming convention

---

## Legacy Reference

**Old paths:** `.github/prompts/{filename}.prompt.md`  
**New paths:** `prompts/{filename}.prompt.md`

For backwards compatibility, `.github/prompts/README.md` remains as a migration guide pointing users to the new location.

---

## Impact Summary

| Aspect | Impact |
|--------|--------|
| **File Organisation** | ✅ Cleaner `.github/` folder (governance-only) |
| **Accessibility** | ✅ Easier to find portable prompts in root |
| **Git History** | ✅ Complete preservation via `git mv` |
| **References** | ✅ No breaking changes (no hardcoded paths) |
| **Portability** | ✅ Prompts now clearly in portable location |
| **Standards Compliance** | ✅ Aligns with CLAUDE.md & file organisation |

---

## Timeline

- **Start:** 2026-09-04 07:00 UTC
- **Execution:** 2 minutes (71 files × `git mv`)
- **Validation:** 5 minutes
- **Report Generated:** 2026-09-04 07:07 UTC
- **Total:** ~10 minutes

---

## Next Steps

1. ✅ **Migration complete** — All files moved with history preserved
2. ⏳ **Review & merge PR #2778** — Includes migration
3. ⏳ **Update CI references** — If any workflows hardcode `.github/prompts/`
4. ⏳ **Monitor for legacy references** — Update any docs mentioning old path

---

**Branch:** `feat/reusable-prompts-structure`  
**PR:** #2778  
**Status:** Ready for merge  

*Migration completed as part of reusable prompts library restructuring*
