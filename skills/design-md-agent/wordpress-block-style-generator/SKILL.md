---
name: wordpress-block-style-generator
description: create wordpress block styles, block style registrations, style variation definitions and supporting css or theme.json guidance for individual blocks. use when the user asks to define a reusable style for a specific block, register a named block style, or generate block-level styling rules that fit block theme workflows.
---

# WordPress Block Style Generator

## Purpose

Generate reusable WordPress block styles for individual blocks using the lightest practical implementation approach.

This skill creates:

- named block style definitions
- block style registration guidance
- supporting CSS for block styles
- `theme.json` style guidance when native configuration fits the request

It prefers native WordPress styling mechanisms first and uses custom classes only where they materially help.

## Trigger Conditions

Use this skill when the request is about:

- creating a named style for a specific block
- defining a block style variation
- generating CSS for a reusable block-level design treatment
- deciding how a block style should be represented in a block theme workflow

Do not use this skill for:

- broad section or layout styling across multiple page areas
- template generation
- pattern generation
- full theme validation reviews

Those belong to the relevant specialist skills.

## Inputs

Accept any mix of:

- block name or type
- desired style name
- visual description
- theme conventions
- CSS requirements
- `theme.json` constraints
- Figma handoff notes
- repository examples

If naming or implementation direction is unclear, use `wordpress-asset-parameter-generator` behavior first and state assumptions.

## Fast Decision Flow

1. Identify the target block and style purpose.
2. Decide the lightest fitting implementation:
   - native block style variation
   - CSS class-based style registration
   - `theme.json` guidance for block-level styling
3. Normalize the style name and any class naming.
4. Generate the registration and styling output.
5. Mark anything that should be reviewed by `wordpress-block-asset-validator`.

## Workflow

1. Inspect the request and capture confirmed facts.
2. Identify the target block and intended editor-facing style label.
3. Normalize:
   - style slug
   - label
   - related class name when needed
4. Prefer native block-style handling before custom complexity.
5. Generate:
   - registration guidance
   - CSS or `theme.json` guidance
   - usage notes
6. Return assumptions and validation notes.

## Block Style Rules

- Start with native WordPress block-style patterns where possible.
- Keep styles scoped to a specific block or block family.
- Use clear, reusable names.
- Use custom CSS classes only when they materially improve the outcome.
- When custom classes are needed, keep them stable and readable.
- Use BEM-style naming only where custom classes are genuinely necessary.
- Avoid folding broader section-level design systems into a single block style.

## Output Format

By default, return:

1. the target block
2. the block style name and slug
3. registration guidance
4. CSS or `theme.json` guidance
5. assumptions
6. validation notes

Example output shape:

````markdown
## Target block
`core/button`

## Style definition
- Name: Outline Accent
- Slug: outline-accent

## Registration guidance
```php
register_block_style(
 'core/button',
 array(
  'name'  => 'outline-accent',
  'label' => 'Outline Accent',
 )
);
```

## CSS guidance
```css
.is-style-outline-accent .wp-block-button__link {
 border: 2px solid var(--wp--preset--color--accent);
 background: transparent;
 color: var(--wp--preset--color--accent);
}
```

## Assumptions
- Accent color is already available as a theme preset.

## Validation notes
- Confirm the chosen block target and preset names.
- Run validator review before commit.
````

## Safe Defaults

- keep style labels editor-readable
- keep style slugs lowercase hyphen-case
- prefer preset-driven styling before hardcoded values
- keep CSS scoped to the block style selector

## Failure Modes And Escalation

Escalate briefly when:

- the request is really for a section-wide design language rather than a block style
- the requested style spans too many unrelated blocks
- the visual request depends on unavailable design tokens or theme presets
- the prompt lacks enough detail to choose between a native variation and custom CSS

In those cases, ask at most one focused question or return a safe scaffold with explicit assumptions.

## Test Prompts

### Test prompt: button style

Prompt:
> Create a reusable Accent Outline style for `core/button` in a block theme. Prefer presets over hardcoded colors.

Expected behaviour:

- identify the block correctly
- generate a clean style slug and label
- provide registration guidance
- provide scoped CSS guidance
- avoid overcomplicating the implementation

### Test prompt: quote variation

Prompt:
> Build a Quiet Pull Quote style for `core/quote` with softer borders and lighter text treatment.

Expected behaviour:

- keep the output focused on `core/quote`
- produce a reusable style definition
- avoid turning it into section-level styling

### Test prompt: boundary case

Prompt:
> Define the styling system for full-width hero sections across the whole site.

Expected behaviour:

- do not treat this as a single block-style request
- route to the section-style generator
- optionally mention any block-style role only if relevant

## References

- `references/workflow.md`
- `references/wordpress-rules.md`
- `references/output-templates.md`
- `references/qa-rubric.md`
