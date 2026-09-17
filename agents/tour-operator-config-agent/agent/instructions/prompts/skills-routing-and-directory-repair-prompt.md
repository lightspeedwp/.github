# Skills routing and directory repair prompt

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
<!-- BADGES-END -->

Repair the skill-routing, skill-directory, and skill-maintenance issues previously found for this agent.

This is a maintenance implementation task. Do not just review. Make the needed edits, skill-package follow-through, and consistency updates.

## Goal

Bring the agent’s skill layer back into a coherent state by repairing:

- stale skill references in instructions or docs
- outdated attached-skill inventories
- mismatches between attached skills and routing notes
- stale consistency-source files and routing snapshots
- locally staged or draft skills that should be attached or updated in the draft
- any drift that presents staged Tour Operator skill material as a currently attached specialist route when the draft does not show that attachment

## Scope

Inspect and update, where relevant:

- the current saved agent instructions
- `prompts/`
- `tests/`
- `scripts/`
- README files
- routing snapshots
- consistency-source files
- attached uploaded skill packages
- locally staged skill folders that are clearly intended as current updates

## Source of truth

Use these as the source of truth, in order:

- the current attached skill set in the draft
- the current saved agent instructions
- the current attached file tree
- the actual files inside attached uploaded skills when available
- locally staged skill folders only when they are clearly the current intended source for a skill update or new attach flow

## Required repair work

### 1. Fix instruction routing drift

Repair the instructions so they:

- reference only currently attached skills
- use exact attached skill names consistently
- preserve the current role and routing behaviour as closely as possible
- route to the narrowest relevant attached skill instead of stale or unattached alternatives

### 2. Fix maintenance-doc and snapshot drift

Update any stale attached-skill lists or routing references in:

- `prompts/`
- `tests/`
- README files
- routing snapshots
- consistency-source files

Make only the smallest coherent edits needed.

### 3. Fix skill package follow-through when required

When a locally staged or draft skill clearly represents the intended current version:

- update the attached skill in place when it is the same skill
- attach the skill when it is a new intended addition
- keep the existing attached skill id when updating an already attached uploaded skill

If the draft then needs to be made live for users outside preview to get the change, say that the agent needs **Update**.

### 4. Repair package-level issues when in scope

If an inspected attached or staged uploaded skill has obvious package issues, repair only issues that are clearly supported by the current evidence, such as:

- stale canonical naming or description mismatches
- stale examples or support-file references that no longer match the skill’s role
- thin or misleading trigger descriptions
- inconsistent metadata between `SKILL.md` and `agents/openai.yaml`
- package wording that overstates or misstates current attachment status in maintenance docs

Do not redesign the skill unless the issue requires it.

## Anti-drift rules

Do not leave behind:

- unattached skill references in instructions or docs
- stale old skill names
- workspace-only or shared-directory dependencies presented as attached routes
- duplicate route ownership where a narrower attached skill should clearly own the workflow
- claims that a local skill has been attached or updated when that follow-through did not actually happen
- wording that presents staged Tour Operator skill material as a currently attached specialist route when the draft does not show that attachment

## Editing rules

- Be surgical, not expansive.
- Preserve the current role, domain, and routing behaviour where possible.
- Do not invent new skills, workflows, folders, or validation assets.
- Do not detach skills unless the user clearly asked for that removal.
- Keep exact paths and exact attached skill names accurate.
- Use UK English.

## Validation expectations

After repairing issues, run the relevant checks for the files or skills you touched.

At minimum, run the checks relevant to:

- instruction/file consistency
- routing snapshot and consistency-source alignment
- agent structure or documentation consistency where applicable
- skill package validity when a staged or attached uploaded skill package was edited

If some issue could not be repaired because the relevant skill package or file could not be inspected in the current session, say so clearly.

## Deliverables

1. State which issues were repaired.
2. List which files or skill packages were updated.
3. State any attach or same-id skill-update follow-through completed.
4. List which checks were run and whether they passed or failed.
5. List any remaining blocking or non-blocking issues that still need follow-up.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)
