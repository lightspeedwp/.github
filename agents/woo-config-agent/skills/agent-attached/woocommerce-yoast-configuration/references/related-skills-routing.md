# Related Skills Routing

## Purpose

This file defines how `woocommerce-yoast-configuration` should cooperate with adjacent Yoast skills without duplicating their responsibilities.

## Related skills

### `woocommerce-yoast-auditor`

Use `woocommerce-yoast-auditor` for live WordPress-connected Yoast SEO audit and edit workflows on WooCommerce sites.

Typical triggers:

- "audit this WooCommerce site's Yoast settings"
- "check these Yoast titles in admin"
- "update the meta descriptions"
- "set these taxonomies to noindex"
- "apply the approved metadata changes"
- "check Yoast schema output in WordPress"
- "review Yoast SEO data for these posts/products"
- "use the WordPress MCP/admin connector"

If the installed live-auditor skill uses a different slug, replace `woocommerce-yoast-auditor` with that exact installed slug in `SKILL.md`, this file, `references/file-routing-index.md`, and related tests.

## Boundary

`woocommerce-yoast-configuration` owns:

- configuration planning
- product capability comparison
- evidence interpretation
- settings export review
- rendered-output QA
- decision logs
- approval packs
- migration and redirect planning
- source-register/research-pack work
- remediation backlog creation

`woocommerce-yoast-auditor` owns:

- live WordPress/WooCommerce admin inspection
- live Yoast field review
- approved Yoast admin edits
- content-level SEO review through WordPress/WooCommerce
- live taxonomy metadata updates
- production/staging implementation
- before/after admin verification

## Handoff format

When routing from `woocommerce-yoast-configuration` to `woocommerce-yoast-auditor`, include:

| Field | Required | Notes |
|---|---|---|
| Site/client | Yes | Name, domain, or project identifier. |
| Environment | Yes | Production, staging, local, or unknown. |
| Access level | Yes | No access, screenshots, exported settings, WordPress admin, staging, codebase, Search Console, live crawl evidence, rendered source, or scanned documentation. |
| Evidence provided | Yes | Settings export, rendered output, crawl, screenshots, spreadsheet, approval queue, redirect map, etc. |
| Requested live action | Yes | What `woocommerce-yoast-auditor` should inspect or change. |
| Approval state | Yes | Proposed, approved, rejected, needs client approval, needs technical review, or unclear. |
| Affected fields/settings | Yes | Exact post/product/taxonomy/settings fields where known. |
| Risk level | Yes | Low, medium, high, launch-blocking, or unknown. |
| QA checks after change | Yes | Rendered title/meta, robots, canonical, sitemap, schema, breadcrumb, redirects, Search Console, etc. |
| Rollback/monitoring notes | If relevant | Required for migrations, redirects, noindex, canonical, template, batch, schema, and production changes. |

## Handoff template

```md
## Yoast Auditor Handoff

- Site/client:
- Environment:
- Access level:
- Evidence provided:
- Requested live action:
- Approval state:
- Risk level:
- Affected fields/settings:
- Post-change QA:
- Rollback/monitoring notes:
- Open blockers:
```

## Do not route when

Stay in `woocommerce-yoast-configuration` when the user only needs:

- a plan
- a report
- a template
- a decision pack
- a settings-export review
- a rendered-output QA report without WordPress access
- a source-register update
- a research pack
- a client-safe summary

## Safety notes

Do not present `woocommerce-yoast-configuration` as having completed live WordPress checks. If the evidence requires WordPress admin, staging, production, or connector access, label the current output as a handoff and route the live inspection or edit to `woocommerce-yoast-auditor`.
