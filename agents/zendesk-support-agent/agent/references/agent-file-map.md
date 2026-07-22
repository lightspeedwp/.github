# Agent File Map

This file tree is the durable operating contract for the Zendesk Support Agent. The main instructions define runtime behavior, while these files define the reusable standards, validation assets, and reference materials that keep the agent coherent and testable.

## Core purpose

- Keep the agent Zendesk-first for support triage, investigation, replies, handoffs, escalations, backlog reporting, documentation review, and downstream engineering handoff preparation.
- Keep every attached app represented clearly without letting secondary apps displace the support workflow.
- Keep routing, outputs, memory, validation, and file quality aligned.

## Core operating references

- `business-context.md`: business scope, product terminology, brand names, escalation boundaries, LightSpeed-specific context, and durable support vocabulary.
- `references/agent-file-map.md`: this top-level file inventory and usage guide.
- `references/default-operating-mode.md`: the default Zendesk-first operating mode, completion standards, and default workflow posture.
- `references/app-usage-matrix.md`: canonical app roles, read/write boundaries, and secondary-app selection rules.
- `references/skill-collision-inventory.md`: the skill directory, routing priorities, supporting-skill pairings, and collision rules.
- `references/output-standards.md`: reusable output rules, template usage, example usage, and consistency standards.
- `references/agent-memory-policy.md`: approved memory files, storage boundaries, schema contracts, and maintenance rules.
- `references/qa-standards.md`: the quality bar for instructions, skills, references, templates, examples, fixtures, profiles, schemas, scripts, and tests.
- `references/validation-guide.md`: the validation inventory, execution order, pass criteria, and common failure patterns.
- `references/instructions.snapshot.md`: the current instructions snapshot used by validators.

## Reusable asset folders

### Templates and examples

- `templates/`: canonical Markdown templates for repeated deliverables.
- `examples/templates/`: paired examples for every template in `templates/`.
- `fixtures/`: sample support inputs used to verify routing, evidence handling, and output quality.
- `profiles/`: reusable operating profiles; `profiles/default-support-profile.yaml` is the default profile for this agent.

### Structured contracts

- `schemas/`: JSON schemas for profiles, fixtures, markdown contracts, memory files, and other structured validation rules.
- `examples/memory/`: example memory files that stay aligned with the live memory contract.
- `memory/`: approved runtime memory files only.

### Validation layer

- `scripts/`: validation and contract-check scripts for references, routing, templates, examples, schemas, memory, fixtures, and profiles.
- `tests/`: smoke tests, validation checklists, routing tests, app-usage checks, memory tests, markdown-contract tests, and execution runbooks.

## Usage rules

- Read the core operating references before any broad rewrite of the instructions.
- Keep Zendesk as the primary workflow anchor.
- Keep app, skill, memory, and output standards in their owning reference files instead of scattering duplicate rules.
- When a repeated deliverable changes, update the template, paired example, validation schema or markdown contract, and tests together.
- Refresh `references/instructions.snapshot.md` after every material instruction rewrite.
- Prefer improving existing artifacts over creating duplicate files with overlapping responsibilities.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
