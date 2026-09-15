# Shared-agent compatibility

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

Use this reference when the skill runs inside a shared workspace agent, or whenever the logged-in user's connector access, workspace permissions, durable memory, or bundled examples could affect the result.

## Goal

Make the skill safe and consistent for every LightSpeed teammate who can use the shared agent, regardless of which individual is logged in.

## Core rules

- Treat the packaged skill as the source of truth for workflow behaviour.
- Treat connector access as runtime-dependent and user-specific.
- Never assume that the current user has the same Zendesk, Slack, Gmail, Google Drive, GitHub, Asana, BugHerd, or Help Centre permissions as the user who packaged the skill.
- Do not hardcode team-member names, user IDs, email addresses, assignees, group IDs, ticket IDs, API tokens, customer identifiers, internal URLs, or private workspace paths.
- Do not rely on ChatGPT Memory for required workflow rules. Put stable workflow rules in the skill package.
- Use pasted evidence only as a fallback or supplement when Zendesk cannot be reached or does not contain the needed context.
- Do not claim that Zendesk, a connector, or a secondary system was checked unless it was actually available and checked in the current run.
- Use synthetic examples only. Do not bundle real customer tickets, emails, screenshots, transcripts, exports, or PII in the skill package.

## Connector availability handling

When Zendesk is available:

1. Use Zendesk as the primary source for ticket state, chronology, customer wording, ownership, priority, status, tags, SLA or ageing signals, and support commitments.
2. Use secondary systems only when Zendesk leaves a material gap for the chosen mode, or when the user explicitly asks for cross-system context.
3. Cite or name the source category checked in the output.

When Zendesk is unavailable:

1. Say that Zendesk was not available in this run.
2. Work only from pasted evidence or other available sources.
3. Mark the evidence pack or investigation as partially ready or not ready when Zendesk state is material to the next workflow.
4. Do not invent ticket metadata, ownership, status, SLA state, customer impact, prior commitments, or root cause.

When secondary connectors are unavailable:

1. Continue with Zendesk-first evidence if Zendesk is sufficient.
2. Mark only the affected branch or evidence gap as blocked.
3. Avoid broad failure language when the missing connector is not material.

## Shared memory boundary

Use this skill package for stable team rules such as:

- Zendesk-first evidence precedence.
- Standard readiness labels.
- Standard investigation dispositions.
- The deprecated-context rule: `case-investigation` is not an active route target; `zendesk-evidence-collector` owns embedded single-case investigation for the Zendesk-first support desk.
- Approved support workflow routes.
- Customer-safe uncertainty language.

Do not depend on personal memory for:

- Current assignees or rota ownership.
- Customer-specific commitments.
- Live ticket status.
- Access-sensitive source locations.
- Private user preferences that are not part of the shared support workflow.

## Team-safe output rules

- Keep confirmed facts, inferences, assumptions, and unknowns separate.
- State source limitations plainly.
- Prefer `unknown`, `blocked`, or `not checked` over speculative conclusions.
- Recommend one primary next workflow and at most one supporting workflow.
- Avoid downstream product, Linear, GitHub, Asana, or roadmap routing unless the current evidence clearly supports it or the user explicitly requests it.
- Do not expose raw internal IDs unless they are necessary for the support workflow and already present in the current evidence.

## Minimum wording for missing access

Use wording close to this when relevant:

> I could not access Zendesk in this run, so this is based only on the supplied evidence. The case is not ready for a definitive reply, escalation, or RCA until the current ticket state and latest customer/agent chronology are checked in Zendesk.

For a non-material secondary connector gap:

> Zendesk has enough evidence for the next support step. The secondary source was not available, but that does not block the recommended workflow.

---

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
