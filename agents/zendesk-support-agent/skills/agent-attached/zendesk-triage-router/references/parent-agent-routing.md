# Parent-agent routing contract

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
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![events-issue-pr-metadata](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml)
[![issue-management](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml)
[![pr-workflow](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml)
[![project-management](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml)
[![release-orchestration](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml)
[![reporting-metrics](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml)
<!-- BADGES-END -->

Use this reference when the router runs inside a shared workspace agent, when a canonical Zendesk-prefixed companion workflow may be unavailable, or when the route needs a plain-language fallback.

## Purpose

The router has two separate decisions:

1. **Canonical intent**: the Zendesk-first workflow that should own the next support action.
2. **Executable route**: the canonical workflow that is actually attached to the parent agent and can be invoked in the current run.

Keep those separate. Do not claim a workflow is executable unless it is attached to the parent agent.

## Resolution order

For every routing result:

1. Decide the canonical Zendesk-prefixed workflow from the support job and requested deliverable.
2. Check whether that canonical workflow is attached.
3. If the canonical workflow is attached, recommend it as the primary workflow.
4. If the canonical workflow is not attached, do not emit a legacy non-prefixed route. Describe the needed support action in plain language.
5. Never route to deprecated `ticket-triage` as an active workflow; first-pass triage is embedded in `zendesk-triage-router`.
6. Never route to Linear, GitHub, Asana, or project planning by default just because no support workflow is attached.

Use `workflow-namespace-map.yaml` to verify canonical Zendesk-prefixed names.

## Output pattern when canonical workflow is attached

```md
## Recommended route

- Primary workflow: `zendesk-draft-response`
- Optional supporting workflow: `none`

## Why this route fits

The requested deliverable is a customer-facing reply based on confirmed support facts.

## Next deliverable

Draft the customer update with confirmed facts, unknowns, and safe next steps.
```

## Output pattern when no matching workflow is attached

```md
## Recommended route

- Primary workflow: plain-language support action
- Optional supporting workflow: none

## Availability note

No attached workflow is available for the canonical `zendesk-draft-response` route, so do not claim that a skill can be invoked or use a legacy non-prefixed route.

## Why this route fits

The requested deliverable is still a customer-facing support reply, but this shared agent does not appear to have the reply-drafting workflow attached.

## Next deliverable

Draft a customer-facing support response from confirmed facts, separating knowns, unknowns, and any requested customer action.
```

## Shared-agent guardrails

- Treat the parent agent's actual attached skill directory as the source of truth.
- Do not infer skill availability from this package's reference files.
- Do not use the user who packaged the skill as the assumed permission baseline.
- If connector evidence is unavailable, continue from pasted evidence and state the limitation.
- Prefer a safe plain-language next action over a confident but unavailable route.

---

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*
