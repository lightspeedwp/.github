---
file_type: documentation
title: LightSpeed .github Documentation Index
description: Primary index for governance, automation, branching, release, and operations documentation in the LightSpeed .github repository.
version: "2.0"
last_updated: "2026-08-19"
owners:
  - LightSpeed Team
status: active
stability: stable
domain: governance
---

# LightSpeed .github Documentation

This folder is the canonical documentation index for governance, workflows, release operations, and repository standards.

## Start Here

- `ARCHITECTURE.md` — repository architecture.
- `BRANCHING_STRATEGY.md` — branch naming and protection rules.
- `PR_CREATION_PROCESS.md` — PR process and validation flow.
- `RELEASE_PROCESS.md` — current two-phase agentic release process.
- `AUTOMATION.md` — automation governance and workflow responsibilities.

## Standards and Governance

- `AGENT_STANDARDS.md`
- `INSTRUCTIONS_STANDARDS.md`
- `SKILLS_STANDARDS.md`
- `WORKFLOWS_STANDARDS.md`
- `AI_REFERENCES_STANDARDS.md`

## Operations and Maintenance

- `ISSUE_MAINTENANCE_SCRIPTS.md`
- `LABELING.md`
- `LABEL_MANAGEMENT_CLI.md`
- `ARCHIVE_WORKFLOW_GUIDE.md`
- `WORKFLOW_COORDINATION.md`

## Release and Quality

- `RELEASE_PROCESS.md`
- `RELEASE_WORDPRESS.md`
- `TESTING.md`
- `LINTING.md`
- `VERSIONING.md`

## Notes

- Use uppercase file names exactly as present in this folder.
- Prefer this index over legacy links in archived documents.
## Visual Workflow

```mermaid
flowchart TD
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
