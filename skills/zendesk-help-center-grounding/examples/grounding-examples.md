# Grounding Examples

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

## 1. Straightforward support from documentation

**Input**

A customer asks how to reset two-factor authentication. The Help Center article "Reset two-factor authentication" says users must contact support from the account owner's email and complete identity verification.

**Brief shape**

- **Documentation status:** clear support
- **Documentation risk:** low
- **Documented position:** The public article directly says support can reset 2FA only after the request comes from the account owner email and verification is complete.
- **Use posture:** cite the public article and match its steps.
- **Safe drafting guidance:** ask the customer to contact support from the owner email and explain verification is required. Do not promise immediate reset.
- **Recommended downstream skill:** `zendesk-draft-response`

## 2. Draft conflicts with Help Center wording

**Input**

Draft reply says: "We can cancel your annual plan and refund the unused months." The Help Center billing article says annual plans are non-refundable after renewal except where required by law or approved exception.

**Brief shape**

- **Documentation status:** conflict
- **Documentation risk:** high
- **Documented position:** The billing article does not support promising a prorated refund after renewal.
- **Alignment check:** The draft's refund commitment conflicts with documented policy.
- **Unsafe wording to avoid:** "we will refund unused months", "you are entitled to a prorated refund".
- **Safe drafting guidance:** explain that the request must be reviewed against the refund policy and avoid committing to an outcome.
- **Recommended downstream skill:** `zendesk-refund-assessment` if present; otherwise `zendesk-customer-escalation` for exception review.

## 3. Documentation incomplete or ambiguous

**Input**

Customer asks whether a beta integration supports exporting custom fields. The product article mentions exports but does not mention custom fields.

**Brief shape**

- **Documentation status:** missing documentation / inference required
- **Documentation risk:** medium
- **Documented position:** Current docs confirm export support generally but do not explicitly confirm custom-field export.
- **Alignment check:** A reply saying "custom fields are supported" is unsupported from documentation alone.
- **Safe drafting guidance:** say the docs confirm exports in general, but custom-field support needs confirmation. Avoid promising support.
- **Recommended downstream skill:** `zendesk-customer-escalation` if product confirmation is needed, or `zendesk-draft-response` for a cautious reply.

## 4. Multiple sources conflict or appear outdated

**Input**

A public Help Center article says plan changes take effect immediately. An internal policy doc says plan changes take effect at next billing cycle. The internal doc was updated last week; the public article has no visible freshness date.

**Brief shape**

- **Documentation status:** conflict / outdated risk
- **Documentation risk:** high
- **Documented position:** Approved sources disagree on timing.
- **Conflicts or ambiguity:** Public article and internal policy conflict; public freshness is unknown.
- **Citation posture:** do not cite the public article too strongly until policy owner confirms which source is current.
- **Safe drafting guidance:** avoid stating a precise timing guarantee; tell the customer support is checking the account-specific effective date.
- **Recommended downstream skill:** `zendesk-customer-escalation` or policy-owner handoff.

## 5. Case that should route away

**Input**

User asks: "Summarise this customer's last six tickets and tell me whether they are at churn risk."

**Routing result**

Route to `zendesk-customer-research`. The primary need is customer/account history, not documentation grounding. This skill may be used later only if the resulting reply depends on official policy or Help Center wording.

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)
