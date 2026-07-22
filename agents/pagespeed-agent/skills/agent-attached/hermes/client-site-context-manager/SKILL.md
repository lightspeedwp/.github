---
name: client-site-context-manager
description: normalize and maintain lightweight, reusable client and site context for website audit workflows. use when a user asks to create, update, clean, standardize, retrieve, or reconcile durable audit context for clients, sites, page groups, business priorities, platform constraints, recurring notes, or naming conventions. use before or alongside website performance, accessibility, technical seo, security, hosting, content, ai-readiness, launch, or post-launch audits when client/site context is missing, inconsistent, duplicated, or scattered. avoid using for one-off audit urls, temporary metrics, current audit findings, speculative causes, or single-run observations that should remain in the audit report.
---

# Client Site Context Manager

## Purpose

Maintain a small, trusted context layer that helps future website audits start with the right client, site, priorities, constraints, and page-group names.

Use this skill to normalize durable context, not to store raw audit evidence. Keep entries lightweight, source-aware, and easy to update.

## Core Workflow

1. **Identify the target client and site**
   - Resolve the canonical client name, client slug, site name, and site slug.
   - Record aliases only when they are likely to appear again in future audit materials.
   - If a site belongs to more than one brand or business unit, record the ownership relationship explicitly.

2. **Classify the input**
   - Store durable context only.
   - Keep one-off audit evidence, temporary URLs, metrics, screenshots, run-specific findings, or speculative notes in the current audit deliverable instead.

3. **Update the smallest useful entry**
   - Prefer editing the existing client or site entry over creating a new file.
   - Add only the field that changed.
   - Mark outdated notes as replaced or removed; do not leave contradictory context without explanation.

4. **Summarize the change**
   - Return a concise update summary with: entry changed, fields updated, source/confidence, and anything deliberately not stored.
   - If the context cannot be safely stored, explain why and provide a temporary note for the current audit only.

## Data Model

Use the following model for shared workspace context. Keep optional fields out when empty.

### Client Context

```yaml
client_id: canonical-client-slug
canonical_name: Client Name
aliases:
  - alternate spelling or legacy name
status: active | inactive | prospect | unknown
business_summary: one or two stable sentences about the organisation
business_priorities:
  - priority: Lead generation
    notes: Durable reason this matters across audits
primary_audiences:
  - audience group
markets:
  - country, region, or market when audit-relevant
recurring_notes:
  - note: Repeated or confirmed client-level context
    confidence: confirmed | observed-repeated
    source: user-provided | workspace-doc | prior-audit | other
last_reviewed: YYYY-MM-DD
```

### Site Context

```yaml
site_id: canonical-site-slug
client_id: canonical-client-slug
canonical_name: Site Name
site_role: main website | ecommerce | campaign | portal | microsite | staging | other
stable_domain: example.com
platform:
  cms: WordPress | Shopify | custom | unknown
  ecommerce: WooCommerce | Shopify | none | unknown
  theme_or_stack: LSXD | custom theme | block theme | classic theme | unknown
  hosting: provider or environment constraint when audit-relevant
constraints:
  - constraint: Durable technical, platform, hosting, legal, or operational constraint
    impact: Why future audits should know this
business_priorities:
  - priority: Enquiries, sales, subscriptions, donations, bookings, editorial reach, or similar
    audit_relevance: How this changes audit weighting
integrations:
  - name: GA4, GTM, Mailchimp, Zoho, Wetu, payment gateway, CRM, or similar
    relevance: Why auditors should consider it
recurring_notes:
  - note: Repeated or confirmed site-level context
    confidence: confirmed | observed-repeated
    source: user-provided | workspace-doc | prior-audit | other
last_reviewed: YYYY-MM-DD
```

### Page Group Context

```yaml
site_id: canonical-site-slug
page_groups:
  - group_id: canonical-page-group-slug
    label: Human-readable page group name
    purpose: Why this group matters in audits
    include_patterns:
      - /shop/*
      - /category/*
    exclude_patterns:
      - /checkout/*
    priority: high | medium | low
    audit_notes: Stable guidance for future audits
```

### Change Log Entry

```yaml
date: YYYY-MM-DD
entry: clients/client-slug/sites/site-slug.md
change_type: created | updated | renamed | merged | deprecated
summary: Short description of the durable context change
source: user-provided | workspace-doc | audit-report | other
confidence: confirmed | observed-repeated
not_stored:
  - Temporary or speculative information intentionally excluded
```

## What to Store

Store context when it is stable, reusable, and useful across future audits:

- Canonical client names, site names, slugs, and durable aliases.
- Which sites belong to which clients.
- Stable domains for live production sites, when needed to distinguish sites.
- Business priorities that change audit weighting, such as sales, leads, bookings, subscriptions, editorial reach, donations, or compliance.
- Platform constraints, such as WordPress, WooCommerce, LSXD, block theme, classic theme, custom plugin dependency, hosted environment, CDN constraint, multilingual setup, or integration dependency.
- Repeated notes confirmed across multiple audits or explicitly confirmed by the user.
- Standard page groups and reusable path patterns, such as home, shop, product, checkout, blog, category, service, destination, tour, accommodation, landing pages, or policy pages.
- Durable exclusions, such as pages that should not be benchmarked because they are login-only, intentionally noindexed, or handled by a third-party system.

## What Not to Store

Do not save context when it is one-off, temporary, speculative, sensitive, or better suited to a specific audit report:

- Full audit URL lists, crawl exports, screenshot URLs, testing URLs, or individual pages used only for one run.
- Current Lighthouse, PageSpeed, Core Web Vitals, accessibility, SEO, security, or hosting metrics.
- Temporary staging URLs, preview links, signed URLs, UTM links, campaign links, cache-busting URLs, or short-lived redirects.
- Unconfirmed causes, guesses, hypotheses, rumours, or notes marked “maybe”, “likely”, “possibly”, or “needs checking”.
- Client feedback that applies only to the current audit deliverable.
- Credentials, tokens, API keys, private personal details, billing details, or sensitive information not required for audit context.
- Old notes that conflict with newer confirmed context unless retained in a changelog as deprecated.

## Naming Standards

Use consistent names so related audits can find the right context quickly.

- `canonical_name`: use the public or client-approved name, with normal capitalization.
- `client_id` and `site_id`: use lowercase kebab-case, with no legal suffix unless it prevents confusion.
- `stable_domain`: store only the root production domain where durable and necessary; avoid long URLs.
- `page_group_id`: use simple reusable group names, such as `home`, `service-pages`, `product-pages`, `checkout`, `blog-posts`, `tour-pages`, or `policy-pages`.
- `aliases`: include legacy names, abbreviations, brand names, or common misspellings only when useful for future matching.

When renaming, keep the old alias in `aliases` and add a changelog entry explaining the rename.

## Recommended File Structure

Use this structure in a shared workspace, repo, Drive folder, or project memory folder:

```text
client-site-context/
├── README.md
├── index.md
├── clients/
│   └── client-slug/
│       ├── client.md
│       ├── changelog.md
│       ├── naming.md
│       ├── page-groups/
│       │   └── site-slug.md
│       └── sites/
│           └── site-slug.md
└── templates/
    ├── client.md
    ├── site.md
    ├── page-groups.md
    └── changelog-entry.md
```

Recommended usage:

- `index.md`: list all clients and their known sites.
- `client.md`: store client-level context once.
- `sites/site-slug.md`: store site-level context and constraints.
- `page-groups/site-slug.md`: store reusable page group definitions for audits.
- `naming.md`: track aliases, old names, and preferred wording.
- `changelog.md`: record small durable context updates.
- `templates/`: keep blank copy-paste templates. See `references/context-templates.md`.

## Clean Update Guidance

When updating an existing entry:

1. **Search before creating**
   - Check existing client aliases, site aliases, old names, and domain references.
   - If a likely duplicate exists, propose a merge rather than creating another entry.

2. **Prefer additive, source-aware edits**
   - Add the smallest useful note.
   - Include source and confidence for recurring notes.
   - Use `confirmed` only when the user or a reliable workspace source states it clearly.
   - Use `observed-repeated` only when the same context appears across multiple audit materials.

3. **Remove contradiction**
   - If a new fact replaces an old one, update the active field and add a changelog entry.
   - Do not leave both “uses classic theme” and “uses block theme” as active constraints unless both are true for different areas.

4. **Keep uncertainty out of durable context**
   - Put possible causes, suspected blockers, and open questions into the audit notes, not the shared context file.
   - Ask for confirmation or mark the item as not stored.

5. **Return an audit-safe summary**
   - State what changed.
   - State what was intentionally excluded.
   - Flag any missing confirmation needed before a future durable update.

## Output Patterns

### Context Update Summary

```markdown
## Context Update Summary

Updated: `clients/client-slug/sites/site-slug.md`

Stored:
- Added WooCommerce as a durable ecommerce constraint.
- Added “checkout conversion” as a high-priority audit concern.

Not stored:
- Excluded today’s PageSpeed scores because they belong in the audit report.
- Excluded the staging preview URL because it is temporary.

Confidence: confirmed from user-provided context.
```

### New Context Entry Summary

```markdown
## New Context Entry Created

Client: Client Name (`client-slug`)
Site: Site Name (`site-slug`)

Stored:
- Canonical client and site names.
- Stable production domain.
- Platform and ecommerce constraints.
- Reusable page groups for future audits.

Next useful confirmation:
- Confirm whether lead generation or ecommerce conversion should carry the highest audit weighting.
```

## Bundled References

Load `references/context-templates.md` when creating or updating actual workspace context files.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
