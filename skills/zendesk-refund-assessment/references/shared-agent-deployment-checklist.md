# Shared-Agent Deployment Checklist

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

Use this checklist before adding or updating `zendesk-refund-assessment` in a shared support desk agent.

## Required setup

- Confirm the skill package is available through the shared skill directory or workspace agent configuration.
- Confirm the shared agent has this skill installed, not only a personal ChatGPT environment.
- Confirm whether the shared agent has Zendesk connector access. This skill can work from pasted evidence, but live ticket verification requires connector access.
- Confirm whether policy/help-center, billing/commerce, CRM/account, and internal discussion sources are available to the shared agent or must be supplied manually.
- Confirm no personal account, private mailbox, private Zendesk view, private Slack channel, individual memory, or teammate-specific permission is required.

## Recommended companion skills

Install or make available where support operations need end-to-end handling:

- `zendesk-router-skill`
- `zendesk-triage-router`
- `zendesk-evidence-collector`
- `zendesk-case-readiness-check`
- `zendesk-draft-response`
- `zendesk-help-center-grounding`
- `zendesk-customer-escalation`
- `zendesk-customer-research`
- `zendesk-evidence-quality-review`

## Shared-agent acceptance tests

Run these in the shared support desk agent:

1. `Assess this refund request, but the shared agent cannot access Zendesk.`
   - Expected: uses pasted context or requests the smallest useful ticket/thread extract; does not imply Zendesk was inspected.
2. `Customer wants a credit because service was unreliable, but we only have complaints and no SLA or billing evidence.`
   - Expected: classifies credit/compensation, lists evidence gaps, avoids promising credit, recommends evidence collection or approval.
3. `Ticket says another agent said we should be able to refund it, but policy window passed.`
   - Expected: flags expectation risk, treats prior wording as not approval, recommends approval/escalation before outcome language.
4. `Find the refund policy article and summarise it.`
   - Expected: routes to `zendesk-help-center-grounding`, not a full refund assessment.
5. `Triage this ticket: customer asks where to download invoices.`
   - Expected: routes to `zendesk-triage-router` or `zendesk-draft-response`; does not force refund assessment.

## Do not configure

- Do not add real ticket IDs, customer names, email addresses, invoice IDs, transaction IDs, queue IDs, view IDs, or account IDs to examples or tests.
- Do not hardcode personal names, personal connector IDs, private labels, or workspace-only shortcuts into the skill package.
- Do not require Slack, Gmail, Drive, Linear, GitHub, Asana, or roadmap tools for refund assessment unless the current shared agent explicitly supplies them and the evidence is relevant.
- Do not install the skill as though every downstream workflow has live Zendesk, policy, billing, and CRM access; preserve pasted-context fallbacks.

## Maintenance check

Run this from the skill root before sharing an updated package:

```bash
python3 scripts/validate_refund_assessment_pack.py
```

The validation should pass before the skill is packaged or uploaded to the shared skill directory.

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*
