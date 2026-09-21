# Shared Agent Setup

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

This skill is designed for a shared LightSpeed workspace agent. It must behave consistently no matter which team member is logged in.

## Portability Rules

- Do not rely on personal ChatGPT Memory for connector names, customer facts, ticket history, tone preferences, or templates.
- Do not rely on hard-coded connector IDs, file IDs, or user-specific installed app references.
- Treat Zendesk as the support source of truth when the shared agent has Zendesk access.
- Use Gmail only when the support conversation is email-based or the user explicitly provides an email thread.
- Use Slack only for internal support context when the user provides it or the shared agent has an approved connector for it.
- Use pasted context when connectors are unavailable, but clearly mark evidence limits in `Notes`.

## Recommended Shared Agent Files

If the shared agent supports shared files or instructions, keep these outside individual user Memory:

- `CONNECTORS.md`: names the available shared connectors and what each is allowed to be used for.
- `SUPPORT-TONE.md`: team-level support tone defaults, escalation language, and customer-facing wording preferences.
- `SUPPORT-BOUNDARIES.md`: commitments, refund language, security handling, billing risk, and escalation rules.

Use `templates/CONNECTORS.example.md` as the starting point for `CONNECTORS.md`. Use `references/shared-agent-installation-checklist.md` before rollout or when auditing whether a shared agent is ready for team use.

The skill must still work without those files by using the defaults in `SKILL.md`, bundled templates, bundled examples, and bundled references.

## Missing Connector Behaviour

When a connector is unavailable:

1. Continue from the supplied context when safe.
2. State the limitation in the support-facing `Notes` section.
3. Avoid claiming that Zendesk, Gmail, Slack, or customer history was checked.
4. Route to `zendesk-evidence-collector` or `zendesk-case-readiness-check` when the missing source materially affects reply safety.

## Memory Guidance

Use Memory only for stable, workspace-safe preferences if the shared agent supports it. Do not store ticket-specific facts, customer-specific facts, private credentials, connector IDs, or source-specific evidence in Memory.

## Regression Testing

After configuring this skill in a shared agent, use `references/shared-agent-regression-tests.md` and `tests/shared-agent-smoke-prompts.md` to test the main support paths with synthetic data. Run `scripts/run_skill_checks.py` from the skill root before packaging or after edits to catch missing files, non-portable references, invalid schema JSON, and unsafe bundled expected replies.

## Reusable Context Redaction

Before adding support context to shared instructions, examples, smoke tests, QA fixtures, or documentation, read `references/data-redaction-rules.md` and use `templates/redacted-support-context-template.md` when structure is needed. Run `scripts/redact_context.py` for a deterministic first pass, then manually review the result.

Do not store real customer evidence, private URLs, ticket IDs, screenshots, credentials, payment details, security findings, or personal contact details in the skill package or shared Memory. Use synthetic examples when redaction would make the case unclear or when the source includes sensitive security, payment, or identity data.

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

_Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!_
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)
