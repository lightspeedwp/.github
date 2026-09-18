# Shared Agent Installation Checklist

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
[![validate-specifications](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml)
<!-- BADGES-END -->

Use this checklist when adding this skill to a shared workspace agent or moving it between shared agents.

## Required before team use

- Add the full skill package to the shared skill directory, not a user-specific local skill folder.
- Confirm the shared agent can load `SKILL.md`, bundled templates, bundled schemas, bundled examples, and bundled references.
- Confirm the shared agent does not rely on one team member's personal Memory for connector names, customer facts, or support tone rules.
- Confirm Zendesk access is configured for the shared agent if the team expects ticket lookup.
- Confirm Gmail access is configured only if the team expects email-thread support replies.
- Confirm Slack access is configured only if internal support context is needed.
- Add or adapt `templates/CONNECTORS.example.md` into the shared agent's own `CONNECTORS.md` if the platform supports shared agent files or persistent instructions.

## Recommended shared-agent instructions

Add a short note to the shared agent instructions:

```md
When drafting support replies, use the `zendesk-draft-response` skill. Treat Zendesk as the source of truth for support tickets when available. If a connector is unavailable, continue from pasted context only when safe and state the evidence limitation in internal notes. Do not rely on personal Memory, private file IDs, or hard-coded connector IDs.
```

## Connector acceptance checks

Before treating the shared agent as ready, test these cases:

1. Zendesk ticket input
   - Input: a ticket ID or ticket URL.
   - Expected behaviour: use Zendesk as source of truth, draft a grounded reply, and avoid unsupported promises.
2. Pasted support thread
   - Input: pasted customer thread with no connector access.
   - Expected behaviour: draft only from pasted facts and include source limitation in `Notes`.
3. Email-based support thread
   - Input: Gmail or pasted email thread.
   - Expected behaviour: preserve email continuity and avoid claiming Zendesk was checked unless it was.
4. Internal context supplied from Slack
   - Input: customer thread plus pasted internal Slack summary.
   - Expected behaviour: use Slack context as internal context only, not as customer-facing proof.
5. Missing or insufficient evidence
   - Input: vague request such as "reply to this customer about the bug" with no detail.
   - Expected behaviour: route to evidence collection/readiness checking or draft a minimal clarification request.

## Ongoing maintenance

- Keep examples synthetic and anonymised.
- Keep connector names logical, not ID-based.
- Review risky wording in `scripts/lint_reply.py` after real support QA observations.
- Update templates only when the team has agreed the support output shape should change.
- Do not add live customer data, credentials, private ticket exports, or user-specific connector IDs to the skill package.

## Redaction Readiness

- [ ] Team members know not to add real customer context to bundled examples, smoke tests, shared setup notes, or Memory.
- [ ] `references/data-redaction-rules.md` is available for reusable support-context handling.
- [ ] `templates/redacted-support-context-template.md` is available for approved redacted fixtures.
- [ ] `scripts/redact_context.py` has been tested on one synthetic sample with an email, URL, ticket ID, and custom customer/account mapping.
- [ ] The team understands that sensitive security, payment, credential, or personal-data cases should usually be rewritten synthetically rather than stored as redacted examples.

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)
