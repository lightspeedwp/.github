# Example 4: case with escalation signals

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

## Input

Ticket subject: Checkout failing during campaign launch

Customer says checkout has failed for all customers since their campaign launched two hours ago. They included three failed order IDs, a screenshot of the checkout error, and said paid ads are currently running. The site owner is asking for urgent help.

## Output

# Internal triage package

## Issue summary

The customer reports a checkout failure affecting all customers during an active paid campaign launch, with failed order IDs and an error screenshot supplied.

## Urgency

critical — Checkout is reportedly blocked during a live revenue-generating campaign, with multiple failed order examples provided.

## Severity

Critical — The issue appears to block all customers from completing checkout and may directly affect revenue.

## Recommended priority

Urgent — Start urgent technical investigation while support verifies reproduction and gathers gateway/deploy context.

## Issue type

bug/technical fault

## Likely owner

engineering — inferred because checkout failure with failed orders likely needs technical investigation beyond first-line support.

## Duplicate or pattern risk

unknown — The supplied evidence confirms multiple failed orders, but does not show whether other tickets or accounts are affected.

## Customer impact

The customer reports that all shoppers are unable to complete checkout while paid ads are running, creating immediate revenue risk.

## Confirmed facts

- The customer says checkout has failed since the campaign launched two hours ago.
- Three failed order IDs were provided.
- A screenshot of the checkout error was provided.
- Paid ads are currently running according to the customer.

## Inferred risks or concerns

- Revenue loss is likely if the checkout failure is confirmed across all customers.
- Campaign spend may be wasted while checkout is blocked.

## Missing information

- Whether support can reproduce the checkout failure.
- Payment gateway status and recent deploy/plugin/configuration changes.
- Whether the issue affects all products, payment methods, browsers, or regions.

## Escalation signals

confirmed — Active checkout blocker, multiple failed order examples, time-sensitive campaign, and revenue risk.

## Recommended next action

Escalate for urgent technical investigation while support verifies reproduction and gathers gateway/deploy context.

## Recommended downstream skill

`zendesk-customer-escalation`

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)
