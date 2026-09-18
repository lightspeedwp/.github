# Review Severity Calibration Cases

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

Use these synthetic examples to calibrate severity, confidence, and verdicts across shared-agent users. These examples are fictional and must not be treated as real Zendesk evidence.

## Case 1: Unsupported release-date promise

### Draft line

“We’ll have this fixed in tomorrow’s release.”

### Supplied evidence

The ticket notes say support reproduced the bug and opened an internal investigation. No release date or owner approval is provided.

### Correct finding

- Category: unsupported or overstated claim
- Severity: high
- Confidence: confirmed risk based on missing approval evidence
- Verdict impact: not ready unless the line is replaced

### Safer replacement

“We’ve reproduced the issue and are escalating the evidence for review. We’ll update you when we have a confirmed next step.”

## Case 2: Broad root-cause claim from partial logs

### Draft line

“The issue was caused by the payment gateway update.”

### Supplied evidence

The issue started after a payment gateway update, but no logs or gateway response codes have been reviewed.

### Correct finding

- Category: unsupported or overstated claim
- Severity: high
- Confidence: possible, not confirmed
- Verdict impact: not ready if the draft presents this as fact

### Safer replacement

“The timing overlaps with the payment gateway update, so that is one area to verify. We have not confirmed the cause yet.”

## Case 3: Next step lacks owner

### Draft line

“Someone should check the account settings and follow up.”

### Supplied evidence

The ticket shows support needs account-level configuration checked before replying.

### Correct finding

- Category: weak next step
- Severity: medium
- Confidence: confirmed actionability gap
- Verdict impact: mostly ready with fixes

### Safer replacement

“Support should check the customer’s account configuration and confirm whether the billing setting changed before sending the next customer reply.”

## Case 4: Missing trend-report filter

### Draft line

“We saw a clear spike in login issues this week.”

### Supplied evidence

The draft includes 12 login tickets this week but no previous comparison period, queue filter, or product area filter.

### Correct finding

- Category: missing evidence
- Severity: medium
- Confidence: needs verification
- Verdict impact: mostly ready with fixes, or not ready if the spike claim drives a major decision

### Safer replacement

“We found 12 login-related tickets in the reviewed queue this week. Add the comparison period and filters before calling this a spike.”

## Case 5: Minor tone issue only

### Draft line

“We totally understand this is super frustrating.”

### Supplied evidence

The customer reported inconvenience, not severe business impact.

### Correct finding

- Category: wording risk
- Severity: low
- Confidence: confirmed tone improvement
- Verdict impact: ready or mostly ready depending on other issues

### Safer replacement

“We understand this is frustrating and appreciate your patience while we check the next step.”

## Case 6: Knowledge draft from one-off workaround

### Draft line

“To fix this permanently, clear the plugin cache and disable the sync option.”

### Supplied evidence

One customer’s issue was resolved with this workaround. No confirmation exists that it applies broadly or is permanent.

### Correct finding

- Category: risk or handoff gap
- Severity: high for public knowledge publication; medium for internal note
- Confidence: reported workaround, not confirmed reusable resolution
- Verdict impact: not ready for public article

### Safer replacement

“Internal note: this workaround resolved one reported case. Verify affected versions, scope, and side effects before publishing customer-facing guidance.”

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)
