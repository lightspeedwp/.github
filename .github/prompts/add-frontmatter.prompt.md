---
description: "Insert or normalise YAML frontmatter (version, last_updated, owners)."
mode: "edit"
model: "GPT-4"
---
Inspect the frontmatter of the current Markdown or instruction file. Add missing keys (`version`, `last_updated`, `owners`) with sensible defaults and preserve existing fields. Do not alter the body of the document. If the file lacks frontmatter, insert a new block at the top.
