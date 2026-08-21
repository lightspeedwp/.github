---
name: yoast-auditor
description: audit, review, report and hand off yoast seo setups for wordpress and woocommerce sites. use when work involves yoast seo free, yoast seo premium, yoast woocommerce seo, metadata quality, schema output, xml sitemaps, robots rules, llms.txt, canonicals, redirects, breadcrumbs, indexables, product seo output, taxonomy seo, migration seo readiness, launch qa, client-ready audit reports, developer handoffs, evidence review, completed-change validation or yoast configuration review. do not use for first-time yoast setup or reusable configuration planning; route those to yoast-configuration.
---

# Yoast Auditor

## Purpose

Use this skill to inspect, evaluate, document, prioritise and hand off Yoast SEO findings for WordPress and WooCommerce sites. Keep the work audit-first and report-first.

Default output: Google Doc-ready Markdown.

## First step

Identify the audit context. If the user already stated the scope, continue with the smallest useful workflow. If scope is unclear, ask only:

> What should this Yoast audit focus on: configuration review, content metadata, taxonomy archives, WooCommerce SEO, schema output, migration readiness, launch QA, or a full-site review?

If the user asks for a quick check, first pass, fast audit, rough review, or gives limited evidence, use **Fast audit mode**.

## Skill QA / self-verification

When this skill is being reviewed or verified, inspect this entrypoint first, then check the referenced templates, intake files, reference files, routing boundaries and safety rules before declaring it ready.

Use the progressive loading map to load only the supporting files needed for the verification scope.

## Boundary with yoast-configuration

Use `yoast-auditor` for existing setup review, evidence review, metadata quality review, schema output review, XML sitemap, robots, llms.txt, canonical and meta robots QA, breadcrumb and social metadata review, WooCommerce product SEO review, taxonomy/archive review, migration or rebuild readiness, launch QA, post-launch validation, completed-change validation, proposed edit review, client-ready reports, internal technical reports and developer handoffs.

Route to `yoast-configuration` for first-time Yoast setup, configuration planning, agency-wide defaults, reusable configuration strategy, Search Appearance setup, metadata template setup, XML sitemap setup, schema setup, WooCommerce SEO setup, canonical, robots, llms.txt or breadcrumb configuration changes, and implementation-ready configuration playbooks.

If a request mixes audit and setup, complete the audit or evidence gap report first, then route setup/configuration ownership to `yoast-configuration`.

## Fast audit mode

Use fast audit mode when the user asks for a quick review, asks what to look at first, provides partial evidence, or needs a lightweight triage before a full report.

Fast audit mode must not pretend to be a full audit. Keep it compact and use this exact structure:

```markdown
# Fast Yoast Audit Snapshot

## Scope checked
- Site/environment:
- Audit focus:
- Evidence available:
- Evidence missing:

## Top findings
| Priority | Finding | Evidence status | Confidence | Why it matters | Safest next action | Owner / next route |
|---|---|---|---|---|---|---|

## Blocked checks
| Check | Missing evidence | Why it matters | Minimum evidence needed |
|---|---|---|---|

## Next step
[One practical next step, or route to `yoast-configuration` / developer where appropriate.]
```

Fast audit mode rules:

- Limit findings to the top 3-5 issues unless the user asks for more.
- Do not give a numeric score unless the reviewed evidence is broad enough to justify one.
- Mark partial observations as Low or Medium confidence.
- Use the full output contract if the user asks for a client-ready report, developer handoff, launch QA report, migration report, or full-site audit.

## Audit modes

1. Configuration review - review existing settings and observed output; do not create a new configuration plan.
2. Content metadata audit - review SEO titles, meta descriptions, slugs, social metadata, primary taxonomy, cornerstone indicators, readability signals and keyphrase usage where evidence is available.
3. Taxonomy and archive audit - review categories, tags, product categories, product tags, custom taxonomies, author archives, date archives and content archives.
4. WooCommerce SEO audit - review product metadata, product schema, ProductGroup, Offer, AggregateOffer, identifiers, variations, categories, tags, shop page, filters, duplicate content, canonicals, breadcrumbs, product sitemaps and social output.
5. Schema audit - review Yoast schema graph output, schema pieces, missing inputs, conflicts and customisation risk.
6. Sitemap, robots, llms.txt and crawlability audit - review XML sitemaps, robots.txt, llms.txt where available, meta robots, canonicals, HTTP headers and indexation controls.
7. Migration or rebuild readiness audit - review redirect, canonical, metadata, taxonomy, sitemap and WooCommerce SEO risks.
8. Launch QA - produce a Yoast launch-readiness checklist and go/no-go findings.
9. Post-launch validation - verify completed changes appear correct after launch.
10. Developer handoff review - convert findings into implementation-safe developer notes.
11. Proposed edit review - review proposed Yoast changes before implementation and confirm whether they are evidence-backed, safe, complete and approval-ready.

## Core models

Use these embedded models first. Load reference files only for deeper detail, edge cases, or template-specific support.

### 1. Scope model

- Full-site audit: use only when the user asks for full-site review or evidence covers all relevant content types.
- Sampled audit: use when only a page/product/taxonomy sample is provided. State sample limits beside the score.
- Page-level audit: use for metadata, canonical, schema or indexation review of named URLs.
- Taxonomy-level audit: use for categories, tags, product taxonomies, author/date archives or custom taxonomies.
- WooCommerce audit: use when products, product categories, shop pages, variations, stock/price output or ecommerce schema are in scope.
- Schema audit: use when structured data, rich results, schema graph or schema customisations are in scope.
- Migration/launch audit: use when URLs, redirects, launch readiness, rebuilds or post-launch checks are in scope.

### 2. Evidence model

Always separate:

- Confirmed evidence: directly observed from current site output, exports, MCP reads, screenshots, rendered HTML, source HTML, sitemaps, robots.txt, llms.txt, schema output, database reads, or official documentation.
- Inference: a likely conclusion based on available evidence, not directly proven.
- Content judgement: editorial assessment of clarity, intent fit, metadata quality, or duplication risk.
- Risk assessment: why the issue may matter for crawlability, indexation, search appearance, ecommerce discoverability, migration safety, launch readiness, or implementation safety.
- Recommendation: what should happen next.
- Proposed follow-up: the minimum next check, owner, route, or retest.
- Configuration work that should route to `yoast-configuration`.

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

> Overall Yoast audit score: 78/100 - Good. This score applies only to the reviewed WooCommerce product and product-category sample, not the full site.

Use priorities consistently:

- Critical: serious crawlability, indexation, canonical, redirect, launch, or important WooCommerce discoverability risk.
- High: likely impact on important pages, products, structured data, social sharing, metadata consistency, taxonomy archives, or ecommerce discoverability.
- Medium: quality, consistency, reporting clarity, editorial workflow, or discoverability issues unlikely to block core SEO behaviour.
- Low: housekeeping, documentation gaps, minor metadata issues, or optional workflow improvements.

### 4. Product capability model

- Identify active Yoast plugins and versions before judging missing features.
- Treat absent Premium, WooCommerce SEO, Local SEO or AI Plus capability as unknown until evidence confirms the stack.
- Separate product capability from site configuration. A feature may exist but not be enabled, configured or outputting correctly.
- Classify feature-related findings as product limitation, configuration gap, evidence gap or implementation risk.
- Route product selection, defaults and setup planning to `yoast-configuration`.

### 5. Owner and route model

Use these owner/next routes:

- `yoast-auditor`: audit, review, evidence gap report, post-change validation, proposed edit review and handoff preparation.
- `yoast-configuration`: setup, defaults, templates, product selection, configuration planning and implementation-ready configuration playbooks.
- Developer: code-level changes, theme/plugin output conflicts, schema customisations, risky redirects, breadcrumb code, template output, or anything requiring repository/admin changes outside safe Yoast fields.
- Content/editorial: metadata wording, page intent alignment, taxonomy descriptions, social copy, title clarity and content duplication review.

## Output contract

Every non-trivial output must follow a declared structure. Do not produce loose notes when an audit, report, review, QA result or handoff is requested.

### Required report structure

Use this structure for full audits, client-ready reports, internal reports and broad reviews unless a named template is more specific:

```markdown
# Yoast Audit Report: [Site or Scope]

## Executive summary
[Plain-English summary of the reviewed scope, main risks and safest next step.]

## Scope reviewed
- Site/environment:
- Audit mode:
- Reviewed pages/products/taxonomies:
- Exclusions:
- Output type:

## Evidence status
- Confirmed evidence:
- Inference:
- Content judgement:
- Blocked evidence:
- Stale or partial evidence:

## Overall Yoast audit score
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
- Use `yoast-configuration` for setup/configuration ownership.

For proposed edits, include item/location, field, current value, proposed value, reason, risk level, expected implementation route and owner/next route (`yoast-auditor`, `yoast-configuration` or developer).

## Output routing

Default to Google Doc-ready Markdown. Use the matching template when the user asks for a specific output:

- Client audit report: `templates/client-audit-report.md`
- Internal technical audit: `templates/internal-audit-report.md`
- Developer handoff: `templates/developer-handoff.md`
- Page metadata review: `templates/page-metadata-review.md`
- Taxonomy/archive review: `templates/taxonomy-archive-review.md`
- WooCommerce SEO audit: `templates/woocommerce-seo-audit-report.md`
- Schema QA report: `templates/schema-qa-report.md`
- Launch QA report: `templates/launch-qa-report.md`
- Migration readiness report: `templates/migration-readiness-report.md`
- Evidence gap report: `templates/evidence-gap-report.md`

## Progressive loading map

Core models are embedded above. Load only what is needed for deeper detail:

- Ambiguous scope: `references/audit-scope-router.md`, `intake/audit-intake.md`
- Evidence collection: `references/evidence-map.md`, `intake/site-evidence-intake.md`, `docs/evidence-policy.md`
- Detailed finding examples: `references/finding-rules-library.md`
- Feature availability: `references/product-capability-boundaries.md`, `references/source-register.md`
- Standard Yoast output: `references/yoast-output-reference.md`
- WooCommerce: `references/woocommerce-audit-reference.md`, `intake/woocommerce-audit-intake.md`, relevant ecommerce profile, WooCommerce template
- Schema: `references/schema-audit-reference.md`, schema template
- Migration, launch or post-launch: `references/migration-launch-reference.md`, `intake/migration-audit-intake.md`, migration profile, launch/migration templates
- Developer handoff: `references/developer-handoff-reference.md`, `intake/developer-handoff-intake.md`, handoff template
- Team usage or maintenance: files in `docs/`

## Routing examples

- "Can you configure Yoast for this new WooCommerce site?" -> route to `yoast-configuration`.
- "Can you audit whether Yoast is configured correctly on this WooCommerce site?" -> use `yoast-auditor`.
- "Can you do a quick Yoast check before we quote a full audit?" -> use fast audit mode.
- "Can you create agency-wide Yoast defaults for all LightSpeed client sites?" -> route to `yoast-configuration`.
- "Can you review this Yoast audit report before I send it to the client?" -> use `yoast-auditor` and enforce the output contract.
- "Can you check whether the completed Yoast changes are safe before launch?" -> use `yoast-auditor`.
- "Can you turn these Yoast findings into developer tasks?" -> use `yoast-auditor` and use required handoff fields.
- "Can you set up titles, descriptions, schema, sitemaps and WooCommerce SEO defaults?" -> route to `yoast-configuration`.

## Minimum report standard

Every report must include scope, evidence status, limitations, findings, priority, confidence, recommendation, owner or next route, retest/validation step and client-safe wording where relevant.

---

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
