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
  - "./branding.agent.md"
---

> **Deprecated:** This agent and instructions have been superseded by [branding.agent.md](./branding.agent.md). Please use the Branding Agent for unified header, footer, and badge automation.

# 🏷️ Header & Footer Instructions (Deprecated)

See [Branding Agent Instructions](./branding.agent.md) for unified automation of badges, headers, and footers.

![Automation Badge](https://img.shields.io/badge/automation-enabled-brightgreen?style=flat-square)
![Docs Badge](https://img.shields.io/badge/docs-up%20to%20date-blue?style=flat-square)

The **Header & Footer Agent** randomises and inserts headers and footers by category and file type, using a schema-driven config.

- ⚙️ Configurable via JSON, YAML, or JS.
- 💾 Always back up before changes and validate config against schema.

## Using Emojis in Headings

To make documentation more engaging and scannable, you should add relevant emojis to section headings where it adds clarity, visual interest, or helps users quickly identify the section’s purpose.

**When to use emojis in headings:**

- When the emoji clearly reinforces the meaning of the heading (e.g., 📝 for "Instructions", ⚠️ for "Warnings", 💡 for "Tips").
- For major sections or callouts that benefit from visual distinction.
- When it adds a friendly or accessible tone without causing confusion.

**When not to use emojis in headings:**

- If the emoji does not add clarity or is ambiguous in meaning.
- For very short or technical headings where visual icons may distract.
- If it would reduce accessibility or readability for screen reader users (avoid excessive or decorative emoji).

**Tip:** Prefer one emoji per heading, placed at the start. Use only widely-recognised emoji that match the section’s intent.

## Badges Instructions 

See [Branding Agent Instructions](./branding.agent.md) for unified automation of badges, headers, and footers.

# Fun Footer & Header Logic

To keep documentation lively and branded, all README and instructions files end with a randomly selected fun footer.  
All badge blocks are auto-inserted below the header and formatted consistently.

## Footer Variants

- *Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
- *Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
- *Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
- *This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
- *Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

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


## References

- [Header & Footer Agent Spec](./header-footer.agent.md)
- [Header & Footer Prompt](./header-footer.prompt.md)
- [Header/Footer Schema](../../schemas/header-footer.schema.json)
- [Header Script](../../scripts/includes/headers.js)
- [Footer Script](../../scripts/includes/footers.js)
- [Header/Footer Standards](../../HEADER-FOOTER.md)
- [LightSpeedWP Documentation Hub](../../docs/README.md)
- [Branding Agent Instructions](./branding.agent.md)

---

_This document is part of the LightSpeedWP automation suite. For more, see the [Documentation Hub](../../docs/README.md)._

---

<!-- RANDOM FOOTER: 🚀 Automate your docs, delight your team! -->

---

Documentation lovingly automated by the LightSpeedWP 🛠️ team.  
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)
