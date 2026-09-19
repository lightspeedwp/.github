# Gravity Forms configuration handoff

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
<!-- BADGES-END -->

## Handoff summary

- Handoff title:
- Source audit:
- Site/environment:
- Risk level:
- Approval required:

## Findings included

| Finding ID | Severity | Target | Evidence summary | Recommended change |
|---|---|---|---|---|

## Target objects

- Forms:
- Pages/embeds:
- Notifications:
- Confirmations:
- Feeds/add-ons:
- Global settings:

## Recommended configuration changes

- Change 1:
- Change 2:
- Change 3:

## Required MCP capabilities

- Read capability required for validation:
- Write capability required for configuration skill:
- Capability not available / manual fallback:

## Required add-ons

- Add-on:
- Current evidence:
- Licence/support caveat:

## Approval required

- Approval owner:
- Reason approval is needed:
- Production/staging note:

## Validation checklist

- Inspect post-change form schema/settings.
- Inspect notifications/confirmations/feeds.
- Inspect page embed.
- Run approved safe test submission only if permitted.
- Confirm notification/feed/log result.
- Confirm no sensitive data overexposure.

## Rollback notes

- Values/settings to preserve before change:
- How to revert manually if needed:
- Data/entry considerations:

## Suggested prompt for `gravity-forms-configuration`

```text
Use the gravity-forms-configuration skill. Apply only the approved changes from this handoff. Confirm MCP capabilities first, show a change plan before any write, require approval for high-risk changes, validate after change, and report any missing evidence.

[Paste handoff summary and findings here]
```

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
