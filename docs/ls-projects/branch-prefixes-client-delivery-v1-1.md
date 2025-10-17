# **Branch Prefixes**
## *Client Delivery*

***Version:*** 1.1 • ***Last updated:*** 17 Oct 2025  
A consistent set of **branch prefixes** tuned for client repos. Short-lived branches, squash merges, clear mapping to Issue Types/Project “Type”.

---

[Shared core](#shared-core) • [Client-specific](#client-specific) • [Examples](#examples) • [One regex](#one-regex) • [Mapping](#mapping) • [Tips](#tips)

## **Shared core** {#shared-core}

- `feat/` — new capability  
- `fix/` — bug fix  
- `hotfix/` — urgent production fix  
- `release/` — release branches (e.g., `release/v1.6.0`)  
- `refactor/`, `chore/`, `docs/`, `test/`, `perf/`, `ci/`, `build/`, `deps/`, `security/`, `revert/`, `research/`, `design/`, `a11y/`, `ux/`, `i18n/`, `ops/`

## **Client-specific (optional)** {#client-specific}

- `content/` — content edits, redirects, IA  
- `seo/` — metadata, schema, sitemap, robots  
- `config/` — site/plugin configuration & flags  
- `migrate/` — data/content migrations  
- `qa/` — test harnesses, UAT scaffolding  
- `uat/` — UAT-only changes or staging toggles

## **Examples** {#examples}

feat/checkout-express-paypal
fix/nl-postcode-validation
content/category-copy-refresh
config/feature-flags-cart
seo/add-faq-schema-on-product
release/go-live-2025-10-10
hotfix/ga4-purchase-duplicate

## **One regex to enforce** {#one-regex}

Use a single org-wide rule:

^(feat|fix|hotfix|release|refactor|chore|docs|test|perf|ci|build|deps|security|revert|research|design|a11y|ux|i18n|ops|content|seo|config|migrate|qa|uat)/[a-z0-9._-]+$

## **Mapping to Issue Types (for automations)** {#mapping}

- `feat/` → Feature/Story  
- `fix/` → Bug (hotfix → critical Bug)  
- `refactor/` → Refactor  
- `chore/|ci/|build/|deps/|security/` → Chore  
- `design/|a11y/|ux/` → Design/Task  
- `content/|seo/|config/|migrate/|qa/|uat/` → Task/Operations  
- `release/` → Release PR

## **Tips** {#tips}
- Keep scopes meaningful, mirror to labels only when helpful, delete branches on merge.
