---
file_type: "guide"
title: "Instruction File Consolidation Migration Guide"
description: "Guide for migrating from 22 separate instruction files to 5 consolidated instruction files. Maps old files to new consolidated sections."
version: "v1.0"
created_date: "2025-12-07"
last_updated: "2025-12-07"
author: "LightSpeed Team"
category: "governance"
status: "active"
tags: ["consolidation", "migration", "instructions", "documentation"]
related_files:
  - path: ".github/instructions/languages.instructions.md"
    description: "New consolidated file for JavaScript, JSON, YAML, JSDoc"
  - path: ".github/instructions/documentation-formats.instructions.md"
    description: "New consolidated file for Markdown, frontmatter, Mermaid"
  - path: ".github/instructions/quality-assurance.instructions.md"
    description: "New consolidated file for testing standards"
  - path: ".github/instructions/automation.instructions.md"
    description: "New consolidated file for agents and automation"
  - path: ".github/instructions/community-standards.instructions.md"
    description: "New consolidated file for community health and organization"
---

# Instruction File Consolidation Migration Guide

**Status**: ✅ Complete
**Date**: December 7, 2025
**Impact**: 22 files → 5 consolidated files (77% reduction)

## Overview

The LightSpeedWP instruction file library has been consolidated from 22 separate files into 5 comprehensive consolidated files. This document maps the old files to their new locations and provides guidance for updating references.

---

## Consolidation Map

### 1. Languages & Linting Consolidation

**New File**: `.github/instructions/languages.instructions.md`

| Old File                     | New Location | Section                       |
| ---------------------------- | ------------ | ----------------------------- |
| `javascript.instructions.md` | Section 1    | JavaScript/TypeScript Linting |
| `jsdoc.instructions.md`      | Section 2    | JSDoc Documentation Standards |
| `json.instructions.md`       | Section 3    | JSON Schema Validation        |
| `yaml.instructions.md`       | Section 4    | YAML Linting & GitHub Actions |

**Key Sections**:

- JavaScript/TypeScript (ESLint, Prettier)
- JSDoc standards (WordPress conventions)
- JSON schemas (validation, authoring)
- YAML validation (Spectral, actionlint)
- GitHub workflow validation

---

### 2. Documentation Formats Consolidation

**New File**: `.github/instructions/documentation-formats.instructions.md`

| Old File                      | New Location | Section            |
| ----------------------------- | ------------ | ------------------ |
| `markdown.instructions.md`    | Section 1    | Markdown Standards |
| `frontmatter.instructions.md` | Section 2    | YAML Frontmatter   |
| `mermaid.instructions.md`     | Section 3    | Mermaid Diagrams   |

**Key Sections**:

- Markdown formatting and conventions
- YAML frontmatter schema and validation
- Mermaid diagram types and best practices
- Accessibility in documentation

---

### 3. Quality Assurance Consolidation

**New File**: `.github/instructions/quality-assurance.instructions.md`

| Old File                  | New Location | Section               |
| ------------------------- | ------------ | --------------------- |
| `testing.instructions.md` | Section 1    | Testing Standards     |
| `tests.instructions.md`   | Section 2    | Test Index & Overview |
| `jest.instructions.md`    | Section 3    | Jest Configuration    |

**Key Sections**:

- Testing pyramid (unit, integration, E2E)
- Jest setup and configuration
- Test coverage requirements
- CI/CD test automation
- Performance and accessibility testing

---

### 4. Automation & Agents Consolidation

**New File**: `.github/instructions/automation.instructions.md`

| Old File                            | New Location | Section                        |
| ----------------------------------- | ------------ | ------------------------------ |
| `agents.instructions.md`            | Section 1    | Agent Development Standards    |
| `branding.instructions.md`          | Section 2    | Meta/Branding Automation       |
| `metrics.instructions.md`           | Section 3    | Metrics Collection & Reporting |
| `planner.instructions.md`           | Section 4    | Planning & Architecture Agents |
| `project-meta-sync.instructions.md` | Section 5    | Project Board Automation       |
| `release.instructions.md`           | Section 6    | Release Management Automation  |
| `reporting.instructions.md`         | Section 7    | Reporting Automation           |
| `reviewer.instructions.md`          | Section 8    | Code Review Automation         |

**Key Sections**:

- Agent development and design patterns
- Test automation and validation
- Labeling automation
- Release management workflow
- Metrics and reporting
- Project board synchronization
- Code review agents and workflows

---

### 5. Community Standards Consolidation

**New File**: `.github/instructions/community-standards.instructions.md`

| Old File                             | New Location | Section              |
| ------------------------------------ | ------------ | -------------------- |
| `file-management.instructions.md`    | Section 1    | File Organization    |
| `naming-conventions.instructions.md` | Section 2    | Naming Conventions   |
| `readme.instructions.md`             | Section 3    | README Documentation |
| `saved-replies.instructions.md`      | Section 4    | Saved Replies        |

**Key Sections**:

- File organization (reports, tmp folders)
- Naming conventions (files, functions, classes)
- README standards and templates
- GitHub saved replies
- Community health files
- Contributor guidelines

---

## Migration Checklist

### For Contributors

- [ ] Update any bookmarks pointing to old instruction files
- [ ] Reference new consolidated files in your workflows
- [ ] Use Ctrl+F to find old filenames in your docs and update to new consolidated files
- [ ] Refer to this migration guide if unsure where old content moved

### For Maintainers

- [ ] Update CI/CD pipelines to reference new file locations
- [ ] Update documentation that links to old instruction files
- [ ] Review git history for old file references and update PRs/issues as needed
- [ ] Communicate consolidation to team via discussion/announcement
- [ ] Archive old files for reference (moved to `.github/instructions/.archive/`)

### For Repository Templates

- [ ] Update issue templates that reference instruction files
- [ ] Update PR template links to new consolidated files
- [ ] Update GitHub discussion templates if applicable
- [ ] Refresh any automation that validates instruction file existence

---

## File References Update Guide

### Old → New File Paths

**Language & Linting**:

```
OLD: .github/instructions/javascript.instructions.md
NEW: .github/instructions/languages.instructions.md (Section 1)

OLD: .github/instructions/jsdoc.instructions.md
NEW: .github/instructions/languages.instructions.md (Section 2)

OLD: .github/instructions/json.instructions.md
NEW: .github/instructions/languages.instructions.md (Section 3)

OLD: .github/instructions/yaml.instructions.md
NEW: .github/instructions/languages.instructions.md (Section 4)
```

**Documentation Formats**:

```
OLD: .github/instructions/markdown.instructions.md
NEW: .github/instructions/documentation-formats.instructions.md (Section 1)

OLD: .github/instructions/frontmatter.instructions.md
NEW: .github/instructions/documentation-formats.instructions.md (Section 2)

OLD: .github/instructions/mermaid.instructions.md
NEW: .github/instructions/documentation-formats.instructions.md (Section 3)
```

**Quality Assurance**:

```
OLD: .github/instructions/testing.instructions.md
NEW: .github/instructions/quality-assurance.instructions.md (Section 1)

OLD: .github/instructions/tests.instructions.md
NEW: .github/instructions/quality-assurance.instructions.md (Section 2)

OLD: .github/instructions/jest.instructions.md
NEW: .github/instructions/quality-assurance.instructions.md (Section 3)
```

**Automation**:

```
OLD: .github/instructions/agents.instructions.md
NEW: .github/instructions/automation.instructions.md (Section 1)

OLD: .github/instructions/branding.instructions.md
NEW: .github/instructions/automation.instructions.md (Section 2)

OLD: .github/instructions/metrics.instructions.md
NEW: .github/instructions/automation.instructions.md (Section 3)

OLD: .github/instructions/planner.instructions.md
NEW: .github/instructions/automation.instructions.md (Section 4)

OLD: .github/instructions/project-meta-sync.instructions.md
NEW: .github/instructions/automation.instructions.md (Section 5)

OLD: .github/instructions/release.instructions.md
NEW: .github/instructions/automation.instructions.md (Section 6)

OLD: .github/instructions/reporting.instructions.md
NEW: .github/instructions/automation.instructions.md (Section 7)

OLD: .github/instructions/reviewer.instructions.md
NEW: .github/instructions/automation.instructions.md (Section 8)
```

**Community Standards**:

```
OLD: .github/instructions/file-management.instructions.md
NEW: .github/instructions/community-standards.instructions.md (Section 1)

OLD: .github/instructions/naming-conventions.instructions.md
NEW: .github/instructions/community-standards.instructions.md (Section 2)

OLD: .github/instructions/readme.instructions.md
NEW: .github/instructions/community-standards.instructions.md (Section 3)

OLD: .github/instructions/saved-replies.instructions.md
NEW: .github/instructions/community-standards.instructions.md (Section 4)
```

---

## Impact Analysis

### Benefits

✅ **Reduced Complexity**: 77% fewer files to manage
✅ **Improved Organization**: Logical grouping by domain (languages, formats, quality, automation, community)
✅ **Better Discoverability**: Comprehensive index files with cross-references
✅ **Easier Maintenance**: Centralized updates for related standards
✅ **Cleaner Navigation**: Related content grouped together

### Migration Effort

- **Small Files**: Quick reference updates
- **Medium Files**: Section-based searches and replacements
- **Large Files**: Comprehensive refactoring with new structure

### No Breaking Changes

✅ All content preserved exactly
✅ Functionality unchanged
✅ Only file locations and organization modified
✅ Backward compatible with inline references

---

## Archived Files Location

All old instruction files have been archived for reference:

```
.github/instructions/.archive/
├── javascript.instructions.md
├── jsdoc.instructions.md
├── json.instructions.md
├── yaml.instructions.md
├── markdown.instructions.md
├── frontmatter.instructions.md
├── mermaid.instructions.md
├── testing.instructions.md
├── tests.instructions.md
├── jest.instructions.md
├── agents.instructions.md
├── branding.instructions.md
├── metrics.instructions.md
├── planner.instructions.md
├── project-meta-sync.instructions.md
├── release.instructions.md
├── reporting.instructions.md
├── reviewer.instructions.md
├── file-management.instructions.md
├── naming-conventions.instructions.md
├── readme.instructions.md
└── saved-replies.instructions.md
```

**Note**: These files are archived for historical reference only. Do NOT use them for new work.

---

## Quick Reference

| Need                          | New Location                               |
| ----------------------------- | ------------------------------------------ |
| JavaScript/TypeScript linting | `languages.instructions.md` §1             |
| JSDoc standards               | `languages.instructions.md` §2             |
| JSON schemas                  | `languages.instructions.md` §3             |
| YAML validation               | `languages.instructions.md` §4             |
| Markdown standards            | `documentation-formats.instructions.md` §1 |
| Frontmatter specs             | `documentation-formats.instructions.md` §2 |
| Mermaid diagrams              | `documentation-formats.instructions.md` §3 |
| Testing & Jest                | `quality-assurance.instructions.md` §1-3   |
| Agents & automation           | `automation.instructions.md` §1-8          |
| File organization             | `community-standards.instructions.md` §1   |
| Naming conventions            | `community-standards.instructions.md` §2   |
| README standards              | `community-standards.instructions.md` §3   |
| Saved replies                 | `community-standards.instructions.md` §4   |

---

## FAQ

**Q: Can I still access the old files?**
A: Yes, they're archived in `.github/instructions/.archive/` for historical reference.

**Q: Do I need to update my scripts/workflows?**
A: If they reference old files directly, yes. Most references should be updated to the new consolidated files.

**Q: What if I have a PR referencing an old file?**
A: The consolidation is complete, but old file references should be updated to point to the new location.

**Q: Which file should I use?**
A: Use the new consolidated files. See the Quick Reference table above.

**Q: Is this a breaking change?**
A: No, this is purely organizational. All content is preserved exactly.

---

## Next Steps

1. ✅ Review this migration guide
2. ✅ Update bookmarks and documentation links
3. ✅ Verify your scripts reference new files
4. ✅ Archive old instruction files (completed)
5. ✅ Communicate consolidation to team
6. ✅ Update CI/CD pipelines if needed

---

## Support

For questions about this consolidation:

- Review the **Quick Reference** section above
- Check the **File References Update Guide** section
- Consult the new consolidated instruction files directly
- Refer to the archived files for historical context

---

*Consolidation completed December 7, 2025 by LightSpeed Team*
