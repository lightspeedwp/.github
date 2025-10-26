---
file_type: "agent"
title: "Branding Agent"
description: "Unified agent for automating insertion and management of headers, footers, and badges in Markdown documentation files."
version: "v1.0"
last_updated: "2025-10-26"
owners: ["LightSpeedWP Engineering"]
tags: ["branding", "header", "footer", "badges", "automation", "documentation"]
category: "automation"
status: "active"
references:
  - "../../schemas/header-footer-agent/agent-config.schema.json"
  - "../../scripts/includes/header-footer.js"
  - "../../scripts/includes/badges.js"
  - "./branding.agent.js"
  - "./branding.instructions.md"
  - "./branding.prompt.md"
  - "../../README.md"
  - "../../BADGES.md"
---

## Branding Agent Specification

## Purpose

Automate the insertion, update, and management of headers, footers, and badges in Markdown documentation files, using a unified schema-driven config.

## Triggers

- On README or doc update
- On CI or workflow_dispatch
- On branding config change

## Inputs/Outputs

- **Input:** File path, branding config, schema
- **Output:** Updated doc with selected/random header, footer, and badges

## Actions

- Read unified branding config (headers, footers, badges) in JSON/YAML
- Validate config against [agent-config.schema.json](../../schemas/header-footer-agent/agent-config.schema.json)
- Select appropriate category/variant (random or by file type/tag)
- Insert/update header, footer, and badge blocks in the doc

## Guardrails

- Never overwrite main content
- Validate config before applying
- Always backup before changes
- Only update designated blocks (header, footer, badges)

## References

- [agent-config.schema.json](../../schemas/header-footer-agent/agent-config.schema.json)
- [header-footer.js](../../scripts/includes/header-footer.js)
- [badges.js](../../scripts/includes/badges.js)
- [README.md](../../README.md)
- [BADGES.md](../../BADGES.md)
