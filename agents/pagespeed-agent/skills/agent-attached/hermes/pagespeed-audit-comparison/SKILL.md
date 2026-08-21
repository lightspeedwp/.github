---
name: pagespeed-audit-comparison
description: compare current pagespeed, lighthouse, core web vitals, speed-test, or website-performance audit findings with a previous audit to produce concise before/after summaries. use when the user provides a current audit plus prior audit evidence, asks for a re-audit comparison, wants improved/regressed/unresolved issues identified, needs changed priorities explained, or needs page-level or site-level historical performance comparison without inventing unsupported metric deltas.
---

# Pagespeed Audit Comparison

## Purpose

Compare a current PageSpeed or website-performance audit with a previous audit and produce a concise, decision-useful before/after summary. Focus on what changed, what still matters, and what should be prioritised next.

Use this skill for page-level and site-level re-audits. Do not use it for a first audit with no historical context unless the user explicitly wants a comparison-ready baseline template.

## Required Inputs

Ask for missing required inputs only when the task cannot be completed from the conversation or attached/source material.

Required:

- **Current audit evidence:** current findings, screenshots, reports, exports, page URLs with supplied results, Core Web Vitals notes, Lighthouse/PageSpeed findings, or manually pasted results.
- **Previous audit context:** prior findings, previous report, old issue list, historic metrics, baseline notes, earlier recommendations, or implementation notes that explain what was meant to be fixed.
- **Comparison scope:** page-level, multi-page, template-level, or site-level comparison.

## Optional Inputs

Use optional inputs when available, but do not block the comparison if they are missing:

- Previous and current test dates.
- Tested URLs, device mode, network/profile, location, tool version, or lab/field data source.
- Priority labels from either audit.
- Client or stakeholder audience.
- Known changes made between audits.
- Developer notes, tickets, PRs, hosting changes, plugin changes, image optimisation notes, cache/CDN changes, or launch notes.
- Desired output format: client summary, internal QA note, developer handoff, or report section.

## Comparison Workflow

1. **Confirm the comparison frame**
   - State whether the comparison is page-level, site-level, template-level, or mixed.
   - Identify the current evidence and historical evidence being compared.
   - Note major evidence limits, such as missing dates, different test tools, different page sets, or field data versus lab data.

2. **Normalise findings before comparing**
   - Group similar findings under stable issue themes, such as image weight, unused JavaScript, render-blocking resources, server response time, layout shift, font loading, caching, third-party scripts, LCP element, or accessibility-adjacent performance issues.
   - Treat renamed but equivalent findings as the same issue when the underlying cause appears unchanged.
   - Keep page-specific findings attached to their page or template when that distinction matters.

3. **Classify each finding**
   Assign each issue one comparison status:
   - **Improved:** evidence shows the issue is reduced, resolved, deprioritised, or less severe.
   - **Regressed:** evidence shows the issue is worse, newly more severe, or affects more pages.
   - **Persistent:** the issue appears in both audits and remains material.
   - **New:** the issue appears in the current audit but not in the previous audit.
   - **Resolved:** the issue appeared previously and is not present in the current evidence.
   - **Unclear:** evidence is insufficient, inconsistent, or not comparable.

4. **Assess priority movement**
   - Compare top priorities from the previous audit against the current audit.
   - Say whether the top priorities changed, stayed broadly the same, or cannot be confirmed.
   - Explain priority movement using observed evidence, not assumptions.
   - Highlight whether a previously secondary issue has become a top priority, or whether a previous top priority appears resolved or deprioritised.

5. **Separate new issues from persistent issues**
   - Call out issues that are newly introduced in the current audit.
   - Call out persistent issues that were already known and still need action.
   - Do not merge new and persistent issues in the same recommendation unless the remediation path is genuinely shared.

6. **Summarise impact and next decisions**
   - Keep the conclusion focused on what the team should do next.
   - Prefer practical next actions over long diagnostic explanation.
   - If data quality is weak, recommend what evidence is needed before making stronger claims.

## Output Structure

Use this structure unless the user requests another format.

```markdown
## PageSpeed Audit Comparison

### Scope and Evidence
- Current audit: [source/date/pages if known]
- Previous audit: [source/date/pages if known]
- Comparison confidence: High / Medium / Low
- Notes: [limits affecting comparison]

### Executive Summary
[3-5 bullets covering the most important before/after changes, top priority movement, and decision point.]

### What Improved
| Area | Previous position | Current position | Status | Notes |
|---|---|---|---|---|

### What Regressed or Is New
| Area | Previous position | Current position | Status | Notes |
|---|---|---|---|---|

### What Remains Unresolved
| Area | Why it still matters | Pages/templates affected | Next action |
|---|---|---|---|

### Priority Movement
| Previous priority | Current priority | Changed? | Reason |
|---|---|---|---|

### Recommended Next Actions
1. [Highest-value action]
2. [Second action]
3. [Third action]

### Evidence Gaps
- [Only include if relevant]
```

For very small comparisons, condense the output into:

- **Improved**
- **Regressed/new**
- **Persistent**
- **Priority change**
- **Next action**

## Rules for Missing or Partial Historical Context

- Do not invent previous metrics, prior findings, fixes, dates, tested pages, tool settings, or implementation history.
- Do not claim exact quantitative change unless both comparable old and new values are available.
- Use wording such as “appears improved”, “likely persistent”, “not comparable”, or “cannot confirm” when evidence is incomplete.
- If only the previous recommendation exists, compare against whether the current audit still shows that issue, not against an assumed old score.
- If only scores are available, avoid root-cause claims unless supporting findings are also available.
- If old and new tests used different tools, devices, locations, or page sets, make the comparison directional rather than exact.
- If field data and lab data conflict, state the conflict and avoid collapsing them into one verdict.
- If a previous issue is absent from the current evidence, classify it as **resolved** only when the current evidence is broad enough to support that conclusion; otherwise classify it as **not seen in current evidence** or **unclear**.
- If a current issue was not mentioned previously, classify it as **new in the current audit evidence**, not definitely newly introduced, unless implementation history supports that claim.
- Keep “evidence gaps” short and actionable.

## Comparison Language Rules

Use cautious, clear wording:

- Say “improved from the previous audit evidence” instead of “fixed” unless resolution is proven.
- Say “regressed in the current audit evidence” instead of “got worse” when test conditions differ.
- Say “top priority appears unchanged” when the same issue remains highest-impact.
- Say “priority changed because…” only when the evidence supports the reason.

Avoid:

- Unavailable percentage changes.
- Unsupported score deltas.
- Overstating causality.
- Long generic PageSpeed explanations.
- Mixing client-safe conclusions with internal-only speculation unless labelled.

## Quality Checklist

Before responding, verify that the comparison:

- Separates improved, regressed, persistent, resolved, new, and unclear items.
- States whether top priorities changed.
- Distinguishes newly observed issues from persistent issues.
- Avoids exact quantitative claims without comparable data.
- Works at the requested page/site/template level.
- Ends with clear next actions.

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
