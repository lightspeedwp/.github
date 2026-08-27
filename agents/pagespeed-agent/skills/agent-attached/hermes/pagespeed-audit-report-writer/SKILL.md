---
name: pagespeed-audit-report-writer
description: turn pagespeed, lighthouse, core web vitals, speed-test, or website-performance audit findings into consistent client-ready reports. use when the user provides measured audit evidence, screenshots, pasted findings, page urls with supplied results, csv/export summaries, before-after notes, or asks for a google doc report, client summary, prioritised performance findings, quick wins, developer-facing performance handoff, or multi-page pagespeed audit write-up. supports single-page and multi-page audits, stakeholder-friendly and developer-friendly tone, and google drive document creation workflows without inventing metrics or unsupported evidence.
---

# PageSpeed Audit Report Writer

## Purpose

Turn PageSpeed, Lighthouse, Core Web Vitals, or related performance audit evidence into a clear, client-ready report that can be pasted into or created as a Google Doc.

The report must be practical, evidence-led, and easy for non-technical stakeholders to understand, while still giving developers enough detail to act.

## Inputs Expected

Work from the evidence the user provides. Useful inputs include:

- Client name, website URL, audit date, target pages, and project context.
- PageSpeed Insights, Lighthouse, WebPageTest, CrUX, Search Console, or browser trace findings.
- Measured metrics such as performance score, LCP, INP, CLS, TTFB, FCP, TBT, Speed Index, page weight, request count, and screenshots.
- Device/network context, such as mobile or desktop, throttling profile, location, test run count, and tool version.
- User goals, such as lead generation, ecommerce conversion, SEO readiness, accessibility, or launch QA.
- Audience preference, such as stakeholder-friendly, developer-friendly, executive summary only, or implementation handoff.
- Optional before/after findings or previous audit baseline.

If the user asks for a Google Doc and the Google Drive or Docs connector is available, create or update the document using the connector workflow. If a native document cannot be created, provide a clean Markdown report body that is ready to paste into Google Docs.

## Workflow

1. **Confirm the report mode from available context.** Choose stakeholder-friendly by default for client-ready reports. Choose developer-friendly when the user asks for engineering notes, implementation detail, tickets, or handoff content.
2. **Inventory the evidence.** Separate measured facts from assumptions, likely causes, and recommendations. Do not convert qualitative notes into exact metrics.
3. **Group findings by effort and priority.** Use Quick Wins, Medium-Effort Improvements, and Larger Engineering Work. Put urgent high-impact findings near the top even if they require more effort.
4. **Write the report in the standard structure.** Include every required section. Include Before / After Comparison only when baseline and follow-up evidence exist or the user explicitly asks for a placeholder.
5. **Use repeatable finding blocks.** Every finding must include symptom, why it matters, likely cause, evidence, recommended fix, and priority.
6. **Flag gaps clearly.** If evidence is incomplete, say what is missing and how that limits confidence.
7. **Prepare for Google Docs.** Use clear headings, short paragraphs, simple tables, and copy-paste-safe Markdown. Avoid dense nested bullets.

## Standard Report Structure

Use this structure unless the user supplies a stronger template.

1. **Title**
   - Format: `PageSpeed Audit Report: [Client or Website]`
   - Include audit date and audited URL or page list when provided.

2. **Executive Summary**
   - Summarise the overall performance position in plain language.
   - Mention the most important risks and the most useful next actions.
   - Do not include a score or metric unless it was supplied.

3. **Client Context**
   - Explain the site, business goal, page type, audience, and why performance matters for this client.
   - If context is missing, keep this section short and label assumptions clearly.

4. **Prioritized Findings**
   - Start with the highest-impact findings across all audited pages.
   - For multi-page audits, include affected page names or URLs in each finding.
   - Use the repeatable finding block.

5. **Quick Wins**
   - Low-risk actions that are usually faster to implement.
   - Examples may include image compression, removing unused embeds, reducing plugin bloat, deferring non-critical scripts, cache configuration checks, and font-loading improvements.
   - Only include items supported by evidence from the audit.

6. **Medium-Effort Improvements**
   - Changes that need planning, testing, theme work, plugin review, or content/editorial coordination.
   - Examples may include template adjustments, lazy-loading strategy, CSS clean-up, script management, CDN/cache rules, third-party tag review, and above-the-fold layout optimisation.

7. **Larger Engineering Work**
   - Work that may require deeper development, infrastructure changes, architectural review, or staged rollout.
   - Examples may include server response optimisation, critical rendering path refactors, WooCommerce performance changes, query optimisation, block/theme restructuring, and complex JavaScript reduction.

8. **Limitations**
   - State what the audit can and cannot prove.
   - Include missing test details, single-run limits, lab-vs-field caveats, unknown hosting constraints, unavailable analytics, or pages not tested.

9. **Before / After Comparison** *(optional)*
   - Include only when baseline and follow-up measurements are provided.
   - Do not infer improvement percentages unless both values are supplied.
   - Use a compact table with page, metric, before, after, change, and notes.

10. **Recommended Next Steps**
    - End with 3 to 6 practical next actions.
    - Split into review, implementation, validation, and reporting steps when helpful.

## Repeatable Finding Block

Use this format for every major finding:

```markdown
### Finding: [Clear finding title]

**Affected page(s):** [Page names or URLs, if known]  
**Priority:** [High / Medium / Low]  
**Effort:** [Quick win / Medium effort / Larger engineering work]  

**Symptom:** [What was observed in the audit.]  
**Why it matters:** [Business, user-experience, SEO, conversion, or maintainability impact.]  
**Likely cause:** [Careful cause wording. Use “likely” unless proven.]  
**Evidence:** [Measured metric, audit note, screenshot reference, tool output, or user-provided observation.]  
**Recommended fix:** [Practical action, owner direction, and validation method where useful.]
```

Rules for finding blocks:

- Keep each field brief but complete.
- Use `Likely cause` rather than `Cause` unless the source evidence proves the root cause.
- Use `Evidence not provided` only when the section is still useful and the missing evidence is explicitly acknowledged.
- Do not use vague priorities without reason. High means meaningful user, conversion, SEO, launch, or stability risk.

## Priority and Effort Guidance

Use priority to express impact and urgency. Use effort to express implementation complexity.

| Priority | Use When |
|---|---|
| High | Evidence suggests a major user-experience, conversion, SEO, launch, accessibility-adjacent, or reliability risk. |
| Medium | The issue affects quality or speed but is not the largest blocker. |
| Low | The issue is minor, speculative, cosmetic, or best handled after larger bottlenecks. |

| Effort | Use When |
|---|---|
| Quick win | The fix is low risk, limited in scope, and likely reversible. |
| Medium effort | The fix needs development, plugin/theme review, QA, or coordinated content changes. |
| Larger engineering work | The fix needs architecture, infrastructure, custom development, complex WooCommerce work, or staged rollout. |

## Incomplete Evidence Rules

Never invent or imply audit evidence. Use these rules when inputs are incomplete:

- If no metrics are supplied, write a qualitative report and state that no measured PageSpeed values were provided.
- If only screenshots or summaries are supplied, cite them as observations rather than exact measurements.
- If only one page is audited, do not claim the whole website has the same issue.
- If only lab data is provided, do not claim real-user field performance improved or declined.
- If no before/after data exists, omit the comparison section or include a clearly labelled `Not assessed` note if the user requested the section.
- If tool settings are unknown, add a limitation such as: `The report is based on the supplied audit output. Test location, device profile, run count, and throttling settings were not provided.`
- If evidence conflicts, show both values, label the source of each, and avoid choosing one unless the user supplied a preferred source of truth.
- If a recommendation depends on unverified implementation details, use cautious wording such as `Review whether...`, `Check for...`, or `Likely next step...`.

## Tone and Audience Rules

Adapt wording to the audience preference when provided.

### Stakeholder-Friendly Reports

Use for clients, account managers, executives, and non-technical stakeholders.

- Lead with business impact: user experience, enquiries, ecommerce conversion, SEO, launch readiness, and trust.
- Explain technical issues in plain language.
- Avoid acronyms unless the report immediately explains them.
- Keep recommendations outcome-focused and practical.
- Use softer confidence wording where evidence is incomplete.

Example wording:

- `Large files are making the page slower to load, especially on mobile connections.`
- `This can make visitors wait longer before they can read or interact with the page.`
- `The next step is to compress and resize the largest images, then retest the page.`

### Developer-Friendly Reports

Use for developers, technical leads, implementation handoffs, and ticket creation.

- Include affected assets, templates, plugins, scripts, render-blocking resources, network behaviour, and validation steps when supplied.
- Keep business impact, but make the fix path more specific.
- Include test conditions and acceptance checks where possible.
- Do not prescribe code-level fixes unless the evidence supports them.

Example wording:

- `Review the hero image source dimensions and generated responsive sizes. Confirm the browser is not downloading an oversized desktop image on mobile.`
- `Validation: rerun Lighthouse mobile after the image change and confirm LCP improves without layout shift regression.`

## Multi-Page Audit Rules

For multi-page audits:

- Include an audit scope table listing each page, URL, page type, device, and supplied metric summary where available.
- Group findings that repeat across pages into one shared finding with an `Affected page(s)` list.
- Call out page-specific blockers separately when one page has a distinct issue.
- Avoid averaging scores unless the source data includes a valid average or the user asks for a simple internal summary. If calculating an average from supplied values, label it as a simple average, not a PageSpeed metric.
- Use page types to make recommendations clearer, such as homepage, product page, category page, blog post, checkout, landing page, or template.

## Google Doc Output Guidance

When creating a Google Doc:

- Use the report title as the document title.
- Use heading levels that map cleanly to Google Docs headings.
- Use small tables for scope, findings summary, and before/after comparison.
- Keep finding blocks readable; avoid over-nesting.
- Add placeholders only when the user explicitly wants a reusable template. Otherwise, omit empty sections and explain missing evidence in Limitations.
- Do not add raw tool dumps into the main report. Put raw evidence in an appendix only if the user asks or if it is short and useful.

Suggested Google Doc flow:

1. Draft the report body in Markdown first.
2. If using a Google Docs connector, create the document with the final title and structured content.
3. If creating from a DOCX or Markdown-to-Doc workflow, preserve headings, tables, and finding blocks.
4. Return the document link plus a brief note about any evidence limitations.

## Output Contract

Return one of these output types based on the user's request:

### Client-Ready Report

Return a complete report using the standard structure. Include clear sections, prioritised findings, and next steps. This is the default.

### Google Doc Creation Result

Return the Google Doc link, title, and a short summary of what was included. Mention evidence gaps only if they materially affect confidence.

### Report Outline or Template

Return a reusable structure with placeholders only when the user asks for a template or when evidence is too incomplete for a real report.

### Developer Handoff

Return a technical implementation summary with findings, likely owners, validation checks, and ticket-ready notes. Preserve the evidence rules.

## Quality Checklist

Before finalising, check that:

- The report does not invent metrics, URLs, devices, dates, causes, or improvements.
- Every major finding has symptom, why it matters, likely cause, evidence, recommended fix, and priority.
- Findings are grouped into Quick Wins, Medium-Effort Improvements, or Larger Engineering Work.
- The Executive Summary is understandable without technical background.
- The Limitations section makes missing or uncertain evidence clear.
- Before/after claims are supported by before/after evidence.
- Single-page findings are not presented as whole-site conclusions.
- Multi-page repeated issues are consolidated where sensible.
- The final output is suitable for Google Docs or includes a created document link when requested.

---

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*
