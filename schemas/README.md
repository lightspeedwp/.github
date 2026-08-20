---
file_type: documentation
title: Schema Definitions
description: Canonical JSON schema definitions for metadata, agents, plugins, workflows, and governance validation.
version: "2.0"
last_updated: "2026-08-19"
owners:
  - LightSpeed Team
status: active
stability: stable
domain: governance
---

# Schema Definitions

This directory is the canonical location for JSON schemas used across LightSpeedWP repositories.

## Scope

Schemas in this folder validate:

- Frontmatter and documentation metadata.
- Agent and provider configuration.
- Plugin manifests and capability bindings.
- Project field and workflow configuration.
- Changelog and release-related metadata.

## Key Schemas

- `frontmatter.schema.json`
- `multi-provider-agent.schema.json`
- `provider-config.schema.json`
- `agent-capability-manifest.schema.json`
- `plugin-manifest.schema.json`
- `project-fields.schema.json`
- `changelog.schema.json`

## Compatibility Note

A hidden `.schemas/` directory may exist for backward compatibility, but new references should target `schemas/`.

## Validation

Use repository scripts and CI workflows to validate files against these schemas. When adding a new schema:

1. Add the schema file in `schemas/`.
2. Add examples when helpful.
3. Update relevant documentation and validation scripts.
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
