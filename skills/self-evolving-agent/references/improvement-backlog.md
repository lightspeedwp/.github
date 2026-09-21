# Improvement Backlog

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
[![workflow-lint](https://github.com/lightspeedwp/.github/actions/workflows/workflow-lint.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/workflow-lint.yml)
<!-- BADGES-END -->

Use this reference when a user repeatedly asks to continue improving a skill, agent, prompt, or workflow after one or more accepted mutation batches.

## Purpose

Prevent endless, low-value refinement by turning future ideas into a governed backlog. Continue only when the next mutation has clear value, bounded risk, and a practical evaluation path.

## Backlog statuses

| Status | Meaning | Next action |
|---|---|---|
| `candidate` | Plausible improvement, not yet evaluated. | Add evidence and expected value. |
| `ready` | Evidence, target, risk, and evaluation are clear. | Include in the next bounded mutation set. |
| `parked` | Potentially useful but not worth doing now. | Revisit only with new evidence. |
| `blocked` | Missing approval, source, tool access, or safety basis. | Identify the smallest missing input. |
| `rejected` | Not useful, unsafe, duplicative, or out of scope. | Record only if it prevents repeat work. |
| `done` | Applied, evaluated, and archived. | Link to version/changelog. |

## Prioritisation rule

Promote a candidate to `ready` only when all are true:

- It improves a named pressure from `references/evolution-protocol.md`.
- It has confirmed or clearly stated inferred evidence.
- It can be tested with a small scenario, script, checklist, or review.
- It does not weaken an existing approval gate, routing boundary, or safety rule.
- It has a rollback path.

## Stop or pause conditions

Stop improving and report a saturation point when:

- the next changes are mostly wording polish with no behavioural benefit;
- the skill is becoming harder to use because references or rules are growing faster than value;
- a proposed change belongs in a specialist skill instead of this one;
- the next useful step requires real-world usage feedback, not more speculative mutation;
- validation passes and no high-value `ready` candidates remain.

Use this wording when appropriate:

> Further improvement is possible, but the next changes are speculative. I recommend testing the current package on real tasks before adding more instructions.

## Backlog item format

```yaml
id: evo-backlog-001
status: candidate
mutation_type: evaluation
target: references/evaluation-pack.md
summary: add scenario for connector permission changes
evidence_quality: inferred
expected_value: improves safety regression coverage
risk_level: low
evaluation: run scenario checklist against the updated skill
rollback: remove the added scenario
```

## Batch selection checklist

Before applying another batch, answer:

- What changed in the previous version?
- Which improvement pressure is still weak?
- Are we adding behaviour, validation, or only more words?
- Can the batch be evaluated locally?
- Does it keep `SKILL.md` compact and move detail into references?
- Is the result easier for another ChatGPT instance to use?

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
