# Prompts

[![License: GPL v3 or later](https://img.shields.io/badge/License-GPL%20v3%20or%20later-blue.svg)](https://www.gnu.org/licenses/gpl-3.0.html)

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](https://img.shields.io/badge/Docs Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](https://img.shields.io/badge/Labeling Governance-OK-success.svg)
![Main Branch Guard](https://img.shields.io/badge/Main Branch Guard-OK-success.svg)
![Metadata Governance](https://img.shields.io/badge/Metadata Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](https://img.shields.io/badge/Template Enforcement-OK-success.svg)
![Validate PR Template](https://img.shields.io/badge/Validate PR Template-OK-success.svg)
![Badges: Documentation Update](https://img.shields.io/badge/Badges: Documentation Update-OK-success.svg)
![Badges: Health Check](https://img.shields.io/badge/Badges: Health Check-OK-success.svg)
![Badges: README Status Maintenance](https://img.shields.io/badge/Badges: README Status Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](https://img.shields.io/badge/Badges: Workflow Inventory Audit-OK-success.svg)
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![branch-validation-metrics-aggregator](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![pr-template-routing](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml)
[![validate-specifications](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml)
[![workflow-lint](https://github.com/lightspeedwp/.github/actions/workflows/workflow-lint.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/workflow-lint.yml)
<!-- BADGES-END -->

This folder stores reusable maintenance and cleanup prompts for Design Partner.

## Folder purpose

- keep recurring package-maintenance tasks easy to rerun
- separate focused cleanup passes by scope
- provide a clear entry point for routing, skill-routing, validation, README upkeep, instruction-reference checks, memory-lane checks, example-family checks, template-schema checks, connector-guide audits, review-history consistency, starter-prompt alignment, file-family gap audits, and prompt-library upkeep

## Files

- `routing-validation-cleanup-prompt.md` — top-level entry point for choosing the right cleanup pass
- `routing-audit-pass.md` — focused prompt for routing language, workflow boundaries, and artifact-boundary cleanup
- `skills-routing-and-directory-validation.md` — focused prompt for checking attached-skill routing, visible skill references, and grounded skill-surface accuracy
- `validation-pack-tightening.md` — focused prompt for schema, template, example, validator, and quality-check consistency work
- `update-all-readmes-to-current-structure.md` — focused prompt for refreshing README files against the visible file tree
- `recommended-cleanup-pass.md` — broader non-blocking cleanup pass across prompts, READMEs, templates, examples, schemas, and validation notes
- `instruction-reference-audit-pass.md` — focused prompt for checking whether the instructions still reference visible files, apps, skills, and memory lanes accurately
- `memory-lane-consistency-pass.md` — focused prompt for checking whether visible memory files, guidance, and schema support still describe distinct memory roles cleanly
- `example-family-drift-pass.md` — focused prompt for checking whether visible example files still match their visible template and schema families
- `template-schema-alignment-pass.md` — focused prompt for checking whether visible template and schema families still use the same field and section model
- `connector-guide-consistency-pass.md` — focused prompt for auditing visible connector guidance against the current attached apps and instruction references
- `file-family-gap-audit-pass.md` — focused prompt for finding visible workflow families that are incomplete or described too confidently for the files that are actually present
- `starter-prompt-alignment-pass.md` — focused prompt for checking whether the tagline and starter prompts still match the current instructions and configured capabilities
- `review-history-lane-pass.md` — focused prompt for keeping the review-history memory lane aligned across memory guidance, the live memory file, the entry template, and the schema
- `prompt-library-consistency-pass.md` — focused prompt for keeping the prompt index, router files, and specialized prompts aligned as the prompt library grows

## How to use this folder

- start with `routing-validation-cleanup-prompt.md` when the right cleanup pass is not obvious
- use a specialized prompt directly when the cleanup surface is already clear
- use `recommended-cleanup-pass.md` when the package needs broader non-blocking consistency cleanup rather than one narrow fix
- use `skills-routing-and-directory-validation.md` when the main question is whether the agent’s skill routes and visible skill notes still match the currently attached skills
- use `instruction-reference-audit-pass.md` when the question is whether the instructions still point to the right visible files, apps, skills, or memory lanes
- use `memory-lane-consistency-pass.md` or `review-history-lane-pass.md` when the main drift is in durable memory guidance
- use `example-family-drift-pass.md`, `template-schema-alignment-pass.md`, or `file-family-gap-audit-pass.md` when the main drift is in workflow-family structure
- use `starter-prompt-alignment-pass.md` when the agent’s public-facing tagline or starter prompts may no longer match the configured workflows
- use `connector-guide-consistency-pass.md` when app-usage guidance may no longer match the attached app inventory or instruction references
- use `prompt-library-consistency-pass.md` when the prompt library itself needs index or router cleanup
- keep edits grounded in the visible package structure
- do not assume hidden files, tests, validators, prompt files, or skill-package files exist unless they are visible or staged

## Relationship to the rest of the package

- `templates/`, `examples/`, `schemas/`, and `scripts/` are the main package surfaces these prompts help maintain
- attached skills are part of the agent surface even when their package files are not visible in agent files
- `memory/` stores durable working context, not maintenance prompts
- README refresh prompts should keep folder notes aligned with the visible package structure

---

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

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

_This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP._
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)
