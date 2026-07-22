---
name: pagespeed-audit-prioritizer
description: rank pagespeed, lighthouse, core web vitals, web performance, seo performance, and mobile speed audit findings into consistent priorities. use when the user provides pagespeed insights exports, lighthouse reports, web.dev diagnostics, gtmetrix-style findings, audit notes, client website context, or asks what performance fixes to do first. prioritizes by likely user impact, implementation effort, business importance, and evidence confidence; separates quick wins, medium-effort improvements, and larger engineering work; explains reasoning for technical and non-technical audiences without overstating certainty.
---

# Pagespeed Audit Prioritizer

## Purpose

Rank PageSpeed and related web performance findings into a clear, defensible recommendation list. Prioritize practical action over raw tool order. Use the audit evidence, business context, and implementation effort to explain what should be fixed first and why.

## Workflow

1. Identify the available evidence:
   - audit source: PageSpeed Insights, Lighthouse, Core Web Vitals field data, lab report, manual notes, or mixed evidence
   - affected URLs or templates: home page, product page, post, landing page, checkout, site-wide pattern, plugin asset, theme asset, hosting layer
   - device context: mobile, desktop, or both
   - business context: lead generation, SEO, mobile conversion, ecommerce checkout, paid traffic, content publishing, accessibility, or brand trust
   - constraints: budget, launch urgency, access to code, hosting control, plugin limits, stakeholder appetite
2. Normalize each finding into one line with: finding, affected area, evidence, likely user impact, likely fix path, effort band, business importance, confidence, and priority.
3. Score each finding using the priority rubric below.
4. Group recommendations into quick wins, medium-effort improvements, and larger engineering work.
5. Explain priority decisions in plain language first, with optional technical detail where useful.
6. Call out evidence gaps and avoid presenting estimates as certainty.

## Priority rubric

Use P0 to P4. If evidence is incomplete, lower confidence before lowering priority unless the likely risk is severe.

| Priority | Meaning | Use when | Typical action |
|---|---|---|---|
| P0 - Critical | Directly blocks revenue, leads, indexing, or core user journeys | A performance issue affects checkout, lead forms, booking flow, mobile usability, indexability, or a launch go/no-go decision | Fix before launch or before lower-priority work |
| P1 - High | Large likely user or SEO impact with reasonable evidence | The issue affects LCP, INP, CLS, TTFB, render-blocking resources, main-thread work, mobile conversion, or high-traffic templates | Plan into the next implementation cycle |
| P2 - Medium | Worth doing, but impact is moderate or context-dependent | The finding improves speed, stability, or maintainability but does not obviously block conversion or SEO | Bundle with related theme, plugin, or content work |
| P3 - Low | Nice-to-have or limited visible benefit | The issue affects a low-traffic page, small savings, desktop-only polish, or a minor diagnostic | Defer unless quick or already touching the area |
| P4 - Watch / No action yet | Not enough evidence or not worth changing now | The tool flags an item but impact is unclear, the fix is risky, or field data does not support urgency | Monitor, retest, or gather evidence first |

### Scoring guidance

Score each dimension from 1 to 5, then use judgement rather than a rigid total.

| Dimension | 1 | 3 | 5 |
|---|---|---|---|
| User impact | Hardly noticeable | Some users feel delay or layout movement | Clearly hurts speed, stability, or task completion |
| Business importance | Low-traffic or internal page | Important content or standard template | Lead, checkout, booking, SEO, paid traffic, or mobile-first journey |
| Evidence strength | Single lab warning only | Lab data plus visible issue or repeated audit signal | Field data, repeated tests, affected key templates, or real user complaints |
| Effort fit | Very high effort for unclear gain | Moderate effort for moderate gain | Low effort for meaningful gain |
| Risk reduction | Cosmetic cleanup | Reduces performance debt | Reduces launch, revenue, SEO, accessibility, or operational risk |

Recommended ordering logic:

1. Promote items that affect mobile, above-the-fold experience, conversion paths, crawl/indexation, or site-wide templates.
2. Promote low-effort fixes with credible impact, especially if they affect many pages.
3. Demote findings that are technically correct but have tiny savings, low-traffic exposure, or high regression risk.
4. Do not rank by PageSpeed's displayed order alone. Rank by likely outcome for the website and business.

## Effort bands

Use these effort bands consistently. Adjust only when the user provides project-specific estimates.

| Effort band | Meaning | Typical examples |
|---|---|---|
| Quick win | Usually small, low-risk, and suitable for the next maintenance pass | image compression, obvious unused plugin asset removal, font-display adjustment, lazy-loading below-fold images, cache setting tweak, preloading a known hero image |
| Medium effort | Needs developer review, theme/plugin changes, QA, or coordination | critical CSS refinement, reducing render-blocking CSS/JS, replacing heavy embeds, improving responsive image generation, cleaning block/theme asset loading, optimising templates |
| Larger engineering work | Architectural, risky, cross-system, or requires deeper testing | hosting or CDN migration, major plugin replacement, JavaScript architecture changes, checkout performance refactor, database/query optimisation, custom caching strategy |
| Investigate first | Do not estimate as a fix yet | conflicting lab and field data, unknown third-party script owner, suspected hosting issue without server evidence, intermittent TTFB spikes |

## Confidence guidance

Use confidence separately from priority.

| Confidence | Use when | Wording guidance |
|---|---|---|
| High | Multiple evidence points agree, affected area is clear, and fix path is known | State the recommendation directly and explain the trade-off |
| Medium | Evidence is credible but incomplete, or impact depends on template traffic/business priority | Use likely, probably, or expected; state what would confirm it |
| Low | Single audit signal, unclear affected URLs, unknown implementation path, or possible false positive | Recommend investigation or retesting before implementation |

Always mention confidence when:

- the report is lab-only without field data
- the URL/page importance is unknown
- the fix may require plugin/theme/hosting changes not yet inspected
- third-party scripts are involved
- the apparent saving is small or volatile

Avoid wording such as guaranteed, definitely, massive improvement, or will fix conversion unless the user provided strong supporting evidence.

## Business context modifiers

Apply these modifiers when context is available:

- Lead generation: prioritize form pages, landing pages, above-the-fold LCP, mobile usability, and any script that delays CTA interaction.
- SEO: prioritize Core Web Vitals, crawlable/indexable templates, article/category/product archives, structured content pages, and site-wide template performance.
- Mobile conversion: prioritize mobile LCP, INP, layout stability, image sizing, font loading, sticky UI behaviour, and checkout or enquiry friction.
- Ecommerce: prioritize product, cart, checkout, account, payment, shipping, and product archive templates before informational pages.
- Paid traffic: prioritize landing pages, ad destination URLs, consent/banner delays, tag loading, and first interaction delay.
- Publishing/content: prioritize article templates, ad/analytics script impact, image handling, infinite scroll, and content layout stability.
- Launch readiness: prioritize blockers, broad regressions, high-traffic templates, and low-risk fixes that reduce visible defects quickly.

If business context is not available, state the assumption used. Default assumption: prioritize mobile user experience, Core Web Vitals, and site-wide template impact.

## Ranking examples

### Example 1: render-blocking CSS on the home page

Input finding: eliminate render-blocking resources; mobile LCP is poor; home page is the main lead-generation landing page.

Recommended ranking: P1 - High, medium effort, medium confidence.

Why: the finding affects the first visible load on a key business page, so it can influence enquiries and SEO. It is not automatically a quick win because critical CSS or asset-loading changes need developer review and regression testing.

### Example 2: oversized hero image on mobile

Input finding: properly size images; hero image is 1.8 MB on a mobile landing page.

Recommended ranking: P1 - High, quick win, high confidence.

Why: the issue is visible, affects above-the-fold mobile loading, and usually has a low-risk fix path through resizing, compression, responsive sources, or preload adjustment.

### Example 3: unused JavaScript from a plugin

Input finding: reduce unused JavaScript; plugin asset loads site-wide; unclear whether the plugin is required on the tested page.

Recommended ranking: P2 - Medium, medium effort, medium confidence.

Why: site-wide unused JavaScript can affect INP and main-thread work, but the fix may require conditional enqueue logic and QA to avoid breaking plugin behaviour.

### Example 4: third-party analytics script delay

Input finding: reduce third-party impact; analytics and ad scripts contribute blocking time; site relies on conversion tracking.

Recommended ranking: P2 - Medium or P1 - High depending on business context, investigate first or medium effort, low to medium confidence.

Why: third-party scripts can hurt performance, but they may be business-critical. Prioritize auditing consent, tag loading, and duplicate tags before removing anything.

### Example 5: serve images in next-gen formats on low-traffic blog posts

Input finding: serve images in next-gen formats; only affects old blog posts with low traffic.

Recommended ranking: P3 - Low, quick win if tooling exists, medium confidence.

Why: the fix is useful, but the business impact is limited unless those posts drive SEO traffic or conversions.

### Example 6: slow server response time across all tested URLs

Input finding: reduce initial server response time; TTFB is consistently slow on mobile and desktop across product and checkout URLs.

Recommended ranking: P1 - High or P0 - Critical if checkout is affected during launch, larger engineering work or investigate first, medium confidence.

Why: site-wide TTFB can limit every other performance improvement. The fix may involve caching, hosting, database, plugin, or CDN work, so gather server evidence before promising a fix.

## Output format

Use this structure by default. Keep it short for non-technical audiences and add technical notes only when useful.

```markdown
# Prioritized PageSpeed Recommendations

## Summary
[2-4 sentences: what matters most, what should happen first, key assumptions, and evidence limits.]

## Priority list
| Priority | Finding | Affected area | Effort | Confidence | Why this rank | Recommended next step |
|---|---|---|---|---|---|---|
| P1 - High | [finding] | [url/template/device] | [quick win/medium effort/larger engineering work/investigate first] | [high/medium/low] | [plain-language reasoning] | [specific next action] |

## Quick wins
- **[Finding]**: [why it is low-risk and worthwhile]. Next step: [action].

## Medium-effort improvements
- **[Finding]**: [why it needs developer/QA time]. Next step: [action].

## Larger engineering work
- **[Finding]**: [why it is bigger or riskier]. Next step: [investigation or implementation path].

## Evidence gaps and assumptions
- [missing data, unknown URL importance, missing field data, unknown plugin/hosting control, or retest needed]
```

For very small audits, collapse the grouped sections and provide only the summary, priority list, and evidence gaps.

## Audience adaptation

For non-technical users:

- explain the user/business effect first
- avoid implementation jargon unless needed
- use phrases like this may make the page feel slower or this can delay the first visible content
- keep next steps action-oriented

For technical users:

- include metric names such as LCP, INP, CLS, TTFB, TBT, render-blocking resources, critical CSS, enqueue strategy, caching, CDN, image pipeline, and main-thread work where relevant
- identify likely code, theme, plugin, CDN, or hosting ownership
- include QA and regression notes for medium and larger work

## Quality checks

Before finalising, verify that:

- every item has a priority, effort band, confidence level, and reason
- quick wins are genuinely low-risk and not hidden engineering projects
- high-priority items connect to user impact or business importance, not just tool severity
- incomplete evidence is called out clearly
- recommendations do not promise exact score gains unless the user supplied measured before/after evidence
- the output works for both a client/stakeholder and the person doing the implementation

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
