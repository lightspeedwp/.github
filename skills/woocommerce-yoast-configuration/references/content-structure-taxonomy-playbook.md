# Content structure and taxonomy playbook

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
