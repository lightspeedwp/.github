# Redirect and migration governance

Use this playbook when Yoast work intersects with redirects, migration SEO controls, URL consolidation, deleted content, launch-day QA, or rebuild handoff. It is not a generic migration checklist; it focuses on what the Yoast workflow must decide, configure, validate, and hand off safely.

## Load with

- `intake/migration-intake.md` for migration context.
- `profiles/migration-rebuild.md` for site-type defaults.
- `references/redirect-map-decision-model.md` when individual URL decisions need approval.
- `references/rendered-output-qa-playbook.md` when current output, headers, canonicals, sitemaps, robots.txt, or redirects are available.
- `references/conflict-resolution-playbook.md` when redirects, canonicals, sitemaps, or client requests conflict.
- `templates/redirect-map-review.md` or `templates/migration-launch-seo-control-plan.md` for deliverables.

## Evidence boundaries

| Evidence | What it can prove | What it cannot prove |
|---|---|---|
| Redirect map spreadsheet | Proposed old-to-new mapping, ownership, approval status | Live redirect behaviour, status codes, chains, canonicals, or sitemap state |
| Yoast Premium redirect settings/export/screenshot | Candidate plugin-managed redirects | Server-level rules, CDN redirects, upstream application redirects, or current crawl behaviour |
| Crawl export | Observed sampled status codes, canonical targets, indexability state | Complete URL universe unless crawl scope is complete and documented |
| Server/CDN rules | Infrastructure redirect intent | Yoast settings, page metadata, canonical output, or Search Console interpretation |
| Rendered source and HTTP headers | Current page-level metadata and redirect behaviour for sampled URLs | Site-wide correctness without representative sampling |
| Search Console data | Google-discovered URLs and issues | All redirects or all canonical decisions |

Do not treat a redirect map, plugin screenshot, or migration spreadsheet as proof that redirects are live.

## Redirect implementation route

Classify each redirect or URL action before recommending implementation:

| Route | Use when | Risk controls |
|---|---|---|
| Yoast Premium redirect manager | Redirects are simple one-to-one WordPress-managed URL changes and Yoast Premium is confirmed available | Verify product entitlement, import format, no duplicate server rules, rendered status code, and no chain |
| Server/CDN redirect | High-volume, performance-sensitive, regex/wildcard, domain, protocol, subdomain, or platform-level redirects | Developer/sysadmin owner, staging test, rollback route, chain check |
| WordPress plugin/admin redirect | Small batch and admin-owned implementation is acceptable | Avoid overlap with server rules; check performance and exportability |
| Content consolidation canonical | Source URL remains useful but should consolidate signals to a preferred URL | Confirm canonical output, sitemap exclusion strategy, and no contradictory noindex |
| Noindex | Content should remain accessible but not indexed | Check sitemap exclusion, robots meta, canonical consistency, and business approval |
| 410/404 | Content intentionally removed and no replacement exists | Client approval, crawl monitoring, Search Console monitoring, and clear exclusion from redirect map |
| Hold / investigate | URL intent, traffic value, backlink value, content equivalent, or implementation owner is unclear | Request smallest missing evidence before implementation |

## Migration control sequence

1. **Inventory** - Capture old URLs, new URLs, content type, traffic/backlink value where available, current status, proposed action, owner, and approval status.
2. **Decision** - Use `references/redirect-map-decision-model.md` for each redirect/noindex/410/canonical/hold decision.
3. **Implementation plan** - Separate Yoast admin, WordPress admin, server/CDN, developer, content owner, and client approval work.
4. **Pre-launch QA** - Test staging redirects where possible, sample old URLs, check canonicals, sitemaps, robots.txt, breadcrumbs, schema URLs, and internal links.
5. **Launch-day QA** - Re-test representative old URLs, high-value pages, XML sitemaps, robots.txt, homepage, top templates, key product/category pages, and Search Console submission readiness.
6. **Post-launch monitoring** - Track 404s, redirect chains, unexpected noindex, canonical mismatches, sitemap inclusion, and Google-selected canonical issues where Search Console evidence is available.
7. **Decision log** - Record accepted exceptions and unresolved risks with owner and review date.

## Yoast-specific controls

- Confirm whether Yoast Premium is installed and licensed before recommending the redirect manager as the implementation route.
- Keep Yoast redirect manager decisions separate from server/CDN redirects; duplicate rules can produce chains or unexpected status codes.
- Check whether changed slugs automatically create redirects in the site context before assuming manual work is needed.
- Do not recommend bulk importing redirects into production without approval, backup/export, representative test, and rollback plan.
- For migrated metadata, verify title, description, canonical, robots, schema and Open Graph output on representative migrated pages.
- For sitemap changes, check that redirected, noindexed, or deleted URLs are not still listed as indexable sitemap entries.
- For canonical decisions, avoid redirecting a URL and also relying on a self-conflicting canonical/noindex combination.

## Sampling guidance

Always test:

- Homepage and top landing pages.
- High-traffic URLs from analytics or Search Console where provided.
- URLs with backlinks or campaign value where provided.
- Each content type/template: pages, posts, products, categories, product categories, author/date archives if used, and language variants when multilingual.
- At least one expected 404/410 or intentionally removed URL.
- One redirect from each implementation route: Yoast, server/CDN, WordPress/admin plugin, or manual code route.

If evidence is thin, create a control plan and evidence request rather than a definitive pass/fail report.

## Stop conditions

Do not recommend launch readiness if any of these are unresolved:

- Site-wide noindex or blocked crawl state on live pages.
- High-value old URLs unmapped or unapproved.
- Redirect chains/loops on representative high-value URLs.
- Old URLs still in new XML sitemaps as indexable URLs.
- Canonical targets pointing to staging, old domain, wrong language, wrong product, or redirected URLs.
- Server/CDN and Yoast redirect rules conflict.
- No rollback or owner is defined for production redirect imports.
