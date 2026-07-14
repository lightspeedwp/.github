# Root README Refresh Prompt

Review the root `README.md` against the current attached file tree and tighten it so the top-level file map, folder descriptions, inventories, and maintenance flow stay accurate.

Scope and intent:
- This is a root-documentation refresh task, not a broad rewrite of the agent.
- Treat the current attached file tree, current folder READMEs, and current file contents as the source of truth.
- Focus on the root file map, top-level structure summary, cross-folder relationships, and any stale inventory references in the root README.

Primary goal:
- Keep the root `README.md` accurate, practical, and aligned with the current attached structure.

What to review:
1. The current root `README.md`
2. The current attached file tree
3. Folder-level `README.md` files that define folder roles
4. Current prompt-library and validation-layer references if the root README mentions them

What to check for:
- stale folder or file references
- missing prompt, script, schema, or reference files in the root inventory
- folder descriptions that are too vague, too broad, or no longer grounded in the current file tree
- maintenance-flow steps that assume missing folders, files, or validators
- conflicts between the root README and folder-level READMEs

Editing rules:
- Make the smallest complete set of edits needed.
- Keep the root README practical and maintainer-friendly.
- Preserve still-correct structure descriptions.
- Do not invent folders, files, or responsibilities not present in the current attached file tree.
- If the root README is already aligned, leave it unchanged.

Output:
1. Whether the root README was already aligned
2. Exact sections updated, if any
3. Any remaining top-level documentation gaps worth addressing
