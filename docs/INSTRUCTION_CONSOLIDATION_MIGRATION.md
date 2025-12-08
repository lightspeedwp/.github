---
title: "Instruction Consolidation Migration Guide"
description: "Maps legacy instruction files to their new consolidated locations in the LightSpeed organization."
version: "v1.0"
created_date: "2025-12-07"
last_updated: "2025-12-07"
file_type: "migration-guide"
authors: ["LightSpeed Team"]
domain: "governance"
stability: "stable"
---

# Instruction Consolidation Migration Guide

**Consolidation Date:** December 7, 2025
**Status:** ✅ COMPLETE
**Impact:** 22 instruction files consolidated into 5 comprehensive guides (77% reduction)

---

## Executive Summary

The LightSpeed organization has successfully consolidated 22 specialized instruction files into 5 comprehensive, modular guides. This consolidation reduces maintenance overhead, improves discoverability, and makes it easier for contributors to find related guidance.

**Key Achievement:** From 22 files → 5 consolidated files while maintaining complete coverage of all standards and best practices.

---

## Consolidation Map

### 1. Languages & Linting Standards

**New File:** `.github/instructions/languages.instructions.md`

Consolidates these 4 legacy files:

| Legacy File                  | New Section                      | Status      |
| ---------------------------- | -------------------------------- | ----------- |
| `javascript.instructions.md` | JavaScript/TypeScript Standards  | ✅ Migrated |
| `jsdoc.instructions.md`      | JSDoc Documentation Standards    | ✅ Migrated |
| `json.instructions.md`       | JSON Schema Validation           | ✅ Migrated |
| `yaml.instructions.md`       | YAML & GitHub Actions Validation | ✅ Migrated |

**Content Includes:**

- ESLint configuration (flat config and classic)
- Prettier formatting standards
- JSDoc conventions for WordPress
- JSON Schema authoring
- YAML linting rules
- GitHub Actions workflow validation

**Migration Actions:**

- ✅ New consolidated file created
- ✅ Legacy files moved to `.archive/`
- ✅ All references updated across codebase

---

### 2. Documentation Formats

**New File:** `.github/instructions/documentation-formats.instructions.md`

Consolidates these 3 legacy files:

| Legacy File                   | New Section                         | Status      |
| ----------------------------- | ----------------------------------- | ----------- |
| `markdown.instructions.md`    | Markdown Standards & Best Practices | ✅ Migrated |
| `frontmatter.instructions.md` | YAML Frontmatter Validation         | ✅ Migrated |
| `mermaid.instructions.md`     | Mermaid Diagram Standards           | ✅ Migrated |

**Content Includes:**

- Markdown style and formatting standards
- YAML frontmatter schema validation
- Frontmatter field requirements
- Mermaid diagram types and syntax
- Diagram accessibility guidelines
- Best practices for each format

**Migration Actions:**

- ✅ New consolidated file created
- ✅ Legacy files moved to `.archive/`
- ✅ Schema references updated

---

### 3. Quality Assurance & Testing

**New File:** `.github/instructions/quality-assurance.instructions.md`

Consolidates these 3 legacy files:

| Legacy File               | New Section                  | Status      |
| ------------------------- | ---------------------------- | ----------- |
| `testing.instructions.md` | Testing Strategy & Framework | ✅ Migrated |
| `tests.instructions.md`   | Test Standards Index         | ✅ Migrated |
| `jest.instructions.md`    | Jest Configuration & Usage   | ✅ Migrated |

**Content Includes:**

- Testing pyramid (unit, integration, E2E)
- Jest configuration and setup
- Unit test best practices
- Integration test patterns
- E2E testing with Playwright
- Coverage requirements and reporting
- CI/CD test integration
- Pre-commit hook configuration

**Migration Actions:**

- ✅ New consolidated file created
- ✅ Legacy files moved to `.archive/`
- ✅ Jest config references updated

---

### 4. Automation & Workflows

**New File:** `.github/instructions/automation.instructions.md`

Consolidates these 8 legacy files:

| Legacy File                         | New Section                     | Status      |
| ----------------------------------- | ------------------------------- | ----------- |
| `agents.instructions.md`            | Agent Development Standards     | ✅ Migrated |
| `branding.instructions.md`          | Meta/Branding Automation        | ✅ Migrated |
| `metrics.instructions.md`           | Metrics Collection & Reporting  | ✅ Migrated |
| `planner.instructions.md`           | Planning & Architecture Agents  | ✅ Migrated |
| `project-meta-sync.instructions.md` | Project Synchronization         | ✅ Migrated |
| `release.instructions.md`           | Release Automation & Versioning | ✅ Migrated |
| `reporting.instructions.md`         | Report Generation & Org         | ✅ Migrated |
| `reviewer.instructions.md`          | Code Review Automation          | ✅ Migrated |

**Content Includes:**

- Agent specification framework
- Agent testing and validation
- Labeling automation and enforcement
- Release workflow automation
- Semantic versioning implementation
- Changelog management
- GitHub Project synchronization
- Metrics collection workflows
- Reporting standards and templates
- Code review agent configuration
- Planning agent usage

**Migration Actions:**

- ✅ New consolidated file created
- ✅ Legacy files moved to `.archive/`
- ✅ Agent spec references updated

---

### 5. Community Standards & Organization

**New File:** `.github/instructions/community-standards.instructions.md`

Consolidates these 4 legacy files:

| Legacy File                          | New Section                      | Status      |
| ------------------------------------ | -------------------------------- | ----------- |
| `file-management.instructions.md`    | File & Folder Organization       | ✅ Migrated |
| `naming-conventions.instructions.md` | Naming Conventions               | ✅ Migrated |
| `readme.instructions.md`             | README & Documentation Standards | ✅ Migrated |
| `saved-replies.instructions.md`      | Saved Replies Management         | ✅ Migrated |

**Content Includes:**

- File organization best practices
- Temporary vs. permanent file locations
- Naming conventions for all file types
- README.md structure and content
- Documentation standards
- Saved replies creation and maintenance
- Community health file organization

**Migration Actions:**

- ✅ New consolidated file created
- ✅ Legacy files moved to `.archive/`
- ✅ File structure references updated

---

## Archive Location

All legacy instruction files have been moved to preserve history and enable rollback if needed:

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
└── reviewer.instructions.md
```

---

## Updating Your References

### If You Linked to Old Files

**Old Style References:**

```markdown
[JavaScript Instructions](./.github/instructions/javascript.instructions.md)
[Testing Guide](./.github/instructions/testing.instructions.md)
```

**New Style References:**

```markdown
[Language Standards](./.github/instructions/languages.instructions.md)
[Quality Assurance](./.github/instructions/quality-assurance.instructions.md)
```

### In Frontmatter

**Old:**

```yaml
references:
  - path: ".github/instructions/javascript.instructions.md"
```

**New:**

```yaml
references:
  - path: ".github/instructions/languages.instructions.md"
    description: "Language-specific standards (JavaScript, JSON, YAML)"
```

---

## Documentation Structure After Consolidation

```
.github/instructions/
├── coding-standards.instructions.md        # Core unified standards
├── languages.instructions.md               # JS/TS, JSON, YAML, JSDoc, linting
├── documentation-formats.instructions.md   # Markdown, frontmatter, Mermaid
├── quality-assurance.instructions.md       # Testing, Jest, coverage, CI/CD
├── automation.instructions.md              # Agents, release, metrics, labeling
├── community-standards.instructions.md     # File org, naming, README, saved replies
├── linting.instructions.md                 # Linting agent and standards
├── workflows.instructions.md               # GitHub Actions best practices
├── a11y.instructions.md                    # Accessibility standards
├── copilot-thought-logging.instructions.md # Copilot tracking
├── file-management.instructions.md         # Deprecated - see community-standards
├── labeling.instructions.md                # Labeling system (unified agent)
├── prompt.instructions.md                  # Prompt file creation
├── instructions.instructions.md            # Creating instruction files
├── taming-copilot.instructions.md         # Copilot behavior guidelines
├── self-explanatory-code-commenting.instructions.md
├── spec-driven-workflow.instructions.md
├── tasksync.instructions.md
└── .archive/                               # Legacy files (17 consolidated)
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
    └── reviewer.instructions.md
```

---

## Quick Reference: Where to Find What

| Topic                         | New Location                            |
| ----------------------------- | --------------------------------------- |
| JavaScript/TypeScript linting | `languages.instructions.md`             |
| JSDoc standards               | `languages.instructions.md`             |
| JSON Schema creation          | `languages.instructions.md`             |
| YAML validation               | `languages.instructions.md`             |
| Markdown formatting           | `documentation-formats.instructions.md` |
| YAML frontmatter              | `documentation-formats.instructions.md` |
| Mermaid diagrams              | `documentation-formats.instructions.md` |
| Testing strategy              | `quality-assurance.instructions.md`     |
| Jest configuration            | `quality-assurance.instructions.md`     |
| Code coverage                 | `quality-assurance.instructions.md`     |
| Agent development             | `automation.instructions.md`            |
| Release automation            | `automation.instructions.md`            |
| Labeling system               | `labeling.instructions.md`              |
| File organization             | `community-standards.instructions.md`   |
| Naming conventions            | `community-standards.instructions.md`   |
| README standards              | `community-standards.instructions.md`   |
| Saved replies                 | `community-standards.instructions.md`   |

---

## Benefits of This Consolidation

### ✅ **Reduced Cognitive Load**

- Contributors find related guidance in one place
- Fewer files to search through
- Clearer hierarchy and organization

### ✅ **Easier Maintenance**

- 77% fewer files to maintain
- Single source of truth per topic area
- Easier to keep related content in sync

### ✅ **Improved Discoverability**

- Related standards grouped together
- Better cross-referencing within files
- Clearer relationships between concepts

### ✅ **Scalability**

- Consolidated structure easier to extend
- New standards can be added to appropriate guide
- Archive prevents clutter

### ✅ **Better Governance**

- Unified standards across related topics
- Consistent formatting and structure
- Easier version tracking

---

## Rollback Instructions

If you need to restore original files for any reason:

```bash
# Restore all archived files
cp -r .github/instructions/.archive/* .github/instructions/

# Or restore specific file
cp .github/instructions/.archive/javascript.instructions.md .github/instructions/
```

---

## Questions or Issues?

If you have questions about finding content in the new structure:

1. **Check the Quick Reference table above** - Maps old topics to new locations
2. **Use semantic search** - Search the consolidated file for keywords
3. **Review the table of contents** - Each consolidated file has a detailed TOC
4. **Check cross-references** - Files link to related content

---

## Timeline

- **December 7, 2025:** Consolidation completed
- **All references updated** across AGENTS.md, custom-instructions.md, and prompts.md
- **Legacy files archived** in `.archive/` for historical reference
- **Migration guide** (this file) created

---

*This migration consolidates our instruction library while preserving all content and enabling easy reference to legacy files.*
