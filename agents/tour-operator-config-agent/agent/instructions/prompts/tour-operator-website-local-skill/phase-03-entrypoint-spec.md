# Phase 03 entrypoint spec

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

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*
