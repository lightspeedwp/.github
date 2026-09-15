# Content structure and taxonomy playbook

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
<!-- BADGES-END -->

Use this playbook when a Yoast task depends on messy information architecture, thin categories, overused tags, duplicate archive pages, poor content grouping, publisher archives, WooCommerce product taxonomies, or indexation decisions for content types and taxonomy terms.

## Purpose

Turn content-structure evidence into a Yoast-safe configuration decision without pretending Yoast can fix weak architecture on its own.

This playbook supports:

- category and tag indexation decisions;
- author, date, search, media and custom archive decisions;
- post type and taxonomy visibility decisions;
- thin-content and duplicate archive risk classification;
- breadcrumbs and schema dependency notes;
- sitemap inclusion or exclusion decisions;
- remediation planning before Yoast settings are changed.

## Evidence needed

Prefer evidence in this order:

1. Crawl export with indexability, canonical, title, status code and word-count data.
2. WordPress content-type and taxonomy inventory.
3. Search Console performance/indexing data.
4. Rendered archive pages and examples of term pages.
5. Yoast settings export or screenshots.
6. Editorial/business rules for content groups.
7. Stakeholder notes about which sections matter commercially.

If only a settings export is available, classify recommendations as configuration hypotheses and require rendered-output QA before implementation.

## Intake checks

Ask only for missing details that materially affect the decision:

- Which content types exist and which should attract search traffic?
- Which taxonomies are editorial navigation versus internal organisation?
- Are categories/tags curated landing pages or thin lists of posts/products?
- Are author archives important for expertise, editorial transparency or publisher workflows?
- Are date archives useful to users, or just duplicate chronological lists?
- Are media attachment URLs redirected or exposed?
- Are WooCommerce product categories and attributes meant to rank?
- Are filtered/faceted URLs crawlable, canonicalised, blocked, noindexed or parameterised?
- Does the site have multilingual, regional or franchise/location sections?

## Classification model

Classify each archive, content type or taxonomy term group as one of:

| Classification | Meaning | Typical Yoast direction |
|---|---|---|
| `primary landing asset` | Curated, useful and commercially/editorially important | Index, include in sitemap, optimise title/description, verify canonical/schema |
| `supporting navigation archive` | Useful to users but not a priority search landing page | Usually index if unique enough; otherwise consider noindex with care |
| `thin duplicate archive` | Mostly duplicate lists, little unique value | Consider noindex and remove from sitemap after approval |
| `internal organisation only` | Used for workflow, filtering or admin grouping | Usually noindex and exclude from sitemap |
| `temporary or seasonal archive` | Useful for a campaign or event window | Time-box the decision and schedule review |
| `unknown value` | Not enough evidence | Do not change indexation; request smallest evidence needed |

## Decision process

1. Identify all affected content surfaces: content types, taxonomies, author/date/search/media archives, product categories, product tags, attributes and filtered URLs.
2. Map each surface to user value, search value, duplicate risk and business value.
3. Check current Yoast setting, rendered meta robots, canonical output and sitemap inclusion.
4. Separate term-level/page-level optimisation from global defaults.
5. Recommend the smallest safe change first: improve content, consolidate terms, adjust templates, then change indexation if still justified.
6. Create a decision record for any global noindex, sitemap exclusion, canonical change, archive suppression or WooCommerce taxonomy change.
7. Require rendered-output QA after implementation.

## Recommended output fields

For each content structure decision include:

- surface name;
- WordPress scope;
- current evidence;
- current Yoast behaviour;
- recommended action;
- rationale;
- risk if changed;
- risk if left unchanged;
- owner;
- approval needed;
- QA check;
- follow-up review date.

## Common risks

- Noindexing useful category or product category landing pages because they look thin in a settings export.
- Leaving thousands of tag archives indexable when tags are ungoverned and duplicative.
- Treating every publisher author archive the same; some may be useful byline pages while others are thin duplicates.
- Indexing filtered WooCommerce URLs without canonical, parameter or facet strategy.
- Changing a taxonomy global setting without checking term-level overrides and sitemap output.
- Removing archives from search without updating navigation, breadcrumbs, internal links or redirects where needed.
- Assuming Yoast settings prove live behaviour when theme, code, another SEO plugin, cache or server headers may override output.

## QA checks

After a content-structure or taxonomy change, check:

- rendered title, description, canonical and meta robots;
- XML sitemap inclusion/exclusion;
- breadcrumbs and archive navigation;
- schema graph context where relevant;
- Search Console indexing impact after re-crawl;
- important internal links to affected archives;
- WooCommerce product category, tag and attribute output where relevant;
- crawl sample for unexpected newly noindexed or newly indexable pages.

## Escalation rules

Escalate to developer review when:

- archive output is controlled by custom templates, custom post types or custom taxonomies;
- canonical or meta robots output conflicts with Yoast settings;
- filtered URLs or faceted navigation create crawl traps;
- sitemap inclusion does not match Yoast settings;
- schema or breadcrumb output depends on custom taxonomy relationships.

Escalate to client/content owner when:

- noindexing removes visible sections from organic search eligibility;
- category or tag consolidation changes editorial workflow;
- archive content needs rewriting or curation;
- WooCommerce taxonomy decisions affect merchandising or campaign pages.

## Evidence caveat

A taxonomy decision is not final until current rendered output and sitemap behaviour are verified. Treat screenshots and exports as configuration evidence only.

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
