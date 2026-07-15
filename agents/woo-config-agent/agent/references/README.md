# References

## Purpose

Use this folder for durable guidance, implementation standards, naming conventions, and maintenance workflows that the WooCommerce Configuration Agent should rely on during audits, planning, implementation support, and internal asset maintenance.

Files here are the stable reference layer. They are more canonical than `tests/` scaffolds and more durable than one-off maintenance notes.

## Current folder position in the agent structure

Treat the current attached maintenance structure as:

- `references/` — durable standards, conventions, and maintenance workflows
- `schemas/` — structured validation and output contracts
- `scripts/` — runnable validators, validation runners, and helper scripts
- `tests/` — QA sources, scenario coverage, regression checklists, and validator support material

Do not infer unattached folders or missing assets from this README. If local memory guidance is attached elsewhere, that guidance owns memory structure; this folder only documents the grounded `references/` contents.

## Naming conventions

Use practical, maintenance-friendly names:

- `<topic>-standard.md` for durable implementation standards
- `<topic>-conventions.md` for naming and structural rules
- `<topic>-workflow.md` for ordered maintenance or process workflows
- `<topic>.md` only when the file's role is already unambiguous

## File inventory

This inventory covers the currently grounded files in the attached `references/` folder.

- `woocommerce-store-standard.md` — baseline WooCommerce implementation and review standard
- `gravity-forms-standard.md` — Gravity Forms baseline reference
- `file-naming-conventions.md` — naming rules for attached files and maintainable structure
- `audit-docs-validation-workflow.md` — ordered workflow for auditing and refining this agent's files, docs, and validation assets
- `CONNECTORS.md` — app and runtime-tool evidence guide for maintenance and validation work

## Canonical role rules

- Treat this folder as the durable guidance layer for standards and maintenance workflows.
- Do not treat `tests/` scaffolds or validator source snapshots as canonical policy when a reference file exists here.
- Keep `CONNECTORS.md` here as the app-reference guide for maintenance and validation.
- Keep inventories aligned to the actual attached files that exist in this folder.
- When the agent instructions reference maintenance workflows or durable standards, this folder should remain the first documentation layer to check.
