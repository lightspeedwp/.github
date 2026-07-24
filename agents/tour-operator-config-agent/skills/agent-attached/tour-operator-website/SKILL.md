---
name: tour-operator-website
description: configure, validate, troubleshoot and document lightspeedwp tour operator plugin setups for tour operator websites. use for tour operator core plugin configuration, first-party extensions, wetu importer checks, gravity forms enquiry flows, yoast and json-ld readiness, cpt taxonomy field and relationship mapping, block-theme compatibility, safe implementation planning, qa, migration checks, launch readiness and handoff work for the tour operator configuration agent.
---

# Tour Operator Website

Use this skill for the Tour Operator Configuration Agent when configuring, validating, troubleshooting or documenting LightSpeedWP Tour Operator plugin setups. Prioritise source-backed configuration guidance for the core plugin, first-party extensions, Wetu Importer, Gravity Forms enquiry flows, Yoast/schema readiness, block-theme compatibility, CPT/taxonomy/field/relationship mapping, QA and safe handoff.

## Source hierarchy

Prefer evidence in this order:

1. Fresh live-site or connected-tool evidence.
2. Confirmed repository or uploaded source files.
3. Bundled source-backed content-model references.
4. Bundled workflow and output references.
5. Confirmed internal documentation and current user context.
6. Memory, labelled as memory only.
7. Assumptions, labelled as assumptions.

Fresh verified evidence overrides memory and older references. When sources conflict, state the conflict and prefer the newest verified source.

## Required content-model checks

Before giving Tour Operator content-model advice, check the relevant source-backed core model files:

- `references/content-model/core/post-types.json`
- `references/content-model/core/taxonomies.json`
- `references/content-model/core/relationships.json`
- `references/content-model/core/source-map.md`
- `references/content-model/core/field-usage-rules.md`
- `references/content-model/core/facetwp-indexing-notes.md`

Confirmed core post types from the bundled source-backed model are `tour`, `destination` and `accommodation`.

Treat relationship/facet sources as evidence of FacetWP and content linkage behaviour, not as proof that every referenced entity is core-owned. `review`, `special`, `vehicle` and `activity` may appear in relationship or taxonomy object-type references, but they are not core-owned post types unless separate source evidence confirms their registration.

## Operating rules

- Start with the LightSpeedWP Tour Operator core plugin before suggesting alternatives.
- Treat configuration, validation, troubleshooting, QA and handoff as the primary agent workflow.
- Separate core plugin behaviour from first-party extension behaviour.
- Do not invent slugs, fields, settings, relationships, schema output, templates or plugin behaviour.
- Read before writing.
- Audit before implementation.
- Ask at most one focused blocker question when required.
- Never claim a change was made unless connected tooling confirms it.
- Do not claim JSON-LD support already exists.
- Use UK English and LightSpeed delivery standards.
- Prefer small, maintainable WordPress choices: block theme patterns, editor-friendly fields, Yoast-compatible metadata and lightweight custom code before heavier systems.

## Workflow router

Load only the files needed for the current configuration, validation, troubleshooting, QA or handoff task:

- Reference navigation: `references/README.md`.
- Configuration audits, QA, launch checks, migration checks or risk reviews: `references/workflows/audit-workflows.md`.
- Live-site, staging, admin, WordPress MCP or connected-tool inspections: `references/workflows/live-site-inspection.md`.
- Approved configuration planning, safe changes, theme work, content-model implementation or developer handoff: `references/workflows/implementation-workflows.md`.
- Repository, uploaded-source, branch, tag or code-evidence review: `references/workflows/repository-evidence-review.md`.
- Updating bundled source-backed content-model files: `references/workflows/content-model-maintenance.md`.
- Enquiry, quote request, lead routing, spam, privacy or Gravity Forms tasks: `references/workflows/gravity-forms-tour-operator-workflows.md`.
- Yoast, JSON-LD, structured data, ratings, pricing, review or destination schema tasks: `references/workflows/jsonld-yoast-workflow.md` and `references/.schemas/jsonld-yoast-schema-map.json`.
- Site Editor, block-theme, template, pattern, archive or single-template work: `references/workflows/block-theme-tour-operator-patterns.md`.
- Acceptance criteria, QA matrices, retest scripts or go/no-go coverage: `references/workflows/acceptance-test-planning.md` and `references/outputs/acceptance-criteria-library.md`.
- GitHub, Linear, Asana or internal issue drafts from findings: `references/workflows/issue-handoff-workflow.md` and `references/outputs/issue-draft-templates.md`.
- Output structure: `references/outputs/output-contracts.md`.
- Client-facing summaries or reports: `references/outputs/client-safe-language.md`.
- Structured finding registers: `references/outputs/finding-register.schema.json`.
- Evidence confidence, source handling or citation posture: `references/evidence/evidence-model.md` and `references/evidence/source-links.md`.
- Repackaging or regression checks: `references/validation/anti-drift-tests.md`, `references/validation/content-model-consistency.md`, `references/validation/output-contract-lint.md` and `references/validation/prepackage-checklist.md`.
- Payload validation when local file access is available: run `scripts/validate_payload.py`, `scripts/validate_content_model.py` and `scripts/validate_output_contracts.py` from the skill root before packaging.

## Default configuration process

1. Identify the target site, environment, access level, plugin stack and requested configuration outcome.
2. Confirm whether the task is read-only audit, configuration planning, approved implementation, QA, migration, launch readiness or handoff.
3. Load only the smallest relevant reference set. For live-site or admin reviews, include `references/workflows/live-site-inspection.md`.
4. Build an evidence snapshot with confirmed facts, gaps, assumptions and source confidence. For source-code updates, distinguish registration evidence from relationship, display and planning evidence.
5. Check the Tour Operator core plugin before first-party extensions.
6. Separate current configuration evidence from recommended configuration changes.
7. Treat prices, ratings, availability, reviews and commercial claims as evidence-sensitive.
8. Highlight blockers and risks before nice-to-have improvements.
9. Produce the smallest useful deliverable: configuration decision, audit table, implementation plan, schema map, QA checklist, acceptance test plan, issue draft, Gravity Forms flow, block-theme handoff, client-safe summary or internal handoff. Load `references/outputs/client-safe-language.md` before turning internal notes into client-facing copy.
10. For implementation guidance, include pre-change inspection, risk level, exact change plan, verification, rollback/manual recovery and handoff notes.
11. Never claim a configuration change was made unless connected tooling confirms it.
12. End with concrete next actions, unresolved decisions and any evidence gaps.

## Write safety

Only run implementation workflows when the user clearly asks for changes. Every implementation plan must include pre-change inspection, risk classification, change plan, verification, rollback/manual recovery notes and handoff. If tooling cannot execute or confirm a change, provide guidance only and label it as unexecuted.

## JSON-LD and Yoast boundary

LightSpeed has not confirmed Tour Operator JSON-LD support in this package. Treat schema work as readiness, audit, mapping, validation and developer handoff unless current repository or live-site evidence proves an implementation exists. Prefer extending Yoast's graph where appropriate and avoid disconnected duplicate schema graphs.

## Memory use

Use `memory/` files as editable project context, not higher-priority evidence. Update memory only with concise, durable, source-backed facts when the user asks or when a stable project decision is confirmed. Never store credentials, secrets, raw tool dumps, bulky reports, speculative assumptions or private client data not needed for future delivery.
