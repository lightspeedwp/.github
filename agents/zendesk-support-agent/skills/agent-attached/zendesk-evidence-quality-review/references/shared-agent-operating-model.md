# Shared Agent Operating Model

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

Use this reference when this skill runs in a shared workspace agent, when the logged-in user is unclear, or when connector access differs between teammates.

## Core rules

- Do not assume the logged-in user is Ash, the skill author, or a specific LightSpeed teammate.
- Do not assume the user has the same Zendesk permissions, saved searches, views, macros, or customer context as another teammate.
- Do not rely on user-specific memory for customer, ticket, SLA, billing, account, product, or incident facts.
- Treat Zendesk evidence, pasted ticket content, exported thread text, or explicitly supplied summaries as the only case-level source of truth.
- If Zendesk connector access is unavailable, ask for the smallest missing evidence extract instead of guessing.
- Never request or store credentials, API keys, private customer data, personal access tokens, or copied connector secrets.
- Memory may be used only for stable, non-sensitive team conventions when explicitly approved.
- Output must work for any authorised LightSpeed support teammate, not only the person who created the skill.

## Shared-agent evidence handling

When evidence is supplied by the user rather than fetched from Zendesk, label it clearly:

- `Pasted Zendesk evidence` when the user pasted ticket comments or metadata.
- `User-provided summary` when the user summarised the case.
- `Accessible Zendesk evidence` when the current agent session can directly access the record.
- `Unverified context` when the source is unclear or not directly reviewable.

If important facts come only from a user-provided summary, calibrate the review. Prefer wording such as "based on the supplied summary" rather than treating the summary as confirmed ticket evidence.

## Access fallback

If the current user cannot access the referenced ticket or connector:

1. State that the evidence is not accessible in the current session.
2. Ask for the smallest extract needed for the review, such as the customer message, current draft, internal notes, attempted steps, status, and next owner.
3. Route to `zendesk-evidence-collector` if the missing evidence requires case reconstruction.
4. Avoid producing a polished review from missing facts.

## Memory boundary

Do not save durable memory from this skill unless the user explicitly asks to record a stable, non-sensitive team convention. Never save customer-specific facts, ticket details, sensitive support history, or teammate-specific access assumptions.

---

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*
