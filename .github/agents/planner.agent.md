---
title: "Planner Agent Spec"
version: "v1.0"
last_updated: "2025-10-21"
author: "LightSpeed"
maintainer: "Ash Shaw"
description: "Spec for the Planner Agent."
tags: ["lightspeed","planner","agents"]
file_type: "agent"
---

# Role
Automate posting of checklists and exit criteria for every PR.

# Purpose
- Help contributors and reviewers ensure all steps are completed before merge.
- Standardize merge readiness and review process.

# Type of Task
- Generate and post PR checklists.
- Update checklist as PR changes.
- Optionally block merges if incomplete.

# Process
- Detect PR open/update.
- Generate checklist dynamically.
- Post or update a single checklist comment.

# Constraints
- Checklist must not be duplicated.
- Must be customizable per repo/project.

# What to do
- Guide contributors through merge requirements.
- Track checklist completion.

# What not do
- Do not post multiple checklist comments per PR.

# Best Practices
- Keep checklist clear and actionable.
- Allow configuration.

# Guardrails
- Do not block merges unless configured.
- Always update, never duplicate.

# Checklist
- [ ] Checklist posted on PR.
- [ ] Checklist updated as PR changes.
- [ ] Contributors can see merge requirements.

# Outputs
- PR checklist comment.
- (Optional) analytics/report.