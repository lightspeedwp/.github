---
file_type: documentation
title: Markdown Output Format Guide
scope: default-formatting
status: active
compliance: required
---

# Markdown output format guide

Use this guide as the default packaging standard for substantial outputs unless a stricter specialist workflow or template overrides it.

The document wrapper in this guide is mandatory for review-style, claim-register-style, planning, readiness, source-review, and “what should happen next” outputs. If the wrapper is missing or malformed, the output is incomplete and must be reformatted before delivery.

---

## Core document structure

- Begin substantial outputs with YAML frontmatter.
- Open the frontmatter with `---` on its own line.
- Close the frontmatter with a second `---` on its own line before the `#` main heading.
- Place one `#` main heading immediately below the frontmatter.
- Use the top-level heading that matches the output type, such as `# Website review` for review outputs or `# Claim register` for claim-review handoffs.
- Use `##` for each main section.
- Use `###` only for true subsections inside a main section.
- Insert a horizontal divider line `---` before every main section after the first.
- Insert one final horizontal divider line `---` at the bottom of the document.

---

## Mandatory compliance checks

Before final delivery, confirm all of the following:

- frontmatter is present above the main heading
- frontmatter both opens and closes correctly
- there is exactly one `#` main heading
- the `#` heading matches the output type
- every later main section is separated by `---`
- the document ends with a final `---`
- the section hierarchy uses `##` and `###` correctly
- the recommendation sections use only plain-language workflow naming

If any of these checks fail, reformat the output before returning it.

---

## Heading rules

- Use sentence-case headings.
- Do not skip heading levels.
- Do not use bold text as a substitute for headings.
- Keep heading names short, readable, and specific to the workflow.

---

## Paragraphs and bullets

- Use short paragraphs for summary, framing, or recommendations.
- Use bullets for grouped findings, actions, gaps, options, or examples.
- Keep one consistent structure within each section instead of loosely mixing prose, labels, and bullets.
- Order grouped bullets by priority or workflow sequence.

---

## Emphasis and naming rules

- Use **bold** only for short high-signal emphasis or compact labels.
- Use *italics* only for light qualifiers or nuance.
- Do not over-style summary paragraphs.
- Prefer headings and structure over visual emphasis.
- In review-style and claim-register-style outputs, do not use internal workflow names unless the user explicitly asks for the exact label.
- In review-style and claim-register-style outputs, use plain editorial workflow descriptions instead of internal names, skill names, routing labels, or hyphenated internal identifiers.

---

## Source and wording rules

- Refer to sources in human-readable terms.
- Avoid internal-environment wording such as `workspace`, `local`, or similar system-facing phrasing.
- Prefer clear editorial wording over process-heavy internal shorthand.

---

## Review-style and claim-register-style default shape

For review, readiness, planning, and claim-review outputs, use the matching template with this wrapper order:

1. YAML frontmatter with correct opening and closing lines
2. `#` main heading matching the output type
3. short prose summary when useful
4. the required `##` sections from the matched template
5. final divider line

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
