---
name: wordpress-audit-reporting
description: Use when the user wants a WordPress audit summary, launch-readiness report, implementation status summary, evidence-led findings review, or a concise handoff that turns gathered site findings into a consistent structure with confirmed items, gaps, risks, blockers, and next actions.
---

# WordPress Audit Reporting

Use this skill when the request is primarily about turning WordPress findings into a clean, client-ready or team-ready report.

This skill is for reporting and synthesis, not for doing the inspection itself. Apply it after the relevant findings, evidence, and limits are already known from direct inspection, prior steps in the run, attached files, or the user's supplied notes.

## When To Use

Use this skill when the user asks for any of the following:

- a WordPress audit summary
- a launch-readiness or pre-launch summary
- a concise implementation status report
- a structured findings handoff for a client, PM, QA reviewer, or developer
- a report that separates confirmed evidence from inferred issues and manual follow-up

Do not use this skill for:

- broad WordPress planning with no findings yet
- direct site changes or implementation work
- content architecture outputs that should use the separate structural blueprint format
- Gravity Forms plans that should stay in the form-planning structure

## Inputs To Gather Before Writing

Before drafting the report, identify:

1. what was directly checked or observed
2. what was inferred but not fully confirmed
3. what remains unverified because direct access, scope, or time was limited
4. whether the context is staging, production, or unspecified
5. whether the audience is internal, client-facing, or mixed

If the evidence is thin or mixed-quality, still produce the report, but label uncertainty clearly instead of smoothing it over.

## Core Workflow

### 1. Classify the reporting request

Determine which reporting shape best fits the request:

- **Audit summary**: broad site review across settings, plugins, structure, forms, SEO, QA, and readiness
- **Launch-readiness summary**: emphasize go-live risks, blockers, and manual checks before release
- **Implementation summary**: emphasize what was completed, what is pending, and what needs follow-up
- **Focused findings report**: emphasize one area such as SEO, forms, accessibility, or plugin configuration

Then scale the level of detail to the request. Use a concise summary unless the user explicitly wants a fuller report.

### 2. Normalize the findings

Convert raw notes into these evidence buckets before writing:

- **Confirmed**: directly observed from site state, files, connected tools, or explicit user-provided evidence
- **Inferred**: likely true from partial evidence, but not fully verified
- **Unverified**: not checked, unavailable, out of scope, or requires manual validation

Never present inferred or unverified items as confirmed.

### 3. Prioritize what matters

Prioritize public-facing and launch-sensitive issues first. In most WordPress reports, give more weight to:

- homepage and key landing pages
- contact, enquiry, and conversion forms
- SEO visibility and metadata posture
- broken or missing core configuration
- launch blockers, legal/compliance gaps, and QA risks
- environment-specific issues that must change at go-live

De-emphasize internal utility objects, niche plugin settings, or speculative improvements unless the user asked for deep detail.

### 4. Write the report in the required structure

For audit summaries, launch-readiness summaries, and similar findings reports, use these exact section headings:

- `Confirmed Items`
- `Missing or Unverified Items`
- `Risks`
- `Blockers`
- `Recommended Next Actions`
- `Manual Checks Before Go-Live`

Section rules:

- Put only directly supported findings in **Confirmed Items**.
- Put gaps, unknowns, and items needing verification in **Missing or Unverified Items**.
- Put adverse outcomes or consequences in **Risks**, not the raw issue itself.
- Put only true stop-ship or decision-blocking items in **Blockers**.
- Put concrete, ordered actions in **Recommended Next Actions**.
- Put human validation steps that still need a manual pass in **Manual Checks Before Go-Live**.

If a section would be empty, say `None identified from the available evidence.` rather than omitting the section.

### 5. Keep the language evidence-led

When a finding depends on confidence level, use language like:

- `Confirmed:` for direct evidence
- `Likely:` for reasoned inference
- `Not verified:` when direct confirmation is missing

Do not overuse labels on every bullet if the section meaning already makes the status obvious. Use them where they prevent ambiguity.

### 6. End with the shortest useful action path

In **Recommended Next Actions**, prefer 3 to 7 actions, ordered by impact and dependency.

When relevant, separate:

- immediate fixes before launch
- important follow-up after launch
- optional improvements

## Writing Rules

- Be specific about WordPress configuration, plugin posture, forms, metadata, templates, and QA implications.
- Prefer practical implementation language over generic audit prose.
- Keep the report concise unless the user asked for a detailed handoff.
- If the request is client-facing, keep the tone calm and action-oriented rather than overly technical.
- If the request is internal, include tighter operational wording where useful.
- Call out staging-safe settings that are acceptable now but must change at launch.
- When the evidence comes from a partial sample, say so explicitly.

## Output Template

Use this structure for the final response:

### Confirmed Items

- ...

### Missing or Unverified Items

- ...

### Risks

- ...

### Blockers

- ...

### Recommended Next Actions

1. ...
2. ...

### Manual Checks Before Go-Live

- ...

## Example Request Shapes

### Example 1

**User request:**
Create a pre-launch summary for this WordPress website based on the findings so far.

**Expected behavior:**

- produce the six required sections
- emphasize launch-sensitive findings first
- separate confirmed findings from assumptions
- include a short, ordered action list

### Example 2

**User request:**
Turn these WordPress audit notes into a client-ready summary.

**Expected behavior:**

- clean up raw notes without inventing evidence
- soften jargon where possible
- keep blockers and risks separate
- preserve any important unknowns as unverified items

### Example 3

**User request:**
Summarize the implementation work completed on the staging site and what still needs manual QA.

**Expected behavior:**

- focus on completed versus pending work
- retain the same section structure where it still fits
- treat remaining QA as manual checks or next actions, not as completed work

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
