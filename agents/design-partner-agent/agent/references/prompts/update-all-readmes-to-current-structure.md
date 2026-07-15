# Update all README files to the current agent file structure

Audit every `README.md` file in the agent package and update each one so it reflects the latest visible file and folder structure.

## Goal

Make all README files accurate, current, and consistent with the agent's actual folders, files, and workflow naming.

## Required workflow

1. Refresh your understanding of the current agent file tree from the visible file inventory.
2. Open every visible `README.md` file before editing.
3. For each README, compare its documented files, folders, and relationships against the current visible structure.
4. Update outdated references, missing file lists, stale workflow names, and folder relationship notes.
5. Do not invent hidden files or folders that are not grounded in the current visible file tree.
6. If the visible file list is truncated, write conservatively and only describe what is currently confirmed.

## What to update

For each README, correct as needed:

- folder purpose
- naming conventions
- listed files in that folder
- references to related folders
- validator or workflow notes that depend on current package structure

## Specific checks

- Ensure `templates/README.md` lists the current template files and matches current workflow names.
- Ensure `examples/README.md` lists the current example files and describes examples as precedent rather than strict truth.
- Ensure `schemas/README.md` lists the current schema files and only claims validation coverage that is actually grounded.
- Ensure `memory/README.md` reflects the current memory files and their roles.
- If other folders now contain `README.md` files, audit and update those too.
- If a new folder such as `prompts/` exists, update related README references only where that relationship is materially useful.

## Writing rules

- Keep the README style concise and operational.
- Use clear Markdown headings and bullets.
- Preserve folder-local guidance unless it is stale or contradicted by the current file tree.
- Prefer exact filenames when listing files.
- Do not describe files that are not visible in the current agent file tree.

## Deliverable

Update the relevant `README.md` files in place so they reference the latest confirmed file and folder structure.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
