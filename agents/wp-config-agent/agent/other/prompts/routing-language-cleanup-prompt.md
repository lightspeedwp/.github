# Routing Language Cleanup Prompt

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

Run a broader consistency pass across this agent’s remaining documentation, maintenance notes, examples, and validation sources so they stay aligned with the current routing language and specialist-skill split.

Scope and intent:

- This is a cleanup and consistency task, not a rewrite of the main routing system.
- Treat the current system instructions, attached local skills, and attached agent file tree as the source of truth.
- Nothing in the already-updated routing and validation slice is currently blocking; preserve that status.
- Focus only on residual inconsistencies, stale wording, missing references, validation drift, or test-source gaps that still surround the updated routing language.

Source of truth:

- Current system instructions
- Current attached local skills, especially:
  - `wordpress-site-onboarding`
  - `wordpress-inspection-preflight`
  - `wordpress-request-router`
  - `wordpress-audit-reporting`
  - `wordpress-remediation-planner`
  - `yoast-configuration`
  - `yoast-auditor`
  - `gravity-forms-configuration`
  - `gravity-forms-auditor`
  - `wordpress-accessibility-checker`
- Current attached file tree and current file contents
- Current attached apps and current reporting rules

Primary goal:

- Tighten the broader validation and documentation layer around the current routing model without reopening settled routing decisions.

What to review:

1. Reference guides in `references/`
2. Folder READMEs and other maintenance notes
3. Templates in `templates/`
4. Worked examples in `examples/`
5. Validation schemas in `schemas/`
6. Validation runners and helper scripts in `scripts/`
7. Any business-context or maintenance wording that still frames the old specialist split

What to check for:

- lingering references to superseded Yoast or Gravity Forms skill choices
- wording that blurs configuration/change work with read-only audit/review work
- reporting guidance that conflicts with the current router or auditor split
- examples or templates that imply the wrong skill path
- validator names, validator comments, or script assumptions that no longer match the current routing language
- missing consistency checks that would help catch future drift in routing, specialist-skill references, or audit/configuration separation
- outdated mentions of shared skills, workspace skills, directory skills, or old skill names for Yoast and Gravity Forms
- maintenance docs that refer to a narrower attached-skill set than the current local skill inventory now supports

Required routing model to preserve:

- Yoast setup, planning, reusable guidance, remediation planning, and configuration work route to `yoast-configuration`
- Yoast audits, evidence review, validation, launch QA, report-led review, and structured review work route to `yoast-auditor`
- Gravity Forms setup, implementation, troubleshooting, validation, change work, and handoff work route to `gravity-forms-configuration`
- Gravity Forms read-only audits, findings registers, evidence-led review, scorecards, and audit summaries route to `gravity-forms-auditor`
- routing classification and dev-vs-live clarification before site-specific inspection remain owned by `wordpress-request-router`
- deeper site-specific inspection discipline may rely on `wordpress-inspection-preflight` when current-state verification is required
- accessibility-checker findings, exported accessibility evidence, remediation planning, and safe accessibility content-edit recommendations route to `wordpress-accessibility-checker`

Editing rules:

- Make the smallest complete set of edits needed.
- Do not broaden scope into unrelated platform, app, Memory, or business-domain rewrites.
- Do not reopen sections that are already aligned unless a change is required for consistency.
- Remove conflicting references instead of leaving soft contradictions behind.
- Preserve still-correct guidance, examples, and validation assets.
- If a file is already aligned, leave it unchanged.

Validation focus:

- Ensure documentation, templates, examples, schemas, and scripts all agree on the routing split.
- Check whether `scripts/` should include additional validation coverage for:
  - outdated specialist-skill references
  - configuration-vs-audit wording drift
  - stale Yoast or Gravity Forms route language in docs or examples
  - mismatch between reporting guidance and router-owned output paths
- If new validation is warranted, prefer the lightest deterministic check that catches real future drift.

Output:

1. Files reviewed
2. Files updated
3. Any validator or test-source gaps found
4. Any new validation checks recommended or added
5. Any remaining non-blocking ambiguity
6. A clear statement on whether the broader documentation and validation layer is now aligned with the current routing language

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
