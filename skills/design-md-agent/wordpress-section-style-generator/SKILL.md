---
name: wordpress-section-style-generator
description: create wordpress section styles, layout-zone styling guidance and reusable css or theme.json strategies for larger page sections in block themes. use when the user asks to define styling for hero areas, content bands, footers, feature sections or other reusable layout sections that span beyond a single block.
---

# WordPress Section Style Generator

## Purpose

Generate reusable styling strategies for larger layout sections in a WordPress block theme.

This skill creates:

- section-level styling guidance
- reusable CSS for layout zones
- `theme.json` guidance where block theme settings fit the need
- naming and structure guidance for reusable section treatments

It is for page bands and layout zones that extend beyond a single block style, while still staying more focused than full template generation.

## Trigger Conditions

Use this skill when the request is about:

- styling hero sections, feature bands, footers, callout areas, or other reusable sections
- defining a visual treatment shared across a type of page section
- generating CSS or `theme.json` guidance for section-level design treatments
- establishing reusable section naming and styling conventions in a block theme

Do not use this skill for:

- styling one specific block only
- building full templates
- generating full pattern files
- validation-only review work

Those belong to the relevant specialist skills.

## Inputs

Accept any mix of:

- section purpose or name
- visual description
- theme conventions
- layout constraints
- token or preset requirements
- CSS requirements
- Figma handoff notes
- repository examples

If naming or implementation direction is unclear, use `wordpress-asset-parameter-generator` behavior first and state assumptions.

## Fast Decision Flow

1. Identify the section type and reuse scope.
2. Decide the lightest fitting implementation:
   - section-level CSS guidance
   - `theme.json` settings guidance
   - a hybrid of presets plus scoped custom CSS
3. Normalize the section style name and related class naming if needed.
4. Generate the styling output.
5. Mark anything that should be reviewed by `wordpress-block-asset-validator`.

## Workflow

1. Inspect the request and capture confirmed facts.
2. Identify the section role:
   - hero
   - feature band
   - callout strip
   - footer zone
   - another reusable layout area
3. Normalize:
   - style name
   - related class naming when needed
   - token or preset references
4. Prefer native theme settings and presets before hardcoded values.
5. Generate:
   - CSS or `theme.json` guidance
   - usage notes
   - section naming guidance
6. Return assumptions and validation notes.

## Section Style Rules

- Keep section styles scoped to a reusable layout zone or page band.
- Prefer presets and existing theme tokens before hardcoded values.
- Use stable, readable section names.
- Use custom classes only when they materially help the section treatment.
- When custom classes are needed, BEM-style naming is acceptable if it improves clarity.
- Do not absorb full template composition into section-style work.
- Do not collapse single-block style requests into section-style outputs.

## Output Format

By default, return:

1. the section target
2. the section style name
3. CSS or `theme.json` guidance
4. usage notes
5. assumptions
6. validation notes

Example output shape:

````markdown
## Section target
Hero band

## Style definition
- Name: Soft Contrast Hero
- Class: section-hero--soft-contrast

## CSS guidance
```css
.section-hero--soft-contrast {
 padding-block: var(--wp--preset--spacing--xl);
 background: var(--wp--preset--color--base-2);
 color: var(--wp--preset--color--contrast);
}
```

## Usage notes
- Apply to reusable hero container patterns or section wrappers.

## Assumptions
- The theme already exposes the referenced spacing and color presets.

## Validation notes
- Confirm preset names and section wrapper usage.
- Run validator review before commit.
````

## Safe Defaults

- use readable section names
- prefer preset-driven CSS before hardcoded values
- keep CSS scoped to the reusable section treatment
- align naming with the section’s editorial or layout role

## Failure Modes And Escalation

Escalate briefly when:

- the request is really a single-block style request
- the request is actually for a full template or pattern
- the visual treatment depends on unavailable presets or design tokens
- the prompt lacks enough information to distinguish a reusable section treatment from a one-off page layout

In those cases, ask at most one focused question or return a safe scaffold with explicit assumptions.

## Test Prompts

### Test prompt: hero section treatment

Prompt:
> Create a reusable Warm Editorial Hero section style for a block theme. Prefer theme presets over hardcoded values and assume it will be used by multiple hero patterns.

Expected behaviour:

- treat this as section-level styling, not a single block style
- generate a reusable section style name
- provide scoped CSS or theme guidance
- mention that it can be applied via patterns or wrappers

### Test prompt: footer zone style

Prompt:
> Build a quiet footer zone styling treatment with tighter spacing and lower visual contrast for a block theme.

Expected behaviour:

- generate reusable section styling guidance
- keep the output focused on a layout zone
- avoid drifting into full footer template composition

### Test prompt: boundary case

Prompt:
> Register a button outline variation for `core/button`.

Expected behaviour:

- do not treat this as section-style work
- route to the block-style generator
- optionally note that block and section styles are different layers

## References

- `references/workflow.md`
- `references/wordpress-rules.md`
- `references/output-templates.md`
- `references/qa-rubric.md`
