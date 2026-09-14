# App and Connectors Consistency Prompt

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

Run a maintenance pass over this agent’s app, connector, and runtime-tool documentation so all app references stay aligned with the current attached apps, current instructions, and current reference guides.

Scope and intent:

- This is a consistency and documentation task, not a broad app reconfiguration task.
- Treat the current attached apps, current instructions, current attached file tree, and current connector guidance as the source of truth.
- Focus on residual wording drift, stale app references, outdated capability claims, and maintenance docs that no longer match the current attached app set.

Primary goal:

- Keep app usage guidance, evidence boundaries, and connected-tool references aligned with the current attached apps and current runtime-tool usage.

Source of truth:

- Current attached apps and current app access mode
- Current system instructions
- `references/CONNECTORS.md`
- root and folder README files where app usage is described
- validation docs and prompts that refer to app-backed work

What to review:

1. `references/CONNECTORS.md`
2. system-instruction app sections
3. `README.md` and folder README files that mention app usage or evidence sources
4. prompts and validation docs that mention connected inspection, app evidence, or routing gates

What to check for:

- stale references to apps that are no longer attached
- missing references to apps that now materially shape the workflow
- wording that overstates connected capabilities
- wording that blurs app evidence, file evidence, and Memory
- outdated environment wording around dev versus live WordPress connectors
- stale app names, labels, or capability assumptions

Editing rules:

- Make the smallest complete set of edits needed.
- Preserve still-correct app guidance.
- Do not invent app capabilities that are not grounded in the current attached app state.
- Do not broaden into unrelated routing, Memory, or business-domain rewrites.
- If a file is already aligned, leave it unchanged.

Output:

1. Files reviewed
2. Files updated
3. Any stale app or connector references removed
4. Any capability or evidence-boundary ambiguities found
5. Any validation checks recommended or added
6. A clear statement on whether the app and connector guidance is now aligned with the current attached app set

---

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)
