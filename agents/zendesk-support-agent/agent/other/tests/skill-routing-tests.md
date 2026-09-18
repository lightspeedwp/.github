# Skill routing tests

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

Use these tests to verify that common Zendesk requests route to the expected primary skill or workflow.

## Pass criteria

- pick one primary skill by default
- add a supporting skill only when it materially improves safety, evidence quality, or workflow order
- keep Zendesk-first routing intact
- do not collapse distinct deliverables into the same workflow without a clear reason

## Test cases

### 1. Unclear intake

**Prompt:** "Here’s a Zendesk ticket URL. What should happen next?"

- Expected primary skill: `zendesk-router-skill`
- Acceptable supporting skill: none

### 2. First-pass triage

**Prompt:** "Triage this Zendesk ticket and tell me the safest next action."

- Expected primary skill: `zendesk-triage-router`
- Acceptable supporting skill: none

### 3. Evidence gathering

**Prompt:** "Investigate this Zendesk case and tell me what is confirmed versus still unclear."

- Expected primary skill: `zendesk-evidence-collector`
- Acceptable supporting skill: `zendesk-case-readiness-check`

### 4. Reply drafting

**Prompt:** "Draft a customer-facing reply for this Zendesk case."

- Expected primary skill: `zendesk-draft-response`
- Acceptable supporting skill: `zendesk-evidence-collector`

### 5. Internal handoff

**Prompt:** "Prepare an internal handoff for this Zendesk issue."

- Expected primary skill: `zendesk-handoff-prep`
- Acceptable supporting skill: `zendesk-evidence-collector`

### 6. Escalation brief

**Prompt:** "Create an escalation brief for this repeated high-impact support issue."

- Expected primary skill: `zendesk-customer-escalation`
- Acceptable supporting skill: `zendesk-evidence-collector`

### 7. Backlog analysis

**Prompt:** "Analyze the current Zendesk backlog and summarize SLA risk and next actions."

- Expected primary skill: `zendesk-backlog-trend-analysis`
- Acceptable supporting skill: none

### 8. Duplicate or pattern review

**Prompt:** "Check whether these Zendesk cases are duplicates or part of a broader pattern."

- Expected primary skill: `zendesk-duplicate-pattern-review`
- Acceptable supporting skill: `zendesk-evidence-collector`

### 9. Knowledge-worthiness review

**Prompt:** "Should this repeated support issue become documentation?"

- Expected primary skill: `zendesk-knowledge-candidate-review`
- Acceptable supporting skill: `zendesk-help-center-grounding`

### 10. Knowledge drafting

**Prompt:** "Draft a Help Center article from this resolved Zendesk issue."

- Expected primary skill: `zendesk-create-knowledge`
- Acceptable supporting skill: `zendesk-help-center-grounding`

### 11. Refund decision support

**Prompt:** "Assess whether this customer should receive a refund or goodwill credit."

- Expected primary skill: `zendesk-refund-assessment`
- Acceptable supporting skill: `zendesk-help-center-grounding`

### 12. Bug package

**Prompt:** "Turn this Zendesk support issue into an engineering-ready bug report package."

- Expected primary skill: `zendesk-bug-report-package`
- Acceptable supporting skill: `zendesk-evidence-collector`

### 13. Customer context research

**Prompt:** "Before we reply, summarize what support should know about this customer account."

- Expected primary skill: `zendesk-customer-research`
- Acceptable supporting skill: none

### 14. Help Center grounding

**Prompt:** "Check whether this proposed support answer matches the Help Center and policy guidance."

- Expected primary skill: `zendesk-help-center-grounding`
- Acceptable supporting skill: none

### 15. Readiness check

**Prompt:** "Do we have enough evidence to send a reply or should we investigate more first?"

- Expected primary skill: `zendesk-case-readiness-check`
- Acceptable supporting skill: `zendesk-evidence-collector`

## Failure patterns to flag

- choosing `zendesk-draft-response` for a task that is really an escalation or handoff
- choosing `zendesk-customer-escalation` for a normal internal handoff
- choosing `zendesk-create-knowledge` before documentation-worthiness is established
- routing backlog analysis through triage or case-level investigation skills
- skipping Zendesk-first routing when the request is still unclear

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

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
