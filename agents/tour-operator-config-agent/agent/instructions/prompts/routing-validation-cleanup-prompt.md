# Routing validation follow-up prompt

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

Run a broader pass over other consistency notes, validation notes, and test source files to tighten the rest of the validation layer around the current routing language.

This is a maintenance implementation task. Do not just review. Make the edits where needed.

## Context

The requested routing and validation slice is already corrected and is not currently blocking.

Your goal here is follow-up cleanup:

- inspect the wider validation layer
- find consistency notes, source snapshots, validation notes, and test-source files that still lag behind the current routing language
- make only the additional surgical edits needed to align them

## Scope

Inspect and update, where relevant:

- `tests/`
- `scripts/`
- validation source files
- consistency source files
- routing snapshots
- QA notes
- documentation that describes which skills the instructions route to
- any other attached validation-layer notes that appear stale because of the routing rewrite

## Source of truth

Use these as the source of truth:

- the current attached skill set
- the current saved agent instructions
- the current attached file tree
- the current validation scripts and schemas

## Current attached specialist skills

- `site-preflight`
- `pre-launch-readiness-review`
- `yoast-configuration`
- `yoast-auditor`
- `gravity-forms-configuration`
- `gravity-forms-auditor`
- `wordpress-accessibility-checker`
- `agent-asset-validation-maintainer`

## Required alignment goals

Make sure the wider validation layer reflects that:

- `site-preflight` is the default first specialist route for baseline inspection and audit preparation
- `pre-launch-readiness-review` is the default route for launch-readiness, final QA, blocker triage, sign-off, and launch-status work
- Gravity Forms audit and configuration routes are distinct
- Yoast audit and configuration routes are distinct
- `wordpress-accessibility-checker` stays narrow and does not absorb general QA, preflight, or launch-readiness routing
- `agent-asset-validation-maintainer` owns self-audit and maintenance-layer routing for this agent’s own assets
- no follow-up cleanup note should claim there is a currently attached Tour Operator specialist skill when none is attached in the current draft

## Anti-drift rules

Do not leave validation-layer text that depends on:

- workspace skills
- shared directory skills
- removed skills
- stale old skill names
- generic unattached `wordpress-*` skill references
- old non-attached Yoast skill names
- silent dependence on skills that are no longer attached
- unattached Tour Operator specialist skill references presented as current attached routes

## Editing rules

- Be surgical, not expansive.
- Update only the files that are actually stale.
- Preserve each file’s role unless a small wording fix is needed for consistency.
- Do not invent new skills, workflows, files, or validation assets.
- Keep exact paths and file names accurate.
- Use UK English.

## Validation expectations

After editing, run the relevant validation checks for the files you touched.

At minimum, run the checks that are relevant to:

- instruction/file consistency
- folder/schema consistency where applicable
- agent structure or validation-layer consistency where applicable

If a validation script needs attached files staged locally first, stage the needed files and rerun the check.

## Deliverables

1. Update any stale consistency notes or test-source files that need follow-up cleanup.
2. Run the relevant validation checks.
3. Report:
   - which files were changed
   - what stale routing or skill references were removed
   - what validation-layer wording was tightened
   - which checks were run
   - whether they passed or failed
   - any remaining non-blocking cleanup still recommended

---

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

_Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!_
