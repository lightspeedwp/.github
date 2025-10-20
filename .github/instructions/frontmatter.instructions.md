---
applyTo: ['**/*.md', '**/*.instructions.md', '**/*.prompt.md']
description: "Standardise YAML frontmatter fields across docs, prompts and instructions."
last_updated: "2025-10-19"
version: "v1.0"
owners: ["LightSpeed Engineering"]
---

# Mission
Define a consistent YAML frontmatter schema for all LightSpeed documentation, instruction and prompt files to ensure traceability and machine readability.

# Required Fields
- `version`: semantic version of the file (e.g. `"v1.0"`). Increment this when material changes occur.
- `last_updated`: ISO date when the file was last materially updated (e.g. `"2025-10-19"`).
- `owners`: list of teams or individuals responsible for maintaining the file.

# Optional Fields
- For **instructions**: `applyTo` (glob patterns of applicable files), `description` (short description).
- For **prompts**: `description` (purpose), `mode` (e.g. `edit` or `ask`), `model` (e.g. `GPT-4`), `tools` (if specific tools are required).
- For **documentation**: `status` (draft, stable, deprecated), `links` (related documentation), `tags` (categorisation).

# Best Practices
- Use kebab-case for all frontmatter keys.
- Keep values machine‑friendly (e.g. ISO dates, semantic version strings).
- Avoid including sensitive data in frontmatter.

# Examples
```yaml
---
version: "v1.2"
last_updated: "2025-10-19"
owners: ["LightSpeed Engineering"]
applyTo: ['**/*.php']
description: "Apply WordPress PHP standards."
---
```

# References
- LightSpeed YAML Frontmatter Cheat Sheet for GitHub Templates and AI Agent Configurations (internal)
- LightSpeed YAML Frontmatter Schemas (internal)
