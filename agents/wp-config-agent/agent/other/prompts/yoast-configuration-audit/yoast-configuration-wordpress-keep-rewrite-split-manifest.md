# Yoast Configuration Skill Keep / Rewrite / Split Manifest

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

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
