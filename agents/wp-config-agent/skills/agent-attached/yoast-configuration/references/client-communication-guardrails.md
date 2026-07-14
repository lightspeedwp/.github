# Client communication guardrails

Use this file when converting internal Yoast audit, configuration, troubleshooting, research, or developer notes into client-facing language.

## Tone

- Use plain UK English.
- Be direct about risks without sounding alarmist.
- Focus on configuration quality, validation, maintainability, and the next practical action.
- Avoid jargon unless the client has asked for technical detail.
- Keep unsupported or unverified items as caveats, not conclusions.

## Claims to avoid

Do not promise or imply:

- Rankings will improve.
- Google will index a page faster.
- Rich results will appear.
- Structured data guarantees search enhancements.
- llms.txt improves Google rankings.
- AI-assisted metadata is safe to publish without human review.
- Yoast settings alone fix content quality, site architecture, crawl budget, product-data quality, or migration risk.

## Safer phrasing

| Internal wording | Client-safe wording |
|---|---|
| `research target` | This source still needs to be checked before we treat it as current evidence. |
| `needs live verification` | We should confirm this in the current site/admin output before making the change. |
| `schema validity is not rich-result guarantee` | This can help make the page data clearer, but Google decides whether to show enhanced results. |
| `canonical/noindex conflict` | The page is sending mixed signals about which URL should be indexed. |
| `sitemap/indexation mismatch` | The site may be asking search engines to discover a URL that is not meant to be indexed. |
| `unsupported product claim` | We need a current product-source check before relying on that feature commercially. |

## Required client-safe sections

For client-facing Yoast outputs include:

1. What was checked or configured.
2. Why it matters.
3. What is confirmed.
4. What still needs verification.
5. Recommended action.
6. Risk if skipped.
7. Owner or approval needed.
8. Validation plan.

## Internal-to-client filtering

Keep internal details out unless they help the client decide:

- Do not include raw developer filter names unless the client needs implementation-level detail.
- Do not include long source-register tables in a client summary.
- Do not include weak evidence except as a reason to verify before deciding.
- Do not include speculative causes as facts.
- Do include the smallest decision the client needs to approve.

## Maintenance

Update this file when a client misunderstanding recurs, when legal/SEO caveats change, or when templates are revised.
