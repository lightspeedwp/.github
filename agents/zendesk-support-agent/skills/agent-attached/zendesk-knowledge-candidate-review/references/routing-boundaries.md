# Routing boundaries

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

Use this reference when `zendesk-knowledge-candidate-review` needs to decide whether it still owns the task or should hand off.

## Network ownership rule

`zendesk-router-skill` owns the Zendesk skill network. Specialist skills should not become secondary routers. This skill should know:

- its own scope;
- its common adjacent handoffs;
- when to return to `zendesk-router-skill`;
- which downstream paths to avoid unless explicitly requested.

Do not maintain a complete map of all Zendesk, Linear, GitHub, Asana, product, or project workflows in this skill.

## Interoperability with router and article drafting

- Clear documentation-worthiness reviews may invoke `zendesk-knowledge-candidate-review` directly.
- Clear article drafting, article updates, internal note drafting, known issue note drafting, FAQ drafting, or macro guidance requests should invoke `zendesk-create-knowledge` directly when suitability is already confirmed.
- Unclear Zendesk-first intake, ambiguous support next steps, or broader skill selection should route through `zendesk-router-skill`.

Keep this specialist focused on whether documentation should exist; do not turn it into article drafting or full Zendesk network routing.

## This skill owns

Stay in this skill when the core question is whether a Zendesk-centred case, repeated question, workaround, known issue, Help Centre gap, or reusable customer answer should become documentation.

The owned output is a documentation decision record with one recommendation:

- create new article;
- update existing article;
- internal-only;
- wait because evidence is unstable.

This skill may also state the smallest missing evidence that would change the documentation decision.

## This skill does not own

Return to `zendesk-router-skill` when the user needs broader workflow routing, the safest downstream Zendesk skill is unclear, or the requested outcome is not a documentation-worthiness decision.

Examples that should return to the router unless a common adjacent handoff is obvious:

- broad support workflow selection;
- unclear support next step;
- multi-skill orchestration;
- backlog, SLA, ageing, or volume reporting;
- customer/account research;
- escalation strategy beyond a simple documentation-blocker;
- operational handoff where ownership is unclear;
- product, Linear, GitHub, Asana, roadmap, or project-management artefacts.

## Common adjacent handoffs

Use only these direct handoffs from this skill unless the user explicitly asks for another artefact.

### `zendesk-create-knowledge`

Use when documentation-worthiness is clear, the content is ready to draft, and the remaining task is writing a Help Centre article, internal note, troubleshooting guide, known issue note, FAQ, or macro guidance. Do not use this skill to draft the article itself.

### `zendesk-evidence-collector`

Use when the source case lacks reliable Zendesk evidence or the documentation decision is blocked by missing Zendesk-first evidence such as the source ticket, status, customer wording, related-case evidence, timeline, proof, cause, confirmed workaround, or resolution context.

### `zendesk-case-readiness-check`

Use when resolution, workaround, public/internal boundary, stability, audience, evidence sufficiency, or the smallest missing evidence is unclear before a reply, escalation, handoff, or knowledge draft.

### `zendesk-duplicate-pattern-review`

Use when duplicate status, repeated-pain classification, or possible incident-like pattern would change the documentation decision. Return to this skill afterwards only if documentation-worthiness still needs a decision.

### `zendesk-draft-response`

Use when the immediate user request is customer-facing wording, not documentation suitability. Do not use response drafting as a substitute for a knowledge-candidate decision.

## Return-to-router wording

When routing is outside the common adjacent handoffs, say this in the next step:

> Return to `zendesk-router-skill` because the next workflow is outside this skill's local documentation-review boundaries: [reason].

Keep the reason short and specific. Do not list the full Zendesk skill network.

## Shared-agent boundary safeguards

- Do not assume every teammate has the same Zendesk, Help Centre, Slack, Gmail, Drive, Linear, GitHub, or Asana access.
- If a connector is unavailable, state what could not be checked and identify the smallest missing Zendesk or Help Centre check.
- Prefer a local common handoff only when the next step is clear from current evidence.
- Return to `zendesk-router-skill` when routing depends on unavailable connector evidence or workspace-specific ownership rules.
- Keep routing advice workspace-neutral and avoid named teammates unless the user supplied them.

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
