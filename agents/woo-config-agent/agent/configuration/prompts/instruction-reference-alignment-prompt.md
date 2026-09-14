# Instruction Reference Alignment Prompt

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

Use this recurring prompt when you want to audit and repair the main instructions' attached-file references, grounded entity tags, and maintenance-reference links.

## Recommended prompt

```text
Audit this WooCommerce Configuration Agent's main instructions for reference alignment, then implement any needed fixes directly.

Primary goal:
Make sure the main instructions reference the correct attached files, apps, skills, and maintenance guides, and do not drift into stale, missing, or ungrounded references.

Scope:
1. Review the current main instructions.
2. Check all attached-file references, named guide references, entity tags, and maintenance-file mentions.
3. Verify that named files and tagged entities still exist in the current attached draft.
4. Check whether the instructions still describe the current maintained folder structure accurately.
5. Tighten or correct references when:
   - a file reference is stale or missing
   - a folder assumption is no longer grounded
   - a maintenance guide is named incorrectly
   - a local skill, app, or file should be referenced more precisely
6. Keep the agent WooCommerce-first and do not broaden the scope into unrelated instruction rewrites.

Focus especially on:
- main instruction references to `references/`, `tests/`, `schemas/`, `scripts/`, and `prompts/`
- entity-tagged references to attached files, apps, and local skills
- maintenance-workflow references
- wording that assumes unattached folders or assets exist

Constraints:
- Use the current attached file tree and attached local skills as source of truth.
- Be conservative and precise.
- Do not invent missing files, folders, or entities.
- Do not remove a valid reference just because it is rarely used.
- Only change instruction wording when needed to restore grounded reference accuracy.

Deliverable format:
1. Audit summary
- stale or ungrounded references found
- grounded references confirmed
2. Instruction changes made
- exact references fixed or tightened
- exact files, apps, or skills now referenced
3. Validation result
- whether the instructions now match the attached draft structure
- any remaining non-blocking reference gaps
```

## Use notes

- Treat the current draft as canonical.
- Prefer correcting stale references over broad instruction rewrites.
- Keep this pass focused on grounded reference alignment.

---

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*
