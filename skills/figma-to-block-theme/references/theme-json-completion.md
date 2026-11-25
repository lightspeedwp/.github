# Complete mode: fill theme.json gaps

Audits the blocks a theme actually uses and proposes the `theme.json` configuration they are missing. It needs no Figma file. It uses each block's `block.json` as a map of what can be configured, and proposes only what the theme shows evidence for.

Build the [theme profile](theme-profile.md) first. Its token storage map decides where each addition goes.

## Inputs

- Theme root
- Optional scope: the whole theme (default), a list of blocks, or one area
- Optional strictness: `used-blocks-only` (default)

## 1. Map the configuration surface

Read `theme.json`, every `styles/*.json` variation and any preset slices. Record which file owns which concern (for example typography in `styles/presets/typography.json`, block configuration in `styles/presets/blocks/<block>.json`). Treat that map as a hard rule for where edits go:

- Theme without slices: block configuration goes in `settings.blocks.<block>` and `styles.blocks.<block>` in `theme.json`.
- Theme with slices: write to the slice that owns the concern, and create one block slice per block if that is the existing convention.

## 2. List the blocks in use

Scan `templates/`, `parts/` and `patterns/` for block comments (`<!-- wp:… -->`) and build a de-duplicated list. Note repeated treatments: alignments, spacing, button styles, query layouts and heading and paragraph pairs.

## 3. Gather current coverage

For each block in use, collect what already applies: global settings, `settings.blocks.<block>`, global styles, `styles.blocks.<block>`, `styles.elements`, preset slices, variations, and any block style JSON or CSS that shows intended defaults.

## 4. Read block capabilities

For each block, read its `block.json`: the theme's or a plugin's own, or `wp-includes/blocks/<name>/block.json` for core blocks. Note `supports` (color, spacing, typography, dimensions, background, filter, shadow, position, layout), `selectors`, registered `styles` and `variations`. These are candidates, not requirements.

## 5. Find real gaps

Propose an addition only with evidence, such as:

- the block is used and the theme already styles it repeatedly in patterns or CSS
- neighbouring blocks share a contract that should apply here too
- a block variation is used but has no theme defaults
- the tokens exist, but no reusable `theme.json` mapping does

Never propose a setting just because the block supports it.

## 6. Infer conservatively

- Reuse presets, semantic tokens and neighbouring blocks' patterns first.
- Take spacing, typography, layout and shadow values from the preset scales, not new literals.
- Colours go through the theme's colour model. A new semantic token goes in `theme.json` and, for semantic themes, the same path in `styles/dark.json`, both pointing at palette presets.
- Put dark-only shadow changes in `styles/dark.json`, and only when the dark surface needs them.

## 7. Plan, then wait

Group the plan by file and block. For each addition, give the file, JSON path, value, why it belongs there, the evidence, and a confidence level when the inference isn't obvious. List conflicts and low-confidence items separately under "Hold for review". Then ask `Approve this plan and proceed with implementation?`

## 8. Implement after approval

- Make additive edits only, merging into existing objects.
- Keep the file ownership map. Never flatten slices into `theme.json`, and never rewrite a variation or slice wholesale.
- Don't remove keys that look redundant, and don't reorder large sections.

## 9. Validate

Run the theme's own checks (for example `npm run schema:validate` and `npm run theme:validate`) or validate each file against its `$schema`. Fix only problems introduced by the approved changes, and report anything else.

## Report

1. Storage model
2. Blocks audited
3. Additions by file, each with its basis
4. Held for review
