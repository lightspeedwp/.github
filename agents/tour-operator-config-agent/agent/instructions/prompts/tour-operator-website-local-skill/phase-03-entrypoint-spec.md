# Phase 03 entrypoint spec

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

## 1. Purpose of the packaged skill

The packaged skill should own this specialist role:

- audit Tour Operator WordPress sites
- interpret Tour Operator content-model evidence conservatively
- support .schemas/Yoast readiness analysis
- support QA, launch-readiness, and implementation handoffs
- preserve strict evidence boundaries between confirmed core structures, extension placeholders, integration placeholders, and unknowns

It should not broaden into generic WordPress help, general marketing, or unsupported implementation claims.

## 2. What `SKILL.md` must cover

A canonical `SKILL.md` should define:

- skill identity
- specialist role
- core responsibilities
- evidence-first working rules
- output posture
- reference-loading expectations for bundled `references/` and `memory/` material

It must not invent tools, validation scripts, example files, schema support, or extension internals.

## 3. What `agents/` must contain

At minimum, the `agents/` layer should contain the package metadata and entry configuration that:

- points to the canonical skill instructions
- exposes the skill as a reusable specialist package
- keeps the visible specialist scope narrow and evidence-led
- does not promise tools, apps, or validation layers that are not actually bundled

Exact file names and metadata fields are still unverified.

## 4. Verified bundled files the entrypoint should reference

- `memory/project-context.md`
- `references/evidence/evidence-model.md`
- `references/evidence/source-links.md`
- `references/content-model/README.md`
- `references/content-model/core/post-types.json`
- `references/content-model/core/taxonomies.json`
- `references/content-model/core/relationships.json`
- `references/content-model/core/source-map.md`
- `references/content-model/core/field-usage-rules.md`
- `references/content-model/core/facetwp-indexing-notes.md`
- `references/content-model/extensions/to-specials.json`
- `references/content-model/extensions/to-reviews.json`
- `references/content-model/extensions/to-team.json`
- `references/content-model/integrations/wetu-importer.json`
- `references/workflows/content-model-maintenance.md`
- `references/workflows/acceptance-test-planning.md`
- `references/workflows/jsonld-yoast-workflow.md`
- `references/workflows/block-theme-tour-operator-patterns.md`
- `references/outputs/output-contracts.md`

## 5. Supported but unverified references

The entrypoint may later reference these only if they are actually found and verified:

- `references/validation/anti-drift-tests.md`
- `references/outputs/client-safe-language.md`
- `references/outputs/finding-register.schema.json`
- `scripts/validate_content_model.py`

Until verified, they should remain optional and unverified, not required.

## 6. Minimum safe package shape

The smallest safe package shape is:

- `SKILL.md`
- `agents/` metadata layer
- `memory/project-context.md`
- `references/` subtree containing the verified evidence, content-model, workflow, and output files

## 7. Blocking gaps before file creation

Do not create files from this spec alone without first deciding:

- canonical skill name
- exact metadata file set under `agents/`
- whether unverified support files are required or optional
- whether the package is intended as audit-first only, or audit plus implementation and handoff guidance

## 8. Smallest safe next step

Use this spec to draft a file creation plan, not the files themselves:

- define exact `SKILL.md` sections
- define exact `agents/` metadata files
- define which verified references are bundled by default

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
