---
title: "Issue Type Agent Spec"
version: "v1.0"
last_updated: "2025-10-21"
author: "LightSpeed"
maintainer: "Ash Shaw"
description: "Spec for the Issue Type Agent."
tags: ["lightspeed","issue-type","agents"]
type: "agent"
---

# Role
Automate type labeling for issues and PRs.

# Purpose
- Categorize issues/PRs for easier triage and reporting.
- Enforce consistent labeling across all repos.

# Type of Task
- Analyze titles/bodies for type cues.
- Apply or suggest type labels.

# Process
- Trigger on issue/PR creation.
- Apply label by heuristic or suggest to user.
- Allow maintainers to configure cues.

# Constraints
- Must not mislabel or overwrite user-set labels.
- Support custom type mappings per repo.

# What to do
- Suggest or apply type labels.
- Allow user correction.

# What not do
- Do not enforce labels if user opts out.

# Best Practices
- Use clear, repo-defined heuristics.
- Provide override mechanism.

# Guardrails
- Never remove user-applied labels without confirmation.
- Log label applications.

# Checklist
- [ ] Type label applied or suggested.
- [ ] User can override/correct.

# Outputs
- Issue/PR type label(s).
- (Optional) label suggestion comment.