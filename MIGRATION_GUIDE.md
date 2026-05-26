---
title: "Instruction Consolidation Migration Guide (v2.0)"
description: "Migration guide for 22 instruction files → 5 consolidated instruction files. Maps old files to new sections."
version: "1.0"
created_date: "2025-12-07"
last_updated: "2025-12-07"
authors: ["LightSpeed Team"]
status: "active"
---

# Instruction Consolidation Migration Guide

**Migration Date:** December 7, 2025
**Impact:** 22 instruction files → 5 consolidated files (77% reduction)

---

## Overview

This guide maps the old, fragmented instruction structure to the new consolidated organization. Use this to find where content has moved and update any cross-references.

---

## Consolidation Map

### 1. **LANGUAGES & LINTING** → `instructions/languages.instructions.md`

**Old Files (4):**

| Old File                     | New Section                      | Status       |
| ---------------------------- | -------------------------------- | ------------ |
| `javascript.instructions.md` | §2 JavaScript/TypeScript Linting | Consolidated |
| `jsdoc.instructions.md`      | §2.1 JSDoc Standards             | Consolidated |
| `json.instructions.md`       | §2.2 JSON Schemas                | Consolidated |
| `yaml.instructions.md`       | §2.3 YAML Linting                | Consolidated |

**Direct Cross-References:** Update any links from:

```markdown
# OLD

[JavaScript Linting](.github/instructions/javascript.instructions.md)

# NEW

[JavaScript Linting](instructions/languages.instructions.md#javascript--typescript-linting)
```

**Related Files Updated:**

- `linting.instructions.md` - Points to new location
- `README.md` - Documentation updated

---

### 2. **DOCUMENTATION FORMATS** → `instructions/documentation-formats.instructions.md`

**Old Files (3):**

| Old File                      | New Section           | Status       |
| ----------------------------- | --------------------- | ------------ |
| `markdown.instructions.md`    | §3 Markdown Standards | Consolidated |
| `frontmatter.instructions.md` | §3.1 YAML Frontmatter | Consolidated |
| `mermaid.instructions.md`     | §3.2 Mermaid Diagrams | Consolidated |

**Direct Cross-References:** Update any links from:

```markdown
# OLD

[Markdown Standards](.github/instructions/markdown.instructions.md)

# NEW

[Markdown Standards](instructions/documentation-formats.instructions.md#markdown-standards)
```

---

### 3. **QUALITY ASSURANCE & TESTING** → `instructions/quality-assurance.instructions.md`

**Old Files (3):**

| Old File                  | New Section             | Status       |
| ------------------------- | ----------------------- | ------------ |
| `testing.instructions.md` | §4 Testing Strategy     | Consolidated |
| `tests.instructions.md`   | §4.1 Test Standards     | Consolidated |
| `jest.instructions.md`    | §4.2 Jest Configuration | Consolidated |

**Direct Cross-References:** Update any links from:

```markdown
# OLD

[Testing Guide](.github/instructions/testing.instructions.md)

# NEW

[Testing Guide](instructions/quality-assurance.instructions.md#testing-pyramid)
```

---

### 4. **AUTOMATION & WORKFLOWS** → `instructions/automation.instructions.md`

**Old Files (8):**

| Old File                            | New Section                 | Status       |
| ----------------------------------- | --------------------------- | ------------ |
| `agents.instructions.md`            | §5.1 Agent Development      | Consolidated |
| `branding.instructions.md`          | §5.2 Documentation Branding | Consolidated |
| `metrics.instructions.md`           | §5.3 Metrics Collection     | Consolidated |
| `planner.instructions.md`           | §5.4 Planning Automation    | Consolidated |
| `project-meta-sync.instructions.md` | §5.5 Project Sync           | Consolidated |
| `release.instructions.md`           | §5.6 Release Management     | Consolidated |
| `reporting.instructions.md`         | §5.7 Report Generation      | Consolidated |
| `reviewer.instructions.md`          | §5.8 PR Review Automation   | Consolidated |

**Direct Cross-References:** Update any links from:

```markdown
# OLD

[Release Management](instructions/release.instructions.md)

# NEW

[Release Management](instructions/automation.instructions.md#56-release-management)
```

**Critical Files Affected:**

- `.github/workflows/release.yml` - References release instructions
- `agents/release.agent.md` - References release instructions
- `.github/workflows/labeling.yml` - References labeling instructions
- `agents/labeling.agent.md` - References labeling instructions

---

### 5. **COMMUNITY STANDARDS & GOVERNANCE** → `instructions/community-standards.instructions.md`

**Old Files (4):**

| Old File                             | New Section             | Status       |
| ------------------------------------ | ----------------------- | ------------ |
| `file-management.instructions.md`    | §6.1 File Organization  | Consolidated |
| `naming-conventions.instructions.md` | §6.2 Naming Conventions | Consolidated |
| `readme.instructions.md`             | §6.3 README Standards   | Consolidated |
| `saved-replies.instructions.md`      | §6.4 Saved Replies      | Consolidated |

**Direct Cross-References:** Update any links from:

```markdown
# OLD

[Naming Conventions](.github/instructions/naming-conventions.instructions.md)

# NEW

[Naming Conventions](instructions/community-standards.instructions.md#62-naming-conventions)
```

---

## Files Still Consolidated But Not Deleted

The following instruction files remain separate (not consolidated into the 5 main files):

- `a11y.instructions.md` - Accessibility specific guidance
- `coding-standards.instructions.md` - Core coding standards (umbrella)
- `custom-instructions.md` - Copilot-specific instructions
- `instructions.instructions.md` - How to write instruction files
- `linting.instructions.md` - Master linting index
- `prompt.instructions.md` - How to write prompt files
- `self-explanatory-code-commenting.instructions.md` - Code commenting guidelines
- `spec-driven-workflow.instructions.md` - Development methodology
- `taming-copilot.instructions.md` - Copilot behavior guidelines
- `tasksync.instructions.md` - TaskSync protocol
- `copilot-thought-logging.instructions.md` - Copilot processing tracking
- `pull-requests.instructions.md` - PR-specific guidance
- `issues.instructions.md` - Issue-specific guidance
- `task-implementation.instructions.md` - Task implementation tracking
- `tools.instructions.md` - AI Toolkit guidance
- `workflows.instructions.md` - GitHub Actions best practices

---

## Files Archived

The 22 old instruction files have been moved to `.github/instructions/.archive/`:

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

---

## How to Find Old Content

**If you remember the OLD filename:**

1. Check the Consolidation Map above to find the new file
2. Search for section markers (§1, §2, etc.) or use Ctrl+F to find specific content
3. Update any links to use the new file path

**If you remember the TOPIC:**

1. Browse the 5 new consolidated files:
   - `languages.instructions.md` - Linting, code standards
   - `documentation-formats.instructions.md` - Markdown, docs
   - `quality-assurance.instructions.md` - Testing, coverage
   - `automation.instructions.md` - Agents, workflows, release
   - `community-standards.instructions.md` - Organization, governance

2. Use Ctrl+F to search within the consolidated file

---

## Search & Replace Examples

### JavaScript/TypeScript Linting References

```bash
# OLD pattern
find . -name "*.md" -exec grep -l "javascript.instructions.md" {} \;

# REPLACE with
languages.instructions.md#javascript--typescript-linting
```

### Testing References

```bash
# OLD pattern
find . -name "*.md" -exec grep -l "testing.instructions.md\|tests.instructions.md\|jest.instructions.md" {} \;

# REPLACE with
quality-assurance.instructions.md#testing-pyramid
```

### Release Management References

```bash
# OLD pattern
find . -name "*.md" -exec grep -l "release.instructions.md" {} \;

# REPLACE with
automation.instructions.md#56-release-management
```

---

## Updated References in This Repository

The following files have been pre-updated to reference the new consolidated files:

✅ `.github/README.md` - Updated with new structure
✅ `AGENTS.md` - References to new locations
✅ `DOCS.md` - Updated index
✅ `docs/README.md` - Updated documentation structure
✅ `instructions/linting.instructions.md` - References consolidated files
✅ `agents/agent.md` - Updated references
✅ `.github/custom-instructions.md` - Updated references

---

## Guidelines for External References

If you're referencing these instructions from:

- **GitHub Discussions/Issues**: Use the new consolidated file paths
- **Workflow Files**: Update `references:` sections in YAML frontmatter
- **Copilot Instructions**: Update `custom-instructions.md` references
- **Agent Specs**: Update `references:` in agent frontmatter

---

## Rollback (If Needed)

All old instruction files are preserved in `.github/instructions/.archive/`. To restore:

```bash
# Restore a single file
mv .github/instructions/.archive/javascript.instructions.md .github/instructions/

# Restore all
cp -r .github/instructions/.archive/* .github/instructions/
```

---

## Questions?

- See [docs/README.md](./docs/README.md) for documentation architecture
- Check [`README.md`](./.github/README.md) for community health files
- Review [`coding-standards.instructions.md`](instructions/coding-standards.instructions.md) for coding rules

---

**Version History:**

| Date       | Changes                                                        |
| ---------- | -------------------------------------------------------------- |
| 2025-12-07 | Initial migration guide created. 22 files consolidated into 5. |

---

*This migration improves maintainability by consolidating related topics. All content is preserved; only organization has changed.*

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)
