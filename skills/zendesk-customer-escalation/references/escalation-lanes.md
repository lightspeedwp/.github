# Escalation Lanes

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
[![pr-template-routing](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml)
[![validate-specifications](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml)
[![workflow-lint](https://github.com/lightspeedwp/.github/actions/workflows/workflow-lint.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/workflow-lint.yml)
<!-- BADGES-END -->

Use this reference when the target owner or escalation lane is unclear. Choose the lane based on the decision, risk, or work required, not on who last touched the ticket.

## Lane selection

| Lane | Use when the case needs | Typical evidence to include | Avoid when |
| --- | --- | --- | --- |
| Engineering | Defect investigation, reliability fix, integration remediation, infrastructure review, data integrity analysis, logs, reproduction, or code-level remediation. | Reproduction steps, environment, versions, logs, timestamps, expected vs actual behaviour, affected account/site/user, similar tickets. | The issue is expected behaviour, a feature gap, policy ambiguity, or configuration support. |
| Product | Product behaviour decision, roadmap/prioritisation call, UX ambiguity, feature gap, workflow mismatch, or policy choice about expected behaviour. | Customer use case, business impact, current behaviour, requested behaviour, workaround limits, frequency or repeated customer pattern. | A confirmed defect or urgent operational incident needs immediate technical action. |
| Security | Vulnerability report, unauthorised access concern, privacy risk, suspicious account activity, data exposure, compliance concern, or sensitive-data handling question. | Exact security concern, data involved, affected accounts/users, timestamps, access context, customer report wording, containment status. | The issue is only a general bug or product limitation without credible security/privacy exposure. |
| Leadership | Major relationship risk, contractual exposure, executive visibility, exception request, commercial decision, cross-functional deadlock, or reputational risk. | Customer/account context, commitments, business pressure, risk summary, decision needed, recommended options, support status. | A normal technical or product owner can make the decision without senior intervention. |
| Support specialist | Senior support review, complex configuration help, policy interpretation, specialist troubleshooting, or continuity when frontline support is blocked but cross-functional escalation is not yet justified. | Troubleshooting steps, customer goal, current blocker, known docs checked, exact question for the specialist. | Engineering/product/security/leadership ownership is clearly required. |

## Decision flow

1. If there is credible security, privacy, compliance, or data exposure risk, route to Security first.
2. If customer operations are broadly blocked or technical behaviour appears broken, route to Engineering unless evidence shows expected behaviour.
3. If the core issue is expected behaviour, product fit, feature gap, or roadmap trade-off, route to Product.
4. If the key need is an exception, commercial decision, executive visibility, or cross-functional deadlock, route to Leadership.
5. If the case needs experienced support judgement but not cross-functional action, route to Support specialist or `zendesk-handoff-prep`.
6. If evidence is too thin to choose a lane safely, route to `zendesk-evidence-collector` or label the escalation evidence-limited.

## Ask patterns by lane

Use decision-oriented asks:

- Engineering: "Please confirm whether this behaviour is a defect and advise the safest remediation or workaround."
- Product: "Please confirm the intended behaviour and whether we can support this workflow or need to set expectations."
- Security: "Please assess whether this creates exposure and advise containment, customer wording, and next steps."
- Leadership: "Please decide whether to make an exception, prioritise cross-functional action, or approve the proposed customer commitment."
- Support specialist: "Please review the troubleshooting path and advise the next support action or customer-safe explanation."

## Multi-lane cases

When multiple lanes could apply, name one primary owner and one supporting lane. Do not create a vague escalation with many owners. Explain why the primary lane owns the decision or next action.

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
