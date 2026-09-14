# Template: Zendesk bug report package

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

Use this template for paste-ready internal bug handoffs. Keep sections concise. Use `unknown` rather than inventing missing detail.

```markdown
# Bug package: [short issue title]

## Readiness
[ready for engineering/product | partially ready | not ready]

Reason: [one sentence explaining evidence confidence and biggest gap]

## Problem statement
[one or two sentences. describe the problem without asserting unproven cause.]

## Affected context
- Ticket/source: [zendesk ticket id/url or supplied source]
- Requester/account: [known, redacted, or unknown]
- Product/surface: [known or unknown]
- Environment: [production/staging/local, site/app/version, region, browser/device, role/permissions]
- Frequency/scope: [single user/account, multiple users, recurring, unknown]

## Expected behaviour
- [expected outcome]
- Source/confidence: [documented | support assumption | user expectation | unknown]

## Actual behaviour
- Confirmed: [observed or evidenced behaviour]
- Support-observed: [support reproduction or troubleshooting observation]
- User-reported: [claims not independently confirmed]
- Inferred: [reasonable but unverified interpretation]

## Reproduction clues or steps
1. [step or clue]
2. [step or clue]
3. [step or clue]

Missing reproduction detail: [exact missing fields/questions]

## Troubleshooting already attempted
- [action tried] -> [outcome]
- [action tried] -> [outcome]

## Impact and severity signals
- Affected users/accounts: [known or unknown]
- Business/customer impact: [confirmed vs reported]
- Workaround: [available/unavailable/unknown]
- Timeline/recurrence: [first reported, last observed, repeated, release/change correlation]
- Escalation cues: [sla, relationship risk, security/compliance, urgent blocker, none known]

## Evidence register
### Confirmed / support-observed
- [evidence item + source]

### User-reported but unconfirmed
- [claim + who reported it]

### Inference / assumptions
- [inference + why it is plausible + what would verify it]

### Missing evidence / gaps
- [gap + why it matters]

## Recommended next action
[action: hand off to engineering/product | request more reproduction detail | do more zendesk/customer research | escalate | draft separate customer reply]

Recommended destination/skill: [`zendesk-bug-report-package` output to engineering/product | `zendesk-triage-router` | `zendesk-evidence-collector` | `zendesk-customer-research` | `zendesk-customer-escalation` | `zendesk-draft-response` | `zendesk-evidence-quality-review` | other]

Exact ask for recipient:
[one specific ask or decision needed]

## Caution notes
- Do not claim root cause yet: [unsupported cause claims]
- Do not claim scope yet: [unsupported scope claims]
- Sensitive evidence omitted or linked in Zendesk: [yes/no/unknown]
```

---

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)
