# Evidence state model

Use this file when updating the source register, producing research packs, or deciding whether a Yoast recommendation can be presented as confirmed.

## Evidence states

| State | Meaning | Can support client recommendation? | Required handling |
|---|---|---:|---|
| `research target` | URL is in the scan set but has not been opened and captured in the current research workflow | No | Say it is queued for verification |
| `scanned evidence` | Source was opened, captured and summarised with accessed date | Yes, with date and confidence | Cite the source-register row or live citation |
| `verified current source` | Source was scanned recently enough for the risk level and matches current product/docs behaviour | Yes | Use as primary support |
| `needs live verification` | Product packaging, UI path, licence, version, changelog, or Google interpretation may have changed | Only as a caveated lead | Browse or verify before making a strong claim |
| `stale evidence` | Source was scanned but is old for the decision being made | Weakly, with caveat | Refresh before proposal, launch or developer use |
| `contradicted evidence` | Two official or authoritative sources conflict | No single-source claim | Present conflict, prioritise higher source hierarchy, and request/perform verification |
| `inference` | Reasoned conclusion from related sources, not directly stated | Only when labelled | Explain the inference and its basis |
| `unsupported` | No reliable source captured | No | Mark as gap or ask for evidence |
| `unclear from available sources` | The scanned sources did not answer the specific question | No, except as a documented gap | State the gap and identify the next verification route |
| `source not captured` | A claim or recommendation lacks a source-register row or live citation | No | Add a source row or downgrade the claim to unsupported/inference |

## Freshness guidance

| Decision type | Maximum comfortable age | Refresh trigger |
|---|---:|---|
| Product packaging, pricing, entitlement, AI Plus positioning | 30 days | Proposal, purchase, client recommendation |
| Developer APIs, filters, deprecations, indexables, schema internals | 60 days | Code handoff, plugin upgrade, customisation |
| Google Search interpretation | 60 days | Schema, robots, canonical, hreflang or rich-result advice |
| WooCommerce product/schema behaviour | 60 days | Store launch or product schema work |
| Agency defaults and output templates | 90 days | Process change or repeated QA miss |
| General SEO guide context | 180 days | Only if used as supporting context |

## Source classification rules

- Use `confirmed yoast documentation` for Yoast docs that directly describe behaviour or configuration.
- Use `developer api behaviour` for Yoast developer API, filter, feature specification and deprecation docs.
- Use `product marketing claim` for product pages and commercial packaging.
- Use `google search behaviour` for Google Search Central documentation.
- Use `schema vocabulary` for Schema.org vocabulary pages.
- Use `wordpress core behaviour` for WordPress official documentation.
- Use `woocommerce behaviour` for WooCommerce official documentation.
- Use `weak supporting evidence` only when clearly labelled and never as the deciding source.

## Decision rules

1. Do not upgrade `research target` to `scanned evidence` without an accessed date and captured key facts.
2. Do not rely on product marketing claims for Google Search behaviour.
3. Do not rely on Google documentation for Yoast plugin availability or settings UI.
4. Do not treat Schema.org validity as Google rich-result eligibility.
5. Do not treat Yoast schema output as correct until rendered source is checked on the target site.
6. Do not treat generated AI metadata as approved content until a human review step is recorded.
