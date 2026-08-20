---
title: "Prompts Directory"
description: "Reusable AI prompts and templates for LightSpeed automation, agents, and governance workflows. Includes system prompts, context builders, and instruction templates."
file_type: documentation
version: v0.2.1
last_updated: "2026-06-03"
created_date: "2025-11-27"
authors: ["LightSpeed Team"]
maintainer: "LightSpeed Team"
license: "GPL-3.0"
tags: ["prompts", "automation", "AI", "templates"]
domain: "governance"
stability: "experimental"
---

# Prompts Directory

This directory contains reusable AI prompts, system instructions, and context builders for LightSpeed automation workflows and agents.

## Repository Scope

This directory is now for `.github` repository control-plane prompts only.

- Keep prompts here when they depend on GitHub issue/PR/workflow automation or repo-local governance files.
- Use root `prompts/` for organisation-wide reusable prompts.

## Migration Notice

- Prompt migration and classification is tracked in:
  - `.github/projects/active/refactor-migrate-prompts/artifacts/migration-matrix.md`
- Moved or merged prompts in this directory include per-file deprecation notices with successor paths.
- Canonical org-wide prompt library:
  - `../prompts/README.md`

## Purpose

- **Agent Prompts**: System prompts and behavior guidance for LightSpeed agents
- **Context Builders**: Prompt templates for generating contextual information
- **Instruction Templates**: Reusable instruction sets for automation
- **AI Governance**: Standardized prompting patterns aligned with LightSpeed values

## Contents

This folder contains scripts and templates for automation, including:

- AI agent system prompts
- Context and instruction generation templates
- Governance-aligned prompting patterns
- Automation workflow helpers

## Related Resources

- [Agents Directory](../agents/README.md) — Agent specifications and implementations
- [Instructions Directory](../instructions/README.md) — Comprehensive instruction sets
- [Automation Governance](../../docs/AUTOMATION.md) — Governance policies for automation

---

*Prompts are a critical component of LightSpeed's AI automation strategy. See [AGENTS.md](../../AGENTS.md) for complete AI governance guidance.*
## Visual Workflow

```mermaid
flowchart TD
  accTitle: flowchart diagram
  accDescr: flowchart flowchart
  A[Start Here] --> B[Read Scope and Prerequisites]
  B --> C[Run the Documented Workflow]
  C --> D[Validate with Repo Tooling]
  D --> E[Open PR or Hand-off]

  classDef start fill:#E8F5E9,stroke:#2E7D32,stroke-width:2px,color:#1B5E20;
  classDef prep fill:#E3F2FD,stroke:#1565C0,stroke-width:2px,color:#0D47A1;
  classDef run fill:#FFF3E0,stroke:#EF6C00,stroke-width:2px,color:#E65100;
  classDef gate fill:#F3E5F5,stroke:#6A1B9A,stroke-width:2px,color:#4A148C;
  classDef done fill:#E0F2F1,stroke:#00695C,stroke-width:2px,color:#004D40;

  class A start;
  class B prep;
  class C run;
  class D gate;
  class E done;
```
