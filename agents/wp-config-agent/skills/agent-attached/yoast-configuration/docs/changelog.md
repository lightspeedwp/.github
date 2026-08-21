## 2026-07-03 - package verification command fix

- Confirmed `SKILL.md` frontmatter is present in the local package source.
- Corrected the batch QA generator examples in `docs/maintenance-guide.md` to use the supported `--profile` argument and current `woocommerce` profile name.
- Ran the package validation set and regenerated QA checklists before packaging.

## 2026-07-03 - output structure and fast audit refinement

- Added mandatory output structure to `SKILL.md` so normal outputs consistently include summary, access/evidence, findings or decisions, recommendations, QA, open questions and next actions.
- Added fast audit mode for quick triage, skim reviews, sanity checks and first-pass Yoast reviews without unnecessary reference loading.
- Embedded core evidence confidence, severity/priority, risk, owner routing, decision-record and remediation-item models directly in `SKILL.md` so common audits do not depend on extra reference files.

## 2026-07-03 - source-register validator path handling

- Updated `scripts/validate_source_register.py` to accept either a direct `references/source-register.md` path, the `references/` directory, or the skill root directory.
- Added targeted validation coverage for default, skill-root, references-directory and direct-file invocation styles.

## 2026-07-03 - Related skill routing layer

- Added `references/related-skills-routing.md` to define the boundary between `yoast-configuration` and `yoast-auditor`.
- Updated `SKILL.md` progressive loading and package maintenance workflow with live audit/edit routing.
- Updated `references/file-routing-index.md` with related-skill routing rows.
- Added `tests/related-skills-routing-scenario-tests.md` and `scripts/validate_related_skill_routing.py`.

## 2026-07-03 - redirect and migration control layer

- Added redirect/migration governance playbook, redirect-map decision model, redirect-map review template, migration launch SEO control plan, redirect-map row .schemas/fixture, validator and scenario tests.
- Updated SKILL routing, file routing, usage guide, maintenance guide, architecture notes and validators.
- Preserved evidence boundary: redirect maps, Yoast redirect screenshots and migration spreadsheets do not prove live status codes, chains, canonical targets or sitemap state.

## 2026-07-03 - multilingual and hreflang workflow layer

- Added multilingual hreflang playbook, locale metadata governance, multilingual QA report template, translated metadata approval template, multilingual page-set .schemas/fixture, validator, and scenario tests.
- Updated SKILL routing, file routing, multilingual profile, usage guide, maintenance guide, architecture notes, and package validators.
- Preserved evidence boundary: Yoast settings do not prove rendered hreflang, language relationships, translated metadata, or multilingual sitemap behaviour.

## Unreleased - artefact review batch

- Added settings-export review workflow, template, tests and validation route.
- Added rendered-output QA workflow, template, schema, fixture and validator.
- Updated skill routing, usage guide, maintenance guide, future architecture and package validation expectations.
- Preserved evidence boundary between settings artefacts, rendered output, documentation expectations and SEO interpretation.

# Changelog

## 2026-07-03 - architecture refinement pass

- Expanded `SKILL.md` as a compact router with clearer operating posture, package maintenance workflow, developer/WooCommerce guardrails, and progressive-loading triggers.
- Expanded `references/future-skill-architecture.md` with v1/v2 file responsibilities, trigger rules, maintenance rules, and first-version avoid-list.
- Expanded usage, maintenance, evidence, intake, profile, QA, WooCommerce, developer, template, rollout, script, and test support files.
- Preserved source-register posture: primary URLs remain research targets unless individually scanned and given accessed dates.
- Added stronger validation expectations for source register integrity, required package files, examples, templates, fixtures, schemas, scripts, tests, and generated QA output.

## 2026-07-03 - initial expanded package

- Added source register with primary Yoast product, guide, and developer scan set.
- Added configuration, feature, schema, WooCommerce, developer, playbook, QA, research-pack, architecture, intake, profile, template, memory, schema, fixture, script, rollout, and test files.
- Packaged as `skill.zip`.

## 2026-07-03 - second refinement batch

- Added `references/file-routing-index.md` to make progressive loading and task routing explicit.
- Added `references/evidence-state-model.md` to separate research targets, scanned evidence, verified current sources, stale evidence, contradictions and inference.
- Added `docs/reference-refresh-protocol.md` for targeted, reference-level and package-level refresh workflows.
- Added `templates/source-register-row-template.md` for consistent source-register maintenance.
- Added `scripts/validate_skill_structure.py` for package hygiene and route coverage checks.
- Added `tests/research-pack-scenario-tests.md` for deep research regression coverage.
- Added `schemas/research-pack.schema.json` and `fixtures/sample-source-register-row.json` for structured research-pack and source-register validation support.
- Updated `SKILL.md`, usage, maintenance, architecture and validation script references.

Validation required before release: source register, reference data, skill structure, QA generator, JSON parse checks, package validation and ZIP integrity check.

## 2026-07-03 - Batch 3 operational triage and freshness controls

- Added `references/audit-triage-model.md` for severity, priority, confidence, owner direction and QA classification.
- Added `docs/current-verification-playbook.md` for product/API/UI/rich-result/source freshness handling.
- Added `templates/yoast-troubleshooting-note.md` for concise internal issue notes.
- Added `schemas/audit-finding.schema.json` and `fixtures/sample-audit-finding.json` for structured audit finding validation.
- Added `scripts/validate_evidence_states.py` and `tests/audit-triage-scenario-tests.md`.
- Updated `SKILL.md`, `references/file-routing-index.md`, maintenance, usage and evidence docs to route the new files progressively.

## 2026-07-03 - Batch 4 decision, conflict and client-safe outputs

- Added `references/decision-register-model.md` for approval-ready Yoast decision records.
- Added `references/conflict-resolution-playbook.md` for source, settings, output, client-preference and developer-behaviour conflicts.
- Added `references/client-communication-guardrails.md` for client-safe wording and unsupported-claim avoidance.
- Added `templates/yoast-decision-log.md` and `templates/client-safe-summary.md`.
- Added `schemas/decision-record.schema.json`, `fixtures/sample-decision-record.json`, and `scripts/validate_decision_records.py`.
- Added `tests/decision-conflict-scenario-tests.md`.
- Updated `SKILL.md`, `references/file-routing-index.md`, and `references/future-skill-architecture.md` to route the new decision and conflict workflows progressively.

## Batch 6 - comparison, regression and acceptance workflows

- Added Yoast state comparison and plugin-update regression playbooks.
- Added state comparison, regression test and acceptance criteria templates.
- Added regression-check schema, fixture and validator.
- Added comparison/regression scenario tests.
- Updated routing, usage, maintenance and architecture guidance.

## Unreleased - access-aware remediation workflow

- Added `references/access-level-workflow.md` to clarify what each evidence/access level proves.
- Added `references/remediation-backlog-model.md` for implementation-ready action items.
- Added `templates/yoast-remediation-backlog.md` and `templates/wordpress-admin-change-plan.md`.
- Added `schemas/remediation-item.schema.json`, `fixtures/sample-remediation-item.json`, `scripts/validate_remediation_pack.py`, and `tests/access-remediation-scenario-tests.md`.
- Updated `SKILL.md`, routing index, usage guide, maintenance guide and future architecture reference.

## Unreleased - portfolio and defaults-drift workflows

- Added `references/portfolio-audit-playbook.md` for multi-site and retainer Yoast reviews.
- Added `references/agency-defaults-drift-model.md` for comparing sites against agency defaults and approved baselines.
- Added `templates/yoast-portfolio-audit-summary.md` and `templates/yoast-defaults-drift-report.md`.
- Added `schemas/portfolio-site-summary.schema.json`, `fixtures/sample-portfolio-site-summary.json`, `scripts/validate_portfolio_pack.py`, and `tests/portfolio-defaults-scenario-tests.md`.
- Updated `SKILL.md`, routing, usage, maintenance and architecture guidance.

## Unreleased - periodic health review workflow

- Added `references/periodic-health-review-playbook.md` for monthly, quarterly, post-launch and retainer Yoast health reviews.
- Added `references/yoast-health-score-model.md` for internal Yoast configuration-health scoring and confidence caps.
- Added `templates/yoast-health-summary.md` and `templates/yoast-retainer-review-note.md`.
- Added `schemas/health-review.schema.json`, `fixtures/sample-health-review.json`, `scripts/validate_health_review_pack.py`, and `tests/health-review-scenario-tests.md`.
- Updated `SKILL.md`, routing, usage, maintenance and architecture guidance.

## 2026-07-03 — AI-assisted metadata workflow batch

- Added AI-assisted Yoast SEO workflow and AI metadata review model.
- Added AI metadata approval pack and AI Plus positioning note templates.
- Added AI metadata schema, fixture, validator and scenario tests.
- Updated routing, usage, maintenance and architecture docs for AI-assisted metadata review.

## Unreleased - bulk metadata governance batch

- Added `references/bulk-metadata-governance.md` for safe high-volume Yoast metadata review and implementation planning.
- Added `references/approval-queue-workflow.md` for approval owner routing and queue states.
- Added `templates/metadata-bulk-edit-plan.md` and `templates/yoast-approval-queue.md`.
- Added `schemas/bulk-metadata-change.schema.json` and `fixtures/sample-bulk-metadata-change.json`.
- Added `scripts/validate_bulk_metadata_pack.py` and `tests/bulk-metadata-governance-scenario-tests.md`.
- Updated `SKILL.md`, file routing, usage and maintenance guidance to keep candidate rows, approval, implementation and rendered verification separate.

## Batch 12 - Content structure and taxonomy decision support

- Added content-structure and taxonomy indexation workflow support.
- Added taxonomy/archive decision states, risk levels, owner routing and QA requirements.
- Added approval-ready taxonomy decision and content remediation templates.
- Added structured taxonomy-decision schema, fixture and validator.
- Added regression tests for tags, publisher categories, WooCommerce product tags/attributes, screenshot-only evidence, local service taxonomies and migration cleanup.
- Updated routing, maintenance and package validation references.

---

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*
