# Validation-Pack Tightening Prompt

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

Run a broader consistency pass over this agent’s validation layer so the current routing language, specialist-skill split, maintenance notes, and test sources stay aligned.

Scope and intent:

- This is a validation-pack tightening task, not a rewrite of the main routing system.
- Treat the current system instructions, attached local skills, attached file tree, and current validation assets as the source of truth.
- Nothing in the already-updated routing and validation slice is currently blocking; preserve that status.
- Focus on residual validation drift, stale test assumptions, missing consistency checks, outdated maintenance wording, and gaps between the current routing language and the surrounding validation pack.

Primary goal:

- Tighten the broader validation and maintenance layer around the current routing model without reopening settled routing decisions.

Source of truth:

- Current system instructions
- Current attached local skills, especially:
  - `wordpress-request-router`
  - `wordpress-audit-reporting`
  - `wordpress-remediation-planner`
  - `yoast-configuration`
  - `yoast-auditor`
  - `gravity-forms-configuration`
  - `gravity-forms-auditor`
- Current attached file tree and current file contents
- Current validation assets in `schemas/`, `scripts/`, `fixtures/`, `examples/`, `templates/`, `references/`, and `prompts/`
- Current attached apps and current reporting rules where validation wording depends on them

What to review:

1. Validation runners and helper scripts in `scripts/`
2. Validation schemas in `schemas/`
3. Compact regression or support inputs in `fixtures/`
4. Worked examples in `examples/` where they influence validation assumptions
5. Templates in `templates/` where validators depend on structure
6. Maintenance notes and validation guidance in `references/`, folder READMEs, and `prompts/`
7. Any business-context or maintenance wording that still frames the old specialist split or stale route language

What to check for:

- lingering references to superseded Yoast or Gravity Forms skill choices
- wording that blurs configuration/change work with read-only audit/review work
- validator names, validator comments, helper-script assumptions, or prompt wording that no longer match the current routing language
- missing validation checks that would help catch future drift in routing, specialist-skill references, audit-versus-configuration separation, or report-path wording
- stale mentions of shared skills, workspace skills, directory skills, or old skill names for Yoast and Gravity Forms
- inconsistencies between scripts, schemas, fixtures, examples, templates, and maintenance docs
- validation coverage gaps around prompts, README inventories, or route-language consistency where lightweight checks would help

Required routing model to preserve:

- Yoast setup, planning, reusable guidance, remediation planning, and configuration work route to `yoast-configuration`
- Yoast audits, evidence review, validation, launch QA, report-led review, and structured review work route to `yoast-auditor`
- Gravity Forms setup, implementation, troubleshooting, validation, change work, and handoff work route to `gravity-forms-configuration`
- Gravity Forms read-only audits, findings registers, evidence-led review, scorecards, and audit summaries route to `gravity-forms-auditor`

Editing rules:

- Make the smallest complete set of edits needed.
- Prefer lightweight deterministic validation additions when they catch real future drift.
- Do not broaden scope into unrelated app, Memory, business-domain, or workflow rewrites.
- Do not reopen sections that are already aligned unless a change is required for consistency.
- Remove conflicting references instead of leaving soft contradictions behind.
- Preserve still-correct guidance, examples, schemas, fixtures, scripts, and prompts.
- If a file is already aligned, leave it unchanged.

Validation focus:

- Ensure documentation, templates, examples, fixtures, schemas, prompts, and scripts all agree on the current routing split.
- Check whether `scripts/` should include additional coverage for:
  - outdated specialist-skill references
  - configuration-versus-audit wording drift
  - stale Yoast or Gravity Forms route language in docs, examples, prompts, or fixtures
  - mismatch between reporting guidance and router-owned output paths
  - README inventory drift across attached folders
  - prompt-library drift against the current attached prompt files
- If new validation is warranted, prefer the lightest deterministic check that catches real future drift.

Output:

1. Files reviewed
2. Files updated
3. Any validator, fixture, prompt, or test-source gaps found
4. Any new validation checks recommended or added
5. Any remaining non-blocking ambiguity
6. A clear statement on whether the broader validation pack is now aligned with the current routing language

---

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)
