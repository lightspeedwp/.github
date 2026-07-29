---
title: "Projects Directory"
description: "Project planning documents, task tracking files, implementation roadmaps, and progress tracking for LightSpeed initiatives. Includes active projects, completed archives, and planning documents."
file_type: documentation
version: v1.1
last_updated: "2026-07-29"
created_date: "2025-12-08"
authors: ["LightSpeed Team"]
maintainer: "LightSpeed Team"
license: "GPL-3.0"
tags: ["projects", "planning", "tracking", "governance", "documentation"]
domain: "governance"
stability: "stable"
---

# Projects Directory

This directory contains all task tracking files, project planning documents, implementation roadmaps, and progress tracking for LightSpeed initiatives.

## Purpose

- Store all project planning and tracking files
- Centralize task lists and implementation plans
- Maintain organized project documentation
- Track active, in-progress, and completed projects

## Directory Structure

```
.github/projects/
├── active/          # Current active projects and work-in-progress
└── archived/        # Completed and inactive projects
```

## Subdirectory Purposes

## Active Projects Status Update (2026-07-29)

- Phase 2B Skills Audit Phase C issue hygiene updates were completed for #1326-#1355.
- Issue titles, task-template structure (including DoR/DoD), and ready-state labels were normalised.
- Active task tracking docs were synchronised in `projects/active/phase-2b-skills-audit/`.

### active/

**Current Active Projects**

- Work-in-progress project files
- Active sprint plans and task tracking
- Current implementation roadmaps
- Files actively being updated and referenced
- **When to move here:** When a project moves from planning to active development

### archived/

**Finished and Inactive Projects**

- Completed project documentation for reference
- Archived task lists from finished initiatives
- Historical planning documents
- Successfully implemented project records
- **When to move here:** When all tasks are done, PRs merged, and objectives achieved

## File Naming Convention

Use descriptive project names:

```
{project-name}-{type}.md

Examples:
context-reduction-tasks.md
instruction-consolidation-guide.md
labeling-system-roadmap.md
phase6-planning-suite-consolidation.md
```

## Guidelines

✅ **DO:**

- Create all project tracking files in this directory or appropriate subdirectory
- Use descriptive project names
- Include frontmatter for metadata (created_date, status, owner, etc.)
- Update files as work progresses
- Create new projects directly in `active/` subdirectory
- Move completed projects to `archived/` subdirectory
- Add completion date to frontmatter when archiving

❌ **DON'T:**

- Create project files in repository root
- Create project files in `docs/` folder
- Create project files in `.github/agents/` or `.github/instructions/`
- Use generic names like `tasks.md` or `todo.md`

## Related Documentation

- [File Organisation Instructions](../instructions/file-organisation.instructions.md)
- [Community Standards](../instructions/community-standards.instructions.md)
- [Reports Directory](../reports/README.md) — Generated reports and audit outputs
- [Roadmap](../../docs/ROADMAP.md)

---

*For questions about project file organisation, see [file-organisation.instructions.md](../instructions/file-organisation.instructions.md)*

*This directory is managed by project teams. Please follow the guidelines when creating new project tracking files.*
