---
file_type: "documentation"
title: "Reports Directory"
description: "An overview of the reports directory, detailing the purpose of each subfolder for storing generated artifacts."
version: "1.0"
last_updated: "2025-12-08"
owners: ["LightSpeed Engineering"]
tags: ["reports", "documentation", "governance"]
---
# Projects Directory

This directory contains all task tracking files, project planning documents, implementation roadmaps, and progress tracking.

# 📂 Reports Directory

## Purpose

This directory stores all automated and manually generated reports. Each subfolder is dedicated to a specific category of report to ensure clear organization and easy retrieval of information.

- Store all project planning and tracking files
- Centralize task lists and implementation plans
- Maintain organized project documentation
For detailed guidelines on report generation, naming conventions, and storage, please refer to the [**Reporting Instructions**](../instructions/reporting.instructions.md).

## Directory Structure

## Report Categories

```
projects/
├── active/          # Current active projects and sprints
├── completed/       # Finished project archives
├── planning/        # Planning and scoping documents
└── ADR/             # Architecture Decision Records (optional)
```

The following diagram and table provide an overview of the available report categories and their intended purpose.

### Subdirectory Purposes

```mermaid
graph TD
    A[📂 .github/reports] --> B[🤖 Agents]
    A --> C[🔬 Analysis]
    A --> D[🛡️ Audits]
    A --> E[📊 Coverage]
    A --> F[📄 Frontmatter]
    A --> G[🚀 Implementation]
    A --> H[📈 Issue Metrics]
    A --> I[🏷️ Labeling]
    A --> J[🧹 Linting]
    A --> K[✨ Meta]
    A --> L[📈 Metrics]
    A --> M[🚚 Migration]
    A --> N[⚡ Optimisation]
    A --> O[🛠️ Tech Debt]
    A --> P[✅ Validation]

**`active/`** - Current Active Projects
    subgraph "Report Categories"
        B
        C
        D
        E
        F
        G
        H
        I
        J
        K
        L
        M
        N
        O
        P
    end

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

    style A fill:#e1f5fe,stroke:#333,stroke-width:2px
```

{project-name}-{type}.md

Examples:
context-reduction-tasks.md
instruction-consolidation-guide.md
labeling-system-roadmap.md
phase6-planning-suite-consolidation.md

```
| Category | Purpose |
| :--- | :--- |
| **/agents** | Logs and outputs from AI agent executions. |
| **/analysis** | In-depth analysis of code, architecture, or processes. |
| **/audits** | One-time audit reports for security, accessibility, or compliance. |
| **/coverage** | Code coverage reports generated from test runs. |
| **/frontmatter** | Reports from frontmatter validation and audit scripts. |
| **/implementation** | Tracking reports for the implementation of features or epics. |
| **/issue-metrics** | Metrics related to GitHub issues (e.g., time to close, label distribution). |
| **/labeling** | Reports from the automated labeling agent. |
| **/linting** | Reports from code linters (ESLint, Stylelint, etc.). |
| **/meta** | Reports from the meta agent, which manages badges, footers, and other metadata. |
| **/metrics** | General repository and developer workflow metrics. |
| **/migration** | Reports related to data, schema, or platform migrations. |
| **/optimisation** | Reports on performance and resource optimisation efforts. |
| **/tech-debt** | Reports tracking identified technical debt. |
| **/validation** | Reports from validation scripts (e.g., schema validation, link checking). |

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

- [File Organisation Instructions](../instructions/file-organisation.instructions.md)
- [Community Standards](../instructions/community-standards.instructions.md)
- [Roadmap](../../docs/ROADMAP.md)

---

*For questions about project file organisation, see [file-organisation.instructions.md](../instructions/file-organisation.instructions.md)*
*This directory is managed by automated workflows. Please do not add files manually unless specified by the reporting instructions.*
