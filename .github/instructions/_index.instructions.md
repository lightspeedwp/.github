---
file_type: "instructions"
title: "Master Instructions Index"
description: "Comprehensive index of all instruction files for WordPress block plugin development"
version: "1.0.0"
last_updated: "2025-12-10"
author: "LightSpeedWP Team"
tags: ["index", "navigation", "documentation"]
applyTo: "**"
domain: "meta"
stability: "stable"
---

# Master Instructions Index

You are an instruction index navigator. Follow our LightSpeed documentation taxonomy to route Copilot and developers to the correct instruction sets for the multi-block plugin scaffold. Avoid redefining guidance or altering file scopes here; keep this file focused on navigation and discoverability.

## Overview

This index maps every instruction file in the repository and when to use it. Use it whenever you need to find the right rules for coding, releases, testing, or scaffolding. It does not replace the underlying instructions; it only points to them.

## General Rules

- Keep links and counts accurate; update when files are added, renamed, or retired.
- Do not duplicate content from individual instruction files; link instead.
- Use UK English and the repository’s preferred taxonomy (coding standards, block development, testing, scaffolding).

## Detailed Guidance

- Browse the categories below to locate the correct instruction file for the task.
- Prefer the most specific instruction (for example, `block-json.instructions.md` for block metadata).
- When in doubt, start with `instructions.instructions.md` for authoring guidance.

## Examples

- Need PHP coding rules? Go to `wpcs-php.instructions.md`.
- Adding a new block? Start with `blocks-development.instructions.md`.

## Validation

- Ensure every `*.instructions.md` file in `.github/instructions` is listed or intentionally excluded.
- Check links resolve to existing files after renames.

**Last Updated:** 2025-12-15
**Total Files:** 27 instruction files

---

## 📚 How to Use This Index

1. **Find your task** — Locate the category that matches your current work
2. **Open the relevant file** — Click the link to open the instruction file
3. **Follow the guidance** — Apply the standards and patterns described
4. **Cross-reference** — Many files reference each other for related topics

---

## 🎯 Quick Start Guides

### New to Block Development?

Start here:

1. [blocks-development.instructions.md](#block-development) — Core block development patterns
2. [block-json.instructions.md](#block-development) — Block metadata reference
3. [javascript-react-development.instructions.md](#javascriptreact-development) — React patterns

### Building a Plugin?

1. [generate-plugin.instructions.md](#plugin-scaffolding) — Plugin generator
2. [scaffold-extensions.instructions.md](#plugin-scaffolding) — Extending the scaffold
3. [folder-structure.instructions.md](#project-organization) — Project organization

### Need Coding Standards?

All `wpcs-*` files in the [WordPress Coding Standards](#wordpress-coding-standards-wpcs) section

### Working with Automation & Agents?

1. [automation.instructions.md](#automation--agent-infrastructure) — Overall automation architecture
2. [metrics.instructions.md](#automation--agent-infrastructure) — Metrics collection and reporting
3. [release.instructions.md](#automation--agent-infrastructure) — Release preparation and execution
4. [labeling.instructions.md](#automation--agent-infrastructure) — Label automation system

### JavaScript + React Development {#javascriptreact-development}

- [languages.instructions.md](./languages.instructions.md) — JavaScript, TypeScript, and React code standards
- [spec-driven-workflow.instructions.md](./spec-driven-workflow.instructions.md) — Spec-driven React workflows and component patterns

---

## 📂 File Categories

### WordPress Coding Standards (wpcs-*) {#wordpress-coding-standards-wpcs}

> **Protected Files** — These files define core WordPress coding standards and should NOT be reduced or deleted.

| File | Size | Purpose | When to Use |
|------|------|---------|-------------|
| [wpcs-php.instructions.md](./wpcs-php.instructions.md) | 40.9KB | PHP coding standards, formatting, naming, security, i18n | When writing any PHP code |
| [wpcs-javascript.instructions.md](./wpcs-javascript.instructions.md) | 37.2KB | JavaScript coding standards and patterns | When writing any JavaScript code |
| [wpcs-php-docs.instructions.md](./wpcs-php-docs.instructions.md) | 37.7KB | PHP inline documentation (DocBlocks) | When documenting PHP functions, classes, hooks |
| [wpcs-js-docs.instructions.md](./wpcs-js-docs.instructions.md) | 25.6KB | JavaScript inline documentation (JSDoc) | When documenting JavaScript functions, components |
| [wpcs-css.instructions.md](./wpcs-css.instructions.md) | 14.6KB | CSS/SCSS coding standards (naming, specificity, formatting) | When styling blocks for editor or frontend |
| [wpcs-html.instructions.md](./wpcs-html.instructions.md) | 8.3KB | HTML markup standards and semantics | When creating block markup, save functions, or PHP renders |
| [wpcs-accessibility.instructions.md](./wpcs-accessibility.instructions.md) | 9.7KB | Accessibility standards (WCAG 2.2 AA) | When designing block UI or output markup |

**Total WPCS Files:** 7 files (~174KB)

---

### Block Development

| File | Size | Purpose | When to Use |
|------|------|---------|-------------|
| [blocks-development.instructions.md](./blocks-development.instructions.md) | ~30KB | **NEW** — Comprehensive block development guide (edit/save components, hooks, registration) | When developing blocks, creating edit/save components |
| [block-json.instructions.md](./block-json.instructions.md) | 8.8KB | Block.json schema reference (attributes, supports, variations) | When creating/editing `block.json` files |
| [patterns-and-templates.instructions.md](./patterns-and-templates.instructions.md) | ~25KB | **NEW** — Pattern development, registration, and template usage | When creating block patterns or page templates |
| [javascript-react-development.instructions.md](./javascript-react-development.instructions.md) | 17.8KB | **CONSOLIDATED** — React/JS development patterns for blocks | When writing React components, hooks, or JS utilities |

**Total Block Development Files:** 4 files (~82KB)

---

### Testing & Quality Assurance

| File | Size | Purpose | When to Use |
|------|------|---------|-------------|
| [testing-e2e.instructions.md](./testing-e2e.instructions.md) | 4.1KB | **RENAMED** — End-to-end testing with Playwright/TypeScript | When writing E2E tests for blocks, editor, or frontend |
| [security.instructions.md](./security.instructions.md) | 9.1KB | Block plugin security best practices (sanitization, escaping, nonces) | When handling user input, REST APIs, or capabilities |

**Total Testing Files:** 2 files (~13KB)

---

### Plugin Scaffolding

| File | Size | Purpose | When to Use |
|------|------|---------|-------------|
| [generate-plugin.instructions.md](./generate-plugin.instructions.md) | 13.5KB | Mustache template scaffolding standards | When generating new plugins from the scaffold |
| [scaffold-extensions.instructions.md](./scaffold-extensions.instructions.md) | 10.7KB | **RENAMED** — Extending scaffold with templates, bindings, patterns | When adding block templates, bindings, or styles to scaffold |

**Total Scaffolding Files:** 2 files (~24KB)

---

### Project Organization

| File | Size | Purpose | When to Use |
|------|------|---------|-------------|
| [folder-structure.instructions.md](./folder-structure.instructions.md) | 11.4KB | Project organization and file structure standards | When setting up new projects or organizing code |
| [schema-files.instructions.md](./schema-files.instructions.md) | 12.2KB | Schema file organization and structure | When creating JSON schemas |
| [temp-files.instructions.md](./temp-files.instructions.md) | 5.6KB | Temporary file handling guidelines | When working with temporary files |

**Total Organization Files:** 3 files (~29KB)

---

### Automation & Agent Infrastructure

| File | Size | Purpose | When to Use |
|------|------|---------|-------------|
| [automation.instructions.md](./automation.instructions.md) | ~50KB | Comprehensive automation standards for agents, workflows, and repository health | When designing, auditing, or maintaining GitHub automation |
| [labeling.instructions.md](./labeling.instructions.md) | ~17KB | Unified labelling automation system (config-driven) | When configuring or troubleshooting label automation |
| [metrics.instructions.md](./metrics.instructions.md) | 13KB | **NEW** — Metrics collection, aggregation, and reporting standards | When collecting repository health metrics or generating analytics reports |
| [planner.instructions.md](./planner.instructions.md) | 14KB | **NEW** — PR planning, checklist generation, and merge readiness validation | When implementing PR automation or checklist workflows |
| [project-meta-sync.instructions.md](./project-meta-sync.instructions.md) | 17KB | **NEW** — GitHub Project board field synchronisation from labels | When syncing project boards with issue/PR labels |
| [release.instructions.md](./release.instructions.md) | 20KB | **NEW** — Release management, semantic versioning, and changelog compliance | When preparing, validating, or publishing releases |
| [workflows.instructions.md](./workflows.instructions.md) | ~15KB | GitHub Actions workflow standards and patterns | When creating or modifying workflow files |

**Total Automation Files:** 7 files (~146KB)

---

### Special Topics

| File | Size | Purpose | When to Use |
|------|------|---------|-------------|
| [a11y.instructions.md](./a11y.instructions.md) | 27.8KB | Accessibility standards for block plugins (WCAG 2.2 AA) | When developing block controls, editor UX, or block output |
| [i18n.instructions.md](./i18n.instructions.md) | 550 bytes | Internationalisation guidelines | When adding translatable strings |
| [scf-fields.instructions.md](./scf-fields.instructions.md) | 19.8KB | Custom field development | When creating custom fields functionality |
| [community-standards.instructions.md](./community-standards.instructions.md) | ~10KB | Community health file standards | When maintaining community documentation |
| [coding-standards.instructions.md](./coding-standards.instructions.md) | ~15KB | Unified coding standards | When writing code across languages |
| [file-organisation.instructions.md](./file-organisation.instructions.md) | ~12KB | File and folder organisation rules | When organising project structure |

**Total Special Topics:** 6 files (~84KB)

---

## 📊 File Statistics

### Current Summary (2025-12-15)

| Metric | Count | Size |
|--------|-------|------|
| **Total Files** | 27 files | ~535KB |
| **WordPress WPCS Files** | 7 files | ~174KB |
| **Block Development Files** | 4 files | ~82KB |
| **Automation & Agent Files** | 7 files | ~146KB |
| **Testing & QA Files** | 2 files | ~13KB |
| **Plugin Scaffolding Files** | 2 files | ~24KB |
| **Project Organisation Files** | 3 files | ~29KB |
| **Special Topics Files** | 6 files | ~84KB |

### Recent Changes (2025-12-15)

**Added 4 New Automation Files:**

1. `metrics.instructions.md` (13KB) — Metrics collection and reporting
2. `planner.instructions.md` (14KB) — PR planning and checklists
3. `project-meta-sync.instructions.md` (17KB) — Project board synchronisation
4. `release.instructions.md` (20KB) — Release management standards

**Total Addition:** +64KB of agent infrastructure documentation

### Previous Consolidation Summary (2025-12-10)

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| **Total Files** | 28 files | 19 files | **-32% (9 files removed)** |
| **Total Size** | ~450KB | ~389KB | **-14% (~61KB reduced)** |
| **Block Dev Files** | 6 files | 4 files | -33% |
| **Duplicate Content** | ~80KB | 0KB | -100% |

### Files Eliminated (9 files)

✅ **Deleted:**

1. `block-plugin-development.instructions.md` → merged into `blocks-development.instructions.md`
2. `blocks.instructions.md` → merged into `blocks-development.instructions.md`
3. `patterns.instructions.md` → merged into `patterns-and-templates.instructions.md`
4. `pattern-development.instructions.md` → merged into `patterns-and-templates.instructions.md`
5. `javascript-react.instructions.md` → merged into `javascript-react-development.instructions.md`
6. `js-react.instructions.md` → merged into `javascript-react-development.instructions.md`
7. `playwright.instructions.md` → merged into `testing-e2e.instructions.md`
8. `playwright-typescript.instructions.md` → renamed to `testing-e2e.instructions.md`
9. `wp-security.instructions.md` → redundant (covered by `security.instructions.md`)

✅ **Renamed:**

1. `block-plugin.instructions.md` → `scaffold-extensions.instructions.md` (clearer purpose)

---

## 🔗 Cross-Reference Map

### Block Development Workflow

```
Start: blocks-development.instructions.md
  ├─→ block-json.instructions.md (block metadata)
  ├─→ javascript-react-development.instructions.md (React patterns)
  ├─→ patterns-and-templates.instructions.md (patterns)
  ├─→ wpcs-php.instructions.md (PHP standards)
  ├─→ wpcs-javascript.instructions.md (JS standards)
  ├─→ wpcs-accessibility.instructions.md (a11y)
  ├─→ security.instructions.md (security)
  └─→ testing-e2e.instructions.md (testing)
```

### New Plugin Workflow

```
Start: generate-plugin.instructions.md
  ├─→ scaffold-extensions.instructions.md (extend scaffold)
  ├─→ folder-structure.instructions.md (organize files)
  ├─→ blocks-development.instructions.md (add blocks)
  └─→ patterns-and-templates.instructions.md (add patterns)
```

### Code Standards Workflow

```
PHP: wpcs-php.instructions.md → wpcs-php-docs.instructions.md
JS:  wpcs-javascript.instructions.md → wpcs-js-docs.instructions.md
CSS: wpcs-css.instructions.md
HTML: wpcs-html.instructions.md
A11y: wpcs-accessibility.instructions.md
```

---

## 🎨 File Purpose Matrix

### By Development Phase

| Phase | Files to Reference |
|-------|-------------------|
| **Planning** | folder-structure, generate-plugin |
| **Setup** | scaffold-extensions, generate-plugin |
| **Development** | blocks-development, block-json, javascript-react-development |
| **Styling** | wpcs-css, wpcs-html |
| **Testing** | testing-e2e, security |
| **Documentation** | wpcs-php-docs, wpcs-js-docs, reporting |
| **Accessibility** | a11y, wpcs-accessibility |
| **Internationalization** | i18n |

### By File Type

| File Type | Primary Instructions | Supporting Instructions |
|-----------|---------------------|------------------------|
| **PHP Files** | wpcs-php | wpcs-php-docs, security, blocks-development |
| **JavaScript/JSX** | wpcs-javascript, javascript-react-development | wpcs-js-docs, blocks-development |
| **CSS/SCSS** | wpcs-css | blocks-development |
| **HTML** | wpcs-html | wpcs-accessibility, blocks-development |
| **block.json** | block-json | blocks-development |
| **Patterns** | patterns-and-templates | blocks-development |

---

## 🔍 Finding the Right File

### Common Questions

**Q: How do I create a new block?**
→ Start with [blocks-development.instructions.md](./blocks-development.instructions.md)

**Q: What goes in block.json?**
→ See [block-json.instructions.md](./block-json.instructions.md)

**Q: How do I style my block?**
→ See [wpcs-css.instructions.md](./wpcs-css.instructions.md) and [blocks-development.instructions.md](./blocks-development.instructions.md#styling)

**Q: How do I make my block accessible?**
→ See [wpcs-accessibility.instructions.md](./wpcs-accessibility.instructions.md) and [a11y.instructions.md](./a11y.instructions.md)

**Q: How do I create a pattern?**
→ See [patterns-and-templates.instructions.md](./patterns-and-templates.instructions.md)

**Q: How do I test my block?**
→ See [testing-e2e.instructions.md](./testing-e2e.instructions.md)

**Q: How do I secure my block?**
→ See [security.instructions.md](./security.instructions.md)

**Q: What are the PHP coding standards?**
→ See [wpcs-php.instructions.md](./wpcs-php.instructions.md)

**Q: How do I document my code?**
→ See [wpcs-php-docs.instructions.md](./wpcs-php-docs.instructions.md) or [wpcs-js-docs.instructions.md](./wpcs-js-docs.instructions.md)

**Q: How do I generate a new plugin?**
→ See [generate-plugin.instructions.md](./generate-plugin.instructions.md)

**Q: How do I collect repository metrics?**
→ See [metrics.instructions.md](./metrics.instructions.md)

**Q: How do I prepare a release?**
→ See [release.instructions.md](./release.instructions.md)

**Q: How do I configure label automation?**
→ See [labeling.instructions.md](./labeling.instructions.md)

**Q: How do I sync GitHub Project boards?**
→ See [project-meta-sync.instructions.md](./project-meta-sync.instructions.md)

**Q: How do I create PR checklists?**
→ See [planner.instructions.md](./planner.instructions.md)

---

## 📝 Maintenance & Updates

### Updating This Index

When adding, removing, or significantly changing instruction files:

1. Update the file count and statistics
2. Add/remove entries in the appropriate category
3. Update cross-reference maps
4. Update file size estimates
5. Update the "Last Updated" date in frontmatter

### Requesting New Instructions

If you need new instruction files:

1. Check if existing files cover the topic
2. Consider if it should be merged into an existing file
3. Create a proposal in `.github/projects/active/`
4. Get team approval before creating

### Reporting Issues

Found an issue with an instruction file?

1. Note the file name and specific issue
2. Create an issue or discussion
3. Reference this index for context

---

## 🚀 Related Resources

### External References

- [WordPress Block Editor Handbook](https://developer.wordpress.org/block-editor/)
- [WordPress Coding Standards](https://developer.wordpress.org/coding-standards/)
- [WordPress Developer Resources](https://developer.wordpress.org/)
- [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)

### Internal Documentation

- [.github/reports/](../reports/) — Audit reports and analysis
- [.github/projects/active/](../projects/active/) — Active project task lists
- [.github/projects/completed/](../projects/completed/) — Completed project archives

---

## ⚠️ Important Notes

- **Protected Files:** All `wpcs-*` files are protected and should not be deleted or significantly reduced
- **Flat Structure:** All instruction files are in the same directory for easy discovery
- **Cross-References:** Many files reference each other — update references when renaming files
- **Version Control:** All file changes are tracked in git for rollback capability
- **Scope:** These instructions are for WordPress block plugin repositories only

---

## 📖 Alphabetical File List

<details>
<summary>Click to expand full alphabetical listing</summary>

1. [_index.instructions.md](./_index.instructions.md) — This file
2. [a11y.instructions.md](./a11y.instructions.md) — Accessibility standards
3. [automation.instructions.md](./automation.instructions.md) — Automation standards for agents and workflows
4. [block-json.instructions.md](./block-json.instructions.md) — Block.json reference
5. [blocks-development.instructions.md](./blocks-development.instructions.md) — Block development guide
6. [coding-standards.instructions.md](./coding-standards.instructions.md) — Unified coding standards
7. [community-standards.instructions.md](./community-standards.instructions.md) — Community health file standards
8. [file-organisation.instructions.md](./file-organisation.instructions.md) — File and folder organisation
9. [folder-structure.instructions.md](./folder-structure.instructions.md) — Project organisation
10. [generate-plugin.instructions.md](./generate-plugin.instructions.md) — Plugin generator
11. [i18n.instructions.md](./i18n.instructions.md) — Internationalisation
12. [javascript-react-development.instructions.md](./javascript-react-development.instructions.md) — React/JS patterns
13. [labeling.instructions.md](./labeling.instructions.md) — Unified labelling automation
14. [metrics.instructions.md](./metrics.instructions.md) — **NEW** Metrics collection and reporting
15. [patterns-and-templates.instructions.md](./patterns-and-templates.instructions.md) — Pattern development
16. [planner.instructions.md](./planner.instructions.md) — **NEW** PR planning and checklists
17. [project-meta-sync.instructions.md](./project-meta-sync.instructions.md) — **NEW** Project board synchronisation
18. [release.instructions.md](./release.instructions.md) — **NEW** Release management standards
19. [reporting.instructions.md](./reporting.instructions.md) — Reporting standards
20. [scaffold-extensions.instructions.md](./scaffold-extensions.instructions.md) — Scaffold extensions
21. [scf-fields.instructions.md](./scf-fields.instructions.md) — Custom fields
22. [schema-files.instructions.md](./schema-files.instructions.md) — Schema organisation
23. [security.instructions.md](./security.instructions.md) — Security best practices
24. [temp-files.instructions.md](./temp-files.instructions.md) — Temporary files
25. [testing-e2e.instructions.md](./testing-e2e.instructions.md) — E2E testing
26. [workflows.instructions.md](./workflows.instructions.md) — GitHub Actions workflow standards
27. [wpcs-accessibility.instructions.md](./wpcs-accessibility.instructions.md) — WPCS Accessibility
28. [wpcs-css.instructions.md](./wpcs-css.instructions.md) — WPCS CSS
29. [wpcs-html.instructions.md](./wpcs-html.instructions.md) — WPCS HTML
30. [wpcs-javascript.instructions.md](./wpcs-javascript.instructions.md) — WPCS JavaScript
31. [wpcs-js-docs.instructions.md](./wpcs-js-docs.instructions.md) — WPCS JS Docs
32. [wpcs-php.instructions.md](./wpcs-php.instructions.md) — WPCS PHP
33. [wpcs-php-docs.instructions.md](./wpcs-php-docs.instructions.md) — WPCS PHP Docs

</details>

---

**Last Updated:** 2025-12-15
**Recent Updates:** [.github/reports/agents/instruction-files-creation-2025-12-15.md](../reports/agents/instruction-files-creation-2025-12-15.md)
**Consolidation Report:** [.github/reports/instruction-consolidation-audit-2025-12-10.md](../reports/instruction-consolidation-audit-2025-12-10.md)
**Implementation Tasks:** [.github/projects/active/2025-12-10-instruction-consolidation.md](../projects/active/2025-12-10-instruction-consolidation.md)

## References

- [instructions.instructions.md](./instructions.instructions.md)
- [CONTRIBUTING.md](../../CONTRIBUTING.md)
- [README.md](../../README.md)
