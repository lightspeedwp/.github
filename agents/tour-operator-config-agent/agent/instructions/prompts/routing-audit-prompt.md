# Routing audit prompt

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

Audit this agent’s current instructions, routing notes, validation snapshots, and nearby documentation so they align with the currently attached specialist skills only.

This is a maintenance implementation task. Do not just review. Make the edits where needed.

## Scope

Inspect and update, where relevant:

- the agent instructions
- instruction-linked routing notes
- routing snapshots
- validation notes
- README text that describes routing, specialist handoff, launch-readiness review, or audit preparation
- prompt-pack notes that could be mistaken for attached-skill routing

## Source of truth

Use only:

- the current attached skill set
- the current saved agent instructions
- the current attached file tree

## Current attached specialist skills

- `site-preflight`
- `pre-launch-readiness-review`
- `yoast-configuration`
- `yoast-auditor`
- `gravity-forms-configuration`
- `gravity-forms-auditor`
- `wordpress-accessibility-checker`
- `agent-asset-validation-maintainer`

## Routing goals

Make sure the current routing logic reflects that:

- `site-preflight` is the default first specialist route for baseline inspection, environment verification, plugin-stack snapshotting, confirmed facts, assumption tracking, audit preparation, and clean handoff into deeper specialist work
- `pre-launch-readiness-review` is the default route for launch-readiness, final QA, blocker triage, sign-off, client-safe handoff, and launch-status reporting
- general Tour Operator website planning, audits, content-structure interpretation, plugin-stack coherence checks, WordPress Tour Operator plugin and extension workflows, and broader handoff work stay in the main agent workflow unless a narrower attached specialist route clearly applies
- `gravity-forms-auditor` and `gravity-forms-configuration` are kept distinct as audit versus configuration or approved implementation routes
- `yoast-auditor` and `yoast-configuration` are kept distinct as audit versus configuration or approved implementation routes
- `wordpress-accessibility-checker` stays narrow and does not absorb general QA, preflight, or launch-readiness routing
- `agent-asset-validation-maintainer` is the specialist route for self-audit, maintenance review, and validation-gap analysis on the agent’s own assets
- no routing note should present an unattached Tour Operator specialist skill or stale old Tour Operator route as a current attached route
- prompt-pack content under `prompts/tour-operator-website/` must not be treated as proof that a matching specialist skill is attached

## Anti-drift rules

Do not leave text that depends on:

- workspace-only skills
- shared directory skills
- removed skills
- stale old skill names
- generic unattached `wordpress-*` skill references
- old non-attached Yoast skill names
- silent dependence on skills that are no longer attached
- unattached Tour Operator specialist skill references presented as current attached routes
- wording that treats prompt-pack references as attached-skill routing proof

## Editing rules

- Be surgical, not expansive.
- Update only the sections or notes that are actually stale.
- Preserve the agent’s role, scope, and domain.
- Do not invent new skills, files, or workflows.
- Use exact attached skill names consistently.
- Use UK English.

## Validation expectations

After editing, run the relevant validation checks for the files you touched.

At minimum, run the checks that are relevant to:

- instruction/file consistency
- routing snapshot or validation-note consistency
- documentation consistency where applicable

If a validation script needs attached files staged locally first, stage the needed files and rerun the check.

## Deliverables

1. Update any stale routing-related instructions or notes.
2. Run the relevant validation checks.
3. Report:
   - which files were changed
   - which stale routing or skill references were removed
   - what routing behaviour was tightened
   - which checks were run
   - whether they passed or failed
   - any remaining non-blocking routing cleanup still recommended

---

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)
