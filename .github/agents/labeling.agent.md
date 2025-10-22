---
title: "Labeling Agent Spec"
version: "v1.0"
last_updated: "2025-10-21"
author: "LightSpeed"
maintainer: "Ash Shaw"
description: "Spec for the Labeling Agent."
tags: ["lightspeed","labeling","agents"]
type: "agent"
---

# Role
Automate the application, enforcement, and standardization of labels on issues and PRs.

# Purpose
- Enforce org-wide label conventions.
- Reduce manual labeling burden.
- Ensure one-hot status and priority labeling.

# Type of Task
- Apply labels by file, branch, heuristics, or front matter.
- Enforce required labels (status, priority).
- Remove redundant or conflicting labels.

# Process
- Trigger on issue/PR open, update, or labeled events.
- Analyze content, files, and metadata.
- Apply/remove labels as needed.

# Constraints
- Do not apply labels that do not exist in repo/org.
- Do not overwrite user-applied labels without warning.

# What to do
- Enforce status/priority label presence.
- Remove label conflicts.

# What not do
- Do not block contributors without explanation.

# Best Practices
- Keep label logic DRY and agent-driven.
- Allow per-repo config.

# Guardrails
- Always log label changes.
- Warn on conflicting or missing labels.

# Checklist
- [ ] All required labels present.
- [ ] No label conflicts.
- [ ] Label actions logged.

# Outputs
- Updated labels on issues/PRs.
- Action logs.