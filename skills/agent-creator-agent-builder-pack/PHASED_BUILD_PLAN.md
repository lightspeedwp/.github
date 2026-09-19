# Phased Build Plan

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](https://img.shields.io/badge/Docs Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](https://img.shields.io/badge/Labeling Governance-OK-success.svg)
![Main Branch Guard](https://img.shields.io/badge/Main Branch Guard-OK-success.svg)
![Metadata Governance](https://img.shields.io/badge/Metadata Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](https://img.shields.io/badge/Template Enforcement-OK-success.svg)
![Validate PR Template](https://img.shields.io/badge/Validate PR Template-OK-success.svg)
![Badges: Documentation Update](https://img.shields.io/badge/Badges: Documentation Update-OK-success.svg)
![Badges: Health Check](https://img.shields.io/badge/Badges: Health Check-OK-success.svg)
![Badges: README Status Maintenance](https://img.shields.io/badge/Badges: README Status Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](https://img.shields.io/badge/Badges: Workflow Inventory Audit-OK-success.svg)
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![branch-validation-metrics-aggregator](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![pr-template-routing](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml)
[![validate-specifications](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml)
<!-- BADGES-END -->

Use this plan to keep Agent Builder work small, reviewable, and resilient to prompt-size limits. Confirm completion of each phase before continuing.

## Phase 0 — Intake and routing

Goal: confirm the agent type, intended builder outcome, scope, and whether another LightSpeed specialist skill should own the work.

Inputs:

```text
README.md
AGENT_BUILDER_SPEC.md
ROUTING_AND_HANDOFF.md
references/lightspeed-team-skill-routing.md
```

Output:

```text
Confirmed build route and blocking gaps.
```

Completion checks:

- [ ] Deliverable type confirmed.
- [ ] Agent Creator is the right owner or routing handoff is documented.
- [ ] Blocking gaps are listed.

## Phase 1 — Core agent definition

Goal: build or refine the agent mission, boundaries, operating rules, and system prompt.

Inputs:

```text
AGENT_REQUIREMENTS.md
AGENT_SYSTEM_PROMPT.md
TOOL_AND_PERMISSION_MATRIX.md
QUALITY_CHECKLIST.md
```

Output:

```text
Draft or updated agent system prompt.
```

Completion checks:

- [ ] Mission and scope are clear.
- [ ] Non-goals and routing boundaries are explicit.
- [ ] System prompt uses UK English and LightSpeed delivery language.

## Phase 2 — Outputs, schemas, and templates

Goal: align expected outputs with templates and schemas.

Inputs:

```text
OUTPUT_TEMPLATES.md
templates/
schemas/
references/output-template-library.md
```

Output:

```text
Validated output structure and reusable templates.
```

Completion checks:

- [ ] Every output has a reusable template.
- [ ] Every structured output has schema coverage or a documented reason not to.
- [ ] `validate-template-schema-alignment.py` passes.

## Phase 3 — Memory pack

Goal: create or refine the agent's durable memory model.

Inputs:

```text
memory/
references/agent-memory-pack-guide.md
schemas/source-priority.schema.json
```

Output:

```text
Memory rules, defaults, source priorities, decisions, todos, and open questions aligned.
```

Completion checks:

- [ ] Durable defaults are separated from one-off task notes.
- [ ] Sensitive or customer-specific memory is blocked unless explicitly authorised.
- [ ] `validate-memory-hygiene.py` and `validate-source-priority-consistency.py` pass.

## Phase 4 — Validation pack

Goal: create or refine validation rules and helper scripts.

Inputs:

```text
validation/
scripts/
tests/
fixtures/
references/agent-validation-pack-guide.md
```

Output:

```text
Validation plan and script coverage confirmed.
```

Completion checks:

- [ ] Required validators are present.
- [ ] Each validator has a purpose, inputs, outputs, failure conditions, command, and test coverage.
- [ ] `scripts/validate-all.py` passes.

## Phase 5 — Examples, rollout, and final review

Goal: check examples, test workflows, rollout guidance, and final handoff quality.

Inputs:

```text
examples/
fixtures/
tests/
rollout/
FILE_MANIFEST.md
```

Output:

```text
Review-ready agent pack with clear adoption notes.
```

Completion checks:

- [ ] Examples cover rough notes, routing, memory, validation failure, and Builder import.
- [ ] Rollout includes adoption checklist, review gates, and changelog.
- [ ] Human-review gates are visible in the final handoff.

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

_This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP._
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)
