# Mutation Proposal Schema

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](<https://img.shields.io/badge/Docs> Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](<https://img.shields.io/badge/Labeling> Governance-OK-success.svg)
![Main Branch Guard](<https://img.shields.io/badge/Main> Branch Guard-OK-success.svg)
![Metadata Governance](<https://img.shields.io/badge/Metadata> Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](<https://img.shields.io/badge/Template> Enforcement-OK-success.svg)
![Validate PR Template](<https://img.shields.io/badge/Validate> PR Template-OK-success.svg)
![Badges: Documentation Update](<https://img.shields.io/badge/Badges>: Documentation Update-OK-success.svg)
![Badges: Health Check](<https://img.shields.io/badge/Badges>: Health Check-OK-success.svg)
![Badges: README Status Maintenance](<https://img.shields.io/badge/Badges>: README Status Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](<https://img.shields.io/badge/Badges>: Workflow Inventory Audit-OK-success.svg)
[![branch-management](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml)
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![branch-validation-metrics-aggregator](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![events-issue-pr-metadata](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml)
[![issue-management](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml)
[![pr-template-routing](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml)
[![pr-workflow](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml)
[![project-management](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml)
[![release-orchestration](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml)
[![reporting-metrics](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml)
[![validate-specifications](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml)
<!-- BADGES-END -->

Use this reference when a user wants mutation proposals that can be reviewed, compared, archived, or validated before any update is applied.

## Purpose

Make proposed skill, prompt, agent, or workflow changes portable and reviewable. A proposal record should be specific enough for another ChatGPT instance or teammate to understand the problem, decide whether the change is safe, and reproduce the evaluation path.

Use this schema before `references/archive-and-versioning.md`: proposals describe possible changes; archive records describe decisions already made.

## Required fields

Each proposal record must include:

| Field | Type | Meaning |
|---|---|---|
| `id` | string | Stable short identifier such as `mut-001`. |
| `type` | string | One mutation taxonomy label from `SKILL.md`. |
| `target` | string | File, section, prompt, script, or workflow affected. |
| `problem` | string | Observed issue or gap. |
| `change` | string | Proposed alteration. |
| `evidence_quality` | string | `confirmed`, `inferred`, `unverified`, or `blocked`. |
| `expected_benefit` | string | Practical value if accepted. |
| `risk_level` | string | `low`, `medium`, `high`, or `blocked`. |
| `evaluation` | string or object | Scenario, checklist, script, or review method. |
| `rollback` | string | How to undo the change. |
| `verdict` | string | `accept`, `revise`, `hold`, or `reject`. |

## Optional fields

Use optional fields only when they improve review quality:

- `source`: user feedback, file, issue, doc, or conversation note.
- `approval_level`: `proposal`, `local_package`, `connected_edit`, `publication`, or `permission_change`.
- `dependencies`: related proposals that must be accepted first.
- `regression_checks`: list of behaviours that must remain intact.
- `notes`: concise caveats that do not belong in operational instructions.

## JSON example

```json
{
  "id": "mut-004",
  "type": "evaluation",
  "target": "references/evaluation-pack.md",
  "problem": "Scenario checks are manual and easy to omit.",
  "change": "Add machine-readable proposal validation before applying changes.",
  "evidence_quality": "inferred",
  "expected_benefit": "Makes future mutation review more repeatable and easier to audit.",
  "risk_level": "low",
  "evaluation": {
    "method": "script",
    "command": "python scripts/validate_mutation_proposals.py --input proposals.jsonl"
  },
  "rollback": "Remove the schema reference and validator script.",
  "verdict": "accept"
}
```

## Review rules

- Do not accept a proposal with `evidence_quality: blocked` unless the block is resolved first.
- Do not apply a proposal with `risk_level: high` unless the user has explicitly approved that risk and the evaluation path is clear.
- Treat `verdict: accept` as a recommendation unless the user has also approved the required action level.
- Keep proposal records separate from raw private notes, secrets, or customer-specific details.

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*
