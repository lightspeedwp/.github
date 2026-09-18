# Product capability matrix

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

Use this matrix as a working structure. Before making current product claims, verify Yoast product pages, WordPress.org plugin pages, and relevant Yoast developer docs.

| Capability | Yoast SEO Free | Yoast SEO Premium | Yoast WooCommerce SEO | Yoast SEO AI Plus | Configuration location | Default behaviour | SEO impact | Risk level | Notes | Sources |
|---|---|---|---|---|---|---|---|---|---|---|
| Title and meta description templates | included; verify current UI | included; verify Premium workflow extras | inherits base Yoast handling for product objects; verify add-on extras | may provide AI-assisted metadata; verify entitlement | Search appearance / object editor; exact path needs live verification | Needs source capture | Controls search snippet metadata output | Medium | Do not invent UI paths | source-register: SEO tags titles/descriptions; Yoast product pages |
| Canonical URLs | included; verify behaviour | included | product/archive behaviour needs WooCommerce SEO verification | not primary scope | Output generated by Yoast; customisation via documented filters/API | Needs source capture | High for duplicate management | High | Always QA rendered source and sitemap consistency | source-register: canonical URL docs |
| Meta robots | included; verify settings | included | product/taxonomy/archive output affected by product archive decisions | not primary scope | Per object and search appearance areas; exact path needs live verification | Needs source capture | Controls indexation | High | Noindex and sitemap inclusion must be checked together | source-register: meta robots docs |
| XML sitemaps | included; verify scope | included | product/product taxonomy sitemap behaviour needs verification | not primary scope | Yoast sitemap settings and object visibility | Needs source capture | Discovery and crawl hinting | Medium | Exclusions should align with noindex/canonical choices | source-register: XML sitemap docs |
| Schema graph | included; add-ons extend | included; verify Premium pieces | extends WooCommerce product schema; verify | not primary schema provider | Site representation, content types, product data, schema API | Needs source capture | Structured data validity and entity clarity | High | Schema validity is not rich-result guarantee | source-register: schema docs |
| Breadcrumbs | included; verify integration methods | included | product breadcrumb behaviour needs verification | not primary scope | Breadcrumb settings/block/theme integration | Needs source capture | UX and BreadcrumbList schema | Medium | Check theme output and duplicate breadcrumb trails | source-register: breadcrumbs docs |
| Redirect manager | unclear from available sources until product page verified | likely Premium; verify current packaging | not primary scope | not primary scope | Premium interface; exact path needs live verification | Needs source capture | Migration and removed URL handling | High | Verify HTTP status and chain length | Yoast Premium product page; release notes |
| Internal linking suggestions | not included unless docs confirm otherwise | likely Premium; verify | product context may be relevant | not primary scope | Editor workflow | Needs source capture | Content structure support | Low/Medium | Suggestions are editorial aids, not automatic SEO output | Yoast Premium product page; internal linking docs |
| Orphaned content | not included unless docs confirm otherwise | likely Premium; verify | product orphan status may be relevant | not primary scope | Premium workflow | Needs source capture | Content maintenance | Medium | Treat as a signal requiring editorial review | Premium orphaned content docs |
| WooCommerce product schema | partial through base schema; verify boundary | partial through base + Premium; verify | included/extended; verify specifics | not primary scope | Product data, WooCommerce settings, Yoast WooCommerce SEO | Needs source capture | Product rich result eligibility support | High | Validate Product/ProductGroup/Offer/AggregateOffer | WooCommerce SEO product page; schema piece docs |
| AI-assisted SEO | unclear without current verification | may overlap; verify | not primary scope unless product metadata | core AI Plus scope; verify | AI Plus workflow; exact path needs live verification | Needs source capture | Editorial workflow and metadata generation | Medium | AI suggestions require human approval and evidence review | AI Plus product page; AI docs |

## Allowed values

Use `Included`, `Not included`, `Partial`, `Requires add-on`, `Requires manual configuration`, `Requires developer customisation`, or `Unclear from available sources` when producing the final matrix.

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*
