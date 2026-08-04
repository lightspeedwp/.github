# Evidence policy

Use this policy whenever the skill gives Yoast configuration, audit, WooCommerce, schema, developer, QA, or research-pack recommendations.

## Evidence labels

| Label | Meaning | Use for |
|---|---|---|
| `confirmed yoast documentation` | Directly verified Yoast product, help, or developer documentation | Behaviour, feature output, product positioning |
| `product marketing claim` | Yoast commercial/product page claim | Packaging and product fit, not technical behaviour |
| `developer api behaviour` | Verified Yoast developer API/spec/filter documentation | Developer handoff, customisation, testing |
| `google search behaviour` | Verified Google Search Central documentation | Search interpretation, eligibility and caveats |
| `schema vocabulary` | Schema.org vocabulary evidence | Valid properties/types, not Google eligibility |
| `wordpress core behaviour` | WordPress official docs | Post types, taxonomies, hooks, metadata, robots dependencies |
| `woocommerce behaviour` | WooCommerce official docs | Product types, attributes, variations, stock, reviews |
| `inference` | Reasoned conclusion from related evidence | Recommendations that are not directly stated by a source |
| `unclear from available sources` | Scan did not answer the question | Gaps and open questions |
| `needs live verification` | UI path, packaging, licence, changelog, or rendered output may have changed | Before client-facing or implementation claims |
| `research target` | URL is in the source register but not freshly scanned | Queued research only |

## Source hierarchy

1. Yoast developer documentation.
2. Yoast product/help documentation.
3. WordPress.org plugin listings for availability/version context.
4. Google Search Central for Google Search behaviour.
5. Schema.org for vocabulary.
6. WordPress and WooCommerce official documentation for platform dependencies.
7. Weak supporting sources only when labelled.

## Rules

- Cite or name sources in deliverables where decisions depend on them.
- Separate product packaging claims from technical behaviour.
- Separate schema validity from Google rich-result eligibility.
- Separate Yoast output from WordPress/WooCommerce source data quality.
- Treat UI paths, pricing, licences, feature entitlements, and changelog-sensitive behaviour as fresh-verification items.
- Never state that a page was scanned unless the source register has an accessed date and extracted facts.
- Preserve duplicate URLs in the source register and mark which canonical page was scanned.

## Red flags

Escalate evidence confidence or ask for verification when:

- A recommendation changes indexation, canonicals, redirects, schema, sitemap inclusion, robots rules, or WooCommerce product data.
- A developer customisation touches filters, APIs, schema graph output, metadata presenters, indexables, or sitemaps.
- A client-facing report relies on current packaging or exact admin UI paths.
- The answer could imply Google ranking, rich-result, AI visibility, or indexing guarantees.

## Current verification trigger list

Use `docs/current-verification-playbook.md` before firm claims about product packaging, AI Plus entitlements, admin UI paths, Yoast API status, deprecated filters/actions, Google rich-result eligibility, Schema.org vocabulary, WooCommerce product-data behaviour, WordPress.org compatibility, or live rendered output. If verification is not available, label the recommendation as `needs live verification`, `research target`, `source not captured`, or `inference` as appropriate.

---

*🧭 Your compass through the documentation landscape*
