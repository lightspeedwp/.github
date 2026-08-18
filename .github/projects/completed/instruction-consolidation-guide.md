---
file_type: "documentation"
title: "Instruction File Consolidation Guide"
description: "Migration guide for instruction file consolidation from 22 files to 5 consolidated files (December 2025)"
version: "v1.0"
created_date: "2025-12-07"
last_updated: "2025-12-07"
authors: ["LightSpeed Team"]
status: archived
tags: ["consolidation", "migration", "instructions", "reference"]
---

# Instruction File Consolidation Guide (December 2025)

## Overview

As of December 7, 2025, the LightSpeed instruction files have been consolidated from **22 files to 5 comprehensive guides**, reducing file fragmentation by **77%** while improving maintainability and discoverability.

## Migration Map: Old Files → New Consolidated Files

### 1. Languages & Linting Consolidation

**New File:** `.github/instructions/languages.instructions.md`

| Old File                     | New Section                   | Location  |
| ---------------------------- | ----------------------------- | --------- |
| `javascript.instructions.md` | JavaScript/TypeScript Linting | Section 2 |
| `jsdoc.instructions.md`      | JSDoc Documentation           | Section 3 |
| `json.instructions.md`       | JSON Schema Validation        | Section 4 |
| `yaml.instructions.md`       | YAML Linting & Validation     | Section 5 |

**Archive Location:** `.github/instructions/.archive/languages/`

---

### 2. Documentation Formats Consolidation

**New File:** `.github/instructions/documentation-formats.instructions.md`

| Old File                      | New Section        | Location  |
| ----------------------------- | ------------------ | --------- |
| `markdown.instructions.md`    | Markdown Standards | Section 2 |
| `frontmatter.instructions.md` | YAML Frontmatter   | Section 3 |
| `mermaid.instructions.md`     | Mermaid Diagrams   | Section 4 |

**Note:** `a11y.instructions.md` remains separate as it's used across all document types

**Archive Location:** `.github/instructions/.archive/documentation/`

---

### 3. Quality Assurance Consolidation

**New File:** `.github/instructions/quality-assurance.instructions.md`

| Old File                  | New Section                         | Location  |
| ------------------------- | ----------------------------------- | --------- |
| `testing.instructions.md` | Testing Standards Overview          | Section 2 |
| `tests.instructions.md`   | Test Framework Index                | Section 3 |
| `jest.instructions.md`    | Jest Configuration & Best Practices | Section 4 |

**Archive Location:** `.github/instructions/.archive/quality-assurance/`

---

### 4. Automation Consolidation (Largest)

**New File:** `.github/instructions/automation.instructions.md`

| Old File                            | New Section                      | Location  |
| ----------------------------------- | -------------------------------- | --------- |
| `agents.instructions.md`            | Agent Development & Standards    | Section 2 |
| `labeling.instructions.md`          | Labeling System & Automation     | Section 3 |
| `release.instructions.md`           | Release Management Automation    | Section 4 |
| `metrics.instructions.md`           | Metrics Collection & Reporting   | Section 5 |
| `reporting.instructions.md`         | Report Generation & Organization | Section 6 |
| `project-meta-sync.instructions.md` | Project Field Synchronization    | Section 7 |
| `planner.instructions.md`           | Planning & Task Management       | Section 8 |
| `reviewer.instructions.md`          | Code Review Automation           | Section 9 |

**Note:** Each section includes cross-references to corresponding agent specs and prompts

**Archive Location:** `.github/instructions/.archive/automation/`

---

### 5. Community Standards Consolidation

**New File:** `.github/instructions/community-standards.instructions.md`

| Old File                             | New Section                    | Location  |
| ------------------------------------ | ------------------------------ | --------- |
| `file-management.instructions.md`    | File Organization & Management | Section 2 |
| `naming-conventions.instructions.md` | Naming Conventions             | Section 3 |
| `readme.instructions.md`             | README Standards               | Section 4 |
| `saved-replies.instructions.md`      | GitHub Saved Replies           | Section 5 |

**Archive Location:** `.github/instructions/.archive/community/`

---

## Files Remaining Separate (Not Consolidated)

These files remain separate due to their specialized scope:

- `a11y.instructions.md` - Accessibility (used across all domains)
- `coding-standards.instructions.md` - Unified coding standards (foundational)
- `copilot-thought-logging.instructions.md` - Process tracking
- `self-explanatory-code-commenting.instructions.md` - Code comment best practices
- `spec-driven-workflow.instructions.md` - Development workflow methodology
- `taming-copilot.instructions.md` - Copilot behavior control
- `task-implementation.instructions.md` - Task execution guidelines
- `tasksync.instructions.md` - Terminal-based task interaction
- `linting.instructions.md` - Master linting index (umbrella file)
- `template.instructions.md` - Template skeleton
- `prompt.instructions.md` - Prompt creation standards
- `instructions.instructions.md` - Instruction file standards
- `tools.instructions.md` - AI Toolkit reference

**Total Remaining Separate Files:** 13

---

## Updated Master Indexes

These files have been updated to reference the new consolidated structure:

- `AGENTS.md` - Global AI rules and agent references
- `.github/agents/agent.md` - Main agent specification index
- `.github/custom-instructions.md` - Organization-wide Copilot settings
- `.github/prompts/prompts.md` - Prompt library index

---

## How to Find Content from Old Files

### Quick Lookup Table

| Looking for...         | Check New File                          | Section               |
| ---------------------- | --------------------------------------- | --------------------- |
| ESLint/Prettier config | `languages.instructions.md`             | JavaScript/TypeScript |
| JSDoc standards        | `languages.instructions.md`             | JSDoc Documentation   |
| JSON Schema validation | `languages.instructions.md`             | JSON Schema           |
| YAML linting           | `languages.instructions.md`             | YAML Validation       |
| Markdown formatting    | `documentation-formats.instructions.md` | Markdown              |
| Frontmatter validation | `documentation-formats.instructions.md` | YAML Frontmatter      |
| Mermaid diagrams       | `documentation-formats.instructions.md` | Mermaid               |
| Testing strategy       | `quality-assurance.instructions.md`     | Testing Standards     |
| Jest setup             | `quality-assurance.instructions.md`     | Jest                  |
| Agent development      | `automation.instructions.md`            | Agents                |
| Labeling automation    | `automation.instructions.md`            | Labeling              |
| Release process        | `automation.instructions.md`            | Release               |
| Metrics collection     | `automation.instructions.md`            | Metrics               |
| Report generation      | `automation.instructions.md`            | Reporting             |
| Project sync           | `automation.instructions.md`            | Project Meta Sync     |
| File organization      | `community-standards.instructions.md`   | File Management       |
| File naming            | `community-standards.instructions.md`   | Naming Conventions    |
| README format          | `community-standards.instructions.md`   | README                |
| Saved replies          | `community-standards.instructions.md`   | Saved Replies         |

---

## Archive Structure

All consolidated files have been moved to `.github/instructions/.archive/`:

```
.github/instructions/.archive/
├── README.md (archive index)
├── languages/
│   ├── javascript.instructions.md
│   ├── jsdoc.instructions.md
│   ├── json.instructions.md
│   └── yaml.instructions.md
├── documentation/
│   ├── markdown.instructions.md
│   ├── frontmatter.instructions.md
│   └── mermaid.instructions.md
├── quality-assurance/
│   ├── testing.instructions.md
│   ├── tests.instructions.md
│   └── jest.instructions.md
└── automation/
    ├── agents.instructions.md
    ├── labeling.instructions.md
    ├── release.instructions.md
    ├── metrics.instructions.md
    ├── reporting.instructions.md
    ├── project-meta-sync.instructions.md
    ├── planner.instructions.md
    └── reviewer.instructions.md
```

---

## Benefits of This Consolidation

### 📊 Quantitative Improvements

| Metric                     | Before    | After     | Change     |
| -------------------------- | --------- | --------- | ---------- |
| Active instruction files   | 22        | 5         | -77%       |
| Consolidated sections      | 22        | 1         | -          |
| Cross-reference complexity | High      | Low       | Simplified |
| Discoverability            | Scattered | Organized | Enhanced   |
| Maintenance burden         | High      | Low       | Reduced    |

### ✨ Qualitative Benefits

1. **Easier Discovery** - Related topics now in one place
2. **Better Organization** - Clear hierarchy and structure
3. **Reduced Maintenance** - Single file to update per topic
4. **Improved Context** - Related standards grouped together
5. **Clearer Navigation** - Table of contents in each file
6. **Faster Onboarding** - New contributors find all related info quickly

---

## How to Update Your Workflows

### For Copilot Custom Instructions

**Old:** Reference individual files scattered across 22 files

**New:** Reference consolidated files directly:

```yaml
# Load consolidated instruction groups
- languages.instructions.md # All language/linting standards
- documentation-formats.instructions.md # All docs standards
- quality-assurance.instructions.md # All testing standards
- automation.instructions.md # All automation standards
- community-standards.instructions.md # All community standards
```

### For GitHub Workflows

Update workflow comments and documentation to reference new files:

```yaml
# Old
# See: .github/instructions/javascript.instructions.md

# New
# See: .github/instructions/languages.instructions.md (JavaScript/TypeScript section)
```

### For Pull Request Templates

Update links in PR templates to point to new consolidated files.

---

## Questions?

Refer to the new consolidated files directly. Each section in the consolidated files includes:

- Detailed standards and practices
- Implementation examples
- Links to related specs and tools
- Best practices and guardrails

---

## Timeline

- **December 7, 2025** - Consolidation completed
- **December 7-14, 2025** - Reference files updated (AGENTS.md, DOCS.md, custom-instructions.md)
- **Ongoing** - Old files in archive for historical reference

All new work should reference the consolidated files, not the archived versions.

---

*This consolidation improves maintainability and clarity for the LightSpeed organization while preserving historical references in the archive.*
