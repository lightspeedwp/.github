# Remediation backlog model

Use this model to turn Yoast audit findings, settings-export reviews, rendered-output QA, migration checks or WooCommerce issues into an implementation-ready backlog.

## Item fields

| Field | Required | Notes |
|---|---:|---|
| `id` | yes | Stable short ID, e.g. `YOAST-001` |
| `title` | yes | Action-oriented and specific |
| `finding` | yes | What was observed, not what is assumed |
| `evidence_state` | yes | Use `references/evidence-state-model.md` labels |
| `access_level` | yes | Evidence/access used for the finding |
| `severity` | yes | Use `references/audit-triage-model.md` |
| `priority` | yes | Must account for impact, effort and confidence |
| `owner` | yes | `seo_lead`, `content_editor`, `wordpress_admin`, `developer`, `client`, `hosting`, `unknown` |
| `implementation_route` | yes | `admin_change`, `content_change`, `code_change`, `server_change`, `client_decision`, `verify_first`, `research_first` |
| `recommended_action` | yes | Smallest safe action |
| `approval_required` | yes | Name what approval is needed or `none` |
| `qa_check` | yes | How the fix will be validated |
| `rollback_or_reversal` | no | Useful for risky indexation/canonical/.schemas/server changes |
| `dependencies` | no | Prior tasks or evidence needed |
| `decision_record_needed` | yes | True for material indexation/canonical/.schemas/product/redirect/product mix changes |
| `sources` | no | Source register IDs, user evidence references or live checks |

## Owner routing

- `seo_lead`: indexation strategy, canonical strategy, sitemap exclusions, source interpretation, Google/Search Console review.
- `content_editor`: titles, descriptions, excerpts, category descriptions, product copy, alt text and content quality changes.
- `wordpress_admin`: Yoast settings, Search Appearance, integrations, breadcrumbs, social settings, redirect manager where available.
- `developer`: filters, schema graph changes, template output conflicts, code overrides, custom post types/taxonomies, server-rendered metadata issues.
- `client`: business/entity decisions, archive visibility choices, product/category strategy, claims, AI metadata approval.
- `hosting`: HTTP headers, robots response conflicts, redirects outside WordPress, caching/CDN output mismatches.

## Implementation routes

| Route | Use when | Required QA |
|---|---|---|
| `admin_change` | Fix can be made safely in Yoast/WordPress admin | Rendered source, sitemap/robots/schema check as relevant |
| `content_change` | Fix depends on page/product/term content | Preview/rendered source and editorial approval |
| `code_change` | Fix depends on theme/plugin/filter/API customisation | Code review, staging QA, rendered output, regression check |
| `server_change` | Fix depends on hosting, CDN, HTTP headers, redirects or robots response | HTTP response and crawl retest |
| `client_decision` | Fix affects business strategy, legal/brand/entity choice or content visibility | Decision log and approval before implementation |
| `verify_first` | Evidence is incomplete or contradictory | Minimum verification action |
| `research_first` | Product/API/current-source status is uncertain | Current source verification before recommendation |

## Prioritisation guidance

- Priority 1: indexing blocked unintentionally, wrong canonicals, broken sitemap access, sitewide noindex, schema output breaking critical product pages, migration redirect/canonical failure.
- Priority 2: material archive/product duplicate risk, incomplete product schema, wrong entity/site representation, high-value metadata gaps, breadcrumb mismatch.
- Priority 3: lower-impact metadata improvements, social metadata polish, non-critical archive descriptions, editorial quality issues.
- Priority 4: nice-to-have optimisation, documentation cleanup, low-traffic refinements.

## Backlog output rule

Do not produce a backlog item that cannot be validated. If validation is not currently possible, create a `verify_first` item instead of inventing implementation details.
