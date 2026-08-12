# Approval queue workflow

Use this reference when Yoast recommendations need human approval before implementation, especially bulk metadata changes, AI-assisted metadata, indexation changes, canonicals, schema identity changes, redirects, and WooCommerce archive decisions.

## When to create an approval queue

Create or recommend an approval queue when any change:

- Affects more than five URLs.
- Changes indexation, canonical targets, sitemap inclusion, robots rules, or llms.txt content.
- Changes organisation/person identity, product schema, offers, reviews, or breadcrumbs.
- Uses AI-generated metadata or content.
- Contains claims, statistics, prices, availability, legal wording, regulated wording, or time-sensitive wording.
- Could affect client sign-off, migration acceptance, or launch go/no-go.

## Queue fields

| Field | Purpose |
|---|---|
| Item ID | Stable reference for comments and approval |
| URL/entity | Page, post, product, taxonomy, archive, setting, or template |
| Change type | Metadata, indexation, canonical, schema, social, redirect, robots, sitemap, product data |
| Current value | Observed or exported current state |
| Proposed value | Candidate change |
| Source basis | Approved source, client copy, rendered output, AI draft, inference, or unknown |
| Risk level | Low, medium, high, critical |
| Approval owner | Client, SEO lead, developer, content owner, legal/compliance, ecommerce owner |
| Implementation route | WordPress admin, Yoast UI, WooCommerce product data, developer change, hosting/server change, migration script |
| QA requirement | Rendered source, sitemap, robots, schema validator, Search Console, social preview, crawl recheck |
| Status | Candidate, needs source, needs rewrite, needs approval, approved, implemented, verified, rejected |

## Approval routing

| Change | Approval owner |
|---|---|
| Routine title/description cleanup | SEO/content owner |
| AI-generated metadata | Content owner plus SEO owner |
| Product metadata or offer data | Ecommerce/product owner |
| Claims or statistics | Client or compliance owner |
| Indexation/canonical/sitemap decisions | SEO lead; developer if code-controlled |
| Organisation/person schema | Client decision-maker or brand owner |
| Redirects or migration mapping | SEO lead plus implementation owner |
| Server-level robots/header changes | Developer/hosting owner |

## Safe response pattern

When approval is missing, say:

> This is ready for review, not ready for implementation. The next step is to confirm the source basis and approval owner for the flagged items, then implement only the approved rows and run rendered-output QA.

## Do not do

- Do not mark AI-generated text as approved without a named approval source.
- Do not collapse approval and implementation into the same step for high-risk changes.
- Do not present a spreadsheet or pasted list as live output evidence.
- Do not approve product metadata that conflicts with product data, availability, pricing, reviews, identifiers, or schema requirements.
