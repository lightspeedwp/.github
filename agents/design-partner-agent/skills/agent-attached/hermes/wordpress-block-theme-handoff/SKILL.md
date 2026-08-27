---
name: wordpress-block-theme-handoff
description: This skill helps convert approved design briefs and layouts into practical WordPress block-theme handoffs, ensuring clear implementation guidance for developers. Use this skill when your project moves beyond visual exploration to mapping layouts into templates, patterns, and theme settings, facilitating effective collaboration and minimizing ambiguity in the build process.
---

# WordPress Block Theme Handoff

## When To Use

Use this skill when the request is no longer about exploring visual directions and is now about translating an approved concept into a build-ready WordPress block-theme handoff.

Typical triggers:

- "turn this approved brief into a WordPress handoff"
- "map this page concept to patterns and templates"
- "convert this layout direction into block theme implementation notes"
- "tell me what belongs in templates, template parts, and theme.json"
- "prepare a developer handoff for a block theme build"

Do not use this skill for early-stage discovery, vague brainstorming, or purely visual ideation. If the brief or layout is still unclear, tighten the brief first before producing the implementation handoff.

## Goal

Convert an approved brief or layout direction into a practical implementation handoff that a WordPress block-theme builder or developer can act on with minimal ambiguity.

The handoff should bridge design intent and block-theme reality by:

- preserving the approved content hierarchy and layout logic
- mapping reusable structures to patterns and template parts
- identifying page-level template needs
- surfacing global style decisions that belong in `theme.json`
- calling out any parts that likely need custom code, plugin support, or a design compromise

## Required Inputs

Work from whatever approved source is available, such as:

- a finalized design brief
- an approved layout direction
- a page structure or wireframe description
- a Figma-ready handoff or section list
- related implementation constraints from repo context or project notes

If some details are missing but the structure is already clear enough, proceed with the smallest reasonable assumptions and label them explicitly.

## Workflow

1. Confirm the implementation target.
   - Identify the page or asset being built.
   - Identify whether the handoff is for a single page, a reusable page family, or a broader theme system.
   - Note the required outcome: implementation notes, developer handoff, or block-theme build plan.

2. Extract the approved structure.
   - Pull out the page goal, audience, core message, required sections, CTA logic, and responsive intent.
   - Separate confirmed requirements from inferred implementation assumptions.

3. Map the design to block-theme building blocks.
   - Decide what should be represented as:
     - templates
     - template parts
     - patterns
     - reusable blocks or block variations
     - global styles or settings in `theme.json`
   - Prefer reusable system decisions over one-off page instructions.

4. Define section-by-section implementation guidance.
   - For each major section, describe:
     - purpose
     - recommended block structure
     - content needs
     - responsive behavior
     - reuse potential
     - implementation caveats

5. Identify global style decisions.
   - Pull out typography, spacing, color, layout-width, and style-token decisions that belong in `theme.json` rather than per-page overrides.
   - Distinguish clearly between global defaults and local exceptions.

6. Flag implementation risk.
   - Call out any part of the design that may be awkward in a standard block-theme workflow.
   - For each risky item, say whether it should be simplified, custom-coded, plugin-assisted, or treated as a non-block-theme exception.

7. Produce the final handoff in the required format below.

## Decision Rules

### Patterns

Use a pattern when a section or composition is likely to be reused across pages, campaigns, or content entries.

Good pattern candidates usually include:

- hero variants
- testimonial bands
- feature grids
- CTA strips
- pricing or comparison sections
- repeated editorial or landing-page section layouts

### Templates

Use a template when the structure governs a whole page type or content type, such as:

- front page
- landing page
- single post or single case study
- archive
- page template for a recurring layout family

### Template Parts

Use a template part for shared chrome or repeated framing elements, such as:

- header
- footer
- global announcement bar
- reusable sidebar shell
- shared post-header region

Do not force ordinary reusable sections into template parts when patterns are a better fit.

### theme.json

Put decisions into `theme.json` when they are truly part of the theme-wide system, such as:

- color tokens
- typography scale
- spacing scale
- layout widths
- global block style defaults
- button or heading defaults

Do not push page-specific layout exceptions into `theme.json` unless they reflect a real system rule.

## Output Format

Produce a Markdown handoff with these sections, in this order:

### 1. Implementation Summary

Provide a short summary of:

- what is being built
- what source was used
- any explicit assumptions
- the overall implementation approach

### 2. Template Strategy

List the recommended template or templates and explain what each one controls.

### 3. Template Parts

List the recommended template parts and explain when each is shared versus page-specific.

### 4. Pattern Plan

Create a table with these columns:

- Pattern name
- Purpose
- Reuse scope
- Recommended blocks
- Notes

### 5. Section-by-Section Build Notes

For each major section, include:

- section name
- purpose
- content structure
- recommended blocks
- mobile/responsive notes
- reuse recommendation
- implementation caveats

### 6. theme.json Guidance

Group the guidance under:

- Colors
- Typography
- Spacing and layout
- Block defaults
- Exceptions

### 7. Risks and Exceptions

List anything that may need:

- custom code
- plugin support
- fallback behavior
- design simplification

### 8. Build Order

End with a short ordered build sequence showing the most sensible implementation order.

## Quality Bar

The output must be:

- implementation-aware rather than decorative
- specific enough for a builder or developer to act on
- aligned to standard block-theme patterns when possible
- explicit about assumptions and exceptions
- organized for handoff, not for brainstorming

## Style Rules

- Be concrete and decisive.
- Use WordPress block-theme terms accurately.
- Prefer reusable architecture over page-specific patchwork.
- Avoid pretending that visually complex custom interactions are native block-theme features when they are not.
- Do not describe a section only in visual terms; always connect it to structure and implementation.

## Example Request Shapes

### Request Shape 1

Input:

"Convert this approved homepage layout direction into a WordPress block-theme handoff."

Success looks like:

- a homepage template recommendation
- shared header/footer guidance
- reusable section patterns
- section-by-section build notes
- `theme.json` recommendations
- implementation risks called out clearly

### Request Shape 2

Input:

"Map this service page brief to patterns, template parts, and theme.json decisions."

Success looks like:

- the brief translated into WordPress implementation structure
- reusable versus page-specific decisions clearly separated
- system-level style choices distinguished from local exceptions

### Request Shape 3

Input:

"Take this Figma-ready landing page handoff and turn it into a block theme build plan."

Success looks like:

- the layout converted into templates, patterns, and block structures
- responsive and reuse guidance preserved
- any likely custom-code requirements surfaced early

---

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
