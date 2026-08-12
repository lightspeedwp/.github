# Package assembly checklist

<!-- BADGES-START -->
[![actions-minute-savings-watch](https://github.com/lightspeedwp/.github/actions/workflows/actions-minute-savings-watch.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/actions-minute-savings-watch.yml)
[![awesome-github-site](https://github.com/lightspeedwp/.github/actions/workflows/awesome-github-site.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/awesome-github-site.yml)
[![changelog-auto-update](https://github.com/lightspeedwp/.github/actions/workflows/changelog-auto-update.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-auto-update.yml)
[![changelog-validate](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validate.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validate.yml)
[![checklist-finalisation](https://github.com/lightspeedwp/.github/actions/workflows/checklist-finalisation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/checklist-finalisation.yml)
[![checks](https://github.com/lightspeedwp/.github/actions/workflows/checks.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/checks.yml)
[![cleanup-branches](https://github.com/lightspeedwp/.github/actions/workflows/cleanup-branches.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/cleanup-branches.yml)
[![dependabot-security-label](https://github.com/lightspeedwp/.github/actions/workflows/dependabot-security-label.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/dependabot-security-label.yml)
[![flaky-test-detection](https://github.com/lightspeedwp/.github/actions/workflows/flaky-test-detection.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/flaky-test-detection.yml)
[![issue-close-label-hygiene](https://github.com/lightspeedwp/.github/actions/workflows/issue-close-label-hygiene.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-close-label-hygiene.yml)
[![issue-create-from-template](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-from-template.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-from-template.yml)
[![issues](https://github.com/lightspeedwp/.github/actions/workflows/issues.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issues.yml)
[![labeling](https://github.com/lightspeedwp/.github/actions/workflows/labeling.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/labeling.yml)
[![linting](https://github.com/lightspeedwp/.github/actions/workflows/linting.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/linting.yml)
[![main-branch-guard](https://github.com/lightspeedwp/.github/actions/workflows/main-branch-guard.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/main-branch-guard.yml)
[![meta](https://github.com/lightspeedwp/.github/actions/workflows/meta.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/meta.yml)
[![metadata-governance](https://github.com/lightspeedwp/.github/actions/workflows/metadata-governance.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metadata-governance.yml)
[![metrics-summary](https://github.com/lightspeedwp/.github/actions/workflows/metrics-summary.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metrics-summary.yml)
[![metrics](https://github.com/lightspeedwp/.github/actions/workflows/metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metrics.yml)
[![planner](https://github.com/lightspeedwp/.github/actions/workflows/planner.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/planner.yml)
[![project-archival](https://github.com/lightspeedwp/.github/actions/workflows/project-archival.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-archival.yml)
[![project-meta-sync](https://github.com/lightspeedwp/.github/actions/workflows/project-meta-sync.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-meta-sync.yml)
[![readme-audit](https://github.com/lightspeedwp/.github/actions/workflows/readme-audit.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/readme-audit.yml)
[![readme-regen](https://github.com/lightspeedwp/.github/actions/workflows/readme-regen.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/readme-regen.yml)
[![readme-update](https://github.com/lightspeedwp/.github/actions/workflows/readme-update.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/readme-update.yml)
[![release](https://github.com/lightspeedwp/.github/actions/workflows/release.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release.yml)
[![reporting](https://github.com/lightspeedwp/.github/actions/workflows/reporting.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting.yml)
[![reviewer](https://github.com/lightspeedwp/.github/actions/workflows/reviewer.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reviewer.yml)
[![template-enforcement](https://github.com/lightspeedwp/.github/actions/workflows/template-enforcement.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/template-enforcement.yml)
[![testing](https://github.com/lightspeedwp/.github/actions/workflows/testing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/testing.yml)
[![validate-mermaid-pr](https://github.com/lightspeedwp/.github/actions/workflows/validate-mermaid-pr.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-mermaid-pr.yml)
[![validate-pr-template](https://github.com/lightspeedwp/.github/actions/workflows/validate-pr-template.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-pr-template.yml)
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

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
