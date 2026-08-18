# Maintenance guide

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
[![actions-minute-savings-watch](https://github.com/lightspeedwp/.github/actions/workflows/actions-minute-savings-watch.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/actions-minute-savings-watch.yml)
[![allocate-pr-issue-to-milestone](https://github.com/lightspeedwp/.github/actions/workflows/allocate-pr-issue-to-milestone.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/allocate-pr-issue-to-milestone.yml)
[![awesome-github-site](https://github.com/lightspeedwp/.github/actions/workflows/awesome-github-site.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/awesome-github-site.yml)
[![badges-documentation-update](https://github.com/lightspeedwp/.github/actions/workflows/badges-documentation-update.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/badges-documentation-update.yml)
[![badges-health-check](https://github.com/lightspeedwp/.github/actions/workflows/badges-health-check.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/badges-health-check.yml)
[![badges-readme-status](https://github.com/lightspeedwp/.github/actions/workflows/badges-readme-status.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/badges-readme-status.yml)
[![badges-workflow-audit](https://github.com/lightspeedwp/.github/actions/workflows/badges-workflow-audit.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/badges-workflow-audit.yml)
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![checklist-finalisation](https://github.com/lightspeedwp/.github/actions/workflows/checklist-finalisation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/checklist-finalisation.yml)
[![checks](https://github.com/lightspeedwp/.github/actions/workflows/checks.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/checks.yml)
[![cleanup-branches](https://github.com/lightspeedwp/.github/actions/workflows/cleanup-branches.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/cleanup-branches.yml)
[![docs-maintenance](https://github.com/lightspeedwp/.github/actions/workflows/docs-maintenance.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/docs-maintenance.yml)
[![docs-validation](https://github.com/lightspeedwp/.github/actions/workflows/docs-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/docs-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![flaky-test-detection](https://github.com/lightspeedwp/.github/actions/workflows/flaky-test-detection.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/flaky-test-detection.yml)
[![gitleaks-reusable](https://github.com/lightspeedwp/.github/actions/workflows/gitleaks-reusable.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/gitleaks-reusable.yml)
[![gitleaks-update](https://github.com/lightspeedwp/.github/actions/workflows/gitleaks-update.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/gitleaks-update.yml)
[![gitleaks](https://github.com/lightspeedwp/.github/actions/workflows/gitleaks.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/gitleaks.yml)
[![issue-create-enhanced](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-enhanced.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-enhanced.yml)
[![issue-create-from-template](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-from-template.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-from-template.yml)
[![issue-fields-backfill](https://github.com/lightspeedwp/.github/actions/workflows/issue-fields-backfill.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-fields-backfill.yml)
[![issue-health-audit](https://github.com/lightspeedwp/.github/actions/workflows/issue-health-audit.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-health-audit.yml)
[![issue-labeling-automation](https://github.com/lightspeedwp/.github/actions/workflows/issue-labeling-automation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-labeling-automation.yml)
[![issue-project-field-sync](https://github.com/lightspeedwp/.github/actions/workflows/issue-project-field-sync.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-project-field-sync.yml)
[![issue-remediation-automation](https://github.com/lightspeedwp/.github/actions/workflows/issue-remediation-automation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-remediation-automation.yml)
[![issue-remediation-bulk](https://github.com/lightspeedwp/.github/actions/workflows/issue-remediation-bulk.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-remediation-bulk.yml)
[![issues](https://github.com/lightspeedwp/.github/actions/workflows/issues.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issues.yml)
[![label-audit-report](https://github.com/lightspeedwp/.github/actions/workflows/label-audit-report.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/label-audit-report.yml)
[![labeling-governance](https://github.com/lightspeedwp/.github/actions/workflows/labeling-governance.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/labeling-governance.yml)
[![labeling](https://github.com/lightspeedwp/.github/actions/workflows/labeling.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/labeling.yml)
[![main-branch-guard](https://github.com/lightspeedwp/.github/actions/workflows/main-branch-guard.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/main-branch-guard.yml)
[![manage-blocking-status-labels](https://github.com/lightspeedwp/.github/actions/workflows/manage-blocking-status-labels.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/manage-blocking-status-labels.yml)
[![meta-labels-sync](https://github.com/lightspeedwp/.github/actions/workflows/meta-labels-sync.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/meta-labels-sync.yml)
[![meta](https://github.com/lightspeedwp/.github/actions/workflows/meta.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/meta.yml)
[![metadata-governance](https://github.com/lightspeedwp/.github/actions/workflows/metadata-governance.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metadata-governance.yml)
[![metrics-pipeline](https://github.com/lightspeedwp/.github/actions/workflows/metrics-pipeline.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metrics-pipeline.yml)
[![metrics-reporting](https://github.com/lightspeedwp/.github/actions/workflows/metrics-reporting.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metrics-reporting.yml)
[![planner](https://github.com/lightspeedwp/.github/actions/workflows/planner.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/planner.yml)
[![project-archival](https://github.com/lightspeedwp/.github/actions/workflows/project-archival.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-archival.yml)
[![project-maintenance-nightly](https://github.com/lightspeedwp/.github/actions/workflows/project-maintenance-nightly.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-maintenance-nightly.yml)
[![project-maintenance-on-demand](https://github.com/lightspeedwp/.github/actions/workflows/project-maintenance-on-demand.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-maintenance-on-demand.yml)
[![project-meta-sync](https://github.com/lightspeedwp/.github/actions/workflows/project-meta-sync.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-meta-sync.yml)
[![release](https://github.com/lightspeedwp/.github/actions/workflows/release.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release.yml)
[![reporting](https://github.com/lightspeedwp/.github/actions/workflows/reporting.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting.yml)
[![reviewer](https://github.com/lightspeedwp/.github/actions/workflows/reviewer.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reviewer.yml)
[![template-enforcement](https://github.com/lightspeedwp/.github/actions/workflows/template-enforcement.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/template-enforcement.yml)
[![validate-blocking-issue-before-close](https://github.com/lightspeedwp/.github/actions/workflows/validate-blocking-issue-before-close.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-blocking-issue-before-close.yml)
[![validate-blocking-status-before-close](https://github.com/lightspeedwp/.github/actions/workflows/validate-blocking-status-before-close.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-blocking-status-before-close.yml)
[![validate-dor-dod-sections](https://github.com/lightspeedwp/.github/actions/workflows/validate-dor-dod-sections.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-dor-dod-sections.yml)
[![validate-issue-dod-before-close](https://github.com/lightspeedwp/.github/actions/workflows/validate-issue-dod-before-close.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-issue-dod-before-close.yml)
[![validate-mermaid-pr](https://github.com/lightspeedwp/.github/actions/workflows/validate-mermaid-pr.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-mermaid-pr.yml)
[![validate-pr-template](https://github.com/lightspeedwp/.github/actions/workflows/validate-pr-template.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-pr-template.yml)
[![validate-project-linking](https://github.com/lightspeedwp/.github/actions/workflows/validate-project-linking.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-project-linking.yml)
<!-- BADGES-END -->

Use this guide when updating, validating, or packaging the Yoast configuration skill.

## Maintenance principles

- Keep `SKILL.md` compact and action-oriented.
- Move large or conditional material into `references/`, `intake/`, `profiles/`, `templates/`, `docs/`, `tests/`, or `scripts/`.
- Preserve source uncertainty. Do not turn research targets into confirmed evidence without a fresh scan.
- Keep binary assets minimal.
- Package the whole skill after any edit.

## Update workflow

1. Identify which workflow changed: product packaging, configuration, WooCommerce, schema, developer API, QA, intake, templates, examples, rollout, or validation.
2. Update the smallest relevant file first.
3. If a source was scanned, update `references/source-register.md` with title, URL, accessed date, key facts, relevance, limitations, source type, duplicate status, and confidence.
4. Update dependent reference files only with facts supported by scanned or clearly labelled evidence.
5. Update templates or tests if the output shape changed.
6. Run validation scripts.
7. Package the full skill as `skill.zip`.
8. Add a changelog entry.

## Validation commands

From the skill folder:

```bash
python3 scripts/validate_source_register.py references/source-register.md
python3 scripts/validate_reference_data.py .
python3 scripts/generate_qa_checklist.py --profile standard-business
```

Then package with the Skill Creator package script.

## Refresh cadence

| Area | Suggested cadence | Refresh trigger |
|---|---:|---|
| Product capability matrix | Monthly or before proposal use | Yoast pricing/product page changes |
| Developer API reference | Monthly or before code handoff | Yoast developer docs, deprecations, plugin upgrade |
| Schema reference | Monthly or before schema customisation | Yoast schema docs, Schema.org, Google structured data changes |
| WooCommerce SEO reference | Monthly or before store launch | Yoast WooCommerce SEO, WooCommerce, Google product docs |
| QA checklists | After every launch issue | Repeated missed checks or new feature behaviour |
| Intake/profile files | Quarterly | Repeated missing project evidence |
| Templates | Quarterly | Agency reporting process changes |

## Changelog rules

Record:

- Date.
- Files changed.
- Reason for change.
- Evidence/source updates.
- Validation performed.
- Remaining gaps.

Do not claim “research refreshed” unless source-register rows were actually updated with accessed dates and source notes.

## Second-batch package hygiene

Use `references/file-routing-index.md` as the routing map before adding new files. Every new operational file must be referenced by either `SKILL.md` or the routing index so future agents know when to load it.

Use `references/evidence-state-model.md` when deciding whether a source-register item can support a client-facing recommendation. Do not treat `research target`, `needs live verification`, or `inference` as the same evidence strength.

Use `docs/reference-refresh-protocol.md` for reference-data updates. Choose Level 1, Level 2 or Level 3 refresh rather than defaulting to a full research pass.

Add these validation commands to the release checklist:

```bash
python3 scripts/validate_skill_structure.py .
python3 scripts/generate_qa_checklist.py --profile woocommerce
python3 scripts/generate_qa_checklist.py --profile migration
```

## Batch validation commands

Run these commands from the skill root before packaging after this refinement batch:

```bash
python3 scripts/validate_source_register.py .
python3 scripts/validate_reference_data.py .
python3 scripts/validate_skill_structure.py .
python3 scripts/validate_evidence_states.py .
python3 scripts/generate_qa_checklist.py --profile standard-business
python3 scripts/generate_qa_checklist.py --profile woocommerce
python3 scripts/generate_qa_checklist.py --profile migration
```

Also run the official skill packaging validator. Update `docs/changelog.md` whenever audit triage, evidence state labels, verification playbooks, templates, schemas or validators change.


## Decision and conflict workflow maintenance

When decision, conflict, or client-facing summary files change, run `scripts/validate_decision_records.py` and review `tests/decision-conflict-scenario-tests.md`. Keep decision types aligned across `references/decision-register-model.md`, `schemas/decision-record.schema.json`, templates and routing. Add recurring client approval or source-conflict failures as scenario tests rather than embedding them in `SKILL.md`.

## Artefact review maintenance

Maintain `references/settings-export-review-playbook.md`, `references/rendered-output-qa-playbook.md`, `templates/settings-export-review.md`, `templates/rendered-output-qa-report.md`, `tests/artefact-review-scenario-tests.md`, `schemas/rendered-output-check.schema.json`, `fixtures/sample-rendered-output-check.json`, and `scripts/validate_artefact_review.py` together. Update them when Yoast export formats, rendered metadata output, sitemap behaviour, robots/llms handling, schema output, or agency QA sample sets change.


## Maintaining comparison and regression files

Maintain `references/state-comparison-playbook.md`, `references/plugin-update-regression-playbook.md`, `templates/yoast-state-comparison-report.md`, `templates/yoast-regression-test-report.md`, `templates/yoast-acceptance-criteria.md`, `schemas/regression-check.schema.json`, `fixtures/sample-regression-check.json`, `scripts/validate_regression_pack.py`, and `tests/comparison-regression-scenario-tests.md` together.

Run `scripts/validate_regression_pack.py` after edits. Add a scenario test whenever a real update, migration, retainer comparison or acceptance gate reveals a new failure mode.


## Remediation pack maintenance

When editing access-level or remediation files, also update:

- `references/file-routing-index.md`
- `references/future-skill-architecture.md`
- `schemas/remediation-item.schema.json`
- `fixtures/sample-remediation-item.json`
- `tests/access-remediation-scenario-tests.md`
- `scripts/validate_remediation_pack.py`

Run `scripts/validate_remediation_pack.py` and the full package validation before releasing a new `skill.zip`.
## Portfolio/defaults-drift maintenance

When portfolio or defaults-drift files change, run `scripts/validate_portfolio_pack.py` in addition to the normal validators. Keep portfolio guidance focused on triage and cross-site patterns; route site-specific diagnosis back to the normal audit, rendered-output QA, remediation or developer workflows.

Refresh `memory/defaults/` before using defaults-drift reports for client-facing recommendations if Yoast packaging, Google guidance, WooCommerce behaviour, Schema.org vocabulary, or LightSpeed delivery defaults have changed.

## Maintaining health review workflows

When changing health review, retainer note, or scoring logic:

1. Update `references/periodic-health-review-playbook.md` and `references/yoast-health-score-model.md` together.
2. Update `templates/yoast-health-summary.md` and `templates/yoast-retainer-review-note.md` if output fields change.
3. Update `schemas/health-review.schema.json` and `fixtures/sample-health-review.json` if structured fields change.
4. Run `scripts/validate_health_review_pack.py` and the standard package validators.
5. Add a scenario to `tests/health-review-scenario-tests.md` for any real-world scoring or confidence mistake.

## Maintaining AI-assisted SEO files

When AI-assisted SEO files change, run `scripts/validate_ai_metadata_pack.py` plus the normal package validators. Refresh AI Plus packaging claims only after current Yoast product pages or official release notes have been checked and source-register rows updated. Keep generated metadata approval rules aligned with LightSpeed client approval and claim-safety policy.

## Maintaining bulk metadata governance files

When changing bulk metadata or approval queue workflows:

1. Update `references/bulk-metadata-governance.md` if evidence rules, review states, QA sampling or batch classes change.
2. Update `references/approval-queue-workflow.md` if approval roles, queue fields or safe response wording changes.
3. Update `templates/metadata-bulk-edit-plan.md` and `templates/yoast-approval-queue.md` together so planning and approval outputs remain aligned.
4. Update `schemas/bulk-metadata-change.schema.json` and `fixtures/sample-bulk-metadata-change.json` when row fields change.
5. Add or revise scenarios in `tests/bulk-metadata-governance-scenario-tests.md` for every real-world failure pattern.
6. Run `scripts/validate_bulk_metadata_pack.py` and `scripts/validate_skill_structure.py` before packaging.


## Maintaining taxonomy and content-structure workflows

When adding or changing taxonomy/indexation guidance:

1. Update `references/content-structure-taxonomy-playbook.md` for workflow changes.
2. Update `references/taxonomy-indexation-decision-model.md` for decision states, risk levels or owner rules.
3. Update `templates/taxonomy-indexation-decision-pack.md` and `templates/content-structure-remediation-plan.md` if deliverable fields change.
4. Update `tests/content-taxonomy-scenario-tests.md` with at least one scenario that would have failed before the change.
5. Run `scripts/validate_taxonomy_pack.py` plus the full package validation set.

Avoid adding site-specific taxonomy rules as global defaults unless they are proven across multiple projects.


## Multilingual workflow maintenance

When multilingual or translation-plugin assumptions change, update `references/multilingual-hreflang-playbook.md`, `references/locale-metadata-governance.md`, the multilingual templates, and `tests/multilingual-hreflang-scenario-tests.md` together. Run `scripts/validate_multilingual_pack.py` plus the core package validators before release.

Do not add plugin-specific instructions for every multilingual plugin unless a verified source register entry supports the behaviour. Keep plugin names as evidence prompts unless current documentation has been scanned.

## Redirect and migration pack maintenance

When redirect, migration, launch-control, Yoast Premium redirect-manager, sitemap or canonical migration guidance changes, update:

- `references/redirect-migration-governance.md`
- `references/redirect-map-decision-model.md`
- `templates/redirect-map-review.md`
- `templates/migration-launch-seo-control-plan.md`
- `schemas/redirect-map-row.schema.json`
- `fixtures/sample-redirect-map-row.json`
- `tests/redirect-migration-scenario-tests.md`
- `scripts/validate_redirect_migration_pack.py`

Run `scripts/validate_redirect_migration_pack.py` plus the full package validators before release.


## Related skill maintenance

When adding or renaming related Yoast skills, update `SKILL.md`, `references/related-skills-routing.md`, `references/file-routing-index.md`, `tests/related-skills-routing-scenario-tests.md`, and `scripts/validate_related_skill_routing.py`. If the auditor skill slug changes, replace `woocommerce-yoast-auditor` everywhere in the routing layer.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
