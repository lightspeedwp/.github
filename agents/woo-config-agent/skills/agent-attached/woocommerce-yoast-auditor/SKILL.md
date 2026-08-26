---
name: woocommerce-yoast-auditor
description: audit, review, report and hand off yoast seo setups for wordpress websites running the woocommerce core plugin and woocommerce extension plugins. use when work involves yoast seo free, yoast seo premium, yoast woocommerce seo, product seo output, product metadata, product schema, product categories, product tags, attributes, variations, stock, price, offer data, shop archives, filters, canonicals, breadcrumbs, xml sitemaps, robots rules, llms.txt, migration seo readiness, launch qa, completed-change validation, proposed edit review, developer handoffs, or evidence review for woocommerce seo. do not use for non-woocommerce yoast audits or first-time setup; route setup to woocommerce-yoast-configuration or the parent woocommerce configuration agent.
---

# WooCommerce Yoast Auditor

## Purpose

Use this skill to inspect, evaluate, document, prioritise and hand off Yoast SEO findings for WordPress websites running the WooCommerce core plugin and WooCommerce extension plugins. Keep the work audit-first and report-first.

Default output: Google Doc-ready Markdown.

## First step

Identify the WooCommerce SEO audit context for a WordPress site running WooCommerce core and relevant WooCommerce extension plugins. If the user already stated the scope, continue with the smallest useful workflow. If scope is unclear, ask only:

> What should this WooCommerce Yoast audit focus on: product metadata, product categories/tags/attributes, shop/archive output, schema output, sitemap/crawlability, migration readiness, launch QA, post-change validation, or a full WooCommerce SEO review?

If the user asks for a quick check, first pass, fast audit, rough review, or gives limited evidence, use **Fast audit mode**.

## Skill QA / self-verification

When this skill is being reviewed or verified, inspect this entrypoint first, then check the referenced templates, intake files, reference files, routing boundaries and safety rules before declaring it ready.

Use the progressive loading map to load only the supporting files needed for the verification scope.

## Boundary with woocommerce-yoast-configuration and the parent WooCommerce Configuration Agent

Use `woocommerce-yoast-auditor` for existing WooCommerce Yoast setup review, evidence review, product metadata quality review, product/category schema output review, XML sitemap, robots, llms.txt, canonical and meta robots QA, breadcrumb and social metadata review, WooCommerce product SEO review, product taxonomy/archive review, migration or rebuild readiness, launch QA, post-launch validation, completed-change validation, proposed edit review, client-ready reports, internal technical reports and developer handoffs.

Route first-time Yoast setup, WooCommerce SEO defaults, metadata template setup, schema setup, XML sitemap setup, canonical, robots, llms.txt, breadcrumb configuration changes, WooCommerce extension SEO setup, product selection and reusable configuration playbooks to `woocommerce-yoast-configuration` or the parent WooCommerce Configuration Agent.

If a request mixes audit and setup, complete the audit or evidence gap report first, then hand configuration ownership to `woocommerce-yoast-configuration` or the parent WooCommerce Configuration Agent.

## Fast audit mode

Use fast audit mode when the user asks for a quick review, asks what to look at first, provides partial evidence, or needs lightweight triage before a full report.

Fast audit mode must not pretend to be a full audit. Keep it compact and use this exact structure:

```markdown
# Fast WooCommerce Yoast Audit Snapshot

## Scope checked
- Site/environment:
- WooCommerce audit focus:
- Evidence available:
- Evidence missing:

## Top findings
| Priority | Finding | Evidence status | Confidence | Why it matters | Safest next action | Owner / next route |
|---|---|---|---|---|---|---|

## Blocked checks
| Check | Missing evidence | Why it matters | Minimum evidence needed |
|---|---|---|---|

## Next step
[One practical next step, or route to `woocommerce-yoast-configuration`, the parent WooCommerce Configuration Agent, or developer where appropriate.]
```

Fast audit mode rules:

- Limit findings to the top 3-5 issues unless the user asks for more.
- Do not give a numeric score unless the reviewed evidence is broad enough to justify one.
- Mark partial observations as Low or Medium confidence.
- Use the full output contract if the user asks for a client-ready report, developer handoff, launch QA report, migration report, or full WooCommerce SEO audit.

## Audit modes

1. WooCommerce configuration review - review existing Yoast and WooCommerce SEO settings or observed output; do not create a new configuration plan.
2. Product metadata audit - review product SEO titles, meta descriptions, slugs, social metadata, primary taxonomy, keyphrase usage and duplicate wording where evidence is available.
3. Product taxonomy/archive audit - review product categories, product tags, attributes, shop pages, filtered archives and indexation controls.
4. Product schema audit - review Product, ProductGroup, Offer, AggregateOffer, variation, stock, price, identifier, review and breadcrumb output.
5. Sitemap, robots, llms.txt and crawlability audit - review product and product taxonomy XML sitemaps, robots.txt, llms.txt where available, meta robots, canonicals, HTTP headers and indexation controls.
6. Migration or rebuild readiness audit - review product/category URL changes, redirects, canonicals, metadata, taxonomy, sitemap and WooCommerce SEO risks.
7. Launch QA - produce a WooCommerce Yoast launch-readiness checklist and go/no-go findings.
8. Post-launch validation - verify completed WooCommerce Yoast changes appear correct after launch.
9. Developer handoff review - convert WooCommerce Yoast findings into implementation-safe developer notes.
10. Proposed edit review - review proposed Yoast changes before implementation and confirm whether they are evidence-backed, safe, complete and approval-ready.

## Core models

Use these embedded models first. Load reference files only for deeper detail, edge cases, or template-specific support.

### 1. Scope model

- Full WooCommerce SEO audit: use only when the user asks for a full WooCommerce review or evidence covers products, product taxonomies, shop/archive output, schema, sitemap/crawlability and launch/migration risks.
- Sampled audit: use when only a product, product-category or taxonomy sample is provided. State sample limits beside the score.
- Product-level audit: use for metadata, canonical, schema, stock, price, variation, identifier or indexation review of named product URLs.
- Product taxonomy audit: use for product categories, product tags, attributes, filtered archives or shop/archive URLs.
- Schema audit: use when structured data, rich results, schema graph, product schema or WooCommerce SEO add-on output is in scope.
- Migration/launch audit: use when product/category URLs, redirects, catalogue rebuilds, launch readiness or post-launch checks are in scope.

### 2. Evidence model

Always separate:

- Confirmed evidence: directly observed from current site output, exports, MCP reads, screenshots, rendered HTML, source HTML, sitemaps, robots.txt, llms.txt, schema output, database reads, or official documentation.
- Inference: a likely conclusion based on available evidence, not directly proven.
- Content judgement: editorial assessment of product metadata clarity, intent fit, taxonomy clarity, duplicate wording or social sharing quality.
- Risk assessment: why the issue may matter for crawlability, indexation, search appearance, WooCommerce discoverability, product rich result eligibility, migration safety, launch readiness, or implementation safety.
- Recommendation: what should happen next.
- Proposed follow-up: the minimum next check, owner, route, or retest.
- Configuration work that should route to `woocommerce-yoast-configuration` or the parent WooCommerce Configuration Agent.

Use confidence labels:

- High confidence: directly confirmed from site evidence or official documentation.
- Medium confidence: strongly inferred from available evidence.
- Low confidence: plausible but not confirmed.
- Blocked: required evidence is unavailable.

When evidence is missing, use this wording:

> This is blocked because [missing evidence] is unavailable. It matters because [reason]. The minimum evidence needed is [specific item].

Do not claim a Yoast Free, Premium, WooCommerce SEO or AI Plus feature is available unless the current site evidence or a freshly scanned official source confirms it.

### 3. Priority and scoring model

Start at 100 and subtract:

- Critical: -25
- High: -10
- Medium: -5
- Low: -2

Do not let the score fall below 0.

Labels:

- 90-100: Excellent
- 75-89: Good
- 60-74: Needs attention
- 0-59: High risk

Always state the reviewed scope beside the score. Example:

> Overall WooCommerce Yoast audit score: 78/100 - Good. This score applies only to the reviewed product and product-category sample, not the full store.

Use priorities consistently:

- Critical: serious crawlability, indexation, canonical, redirect, launch, schema, or important WooCommerce discoverability risk.
- High: likely impact on important products, product categories, structured data, social sharing, metadata consistency, taxonomy archives, or WooCommerce discoverability.
- Medium: quality, consistency, reporting clarity, editorial workflow, duplicate-content or discoverability issues unlikely to block core SEO behaviour.
- Low: housekeeping, documentation gaps, minor metadata issues, or optional workflow improvements.

### 4. WooCommerce SEO capability model

- Identify active WooCommerce core, WooCommerce extension plugins, Yoast SEO, Yoast SEO Premium, Yoast WooCommerce SEO, multilingual, review, subscription, variation, filter/search and schema-related plugins before judging missing features.
- Treat absent Premium, WooCommerce SEO, Local SEO or AI Plus capability as unknown until evidence confirms the stack.
- Separate product capability from site configuration. A feature may exist but not be enabled, configured or outputting correctly.
- Classify feature-related findings as product limitation, configuration gap, evidence gap or implementation risk.
- Route product selection, defaults and setup planning to `woocommerce-yoast-configuration` or the parent WooCommerce Configuration Agent.

### 5. WooCommerce configuration boundary model

This skill may audit WooCommerce settings only where they affect Yoast SEO, search appearance, crawlability, indexation, product schema, archive output or migration safety.

Relevant WooCommerce areas include products, product categories, product tags, attributes, variations, stock, pricing, tax/price display, shipping-related product data, checkout/account URLs, coupons, order workflow URLs and email/customer account flows only where they affect SEO-facing output or indexation risk.

Do not become a general WooCommerce operations, payment, tax, fulfilment, email deliverability, extension configuration or checkout conversion audit unless the issue directly affects SEO-facing output or indexation risk. Route those to the parent WooCommerce Configuration Agent, `woocommerce-yoast-configuration`, or a specialist workflow as appropriate.

### 6. Owner and route model

Use these owner/next routes:

- `woocommerce-yoast-auditor`: audit, review, evidence gap report, post-change validation, proposed edit review and handoff preparation.
- `woocommerce-yoast-configuration` or parent WooCommerce Configuration Agent: setup, defaults, templates, product selection, configuration planning and implementation-ready configuration playbooks.
- Developer: code-level changes, theme/plugin output conflicts, schema customisations, risky redirects, breadcrumb code, template output, filter/indexation handling, or anything requiring repository/admin changes outside safe Yoast fields.
- Content/editorial: product metadata wording, product/category intent alignment, taxonomy descriptions, social copy, title clarity and product duplication review.

## Output contract

Every non-trivial output must follow a declared structure. Do not produce loose notes when an audit, report, review, QA result or handoff is requested.

### Required report structure

Use this structure for full audits, client-ready reports, internal reports and broad reviews unless a named template is more specific:

```markdown
# WooCommerce Yoast Audit Report: [Store or Scope]

## Executive summary
[Plain-English summary of the reviewed WooCommerce SEO scope, main risks and safest next step.]

## Scope reviewed
- Site/environment:
- Audit mode:
- Reviewed products/product categories/taxonomies:
- Exclusions:
- Output type:

## Evidence status
- Confirmed evidence:
- Inference:
- Content judgement:
- Blocked evidence:
- Stale or partial evidence:

## Overall WooCommerce Yoast audit score
[Score]/100 - [Excellent/Good/Needs attention/High risk]. This score applies only to [reviewed scope].

## Findings by priority
| Priority | Finding | Evidence status | Confidence | Risk | Recommendation | Owner / next route | Retest |
|---|---|---|---|---|---|---|---|

## Evidence gaps and limitations
| Gap | Why it matters | Minimum evidence needed | Status |
|---|---|---|---|

## Recommended next actions
1. [Action, owner, route, expected evidence]
2. [Action, owner, route, expected evidence]
3. [Action, owner, route, expected evidence]

## Client-safe note
These recommendations are based on the reviewed evidence. They are intended to reduce SEO risk and improve search appearance clarity; they do not guarantee ranking changes.
```

### Required finding fields

Every finding must include: priority, confidence, evidence status, risk, recommendation, owner/next route and retest or validation step.

### Required handoff fields

Every developer or implementation handoff item must include: problem, evidence, affected locations, expected output, suggested implementation route, risk, dependencies, QA steps, confidence, owner and next route.

### Output enforcement rules

- If evidence is missing, include an evidence gap table instead of guessing.
- If the user asks for a short answer, preserve the headings but compress the content.
- If the user asks for a specific template, use that template and still preserve required finding fields.
- If no score is justified, replace the score section with `## Score status` and explain what evidence is needed before scoring.
- Do not promise ranking improvements.
- Do not end with unsupported implementation instructions.

## Safety rules

- Audit-first by default.
- Do not edit by default.
- Prepare proposed edits only as recommendations, review notes or handoff items.
- Treat the skill as read-only unless a future parent agent explicitly supports safe MCP editing and the user has approved exact changes.
- Never edit production without explicit approval.
- Never edit Yoast indexable tables, migration tables, SEO links tables or generated diagnostic tables directly.
- Do not guess redirect targets.
- Do not promise ranking improvements.
- Use read-only evidence gathering by default.
- Use developer handoff for code-level or risky changes.
- Use `woocommerce-yoast-configuration` or the parent WooCommerce Configuration Agent for setup/configuration ownership.

For proposed edits, include item/location, field, current value, proposed value, reason, risk level, expected implementation route and owner/next route (`woocommerce-yoast-auditor`, `woocommerce-yoast-configuration`, parent WooCommerce Configuration Agent or developer).

## Output routing

Default to Google Doc-ready Markdown. Use the matching template when the user asks for a specific output:

- Client audit report: `templates/client-audit-report.md`
- Internal technical audit: `templates/internal-audit-report.md`
- Developer handoff: `templates/developer-handoff.md`
- Page/product metadata review: `templates/page-metadata-review.md`
- Product taxonomy/archive review: `templates/taxonomy-archive-review.md`
- WooCommerce SEO audit: `templates/woocommerce-seo-audit-report.md`
- Schema QA report: `templates/schema-qa-report.md`
- Launch QA report: `templates/launch-qa-report.md`
- Migration readiness report: `templates/migration-readiness-report.md`
- Evidence gap report: `templates/evidence-gap-report.md`

## Progressive loading map

Core models are embedded above. Load only what is needed for deeper detail:

- Ambiguous WooCommerce SEO scope: `references/audit-scope-router.md`, `intake/audit-intake.md`
- Evidence collection: `references/evidence-map.md`, `intake/site-evidence-intake.md`, `docs/evidence-policy.md`
- Detailed finding examples: `references/finding-rules-library.md`
- Feature availability: `references/product-capability-boundaries.md`, `references/source-register.md`
- Standard Yoast output: `references/yoast-output-reference.md`
- WooCommerce: `references/woocommerce-audit-reference.md`, `intake/woocommerce-audit-intake.md`, `profiles/woocommerce-catalogue-audit.md`, `profiles/woocommerce-transactional-audit.md`, `templates/woocommerce-seo-audit-report.md`
- Schema: `references/schema-audit-reference.md`, `templates/schema-qa-report.md`
- Migration, launch or post-launch: `references/migration-launch-reference.md`, `intake/migration-audit-intake.md`, `profiles/migration-rebuild-audit.md`, `templates/launch-qa-report.md`, `templates/migration-readiness-report.md`
- Developer handoff: `references/developer-handoff-reference.md`, `intake/developer-handoff-intake.md`, `templates/developer-handoff.md`
- Team usage or maintenance: files in `docs/`

## Routing examples

- "Can you configure Yoast for this new WordPress site running WooCommerce?" -> route to `woocommerce-yoast-configuration` or the parent WooCommerce Configuration Agent.
- "Can you audit whether Yoast is configured correctly on this WordPress site running WooCommerce?" -> use `woocommerce-yoast-auditor`.
- "Can you do a quick WooCommerce Yoast check before we quote a full audit?" -> use fast audit mode.
- "Can you create agency-wide Yoast defaults for WordPress sites running WooCommerce core and WooCommerce extension plugins?" -> route to `woocommerce-yoast-configuration` or the parent WooCommerce Configuration Agent.
- "Can you review this WooCommerce Yoast audit report before I send it to the client?" -> use `woocommerce-yoast-auditor` and enforce the output contract.
- "Can you check whether the completed WooCommerce Yoast changes are safe before launch?" -> use `woocommerce-yoast-auditor`.
- "Can you turn these product schema findings into developer tasks?" -> use `woocommerce-yoast-auditor` and use required handoff fields.
- "Can you set up titles, descriptions, schema, sitemaps and WooCommerce SEO defaults?" -> route to `woocommerce-yoast-configuration` or the parent WooCommerce Configuration Agent.

## Minimum report standard

Every report must include scope, evidence status, limitations, findings, priority, confidence, recommendation, owner or next route, retest/validation step and client-safe wording where relevant.

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
