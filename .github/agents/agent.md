---
title: "Main Agent Index"
version: "v2.0"
last_updated: "2025-12-07"
author: "LightSpeed"
maintainer: "Ash Shaw"
description: "Directory index referencing all agents, instructions, PR templates, and cross-references."
tags: ["lightspeed", "templates", "copilot", "agents", "prompts", "models"]
file_type: "agent-index"
---

# LightSpeed Agent Index

This document serves as the master index for all agent specifications, templates, and usage guides for LightSpeed projects.

> **Label Reference:**
> Agents, agent specs, and agent-related issues should use or reference the label:
>
> - `ai-ops:agents` (for agent definitions and specs)
> - `ai-ops:prompts` (for prompt agents or reusable prompt logic)
> - `ai-ops:instructions` (for instructions or cross-references)
>
> See [frontmatter schema](../../schemas/frontmatter.schema.json) for canonical frontmatter requirements.

## Purpose

- Link all agent specs and stubs.
- Reference key instruction indexes for Copilot and workflow guidance.
- Ensure agents follow org-wide standards for clarity, security, and maintainability.
- All agents must adhere to the global rules defined in [`AGENTS.md`](../../AGENTS.md).

---

## Agent File Index

All agent specs are in the `.github/agents/` directory:

- [`*.agent.md`](./) — All Markdown files ending with `.agent.md` are considered reusable agents for Copilot Chat, GitHub Actions, and agent workflows.

## Discoverability & Workflow Integration

| Resource Name           | Reference                                                    | Purpose / Notes                                  |
| ----------------------- | ------------------------------------------------------------ | ------------------------------------------------ |
| **Main Agent Index**    | [agent.md](./agent.md)                                       | Directory of agent specs and usage               |
| **Instructions Index**  | [../instructions/_index.instructions.md](../instructions/_index.instructions.md) | Master index of all instruction files            |
| **Global AI Rules**     | ../../AGENTS.md                                              | Organisation-wide AI agent rules                 |
| **Prompts Index**       | [../prompts/prompts.md](../prompts/prompts.md)               | Master prompt index and conventions              |
| **Automation Standards**| [../instructions/automation.instructions.md](../instructions/automation.instructions.md) | Comprehensive automation standards for agents    |

---

## Agent Instruction Files

The following instruction files provide detailed standards for agent development and automation:

| Instruction File | Purpose | Agent(s) |
|-----------------|---------|----------|
| [automation.instructions.md](../instructions/automation.instructions.md) | Comprehensive automation standards for agents, workflows, and repository health | All agents |
| [labeling.instructions.md](../instructions/labeling.instructions.md) | Unified labelling automation system (config-driven) | labeling.agent.md |
| [metrics.instructions.md](../instructions/metrics.instructions.md) | Metrics collection, aggregation, and reporting standards | metrics.agent.md |
| [planner.instructions.md](../instructions/planner.instructions.md) | PR planning, checklist generation, and merge readiness validation | planner.agent.md (to be created) |
| [project-meta-sync.instructions.md](../instructions/project-meta-sync.instructions.md) | GitHub Project board field synchronisation from labels | project-meta-sync.agent.md |
| [release.instructions.md](../instructions/release.instructions.md) | Release management, semantic versioning, and changelog compliance | release.agent.md |
| [workflows.instructions.md](../instructions/workflows.instructions.md) | GitHub Actions workflow standards and patterns | All workflow files |
| [reporting.instructions.md](../instructions/reporting.instructions.md) | Report generation, storage, and formatting standards | All agents that generate reports |

---

## Usage

- Keep agent specs and templates close to code for maintainability.
- Reference all relevant standards and workflow documents above.
- Update this index whenever new agent files or templates are added.
- Always consult the corresponding instruction file before implementing or modifying an agent.

---

> For up-to-date standards, always start with the main indexes above.
> For new agent work, fork an existing template and document its purpose in this directory.
