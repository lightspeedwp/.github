# App Usage Matrix

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

Zendesk is the primary system of record for this agent. Every other attached app is secondary and should be used only when the user explicitly asks for that added context or when a downstream artifact clearly requires it after the Zendesk support task is already clear.

## App roles

### LightSpeed Zendesk

- Primary use: ticket history, conversation context, forms, fields, tags, brands, Help Center grounding, investigation evidence, backlog health, repeated-theme review, and support reporting.
- Default posture: primary workflow anchor and first read for support work.
- Write posture: never assume a write; use grounded evidence and an explicit user request.

### Google Drive

- Primary use: read supporting docs, templates, profiles, reports, exported deliverables, or save a deliverable when the user explicitly wants Drive involvement.
- Default posture: optional and secondary.
- Write posture: save or update only when the user clearly wants that file action.

### Linear

- Primary use: downstream product or engineering issue review, project context, and follow-on engineering or product artifacts after the Zendesk support task is already clear.
- Default posture: optional and secondary.
- Write posture: do not create or update Linear issues, documents, or projects unless the user clearly wants that downstream action.

### GitHub

- Primary use: repository, issue, pull request, workflow, and implementation context that materially improves a Zendesk support deliverable or requested downstream engineering handoff.
- Default posture: optional and secondary.
- Write posture: do not create or update GitHub artifacts unless the user clearly wants that engineering write action.

### HarvestApp

- Primary use: project, task, budget, resourcing, time-tracking, and delivery-planning context related to support follow-through.
- Default posture: optional and secondary.
- Write posture: do not create or update time, task, client, or project records unless the user clearly wants that action.

## Selection rules

- Start with Zendesk for support-operational work.
- Decide whether Zendesk alone is enough before using a secondary app.
- Add the smallest secondary-app set that completes the requested deliverable well.
- Prefer one secondary app when several could help.
- Prefer a ready-to-apply draft over a consequential write when the user did not clearly request the write.
- Keep customer-facing outputs grounded in confirmed Zendesk evidence even when a secondary app adds internal context.
- Keep validation and file-audit work Zendesk-first unless a secondary app is explicitly part of the contract being reviewed.

## File usage expectations

- Use this matrix together with `references/default-operating-mode.md` when deciding whether a secondary app is even needed.
- Use this matrix together with `references/CONNECTORS.md` when checking the concise attached-app map and read-versus-write boundaries.
- Use this matrix together with `references/audit-docs-validation-workflow.md` when a phase-based audit or rewrite needs app-usage coverage.
- Use this matrix together with `references/output-standards.md` when the downstream request changes the final artifact shape.
- Use this matrix together with `references/qa-standards.md` when reviewing app-role clarity or drift.
- Use this matrix together with `tests/app-usage-consistency-tests.md` and `scripts/validate_app_usage_consistency.py` when changing app-role guidance.

## Boundary rules

- Do not switch away from a Zendesk-first workflow just because secondary apps are available.
- Do not let secondary apps redefine the primary task from support work into product, engineering, document-management, or time-tracking work unless the user explicitly asks for that next step.
- When multiple secondary apps could help, prefer the app most directly tied to the requested downstream artifact.
- If Zendesk alone is enough to complete the support task well, stay Zendesk-first and stop there.

## Validation expectations

- The main instructions must represent every attached app with a clear role and boundary.
- App usage rules must agree with `tests/app-usage-consistency-tests.md`.
- The attached-app validator must expect the current app set: LightSpeed Zendesk, Google Drive, Linear, GitHub, and HarvestApp.
- File references in the instructions should align with this matrix, `references/CONNECTORS.md`, and the output standards.
- If app roles change, update this file, the connectors reference, the instructions snapshot, and the app-usage tests together.

---

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)
