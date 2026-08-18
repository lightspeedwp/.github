# Tests

<!-- BADGES-START -->
[![awesome-github-site](https://github.com/lightspeedwp/.github/actions/workflows/awesome-github-site.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/awesome-github-site.yml)
[![changelog-auto-update](https://github.com/lightspeedwp/.github/actions/workflows/changelog-auto-update.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-auto-update.yml)
[![changelog-validate](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validate.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validate.yml)
[![checklist-finalisation](https://github.com/lightspeedwp/.github/actions/workflows/checklist-finalisation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/checklist-finalisation.yml)
[![checks](https://github.com/lightspeedwp/.github/actions/workflows/checks.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/checks.yml)
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

## Purpose

Use this folder for QA sources, validation guidance, regression triggers, scenario plans, and launch-readiness checklists that support the WooCommerce Configuration Agent.

These files are the validation and QA support layer. They help maintainers test the agent, check documentation drift, and review output quality, but they do not replace the canonical policy and standards in `references/`, the structured contracts in `schemas/`, or the runnable validators in `scripts/`.

## Current folder position in the agent structure

Treat the current attached maintenance structure as:

- `references/` — durable standards, conventions, and maintenance workflows
- `schemas/` — structured validation and output contracts
- `scripts/` — runnable validators, validation runners, and helper scripts
- `tests/` — QA sources, scenario coverage, regression checklists, and validator support material

Do not infer unattached folders or missing assets from this README. If local memory guidance is attached elsewhere, that guidance owns memory structure; this folder only documents the grounded `tests/` contents.

## Naming conventions

Use practical names that make the file's role obvious:

- `test-plan-<feature>.md` for scoped test plans
- `qa-checklist-<feature>.md` for review checklists
- `regression-<scope>.md` or `regression-checklist-<scope>.md` for regression triggers
- `<topic>-consistency-source.md` for source snapshots used by validators
- `<topic>-readme.md` only when a file is intentionally a focused guide
- `scenario-<topic>.md` for realistic workflow validation scenarios

## File inventory

This inventory covers the currently grounded files in the attached `tests/` folder.

### Core validation and QA guides

- `schema-validation-tests.md` — canonical test-side reference for current file-family validation expectations
- `validation-readme.md` — maintainer guide for the validation pack and validation use
- `scenario-validation-workflows.md` — scenario-based workflow coverage for realistic WooCommerce outputs and follow-up handling
- `master-qa-checklist.md` — top-level QA flow for launch review and handoff
- `regression-checklist-master-validation.md` — trigger guide for when a full validation pass should run

### Scenario plans and launch checklists

- `test-plan-gravity-forms.md` — Gravity Forms test plan
- `test-plan-file-schema-validation.md` — test plan for schema and file-validation behaviour
- `qa-checklist-file-schema-validation.md` — QA checklist for schema and file validation
- `pre-launch-qa-checklist.md` — launch-readiness review checklist
- `seo-launch-checklist.md` — SEO-focused launch checklist

### Validator source snapshots

- `instruction-file-consistency-source.md` — source snapshot for instruction/file consistency validation
- `app-usage-consistency-source.md` — source snapshot for app-usage validation
- `starter-prompt-consistency-source.md` — source snapshot for starter-prompt validation
- `short-description-consistency-source.md` — source snapshot for short-description validation

## Recommended usage order

1. Start with `validation-readme.md` for validation scope, run order, and failure guidance.
2. Run `bash scripts/run-master-validation.sh` for the standard full validation pass.
3. Use `schema-validation-tests.md` for file-family structure expectations.
4. Use `scenario-validation-workflows.md` to confirm realistic behaviour for the workflow that changed.
5. Use the relevant checklist or test plan for the feature or workflow under review.
6. Use the consistency source files when updating or validating instructions, app-usage guidance, or ChatGPT presentation fields.
7. Use `regression-checklist-master-validation.md` to decide when a full validation run is required.

## Canonical role rules

- Treat `schema-validation-tests.md` as the canonical test-side reference for current folder and schema validation expectations.
- Treat `validation-readme.md` as the main maintainer guide for the validator pack.
- Treat `scenario-validation-workflows.md` as the main scenario-coverage file.
- Treat the `*-consistency-source.md` files as validator inputs, not user-facing reference docs.
- Treat the checklists and test plans as QA scaffolds, not runtime memory or policy files.
- Keep this folder aligned with the actual `scripts/` validators and the actual `schemas/` assets they validate.

---

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
