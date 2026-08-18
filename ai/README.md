---
file_type: "documentation"
title: "Canonical AI Operations Assets"
description: "Central repository for canonical AI agent references and organization-wide AI configuration"
status: "active"
last_updated: "2026-06-01"
domain: governance
---

# Canonical AI Operations Assets

This directory contains canonical AI references and configuration files for the LightSpeed organization. These files define how Claude, Gemini, and other AI systems integrate with our repositories and workflows.

## Contents

### AI Agent References

| File | Purpose | Scope |
|------|---------|-------|
| **Claude.md** | Claude AI agent configuration and integration guidelines | LightSpeed-wide |
| **Gemini.md** | Google Gemini AI agent configuration and integration guidelines | LightSpeed-wide |
| **RUNNERS.md** | Agent runner configurations and execution specifications | LightSpeed-wide |
| **agents.md** | Index and overview of all AI agents in use | LightSpeed-wide |

### Audit & Planning Documents

| File | Purpose | Updated |
|------|---------|---------|
| **AUDIT-SUMMARY.md** | Summary of AI operations audit findings | 2026-05-31 |
| **audit-planner-reviewer-agents.md** | Detailed audit of planner and reviewer agents | 2026-05-31 |
| **improvement-plan-planner-reviewer.md** | Improvement plan for planner and reviewer agents | 2026-05-31 |

## How to Use This Directory

### Configuring AI Agents

1. Start with **Claude.md**, **Gemini.md**, or **RUNNERS.md** depending on your AI system
2. Reference **agents.md** for a complete overview of available agents
3. Configure your agent using the guidelines in the appropriate file

### Understanding AI Operations

1. Review **AUDIT-SUMMARY.md** for recent findings and recommendations
2. Check **audit-planner-reviewer-agents.md** for specific agent audits
3. See **improvement-plan-planner-reviewer.md** for planned enhancements

## Integration Points

The canonical AI references in this folder are used by:

- **CLAUDE.md** (repo root) — References `ai/Claude.md`, `ai/Gemini.md`, `ai/RUNNERS.md`
- **.github/agents/** — Agent specifications may reference this folder
- **Workflow automation** — CI/CD workflows load AI configuration from here

## Scope & Visibility

- **Scope:** Organization-wide (reusable across all LightSpeedWP repositories)
- **Visibility:** Public (part of the `.github` template repository)
- **Maintenance:** Platform/DevOps team

## Related Files

- **[CLAUDE.md](../CLAUDE.md)** (repo root) — Primary reference for AI instructions and repository boundaries
- **[AGENTS.md](../AGENTS.md)** (repo root) — Full organization-wide AI rules and guidelines
- **[.github/custom-instructions.md](../.github/custom-instructions.md)** — Repo-local Copilot instructions
- **[agents/](../agents/)** — Portable agent specifications

---

**Directory Status:** Active
**Last Updated:** 2026-05-31
**Curator:** LightSpeedWP Platform Team

## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.
