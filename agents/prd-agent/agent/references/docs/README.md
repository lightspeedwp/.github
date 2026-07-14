# docs/

## Purpose
Store the human-readable operating, rebuild, sequencing, and quality guidance for the PRD Factory & Planner agent.

## Current files in this folder
- `rebuild-guide.md` — the main rebuild and parity guide, including shared-skill parity expectations and manual-resolution references.
- `agent-operating-model.md` — the core operating stance, stage model, and auditability expectations for the agent.
- `phased-builder-sequence.md` — the rebuild sequence by phase, including current skill-parity status and unresolved gaps.
- `phase-4-index.md` — the prompt-selection guide for Phase 4, 4B, 4C, 4D, and 4E skill-parity workflows.

## Naming conventions
- Use lowercase kebab-case.
- Name files by the operating concern they explain, such as `rebuild-guide.md` or `agent-operating-model.md`.
- Keep docs durable, procedural, and rebuild-oriented rather than tied to one short-lived project.

## Important distinctions
- `rebuild-guide.md` is the primary reference for parity, rebuild order, and verification.
- `phased-builder-sequence.md` explains where each stage fits in the larger rebuild process.
- `phase-4-index.md` is specifically for choosing the right skill-parity audit or repair path.
- Reference inventories and audit records belong in `references/`, while rollout checklists belong in `rollout/`.
