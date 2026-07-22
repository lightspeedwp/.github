# Rebuild guide

## Purpose

Explain how to rebuild the PRD Factory & Planner agent with functional parity under another user.

## Attached uploaded Builder skills vs workspace-shared skills

### Attached uploaded Builder skills

These are skills attached directly on this agent as uploaded Builder skills. They can remain useful, but they do not count as exact workspace-shared parity unless the exact expected shared name is also attached.

### Workspace-shared skills

These are shared skills available in the workspace skill directory. For this rebuild, the exact shared names in `references/skill-parity-audit.md` are the source of truth for parity.

## Which skills are expected

See `references/skill-parity-audit.md` for the exact expected inventory.

## Which skills are currently attached

The agent currently has:

- 20 exact expected shared skills attached
- 10 local uploaded Builder skills still attached as helper layers
- 4 unresolved expected shared-skill gaps

## Which skills were reattached automatically

The following exact shared matches were reattached during the repair pass:

- lightspeed-project-intake-router
- lightspeed-prd-task-pack-exporter
- lightspeed-requirements-traceability-mapper
- lightspeed-approval-gate-manager
- lightspeed-change-request-router
- lightspeed-project-status-reporter
- lightspeed-acceptance-test-planner
- lightspeed-qa-findings-router
- lightspeed-release-handoff-generator
- lightspeed-task-breakdown-planner
- lightspeed-github-issue-drafter
- lightspeed-project-memory-manager
- lightspeed-prd-generator
- lightspeed-prd-task-reviewer
- lightspeed-implementation-plan-generator
- lightspeed-project-researcher
- lightspeed-prd-task-manager
- wordpress-plugin-packaging-review
- content-file-validator
- markdown-content-validator

## Which skills still need manual resolution

- lightspeed-figma-wordpress-technical-brief
- evidence-locker
- lightspeed-intake-onboarding
- lightspeed-launch-task-router

Use `rollout/skill-parity-manual-resolution-checklist.md` to resolve those four remaining exact-name gaps safely and record the outcome.

## How parity was checked

1. Built the real attached-skill inventory from current agent configuration.
2. Queried the workspace-shared skill directory against the exact expected list.
3. Reattached only exact shared matches that existed and were not already attached.
4. Left near matches unresolved.
5. Regenerated the audit report after repair.

For choosing the right verification or repair prompt during handoff, use `docs/phase-4-index.md`.

## How to detect missing attachments

A skill is a missing attachment when its exact expected name exists in workspace-shared skills but is not attached.

## How to detect source mismatches

A source mismatch exists when:

- a local uploaded Builder skill is attached instead of the exact expected shared skill, or
- the expected exact skill exists only outside workspace-shared scope, or
- only a near-match variant exists.

## How to detect documentation drift

Documentation drift exists when the documented inventory, routing rules, or rebuild steps no longer match the real attached-skill state.

## How to verify per-skill specs against actual attached skills

Use the current attached inventory plus `references/SKILL_INVENTORY.md` and `references/skill-routing-spec.md`. Treat exact names as the baseline. If the name is wrong or the documented role points to a different skill, the spec is not current.

## How to safely reattach exact matches without inventing replacements

- Attach only the exact shared name.
- Do not attach near matches.
- Do not create substitute skills during parity repair.
- If an exact name exists only in another scope or multiple ambiguous copies exist, stop and flag it for manual resolution.

## Folder purpose across the scaffold

- `assets/`: reusable supporting artefacts such as diagrams, images, visual references, and downloadable support items.
- `docs/`: operating and rebuild guidance.
- `examples/`: worked examples.
- `examples/templates/`: filled template examples.
- `examples/memory/`: realistic memory examples.
- `fixtures/`: test inputs and validation fixtures.
- `intake/`: intake scaffolds and routing assets.
- `memory/`: durable memory guidance.
- `memory/defaults/`: canonical starter memory files.
- `memory/schemas/`: validation-oriented memory schemas.
- `profiles/`: operating profiles or persona variants where relevant.
- `schemas/`: non-memory schema files.
- `references/`: connector, skill, and maintenance reference docs.
- `rollout/`: launch and rebuild checklists.
- `scripts/`: executable validators.
- `tests/`: workflow and validation test definitions.
- `templates/`: canonical output templates.
- `business-context.md`: high-level business and quality context for the agent.

## Parity standard

Do not claim full parity until every expected shared skill is either already attached or reattached as an exact workspace-shared match.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
