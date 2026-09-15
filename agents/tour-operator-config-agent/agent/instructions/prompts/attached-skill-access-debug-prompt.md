# Attached skill access debug prompt

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
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![events-issue-pr-metadata](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml)
[![issue-management](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml)
[![pr-workflow](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml)
[![project-management](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml)
[![release-orchestration](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml)
[![reporting-metrics](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml)
<!-- BADGES-END -->

Diagnose why an attached uploaded skill appears in the current draft but cannot be opened, staged, validated, or updated in the current editor session.

This is a maintenance debugging task. Do not assume the skill package is healthy just because it appears attached. Separate attachment state, package readability, same-id update readiness, and editor-tooling failures.

## Scope

Inspect and reason about, where available:

- the current attached skill inventory in the draft
- the named skill's attached metadata
- whether the skill package can be opened in the current session
- whether the failure is an access/staging issue, package issue, or editor-side execution issue
- whether a same-id attached skill update path is still possible
- any maintenance docs that overclaim the skill as verified, readable, or editable

## Source of truth

Use these as the source of truth:

- the current attached skill set in the draft
- any direct result from opening the attached skill package
- the actual staged package files when they are readable
- the current saved agent instructions only for routing context, not as proof the package is healthy

## Required checks

For the named attached skill, verify and report separately:

1. whether the skill is attached in the draft
2. whether the skill package can be opened in the current session
3. whether `SKILL.md` and `agents/openai.yaml` are directly readable
4. whether local validation can actually be run
5. whether the blocker is:
   - not attached
   - attached but unreadable
   - readable but invalid
   - readable but failing validation
   - same-id update blocked
   - transient editor execution failure
6. whether the package metadata and the agent's routing claims still match

For `tour-operator-website`, explicitly distinguish:

- attachment to the Tour Operator Configuration Agent
- package readability in the current session
- whether the blocker is a real attach failure or an access failure after attachment

## Debugging rules

- Do not claim the skill is healthy, validated, or updated unless the package files were opened successfully.
- Do not claim an attachment problem when the evidence only shows a read/open failure.
- Do not silently fall back to editing only the agent instructions.
- If the package cannot be opened, treat that as the primary blocker and stop short of package-edit claims.
- If the package is readable, inspect the files before recommending re-upload or replacement.
- Prefer preserving the same attached skill identity when recommending recovery.
- Use UK English.

## Recovery guidance

If the skill is attached but unreadable, prioritise these interpretations in order:

1. editor-side access or staging failure
2. attachment record versus package snapshot mismatch
3. same-id skill update path needing a fresh staged source
4. package-level validation or structure issue, but only if the files become readable and confirm it

If recovery steps are proposed, keep them narrow and evidence-backed.

## Deliverables

1. Report attachment state.
2. Report package readability state.
3. State the most likely blocker category.
4. State what evidence supports that diagnosis.
5. State the safest next recovery step.
6. List any files or docs that should be updated only after package access is restored.

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

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)
