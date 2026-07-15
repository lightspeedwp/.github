# Phase 03 entrypoint spec

## 1. Purpose of the packaged skill

The packaged skill should own this specialist role:

- audit Tour Operator WordPress sites
- interpret Tour Operator content-model evidence conservatively
- support schema/Yoast readiness analysis
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

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
