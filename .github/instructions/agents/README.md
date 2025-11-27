---
title: "Agent-Specific Instructions"
description: "Comprehensive instructions for individual GitHub automation agents in LightSpeedWP projects."
version: "v1.0"
last_updated: "2025-11-24"
file_type: "documentation"
owners: ["lightspeedwp/maintainers"]
tags: ["agents", "instructions", "automation"]
---

# Agent-Specific Instructions Directory

This folder contains detailed instructions for each automation agent used across LightSpeed projects. Each agent has its own specification file describing its purpose, capabilities, and usage guidelines.

## Agent Instructions Files

| Agent                 | File                                | Purpose                                                       |
| --------------------- | ----------------------------------- | ------------------------------------------------------------- |
| **Labeling**          | `labeling.instructions.md`          | Automated label application, enforcement, and standardization |
| **Reviewer**          | `reviewer.instructions.md`          | Automated PR review summaries and CI status checks            |
| **Planner**           | `planner.instructions.md`           | PR merge readiness checklists and exit criteria               |
| **Release**           | `release.instructions.md`           | Release validation, versioning, tagging, and publication      |
| **Project Meta Sync** | `project-meta-sync.instructions.md` | GitHub Project board field synchronization                    |
| **Linting**           | `linting.instructions.md`           | Code quality enforcement and linting standards                |
| **JSDoc Review**      | `jsdoc-review.instructions.md`      | JavaScript/TypeScript documentation auditing                  |
| **Manage READMEs**    | `manage-readmes.instructions.md`    | README creation and maintenance automation                    |
| **Metrics**           | `metrics.instructions.md`           | Repository health metrics collection and reporting            |
| **Branding**          | `badges.instructions.md`            | Badge, header, and footer management                          |
| **Header/Footer**     | `header-footer.instructions.md`     | Documentation header and footer automation                    |

## Structure

Each instruction file follows a standardized format:

- **Mission** - Core responsibility of the agent
- **Process** - Step-by-step execution flow
- **What It Checks** - Validation criteria and audit scope
- **Best Practices** - Recommended patterns and conventions
- **Guardrails** - Safety constraints and limitations
- **Outputs** - Expected results and deliverables
- **References** - Links to related specifications and documentation

## Quick Reference

### Core Automation Agents

- **Labeling Agent** - Unified system for issue/PR labels, status enforcement, and standardization
- **Reviewer Agent** - Automated review comments with CI status and recommendations
- **Planner Agent** - Merge readiness checklists and exit criteria tracking

### Quality & Validation Agents

- **Linting Agent** - Multi-language code quality enforcement
- **JSDoc Review Agent** - JavaScript/TypeScript documentation validation

### Release & Project Management

- **Release Agent** - Automated release validation, versioning, and publication
- **Project Meta Sync Agent** - GitHub Projects field synchronization

### Documentation Agents

- **Manage READMEs Agent** - Automated README discovery and maintenance
- **Branding Agent** - Unified header, footer, and badge management

### Monitoring & Analytics

- **Metrics Agent** - Repository health and performance analytics

## For New Agents

When creating a new agent:

1. Create a corresponding `.instructions.md` file in this directory
2. Follow the standardized format above
3. Include clear mission statement and responsibility scope
4. Document all validation criteria and guardrails
5. Link to related agent specifications and workflows
6. Add entry to the table above

## Integration

These agent instructions are referenced by:

- `.github/agents/` - Agent implementation files
- `.github/workflows/` - Automated workflows that trigger agents
- `.github/custom-instructions.md` - Organization-wide Copilot settings
- `.github/AGENTS.md` - Global AI rules and agent directory

## Related Resources

- **Agent Specs**: `.github/agents/*.agent.md` - Technical specifications
- **Workflows**: `.github/workflows/` - GitHub Actions that execute agents
- **Coding Standards**: `.github/instructions/coding-standards.instructions.md`
- **Automation Governance**: `.github/AUTOMATION_GOVERNANCE.md`

---

For questions or updates, reference the main [AGENTS.md](../../AGENTS.md) or open a discussion in the repository.
