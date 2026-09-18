# Portfolio audit playbook

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

Use this playbook when a user asks for a Yoast review across multiple client sites, a retainer SEO health digest, a multi-site comparison, or an agency-wide Yoast consistency review.

## Purpose

A portfolio audit is not a deep audit of every page on every site. It should find cross-site patterns, obvious outliers, high-risk configuration differences, and where a deeper site-level audit is justified.

## Inputs

Accept any combination of:

- A list of client sites and site types.
- Yoast settings exports or copied settings per site.
- Rendered source samples per site.
- Sitemap, robots.txt, llms.txt, or schema samples.
- Crawl exports or Search Console summaries.
- Known product mix per site: Yoast SEO Free, Premium, WooCommerce SEO, AI Plus, Local SEO, News SEO.
- Agency defaults from `memory/defaults/` or pasted standards.
- Recent plugin update history.
- Known migrations, redesigns, ecommerce changes, or content model changes.

## Evidence boundaries

- Do not infer live output from settings alone.
- Do not compare sites as if they share the same SEO strategy unless they share site type, business model, content model, and product mix.
- Treat every missing export, missing rendered sample, missing sitemap, or missing product version as a confidence limitation.
- Use `references/access-level-workflow.md` to decide what the current evidence proves.
- Use `references/agency-defaults-drift-model.md` when comparing sites to reusable defaults.

## Site grouping

Group sites before scoring:

| Group | Typical examples | Comparison rule |
|---|---|---|
| Business sites | Service, brochure, lead generation | Compare pages, posts, service CPTs, media, core taxonomies, schema identity |
| Local business sites | Location-led service sites | Compare location data, organisation/local entity assumptions, breadcrumbs, contact pages |
| Publishers | Blogs, newspapers, magazines | Compare author/date archives, categories, tags, article schema, sitemap scale |
| Ecommerce catalogue | Product browsing without online checkout | Compare product visibility, archive strategy, product schema completeness, enquiry routes |
| Ecommerce transactional | WooCommerce stores | Compare product, variation, offer, stock, review, filtered URL and checkout-adjacent behaviour |
| Migration/rebuild sites | Recently changed URL/content structure | Compare redirect, canonical, sitemap, noindex and metadata migration state |
| Multilingual sites | Language or country targeting | Compare hreflang dependency, canonical strategy, translated content coverage |

## Minimum review sequence

1. Build a site inventory with site type, product mix, evidence available, and confidence.
2. Identify shared agency defaults that should apply to the group.
3. Identify site-specific exceptions that are approved or justified.
4. Compare high-risk settings first: global indexation, content type visibility, taxonomy visibility, media attachment behaviour, canonical handling, robots.txt, sitemaps, schema identity, WooCommerce product archive behaviour.
5. Check rendered-output samples for a small set of representative pages where available.
6. Classify findings as portfolio pattern, site-specific defect, accepted exception, evidence gap, or needs deep audit.
7. Produce a prioritised cross-site action list.

## Portfolio finding types

| Type | Meaning | Typical next action |
|---|---|---|
| Portfolio pattern | Same issue appears across multiple sites | Create one reusable fix plan or agency default update |
| Site-specific defect | Issue affects one site or one site family | Create site-level remediation item |
| Accepted exception | Difference is intentional and approved | Record decision and retest criteria |
| Evidence gap | Evidence is too thin to decide | Request smallest missing artefact |
| Needs deep audit | Risk is high or output evidence is contradictory | Route to site-level audit or developer investigation |

## Priority guidance

Prioritise issues that can suppress discovery or mislead search engines across many URLs:

1. Site-wide noindex, robots blocks, canonical conflicts, sitemap exclusion, broken rendered metadata.
2. WooCommerce product schema, product archive indexation, filtered URL duplication, product variation canonical issues.
3. Migration metadata loss, redirect/canonical conflicts, stale sitemaps.
4. Organisation/person/schema identity mistakes reused across sites.
5. Missing or inconsistent title/description templates where live output confirms poor output.
6. Lower-risk consistency improvements and documentation gaps.

## Output requirements

Use `templates/yoast-portfolio-audit-summary.md` for cross-site summaries. Include:

- Portfolio scope and evidence state.
- Site inventory.
- Cross-site patterns.
- Site-specific high-risk findings.
- Accepted exceptions.
- Evidence gaps.
- Priority action list.
- Recommended reusable default updates.
- Site-level follow-up routes.

## QA checks

For each high-risk pattern, define one representative QA path and one retest sample per affected site type. Do not claim the pattern is fixed until rendered output or relevant live artefacts confirm the change.

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*
