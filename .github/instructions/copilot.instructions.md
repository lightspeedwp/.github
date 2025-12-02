---
file_type: "instructions"
title: "Copilot Instructions"
description: "Comprehensive guide for creating and managing Copilot agents, prompts, instructions, and automation."
version: "v3.0"
last_updated: "2025-12-02"
owners: ["LightSpeedWP Engineering"]
tags: ["copilot", "instructions", "agents", "prompt", "automation", "ai"]
status: "active"
applyTo: "**/*"
references:
  - "../custom-instructions.md"
  - "../coding-standards.instructions.md"
  - "./frontmatter.instructions.md"
  - "../COPILOT_TEMPLATE/"
  - "../agents/agent.md"
  - "../prompts/prompts.md"
---

# Copilot Instructions

This is the canonical guide for all Copilot-related authoring in the LightSpeedWP repository—including agents, prompts, instructions, and custom automation.

For org-wide Copilot guidance, see [custom-instructions.md](../custom-instructions.md).

---

## Quick Reference

| Asset Type   | Template Location                           | Index Location                   |
| ------------ | ------------------------------------------- | -------------------------------- |
| Agent        | `COPILOT_TEMPLATE/template.agent.md`        | `agents/agent.md`                |
| Prompt       | `COPILOT_TEMPLATE/template.prompt.md`       | `prompts/prompts.md`             |
| Instructions | `COPILOT_TEMPLATE/template.instructions.md` | This file / topic-specific index |

---

## Creating an Agent

Agents define specialised AI personas for specific tasks. GitHub has deprecated chatmodes in favour of agents.

### Steps

1. **Copy the template:** Use [`agents/template.agent.md`](../agents/template.agent.md)
2. **Update frontmatter:**
   - `file_type: "agent"`
   - `name`, `description`, `version`, `last_updated`, `owners`, `tags`, `status`
3. **Define the role, tools, process, and expected outputs**
4. **Add references** to supporting instructions and prompts
5. **Register in index:** Add to [`agents/agent.md`](../agents/agent.md)

---

## Creating a Prompt

Prompts are reusable templates for Copilot Chat and automation workflows.

### Steps

1. **Copy the template:** Use [`COPILOT_TEMPLATE/template.prompt.md`](../COPILOT_TEMPLATE/template.prompt.md)
2. **Update frontmatter:**
   - `file_type: "prompt"`
   - `mode: "ask"` | `"edit"` | `"agent"`
   - `title`, `description`, `owners`, `version`, `status`
3. **Define clear outcomes**, user input requirements, and expected outputs
4. **Add references** to supporting instructions
5. **Register in index:** Add to [`prompts/prompts.md`](../prompts/prompts.md)

---

## Creating Instructions

Instructions provide guidance for specific topics or automation tasks.

### Steps

1. **Copy the template:** Use [`COPILOT_TEMPLATE/template.instructions.md`](../COPILOT_TEMPLATE/template.instructions.md)
2. **Update frontmatter:**
   - `file_type: "instructions"`
   - `applyTo:` glob pattern for applicable files
   - Complete all required metadata fields
3. **Follow section structure:** Role, Style, Purpose, Process, Outputs, Guardrails
4. **Add references** to related standards
5. **Register in appropriate index** (this file or topic-specific)

---

## Updating Custom Instructions

The org-wide custom instructions define global Copilot behaviour.

### Steps

1. **Edit** [`custom-instructions.md`](../custom-instructions.md) with proposed changes
2. **Ensure** all referenced files are current
3. **Follow** the frontmatter schema in [`frontmatter.instructions.md`](./frontmatter.instructions.md)
4. **Open a PR** for review

---

## Updating Instruction Indexes

Keep indexes synchronised with actual content.

### Index Files to Review

- [`instructions/copilot.instructions.md`](./copilot.instructions.md) — This file
- [`instructions/tests.instructions.md`](./tests.instructions.md)
- [`instructions/agents.instructions.md`](./agents.instructions.md)
- [`instructions/workflows.instructions.md`](./workflows.instructions.md)
- [`instructions/linting.instructions.md`](./linting.instructions.md)

### Steps

1. **Verify** all references are accurate and up-to-date
2. **Add** any new instructions or templates to the appropriate index
3. **Check** frontmatter format and status fields
4. **Open a PR** for review

---

## Process Tracking (Optional)

For complex multi-step tasks, use the process tracking workflow:

1. Create `Copilot-Processing.md` in workspace root
2. Document user request and action plan
3. Track task completion status
4. Add summary when complete
5. Delete file before committing

See [`copilot/copilot-thought-logging.instructions.md`](./copilot/copilot-thought-logging.instructions.md) for detailed workflow.

---

## Frontmatter Requirements

All Copilot assets must include valid YAML frontmatter. See [`frontmatter.instructions.md`](./frontmatter.instructions.md) for the complete schema and examples.

### Required Fields

- `file_type` — `"agent"` | `"prompt"` | `"instructions"`
- `description` — One-sentence summary
- `version` — Semantic version (e.g., `v1.0`)
- `last_updated` — ISO date

### Recommended Fields

- `owners` — Responsible team/individuals
- `tags` — Keywords for discovery
- `status` — `"active"` | `"deprecated"` | `"draft"`
- `references` — Related files

---

## Best Practices

- **Keep assets focused** — One purpose per file
- **Use templates** — Start from `COPILOT_TEMPLATE/`
- **Cross-reference** — Link related instructions and prompts
- **Update indexes** — Register new assets immediately
- **Version appropriately** — Bump version on significant changes
