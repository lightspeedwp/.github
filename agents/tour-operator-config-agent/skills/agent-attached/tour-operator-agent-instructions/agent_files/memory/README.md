# Memory

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

[![License: GPL v3 or later](https://img.shields.io/badge/License-GPL%20v3%20or%20later-blue.svg)](https://www.gnu.org/licenses/gpl-3.0.html)

Use this folder for durable project state, repeated preferences, QA continuity, and handoff notes for **tour operator website WordPress delivery**.

## Included files

- `todos.md` for active actions, blockers, approvals, and next steps
- `user-preferences.md` for stable client, site, plugin, form, SEO, and QA preferences
- `project-history.md` for durable milestones, major configuration changes, and important audit outcomes
- `session-handoff.md` for concise in-progress handoff notes when multi-step work should resume later

## How to use this folder

- Check Memory before asking repeat questions about the same project.
- Check `user-preferences.md` and `todos.md` at the start of audits, implementation work, and resumed multi-step work.
- Check `session-handoff.md` before continuing interrupted or long-running work.
- Reuse confirmed site facts, plugin-stack decisions, form requirements, SEO priorities, and QA expectations when they are still current.
- Keep preferences, active work, history, and handoff state clearly separated.
- Save concise durable facts, not long narrative transcripts.
- Update Memory after meaningful audits, plugin changes, Gravity Forms planning, Yoast SEO reviews, or important QA decisions.
- Treat Memory as durable working state, not as a place for fixed reference standards or bulky report outputs.
- Record whether plugin-stack facts are user-provided, observed through connected tools, or inferred from partial evidence.
- Do not let Memory override fresher evidence from a connected site inspection.

## What belongs in Memory

- stable client or project preferences
- confirmed site facts that will matter again
- current project status, blockers, approvals, and next actions
- important QA status and unresolved risks
- major tour operator plugin, Gravity Forms, or Yoast SEO decisions worth reusing
- approved use of the LightSpeedWP Tour Operator core plugin and first-party extensions for a project

## What does not belong in Memory

- bulky reference material already stored in `references/`
- temporary scratch work
- copied raw tool output without summarisation
- unconfirmed assumptions
- credentials, secrets, tokens, or sensitive auth details

## Content-model memory rule

Do not save the full Tour Operator content model in Memory. Keep the full model in `references/tour-operator-content-model-standard.md`. Save only concise durable decisions such as the approved use of core CPTs, confirmed extension usage, unusual project-specific content-model deviations, unresolved content-model blockers, or the source/date of a major model decision.

## Validation note

Memory files in this folder should be checked with:

- `schemas/memory-file-validation-schema.json`
- `scripts/file-schema-validator.py`
- `scripts/validate-memory-files.py`

This helps keep durable preferences, active work, history, and handoff state clearly separated.

---

*📐 The blueprint for getting things right, every time*

## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)
