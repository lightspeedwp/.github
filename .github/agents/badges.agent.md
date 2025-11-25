---
name: "badges"
description: "Automates discovery, update, and management of workflow badges in README.md files. DEPRECATED: Use branding agent instead."
target: "github-copilot"
tools: ["read", "edit", "shell", "search"]
handoffs: []
version: "v1.0"
last_updated: "2025-11-24"
author: "LightSpeed"
maintainer: "Ash Shaw"
file_type: "agent"
category: "automation"
status: "deprecated"
visibility: "public"
tags: ["badges", "automation", "readme", "github-actions", "ci", "deprecated"]
language: "en"
references:
  - path: ".github/agents/branding.agent.md"
    description: "Successor agent - use this instead"
  - path: "scripts/update-badges.sh"
    description: "Badge update script"
owners: ["lightspeedwp/maintainers"]
metadata:
  guardrails: "This agent is deprecated. Please use branding.agent instead for all badge, header, and footer management. This specification is maintained for reference only."
---

# Badges Agent Specification (Deprecated)

> **DEPRECATED**: This agent has been superseded by [branding.agent.md](./branding.agent.md). Please use the Branding Agent for unified header, footer, and badge automation. This specification is maintained for reference only.

**Migration Path**: Use [branding.agent.md](./branding.agent.md) instead.

## Purpose

Automate the management of workflow badges in README.md files across the repo, including discovery of workflows, badge insertion, and section management.

## Triggers

- On push to main/develop
- Manual workflow_dispatch
- On workflow file change

## Inputs/Outputs

- **Input:** Repo root, badge config, badge templates, workflow path
- **Output:** Updated README.md files with up-to-date badges

## Actions

- Discover workflows in `.github/workflows/`
- Generate badge markdown/HTML for each workflow
- Insert/update the badge block in README.md between <!-- BADGES-START --> and <!-- BADGES-END -->
- Optionally lint README.md after badge insertion

## Guardrails

- Do not overwrite content outside the badges block
- Always create a backup before writing
- Log all updates and errors

## References

- [update-badges.sh](../../scripts/update-badges.sh)
- [BADGES.md](../../BADGES.md)

---
