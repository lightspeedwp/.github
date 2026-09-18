# Output Templates

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

## Prompt only

Use when the user only needs a copy-ready agent prompt.

Required sections:

- Agent mission.
- Scope and non-goals.
- Inputs and source rules.
- Workflow.
- Tool rules.
- Output format.
- Safety and escalation rules.
- Quality checklist.

Schema: `schemas/output-template.schema.json`.

## Requirements doc

Use when the user needs agent requirements before implementation.

Required sections:

- Verified requirements.
- Assumptions.
- Agent mission.
- Scope and boundaries.
- Inputs and trusted context.
- Related shared team skills and routing.
- Tools and permissions.
- Output requirements.
- Quality checklist.
- Human-in-the-loop and escalations.

Schema: `schemas/agent-requirements.schema.json`.

## Full agent pack

Required artefacts:

- `README.md`
- `AGENT_REQUIREMENTS.md`
- `AGENT_SYSTEM_PROMPT.md`
- `TOOL_AND_PERMISSION_MATRIX.md`
- `OUTPUT_TEMPLATES.md`
- `ROUTING_AND_HANDOFF.md`
- `QUALITY_CHECKLIST.md`
- `FILE_MANIFEST.md`
- Supporting `references/`, `templates/`, and optional scripts.

## Agent Builder spec pack

Required artefacts:

- `README.md`
- `AGENT_BUILDER_SPEC.md`
- `PHASED_BUILD_PLAN.md`
- `AGENT_REQUIREMENTS.md`
- `AGENT_SYSTEM_PROMPT.md`
- `TOOL_AND_PERMISSION_MATRIX.md`
- `ROUTING_AND_HANDOFF.md`
- `OUTPUT_TEMPLATES.md`
- `QUALITY_CHECKLIST.md`
- `FILE_MANIFEST.md`
- `BUILDER_IMPORT_PROMPT.md`
- `business-context.md`
- `references/`
- `templates/`
- `schemas/`
- `memory/`
- `validation/`
- Recommended `examples/`, `fixtures/`, `scripts/`, `tests/`, and `rollout/`.

Schema: `schemas/agent-builder-spec.schema.json`.

## Routing review

Use this format:

```markdown
## Value

## Risk

## Next step

## Routing decision

## Evidence used

## Specialist handoff

## Human-review gates
```

## Validation notes

Every reusable output should have a template or a documented reason why a template is unnecessary. Structured outputs should align with the matching schema.

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*
