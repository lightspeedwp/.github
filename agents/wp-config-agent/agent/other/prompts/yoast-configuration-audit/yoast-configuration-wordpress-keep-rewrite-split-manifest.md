# Yoast Configuration Skill Keep / Rewrite / Split Manifest

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
[![issue-create-enhanced](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-enhanced.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-enhanced.yml)
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
[![meta-agent-validation](https://github.com/lightspeedwp/.github/actions/workflows/meta-agent-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/meta-agent-validation.yml)
[![meta-labels-sync](https://github.com/lightspeedwp/.github/actions/workflows/meta-labels-sync.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/meta-labels-sync.yml)
[![meta](https://github.com/lightspeedwp/.github/actions/workflows/meta.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/meta.yml)
[![metadata-governance](https://github.com/lightspeedwp/.github/actions/workflows/metadata-governance.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metadata-governance.yml)
[![metrics-pipeline](https://github.com/lightspeedwp/.github/actions/workflows/metrics-pipeline.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metrics-pipeline.yml)
[![metrics-reporting](https://github.com/lightspeedwp/.github/actions/workflows/metrics-reporting.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metrics-reporting.yml)
[![openspec-progress-phase](https://github.com/lightspeedwp/.github/actions/workflows/openspec-progress-phase.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/openspec-progress-phase.yml)
[![openspec-report-progression](https://github.com/lightspeedwp/.github/actions/workflows/openspec-report-progression.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/openspec-report-progression.yml)
[![openspec-sync-labels](https://github.com/lightspeedwp/.github/actions/workflows/openspec-sync-labels.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/openspec-sync-labels.yml)
[![openspec-validate-labels](https://github.com/lightspeedwp/.github/actions/workflows/openspec-validate-labels.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/openspec-validate-labels.yml)
[![planner](https://github.com/lightspeedwp/.github/actions/workflows/planner.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/planner.yml)
[![pr-template-validation](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-validation.yml)
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

Use this manifest to adapt the attached local `yoast-configuration` skill so it fits the current **WordPress Configuration Agent**.

## Purpose

This manifest classifies the current `yoast-configuration` skill-package files into four groups:

- **Keep** — retain as-is or with only light spot-checking
- **Rewrite** — keep the file, but remove WooCommerce-specific or other out-of-scope assumptions
- **Split** — move to a separate WooCommerce-focused companion skill/package if you want to preserve that capability
- **Remove** — delete from this package if no split package will be maintained

## Scope rule

This agent is currently treated as a **purely WordPress-focused agent**.

That means:

- no WooCommerce-specific defaults should remain in the core `yoast-configuration` package for this agent
- no `tour operator configuration agent` assumptions should remain
- WordPress-relevant Yoast planning, configuration, migration, multilingual, taxonomy, schema, metadata, and launch-readiness guidance should remain

---

## A. KEEP

These files appear broadly reusable for a WordPress-only Yoast configuration skill. They should still be spot-checked for stray WooCommerce wording, but they do not look structurally tied to WooCommerce.

### Core docs and examples

- `docs/current-verification-playbook.md`
- `docs/research-workflow.md`
- `examples/migration-audit-example.md`
- `examples/schema-customisation-example.md`
- `examples/standard-business-site-example.md`

### Memory defaults and schemas likely worth keeping

- `memory/defaults/agency-defaults.md`
- `memory/defaults/schema-defaults.md`
- `memory/defaults/standard-yoast-defaults.md`
- `memory/schemas/configuration-memory.schema.json`

### WordPress-oriented profiles

- `profiles/business-website.md`
- `profiles/local-business.md`
- `profiles/migration-rebuild.md`
- `profiles/multilingual-site.md`
- `profiles/publisher-blog.md`

### Templates likely worth keeping

- `templates/ai-metadata-approval-pack.md`
- `templates/client-safe-summary.md`
- `templates/content-structure-remediation-plan.md`
- `templates/developer-handoff.md`
- `templates/launch-qa-checklist.md`
- `templates/metadata-bulk-edit-plan.md`
- `templates/migration-launch-seo-control-plan.md`
- `templates/multilingual-seo-qa-report.md`
- `templates/redirect-map-review.md`
- `templates/rendered-output-qa-report.md`
- `templates/settings-export-review.md`
- `templates/source-register-row-template.md`
- `templates/taxonomy-indexation-decision-pack.md`
- `templates/translated-metadata-approval-pack.md`
- `templates/wordpress-admin-change-plan.md`
- `templates/yoast-acceptance-criteria.md`
- `templates/yoast-ai-plus-positioning-note.md`
- `templates/yoast-approval-queue.md`
- `templates/yoast-audit-report.md`
- `templates/yoast-configuration-report.md`
- `templates/yoast-decision-log.md`
- `templates/yoast-defaults-drift-report.md`
- `templates/yoast-health-summary.md`
- `templates/yoast-portfolio-audit-summary.md`
- `templates/yoast-regression-test-report.md`
- `templates/yoast-remediation-backlog.md`
- `templates/yoast-research-pack.md`
- `templates/yoast-retainer-review-note.md`
- `templates/yoast-state-comparison-report.md`
- `templates/yoast-troubleshooting-note.md`

### Keep rule

- Keep these files in the package.
- Spot-check for stray WooCommerce wording before final release.

---

## B. REWRITE

These files should remain in the package, but they currently include WooCommerce-specific assumptions, wording, enums, routes, or examples that should be removed or rewritten.

### Identity and routing

- `SKILL.md`
- `agents/openai.yaml`

### Docs

- `docs/changelog.md`
- `docs/evidence-policy.md`
- `docs/maintenance-guide.md`
- `docs/reference-refresh-protocol.md`
- `docs/usage-guide.md`

### Examples and fixtures with mixed scope

- `examples/memory/example-client-site-profile.md`
- `examples/templates/qa-report-template.md`
- `fixtures/sample-ai-metadata-item.json`
- `fixtures/sample-bulk-metadata-change.json`
- `fixtures/sample-decision-record.json`
- `fixtures/sample-health-review.json`
- `fixtures/sample-portfolio-site-summary.json`
- `fixtures/sample-regression-check.json`
- `fixtures/sample-remediation-item.json`
- `fixtures/sample-wordpress-content-types.json`
- `fixtures/sample-yoast-settings-export.json`

### Intake and memory schemas

- `intake/client-site-intake.md`
- `intake/wordpress-site-intake.md`
- `memory/schemas/client-site-profile.schema.json`

### References

- `references/agency-defaults-drift-model.md`
- `references/ai-assisted-seo-workflow.md`
- `references/ai-metadata-review-model.md`
- `references/approval-queue-workflow.md`
- `references/audit-triage-model.md`
- `references/bulk-metadata-governance.md`
- `references/configuration-playbooks.md`
- `references/configuration-reference.md`
- `references/conflict-resolution-playbook.md`
- `references/content-structure-taxonomy-playbook.md`
- `references/decision-register-model.md`
- `references/developer-api-reference.md`
- `references/evidence-state-model.md`
- `references/feature-behaviour-reference.md`
- `references/file-routing-index.md`
- `references/future-skill-architecture.md`
- `references/multilingual-hreflang-playbook.md`
- `references/periodic-health-review-playbook.md`
- `references/plugin-update-regression-playbook.md`
- `references/portfolio-audit-playbook.md`
- `references/product-capability-matrix.md`
- `references/qa-checklists.md`
- `references/related-skills-routing.md`
- `references/remediation-backlog-model.md`
- `references/rendered-output-qa-playbook.md`
- `references/research-pack-output-spec.md`
- `references/schema-reference.md`
- `references/settings-export-review-playbook.md`
- `references/source-register.md`
- `references/state-comparison-playbook.md`
- `references/taxonomy-indexation-decision-model.md`
- `references/yoast-health-score-model.md`

### Schemas

- `schemas/ai-metadata-item.schema.json`
- `schemas/audit-finding.schema.json`
- `schemas/bulk-metadata-change.schema.json`
- `schemas/decision-record.schema.json`
- `schemas/portfolio-site-summary.schema.json`
- `schemas/product-capability.schema.json`
- `schemas/research-pack.schema.json`
- `schemas/schema-piece.schema.json`
- `schemas/taxonomy-decision.schema.json`
- `schemas/yoast-setting.schema.json`

### Scripts

- `scripts/generate_qa_checklist.py`
- `scripts/validate_reference_data.py`
- `scripts/validate_skill_structure.py`
- `scripts/validate_source_register.py`
- `scripts/validate_taxonomy_pack.py`

### Tests

- `tests/ai-assisted-seo-scenario-tests.md`
- `tests/artefact-review-scenario-tests.md`
- `tests/audit-triage-scenario-tests.md`
- `tests/bulk-metadata-governance-scenario-tests.md`
- `tests/comparison-regression-scenario-tests.md`
- `tests/configuration-scenario-tests.md`
- `tests/content-taxonomy-scenario-tests.md`
- `tests/decision-conflict-scenario-tests.md`
- `tests/multilingual-hreflang-scenario-tests.md`
- `tests/portfolio-defaults-scenario-tests.md`
- `tests/reference-data-validation.md`
- `tests/related-skills-routing-scenario-tests.md`
- `tests/research-pack-scenario-tests.md`

### Rewrite rule

- Keep these files in the package.
- Remove WooCommerce-specific wording, references, enums, scenarios, routes, and examples.
- Replace them with WordPress-only Yoast equivalents where needed.

---

## C. SPLIT

These files are structurally WooCommerce-focused. If you want to preserve WooCommerce capability, move them into a separate WooCommerce-specific companion skill/package.

### Clear WooCommerce-focused assets

- `examples/woocommerce-store-example.md`
- `fixtures/sample-woocommerce-taxonomies.json`
- `intake/woocommerce-intake.md`
- `memory/defaults/woocommerce-defaults.md`
- `profiles/ecommerce-catalogue.md`
- `profiles/ecommerce-transactional.md`
- `references/woocommerce-seo-reference.md`
- `templates/yoast-woocommerce-report.md`
- `tests/woocommerce-scenario-tests.md`

### Split rule

- Prefer **split** over delete if WooCommerce support may be useful later.
- Group these into a future skill such as a WooCommerce-specific Yoast configuration package.

---

## D. REMOVE

Use **Remove** only if you are certain you do not want a separate WooCommerce-focused companion package.

### Remove only if not splitting

- `examples/woocommerce-store-example.md`
- `fixtures/sample-woocommerce-taxonomies.json`
- `intake/woocommerce-intake.md`
- `memory/defaults/woocommerce-defaults.md`
- `profiles/ecommerce-catalogue.md`
- `profiles/ecommerce-transactional.md`
- `references/woocommerce-seo-reference.md`
- `templates/yoast-woocommerce-report.md`
- `tests/woocommerce-scenario-tests.md`

### Remove rule

- Do not remove mixed-scope files unless you first decide they are not worth rewriting.
- Only remove files that are clearly WooCommerce-specific and not needed for this agent.

---

## Recommended path

### Safest path

1. **Rewrite** `SKILL.md` and `agents/openai.yaml` first.
2. **Split** the clearly WooCommerce-only assets into a separate package.
3. **Rewrite** the mixed-scope docs, references, schemas, fixtures, scripts, and tests.
4. Re-run the package validation.

### Fastest WordPress-only path

1. Rewrite `SKILL.md`.
2. Remove all files in the **Split / Remove** list.
3. Rewrite the mixed-scope files to remove WooCommerce assumptions.
4. Re-run the package validation.

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
