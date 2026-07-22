---
name: pagespeed-intake-normalizer
description: normalize mixed pagespeed, lighthouse, core web vitals, and website performance audit inputs into a standard internal audit brief. use when a user provides urls, page lists, sitemap urls, pagespeed insights links, lighthouse details, pasted metrics, screenshots, raw audit notes, or client context and needs the inputs cleaned, classified, and made ready for downstream audit, prioritisation, comparison, wordpress diagnosis, or report-writing workflows without creating a long intake process.
---

# Pagespeed Intake Normalizer

## Purpose

Normalize messy or mixed performance-audit inputs into a compact internal audit brief that downstream audit skills can use safely. Preserve evidence, separate assumptions from facts, and ask only for missing information that blocks the next audit step.

## Accepted Input Types

Accept any combination of:

- Website URLs, single page URLs, staging URLs, production URLs, or competitor/reference URLs.
- Page lists, page groups, priority pages, templates, funnels, or sitemap URLs.
- PageSpeed Insights URLs, Lighthouse report details, Core Web Vitals notes, web.dev diagnostics, GTmetrix-style findings, waterfall notes, DevTools observations, or pasted metrics.
- Screenshots of metrics, opportunities, diagnostics, waterfalls, filmstrips, layout shifts, or client notes.
- Client notes about goals, platforms, deadlines, launch context, user journeys, business priorities, known constraints, or previous optimisation work.
- Previous audit snippets when the current task is only to normalize intake before a later comparison.

Do not require all input types. Work with whatever is present.

## Normalization Workflow

1. **Identify the audit request type**
   - Label as `single-page audit`, `multi-page audit`, `site-wide audit`, `re-audit intake`, `wordpress performance diagnosis intake`, `report-writing intake`, or `unclear but usable`.
   - If the request can proceed with a reasonable default, proceed instead of asking a broad intake question.

2. **Classify sources**
   - Separate measured evidence from user notes, screenshots, inferred context, and assumptions.
   - Preserve exact URLs, metric labels, device context, dates, and tool names when provided.
   - Mark evidence as `supplied`, `linked but not extracted`, `screenshot-only`, `pasted`, or `missing`.

3. **Separate durable context from run-specific inputs**
   - Durable client context includes client name, domain, platform/CMS, hosting constraints, business priorities, recurring page groups, standing reporting preferences, and known implementation constraints.
   - Run-specific inputs include current URLs tested, current PSI/Lighthouse results, screenshot metrics, audit date, test device, test location, network throttling, specific notes for this audit run, and one-off launch deadlines.
   - Do not save durable context unless a memory workflow or user request explicitly requires it.

4. **Normalize pages and scope**
   - Group pages by purpose when possible: homepage, landing page, product/shop, category/archive, checkout/cart, blog/article, destination/tour, form/lead generation, account area, other.
   - Flag unknown page purpose rather than inventing it.
   - If only a domain or sitemap is supplied, create a suggested sampling scope and mark it as proposed.

5. **Normalize metrics and findings**
   - Capture provided metrics exactly, including units and labels: performance score, LCP, INP, CLS, FCP, TBT, Speed Index, TTFB, transfer size, request count, mobile/desktop, field/lab distinction, and diagnostic names.
   - Do not invent missing metric values or calculate deltas from incomplete evidence.
   - Convert vague notes into audit-ready observations only when the source supports them.

6. **Assess readiness**
   - Mark the brief as `ready`, `partially ready`, or `blocked`.
   - `ready` means enough scope and evidence exist for the requested next step.
   - `partially ready` means the audit can proceed with stated assumptions.
   - `blocked` means one or two essentials are missing and must be requested.

7. **Route next step**
   - Recommend the most relevant downstream workflow, such as report writing, prioritisation, comparison, wordpress diagnosis, QA validation, or client/site context management.
   - Do not perform the downstream audit unless the user asked for that deliverable as well.

## Required vs Optional Fields

### Required to Proceed

Require only the minimum needed for the current request:

- **Audit target:** at least one URL, domain, sitemap URL, PSI/Lighthouse link, or pasted audit result tied to a page.
- **Intended next step:** enough intent to know whether to prepare for audit, compare, prioritise, diagnose, or write a report. Infer this from the user request when obvious.
- **Scope boundary:** one of `single page`, `selected pages`, `site-wide sample`, `re-audit`, or `unknown but workable`.
- **Evidence source:** at least one supplied, linked, pasted, or screenshot-based source, unless the task is only to create a blank intake brief.

### Optional but Helpful

Capture these when present, but do not block on them:

- Client name and stakeholder audience.
- CMS/platform, theme, plugins, hosting/CDN/cache stack, and third-party services.
- Device focus, region, network assumptions, or target market.
- Business goal, conversion priority, launch date, or campaign context.
- Previous audit date or baseline for comparisons.
- Reporting tone: client-facing, internal, developer handoff, executive summary, or quick triage.
- Known exclusions, constraints, or areas not to test.

## Concise Follow-Up Question Rules

Ask follow-up questions only when missing information blocks a useful brief.

- Ask no more than 1-3 questions at once.
- Prefer multiple-choice questions when possible.
- Ask for the smallest missing item, not a full discovery form.
- Do not ask for data already supplied in the conversation.
- If a reasonable assumption allows progress, state the assumption and proceed.
- If only optional fields are missing, do not ask; mark them as optional gaps.
- If the user provided many mixed inputs, normalize first and ask questions at the end.
- If screenshots are mentioned but not available in the conversation, ask for the screenshot only if it is the primary evidence source.

Use concise wording such as:

- `I can normalise this now. The only blocker is the audit target URL or PSI link.`
- `To route this correctly, is this a new audit, a re-audit, or a developer handoff?`
- `I can proceed with a site-wide sample. Which pages are highest priority: homepage, shop/product, checkout, blog, or lead-gen pages?`

## Standard Output Brief Structure

Return the normalized brief in this structure unless the user requests another format:

```markdown
# Normalized PageSpeed Audit Brief

## 1. Audit Request Summary
- Request type:
- Readiness: ready | partially ready | blocked
- Intended next workflow:
- Main assumption, if any:

## 2. Audit Targets
| Page or Source | URL / Reference | Page Type | Priority | Status |
|---|---|---|---|---|

## 3. Supplied Evidence
| Evidence | Source Type | Device / Context | Metrics or Notes Captured | Confidence |
|---|---|---|---|---|

## 4. Run-Specific Audit Inputs
- Current test URLs:
- Current metrics/findings:
- Date/context supplied:
- Tool/source supplied:
- Known exclusions:

## 5. Durable Client or Site Context
- Client/site:
- Platform/CMS:
- Hosting/CDN/cache notes:
- Business priorities:
- Recurring constraints:
- Memory candidate: yes | no | ask first

## 6. Missing Essentials
- Blocking questions:
- Optional gaps:

## 7. Proposed Scope and Page Grouping
- Included pages/page groups:
- Proposed sample, if needed:
- Out of scope / unknown:

## 8. Normalized Metrics and Findings
| Page | Metric / Finding | Value or Detail | Source | Notes |
|---|---|---|---|---|

## 9. Next Best Action
- Recommended downstream skill/workflow:
- Why:
- Immediate next step:
```

## Quality Rules

- Keep the brief concise and operational, not client-polished unless requested.
- Never invent scores, timings, URLs, page purposes, field data, or root causes.
- Keep `observed`, `reported by client`, `likely`, and `unknown` clearly separate.
- Preserve metric units exactly: milliseconds, seconds, score, requests, kB/MB, or percentile labels.
- For comparisons, do not claim improvement or regression without comparable before/after evidence.
- For WordPress diagnosis intake, flag likely areas to inspect, but do not present them as confirmed causes.
- Prefer a usable partially-ready brief over a long intake questionnaire.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
