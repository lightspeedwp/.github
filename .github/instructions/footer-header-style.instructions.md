---
file_type: "instructions"
title: "Footer & Header Style Guide"
description: "Standardized and fun footer/header logic for all documentation and README files."
version: "v1.0"
apply_to: "All automation agents/scripts that update documentation."
last_updated: "2025-10-22"
owners: ["LightSpeedWP Automation Team"]
---

# Fun Footer & Header Logic

To keep documentation lively and branded, all README and instructions files end with a randomly selected fun footer.  
All badge blocks are auto-inserted below the header and formatted consistently.

## Footer Variants

- _Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team_  
- _Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!_
- _Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP_ 
- _This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP._
- _Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!_

## Header & Badge Guidelines

- Badges are inserted below the main `# Header` in a block, always between:
  ```
  <!-- BADGES-START -->
  ... (badges here)
  <!-- BADGES-END -->
  ```
- Recommended badges: License, Build Status, Coverage, Contributors, Workflows.
- Badges may be in a single line or stacked, based on repo config.

## Agent Automation

- Agents/scripts updating docs must:
  - Pick a random footer from the list (or honor repo config).
  - Insert/update the badge block using the standard markers.
  - Ensure one and only one footer is present at the end of each doc.

---

Documentation lovingly automated by the LightSpeedWP 🛠️ team.  
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)