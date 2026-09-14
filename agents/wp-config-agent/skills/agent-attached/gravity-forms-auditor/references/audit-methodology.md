# Audit methodology

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

## Evidence-first review

Start with source and site evidence, then findings. Keep a clear split between confirmed facts, partial evidence, assumptions, missing evidence, and recommendations.

## Read-only MCP operation

Use the MCP connector only for reading. Discover capabilities first. Avoid write-capable actions. If a tool name implies a write, update, delete, send, submit, enable, disable, create, duplicate, publish, or reprocess operation, do not call it in this skill.

## Confidence levels

- High: directly verified by MCP/read-only export/official source/page evidence.
- Medium: supported by partial but incomplete evidence.
- Low: not directly verified, inferred, or based on a LightSpeed recommendation.

## Severity model

- Blocker: form cannot be trusted for production, submission, payment, user creation, privacy, accessibility, or business-critical lead capture.
- High: likely lost leads, inaccessible journey, privacy/security exposure, broken payment/user-registration/feed risk, or broken routing.
- Medium: important quality, reliability, maintainability, or UX issue that should be fixed soon.
- Low: minor improvement, tidy-up, or future optimisation.
- Info: observation, context, limitation, or optional recommendation.

## Priority model

Prioritise by severity, confidence, affected journey, likelihood, business impact, user impact, fix effort, reversibility, and dependencies. Separate blockers, high-priority fixes, quick wins, medium-term fixes, deferred recommendations, and not assessed items.

## Client-safe versus internal notes

Internal reports may name connector capabilities, internal owners, exact logs, and remediation dependencies. Client-safe summaries must remove secrets, licence details, raw logs, private entries, and internal tool/action names.

## Retest methodology

Retest only with approved safe evidence. In auditor mode, review post-change evidence, screenshots, settings exports, logs, metadata, and page behaviour. Do not submit entries unless the environment and user explicitly define safe test submission.

## Handoff methodology

For every actionable finding, create a handoff item that names the finding, target object, evidence, recommended fix, risk level, required capability, approval needed, validation checklist, rollback note, and suggested `gravity-forms-configuration` prompt.

---

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)
