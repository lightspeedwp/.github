# Validation Pack Tightening Prompt

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

Use this recurring prompt when you want to tighten the validation layer around the current instructions, routing language, attached folder structure, and maintenance guidance.

## Recommended prompt

```text
Tighten this WooCommerce Configuration Agent's validation pack around the current routing language, attached file structure, and maintenance guidance, then implement the changes directly.

Goals:
1. Reduce drift across instructions, references, tests, schemas, and validator guidance.
2. Keep the agent WooCommerce-first.
3. Use the current attached file tree and attached local skills as source of truth.
4. Improve validator clarity and coverage without inventing unsupported workflows.

Current routed local skills to preserve in validation wording:
- woocommerce-site-discovery
- woocommerce-audit-orchestrator
- woocommerce-implementation-planner
- woocommerce-remediation-triage
- yoast-configuration
- yoast-auditor
- gravity-forms-configuration
- gravity-forms-auditor
- wordpress-accessibility-checker

Scope:
1. Review validation-supporting files across:
   - `tests/`
   - `scripts/`
   - `schemas/`
   - `references/`
   - `prompts/`
2. Check whether scenario files, consistency-source files, validator documentation, schema descriptions, validator scripts, or saved prompt files still reflect stale route wording, outdated folder assumptions, or weak maintenance boundaries.
3. Focus especially on:
   - `tests/instruction-file-consistency-source.md`
   - `tests/app-usage-consistency-source.md`
   - `tests/starter-prompt-consistency-source.md`
   - `tests/short-description-consistency-source.md`
   - `tests/schema-validation-tests.md`
   - `tests/scenario-validation-workflows.md`
   - `tests/validation-readme.md`
   - `scripts/run-master-validation.sh`
   - focused validators in `scripts/validate-*.py`
   - `references/audit-docs-validation-workflow.md`
   - `references/CONNECTORS.md`
   - saved prompt files in `prompts/`
4. Tighten wording and validation expectations so they reflect the current routing model and current folder layout.
5. Preserve the maintenance boundary:
   - internal file, README, schema, script, test, connector-guide, prompt-library, memory-structure, and instruction-routing maintenance stays on the maintenance workflow
   - normal delivery work should not be rewritten as generic validation maintenance
6. Be conservative:
   - do not invent missing skills
   - do not invent unattached folders
   - do not broaden the agent into a generic WordPress or QA router
   - do not add fuzzy checks when a deterministic rule is practical

Deliverables:
1. Audit summary
   - what validation or consistency drift was found
   - which validation-supporting files need updates
2. Implementation summary
   - exact files updated
   - exact validation or wording changes made
3. Validation result
   - whether the validation pack now matches the current routing model and attached structure
   - any remaining non-blocking follow-up items

Acceptance criteria:
- Validation-supporting files align with the current attached routing skills.
- Validator documentation matches the current attached structure.
- Maintenance guidance still points internal upkeep to the maintenance workflow.
- The final validation layer reads as one coherent WooCommerce-first maintenance system.
```

## Use notes

- Treat the current attached file tree and local skills as canonical.
- Prefer deterministic consistency checks over speculative cleanup.
- Keep this pass focused on the validation layer unless a new blocking issue is discovered.

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
