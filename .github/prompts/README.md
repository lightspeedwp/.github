# Legacy Prompts Location (Migrated)

**Status:** ✅ **MIGRATION COMPLETE**

All prompt files have been migrated from `.github/prompts/` to the root `prompts/` folder as part of the reusable prompts library refactoring.

## Migration Details

- **Date:** 2026-09-04
- **Files Migrated:** 71 prompts
- **New Location:** `prompts/` (root folder)
- **Branch:** `feat/reusable-prompts-structure`

## Why the Move?

Per the repository boundaries defined in `CLAUDE.md`:
- `.github/` contains GitHub-specific governance files only
- Root folders contain portable, reusable assets
- Prompts are portable and reusable across projects

## Updated References

All references in documentation, workflows, and agents have been updated to point to the new root `prompts/` folder.

## Accessing Migrated Prompts

**Old (Legacy):**
```
.github/prompts/{prompt-name}.prompt.md
```

**New (Current):**
```
prompts/{prompt-name}.prompt.md
```

## New Reusable Prompts

See `prompts/PROMPTS-V1-INDEX.md` for the 9 new organisation-wide reusable prompts added as part of this refactoring:

1. Update Active Projects From Chat Work
2. PR Finalisation Complete Workflow
3. Context Continuation Prompt Generator
4. Dependabot PR Manual Merge Workflow
5. Recommend Next Focus Task
6. Evaluate Open Issues and Milestone Allocation
7. Branch and Worktree Cleanup
8. Create or Update README Files with Mermaid Diagrams
9. Move Files From .github/ to Root Folders

## References

- **Migration Source:** `.github/prompts/` (legacy location)
- **New Home:** `prompts/` (portable assets)
- **Index:** `prompts/PROMPTS-V1-INDEX.md`
- **Repository Boundaries:** `CLAUDE.md`
- **File Organisation:** `.github/instructions/file-organisation.instructions.md`

---

*Migration completed as part of reusable prompts library refactoring (PR #2778)*
