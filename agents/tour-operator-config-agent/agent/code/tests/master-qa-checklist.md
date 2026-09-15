# Master QA Checklist

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
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![events-issue-pr-metadata](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml)
[![issue-management](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml)
[![pr-workflow](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml)
[![project-management](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml)
[![release-orchestration](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml)
[![reporting-metrics](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml)
<!-- BADGES-END -->

Use this checklist as the top-level validation flow for reusable files, launch readiness, and SEO readiness.

## When to run

- Before final launch review
- After significant structural updates to templates, examples, schemas, or memory files
- After major WordPress configuration updates that affect launch readiness
- Before handing the project to another collaborator or client-facing review process

## Validation sequence

1. Run the file schema validation flow
2. Run the pre-launch QA review
3. Run the SEO launch review
4. Resolve failures and recheck affected areas
5. Use `regression-checklist-master-validation.md` as the follow-up trigger guide for future changes

## 1. File schema validation

Use:

- `schema-validation-tests.md`
- `qa-checklist-file-schema-validation.md`
- `bash scripts/validate-folder-schemas.sh`

Confirm:

- [ ] Automated file-schema validation passes
- [ ] Reusable files are in the correct folders
- [ ] Templates remain reusable and structurally complete
- [ ] Examples contain realistic sample content
- [ ] Schemas are structurally valid
- [ ] Memory files keep durable context separate from active work

## 2. Pre-launch QA

Use:

- `pre-launch-qa-checklist.md`

Confirm:

- [ ] Core site identity is correct
- [ ] Homepage, posts page, and navigation are configured correctly
- [ ] Forms submit successfully and route correctly
- [ ] Anti-spam and consent requirements are in place
- [ ] Mobile and incognito testing is complete
- [ ] Staging review is complete before launch

## 3. SEO launch review

Use:

- `seo-launch-checklist.md`

Confirm:

- [ ] Site visibility settings are correct
- [ ] XML sitemap is accessible
- [ ] Yoast configuration is reviewed
- [ ] Priority page titles and descriptions are ready
- [ ] Destination and travel style pages are optimized
- [ ] Internal links and indexability checks are complete

## 4. Failure handling

If any step fails:

- [ ] Fix the issue in the relevant file, content, or WordPress configuration area
- [ ] Re-run the automated validator if file structure was affected
- [ ] Re-check the relevant QA checklist section after the fix
- [ ] Record any remaining blockers in project notes before sign-off

## 5. Follow-up trigger guide for future changes

Use:

- `regression-checklist-master-validation.md`

Confirm:

- [ ] Future doc, schema, script, instruction, rename, or file-move changes are checked against the regression trigger guide
- [ ] `bash scripts/run-master-validation.sh` is rerun whenever those changes affect validation scope or file references

## Final sign-off

- [ ] File schema validation complete
- [ ] Pre-launch QA complete
- [ ] SEO launch review complete
- [ ] Open blockers are resolved or clearly documented
- [ ] Project is ready for launch review or handoff

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)
