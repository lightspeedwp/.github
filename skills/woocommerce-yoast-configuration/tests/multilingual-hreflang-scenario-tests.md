# Multilingual and hreflang scenario tests

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

Use these scenarios to regression-test the multilingual Yoast workflow.

## Scenario 1: missing hreflang on translated pages

Input: rendered source for English and German pages shows self-canonicals, translated metadata, but no alternate-language links.

Expected behaviour:

- Do not blame Yoast automatically.
- Load `references/multilingual-hreflang-playbook.md`.
- Identify translation layer as required evidence.
- Classify as partial evidence from rendered source.
- Recommend verifying the translation plugin relationship and rendered alternate links.
- Use `templates/multilingual-seo-qa-report.md` if a report is requested.

## Scenario 2: canonical points to default language

Input: Afrikaans product page canonical points to English product page while both are indexable.

Expected behaviour:

- Treat as a high-risk canonical/hreflang conflict until proven intentional.
- Load WooCommerce reference as well as multilingual playbook.
- Ask for or infer the translation plugin and product relationship evidence.
- Separate SEO/admin action from developer or translation-plugin action.
- Require rendered-output QA after changes.

## Scenario 3: translated metadata copied from default language

Input: CSV contains English title and meta descriptions for French URLs.

Expected behaviour:

- Load `references/locale-metadata-governance.md` and bulk metadata governance if the batch is large.
- Classify rows as duplicate/default-language carryover.
- Do not approve import.
- Produce `templates/translated-metadata-approval-pack.md` when a deliverable is requested.

## Scenario 4: incomplete translations are indexable

Input: crawl shows `/de/` pages with English body copy, German URL structure, and indexable robots.

Expected behaviour:

- Do not solve only with Yoast metadata.
- Route to content owner/client decision: complete translation, noindex, redirect, or temporarily exclude.
- Create a decision log if the noindex/canonical/sitemap state changes.
- Mark commercial or legal claims as requiring client approval.

## Scenario 5: multilingual sitemap mismatch

Input: sitemap contains English and Spanish URLs, but crawl discovers Italian pages not in the sitemap.

Expected behaviour:

- Separate sitemap inclusion from indexability and hreflang correctness.
- Check translation state and content type inclusion per language.
- Recommend representative sitemap and rendered-output QA.
- Avoid claiming sitemap inclusion guarantees indexing.

## Scenario 6: locale-specific product metadata

Input: translated WooCommerce product pages have different prices/currencies and machine-translated descriptions.

Expected behaviour:

- Load WooCommerce reference, multilingual playbook, and locale metadata governance.
- Treat price, currency, availability, shipping and claims as high risk.
- Require business owner approval before metadata/schema-facing content is accepted.
- Require Product/ProductGroup/Offer rendered JSON-LD QA.

## Scenario 7: separate domains per language

Input: English site on `.com`, German site on `.de`, same brand, separate WordPress installs.

Expected behaviour:

- Treat as multilingual/portfolio hybrid.
- Do not assume one Yoast install controls all language relationships.
- Recommend per-domain rendered-output QA and cross-domain relationship evidence.
- Use client-safe language about signal alignment, not ranking promises.

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)
