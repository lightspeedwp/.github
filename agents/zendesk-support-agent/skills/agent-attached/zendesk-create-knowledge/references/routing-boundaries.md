# Routing Boundaries

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
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![events-issue-pr-metadata](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml)
[![issue-management](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml)
[![pr-workflow](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml)
[![project-management](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml)
[![release-orchestration](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml)
[![reporting-metrics](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml)
<!-- BADGES-END -->

Use this reference when deciding what `zendesk-create-knowledge` should handle directly, when it should hand off to a closely related specialist skill, when it should use an explicit canonical route-away boundary, and when it should return to `zendesk-router-skill`.

## Core rule

`zendesk-router-skill` owns the wider Zendesk skill network.

`zendesk-create-knowledge` should know only:

- its own drafting boundary
- the few handoffs needed to make a knowledge draft safe and useful
- explicit canonical route-away boundaries for backlog/trend and duplicate/pattern work
- when the request has moved outside knowledge drafting and should return to `zendesk-router-skill`

Do not turn this specialist skill into a second router. Do not list or choose among the full Zendesk skill network from this skill. Use only the direct handoffs and explicit route-away boundaries named here.

## This skill owns

Stay in `zendesk-create-knowledge` when the user needs a review-ready knowledge draft and the documentation basis is already clear.

Owned outputs include:

- public help-centre article draft
- internal support knowledge draft
- FAQ draft
- troubleshooting article draft
- known-issue article draft
- article update brief
- structured JSON version of a knowledge draft, when requested

## Direct handoffs this skill may recommend

Recommend only one primary handoff unless the user explicitly asks for options.

Use these direct handoffs when they are clearly needed for the knowledge draft:

- `zendesk-knowledge-candidate-review` — documentation value, audience, stability, or public/internal visibility is unclear
- `zendesk-evidence-collector` — the source case, resolution, workaround, or ticket evidence is missing or not anchored in Zendesk
- `zendesk-case-readiness-check` — the source case may not be stable enough to document yet
- `zendesk-evidence-quality-review` — the finished draft needs claims, evidence, tone, boundary, or publication-readiness QA
- `zendesk-draft-response` — the user also needs a customer-facing reply that points to or reuses the article content
- `zendesk-customer-research` — customer/account context materially changes article scope, terminology, risk, or support posture

## Explicit route-away boundaries

Use these canonical route-away names only when the request clearly matches the category. Do not treat them as local drafting handoffs.

- `zendesk-backlog-trend-analysis` — for backlog, queue, SLA, ageing, volume, theme, or trend reporting.
- `zendesk-duplicate-pattern-review` — for duplicate, related-case, repeated-pain, or incident-pattern classification.

## Return to the router

Return to `zendesk-router-skill` when the next step is not clearly one of the direct handoffs above.

Return to the router for:

- broad Zendesk workflow selection
- unclear support next step
- escalation decisions beyond knowledge drafting
- requests mixing multiple Zendesk outcomes where the primary workflow is unclear
- duplicate, related-case, repeated-pain, or incident-pattern requests that do not clearly fit `zendesk-duplicate-pattern-review`
- backlog, queue, SLA, ageing, volume, theme, or trend requests that do not clearly fit `zendesk-backlog-trend-analysis`
- requests that start from a vague support issue rather than a documentation-ready case
- any situation where the agent would otherwise need to compare many Zendesk specialist skills

Use this fallback wording:

> This has moved outside the create-knowledge boundary. Return to `zendesk-router-skill` to select the right Zendesk workflow.

## Handoff output style

When recommending a handoff, keep it short:

```md
Recommended next route: `<canonical-zendesk-skill-name>` — <one-sentence reason tied to the knowledge draft or explicit route-away boundary>
```

Do not include a long routing matrix in normal outputs. Keep the article draft as the main deliverable. Do not introduce Linear, GitHub, Asana, product, or project routing unless the user explicitly asks for a downstream artefact after the knowledge draft is complete.

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
