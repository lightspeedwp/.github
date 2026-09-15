# Handoff schema reference

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
<!-- BADGES-END -->

Use this reference only when the user asks for structured output, validation, automation-friendly output, downstream conversion support, or when another tool or agent needs a predictable handoff shape.

The default customer-visible output should remain the readable markdown handoff in `SKILL.md` unless structured output is explicitly useful.

## Schema file

Use `schemas/zendesk-handoff.schema.json` as the optional structured-output contract.

The schema captures:

- handoff type;
- support-first problem statement;
- impact;
- target team;
- exact ask;
- urgency and risk;
- confirmed evidence;
- attempted steps;
- blockers;
- assumptions;
- missing evidence;
- sensitivity notes;
- downstream conversion status;
- concise handoff brief.

## When to use structured output

Use the schema when:

- the user asks for JSON;
- the handoff will be consumed by another agent, script, or workflow;
- the user asks for validation or consistency checking;
- the handoff may later become a Linear, GitHub, Asana, BugHerd, Slack, or Zendesk private-note artefact;
- the receiving workflow needs to compare multiple handoffs consistently.

Do not use the schema when:

- the user only wants a quick internal handoff;
- a readable Zendesk private note or Slack message is enough;
- structured output would make the answer harder for a human support teammate to use.

## Field rules

- Put only confirmed facts in `evidence`.
- Put inferred context in `assumptions`.
- Put missing but material facts in `missing_evidence`.
- Use `unknown` instead of inventing impact, urgency, owner, source, or confidence.
- Keep `exact_ask` action-oriented. Do not use `FYI` as the ask.
- Use `sensitivity` for access, privacy, billing, security, credentials, logs, screenshots, or personal-data concerns.
- Set `downstream_conversion.requested` to `false` unless the user explicitly asks for conversion to another system.

## Minimal structured output example

```json
{
  "handoff_type": "engineering_review",
  "problem": "Customer reports that checkout fails after selecting a saved payment method. Cause is not confirmed.",
  "impact": "Checkout is blocked for the reporting customer. Broader impact is unknown.",
  "target_team": "engineering",
  "exact_ask": "Check whether the saved-payment checkout error is reproducible and advise support on the next customer-safe reply.",
  "urgency_risk": {
    "level": "high",
    "reason": "Revenue-impacting checkout flow is blocked for at least one customer."
  },
  "evidence": [
    {
      "source_type": "zendesk_ticket",
      "source_reference": "ticket id redacted",
      "summary": "Customer states checkout fails after selecting a saved payment method.",
      "confidence": "confirmed"
    }
  ],
  "attempted_steps": [
    "Support confirmed the issue occurs after saved payment method selection."
  ],
  "blockers": [
    "No reproduction result from engineering yet."
  ],
  "assumptions": [],
  "missing_evidence": [
    "Exact error message or screenshot if available.",
    "Affected browser, account, and timestamp."
  ],
  "sensitivity": {
    "contains_sensitive_details": false,
    "sensitive_details_omitted": true,
    "approved_audience": ["support", "engineering"],
    "do_not_share_with": [],
    "notes": "No credentials, payment details, or personal data included."
  },
  "downstream_conversion": {
    "requested": false,
    "target_system": null,
    "notes": "No downstream conversion requested."
  },
  "handoff_brief": "Customer reports checkout failure after selecting a saved payment method. Engineering should check reproducibility and advise support on the next customer-safe reply."
}
```

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
