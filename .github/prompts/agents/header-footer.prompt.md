---
file_type: "prompt"
description: "Prompt for Copilot/AI to generate or update headers and footers in documentation files."
applyTo: "**/*"
---

# 🏷️ Header & Footer Prompt

![Automation Badge](https://img.shields.io/badge/automation-enabled-brightgreen?style=flat-square)
![Prompt Badge](https://img.shields.io/badge/prompt-ready-blue?style=flat-square)

Please use the header/footer config to insert or update a randomised header and footer in each documentation file. Use the config schema to validate all options.

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

## References

- [Header & Footer Agent Spec](./header-footer.agent.md)
- [Header & Footer Instructions](./header-footer.instructions.md)
- [Header Schema](../../schemas/header.schema.json)
- [Footer Schema](../../schemas/footer.schema.json)
- [Header/Footer Schema](../../schemas/header-footer.schema.json)
- [Header-Footer Agent Config Schema](../../schemas/header-footer-agent/agent-config.schema.json)
- [LightSpeedWP Documentation Hub](../../docs/README.md)

---

_This prompt is part of the LightSpeedWP automation suite. For more, see the [Documentation Hub](../../docs/README.md)._

---

<!-- RANDOM FOOTER: 🚀 Automate your docs, delight your team! -->
