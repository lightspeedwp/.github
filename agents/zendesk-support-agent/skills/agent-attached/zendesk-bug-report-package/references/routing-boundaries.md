# Routing boundaries

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

Use this reference before deciding whether to produce a Zendesk bug report package.

## Use `zendesk-bug-report-package`

Use this skill when the primary deliverable is an internal bug-oriented handoff for engineering or product.

Good triggers:

- The user asks for a bug report, defect report, product bug package, engineering handoff, product handoff, or reproduction package.
- A Zendesk ticket or pasted support thread describes product behaviour that may need engineering/product review.
- Support has enough evidence to describe expected versus actual behaviour, even if reproduction is incomplete.
- The next recipient needs concise facts, reproduction clues, impact, and evidence gaps rather than the full customer conversation.
- The user needs a cautious internal package, not a customer-facing reply.

## Do not use this skill

Route away when the main job is something else:

- **First-pass issue type, severity, priority, owner, queue, or status:** use `zendesk-triage-router`.
- **Evidence collection, single-case investigation, proof, timeline reconstruction, known-issue lookup, or reproduction research:** use `zendesk-evidence-collector` where available, or `zendesk-customer-research` when the main need is account/customer history.
- **Customer/account context, prior commitments, recent support activity, relationship risk, or historical pattern for one customer:** use `zendesk-customer-research`.
- **Formal cross-functional escalation, leadership attention, security/compliance concern, relationship risk, or urgent intervention:** use `zendesk-customer-escalation`.
- **Customer-facing reply, apology, follow-up, workaround wording, or support response tone adjustment:** use `zendesk-draft-response`.
- **Final review of an already drafted handoff, escalation, investigation, trend report, knowledge draft, or customer reply:** use `zendesk-evidence-quality-review`.
- **Help-centre article grounding, documentation-policy alignment, macro/article source checking, or public support content comparison:** use `zendesk-help-center-grounding`.
- **Refunds, credits, billing exceptions, policy calls, account administration, or documentation-only work:** route to the relevant support, policy, billing, refund, or knowledge workflow rather than packaging a bug.
- **Duplicate, repeated pain, or incident-pattern classification as the main deliverable:** use `zendesk-duplicate-pattern-review`.
- **General internal handoff without a defect focus:** use `zendesk-handoff-prep`.

## Borderline cases

### Thin evidence but bug-shaped

If the issue looks product-related but lacks affected context, exact behaviour, reproduction clues, or expected behaviour, do not force a package. Return a short readiness note and the smallest evidence request.

Default recommendation:

```markdown
Not ready for a bug package yet. Route to `zendesk-triage-router` or collect reproduction detail first. Minimum missing detail: [specific fields].
```

### Customer is blocked or angry

If the issue is bug-shaped but customer impact, relationship risk, SLA risk, compliance/security risk, or executive visibility is the dominant concern, route to `zendesk-customer-escalation`. The bug package may become supporting evidence, but escalation is the primary workflow.

### Product behaviour is unclear

If expected behaviour is undocumented or ambiguous, create a conservative package only if useful. Mark expected behaviour as "unclear" and recommend product clarification rather than claiming the product is defective.

### Engineering ticket requested explicitly

If the user explicitly asks for a GitHub, Linear, Jira, Asana, or BugHerd issue, first produce the support-safe bug package. Then adapt it to the target tool only if the user requests that downstream format and the required destination details are available.

## Clean handoff pattern

When routing away, do not silently switch workflows. State the recommended workflow and why in one or two lines, then provide the smallest useful next step.

Example:

```markdown
This is better handled by `zendesk-customer-escalation` because the dominant issue is customer impact and urgent intervention, not defect packaging. Use the confirmed behaviour and reproduction clues below as supporting evidence for the escalation brief.
```

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*

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

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

_This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP._
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)
