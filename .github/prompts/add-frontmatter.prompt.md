---
description: "Normalize and ensure complete YAML frontmatter in markdown or instruction files, using the latest standards."
mode: "edit"
model: "GPT-4"
---

**Task:**  
Inspect the frontmatter of the current Markdown or instruction file. If frontmatter is missing or incomplete, add or update it to include all required fields based on the latest Copilot frontmatter standards defined in the [Copilot Frontmatter Instructions](../instructions/copilot-frontmatter.instructions.md).

**Actions:**

1. If frontmatter is missing, insert a new YAML frontmatter block at the very top.
2. Ensure all **required keys** are present:
   - `version` (default: `"v0.1.0"`)
   - `last_updated` (default: today's UTC date, `"YYYY-MM-DD"`)
   - `owners` (default: `["lightspeedwp/maintainers"]`)
   - `file_type` (infer: `"saved_reply"`, `"instruction"`, `"template"`, etc.)
   - `category` (infer from file path, folder, or usage)
   - `description` (summarize file purpose in a single sentence)
3. Optionally, add recommended fields:
   - `tags`, `language`, `scope`, `status`, `visibility`, `related_docs`
4. **Preserve** any existing fields and values in the frontmatter.
5. **Do not alter** the main body or content of the file.

**Reference:**  
See [frontmatter schema](../../schemas/frontmatter.schema.json) for requirements.
