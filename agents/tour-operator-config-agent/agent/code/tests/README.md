# Tests

Use this folder for reusable test plans, validation checklists, regression checks, source snapshots, routing snapshots, and validation guidance for the Tour Operator Website Configuration Agent.

## Folder purpose

This folder supports QA and validation work for:

- the agent's file tree and file references
- validation runner behaviour
- instruction-to-file consistency
- attached-skill routing and routing anti-drift checks
- app-usage consistency
- starter-prompt and short-description consistency
- Tour Operator, Gravity Forms, SEO, and launch-readiness QA assets

## Recommended usage order

1. Start with `validation-readme.md` for the validation overview and runner guidance.
2. Use `regression-checklist-master-validation.md` to decide when a full validation pass is required.
3. Run `bash scripts/run-master-validation.sh` for the automated validation chain when a broad check is needed.
4. Use targeted plans, checklists, and source snapshots for the specific area under review.
5. Refresh source snapshot files in `tests/` when the linked agent configuration, routing posture, or validation ownership changes.

## Naming conventions

Prefer these patterns where practical:

- `test-plan-<topic>.md`
- `qa-checklist-<topic>.md`
- `regression-checklist-<topic>.md`
- `<topic>-consistency-source.md`
- `<topic>-snapshot.md`
- `<topic>-validation.md`

## Current file inventory

### Validation guidance and regression
- `validation-readme.md`
- `regression-checklist-master-validation.md`
- `schema-validation-tests.md`

### QA checklists and test plans
- `master-qa-checklist.md`
- `pre-launch-qa-checklist.md`
- `seo-launch-checklist.md`
- `test-plan-gravity-forms.md`
- `test-plan-file-schema-validation.md`
- `qa-checklist-file-schema-validation.md`

### Source snapshots for validators and routing checks
- `instruction-file-consistency-source.md`
- `skill-routing-snapshot.md`
- `app-usage-consistency-source.md`
- `starter-prompt-consistency-source.md`
- `short-description-consistency-source.md`

## Maintenance rules

- Keep this folder focused on reusable QA and validation assets rather than one-off task notes.
- Treat source snapshot files as supporting fixtures for validators, not as long-form reference docs.
- Keep routing snapshots aligned with the currently attached specialist skills and current instruction routing.
- Make sure Tour Operator routing checks reflect the current attached routing posture rather than implying an unattached Tour Operator specialist skill.
- Treat attached-skill routing status and skill-package readability as separate checks; routing snapshots may confirm attachment and ownership without proving that the package files were opened successfully.
- Update this README when files are added, removed, renamed, or repurposed.
- If another folder becomes part of the validation flow, reflect that change here and in `validation-readme.md`.
