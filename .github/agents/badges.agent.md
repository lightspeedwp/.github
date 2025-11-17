---
file_type: "agent"
title: "Badges Agent"
description: "Automates discovery, update, and management of workflow badges in all README.md files."
version: "v1.0"
last_updated: "2025-10-23"
owners: ["LightSpeedWP Engineering"]
tags: ["badges", "automation", "readme", "github-actions", "ci"]
category: "automation"
status: "active"
references:
- "../../scripts/update-badges.sh"
- "./badges.instructions.md"
- "./badges.prompt.md"
- "../../README.md"
- "../../BADGES.md"
- "./branding.agent.md"
---

> **Deprecated:** This agent has been superseded by [branding.agent.md](./branding.agent.md). Please use the Branding Agent for unified header, footer, and badge automation.

# Badges Agent Specification (Deprecated)

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
