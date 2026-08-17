# Yoast acceptance criteria

Use this template when a Yoast setup, audit remediation, migration, plugin update, WooCommerce SEO change or developer customisation needs a clear pass/fail gate.

## Scope

- Site/client:
- Work item:
- Environment:
- Evidence required:

## Acceptance criteria

| Area | Criterion | Evidence required | Pass/fail | Notes |
|---|---|---|---|---|
| Metadata | Representative URLs output expected titles and descriptions or documented fallbacks | Rendered source/crawl export |  |  |
| Canonicals | Canonical URLs point to the intended indexable URLs and domain | Rendered source |  |  |
| Meta robots | No unexpected noindex/nofollow directives on important URLs | Rendered source/HTTP headers |  |  |
| XML sitemaps | Intended content types and taxonomies are included/excluded correctly | Sitemap URLs |  |  |
| Robots.txt | No important sections blocked unexpectedly | robots.txt output |  |  |
| llms.txt | Output matches approved AI/source posture where enabled | llms.txt output |  |  |
| Schema | Required graph pieces are present and valid for representative pages | JSON-LD + validator |  |  |
| WooCommerce | Product, ProductGroup, Offer and archive output is correct where relevant | Product URLs + schema output |  |  |
| Breadcrumbs | Breadcrumb path and schema match site structure | Rendered output |  |  |
| Redirects | Migration redirects resolve to intended targets without chains where avoidable | Redirect test/crawl |  |  |
| Developer customisations | Yoast API/filter changes are tested in rendered output | Code review + rendered QA |  |  |
| Decision records | Risky changes have owner-approved decision logs | Decision record |  |  |

## Blockers

-

## Approval

- Approved by:
- Date:
- Conditions:

---

*🤖 This agent is orchestrated with precision and care — carefully choreographed automation*
