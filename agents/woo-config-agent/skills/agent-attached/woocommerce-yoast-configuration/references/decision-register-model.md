# Decision register model

Use this file when a Yoast recommendation creates a reusable decision, an approval dependency, a trade-off, or a change that future audits must understand. The goal is to preserve why a Yoast configuration choice was made without turning every output into a long project report.

## When to create a decision record

Create a decision record when one or more of these apply:

- The decision changes indexation, canonicalisation, sitemap inclusion, schema graph output, breadcrumbs, redirects, robots rules, llms.txt, social metadata, WooCommerce product schema, product archive strategy, or developer customisation.
- The decision overrides a default from `memory/defaults/` or a site profile in `profiles/`.
- The decision is a client-specific exception, such as indexing product tags, noindexing author archives, changing organisation/person representation, or suppressing thin archives.
- The decision depends on unverified evidence and needs later confirmation.
- The decision creates a QA obligation before launch or after deployment.
- The decision needs a client, SEO lead, developer, support, content, or ecommerce owner to approve it.

Do not create a decision record for routine observations that do not change configuration or follow-up work.

## Decision states

Use one of these states:

| State | Meaning | Allowed next step |
|---|---|---|
| `proposed` | Recommendation made, not approved | Seek approval or gather missing evidence |
| `approved` | Approved for implementation | Implement and schedule QA |
| `implemented` | Applied on site or in code | Validate rendered output and source effects |
| `validated` | QA passed | Close or monitor |
| `blocked` | Cannot proceed because evidence, access, approval, or dependency is missing | Record smallest unblocker |
| `rejected` | Deliberately not implemented | Record reason and risk accepted |
| `superseded` | Replaced by a later decision | Link to newer decision |

## Decision types

Use one primary type:

- `product-mix`
- `site-representation`
- `search-appearance`
- `content-type-indexation`
- `taxonomy-indexation`
- `archive-indexation`
- `canonical`
- `meta-robots`
- `xml-sitemap`
- `robots-txt`
- `llms-txt`
- `breadcrumbs`
- `schema`
- `woocommerce-product-schema`
- `woocommerce-archive-strategy`
- `redirect`
- `ai-assisted-metadata`
- `developer-customisation`
- `source-verification`
- `qa-gate`

## Required fields

Use this structure when the user asks for a decision log or when a recommendation needs traceability:

```json
{
  "decision_id": "YOAST-DEC-001",
  "date": "YYYY-MM-DD",
  "site_or_client": "",
  "decision_type": "",
  "state": "proposed",
  "decision": "",
  "rationale": "",
  "confirmed_evidence": [],
  "assumptions": [],
  "risks": [],
  "owner": "",
  "approval_needed_from": "",
  "implementation_notes": "",
  "qa_required": [],
  "review_trigger": "",
  "supersedes": "",
  "related_files": []
}
```

## Owner guidance

| Decision area | Typical owner direction |
|---|---|
| Product mix, pricing, entitlement | Account/project owner after current verification |
| Site representation and schema identity | SEO lead + client approver |
| Indexation and canonicals | SEO lead; developer if code/custom plugin affects output |
| WooCommerce product schema | Ecommerce/SEO lead + product data owner |
| Redirects and migration controls | SEO lead + developer |
| AI-assisted metadata | Content owner + SEO reviewer |
| API/filter customisation | Developer + SEO reviewer |
| Source-register updates | Research owner or skill maintainer |

## Risk wording

Keep risk statements specific. Avoid vague language such as "bad for SEO".

Prefer:

- "Can cause indexed duplicate archive URLs if product filters remain crawlable and canonical handling is not validated."
- "Can remove important product URLs from XML sitemaps if noindex and sitemap visibility are misaligned."
- "Can produce unsupported schema claims if product identifiers or review data are missing or mapped from unreliable fields."

## Maintenance

- Review open `proposed` and `blocked` decisions before launch QA.
- Mark decisions `superseded` instead of deleting them.
- Refresh decisions after Yoast product packaging changes, developer API changes, Google Search documentation changes, or major site information architecture changes.
