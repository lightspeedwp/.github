---
file_type: "migration-guide"
title: "Instruction Consolidation Migration Guide"
description: "Guide mapping old instruction files to their new locations in consolidated files"
version: "v1.0"
created_date: "2025-12-07"
last_updated: "2025-12-07"
author: "LightSpeed Team"
status: "active"
---

# Instruction Consolidation Migration Guide

## Overview

As of December 7, 2025, LightSpeed has consolidated 22 instruction files into 5 comprehensive, maintainable guides. This migration guide maps old files to their new locations.

## Consolidation Summary

| Old Files (22)                                                                                                                                                                                                                                 | New File (5)                                                                     | Consolidation Date |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ------------------ |
| javascript.instructions.md, jsdoc.instructions.md, json.instructions.md, yaml.instructions.md                                                                                                                                                  | [languages.instructions.md](./languages.instructions.md)                         | 2025-12-07         |
| markdown.instructions.md, frontmatter.instructions.md, mermaid.instructions.md                                                                                                                                                                 | [documentation-formats.instructions.md](./documentation-formats.instructions.md) | 2025-12-07         |
| testing.instructions.md, tests.instructions.md, jest.instructions.md                                                                                                                                                                           | [quality-assurance.instructions.md](./quality-assurance.instructions.md)         | 2025-12-07         |
| agents.instructions.md, branding.instructions.md (now meta.instructions.md), metrics.instructions.md, planner.instructions.md, project-meta-sync.instructions.md, release.instructions.md, reporting.instructions.md, reviewer.instructions.md | [automation.instructions.md](./automation.instructions.md)                       | 2025-12-07         |
| file-management.instructions.md, naming-conventions.instructions.md, readme.instructions.md, saved-replies.instructions.md                                                                                                                     | [community-standards.instructions.md](./community-standards.instructions.md)     | 2025-12-07         |

**Reduction**: 77% fewer files (17 consolidated → 5 consolidated)

## Old File → New File Mapping

### 1. Languages & Linting

#### Old Files

- **javascript.instructions.md** → [languages.instructions.md § JavaScript/TypeScript](./languages.instructions.md#javascripttypescript)
- **jsdoc.instructions.md** → [languages.instructions.md § JSDoc Standards](./languages.instructions.md#jsdoc-standards)
- **json.instructions.md** → [languages.instructions.md § JSON](./languages.instructions.md#json)
- **yaml.instructions.md** → [languages.instructions.md § YAML](./languages.instructions.md#yaml)

#### New Location

All language-specific linting and formatting guidance is now consolidated in [**languages.instructions.md**](./languages.instructions.md)

**Key Sections:**

- JavaScript/TypeScript (ESLint, Prettier, JSDoc)
- JSON (Schema validation, formatting)
- YAML (Spectral, actionlint, workflow validation)
- JSDoc documentation standards
- Linting tools and configurations

---

### 2. Documentation Formats

#### Old Files

- **markdown.instructions.md** → [documentation-formats.instructions.md § Markdown](./documentation-formats.instructions.md#markdown)
- **frontmatter.instructions.md** → [documentation-formats.instructions.md § YAML Frontmatter](./documentation-formats.instructions.md#yaml-frontmatter)
- **mermaid.instructions.md** → [documentation-formats.instructions.md § Mermaid Diagrams](./documentation-formats.instructions.md#mermaid-diagrams)

#### New Location

All documentation formatting guidance is now consolidated in [**documentation-formats.instructions.md**](./documentation-formats.instructions.md)

**Key Sections:**

- Markdown standards and best practices
- YAML frontmatter requirements and validation
- Mermaid diagram syntax and usage
- Accessibility in documentation
- File naming for documentation

---

### 3. Quality Assurance & Testing

#### Old Files

- **testing.instructions.md** → [quality-assurance.instructions.md § Testing Strategy](./quality-assurance.instructions.md#testing-strategy)
- **tests.instructions.md** → [quality-assurance.instructions.md § Test Execution](./quality-assurance.instructions.md#test-execution)
- **jest.instructions.md** → [quality-assurance.instructions.md § Jest Configuration](./quality-assurance.instructions.md#jest-configuration)

#### New Location

All testing and QA guidance is now consolidated in [**quality-assurance.instructions.md**](./quality-assurance.instructions.md)

**Key Sections:**

- Testing pyramid and strategy
- Jest unit testing configuration
- Integration and E2E testing
- Code coverage requirements
- CI/CD test integration
- Test execution and reporting

---

### 4. Automation, Agents & Workflows

#### Old Files

- **agents.instructions.md** → [automation.instructions.md § Agents](./automation.instructions.md#agents)
- **branding.instructions.md** (renamed to **meta.instructions.md**) → [meta.instructions.md](./meta.instructions.md)
- **metrics.instructions.md** → [automation.instructions.md § Metrics Collection](./automation.instructions.md#metrics-collection)
- **planner.instructions.md** → [automation.instructions.md § Planning Automation](./automation.instructions.md#planning-automation)
- **project-meta-sync.instructions.md** → [automation.instructions.md § Project Synchronization](./automation.instructions.md#project-synchronization)
- **release.instructions.md** → [automation.instructions.md § Release Management](./automation.instructions.md#release-management)
- **reporting.instructions.md** → [automation.instructions.md § Reporting & Analytics](./automation.instructions.md#reporting--analytics)
- **reviewer.instructions.md** → [automation.instructions.md § Code Review Automation](./automation.instructions.md#code-review-automation)

#### New Location

All automation and workflow guidance is now consolidated in [**automation.instructions.md**](./automation.instructions.md)

**Key Sections:**

- Agent specifications and design patterns
- Labeling automation and enforcement
- Release management and versioning
- Metrics collection and reporting
- Project board synchronization
- Code review automation
- Planning and task automation
- Documentation metadata (branding)

---

### 5. Community Standards & Organization

#### Old Files

- **file-management.instructions.md** → [community-standards.instructions.md § File Organization](./community-standards.instructions.md#file-organization)
- **naming-conventions.instructions.md** → [community-standards.instructions.md § Naming Conventions](./community-standards.instructions.md#naming-conventions)
- **readme.instructions.md** → [community-standards.instructions.md § README Standards](./community-standards.instructions.md#readme-standards)
- **saved-replies.instructions.md** → [community-standards.instructions.md § Saved Replies](./community-standards.instructions.md#saved-replies)

#### New Location

All community health and organizational guidance is now consolidated in [**community-standards.instructions.md**](./community-standards.instructions.md)

**Key Sections:**

- File organization (reports, temporary, permanent)
- Naming conventions for all file types
- README documentation standards
- Saved replies for maintainers
- Community health best practices

---

## Migration Steps for Users

### If You Were Using Old Files

1. **Find the new consolidated file** using the mapping table above
2. **Update your bookmarks/references** to the new file location
3. **Search for the relevant section** using the section mappings provided
4. **Update CI/CD references** if you were loading specific old instruction files

### Example Migration

**Old workflow:**

```yaml
# Uses javascript.instructions.md
uses: ./instructions/javascript.instructions.md
```

**New workflow:**

```yaml
# Updated to use consolidated file
uses: ./instructions/languages.instructions.md
```

---

## Archive Structure

Old instruction files have been moved to [`.archive/`](./.archive/) for reference:

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
└── saved-replies.instructions.md
```

**Archive files are for reference only and should not be used for new work.**

---

## Benefits of Consolidation

✅ **77% fewer files** - Easier to navigate and maintain
✅ **Better organization** - Logical grouping of related standards
✅ **Improved discoverability** - All related guidance in one place
✅ **Easier updates** - Changes to standards affect one file, not many
✅ **Clearer hierarchy** - Sections and subsections replace file fragmentation
✅ **Consistent formatting** - All files follow the same template structure

---

## Timeline

| Date       | Event                                                                 |
| ---------- | --------------------------------------------------------------------- |
| 2025-12-07 | Consolidation completed                                               |
| 2025-12-07 | Old files moved to `.archive/`                                        |
| 2025-12-07 | Migration guide created                                               |
| 2025-12-07 | Cross-references updated                                              |
| TBD        | Old `.archive/` files permanently removed (after 90-day grace period) |

**Notes:**

- `branding.instructions.md` has been superseded by `meta.instructions.md` and is not kept in the archive; use the new file for metadata/branding guidance.

---

## Questions or Issues?

If you encounter any problems during migration:

1. Check this guide for your old file → new file mapping
2. Consult the relevant section in the new consolidated file
3. Review cross-references in the consolidated files
4. Open an issue if the mapping is unclear or you need clarification

---

## References

- [New Consolidated Files Directory](./README.md)
- [Coding Standards Instructions](./coding-standards.instructions.md)
- [Custom Instructions](../.github/custom-instructions.md)
- [Global AI Rules](../../AGENTS.md)

---

*Last Updated: 2025-12-07*
*Version: 1.0*
*Consolidation by: LightSpeed Team*
