---
name: lightspeed-website-content-generator-editable
description: Generate website-ready content drafts for LightSpeed WordPress, WooCommerce, publishing, tourism, AI-readiness, and governance projects using approved briefs, content collection outputs, voice and tone strategy, conversion-goal strategy, claim registers, stats intake, source-of-truth registers, and chatbot-safe content rules.
---

# LightSpeed Website Content Generator (Editable)

## Purpose

Generate website-ready content from approved planning artefacts and validated strategy inputs.

Use this skill after the project has enough strategic clarity on audience, conversion role, voice and tone, source authority, claim handling, and proof status.

## Core rule

Do not invent claims, statistics, case-study outcomes, pricing, guarantees, legal wording, compliance statements, or AI/ROI results.

If evidence is missing, either:

- rewrite cautiously as a capability or directional statement, or
- flag the item as `Evidence Required` in the review layer.

## Inputs to accept

Accept any combination of:

- page briefs
- content collection checklists
- source-of-truth registers
- claim registers
- approved stats lists
- FAQ intake outputs
- FAQ source libraries
- voice and tone strategy outputs
- conversion-goal strategy outputs
- existing website copy
- governance notes
- service or solution outlines
- case-study notes
- chatbot planning briefs
- launch audit notes

If the user has not provided enough source material, generate a safe outline and list missing inputs instead of pretending the content is final.

## Output types

Generate:

- homepage drafts
- service page drafts
- solution page drafts
- lifecycle or process page drafts
- company FAQ pages
- page-level FAQs
- CTA blocks
- meta titles and descriptions
- schema-ready FAQ answers
- case-study drafts
- policy page drafts
- chatbot-safe answer snippets
- complete content packs in Markdown

Use {{label:page-draft-template.md,id:69f93a4c5084819187a96cc055337b8e,type:file}} as the default output structure unless the user asks for a different format.

## Workflow

1. Identify the requested output type.
2. Identify available source material and approval status.
3. Check whether audience, conversion goal, and voice/tone defaults are already sufficient.
4. Check claim, evidence, FAQ, and stats rules.
5. Draft public-facing content in UK English.
6. Separate public-facing content from review notes.
7. Include SEO, schema, and internal-linking suggestions where relevant.
8. Mark the review status and chatbot-safe status.
9. Flag missing evidence, risky claims, unsupported FAQ answers, risky stats, and legal/privacy review needs.
10. Suggest the next content or governance step.

## FAQ and stats requirements

For every website page output:

- include a planning layer for exactly five FAQ slots
- mark which FAQs are intended for visible publication and which are hidden, deferred, or answered elsewhere
- treat claim-sensitive FAQ wording as requiring claim-register handling before final publication
- include a stats or proof layer when the page depends on quantified proof, trust signals, or numeric support
- never publish unsupported stats as if they are approved

## Structured section rules

When a page includes structured sections, use explicit section fields instead of loose paragraph blocks.

### Hero sections

- `Eyebrow:`
- `Title:`
- `Intro:`
- `Suggested support line:`
- `Primary CTA:`
- `Secondary CTA:`

### Stats sections

For each stat item use:

- figure
- title
- short explanation
- approval status
- evidence source

### FAQ sections

For each FAQ slot use:

- question
- answer
- internal link when useful
- publish status
- claim-sensitive yes or no
- claim-register action

### CTA sections

- `Title:`
- `Description:`
- `Primary CTA:`
- `Secondary CTA:`

## Quality standard

Outputs should be practical, structured, aligned to site objectives, and ready for human review. Avoid hype, generic agency language, unsupported guarantees, and vague AI promises.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
