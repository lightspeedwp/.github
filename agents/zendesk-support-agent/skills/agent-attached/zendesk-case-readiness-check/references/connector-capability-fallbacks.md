# Connector capability fallbacks

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
[![labeling-unified](https://github.com/lightspeedwp/.github/actions/workflows/labeling-unified.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/labeling-unified.yml)
[![pr-template-routing](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml)
[![validate-specifications](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml)
[![workflow-lint](https://github.com/lightspeedwp/.github/actions/workflows/workflow-lint.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/workflow-lint.yml)
<!-- BADGES-END -->

Use this reference when the skill runs inside a shared workspace agent where each teammate may have different connector access, permissions, saved views, or account-specific context.

## Capability states

Classify tool access before relying on connector evidence.

| State | Meaning | Safe behaviour |
|---|---|---|
| Available and relevant | The connector can read the needed case evidence for the current user. | Use it as evidence and cite or describe the source normally. |
| Available but incomplete | The connector works, but the ticket, field, side conversation, attachment, or linked record is missing or inaccessible. | Use the available evidence, name the missing item, and do not infer it. |
| Unavailable in this agent | The connector is not attached, not authorised, or the current user lacks access. | Assess only supplied evidence and state which Zendesk detail would normally be checked. |
| Not needed | The supplied evidence is enough for the readiness decision. | Do not call extra tools merely to seek perfection. |

## Zendesk-first fallback rules

1. Prefer Zendesk evidence when available.
2. If Zendesk is unavailable, do not block every readiness check automatically.
3. Decide whether the supplied evidence is enough for the target deliverable.
4. Mark the status as `partially ready` or `not ready` only when the missing Zendesk detail materially changes safety, usefulness, or risk.
5. State the smallest missing Zendesk detail, not a broad request for full ticket access.

Good fallback wording:

> I can assess the supplied evidence, but I cannot verify Zendesk ticket fields or conversation history in this agent.

Avoid:

> I checked Zendesk and confirmed...

unless Zendesk was actually available and checked.

## Secondary connector fallback rules

Use Slack, Gmail, Google Drive, GitHub, Linear, Asana, BugHerd, logs, analytics, or admin systems only when the blocking readiness gap cannot be resolved from Zendesk or supplied evidence.

When a secondary connector is unavailable:

- do not invent the missing context;
- do not imply the connector was checked;
- name the exact evidence that would help;
- continue with a readiness status if the current evidence is still sufficient.

## Shared-agent safe source wording

Use wording that survives different users being logged in:

- `Based on the supplied ticket summary...`
- `Zendesk evidence is not available in this agent run...`
- `The next smallest check would be the latest public reply in Zendesk...`
- `If the Zendesk ticket is accessible, check the SLA state and latest internal note before escalating.`

Avoid user-specific wording:

- `Your Zendesk view shows...`
- `I used Ash's saved search...`
- `From your Gmail thread...`
- `The team's Slack history confirms...`

unless that specific source was truly accessed in the current run and is appropriate to mention.

## Capability-aware readiness examples

### Zendesk unavailable, supplied evidence enough

If a pasted ticket includes the customer ask, confirmed workaround, affected product area, and a safe next action, the case may still be `ready` for a customer reply. Note that Zendesk history was not checked, but do not downgrade merely because the connector is absent.

### Zendesk unavailable, risk depends on history

If a customer asks for a refund, compensation, SLA commitment, account-specific exception, or prior promise, mark the case `partially ready` or `not ready` until the relevant Zendesk history or policy note is checked.

### Secondary system unavailable

If engineering logs would help prove root cause but the target deliverable is a customer holding reply, the case may be `ready` for reply while not ready for engineering handoff.

## Minimum fallback output note

When connector evidence is missing, include one sentence in `Missing evidence` or `Next step` that makes the boundary clear:

```markdown
- Blocker: Latest Zendesk public reply and internal note are not available in this agent run; check them before sending a final resolution message.
```

Do not list every inaccessible system. Name only the smallest missing evidence that matters for the next deliverable.

---

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

_Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!_
