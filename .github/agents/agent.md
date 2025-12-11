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

| Resource Name        | Reference                                      | Purpose / Notes                     |
| -------------------- | ---------------------------------------------- | ----------------------------------- |
| **Main Agent Index** | [agent.md](./agent.md)                         | Directory of agent specs and usage  |
| **Global AI Rules**  | ../../AGENTS.md             | Organisation-wide AI agent rules    |
| **Prompts Index**    | [../prompts/prompts.md](../prompts/prompts.md) | Master prompt index and conventions |

---

## Usage

- Keep agent specs and templates close to code for maintainability.
- Reference all relevant standards and workflow documents above.
- Update this index whenever new agent files or templates are added.

---

> For up-to-date standards, always start with the main indexes above.
> For new agent work, fork an existing template and document its purpose in this directory.
