# Phase 02 package contract

## 1. Verified package identity

- **Source package root:** `prompts/tour-operator-website`
- **Working package label:** `tour-operator-website`
- **Verified domain identity:** a specialist Tour Operator WordPress reference/source tree for website audits, content-model interpretation, schema/Yoast readiness, QA planning, and implementation handoffs.
- **Canonical skill name:** unverified
- **Canonical packaged entrypoint:** unverified
- **Buildable local skill root shape:** unverified

## 2. Required files and folders

Based on currently verified files, the following source material is supported as package content and should be treated as copy-exact if packaging proceeds:

- `prompts/tour-operator-website/memory/project-context.md`
- `prompts/tour-operator-website/references/evidence/evidence-model.md`
- `prompts/tour-operator-website/references/evidence/source-links.md`
- `prompts/tour-operator-website/references/content-model/README.md`
- `prompts/tour-operator-website/references/content-model/core/post-types.json`
- `prompts/tour-operator-website/references/content-model/core/taxonomies.json`
- `prompts/tour-operator-website/references/content-model/core/relationships.json`
- `prompts/tour-operator-website/references/content-model/core/source-map.md`
- `prompts/tour-operator-website/references/content-model/core/field-usage-rules.md`
- `prompts/tour-operator-website/references/content-model/core/facetwp-indexing-notes.md`
- `prompts/tour-operator-website/references/content-model/extensions/to-specials.json`
- `prompts/tour-operator-website/references/content-model/extensions/to-reviews.json`
- `prompts/tour-operator-website/references/content-model/extensions/to-team.json`
- `prompts/tour-operator-website/references/content-model/integrations/wetu-importer.json`
- `prompts/tour-operator-website/references/workflows/content-model-maintenance.md`
- `prompts/tour-operator-website/references/workflows/acceptance-test-planning.md`
- `prompts/tour-operator-website/references/workflows/jsonld-yoast-workflow.md`
- `prompts/tour-operator-website/references/workflows/block-theme-tour-operator-patterns.md`
- `prompts/tour-operator-website/references/outputs/output-contracts.md`

Package-critical entry and metadata files remain unverified:

- `prompts/tour-operator-website/SKILL.md`
- `prompts/tour-operator-website/agents/`

## 3. Optional but supported files and folders

The verified files explicitly support these as intended package support material, but they are not yet verified present:

- `prompts/tour-operator-website/references/validation/anti-drift-tests.md`
- `prompts/tour-operator-website/references/outputs/client-safe-language.md`
- `prompts/tour-operator-website/references/outputs/finding-register.schema.json`
- `prompts/tour-operator-website/scripts/validate_content_model.py`

The following folders are also supported as possible package structure, but are unverified:

- `prompts/tour-operator-website/scripts/`
- `prompts/tour-operator-website/schemas/`
- `prompts/tour-operator-website/assets/`
- `prompts/tour-operator-website/examples/`

## 4. Excluded or non-package material

The following must stay out of the contract unless later source evidence verifies them:

- invented `SKILL.md` content
- invented `agents/` structure
- invented assets, schemas, examples, or scripts
- guessed extension internals beyond the conservative placeholders already verified
- assumptions from maintenance notes outside `prompts/tour-operator-website`
- external source repositories and URLs as bundled raw package contents

Also exclude any claim that the current source tree is already a complete skill package.

## 5. Open gaps that block safe packaging

**Critical blockers**

- canonical `SKILL.md` is unverified
- canonical `agents/` entry layer is unverified
- canonical skill name is unverified
- canonical metadata layer is unverified

**High blockers**

- referenced validation material is unverified:
  - `references/validation/anti-drift-tests.md`
  - `references/outputs/client-safe-language.md`
  - `references/outputs/finding-register.schema.json`
  - `scripts/validate_content_model.py`

**Medium blockers**

- `scripts/`
- `schemas/`
- `assets/`
- `examples/`

**Current safe packaging status**

- This is a verified reference/source tree
- This is not yet a verified local skill package
- Safe verdict: **not yet packageable**

## 6. Ready next phase

**No assembly-safe next phase yet.**

The safest next move is a phase-03 blocker-verification pass to determine whether the source tree already contains:

- `SKILL.md`
- `agents/`
- any canonical entry metadata

If those remain absent or unverified, the source tree should be treated as requiring packaging work before any later build or upload phase.
