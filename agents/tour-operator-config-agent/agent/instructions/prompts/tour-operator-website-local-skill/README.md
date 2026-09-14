# Tour Operator Website local skill prompt pack

[![License: GPL v3 or later](https://img.shields.io/badge/License-GPL%20v3%20or%20later-blue.svg)](https://www.gnu.org/licenses/gpl-3.0.html)

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

Use this folder for the phased prompts that audit, build, verify, package, upload, attach, and debug a local `tour-operator-website` skill from `prompts/tour-operator-website`.

## Core rule

Treat `prompts/tour-operator-website` as the single source of truth.

Do not invent missing files, missing wording, missing metadata, missing routes, missing references, missing scripts, missing assets, or missing package structure.

If something needed for a valid skill package is absent, unreadable, contradictory, or only partially visible, report the gap and stop or narrow the task instead of filling it with plausible-looking replacements.

## Default entrypoint

Start with `00-orchestrator-prompt.md` when you need to run the full local-skill workflow or decide which phase should run next.

The orchestrator controls phase order, phase gates, blocker handling, attach discipline, and corruption-debug routing.

## Intended phase order

0. `00-orchestrator-prompt.md`
1. `01-source-audit-prompt.md`
2. `02-package-contract-prompt.md`
3. `03-skill-entrypoints-prompt.md`
4. `04-reference-assets-reconciliation-prompt.md`
5. `05-local-package-assembly-prompt.md`
6. `06-upload-attach-alignment-prompt.md`
7. `07-corruption-debug-prompt.md`

## Pack purpose

This phased pack supports two safe outcomes:

- build a local `tour-operator-website` skill package from the verified source folder
- publish that local skill into the current draft with the smallest coherent routing alignment

The pack is designed for a large, exacting skill package where unsupported invention would create package drift or agent corruption.

## Package goal

The end state is a local `tour-operator-website` skill package that:

- is built only from verified material in `prompts/tour-operator-website`
- has a valid canonical skill entrypoint and package metadata
- preserves the exact specialist role already evidenced by the source folder
- can be uploaded and attached without mixing guessed content into the package
- can be routed from the agent instructions with the smallest coherent instruction change
- can be debugged methodically if upload or attach causes draft instability

## Non-invention rules

- Never replace a missing source file with a newly drafted substitute unless a later phase explicitly says the source folder itself contains enough verified content to derive that file exactly.
- Never treat partial file visibility as proof that a directory is complete.
- Never convert maintenance assumptions into package facts.
- Never claim upload-readiness, package validity, publish-readiness, or attach safety until the relevant phase has verified it.
- Preserve exact current paths whenever the source folder already defines them.
- Use UK English.

---

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)
