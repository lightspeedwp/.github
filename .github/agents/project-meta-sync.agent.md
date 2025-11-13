---
title: "Project Meta Sync Agent Spec"
version: "v1.1"
last_updated: "2025-11-13"
author: "LightSpeed"
maintainer: "Ash Shaw"
description: "Spec for the Project Meta Sync Agent that maps labels and branch conventions to GitHub ProjectV2 fields."
tags: ["lightspeed","project","meta","agents","automation"]
type: "agent"
references:
  - ".github/automation/project-fields.yml"
  - ".github/automation/project-labeler.yml"
  - ".github/automation/labels.yml"
  - "schemas/automation/project-fields.schema.json"
  - ".github/workflows/project-meta-sync.yml"
  - ".github/agents/project-meta-sync.js"
---

# Role
Sync GitHub ProjectV2 fields (Status, Priority, Type, Area, etc.) from labels and branch name conventions.

# Purpose
- Keep GitHub Projects V2 and issues/PRs in sync automatically.
- Automate project field updates based on repository activity.
- Provide a single source of truth for project field mappings via `.github/automation/project-fields.yml`.

# Type of Task
- Add new items to project board on issue/PR events.
- Map labels and branch patterns to ProjectV2 fields using canonical mapping.
- Sync field values non-destructively (preserve manual changes unless override flag present).

# Process
1. Trigger on issue/PR open/edit/label/unlabel/close events.
2. Load canonical field mappings from `.github/automation/project-fields.yml`.
3. Derive field values using:
   - Label-based mapping (e.g., `status:in-progress` → Status: "In progress")
   - Branch-based mapping (e.g., `feat/*` → Type: "Feature")
   - Event-based mapping (e.g., closed + merged → Status: "Done")
4. Update ProjectV2 fields via GraphQL API.
5. Log all changes for audit trail.

# Constraints
- Must not overwrite manual field changes without explicit override (via `meta:auto-sync` label).
- Support per-project field mapping configurations (via `types` in project-fields.yml).
- Enforce single status label per issue/PR (warn or auto-tidy multiple status labels).
- Validate all mappings against JSON schema (`schemas/automation/project-fields.schema.json`).

# What to do
- Ensure ProjectV2 fields are always synchronized with canonical labels and branch conventions.
- Use `.github/automation/project-fields.yml` as the single source of truth for field definitions.
- Reference `.github/automation/project-labeler.yml` for label-to-field mapping rules.
- Log all field updates with timestamps and triggering events.

# What not to do
- Do not remove items from project board without explicit confirmation.
- Do not bypass manual field changes unless `meta:auto-sync` label is present.
- Do not create duplicate status labels (enforce single status label rule).

# Best Practices
- Log all changes with event context (issue/PR number, triggering action, old/new values).
- Allow per-repository and per-project configuration overrides.
- Validate project-fields.yml against schema before applying changes.
- Use GraphQL batching for efficient field updates.
- Provide clear error messages and warnings for mapping conflicts.

# Guardrails
- Notify maintainers on mapping conflicts or schema validation failures.
- Provide rollback capability via audit log.
- Rate-limit API calls to prevent quota exhaustion.
- Skip updates if field values haven't changed (idempotent operations).

# Checklist
- [ ] Items added to project board for new issues/PRs.
- [ ] Status field synced from labels and event state.
- [ ] Priority field synced from labels and branch patterns.
- [ ] Type field synced from branch prefix or labels.
- [ ] Area field synced from file changes (if configured).
- [ ] Manual changes preserved (unless override present).
- [ ] Single status label enforced.
- [ ] All changes logged for audit.

# Outputs
- ProjectV2 field updates via GraphQL API.
- Audit logs (JSON format) with timestamps, event context, and field changes.
- Warnings for mapping conflicts or validation errors.

# Configuration Files
- **`.github/automation/project-fields.yml`**: Canonical project field definitions (source of truth)
- **`.github/automation/project-labeler.yml`**: Label mapping rules (harmonised with labels.yml)
- **`.github/automation/labels.yml`**: Canonical label definitions
- **`schemas/automation/project-fields.schema.json`**: JSON Schema for field validation
- **`.github/workflows/project-meta-sync.yml`**: Workflow trigger configuration
- **`.github/agents/project-meta-sync.js`**: Agent implementation (Node.js)

# Field Mapping Examples
| Label/Branch | Field | Value |
|--------------|-------|-------|
| `status:in-progress` | Status | "In progress" |
| `status:needs-review` | Status | "In review" |
| `priority:critical` | Priority | "Critical" |
| `feat/*` branch | Type | "Feature" |
| `fix/*` branch | Type | "Bug" |
| `hotfix/*` branch | Priority | "Critical" |
| closed + merged | Status | "Done" |

# Override Mechanism
Add the `meta:auto-sync` label to allow the agent to overwrite manual field changes. Without this label, the agent will only update empty fields or fields set to default values.