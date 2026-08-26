# File Organization Migration - December 9, 2025

## Summary

Reorganized repository file structure to prevent Copilot/agent file organization drift by creating canonical locations for reports and project files.

## Changes Made

### 1. Created New Instructions File

**Created:** `.github/instructions/file-output-organization.instructions.md`

- Comprehensive guide for where Copilot/agents should create files
- Decision tree for file type → location mapping
- Clear naming conventions for reports and project files
- Common mistakes and examples
- Migration checklist

### 2. Created New Directories

```bash
.github/reports/     # All reports, analysis, audits
.github/projects/    # All task tracking, planning
```

Each with README.md documenting purpose, structure, and guidelines.

### 3. Moved Files from docs/ to Proper Locations

**Moved to `.github/projects/`:**

- `docs/CONTEXT_REDUCTION_TASKS.md` → `.github/projects/context-reduction-tasks.md`
- `docs/INSTRUCTION_CONSOLIDATION_GUIDE.md` → `.github/projects/instruction-consolidation-guide.md`

**Rationale:** These are task tracking/planning files, not permanent reference documentation.

### 4. Updated Core Documentation

**Updated `.github/custom-instructions.md`:**

- Added file-output-organization.instructions.md to critical file list
- Added reports/ and projects/ directory descriptions
- Emphasized importance of following file organization rules

**Updated `AGENTS.md`:**

- Added "File Organization" row to Contribution Guidelines table
- Linked to file-output-organization.instructions.md as CRITICAL reference

**Updated `.github/instructions/community-standards.instructions.md`:**

- Enhanced directory structure with reports/ subdirectories
- Added projects/ directory with subdirectories
- Clarified report vs. project file organization

### 5. Created README Files

**`.github/reports/README.md`:**

- Purpose and guidelines for report files
- Directory structure (audits/, optimization/, labeling/, metrics/, validation/)
- Naming conventions and examples
- Do's and don'ts

**`.github/projects/README.md`:**

- Purpose and guidelines for project files
- Directory structure (active/, completed/, planning/, ADR/)
- Naming conventions and examples
- Current projects index

## File Location Rules (Quick Reference)

| File Type               | Location                  | Example                                  |
| ----------------------- | ------------------------- | ---------------------------------------- |
| Reports & Analysis      | `.github/reports/`        | `optimisation-priority1-2025-12-09.txt`  |
| Audits                  | `.github/reports/audits/` | `frontmatter-audit-2025-12-09.csv`       |
| Task Tracking           | `.github/projects/`       | `context-reduction-tasks.md`             |
| Project Planning        | `.github/projects/`       | `phase6-planning-suite-consolidation.md` |
| Permanent Documentation | `docs/`                   | `ARCHITECTURE.md`, `LABEL_STRATEGY.md`   |
| Agent Specs             | `.github/agents/`         | `labeling.agent.md`                      |
| Instructions            | `.github/instructions/`   | `automation.instructions.md`             |

## Benefits

✅ **Clear Expectations:** Copilot/agents now have explicit instructions for file creation
✅ **No More Drift:** Files won't be scattered across repository root, docs/, or /tmp/
✅ **Better Organization:** Reports and projects have dedicated, searchable locations
✅ **Easier Maintenance:** All related files grouped by type
✅ **Improved Discoverability:** README files guide contributors to correct locations

## Validation

To verify file organization compliance:

```bash
# Check for misplaced files
ls *.txt 2>/dev/null && echo "❌ Report files in root" || echo "✅ No report files in root"
ls *-tasks.md 2>/dev/null && echo "❌ Task files in root" || echo "✅ No task files in root"

# Check correct locations
ls .github/reports/*.txt .github/reports/*/*.md 2>/dev/null | wc -l
ls .github/projects/*.md 2>/dev/null | wc -l
```

## Next Steps

1. ✅ **DONE:** Create file-output-organization.instructions.md
2. ✅ **DONE:** Move existing task files to .github/projects/
3. ✅ **DONE:** Update all core documentation references
4. ✅ **DONE:** Create README files for new directories
5. ⏳ **TODO:** Update .gitignore to exclude temporary reports
6. ⏳ **TODO:** Add pre-commit hook to check for misplaced files
7. ⏳ **TODO:** Create validation script (scripts/validate-file-locations.js)

## Files Modified

- Created: `.github/instructions/file-output-organization.instructions.md`
- Created: `.github/reports/README.md`
- Created: `.github/projects/README.md`
- Moved: `docs/CONTEXT_REDUCTION_TASKS.md` → `.github/projects/context-reduction-tasks.md`
- Moved: `docs/INSTRUCTION_CONSOLIDATION_GUIDE.md` → `.github/projects/instruction-consolidation-guide.md`
- Updated: `.github/custom-instructions.md`
- Updated: `AGENTS.md`
- Updated: `.github/instructions/community-standards.instructions.md`

## Related Documentation

- [File Output Organization Instructions](.github/instructions/file-output-organization.instructions.md)
- [Community Standards](.github/instructions/community-standards.instructions.md)
- [AGENTS.md](../AGENTS.md)
- [Custom Instructions](.github/custom-instructions.md)

---

*Migration completed: 2025-12-09*
*Maintainer: Ash Shaw*
