# Severity and Launch Status

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

Use severity to describe impact. Use launch status to describe release decision.

## Severity

| Severity | Definition | Examples |
|---|---|---|
| Critical | Blocks launch or creates serious legal, privacy, security, accessibility, revenue or conversion risk. | Broken checkout/contact form, exposed private data, inaccessible main navigation, production-breaking fatal error. |
| High | Major user journey, search, accessibility, design-system or tracking issue with clear launch impact. | Mobile navigation broken, key template layout failure, missing redirects for priority pages, lead forms not tracked. |
| Medium | Noticeable issue with workaround, limited scope or moderate user impact. | Inconsistent spacing, missing alt text on a non-critical image, one secondary template has a layout issue. |
| Low | Minor polish, editorial or isolated issue. | Typo, small alignment issue, non-critical copy inconsistency. |
| Improvement | Useful enhancement but not required for launch. | Future optimisation, CRO idea, editorial enhancement, dashboard refinement. |

## Launch status

| Status | Meaning | Action |
|---|---|---|
| Launch Blocker | Must be fixed before launch. | Escalate, assign owner, retest before go/no-go. |
| Must Fix Before Launch | Should be fixed before launch unless leadership explicitly accepts risk. | Schedule before launch or document accepted risk. |
| Can Launch With Follow-up | Safe to launch if owner/date are assigned. | Track as follow-up issue. |
| Post-launch Improvement | Backlog or optimisation item. | Route to post-launch or improvement backlog. |
| Needs Reproduction | Cannot route as a fix until confirmed. | Create reproduction task with missing evidence listed. |
| Duplicate | Already tracked by another finding or issue. | Link to canonical item and close/merge duplicate. |
| Out of Scope | Valid request but outside current approval, release or estimate. | Route to change request or backlog. |

## Launch blocker test

Treat a finding as a launch blocker only when at least one of these is true:

- It prevents a critical user journey from working.
- It creates legal, privacy, security or severe accessibility exposure.
- It breaks a committed launch requirement or approval gate.
- It risks material revenue, lead capture, indexing or operational readiness.
- It cannot be safely mitigated with a short-term workaround.

If leadership can knowingly accept the risk with a named owner and follow-up date, classify it as `Can Launch With Follow-up`, not `Launch Blocker`.

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)
