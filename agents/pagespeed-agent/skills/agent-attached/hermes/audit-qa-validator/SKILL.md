---
name: audit-qa-validator
description: review drafted pagespeed, lighthouse, core web vitals, web performance, or website speed audit reports before delivery. use when a user provides a draft audit, client-ready performance report, developer handoff, re-audit summary, or performance findings document and asks for qa, validation, gap checking, consistency review, evidence review, delivery readiness, or revision suggestions. checks required sections, weak evidence, unsupported claims, invented metrics, recommendation priority, missing client context, missing limitations, and structure. returns concrete revision actions rather than generic feedback.
---

# Audit QA Validator

## Purpose

Review drafted PageSpeed, Lighthouse, Core Web Vitals, or website performance audit reports before delivery. Act as a strict but helpful QA reviewer: identify what is ready, what is risky, what is missing, and exactly how to revise it.

This skill validates the quality of an existing audit draft. It does not run a fresh PageSpeed audit, invent missing metrics, or replace the audit writer workflow.

## Core Workflow

1. Identify the audit type and intended audience.
   - Client summary
   - Developer handoff
   - Re-audit comparison
   - Multi-page performance report
   - Quick findings summary

2. Check the report against the required-section checklist.

3. Validate evidence discipline.
   - Confirm every metric, claim, comparison, and priority is supported by supplied evidence.
   - Separate observed evidence from likely causes and recommendations.
   - Flag invented or over-precise values immediately.

4. Review prioritisation and actionability.
   - Confirm recommendations are ranked by impact, effort, confidence, and client/business importance.
   - Confirm each recommendation has a concrete next action.

5. Return a QA review with severity-labelled issues and specific revision suggestions.

## Required Report Sections Checklist

Use this as the default checklist. Mark sections as `Present`, `Partial`, `Missing`, or `Not applicable`.

### 1. Audit Context

Check for:

- Client or site name.
- Audited URL or page group.
- Audit date or evidence date.
- Device context, especially mobile versus desktop.
- Tool/source context, such as PageSpeed Insights, Lighthouse, CrUX, WebPageTest, GTmetrix, or supplied screenshots.
- Intended audience, such as client, developer, internal team, or stakeholder summary.

Flag issues when:

- The report discusses performance without naming the page or page group.
- The report mixes mobile and desktop results without labelling them.
- The report does not say whether the metrics came from lab data, field data, screenshots, exports, or notes.

### 2. Scope and Limitations

Check for:

- Pages tested and pages not tested.
- Whether results are single-run, repeated, lab-only, field-data-backed, or screenshot-only.
- Known limits, such as no staging access, no waterfall, no plugin list, no hosting access, no before/after baseline, or no production verification.
- Clear language where findings are likely causes rather than proven causes.

Flag issues when:

- The report implies site-wide conclusions from one page without saying so.
- The report presents diagnostic guesses as confirmed facts.
- The report omits limitations that could affect delivery confidence.

### 3. Executive Summary

Check for:

- A short plain-language summary of the overall performance state.
- Clear distinction between urgent blockers, important improvements, and lower-priority polish.
- Client-safe wording that avoids alarmist claims unless evidence supports them.

Flag issues when:

- The summary is just a list of diagnostics.
- The summary overpromises results, such as guaranteeing a score improvement.
- The summary does not explain why the findings matter to users or the business.

### 4. Evidence Summary

Check for:

- Reported metrics, with source and context.
- Findings tied to supplied diagnostics or observations.
- Clear page-level evidence for multi-page audits.
- Before/after evidence for re-audits or comparisons.

Flag issues when:

- Metrics appear without source, date, device, or page context.
- Claimed deltas are not supported by prior and current values.
- The report includes precise numbers that were not supplied.

### 5. Findings

Check for:

- Findings are grouped logically, such as Core Web Vitals, render-blocking assets, JavaScript, CSS, images, fonts, third-party scripts, server response, caching, or WordPress/plugin/theme causes.
- Each finding includes evidence, impact, confidence, and affected pages where applicable.
- WordPress-specific causes are phrased carefully when not directly proven.

Flag issues when:

- Findings repeat the same diagnostic under different headings.
- Findings include generic best practices without tying them to the audit.
- Findings state exact root causes without direct evidence.

### 6. Prioritised Recommendations

Check for:

- Recommendations are ranked or grouped by priority.
- Priority is explained using user impact, implementation effort, business importance, and evidence confidence.
- Quick wins are separated from medium-effort improvements and larger engineering work.
- Each recommendation says what to change, where to check, and what evidence supports it.

Flag issues when:

- The report gives a flat list of recommendations with no priority order.
- High-effort work is listed before low-risk, high-impact fixes without explanation.
- Recommendations are too broad, such as `optimise images` with no affected image types, pages, or next step.

### 7. Developer Handoff Quality

Check for:

- Developer-facing actions are specific enough to execute.
- WordPress plugin/theme/asset notes are separated from confirmed diagnostics.
- Dependencies and risks are called out.
- Acceptance or retest guidance is included where needed.

Flag issues when:

- The report tells developers to fix a category without naming files, asset types, plugins, templates, or test areas when available.
- The report lacks retest steps.
- The report mixes client language and developer instructions in a confusing way.

### 8. Delivery Readiness

Check for:

- A clear conclusion such as ready, ready with minor edits, needs revision, or not ready.
- Missing inputs and next actions are listed.
- The report has consistent structure, tone, terminology, and heading levels.

Flag issues when:

- The report feels like pasted raw tool output.
- The structure makes it hard to see what matters first.
- The next step is unclear.

## Severity Levels

Use these severity levels for every issue found.

### Critical

Use when the audit should not be delivered until fixed.

Examples:

- Invented metrics, invented deltas, or unsupported score changes.
- Missing audit scope or tested URL/page context.
- Claims that could mislead the client about cause, impact, or guaranteed outcome.
- Re-audit comparison without prior and current evidence.
- Recommendations that could cause risky implementation work without adequate context.

### High

Use when the audit is materially weaker or risky, but the core report may still be salvageable.

Examples:

- Weak evidence for important findings.
- No limitations section despite obvious evidence gaps.
- Unclear priority order for recommendations.
- Major client context missing, such as business goal, target pages, or audience.
- Findings grouped poorly enough that implementation planning would be difficult.

### Medium

Use when the report is understandable but needs improvement before it feels polished or useful.

Examples:

- Generic recommendations that need affected pages or examples.
- Repeated findings across sections.
- Missing retest guidance.
- Inconsistent terminology, such as mixing `LCP image`, `hero image`, and `largest element` without connection.
- Client summary is too technical or developer handoff is too vague.

### Low

Use for polish issues that should be fixed but do not block delivery.

Examples:

- Minor heading inconsistency.
- Slightly wordy explanation.
- Formatting issue.
- Small missing label where context is otherwise clear.

## Evidence Validation Rules

Follow these rules strictly.

1. Treat supplied audit evidence as the only source of truth unless the user explicitly asks for fresh research or live checking.

2. Do not infer exact metrics from screenshots, vague notes, or common PageSpeed patterns. If a value is not supplied, mark it as missing.

3. Do not invent:
   - Performance scores.
   - Core Web Vitals values.
   - Before/after changes.
   - Asset sizes.
   - Request counts.
   - Plugin names.
   - Hosting causes.
   - Revenue, conversion, or SEO impact.

4. Label confidence clearly:
   - `Observed` when the draft is supported by supplied metrics, diagnostics, screenshots, exports, or trace notes.
   - `Likely` when the claim is a reasonable interpretation but not directly proven.
   - `Unverified` when the claim needs more evidence before delivery.

5. Require page/device/source context for metrics. A metric without page, device, and source context is incomplete.

6. For comparisons, require both baseline and current evidence. If only one side is supplied, flag the comparison as unsupported.

7. For WordPress-specific root causes, require evidence such as plugin names, theme asset handles, source URLs, waterfall entries, page markup, code references, or admin context. Without this, phrase root causes as likely investigation paths.

8. For recommendations, require a direct link to at least one finding. A recommendation without a matching finding is a content gap.

## Rules for Handling Incomplete Audits

When the audit draft is incomplete, do not fill the gaps with assumptions. Return a readiness judgement and the smallest useful set of missing inputs.

Use this decision path:

1. If key evidence is missing but the report can still be reviewed structurally, continue the QA review and mark evidence gaps clearly.
2. If the report lacks the tested URL, page group, or any audit evidence, mark it `Not ready for QA` and request the missing minimum inputs.
3. If the report includes conclusions but no supporting metrics or diagnostics, mark those conclusions as unsupported.
4. If the user only supplies rough findings, review them as a draft outline rather than a final audit.
5. If a section is not applicable to the requested report type, mark it `Not applicable` rather than forcing it into the draft.

Minimum inputs for a delivery-ready QA review:

- Draft audit text.
- Audited URL or page group.
- Source evidence or clear notes for metrics and diagnostics.
- Intended audience or delivery format.
- Whether the audit is a first audit or re-audit.

## Recommended Output Format

Return the review in this structure unless the user requests a different format.

```markdown
# PageSpeed Audit QA Review

## Overall Readiness
**Status:** [Ready / Ready with minor edits / Needs revision / Not ready]
**Summary:** [2-4 sentences explaining the readiness judgement]

## Required Section Check
| Section | Status | Notes |
|---|---|---|
| Audit context | Present/Partial/Missing/Not applicable | ... |
| Scope and limitations | Present/Partial/Missing/Not applicable | ... |
| Executive summary | Present/Partial/Missing/Not applicable | ... |
| Evidence summary | Present/Partial/Missing/Not applicable | ... |
| Findings | Present/Partial/Missing/Not applicable | ... |
| Prioritised recommendations | Present/Partial/Missing/Not applicable | ... |
| Developer handoff quality | Present/Partial/Missing/Not applicable | ... |
| Delivery readiness | Present/Partial/Missing/Not applicable | ... |

## Issues Found
### Critical
- **Issue:** ...
  **Why it matters:** ...
  **Revision:** ...

### High
- **Issue:** ...
  **Why it matters:** ...
  **Revision:** ...

### Medium
- **Issue:** ...
  **Why it matters:** ...
  **Revision:** ...

### Low
- **Issue:** ...
  **Why it matters:** ...
  **Revision:** ...

## Evidence Validation Notes
- [Metric/claim] — [Observed/Likely/Unverified] — [what supports it or what is missing]

## Prioritisation Review
- **Works well:** ...
- **Needs revision:** ...
- **Suggested priority structure:** ...

## Suggested Revisions
1. [Concrete edit to make]
2. [Concrete edit to make]
3. [Concrete edit to make]

## Suggested Replacement Wording
Use replacement wording only for risky or unclear passages.

**Original:** ...
**Replace with:** ...
```

## Suggested Revision Format

Make revision suggestions concrete and copy-editable. Prefer this format:

```markdown
**Problem:** [Specific problem in the draft]
**Risk:** [Why it weakens delivery]
**Fix:** [Exact edit, section move, missing evidence request, or replacement wording]
**Severity:** [Critical/High/Medium/Low]
```

Good revision suggestions:

- Add a `Scope and limitations` section after the executive summary that says the audit covers the supplied homepage mobile PageSpeed export only.
- Change `the plugin is causing render-blocking JavaScript` to `the supplied diagnostics show render-blocking JavaScript; plugin or theme assets should be checked before assigning cause`.
- Move image optimisation above advanced JavaScript refactoring because the draft shows image-related LCP evidence and this is likely lower risk to implement.

Weak revision suggestions to avoid:

- Improve evidence.
- Make this clearer.
- Add more detail.
- Rework priorities.

## Quality Bar

A QA pass should make the audit safer and easier to revise. Always prefer specific, evidence-backed feedback over broad editorial notes. If the draft is mostly sound, say so and focus on the few changes that would improve delivery confidence.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
