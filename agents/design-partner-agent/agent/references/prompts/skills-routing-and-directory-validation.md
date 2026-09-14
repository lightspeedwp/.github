# Skills routing and directory validation

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

Run a focused validation pass on this agent’s skill routing layer and attached-skill surface so the agent routes work to the right skills, describes those skills accurately, and stays aligned with the currently attached skill inventory.

## Goal

Validate that the agent’s routing guidance, skill references, and visible skill package surfaces are internally consistent, grounded, and specific enough to steer requests to the correct skill without overclaiming hidden coverage.

## Required workflow

1. Refresh your understanding of the current visible agent state before editing anything.
2. Review the agent instructions sections that route work to skills, especially route definitions, workflow lists, escalation guidance, and specialist handoff guidance.
3. Review the current attached skill inventory visible on the agent.
4. If attached skill package files are visible or staged, inspect the relevant skill files that materially affect routing, naming, or declared scope.
5. Check for drift between:
   - skill names in the instructions and the currently attached skills
   - route descriptions and the actual purpose of each attached skill
   - broad workflow promises and the narrower skill descriptions
   - specialist escalation language and the upstream artifact boundaries
   - prompt, README, or package notes that mention skill families or skill coverage
6. Apply the smallest useful set of updates needed to improve routing clarity and skill-surface accuracy.

## What to validate

- every skill named in the instructions is actually attached and named consistently
- no attached core skill is missing from the routing model when it clearly supports a routed workflow
- routing language sends narrow requests to the lightest correct skill instead of over-escalating
- direct-work guidance does not conflict with skill-trigger guidance
- upstream brief, critique, audit, synthesis, experiments, and handoff boundaries are distinct enough to reduce overlap
- specialist WordPress, parity, release, claim-validation, DESIGN.md, and readiness skills are introduced only when the upstream artifact is ready
- skill descriptions used in prompts or notes do not promise outputs the attached skill does not clearly support
- any visible skill-directory notes, package references, or maintenance prompts stay aligned with the current attached skill set

## Directory and package checks

- If staged skill package files exist, verify that visible `SKILL.md` or related package metadata supports the routing claims made in the agent instructions.
- If skill package files are not visible or staged, do not invent their contents; validate only against grounded attached-skill metadata and visible instructions.
- Do not assume a hidden skills folder exists in agent files just because skills are attached elsewhere.
- Treat attached-skill metadata as the minimum grounded source, and skill package files as higher-confidence evidence only when actually available.

## Editing rules

- Keep fixes conservative and grounded in the current agent state.
- Prefer exact skill names, exact route labels, and exact workflow boundaries when updating references.
- Do not invent hidden skills, hidden folders, hidden package files, or unstaged skill instructions.
- Do not widen the agent’s scope just to give every skill a job.
- Preserve useful routing structure unless it is stale, contradictory, or clearly misaligned with the current attached skills.
- When a route can be handled directly without a skill, keep that path explicit instead of forcing unnecessary skill routing.

## Deliverable

Apply the smallest useful set of updates needed to make the agent’s skill routing and visible skill-directory references more internally consistent across instructions, attached skills, prompt notes, and any grounded skill package files.

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)
