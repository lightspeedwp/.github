# Package assembly checklist

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
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![branch-validation-metrics-aggregator](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![events-issue-pr-metadata](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml)
[![issue-management](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml)
[![pr-template-routing](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml)
[![pr-workflow](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml)
[![project-management](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml)
[![release-orchestration](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml)
[![reporting-metrics](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml)
<!-- BADGES-END -->

## Gate 0 — assembly precondition

- [ ] Confirm phase 01 verdict remains: **reference/source tree, not yet packageable on its own**
- [ ] Confirm assembly scope is limited to: minimum entry layer, verified file copy set, and no invented support files
- [ ] Confirm unverified files will stay marked unverified

**Pass:** scope is narrow and evidence-led  
**Fail:** assembly depends on guessed files or guessed behaviour

## Gate 1 — package root

- [ ] Confirm the assembly target root path
- [ ] Confirm the working package label is `tour-operator-website`
- [ ] Confirm path preservation rules for copied files

**Pass:** package root is explicit  
**Fail:** package root or file paths are still ambiguous

## Gate 2 — create minimum entry layer

- [ ] Create `SKILL.md`
- [ ] Create `agents/`
- [ ] Keep the `agents/` layer to minimum required metadata only
- [ ] Do not create extra folders for symmetry or convenience

**Pass:** only the minimum entry layer is created  
**Fail:** entry layer is still missing or has invented extras

## Gate 3 — `SKILL.md` content boundary

- [ ] `SKILL.md` defines the specialist role as Tour Operator WordPress audit/configuration support
- [ ] `SKILL.md` includes evidence-first rules
- [ ] `SKILL.md` preserves extension/integration uncertainty boundaries
- [ ] `SKILL.md` uses UK English
- [ ] `SKILL.md` does not claim unsupported tools, scripts, schemas, or validation assets
- [ ] `SKILL.md` does not broaden into generic WordPress help

**Pass:** `SKILL.md` matches verified source role and boundaries  
**Fail:** `SKILL.md` invents capability, scope, or support layers

## Gate 4 — metadata layer boundary

- [ ] `agents/` points to the package as a reusable specialist skill
- [ ] metadata does not promise files or assets not in the package
- [ ] metadata naming stays aligned with the verified source role
- [ ] unverified metadata details remain explicitly undecided until chosen

**Pass:** metadata exposes the skill without overstating package contents  
**Fail:** metadata implies unsupported files, capabilities, or packaging completeness

## Gate 5 — copy verified memory files

- [ ] Copy `memory/project-context.md` exactly

## Gate 6 — copy verified evidence files

- [ ] Copy `references/evidence/evidence-model.md` exactly
- [ ] Copy `references/evidence/source-links.md` exactly

## Gate 7 — copy verified content-model files

- [ ] Copy `references/content-model/README.md`
- [ ] Copy `references/content-model/core/post-types.json`
- [ ] Copy `references/content-model/core/taxonomies.json`
- [ ] Copy `references/content-model/core/relationships.json`
- [ ] Copy `references/content-model/core/source-map.md`
- [ ] Copy `references/content-model/core/field-usage-rules.md`
- [ ] Copy `references/content-model/core/facetwp-indexing-notes.md`
- [ ] Copy `references/content-model/extensions/to-specials.json`
- [ ] Copy `references/content-model/extensions/to-reviews.json`
- [ ] Copy `references/content-model/extensions/to-team.json`
- [ ] Copy `references/content-model/integrations/wetu-importer.json`

## Gate 8 — copy verified workflow files

- [ ] Copy `references/workflows/content-model-maintenance.md`
- [ ] Copy `references/workflows/acceptance-test-planning.md`
- [ ] Copy `references/workflows/jsonld-yoast-workflow.md`
- [ ] Copy `references/workflows/block-theme-tour-operator-patterns.md`

## Gate 9 — copy verified output files

- [ ] Copy `references/outputs/output-contracts.md` exactly

## Gate 10 — leave unverified material out

- [ ] Do not add `scripts/`, `schemas/`, `assets/`, or `examples/` unless verified
- [ ] Do not add `references/validation/anti-drift-tests.md` unless verified
- [ ] Do not add `references/outputs/client-safe-language.md` unless verified
- [ ] Do not add `references/outputs/finding-register.schema.json` unless verified
- [ ] Do not add `scripts/validate_content_model.py` unless verified

## Gate 11 — internal reference coherence

- [ ] Check that `SKILL.md` references only files actually included
- [ ] Check that metadata references only files actually included
- [ ] Mark referenced-but-absent files as unverified where needed

## Gate 12 — package honesty check

- [ ] Confirm the assembled package can honestly be described as a minimum local skill package built from verified source files
- [ ] Confirm it is not described as fully validated, complete with all referenced support material, or upload-ready if validation blockers remain

## Gate 13 — assembly verdict

- [ ] **Pass: complete enough to package**
- [ ] **Pass with blockers: packageable with repairs**
- [ ] **Fail: not yet packageable**

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)
