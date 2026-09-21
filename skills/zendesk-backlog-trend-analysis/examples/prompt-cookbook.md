# Prompt Cookbook

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

Use these examples to test or demonstrate the skill in a shared support agent.

## Backlog health

```txt
Give me the current open Zendesk backlog health for the support queue. Include ageing risk, ownership gaps, repeated themes, and 3 priority actions.
```

## Weekly report

```txt
Create a weekly support report for the last 7 days compared with the previous 7 days. Keep it concise and support-operational.
```

## Trend comparison

```txt
Are checkout-related support tickets increasing compared with the previous 7 days? Use Zendesk evidence only and mark SLA unavailable if you cannot see it.
```

## Daily digest

```txt
Give me today's support digest: what needs attention, what is ageing, what looks repeated, and what action should the support lead take next?
```

## Repeated-theme review

```txt
Review the last 7 days of open and newly created Zendesk tickets for repeated customer pain. Classify each pattern as likely duplicate, related but distinct, repeated support pain, possible incident signal, or inconclusive.
```

## Permission-limited session

```txt
Try to produce a backlog health report. If the active agent cannot see counts, metadata, SLA, or ticket details, explain the limitation without inventing data.
```

## Shared-agent capability profile prompt

Use this when installing the skill into a new shared agent or when reports are inconsistent across teammates:

```text
Check whether this shared support agent has enough Zendesk access for backlog trend reports. Use the workspace capability profile pattern, list confirmed read capabilities, optional data visibility, missing evidence, and any report types that should be considered permission-limited. Do not use personal views or hardcoded IDs.
```

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
