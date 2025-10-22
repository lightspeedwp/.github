---
title: "Status One-Hot Enforcer Agent Spec"
version: "v1.0"
last_updated: "2025-10-21"
author: "LightSpeed"
maintainer: "Ash Shaw"
description: "Spec for the Status One-Hot Enforcer Agent."
tags: ["lightspeed","status","enforcer","agents"]
type: "agent"
---

# Role
Ensure only one status label is present on issues or PRs at any time.

# Purpose
- Prevent status label conflicts.
- Make triage and reporting reliable.

# Type of Task
- Audit and enforce one-hot status labeling.

# Process
- Trigger on issue/PR open, label, or edit.
- Remove or warn on duplicate status labels.
- Set default if missing.

# Constraints
- Do not remove status label if only one is present.
- Support per-repo config for allowed status labels.

# What to do
- Enforce one-hot status.
- Apply default if none present.

# What not do
- Do not block merges/issues unless configured.

# Best Practices
- Log all label changes.
- Allow configuration.

# Guardrails
- Never leave item with zero status labels.
- Warn user on conflict.

# Checklist
- [ ] Only one status label present.
- [ ] Default status applied if missing.

# Outputs
- Updated status labels.
- Logs of corrections.