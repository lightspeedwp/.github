---
version: 1.5.0
last_updated: 2026-06-09
---

# Skill 01 — Analyse input

## Purpose

Determine exactly what is being audited and which accessibility dimensions are relevant.
This sets the scope for everything that follows.

## Audit mode detection

Before analysing the input, determine which mode to activate. Declare the mode immediately.

**Quick Scan** — activate when the user's request is:

- A criterion-specific question: "does this pass contrast?", "check the focus ring", "is this label accessible?", "quick check on this button"
- A yes/no question about a single element against a known criterion
- Uses phrases: "quick scan", "quick check", "just check", "does this pass", "is this accessible"
- Input is a single isolated element with a clear criterion implied

**Full Audit** (default) — activate when:

- The request is open-ended: "audit this", "accessibility review", "run a full audit", "check this page"
- No specific criterion is named
- Input is a full page, component set, or multi-element artefact
- When ambiguous, default to Full Audit and note: "Running a full audit — say 'quick scan' if you only want a targeted check."

**Declare the mode at the start of your response:**

- Quick Scan: > "**Quick Scan mode** — running a targeted check on [criterion/element]. This is not a full WCAG 2.2 AA audit."
- Full Audit: > "**Full Audit mode** — running the complete 5-step WCAG 2.2 AA audit."

**Routing after mode declaration:**

- Quick Scan: proceed to the DS intake prompt, then go **directly to Skill 03** (skip Skill 02 and the Step 2 pause)
- Full Audit: proceed to the DS intake prompt, then proceed to Skill 02 as normal
- Re-audit: proceed to audit log lookup, then proceed to DS intake, then **produce the visual diff** (see Visual diff protocol below), then go **directly to Skill 03** using the prior criteria set

---

## Re-audit mode detection

Check for re-audit intent **before** the audit mode detection step above. If re-audit is detected, it overrides both Quick Scan and Full Audit routing.

**Detect re-audit when the user:**

| Signal type | Examples |
|-------------|---------|
| Explicit keyword | "re-audit this", "run a re-audit", "follow-up audit" |
| Follow-up intent | "check if the fixes landed", "after fixes audit", "run the audit again", "did they fix it?" |
| Updated artefact with context | Provides new screenshot/URL + says "updated", "after changes", "fixed version", "v2", "revised" |
| Prior audit reference | Mentions a subject slug ("re-audit HomepageHero"), "same component as before", "the one we audited last time" |

**When re-audit is detected:**

1. **Declare re-audit mode:**
   > "**Re-audit mode** — running a follow-up evaluation and score comparison for [subject]."

2. **Load the prior audit entry:**

   ```bash
   cat reports/accessibility-audits/audit-log.json 2>/dev/null || echo "[]"
   ```

   Search the array for the most recent entry matching the subject by `id` (exact PascalCase match first, then fuzzy match on artefact description).

3. **If prior entry found:** store it in audit context as `priorAudit`. Record `priorAudit.criteriaIds` — Skill 03 will evaluate against this same criteria set. After completing DS intake, produce the visual diff (see **Visual diff protocol** section below) before proceeding to Skill 03.

4. **If no prior entry found:**
   > "No prior audit found for '[subject]' in `audit-log.json`. I'll run a Full Audit instead and record the result so future re-audits are possible."
   Fall back to Full Audit mode. Continue from the DS intake prompt below.

5. **If `audit-log.json` does not exist:** treat as no prior entry — fall back to Full Audit mode.

---

## Visual diff protocol (re-audit only)

This section runs **after** DS intake and **before** Skill 03 is announced. It is mandatory whenever `priorAudit` is present in audit context.

**Step 1 — Announce:**

> "Producing visual diff before evaluation."

**Step 2 — Produce the visual diff table:**

Compare the new artefact section-by-section against the prior audit description stored in `priorAudit`. Output a structured table with exactly four columns:

| Section | Prior State | Current State | Impact Flag |
|---------|-------------|---------------|-------------|
| Example: Hero | Dark background, white text, green CTA | Light background, dark text, green CTA | `contrast-recheck` |

**Impact Flag values** — assign exactly one per row:

| Flag | When to apply |
|------|---------------|
| `contrast-recheck` | The section's background colour or surface type changed between artefacts (e.g. dark → light, image-backed → solid colour) |
| `structure-recheck` | A new content section appeared, an existing section was removed, or the section was substantially restructured |
| `new-element` | A UI element is present that was absent from the prior audit scope (form, new component type, new interactive element) |
| `unchanged` | The section is visually identical to the prior artefact and no surrounding changes could affect it |
| `ambiguous` | The section cannot be clearly assessed as changed or unchanged from the new screenshot |

**Ambiguous rule:** Any section flagged `ambiguous` is treated as **changed** for all downstream risk purposes in Skill 03.

**New-element pass-through:** Each row flagged `new-element` must be passed to Skill 06 for inclusion in the `newElements` output field.

**Step 3 — Store and proceed:**

Store the completed diff table in audit context as `visualDiff`. **Skill 03 SHALL NOT begin until `visualDiff` is stored in audit context.**

Then announce Skill 03 and proceed immediately.

---

## Input types and how to handle each

**Screenshot or image file**
Read the image. Identify: layout type, background treatment (dark/light/mixed), all
interactive element types visible, content types (text, images, icons, charts, forms,
accordions, navigation), and any design system signals (class names, component styles,
token names visible in the screenshot context).

**URL (text only, no browser MCP)**
Ask the user to describe the page or paste its key HTML structure. Proceed on that
description. Note in the report: "Audit based on description — live code inspection
recommended."

**URL (browser/fetch MCP available)**
Fetch the URL. Read the page content. Extract: heading structure, link text, image alt
attributes, form labels, interactive element markup, and colour values where available.

Additionally, attempt to extract computed colour values for contrast evaluation (store as `knownColors` in audit context for Skill 03):

- For key text elements (body copy, headings, links, buttons, labels): extract computed `color` and `background-color`
- Convert any `rgb(r, g, b)` values to hex before storing
- If extraction fails or values are CSS variables that haven't resolved, skip — Skill 03 will fall back to estimation
- Record each as: `{ element: "body text", fg: "#505050", bg: "#FAFAFA" }`

**Component or page description (text)**
Accept the description as-is. Ask one clarifying question only if the artefact type is
genuinely ambiguous (e.g. unclear whether it is a full page or a single component).

**Design spec / Figma description**
Treat as a visual description. Note that code-level attributes (alt text, ARIA) cannot
be confirmed from a spec alone — mark those criteria as Warn rather than Pass or Fail.

## Design system intake

After identifying the artefact, ask the user one question before proceeding:

> "Please share the design system reference for this project — token list, style guide
> URL, or component library. If this is a LightSpeed project, just say 'LightSpeed DS'.
> If no design system is in use, say 'none' and I'll provide generic WCAG-compliant
> recommendations."

Based on the response, set the DS mode:

| Response | DS mode | Behaviour |
|----------|---------|-----------|
| "LightSpeed DS" or confirms LightSpeed project | `lightspeed` | Skill 04 uses `references/ls-ds-tokens.md` |
| Pastes tokens / describes DS / links style guide | `user-provided` | Skill 04 uses the provided reference |
| "none" / no response / skips | `generic` | Skill 04 uses generic CSS custom property patterns and WCAG-compliant hex values |

Record the DS mode and any provided reference content — these are passed to all downstream skills.

## What to determine and record

After analysing the input and completing the DS intake, record these facts internally
(you will use them in Skill 02 and Skill 04):

1. **Artefact type**: full page / single component / email template / PDF / native app screen / other
2. **Surface**: dark background / light background / mixed / unknown
3. **Interactive elements present**: list each type (button, link, accordion, modal, tab,
   carousel, dropdown, form input, etc.)
4. **Content types present**: body text / headings / images / icons / charts / tables /
   video / audio / animation
5. **DS mode**: `lightspeed` / `user-provided` / `generic` — and any reference content provided
6. **Audit depth**: visual-only / description-based / code-assisted (URL fetch)

Output a brief one-paragraph summary of what you are auditing, at what depth, and which
DS mode is active. Then proceed immediately to Skill 02.

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)
