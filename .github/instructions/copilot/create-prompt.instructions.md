---
file_type: "instructions"
title: "How to Create a Copilot Prompt"
description: "Guide for authoring new Copilot prompt files used in automation, support, and agent flows."
version: "v1.0"
last_updated: "2025-10-23"
owners: ["LightSpeedWP Engineering"]
tags: ["copilot", "prompt", "instructions", "ai"]
status: "active"
apply_to: [".github/prompts/*.prompt.md"]
references:
  - "../copilot.instructions.md"
  - "../../COPILOT_TEMPLATE/template.prompt.md"
  - "../../prompts/prompts.md"
  - "../markdown-style-guide.instructions.md"
---

# How to Create a Copilot Prompt

## Steps

1. **Start from the prompt template:**  
   Use [COPILOT_TEMPLATE/template.prompt.md](../../COPILOT_TEMPLATE/template.prompt.md).
2. **Edit front matter:**  
   - file_type: "prompt"
   - title, description, owners, version, status, etc.
3. **Define clear outcomes, user input requirements, and expected outputs.**
4. **Add references to supporting instructions, prompts, and templates.**
5. **Update [prompts.md](../../prompts/prompts.md) and [copilot.instructions.md](../copilot.instructions.md) to index your new file.**

---

For style and formatting help, see [Markdown Style Guide](../markdown-style-guide.instructions.md).