# Gravity Forms Assets Consistency Prompt

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

Run a recurring maintenance pass over this agent’s Gravity Forms assets so the current routing split, configuration guidance, audit guidance, templates, references, prompts, and maintenance docs stay aligned.

Scope and intent:

- This is a Gravity Forms maintenance and consistency task, not a broad rewrite of the agent.
- Treat the current instructions, attached Gravity Forms skills, and attached Gravity Forms files as the source of truth.
- Focus on the separation between configuration/change work and read-only audit/review work.

Primary goal:

- Keep the Gravity Forms maintenance layer consistent across instructions, prompts, references, templates, schemas, examples, and validation notes.

Source of truth:

- Current system instructions
- Current attached local Gravity Forms skills
- Current attached file tree and current file contents
- Current Gravity Forms templates, schemas, references, examples, prompts, and validation docs

What to review:

1. Gravity Forms routing and workflow sections in the instructions
2. Gravity Forms templates and schemas
3. `references/gravity-forms-standard.md`
4. Gravity Forms prompts, examples, and README references
5. Validation docs and validator comments where Gravity Forms assumptions appear

What to validate:

- configuration/change work still routes to the correct local Gravity Forms configuration skill
- read-only audit/review work still routes to the correct local Gravity Forms auditor skill
- templates, schemas, and references do not blur implementation work with audit outputs
- no stale shared/workspace/directory/superseded Gravity Forms skill references remain
- maintenance docs accurately describe current Gravity Forms assets and their roles

Editing rules:

- Make the smallest complete set of edits needed.
- Preserve still-correct Gravity Forms workflow guidance.
- Remove conflicting references instead of leaving soft contradictions behind.
- If a file is already aligned, leave it unchanged.

Output:

1. Files reviewed
2. Files updated
3. Any stale Gravity Forms references removed
4. Any configuration-vs-audit ambiguity found
5. Any .schemas/template/reference mismatches found
6. A clear statement on whether the Gravity Forms asset set is now aligned

---

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*
