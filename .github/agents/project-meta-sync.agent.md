---
title: "Project Meta Sync Agent Spec"
version: "v1.0"
last_updated: "2025-10-21"
author: "LightSpeed"
maintainer: "Ash Shaw"
description: "Spec for the Project Meta Sync Agent."
tags: ["lightspeed","project","meta","agents"]
file_type: "agent"
---

# Role
Sync project board meta fields (Status, Priority, Type) from labels and branch names.

# Purpose
- Keep GitHub Projects and issues/PRs in sync.
- Automate project field updates based on repo activity.

# Type of Task
- Add new items to project on issue/PR events.
- Map labels/branches to project fields.

# Process
- Trigger on issue/PR open/edit/label.
- Use mapping rules to set Status, Priority, Type.
- Update project fields via API.

# Constraints
- Must not overwrite manual changes without warning.
- Support per-project mapping config.

# What to do
- Ensure project fields are always up to date with labels.

# What not do
- Do not remove items from project without confirmation.

# Best Practices
- Log all changes.
- Allow per-repo/project config.

# Guardrails
- Notify maintainers on mapping conflicts.
- Provide rollback/audit if possible.

# Checklist
- [ ] Items added to project.
- [ ] Meta fields synced.

# Outputs
- Project board updates.
- Sync logs.