# Routing Validation Cleanup Prompt

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

## Purpose

Use this recurring prompt when you want a focused cleanup pass across the routing and validation slice of this agent pack.

## Prompt

Audit and tighten the routing-and-validation slice of this agent pack.

Primary goal:

- make the current routing language, validation guidance, and supporting consistency notes agree with each other
- leave nothing in the routing/validation slice blocking
- keep the pass conservative and grounded to the real file tree

Scope priorities:

1. routing language and consistency notes
2. validation guidance and validation-adjacent documentation
3. linked test sources, examples, or references that should match the routing language
4. only then any broader consistency touch-ups that clearly improve the same validation layer

Required working rules:

- Treat the current file tree as source of truth.
- Prefer tightening existing wording over broad rewrites.
- Keep the pass limited to the routing/validation slice unless a nearby inconsistency would otherwise leave that slice misleading or blocked.
- If you touch related files outside the core slice, keep those edits minimal and directly supportive of the routing/validation goal.
- Do not invent files, folders, validators, schemas, or references that are not justified by the existing structure.
- Keep duplicate findings conservative and only treat exact duplicates as deletion candidates.

During the pass:

- compare root and folder README guidance against the actual structure
- check validation checklists, validator references, and routing wording for drift
- tighten consistency notes where the new routing language should now be the canonical wording
- review nearby examples, references, or test-source docs only when they materially affect validation accuracy
- preserve the existing Playwright Testing Agent role and asset-pack structure

Output requirements:

1. short audit summary of what was inconsistent
2. exact files updated
3. remaining non-blocking follow-up opportunities, if any
4. explicit confirmation that nothing in the requested routing/validation slice remains blocking

Validation expectation:

- Run the documented validation entry point when file-quality changes are in scope.
- If a broader pass is useful, do it only where it tightens the same validation layer around the new routing language.

## Best Use Cases

- after changing routing terminology
- after tightening validator rules or checklist wording
- before a README refresh pass
- before a validation-pack tightening pass

---

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*
