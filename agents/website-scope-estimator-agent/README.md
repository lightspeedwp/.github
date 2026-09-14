---
file_type: documentation
title: "Website Scope Estimator Agent Export"
description: "README for agents/website-scope-estimator-agent/README.md."
status: active
stability: stable
domain: governance
last_updated: "2026-08-19"
---

# Website Scope Estimator Agent Export

[![License: GPL v3 or later](https://img.shields.io/badge/License-GPL%20v3%20or%20later-blue.svg)](https://www.gnu.org/licenses/gpl-3.0.html)

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](<https://img.shields.io/badge/Docs> Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Main Branch Guard](<https://img.shields.io/badge/Main> Branch Guard-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
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

Generated: 2026-07-14T11:31:50.037051+00:00

This archive contains only files readable in the current environment. It excludes hidden system/developer instructions, protected runtime internals, connector credentials, authentication tokens, and other resources not explicitly exposed as readable files.

## Contents

- `agent/`: exported workspace instructions, safe configuration references, templates, reference material, tests/examples, and durable memory/project-context files.
- `skills/local/`: readable local, built-in, and system skill folders.
- `skills/agent-attached/`: readable Hermes/agent-attached skill folders.
- `skills/plugin-provided/`: readable marketplace/plugin skill folders.
- `manifests/`: agent file inventory, skills inventory, inaccessible-resource notes, and redaction log.
- `checksums.sha256`: SHA-256 checksums for exported files.

## Validation Summary

- Agent files exported: 60
- Skills discovered: 49
- Fully exported skills: 49
- Partially exported skills: 0
- Metadata-only skills: 0
- Redactions made: 1
- Empty exported files: 0

## Skill Folder Comparison

| Skill | Original file count | Exported file count | Result |
| ----- | ------------------- | ------------------- | ------ |
| Presentations | 112 | 112 | match |
| Spreadsheets | 12 | 12 | match |
| documents | 76 | 76 | match |
| estimator-onboarding | 3 | 3 | match |
| figma-code-connect | 3 | 3 | match |
| figma-create-new-file | 1 | 1 | match |
| figma-generate-design | 3 | 3 | match |
| figma-generate-diagram | 8 | 8 | match |
| figma-generate-library | 17 | 17 | match |
| figma-implement-motion | 7 | 7 | match |
| figma-swiftui | 3 | 3 | match |
| figma-use | 21 | 21 | match |
| figma-use-figjam | 14 | 14 | match |
| figma-use-motion | 3 | 3 | match |
| figma-use-slides | 7 | 7 | match |
| frontend-skill | 2 | 2 | match |
| gh-address-comments | 6 | 6 | match |
| gh-fix-ci | 6 | 6 | match |
| github | 4 | 4 | match |
| gmail | 12 | 12 | match |
| gmail-inbox-triage | 4 | 4 | match |
| google-calendar | 4 | 4 | match |
| google-calendar-daily-brief | 5 | 5 | match |
| google-calendar-free-up-time | 4 | 4 | match |
| google-calendar-group-scheduler | 4 | 4 | match |
| google-calendar-meeting-prep | 4 | 4 | match |
| google-docs | 19 | 19 | match |
| google-drive | 10 | 10 | match |
| google-drive-comments | 2 | 2 | match |
| google-sheets | 11 | 11 | match |
| google-slides | 19 | 19 | match |
| imagegen | 12 | 12 | match |
| linear | 5 | 5 | match |
| openai-docs | 10 | 10 | match |
| pdf | 3 | 3 | match |
| plugin-creator | 10 | 10 | match |
| quote-readiness | 2 | 2 | match |
| skill-creator | 9 | 9 | match |
| skill-installer | 8 | 8 | match |
| slack | 5 | 5 | match |
| slack-channel-summarization | 4 | 4 | match |
| slack-daily-digest | 4 | 4 | match |
| slack-notification-triage | 4 | 4 | match |
| slack-outgoing-message | 4 | 4 | match |
| slack-reply-drafting | 4 | 4 | match |
| website-evidence-pass | 2 | 2 | match |
| website-intake-workflow | 3 | 3 | match |
| website-package-routing | 2 | 2 | match |
| yeet | 5 | 5 | match |

---

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*
