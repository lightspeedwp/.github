---
title: "Main Agent Index"
version: "v1.2"
last_updated: "2025-10-20"
author: "LightSpeed"
maintainer: "Ash Shaw"
description: "Directory index referencing all agents, instructions, PR templates, and cross-references."
tags: ["lightspeed","templates","copilot","agents","prompts","models"]
type: "agent"
---

# LightSpeed Agent Index

This document serves as the master index for all agent specifications, templates, and usage guides for LightSpeed projects.

> **Label Reference:**
> Agents, agent specs, and agent-related issues should use or reference the label:
>
> - `ai-ops:agents` (for agent definitions and specs)
> - `ai-ops:chat-modes` (for chatmode-related agents)
> - `ai-ops:prompts` (for prompt agents or reusable prompt logic)
> - `ai-ops:instructions` (for instructions or cross-references)
> See [frontmatter schema](../schemas/frontmatter.schema.json) for canonical frontmatter requirements.

## Purpose

- Link all agent specs and stubs.
- Reference key instruction indexes for Copilot and workflow guidance.
- Ensure agents follow org-wide standards for clarity, security, and maintainability.

---

## Dynamic Agent File Index

All agent specs, templates, and stubs should be placed in the `.github/agents/` directory. Reference or add new agent files here:

| Agent File                                                     | Purpose / Notes                              |
|---------------------------------------------------------------|----------------------------------------------|
| [agent.md](./agent.md)                                        | Main index and directory for all agents      |
| [template.agent.md](./template.agent.md)                       | Markdown template for new agents             |
| [template.agent.js](./template.agent.js)                       | JS template for new agent implementations    |
| [template.agent.py](./template.agent.py)                       | Python template for new agent implementations|
| [template.agent.sh](./template.agent.sh)                       | Shell script template for agent integrations |
| [branding.agent.js](./branding.agent.js)                      | Unified branding agent: header, footer, badges|
| [branding.agent.md](./branding.agent.md)                      | Spec for unified branding agent               |
| *(Add additional agent files below as needed)*                 |                                              |

> *To add new agents, create a file in `.github/agents/` and update this table. Use descriptive filenames and provide a brief purpose/notes column for each._

---

## Key Indexes & Contribution Guidelines

| Area                      | Reference                                                                 | Notes / Usage                           |
|---------------------------|---------------------------------------------------------------------------|-----------------------------------------|
| **Custom Instructions**   | [../custom-instructions.md](../custom-instructions.md)                    | Central Copilot/org standards           |
| **Global AI Rules**       | [../../AGENTS.md](../../AGENTS.md)                                        | Org-wide AI and coding rules            |
| **Coding Standards**      | [../instructions/coding-standards.instructions.md](../instructions/coding-standards.instructions.md) | Unified standards for all code          |
| **Linting Standards**     | [../instructions/linting.instructions.md](../instructions/linting.instructions.md) | Main index for all linting rules        |
| **PR Templates**          | [../PULL_REQUEST_TEMPLATE.md](../PULL_REQUEST_TEMPLATE.md)                | Default PR template                     |
| **All PR Templates**      | [../PULL_REQUEST_TEMPLATES/](../PULL_REQUEST_TEMPLATES/)                  | Directory containing additional PR templates |

---

## Discoverability & Workflow Integration

| Resource Name           | Reference                                   | Purpose / Notes                           |
|------------------------|----------------------------------------------|-------------------------------------------|
| **Main Agent Index**    | [agent.md](./agent.md)                      | Directory of agent specs and usage        |
| **Chat Modes Index**    | [../chatmodes/chatmodes.md](../chatmodes/chatmodes.md) | List and guidance for chat modes          |
| **Prompts Index**       | [../prompts/prompts.md](../prompts/prompts.md) | Master prompt index and conventions       |

---

## Usage

- Keep agent specs and templates close to code for maintainability.
- Reference all relevant standards and workflow documents above.
- Update this index whenever new agent files or templates are added.

---

> For up-to-date standards, always start with the main indexes above.
> For new agent work, fork an existing template and document its purpose in this directory.
