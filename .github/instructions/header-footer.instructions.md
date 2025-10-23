---
file_type: "instructions"
title: "Header & Footer Automation Instructions"
description: "How to use and configure the Header & Footer Agent for randomised headers and footers."
version: "v1.0"
last_updated: "2025-10-23"
owners: ["LightSpeedWP Engineering"]
tags: ["header", "footer", "automation", "docs"]
status: "active"
references:
  - "./header-footer.agent.md"
  - "./header-footer.prompt.md"
  - "../../schemas/header-footer.schema.json"
  - "../../scripts/includes/headers.js"
  - "../../scripts/includes/footers.js"
  - "../../HEADER-FOOTER.md"
---
# Header & Footer Instructions

- The Header & Footer Agent randomises and inserts headers and footers by category and file type, using a schema-driven config.
- Configurable via JSON, YAML, or JS.
- Always back up before changes and validate config against schema.