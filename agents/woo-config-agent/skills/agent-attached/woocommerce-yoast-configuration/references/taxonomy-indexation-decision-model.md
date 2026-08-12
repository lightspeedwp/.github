# Taxonomy indexation decision model

Use this model when deciding whether WordPress or WooCommerce taxonomy archives should be indexed, noindexed, included in XML sitemaps, optimised, consolidated or left unchanged.

## Decision states

| State | Use when | Action |
|---|---|---|
| `index_and_optimise` | Term pages are curated, unique and useful search landing pages | Keep/index; add title, description, internal links and QA |
| `index_with_improvement_required` | Term pages are strategically useful but currently weak | Keep indexable temporarily; create content remediation backlog |
| `noindex_after_approval` | Term group is thin, duplicative or internal-only and risk is understood | Create decision record and implement after approval |
| `consolidate_or_merge_first` | Overlapping terms split signals or confuse users | Merge/redirect/content cleanup before Yoast change |
| `leave_pending_evidence` | Evidence is insufficient | Request crawl/rendered examples/Search Console data |
| `developer_review_required` | Live output conflicts with settings or custom logic controls output | Hand off to developer before settings change |

## Required fields

Each decision should capture:

- `surface_id` — human-readable identifier, for example `category/news`, `post_tag/events`, `product_cat/accessories`.
- `surface_type` — category, tag, custom taxonomy, product category, product tag, product attribute, author archive, date archive, search archive, media attachment, filtered URL group.
- `site_type` — business, local, publisher, catalogue, transactional, multilingual, migration, other.
- `current_indexation` — index, noindex, unknown, mixed.
- `current_sitemap_state` — included, excluded, unknown, mixed.
- `current_canonical_state` — self-referencing, canonicalised elsewhere, missing, conflicting, unknown.
- `content_quality` — strong, adequate, thin, duplicate, unknown.
- `business_value` — high, medium, low, unknown.
- `search_value_evidence` — Search Console, keyword research, internal priority, none, unknown.
- `recommendation` — one of the decision states above.
- `approval_required` — yes/no.
- `owner` — SEO/content/admin/developer/client.
- `qa_required` — rendered output, sitemap, crawl, Search Console, schema, breadcrumbs.

## Risk scoring

Use the highest applicable risk level.

| Risk | Indicators |
|---|---|
| Critical | Site-wide or high-value archive indexation would change; sitemap/canonical conflicts are already visible |
| High | Product category, publisher category, local landing archive or high-traffic archive affected |
| Medium | Useful but low-traffic archive affected; change is reversible but needs QA |
| Low | Clearly internal-only or test/archive surface with low evidence of user/search value |
| Unknown | Evidence does not show rendered output, sitemap state or business purpose |

## Safe defaults by surface

These are defaults for recommendation drafting, not universal rules.

- Primary categories on publisher/blog sites: usually index if curated and navigable.
- Ungoverned tags: often candidates for noindex or cleanup, but verify traffic and internal use first.
- Product categories: usually strategic on ecommerce sites; do not noindex without merchandising/search evidence.
- Product tags: often lower value than categories; review usage, duplication and product-count quality.
- Product attributes/facets: require developer and crawl-strategy review before indexation changes.
- Author archives: decide by site type, author profile quality and editorial transparency requirements.
- Date archives: often duplicative, but publisher sites may have use cases.
- Media attachment URLs: usually avoid indexable thin attachment pages; verify redirect/output behaviour.
- Search result pages: usually not intended for search indexation; verify current output.

## Decision record triggers

Create a decision record when the recommendation:

- changes global indexation for a taxonomy or archive;
- excludes a content surface from the sitemap;
- changes canonical strategy;
- affects WooCommerce product/category discoverability;
- changes breadcrumbs or archive navigation;
- requires content consolidation, redirects or developer work;
- overrides agency defaults for a client-specific reason.
