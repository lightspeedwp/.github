---
name: lightspeed-project-pack-exporter
description: Use when a LightSpeed project needs a clean markdown project pack, delivery archive, PRD-task handoff pack, review pack, or ZIP-ready export of planning artefacts and source notes.
---

# LS Project Pack Exporter

## Purpose

Export PRD, intake, research, estimate, task, QA, approval, status, release, decision, assumption, and evidence artefacts into a clean local markdown project pack. This skill should package what exists clearly and mark what is missing rather than inventing artefacts.

## Shared LightSpeed lifecycle contract

Use the current user request as the highest-priority source. Then use current conversation context, attached files, existing project-state records, existing skill files, references, templates, examples, and memory defaults in that order.

Do not rewrite source artefacts unless explicitly asked. Warn before packaging sensitive data.

## Request shapes

Use this skill for requests like:

- "Create a markdown handoff pack for this project."
- "Assemble the planning artefacts into a clean export structure."
- "Build a project archive with source notes and a review checklist."

Success means producing a clear folder structure, an index, source notes, validation status, and next action guidance for any missing pieces.

## Workflow

1. Read `references/export-structure.md`, `references/file-naming.md`, and `references/source-notes-rules.md`.
2. Inventory available artefacts and separate missing artefacts.
3. Build the proposed folder structure.
4. Use `templates/pack-index.md`, `templates/source-notes.md`, `templates/review-checklist.md`, and `templates/project-pack-readme.md`.
5. If a build script is present, use or describe dry-run validation rather than implying an opaque export step.

## Output contract

Return:

1. proposed folder structure
2. included artefacts
3. missing artefacts
4. generated index
5. source notes
6. review checklist
7. validation status
8. next action

## Boundaries

Do not:

- rewrite source artefacts unless explicitly asked
- invent missing artefacts
- package sensitive data without warning
- replace PRD review
- assume cloud storage or connector access

## Supporting Files

- `references/export-structure.md` — pack layout rules.
- `references/file-naming.md` — naming rules.
- `references/source-notes-rules.md` — source-note guidance.
- `references/cross-skill-routing.md` — downstream routing rules.
- `templates/pack-index.md` — index structure.
- `templates/source-notes.md` — source notes structure.
- `templates/review-checklist.md` — review checklist structure.
- `templates/project-pack-readme.md` — pack readme structure.
- `schemas/project-pack.schema.json` — pack shape.
- `scripts/build_project_pack.py` — optional deterministic builder or dry-run helper.
- `tests/fixtures/sample-pack/` — sample pack fixture.
- `examples/project-pack-example.md` — sample export.
- `tests/fixtures/project-pack-cases.md` — manual validation cases.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
