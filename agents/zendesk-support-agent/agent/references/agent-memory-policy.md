# Agent Memory Policy

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

Use this file as the durable memory contract for the Zendesk Support Agent.

## Purpose

Memory is for durable operating defaults that should help future runs produce better Zendesk-first outputs without forcing the user to restate the same standing preferences.

Memory is not a second ticket record, not a place for raw case evidence, and not a backup of Zendesk.

## Core rules

- Keep Zendesk as the primary system of record for case evidence.
- Save only durable preferences, reusable defaults, and cross-run follow-up items that still matter later.
- Save the smallest durable summary that will help a future run.
- Update existing memory entries instead of stacking contradictions.
- Remove stale, completed, or superseded items promptly.
- Keep memory human-readable, schema-aligned, and validation-friendly.

## What may be saved

- recurring user or team preferences for repeated outputs
- preferred report sections, grouping, comparison behavior, and example-ticket rules
- durable drafting preferences for replies, handoffs, escalations, and documentation-worthiness reviews
- stable escalation or handoff wording preferences
- reusable timezone, date-formatting, or detail-level preferences
- open follow-up work that should persist across future runs until completed or intentionally removed
- stable quality expectations that are not already fixed in the instructions or support profile

## What must not be saved

- one-off ticket evidence
- copied customer threads or ticket transcripts
- case-specific conclusions, root-cause guesses, or temporary investigation notes
- raw tool payloads, internal wrappers, or hidden metadata
- private customer details that belong only to the active case
- ticket URLs, case links, or issue-specific identifiers that are useful only for the current case
- undocumented policy claims, approval claims, or speculative workaround notes
- secrets, credentials, or private internal commentary

## Approved memory files

### `memory/user-preferences.md`

Use for durable user or team preferences that affect repeated deliverables.

- Expected contract: `schemas/user-preferences.schema.json`
- Typical content: preferred reply tone, report sections, timezone/date formatting, escalation wording, detail level, report scope, example-ticket rule.

### `memory/report-defaults.yaml`

Use for recurring report defaults.

- Expected contract: `schemas/report-defaults.schema.json`
- Typical content: timeframe, included sections, next-action count, comparison mode, example-ticket inclusion.

### `memory/drafting-preferences.md`

Use for stable drafting defaults for replies, handoffs, escalations, and documentation reviews.

- Expected contract: `schemas/drafting-preferences.schema.json`
- Typical content: empathy level, brevity preference, escalation style, handoff style, documentation style, apology preference, next-step preference.

### `memory/todos.md`

Use for durable cross-run follow-up items that should persist until completed or intentionally removed.

- Expected contract: `schemas/todos.schema.json`
- Typical content: grouped durable follow-up items, not case transcripts.

## Structure rules

- Keep one durable preference per bullet line where that file format uses bullets.
- Use concise, stable labels that a future run can safely reuse.
- Prefer additive updates that preserve schema-valid structure.
- When a preference is no longer valid, replace or remove it instead of leaving contradictory history behind.
- Keep memory files narrow: each file should have one clear purpose.

## How memory supports future runs

- Check memory before repeated reports, replies, handoffs, escalations, or documentation-worthiness reviews.
- Reuse durable defaults only when they still fit the request.
- Let the live request override memory when they conflict.
- Use memory to reduce repeated setup, not to avoid fresh Zendesk evidence gathering.
- If memory is silent or stale, proceed with the safest grounded default and refresh memory only when a durable preference is now clear.

## Schema and validation alignment

- `memory/user-preferences.md` must stay aligned with `schemas/user-preferences.schema.json`.
- `memory/report-defaults.yaml` must stay aligned with `schemas/report-defaults.schema.json`.
- `memory/drafting-preferences.md` must stay aligned with `schemas/drafting-preferences.schema.json`.
- `memory/todos.md` must stay aligned with `schemas/todos.schema.json`.
- Memory examples must stay aligned with the same schemas.
- `tests/memory-validation-tests.md` should describe the checks that protect this policy.
- `scripts/validate_memory.py`, `scripts/validate_memory_content.py`, and `scripts/validate_schema_files.py` should continue to enforce the approved structure and prohibited content.

## Editing rule

When the memory contract changes, update this file, the relevant schemas, memory examples, validation tests, and instructions together.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)
