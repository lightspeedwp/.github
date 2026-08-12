---
name: reference-site-analysis
description: Inspect one or more website references and extract reusable structural, messaging, CTA, trust, and UX signals for briefs, page strategy, layout direction, and downstream handoffs. Use when the request includes reference URLs or asks what a site is doing well structurally before drafting a design or implementation artifact.
---

# Reference Site Analysis

## Overview

Use this skill when a website reference should inform a downstream artifact such as a design brief, page brief, layout direction, Figma-ready handoff, WordPress handoff, or execution packet.

The goal is not to write a generic site review. The goal is to turn reference sites into structured, reusable signals that improve downstream design and implementation work.

Prioritize extraction of:

- information architecture and page structure
- hierarchy and section sequencing
- CTA strategy and conversion paths
- trust signals and proof placement
- UX cues, friction reducers, and interaction patterns
- reusable design and content patterns worth carrying forward
- constraints, risks, or anti-patterns that should not be copied blindly

## Use This Skill When

Use `$reference-site-analysis` when the user asks to:

- analyze a website reference before creating a brief or handoff
- compare reference sites for page structure or conversion strategy
- extract section hierarchy, CTA placement, trust signals, or UX cues from a live website
- turn a reference URL into inputs for Figma, WordPress, implementation, or design planning work

Do not use this skill when:

- the user only wants a broad brand impression with no downstream artifact
- the request already has enough grounded structure and no website reference matters
- the task is to inspect a real Figma file instead of a website reference

## Inputs

Expect one or more of these inputs:

- a live website URL
- a homepage or page-specific reference URL
- a set of competitor or inspiration sites
- a stated downstream destination such as a page brief, design brief, layout direction, Figma handoff, or WordPress handoff
- optional context about audience, offer, project constraints, or what the user wants to learn from the reference

If the downstream destination is not explicit, infer the most likely immediate use from the surrounding request. If that remains unclear and it materially changes the output, ask one focused question.

## Workflow

1. Confirm the analysis target.
   - Identify which URL or URLs should be analyzed.
   - Note whether the user wants a single-site extraction or a comparison.
   - Note the downstream artifact this analysis should feed when it is known.

2. Inspect the site deeply enough to understand the page, not just the headline.
   - Review the homepage or referenced page first.
   - Capture navigation model, above-the-fold framing, section order, repeated modules, CTA placement, offer framing, proof strategy, and likely user journey.
   - Look for visible signals such as testimonials, metrics, logos, certifications, case studies, FAQ patterns, forms, sticky bars, chat prompts, pricing cues, comparison tables, and footer reinforcement.

3. Separate observation from recommendation.
   - First record what the site is doing.
   - Then state what is reusable, what is risky, and what should be adapted rather than copied.
   - Do not present assumptions about hidden business performance as facts.

4. Translate the site into reusable downstream signals.
   - Convert raw observations into named patterns such as hero framing, section sequence, CTA ladder, trust architecture, objection handling, content density, and conversion flow.
   - Call out which patterns are strongest for the user's likely use case.
   - If multiple references are supplied, compare them by function rather than by taste alone.

5. Adapt to the downstream artifact.
   - For a brief: emphasize structure, messaging hierarchy, CTA logic, trust placement, and design cues.
   - For a Figma-ready handoff: emphasize layout, section anatomy, repeated pattern types, content density, and reusable interaction cues.
   - For a WordPress handoff: emphasize section modularity, repeated block patterns, content model implications, navigation needs, proof modules, and likely pattern/template structure.
   - For execution planning: emphasize what should be preserved, changed, de-risked, or validated before production.

6. Keep the output compact but evidence-rich.
   - Prefer a structured analysis over a narrative essay.
   - Quote or paraphrase only the minimum needed to support key findings.
   - If the site cannot be fully inspected, say what was visible and limit confidence accordingly.

## Output Contract

Default to this structure unless the user explicitly asks for another format:

### Reference Site Analysis

- **Target**
- **Likely use in current workflow**
- **High-level positioning signal**
- **Structure and hierarchy**
- **CTA pattern**
- **Trust signals**
- **UX cues and interaction patterns**
- **Reusable patterns to carry forward**
- **Risks or caveats**
- **How this should influence the downstream artifact**

For comparisons, add:

- **Where each reference is strongest**
- **Patterns to combine**
- **Patterns to avoid mixing**

## Analysis Rules

- Do not confuse visual polish with structural strength.
- Do not treat every visible pattern as worth copying.
- Prefer structural and conversion-relevant findings over subjective aesthetic commentary.
- Call out when a strong pattern depends on a different offer, audience, funnel stage, or traffic source.
- When a reference is weak or inconsistent, extract only the useful pieces instead of forcing a positive summary.
- When the site contains trust claims, describe the trust mechanism and placement rather than asserting the claims are true.
- If the user supplied several references, synthesize them into a usable recommendation instead of producing isolated mini-reviews unless the user explicitly wants separate breakdowns.

## Supporting Files

- `references/output-template.md` — use this template when the downstream artifact benefits from a consistent analysis shape or when comparing multiple reference sites.

## Example Request Shapes

### Request shape 1

"Analyze this competitor homepage and pull out the best structural ideas for a service-page brief."

Success criteria:

- identifies section order and hierarchy clearly
- extracts CTA logic and trust placement
- converts findings into inputs usable in a page brief

### Request shape 2

"Compare these three reference sites and tell me what patterns we should borrow for a WordPress handoff."

Success criteria:

- compares the references by structure and conversion function
- highlights reusable block or section patterns
- distinguishes strong ideas from ideas that only fit one site's context

### Request shape 3

"Use this inspiration site to guide a Figma-ready handoff for our new landing page."

Success criteria:

- translates the site into layout and pattern cues
- preserves only reusable elements rather than copying blindly
- produces handoff-relevant signals, not just design commentary

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
