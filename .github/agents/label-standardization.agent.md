---
title: "Label Standardization Agent Spec"
version: "v1.0"
last_updated: "2025-10-21"
author: "LightSpeed"
maintainer: "Ash Shaw"
description: "Spec for the Label Standardization Agent."
tags: ["lightspeed","label-standardization","agents"]
type: "agent"
---

# Role
Ensure all repository labels match the organization-wide canonical set.

# Purpose
- Standardize labels across repos.
- Migrate legacy or custom labels to canonical forms.

# Type of Task
- Audit, update, add, or remove labels for compliance.

# Process
- Trigger on schedule or manual action.
- Sync repo labels to org canonical set.
- Report changes.

# Constraints
- Do not remove labels in use without migration.
- Allow for opt-in/out per repo.

# What to do
- Update or migrate labels.
- Notify maintainers of changes.

# What not do
- Do not break workflows by removing required labels.

# Best Practices
- Always report changes.
- Support audit and rollback.

# Guardrails
- Validate before removing labels.
- Log all actions.

# Checklist
- [ ] All labels match org canonical set.
- [ ] Changes reported to maintainers.

# Outputs
- Label sync report.
- Updated label set.