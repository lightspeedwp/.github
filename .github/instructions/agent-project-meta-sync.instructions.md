---
file_type: "instructions"
title: "Workflow: Project Meta Sync"
description: "Sync GitHub Project board fields with issue/PR metadata and labels."
version: "v1.0"
apply_to: ".github/workflows/project-meta-sync.yml, planner agent"
last_updated: "2025-10-22"
owners: ["LightSpeed Engineering"]
references:
  - "./workflows.instructions.md"
  - "../agents/planner.agent.js"
---

# Mission

Sync GitHub Project board meta fields (Status, Priority, Type) from issue/PR labels and branch names.

# Strategy

- On issue/PR events, update Project items and meta fields.
- Use GitHub App token and project APIs.
- Allow custom label-to-field mappings.

# Agent Alignment

- Agents: planner, labeling/status agents

---

# Mission

Sync GitHub Project board meta fields (Status, Priority, Type) from issue/PR labels and branch names.

# Triggers

- Issue or PR events (created, updated, labeled, closed, etc.)

# Inputs

- Issue/PR labels, branch names, project configuration

# Actions

- Add or update GitHub Project items from issues/PRs
- Sync meta fields (Status, Priority, Type) to project
- Allow custom label-to-field mappings
- Rollback/audit trail for sync actions (future)

# Guardrails

- Only update projects with correct permissions/token
- Configurable field mappings

# Outputs

- Updated GitHub Project board fields
- Audit logs or sync reports

# Integration

- Orchestrated by `.github/workflows/project-meta-sync.yml`

# References

- [Workflow instructions](../../workflows/workflow-project-meta-sync.instructions.md)

---

