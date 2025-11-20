---
file_type: "prompt"
title: "Badges Prompt"
description: "Prompt for Copilot/AI to generate or update workflow badges in README.md."
version: "v1.0"
last_updated: "2025-10-23"
owners: ["LightSpeedWP Engineering"]
tags: ["badges", "prompt", "automation"]
status: "active"
references:
  - "./badges.agent.md"
  - "./badges.instructions.md"
---

# Prompt

Please scan all `.github/workflows/*.yml` files, generate up-to-date badges, and insert them between `<!-- BADGES-START -->` and `<!-- BADGES-END -->` in README.md. Always preserve content outside this block.
