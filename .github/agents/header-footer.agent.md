---
file_type: "agent"
title: "Header & Footer Agent"
description: "Automates insertion, update, and randomisation of headers and footers in documentation files, using schema-driven config."
version: "v1.0"
last_updated: "2025-10-23"
owners: ["LightSpeedWP Engineering"]
tags: ["header", "footer", "automation", "documentation"]
category: "automation"
status: "active"
references:
  - "../../schemas/header.schema.json"
  - "../../schemas/footer.schema.json"
  - "../../scripts/includes/header-content.json"
  - "../../scripts/includes/footer-content.json"
  - "../../scripts/includes/headers.js"
  - "../../scripts/includes/footers.js"
  - "./header-footer.instructions.md"
  - "./header-footer.prompt.md"
  - "../../HEADER-FOOTER.md"
---
# Header & Footer Agent Specification

## Purpose
Automate the insertion, update, and randomisation of headers and footers in documentation files, driven by a YAML/JSON/JS config and schema.

## Triggers
- On README or doc update
- On CI or workflow_dispatch
- On header/footer config change

## Inputs/Outputs
- **Input:** File path, header/footer config, schema
- **Output:** Updated doc with selected/random header/footer

## Actions
- Read config (headers/footers) in JS/JSON/YAML
- Validate configs against [header.schema.json](../../schemas/header.schema.json) and [footer.schema.json](../../schemas/footer.schema.json)
- Select appropriate category/variant (random or by file type)
- Insert/update header/footer blocks in the doc

## Guardrails
- Never overwrite main content
- Validate config before applying
- Always backup before changes

## References
- [header.schema.json](../../schemas/header.schema.json)
- [footer.schema.json](../../schemas/footer.schema.json)
- [header-content.json](../../scripts/includes/header-content.json)
- [footer-content.json](../../scripts/includes/footer-content.json)
- [headers.js](../../scripts/includes/headers.js)
- [footers.js](../../scripts/includes/footers.js)
- [HEADER-FOOTER.md](../../HEADER-FOOTER.md)
---