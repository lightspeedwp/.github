---
file_type: "instructions"
title: "Badges Automation Instructions"
description: "How to use and extend the Badges Agent for workflow badge maintenance."
version: "v1.0"
last_updated: "2025-10-23"
owners: ["LightSpeedWP Engineering"]
tags: ["badges", "automation", "readme"]
status: "active"
references:
  - "./badges.agent.md"
  - "./badges.prompt.md"
  - "../../scripts/update-badges.sh"
  - "../../BADGES.md"
---
# Badges Instructions

- The Badges Agent discovers all workflows and inserts or updates badge blocks in README.md.
- Configurable via badge template file or script options.
- Always creates a backup before writing.
- Lint your README.md after updates for compliance.