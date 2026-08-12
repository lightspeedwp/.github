# Yoast Configuration Skill Cleanup Checklist for the WordPress Configuration Agent

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

Use this checklist to adapt the attached local `yoast-configuration` skill so it fits the current **WordPress Configuration Agent**.

## Goal

Remove or isolate WooCommerce-specific scope, preserve WordPress-relevant Yoast configuration guidance, and leave the skill aligned with a purely WordPress-focused agent.

## Outcome rule

By the end of this cleanup:

- the skill should no longer present WooCommerce as part of its default identity
- WooCommerce-specific references should either be removed or split into a separate skill/package
- the remaining skill should clearly fit a WordPress-only Yoast configuration workflow

---

## 1. Core identity and routing

### `SKILL.md`

- [ ] Rewrite the frontmatter description to remove `woocommerce sites`, `product schema`, and other WooCommerce-specific claims.
- [ ] Rewrite the opening skill description so it refers to **WordPress sites** only.
- [ ] Remove WooCommerce from the mandatory output structure where it appears as a standard QA or reporting dimension.
- [ ] Remove WooCommerce-specific wording from severity, risk, and decision models.
- [ ] Remove WooCommerce-specific progressive-loading routes.
- [ ] Remove the instruction that always loads `intake/woocommerce-intake.md` for WooCommerce work.
- [ ] Remove or rewrite the `## WooCommerce-specific rules` section.
- [ ] Keep WordPress-relevant Yoast coverage such as metadata, canonicals, sitemaps, robots, breadcrumbs, schema, multilingual, migration, rendered-output QA, and launch-readiness.

### `agents/openai.yaml`

- [ ] Review the skill display name, short description, and default prompt.
- [ ] Remove WooCommerce-specific phrasing if present.
- [ ] Align the skill metadata with a WordPress-only Yoast configuration role.

---

## 2. Remove or split clearly WooCommerce-specific assets

These files should not remain in a WordPress-only Yoast configuration skill unless they are moved into a separate WooCommerce-focused companion skill.

### Examples

- [ ] Remove or split `examples/woocommerce-store-example.md`

### Intake

- [ ] Remove or split `intake/woocommerce-intake.md`

### Memory defaults

- [ ] Remove or split `memory/defaults/woocommerce-defaults.md`

### References

- [ ] Remove or split `references/woocommerce-seo-reference.md`

### Templates

- [ ] Remove or split `templates/yoast-woocommerce-report.md`

### Tests

- [ ] Remove or split `tests/woocommerce-scenario-tests.md`

### Fixtures

- [ ] Remove or split `fixtures/sample-woocommerce-taxonomies.json`

### Profiles

- [ ] Remove or split `profiles/ecommerce-catalogue.md`
- [ ] Remove or split `profiles/ecommerce-transactional.md`

---

## 3. Rewrite mixed-scope docs so they become WordPress-only

### `docs/usage-guide.md`

- [ ] Replace WooCommerce-specific usage rows with WordPress-only Yoast use cases.

### `docs/maintenance-guide.md`

- [ ] Remove WooCommerce-specific maintenance expectations.
- [ ] Replace WooCommerce QA generator examples with WordPress-only profile examples.

### `docs/reference-refresh-protocol.md`

- [ ] Replace WooCommerce-specific examples with WordPress-only examples.

### `docs/evidence-policy.md`

- [ ] Remove WooCommerce-specific evidence categories unless they are deliberately retained in a split package.

### `references/configuration-playbooks.md`

- [ ] Remove WooCommerce transactional store playbook content.

### `references/configuration-reference.md`

- [ ] Remove WooCommerce-specific plugin-scope rows and settings rows.

### `references/file-routing-index.md`

- [ ] Remove WooCommerce-specific request routes and validation routes.

### `references/feature-behaviour-reference.md`

- [ ] Remove WooCommerce product-schema behaviour sections.

### `references/schema-reference.md`

- [ ] Remove WooCommerce-specific plugin-scope entries.

### `references/product-capability-matrix.md`

- [ ] Remove WooCommerce capability rows.

### `references/research-pack-output-spec.md`

- [ ] Remove WooCommerce-specific required coverage and WooCommerce-specific feature expectations.

### `references/source-register.md`

- [ ] Remove or archive WooCommerce-only source rows.

### `references/decision-register-model.md`

- [ ] Remove WooCommerce-specific decision types such as product-schema and archive-strategy decisions.

### `references/conflict-resolution-playbook.md`

- [ ] Remove WooCommerce-specific conflict cases.

### `references/evidence-state-model.md`

- [ ] Remove WooCommerce-specific evidence-state rules.

### `references/portfolio-audit-playbook.md`

- [ ] Remove ecommerce and WooCommerce portfolio comparisons.

### `references/periodic-health-review-playbook.md`

- [ ] Remove WooCommerce-specific health-review expectations.

### `references/settings-export-review-playbook.md`

- [ ] Remove WooCommerce product-schema review requirements.

### `references/multilingual-hreflang-playbook.md`

- [ ] Remove WooCommerce-specific multilingual routing unless the package is split instead.

### `references/future-skill-architecture.md`

- [ ] Rewrite the architecture assumptions so the skill is WordPress-only.

---

## 4. Narrow schemas to WordPress-only scope

### `schemas/audit-finding.schema.json`

- [ ] Remove WooCommerce-specific categories if they are no longer valid.

### `schemas/decision-record.schema.json`

- [ ] Remove WooCommerce-specific decision enums.

### `schemas/product-capability.schema.json`

- [ ] Remove entirely or split into a WooCommerce-specific package.

### `schemas/yoast-setting.schema.json`

- [ ] Remove WooCommerce plugin-scope values.

### `schemas/schema-piece.schema.json`

- [ ] Remove WooCommerce-specific related-data assumptions.

### `schemas/research-pack.schema.json`

- [ ] Remove WooCommerce-specific reference requirements.

### `schemas/bulk-metadata-change.schema.json`

- [ ] Remove WooCommerce-specific ownership or data-source assumptions.

### `schemas/portfolio-site-summary.schema.json`

- [ ] Remove WooCommerce-specific assumptions if present.

### `memory/schemas/client-site-profile.schema.json`

- [ ] Remove WooCommerce object fields from the site profile schema.

---

## 5. Rewrite or replace fixtures

### Review these fixtures and remove WooCommerce assumptions

- [ ] `fixtures/sample-decision-record.json`
- [ ] `fixtures/sample-regression-check.json`
- [ ] `fixtures/sample-portfolio-site-summary.json`
- [ ] `fixtures/sample-health-review.json`
- [ ] `fixtures/sample-bulk-metadata-change.json`

### Replace with WordPress-only fixture themes such as

- [ ] archive strategy
- [ ] sitemap visibility
- [ ] canonical issues
- [ ] metadata template drift
- [ ] breadcrumb configuration
- [ ] migration redirect QA

---

## 6. Narrow scripts and validation expectations

### Scripts to update

- [ ] `scripts/generate_qa_checklist.py`
- [ ] `scripts/validate_reference_data.py`
- [ ] `scripts/validate_skill_structure.py`
- [ ] `scripts/validate_source_register.py`
- [ ] `scripts/validate_taxonomy_pack.py`

### Update each script so it

- [ ] stops requiring WooCommerce files
- [ ] stops requiring WooCommerce templates or tests
- [ ] stops expecting WooCommerce profiles
- [ ] validates the WordPress-only package structure instead

---

## 7. Rewrite or remove WooCommerce-oriented tests

### Tests to review

- [ ] `tests/woocommerce-scenario-tests.md`
- [ ] `tests/research-pack-scenario-tests.md`
- [ ] `tests/related-skills-routing-scenario-tests.md`
- [ ] `tests/portfolio-defaults-scenario-tests.md`
- [ ] `tests/comparison-regression-scenario-tests.md`
- [ ] `tests/bulk-metadata-governance-scenario-tests.md`
- [ ] `tests/artefact-review-scenario-tests.md`
- [ ] `tests/ai-assisted-seo-scenario-tests.md`

### Replace WooCommerce scenarios with WordPress-only scenarios such as

- [ ] standard business site Yoast setup
- [ ] blog or publisher site metadata review
- [ ] multilingual WordPress Yoast review
- [ ] migration or relaunch SEO controls
- [ ] taxonomy cleanup and archive decisions
- [ ] rendered-output QA and launch-readiness checks

---

## 8. Safe-to-keep WordPress-oriented assets

These look broadly reusable for a WordPress-only Yoast skill, but still deserve a quick spot-check for stray WooCommerce wording.

### Likely keep

- [ ] `examples/standard-business-site-example.md`
- [ ] `examples/migration-audit-example.md`
- [ ] `examples/schema-customisation-example.md`
- [ ] `docs/current-verification-playbook.md`
- [ ] `docs/research-workflow.md`
- [ ] `profiles/business-website.md`
- [ ] `profiles/local-business.md`
- [ ] `profiles/migration-rebuild.md`
- [ ] `profiles/multilingual-site.md`
- [ ] `profiles/publisher-blog.md`
- [ ] WordPress-only templates such as:
  - `templates/yoast-audit-report.md`
  - `templates/yoast-configuration-report.md`
  - `templates/yoast-remediation-backlog.md`
  - `templates/launch-qa-checklist.md`
  - `templates/wordpress-admin-change-plan.md`

### Spot-check rule

- [ ] Confirm these files do not still contain WooCommerce assumptions before finalising the package.

---

## 9. Recommended cleanup order

- [ ] Step 1: Rewrite `SKILL.md`
- [ ] Step 2: Remove or split WooCommerce-only assets
- [ ] Step 3: Narrow mixed-scope references and routing docs
- [ ] Step 4: Clean schemas and fixtures
- [ ] Step 5: Update scripts and tests
- [ ] Step 6: Update skill metadata in `agents/openai.yaml`
- [ ] Step 7: Run the full skill validation set again

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
