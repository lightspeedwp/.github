# Yoast Assets Consistency Prompt

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

Run a recurring maintenance pass over this agent’s Yoast SEO assets so the current routing split, setup guidance, audit guidance, launch-QA references, prompts, and maintenance docs stay aligned.

Scope and intent:

- This is a Yoast maintenance and consistency task, not a broad rewrite of the agent.
- Treat the current instructions, attached Yoast skills, and attached Yoast-related files as the source of truth.
- Focus on the separation between setup/configuration/planning work and audit/review/validation work.

Primary goal:

- Keep the Yoast maintenance layer consistent across instructions, prompts, references, checklists, examples, and validation notes.

Source of truth:

- Current system instructions
- Current attached local Yoast skills
- Current attached file tree and current file contents
- Current Yoast-related references, checklists, prompts, and maintenance docs

What to review:

1. Yoast routing and workflow sections in the instructions
2. Yoast-related checklists and references
3. Launch-readiness docs where Yoast SEO is part of the review path
4. Prompt files and README files that mention Yoast SEO work
5. Validation docs and validator comments where Yoast assumptions appear

What to validate:

- setup, planning, reusable guidance, remediation planning, and configuration work still route to the correct local Yoast configuration skill
- audits, evidence review, validation, launch QA, and report-led review still route to the correct local Yoast auditor skill
- checklists, references, and prompts do not blur planning/configuration work with audit outputs
- no stale shared/workspace/directory/superseded Yoast skill references remain
- maintenance docs accurately describe the current Yoast-related assets and their roles

Editing rules:

- Make the smallest complete set of edits needed.
- Preserve still-correct Yoast workflow guidance.
- Remove conflicting references instead of leaving soft contradictions behind.
- If a file is already aligned, leave it unchanged.

Output:

1. Files reviewed
2. Files updated
3. Any stale Yoast references removed
4. Any configuration-vs-audit ambiguity found
5. Any checklist/reference/prompt mismatches found
6. A clear statement on whether the Yoast asset set is now aligned

---

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)
