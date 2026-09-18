# Audit triage scenario tests

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
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![branch-validation-metrics-aggregator](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![events-issue-pr-metadata](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml)
[![issue-management](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml)
[![pr-template-routing](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml)
[![pr-workflow](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml)
[![project-management](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml)
[![release-orchestration](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml)
[![reporting-metrics](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml)
[![validate-specifications](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml)
<!-- BADGES-END -->

Use these tests when refining the audit, troubleshooting, QA or migration behaviour of the Yoast configuration skill.

## Test 1: Site-wide noindex

**Input:** User says a live client site is not appearing in Google and provides a screenshot showing Yoast/WordPress search engine visibility disabled.

**Expected behaviour:**

- Classify as critical severity and P0/P1 depending on launch state.
- Ask for or recommend checking rendered meta robots, WordPress visibility setting, Yoast indexation settings, sitemap visibility and Search Console coverage.
- Do not promise reindexing speed or ranking recovery.
- Use `templates/yoast-troubleshooting-note.md` if the user asks for a concise handoff.

## Test 2: Product canonical conflict

**Input:** User reports variable products canonicalising to a filtered product category URL.

**Expected behaviour:**

- Load WooCommerce reference, developer API reference and audit triage model.
- Classify as high severity if confirmed across important products.
- Route owner direction to developer unless configuration evidence proves otherwise.
- Require rendered source checks across simple and variable products.

## Test 3: Source freshness gap

**Input:** User asks whether AI Plus currently includes a specific feature and wants proposal wording.

**Expected behaviour:**

- Load product capability matrix, source register and current verification playbook.
- Treat product packaging as needing current verification.
- Avoid firm proposal claims if only source-register research target rows exist.

## Test 4: Weak schema complaint

**Input:** User says "Yoast schema is broken" with no URL or output.

**Expected behaviour:**

- Do not assume the cause.
- Ask for rendered JSON-LD, URL, page type and plugin context only if required.
- Provide a safe first-pass checklist: rendered source, schema validation, conflicting schema plugins, content inputs, WooCommerce product data where relevant.
- Confidence should be unknown or weak.

## Test 5: Migration metadata loss

**Input:** User has a migrated site where custom titles/descriptions may not have carried across.

**Expected behaviour:**

- Load migration intake, migration profile, configuration reference and audit triage model.
- Recommend sampling important URLs, exported metadata, rendered output and sitemap/canonical alignment.
- Classify priority based on launch timing and page importance.

## Regression checks

- Every finding includes evidence confidence and QA check.
- Severity and priority are both present and not treated as the same field.
- Source freshness issues are advisory unless they block a proposal, developer handoff, or final client claim.
- Developer escalation is only used when configuration/content changes cannot safely resolve the issue.

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*
