# Changelog

## 1.4.0 - 2026-07-03

### Added
- [reference] Added `references/mutation-proposal-schema.md` for machine-readable mutation proposal fields, review rules, and JSON examples.
- [tooling] Added `scripts/validate_mutation_proposals.py` to validate JSON and JSONL proposal records before review or approved application.
- [evaluation] Added proposal validation guidance to the evaluation pack.
- [output] Added a machine-readable mutation proposal template.
- [quality] Added proposal-record validation to the pre-package quality gate.

### Evaluation
- Ran Python syntax compilation for all scripts.
- Smoke-tested the mutation proposal validator with valid and invalid JSONL records.
- Smoke-tested existing observation, archive, and quality scripts.
- Ran the local quality gate and standard skill packager.

### Safety and rollback
- Risk level: Low.
- Approval level: Local package only.
- Rollback: restore the previous 1.3.0 package or remove the mutation proposal schema, validator script, template additions, and `SKILL.md` helper-script references.

## 1.3.0 - 2026-07-03

### Added
- [workflow] Added repeat-improvement guidance for continued mutation requests, including when to pause rather than keep adding speculative rules.
- [reference] Added `references/improvement-backlog.md` for backlog statuses, prioritisation rules, saturation checks, and batch selection.
- [reference] Added `references/quality-gates.md` for pre-package scope, structure, instruction, safety, evaluation, and packaging checks.
- [tooling] Added `scripts/check_skill_quality.py` for local static quality checks before packaging.
- [output] Added improvement backlog and quality gate report templates.

### Evaluation
- Ran Python syntax compilation for all scripts.
- Smoke-tested observation normalisation and archive validation.
- Ran `scripts/check_skill_quality.py --skill-dir . --strict`; initial run caught generated `__pycache__` files, then passed after cleanup.

### Safety and rollback
- Risk level: Low to Medium.
- Approval level: Local package only.
- Rollback: restore the previous 1.2.0 package or remove the added references/script/templates and restore the prior `SKILL.md` reference list.

## 1.2.0 - 2026-07-03

### Added
- [reference] Added archive and versioning guidance with version bump rules, decision record fields, and rollback examples.
- [evaluation] Added a scenario-based evaluation pack for trigger, routing, safety, archive, and variant comparison checks.
- [routing] Added concrete positive, negative, and edge-case scenarios for trigger and handoff testing.
- [tooling] Added `scripts/validate_evolution_archive.py` for JSONL archive schema checks.
- [output] Added mutation decision record and variant comparison templates.

### Evaluation
- Smoke-tested the existing observation normaliser and new archive validator.
- Repackaged the complete skill as `skill.zip`.

### Safety and rollback
- Risk level: Low to Medium.
- Approval level: Local package only.
- Rollback: restore the previous 1.1.0 package or remove the added references/script and restore the prior `SKILL.md` reference list.


## 1.1.0 - 2026-07-03

### Changed
- Added quick improvement audit mode for lightweight skill review requests.
- Added explicit trigger and routing examples for common skill-evolution requests.
- Added reusable evaluation examples for trigger accuracy, approved application, routing, safety gates, and archive quality.
- Added evidence quality labels for confirmed, inferred, unverified, and blocked observations.
- Added approval-level distinctions for proposal, local package, connected edit, publication, and permission changes.

### Verified
- Confirmed `scripts/evolution_log.py` writes JSONL records correctly in a local smoke test.

### Safety and rollback
- Risk level: Low to Medium.
- Rollback: restore the previous `SKILL.md`, `references/evolution-protocol.md`, `references/output-templates.md`, and `references/safety-and-governance.md` from the archived baseline.
