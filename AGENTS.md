---
title: "LightSpeed Global AI Rules"
description: "Organisation-wide AI agent rules, coding standards, and contribution guidelines for all LightSpeed WordPress projects."
version: "v1.1"
last_updated: "2025-12-07"
file_type: "agents-index"
maintainer: "LightSpeed Team"
authors: ["LightSpeed Team"]
license: "GPL-3.0"
tags: ["agents", "ai", "coding-standards", "governance", "wordpress"]
domain: "governance"
stability: "stable"
references:
  - path: ".github/agents/agent.md"
    description: "Main agent implementations index"
  - path: ".github/custom-instructions.md"
    description: "Organisation-wide Copilot instructions"
  - path: ".github/prompts/prompts.md"
    description: "Prompts index"
---

# LightSpeed – Global AI Rules (AGENTS.md)

- Use UK English; optimise for clarity, scalability, maintainability and profitable outcomes.
- Prefer minimal, modular solutions; justify heavier tools with return on investment and maintenance cost.
- Follow WordPress Coding Standards (CSS, HTML, JavaScript, PHP) and inline‑documentation standards at all times.
- All code changes must include lint fixes, relevant tests and a short rationale summarising the change.
- Never output secrets. Treat production and customer data as sensitive. Follow the OWASP top 10 for web security.
- Accessibility and performance are non‑negotiable; highlight potential issues during reviews.
- Prefer `theme.json` and block components over bespoke code when feasible to avoid vendor lock‑in.
- When unsure, propose safe defaults and ask **one** focused question to clarify requirements.
- Core instructions consolidated: see `.github/instructions/{languages,documentation-formats,quality-assurance,automation,community-standards}.instructions.md` (mapping in `.github/instructions/MIGRATION_GUIDE.md`).

## Agent Directory

- See [Main Agent Index](.github/agents/agent.md) for all agent implementations and specs.
- Each agent must have both a code file (`.js`, `.py`, etc.) and a spec (`.md`) following the template.
- All contributors must follow the org [Coding Standards](.github/instructions/coding-standards.instructions.md).

## Agent Test Status

| Agent | Tests | Notes                        |
| ----- | ----- | ---------------------------- |
| *TBD* | ⏳    | Awaiting test implementation |

> **Note:** As agents are developed and tested, this table will be updated with their status. ✅ indicates passing tests, ❌ indicates failing tests, and ⏳ indicates tests pending implementation.

---

## Contribution Guidelines & Indexes

| Area                      | File Reference                                                                                                                 | Notes / Usage                                                 |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------- |
| **Coding Standards**      | [.github/instructions/coding-standards.instructions.md](.github/instructions/coding-standards.instructions.md)                 | Unified standards for all code                                |
| **File Organisation**     | [.github/instructions/file-organisation.instructions.md](.github/instructions/file-organisation.instructions.md) | Where to create reports, tasks, and project files (CRITICAL)  |
| **Quality Assurance**     | [.github/instructions/quality-assurance.instructions.md](.github/instructions/quality-assurance.instructions.md)               | Testing pyramid, Jest, coverage, CI/CD (3 files consolidated) |
| **Languages & Linting**   | [.github/instructions/languages.instructions.md](.github/instructions/languages.instructions.md)                               | JS/TS, JSON, YAML, JSDoc, linting (4 files consolidated)      |
| **Documentation Formats** | [.github/instructions/documentation-formats.instructions.md](.github/instructions/documentation-formats.instructions.md)       | Markdown, YAML frontmatter, Mermaid (3 files consolidated)    |
| **Automation**            | [.github/instructions/automation.instructions.md](.github/instructions/automation.instructions.md)                             | Agents, labeling, release, metrics (8 files consolidated)     |
| **Community Standards**   | [.github/instructions/community-standards.instructions.md](.github/instructions/community-standards.instructions.md)           | Files, naming, README, replies (4 files consolidated)         |

**Consolidated Instructions (5 Files):**

- **languages.instructions.md** - JS/TS, JSON, YAML, JSDoc, linting (consolidated 4 files)
- **documentation-formats.instructions.md** - Markdown, frontmatter, Mermaid, A11y (consolidated 3 files)
- **quality-assurance.instructions.md** - Testing, Jest, coverage, CI/CD (consolidated 3 files)
- **automation.instructions.md** - Agents, labeling, release, metrics (consolidated 8 files)
- **community-standards.instructions.md** - Files, naming, README, saved replies (consolidated 4 files)

---

## PR Templates

- Use the default PR template: [.github/PULL_REQUEST_TEMPLATE.md](.github/PULL_REQUEST_TEMPLATE.md)
- Additional PR templates are available in: [.github/PULL_REQUEST_TEMPLATES/](.github/PULL_REQUEST_TEMPLATES/)
  - Use the template most relevant to your change (e.g. feature, fix, documentation, etc.)

---

## Core Index Instructions

Start here for all key standards:

- [Coding Standards Index](.github/instructions/coding-standards.instructions.md): Unified standards, best practices, and documentation for all LightSpeed projects.
- [Linting Instructions Index](.github/instructions/linting.instructions.md): Primary index and guidance for all linting rules, tools, and file-type-specific standards.

---

## Cross-References & Discoverability

| Resource Name             | Reference                                                        | Purpose / Notes                                                    |
| ------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------ |
| **Main Instructions Index** | [.github/instructions/_index.instructions.md](.github/instructions/_index.instructions.md) | Master index for all instruction files |
| **Custom Instructions**   | [.github/custom-instructions.md](.github/custom-instructions.md) | Central Copilot/org instructions, prompts, and standards           |
| **Main Agent Index**      | [.github/agents/agent.md](.github/agents/agent.md)               | Directory of agent specs, stubs, usage, implementation             |
| **Prompts Index**         | [.github/prompts/prompts.md](.github/prompts/prompts.md)         | Master prompt index and authoring conventions                      |
| **Instruction Migration** | [.github/MIGRATION_GUIDE.md](.github/MIGRATION_GUIDE.md)         | Mapping from legacy instruction files to the 5 consolidated guides |

---

## References

- [Contributing Guidelines](../CONTRIBUTING.md) - For human contributors
- [Main Documentation](../README.md) - Project overview
- [Frontmatter Schema](.github/schemas/frontmatter.schema.json) - Schema validation

*This file is the canonical reference for all AI agent rules and coding standards in LightSpeedWP projects.
All contributors, agents, and AI assistants must comply with these standards.*

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)
