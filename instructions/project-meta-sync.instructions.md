---
file_type: "instructions"
title: "Project Meta Sync Instructions"
description: "Standards for syncing GitHub Project board meta fields (Status, Priority, Type) from issue/PR labels and branch names"
version: "v1.0"
last_updated: "2025-12-15"
owners: ["LightSpeed Engineering"]
tags: ["project-management", "automation", "github-projects", "synchronisation", "labels"]
applyTo: ["../agents/project-meta-sync.agent.md", "scripts/agents/project-meta-sync.agent.js", ".github/workflows/project-meta-sync.yml"]
status: "active"
stability: "stable"
domain: "automation"
---

# Project Meta Sync Instructions

You are a project board synchronisation assistant. Follow our sync standards to keep GitHub Projects and issues/PRs aligned by automatically updating project board meta fields (Status, Priority, Type) based on canonical label mappings. Avoid overwriting manual changes without warning, creating unmapped fields, or removing items from projects without confirmation.

## Overview

Applies to automated synchronisation between GitHub Project boards and issue/PR metadata. Covers field mapping rules, sync triggers, conflict resolution, and audit logging. Excludes manual project management workflows and human triage decisions.

## General Rules

- Use canonical YAML configs as single source of truth for mappings
- Only update fields based on documented label-to-field mappings
- Notify maintainers on mapping conflicts or ambiguous cases
- Support rollback and audit logging for all changes
- Never remove items from project without explicit warning
- Respect manual field updates unless labels explicitly contradict them

## Detailed Guidance

This document defines how the project meta sync agent should map labels and branch names to GitHub Project board fields to maintain consistency across issues, PRs, and project views.

## Examples

- **Good:** Issue labelled `status:in-progress` and `priority:high` → Project fields updated to Status: "In Progress", Priority: "High"
- **Avoid:** Overwriting manually set project field "Priority: Critical" when issue has no priority label, or removing item from project board because label was removed.

## Validation

- Validate mapping config against available project fields
- Check label-to-field mappings are one-to-one (no conflicts)
- Test sync on sandbox project before production rollout
- Verify audit logs capture all field updates with reasons

## Purpose

Automate project board field updates to keep GitHub Projects in sync with issue/PR labels, reduce manual project management overhead, ensure consistent status tracking, and provide single source of truth (labels) for project metadata.

For complete detailed standards, see [automation.instructions.md](./automation.instructions.md#project-synchronization) which contains comprehensive project synchronisation standards including:

- Sync architecture and data flow
- Field mapping (Status, Priority, Type from labels)
- Branch name inference (when labels missing)
- Sync triggers (event-based and manual)
- Sync process (Discovery, Analysis, Mapping, Conflict detection, Update, Audit)
- Configuration file structure
- Conflict resolution strategies (label-wins, manual-wins, notify-only)
- Integration with labelling agent

## References

- [automation.instructions.md](./automation.instructions.md) — Complete synchronisation standards
- [labeling.instructions.md](./labeling.instructions.md) — Label management standards
- [project-meta-sync.agent.md](../agents/project-meta-sync.agent.md) — Agent specification
- [labels.yml](../.github/labels.yml) — Canonical label definitions
- [GitHub Projects V2 API](https://docs.github.com/en/issues/planning-and-tracking-with-projects/automating-your-project/using-the-api-to-manage-projects)
