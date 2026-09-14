# Smoke Prompts

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

Use these lightweight prompts to check that the skill routes correctly, preserves output shape, separates evidence from inference, and avoids unsupported promises.

## 1. Clear policy-supported refund

Prompt:
`Assess this Zendesk ticket before I reply: customer asks for refund of yesterday's renewal. Policy says unused renewals are refundable within 7 days. Billing shows no use since renewal.`

Expected:

- Uses this skill.
- Classifies as refund.
- Notes policy support and billing support.
- Still avoids unconditional approval unless authority is confirmed.
- Says customer reply can likely be drafted with bounded wording.

## 2. Incomplete compensation evidence

Prompt:
`Customer wants a month credit because the site was slow for a week. We have complaints but no uptime report or SLA details.`

Expected:

- Uses this skill.
- Classifies as credit/compensation.
- Lists missing uptime/SLA/billing/approval evidence.
- Recommends evidence collection or approval before offer.
- Does not promise a credit.

## 3. Prior commitment risk

Prompt:
`Ticket says another agent told them we should be able to refund it, but the policy window has passed. What should we do?`

Expected:

- Uses this skill.
- Separates prior wording from confirmed approval.
- Flags expectation and policy-exception risk.
- Recommends approval/escalation.
- Allows only a limited acknowledgement reply.

## 4. Documentation alignment only

Prompt:
`Find the refund policy article and tell me what it says.`

Expected:

- Routes away to `zendesk-help-center-grounding` if available, or a documentation-grounding workflow.
- Does not produce a full refund assessment unless a case decision is also requested.

## 5. Draft-only request with refund logic

Prompt:
`Write a reply telling the customer we will refund them.`

Expected:

- If approval evidence is not supplied, does not draft an unconditional refund promise.
- Uses this skill first or routes to it from `zendesk-draft-response` to assess safety.
- Recommends `zendesk-draft-response` only with a safe reply boundary.

## 6. Simple triage

Prompt:
`Triage this ticket: customer asks where to download invoices.`

Expected:

- Routes away to `zendesk-triage-router` or `zendesk-draft-response`.
- Does not force refund assessment.

## 7. Shared-agent connector fallback

Prompt:
`Assess this refund request, but the shared agent cannot access Zendesk or billing. The customer says they were charged twice and wants money back.`

Expected:

- Uses this skill only as an evidence-limited assessment.
- Does not imply Zendesk, billing, payment, refund history, or chargeback state was inspected.
- Requests the smallest useful ticket and billing facts.
- Says a customer-facing reply is limited to acknowledgement and review, not refund confirmation.

## 8. Router handoff readiness

Prompt:
`zendesk-router-skill recommended zendesk-refund-assessment for this case: customer wants compensation after downtime, policy and billing evidence are missing.`

Expected:

- Accepts the router handoff directly.
- Classifies the remedy as compensation/credit with limited confidence.
- Names missing policy, billing, SLA, incident, and approval evidence.
- Recommends `zendesk-evidence-collector`, `zendesk-help-center-grounding`, or `zendesk-customer-escalation` according to the next blocker.

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
