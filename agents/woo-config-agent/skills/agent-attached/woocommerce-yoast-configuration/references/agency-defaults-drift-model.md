# Agency defaults drift model

Use this model when comparing a client site's Yoast configuration against agency defaults, standard Yoast defaults, WooCommerce defaults, schema defaults, or a previously approved project baseline.

## Drift definition

A drift item is a difference between the current observed or reported Yoast state and an expected baseline.

Drift is not automatically a defect. It must be classified.

## Drift classes

| Class | Meaning | Action |
|---|---|---|
| Approved exception | Difference is intentional and documented | Keep, record decision, retest after relevant changes |
| Beneficial improvement | Difference improves fit for the site type | Consider updating reusable defaults if repeated |
| Risky drift | Difference creates SEO, schema, indexation, or QA risk | Create remediation item |
| Unknown drift | Difference exists but evidence is incomplete | Request missing evidence or live verification |
| Deprecated default | Agency baseline is stale versus current Yoast or platform guidance | Refresh default before changing client site |
| Client-specific requirement | Difference is driven by client policy, legal, content, ecommerce, multilingual or editorial needs | Record decision and owner approval |

## Drift evidence levels

| Evidence | Can prove | Cannot prove |
|---|---|---|
| Memory/defaults file | Expected baseline | Current site behaviour |
| Settings export | Reported configuration state | Rendered output or Google interpretation |
| Rendered page source | Current output for sampled URL | Whole-site behaviour |
| Sitemap/robots/llms.txt | Current crawl/discovery artefact state | Per-page canonical or schema correctness |
| Crawl export | Wider sampled output | Exact cause without settings/code evidence |
| Codebase evidence | Customisation route | Search engine interpretation |
| Search Console | Google-reported state | Full Yoast configuration cause |

## Drift review sequence

1. Identify the baseline source and date.
2. Confirm whether the baseline is still valid or needs refresh.
3. Compare only like-for-like site types.
4. Separate site-level differences from product-mix differences.
5. Mark each difference with drift class, evidence level, risk, owner, and next action.
6. Create decision records for approved exceptions.
7. Create remediation items for risky drift.
8. Propose baseline updates only when a repeated beneficial pattern is confirmed.

## High-risk drift examples

- Global noindex unexpectedly enabled.
- Important content type excluded from search appearance or sitemap.
- Product categories noindexed despite being key landing pages.
- Product tags indexed without content strategy.
- Media attachment URLs enabled without a clear media SEO strategy.
- Organisation schema identity differs from approved business identity.
- Sitemap includes low-value internal content or excludes commercial pages.
- Robots.txt blocks resources or sections needed for discovery.
- Canonicals point to old URLs after migration.
- WooCommerce product schema lacks required commercial data because product data is incomplete.

## Low-risk or expected drift examples

- Publisher sites intentionally keep author archives indexable.
- Small business sites noindex thin tag archives.
- Catalogue sites use enquiry-led product page metadata rather than transactional language.
- Multilingual sites use plugin-specific hreflang/canonical handling.
- Local sites use location-specific schema or contact-page emphasis.

## Output requirements

Use `templates/yoast-defaults-drift-report.md` when the main deliverable is baseline comparison. Use `templates/yoast-remediation-backlog.md` when the user wants implementation tasks.

Every drift item should include:

- Baseline source.
- Current evidence source.
- Drift class.
- Risk level.
- Owner route.
- Recommended action.
- QA method.
- Whether a decision record is required.
