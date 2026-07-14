# rollout/

## Purpose
Store rollout, handoff, rebuild-readiness, and go-live checklists that help another user verify the agent is safe to hand off or make live.

## Current files in this folder
- `rebuild-rollout-checklist.md` — the main rollout and rebuild verification checklist covering draft review, validation, tests, app checks, skill checks, memory checks, starter prompt checks, smoke tests, and go-live review.
- `skill-parity-manual-resolution-checklist.md` — the explicit manual-resolution path for the remaining exact-name shared-skill parity gaps.

## Naming conventions
- Use lowercase kebab-case.
- Name files after the rollout or handoff control they represent, such as `rebuild-rollout-checklist.md` or `skill-parity-manual-resolution-checklist.md`.
- Keep rollout files operational, checklist-driven, and durable across rebuilds.

## Important distinctions
- `rebuild-rollout-checklist.md` is the broad handoff and go-live checklist.
- `skill-parity-manual-resolution-checklist.md` is the narrow manual-resolution path for unresolved shared-skill gaps.
- Prompt-selection guidance for audit vs repair work lives in `docs/phase-4-index.md`, while rollout records the practical execution and sign-off path.
