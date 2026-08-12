---
version: 1.0.0
title: "Markdown Output Format Spec"
audience: "internal"
document_type: "format-spec"
status: "active"
language: "en-GB"
---

# Markdown Output Format Spec

Use this specification when producing reusable Markdown-source outputs for the LightSpeed AI Readiness Estimator.

## Core Rules

- Preserve valid Markdown source in the final visible output.
- Use UK English in visible output.
- Never surface local workspace paths, sandbox paths, temporary file locations, or markdown filenames as clickable links or user-usable URLs.
- If no real user-usable file or URL exists, show the content directly or use the approved source-preserving fallback format.

---

## Document Structure Rules

For polished Markdown documents:

1. Begin with YAML frontmatter.
2. Place exactly one empty line after the closing frontmatter delimiter.
3. Place the visible document title immediately after that empty line.
4. Follow the title with a short intro or framing paragraph.
5. Include a compact summary table near the top when the document benefits from fast scanning.
6. Add a divider line `---` after the intro block before the first main section.
7. Use a strict heading hierarchy:
   - `#` for the document title only
   - `##` for main sections
   - `###` for nested subsections only when needed
8. Add a divider line `---` between each main `##` section.
9. Add a closing divider line `---` after the final substantive content.

---

## Markdown Source Presentation Rules

When the user wants reusable Markdown source:

- Prefer a presentation format that keeps the final visible output compliant.
- If a plain fenced Markdown block can be shown without visible renderer-added attributes, it may be used.
- A compliant fenced block must:
  - open with exactly ````markdown
  - close with exactly ```
  - contain no ids, classes, metadata, annotations, or renderer-added attributes
- If the renderer adds visible block attributes, do not leave the output in a non-compliant fenced state.
- In that case, switch to the non-fenced fallback format.

---

## Non-Fenced Fallback Rules

Use the non-fenced fallback when fenced Markdown output would render with visible attributes or other non-compliant wrapper behaviour.

Fallback order:

1. Plain-text copied source section
2. Indented code-style text without language-tag fences

Fallback requirements:

- Preserve the full Markdown source cleanly.
- Keep YAML frontmatter at the top of the source.
- Do not introduce fake file links or file-download claims.
- Keep the source easy to copy and reuse.

---

## Framing Rules Around Markdown Source

Every Markdown-source response must include:

- a visible title before the source
- a short intro paragraph before the source
- a `## Next steps` heading after the source
- 2 to 3 concise bullets under `## Next steps`

The intro should explain what the source is, how it should be used, and whether the content is provisional, client-ready, internal, or template-only.

---

## Estimate-Specific Rules

For AI-readiness estimates, use this section order:

1. Assessment Summary
2. Recommended Base Package
3. Included Scope
4. Excluded Scope
5. Recommended Add-ons
6. Values Still Needed
7. Scope Risks / Custom-Scope Triggers
8. Next Step

Additional estimate rules:

- Choose the base package before evaluating add-ons.
- Default to **AI Readiness Foundation** when the evidence supports a baseline review route.
- Label assumptions, open questions, and risks clearly.
- Keep commercial confidence honest and evidence-led.

---

## Validation Checklist

Before returning a polished Markdown-source output, confirm that:

- frontmatter is present and valid
- the title appears in the correct place
- heading hierarchy is consistent
- divider lines are present where required
- the output includes the required title and intro before the source
- the output includes `## Next steps` and 2 to 3 bullets after the source
- no local paths or unusable URLs appear
- fenced Markdown is used only if it renders cleanly with no visible attributes
- the non-fenced fallback is used when fenced rendering would be non-compliant
- the source remains easy to copy and reuse

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
