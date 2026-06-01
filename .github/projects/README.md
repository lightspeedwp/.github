---
file_type: "documentation"
title: "Projects Directory"
description: "Task tracking files, project planning documents, implementation roadmaps, and progress tracking for active and completed projects."
version: "1.2"
last_updated: "2026-06-01"
owners: ["LightSpeed Engineering"]
tags: ["projects", "documentation", "governance"]
---

# Projects Directory

This directory contains all task tracking files, project planning documents, implementation roadmaps, and progress tracking.

## Purpose

Centralize and organise all project-related files, from early planning through completion. Each subdirectory serves a specific lifecycle phase.

## Directory Structure

```
.github/projects/
├── active/       # Current active projects and ongoing work
├── archived/     # Archived projects and historical records
├── completed/    # Finished projects ready for reference
└── PLANNING_TEMPLATE.md  # Template for starting new projects
```

## Subdirectory Purposes

### `active/` – Current Active Projects

- Work-in-progress project files
- Active sprint plans and task tracking
- Current implementation roadmaps
- Files actively being updated and referenced
- **Move files here** when a project transitions from planning to active development

### `completed/` – Finished Project Archives

- Completed project documentation for reference
- Archived task lists from finished initiatives
- Historical planning documents
- Successfully implemented project records
- **Move files here** when all tasks are done, PRs merged, and objectives achieved

### `archived/` – Long-term Archives

- Projects superseded by newer initiatives
- Deprecated planning documents
- Historical reference materials
- Files preserved for audit trails

## File Naming Convention

Use descriptive project names with type indicators:

```
{project-name}-{type}.md
```

Examples:

- `context-reduction-tasks.md`
- `instruction-consolidation-guide.md`
- `labeling-system-roadmap.md`
- `phase-6-planning.md`

## Guidelines

✅ **DO:**

- Create all project tracking files in this directory
- Use descriptive project names
- Include frontmatter for metadata (created_date, status, owners, etc.)
- Update files as work progresses
- Start new projects at the root level of `.github/projects/`
- Move to `active/` when work begins
- Move completed projects to `completed/` when finished
- Add completion date to frontmatter when archiving

❌ **DON'T:**

- Create project files in repository root
- Create project files in `docs/` folder
- Create project files in `.github/agents/` or `.github/instructions/`
- Use generic names like `tasks.md` or `todo.md`
- Leave projects in `active/` after completion

## Current Projects

- [context-reduction-tasks.md](./context-reduction-tasks.md) – Token optimisation task tracking
- [instruction-consolidation-guide.md](./instruction-consolidation-guide.md) – File consolidation migration guide
- [PLANNING_TEMPLATE.md](./PLANNING_TEMPLATE.md) – Template for new project planning

## Related Documentation

- [File Organisation Instructions](../instructions/file-organisation.instructions.md)
- [Community Standards](../instructions/community-standards.instructions.md)
- [Roadmap](../../docs/ROADMAP.md)

---

*For questions about project file organisation, see [file-organisation.instructions.md](../instructions/file-organisation.instructions.md)*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*
