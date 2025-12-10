# Projects Directory

This directory contains all task tracking files, project planning documents, implementation roadmaps, and progress tracking.

## Purpose

- Store all project planning and tracking files
- Centralize task lists and implementation plans
- Maintain organized project documentation

## Directory Structure

```
projects/
├── active/          # Current active projects and sprints
├── completed/       # Finished project archives
├── planning/        # Planning and scoping documents
└── ADR/             # Architecture Decision Records (optional)
```

### Subdirectory Purposes

**`active/`** - Current Active Projects

- Work-in-progress project files
- Active sprint plans and task tracking
- Current implementation roadmaps
- Files actively being updated and referenced
- Move files here when work begins

**`completed/`** - Finished Project Archives

- Completed project documentation for reference
- Archived task lists from finished initiatives
- Historical planning documents
- Successfully implemented project records
- Move files here when projects are fully complete

**When to Move Files:**

- **To `active/`**: When a project moves from planning to active development
- **To `completed/`**: When all tasks are done, PRs merged, and objectives achieved
- **Root level**: Use for cross-project files or files that span multiple phases

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

- Create all task tracking files in this directory
- Use descriptive project names
- Include frontmatter for metadata (created_date, status, etc.)
- Update files as work progresses
- Start new projects at root level or in `planning/`
- Move to `active/` when work begins
- Move completed projects to `completed/` subdirectory
- Add completion date to frontmatter when archiving

❌ **DON'T:**

- Create task files in repository root
- Create task files in `docs/` folder
- Create task files in `.github/agents/` or `.github/instructions/`
- Use generic names like `tasks.md` or `todo.md`

## Current Projects

- [context-reduction-tasks.md](./context-reduction-tasks.md) - Token optimization task tracking
- [instruction-consolidation-guide.md](./instruction-consolidation-guide.md) - File consolidation migration guide

## Related Documentation

- [File Output Organization Instructions](../instructions/file-output-organization.instructions.md)
- [Community Standards](../instructions/community-standards.instructions.md)
- [Roadmap](../../docs/ROADMAP.md)

---

*For questions about project file organization, see [file-output-organization.instructions.md](../instructions/file-output-organization.instructions.md)*
