---
name: themejson-completion
description: Audit a WordPress block theme and fill out theme.json as completely as possible without overwriting existing config. Use when scanning a theme, theme.json, style variations, styles/presets files, templates, patterns, and block.json supports to identify missing block configuration, infer sensible additions, present an approval-first plan, and then apply additive minimal edits.
---

# ThemeJSON Completion

## Goal

Audit the theme's current Global Styles coverage and fill missing `theme.json` configuration as completely as practical without replacing existing work.

This workflow uses the WordPress `block.json` schema as a capability map. It inspects a block's declared supports, selectors, styles, and variations to decide which `theme.json` surfaces are plausible, then proposes only the parts that the theme actually appears to need.

## Required inputs

- Theme root path
- Optional scope: full theme, a shortlist of blocks, or a specific file area
- Optional strictness: `used-blocks-only` by default

## Primary files to inspect

1. `theme.json`
2. `styles/dark.json`
3. additional `styles/*.json` variation files when present
4. `inc/presets.php` when present
5. `styles/presets/**/*.json`
6. `styles/blocks/**/*.json` and `styles/sections/**/*.json` as evidence of existing style contracts
7. `templates/**/*.html`
8. `parts/**/*.html`
9. `patterns/**/*.php` and `patterns/**/*.html`
10. `assets/css/**/*.css`, `functions.php`, and `inc/**/*.php` as supporting evidence only
11. Local custom `block.json` files in the theme or companion plugins
12. Core `wp-includes/blocks/*/block.json` files for used core blocks when local metadata is not available

## Repository-specific storage model

In `ls-theme`, live `theme.json` data may be split across modular preset files.

- `inc/presets.php` merges `styles/presets/**/*.json` into the theme's runtime `theme.json` data.
- `theme.json` remains the base source of truth for global settings, tokens, and non-block concerns.
- `styles/dark.json` is the required dark style variation and should stay focused on overrides.
- additional `styles/*.json` variation files are optional and should stay equally focused when present.
- `styles/blocks/**/*.json` and `styles/sections/**/*.json` may show design intent or block-style contracts, but do not assume they are runtime merge targets unless the code proves that.
- All live block configuration must be written to `styles/presets/blocks/` as one file per block.

Because of that:

- preserve the modular layout if it exists
- add shared settings and styles to the preset slice that already owns that concern
- add all runtime block configuration to `styles/presets/blocks/<block-name>.json`
- use `theme.json` only for global settings, tokens, and non-block concerns
- never flatten preset slices back into `theme.json`

## Audit workflow

### Phase 1: Detect the live configuration surface

1. Read `theme.json`, `styles/dark.json`, any additional `styles/*.json` variation files, and `inc/presets.php`.
2. Build a map of which files own which concerns, for example:
   - typography -> `styles/presets/typography.json`
   - spacing -> `styles/presets/spacing.json`
   - shadows -> `styles/presets/shadows.json`
   - radii -> `styles/presets/radii.json`
   - layout -> `styles/presets/layout.json`
   - block-specific runtime slices -> `styles/presets/blocks/*.json`
3. Treat that ownership map as a hard constraint for later edits.

### Phase 2: Inventory actual theme usage

1. Scan `templates/`, `parts/`, and `patterns/` for block comments such as `<!-- wp:core/block -->`.
2. Build a deduplicated list of blocks the theme actually uses.
3. Record repeated patterns such as common alignments, spacing choices, button treatments, query layouts, navigation usage, or recurring heading/paragraph combinations.

### Phase 3: Gather current coverage

For each used block, inspect the current config across the live theme model:

- global `settings`
- `settings.blocks.<block>`
- global `styles`
- `styles.blocks.<block>`
- `styles.elements`
- merged preset slices that contribute live runtime data
- style variations that need parity or mode-specific remaps

Also note any related authored CSS or block-style JSON that indicates intended defaults already exist outside `theme.json`.

### Phase 4: Read block capabilities

For each used block:

1. Read its `block.json` metadata.
2. Use the `block.json` schema to inspect relevant capability areas such as:
   - `supports.color`
   - `supports.spacing`
   - `supports.typography`
   - `supports.dimensions`
   - `supports.background`
   - `supports.filter`
   - `supports.shadow`
   - `supports.position`
   - `supports.layout`
   - `selectors`
   - registered block `styles`
   - `variations`
3. Treat those as candidate `theme.json` surfaces, not automatic requirements.

### Phase 5: Identify real gaps

Flag missing or thin configuration only when there is evidence for it. Good evidence includes:

- the block is used in the theme
- the theme already styles that block repeatedly in patterns or CSS
- neighbouring blocks already have a reusable contract that should also apply here
- a block variation exists in use but lacks theme defaults
- the theme has the tokens or presets needed, but no reusable `theme.json` mapping yet

Do not propose settings just because a block technically supports them.

### Phase 6: Infer additions conservatively

When a gap is real:

1. Reuse existing presets, semantic tokens, and neighbouring block patterns first.
2. Infer spacing, typography, layout, and shadow values from the theme's existing preset scale rather than inventing new literals.
3. Infer colour only through semantic custom colour tokens.
4. If a new semantic colour token is genuinely required:
   - add it to `theme.json`
   - add the exact same token path to `styles/dark.json`
   - map both values only to preset colours
5. Keep mode-specific shadow overrides in `styles/dark.json` only when the dark surface actually needs a different shadow treatment.
6. Write block-specific runtime config to a dedicated file in `styles/presets/blocks/` even when the block currently has no file yet.
7. Keep variation-specific config in the file that already owns that variation when possible.

### Phase 7: Present an approval-first plan

Before writing any file, produce a plan grouped by file and block.

For each proposed edit include:

- target file
- JSON path
- value to add
- why it belongs there
- evidence used for the inference
- confidence level when the inference is not obvious

Then ask exactly:

`Approve this plan and proceed with implementation?`

Do not edit files before approval.

### Phase 8: Implement after approval

After approval:

1. Make additive edits only.
2. Merge into existing objects instead of replacing whole sections.
3. Preserve file ownership and modular preset placement.
4. Create or extend one block file per block in `styles/presets/blocks/`.
5. Extend existing `settings.blocks.<block>` and `styles.blocks.<block>` objects in place.
6. Do not reorder large sections unless the local file style clearly requires it.
7. Do not remove existing keys because they appear redundant.
8. Do not overwrite existing style variations or preset slices.

## Output requirements

### Before approval

Provide:

1. Storage model detected
2. Blocks audited
3. Missing coverage found
4. Proposed additions grouped by file
5. Low-confidence items or conflicts

### After approval

Provide:

- files changed
- key JSON paths added
- validation results
- any follow-up review items

## Validation

After implementation, run:

- `npm run schema:validate`
- `npm run theme:validate` when theme contracts or required files are involved

If validation fails, fix only issues introduced by the approved changes or report the blocker clearly.

## Guardrails

- Do not overwrite `theme.json`, `styles/dark.json`, any additional style variation file, or any preset file wholesale.
- Do not flatten modular preset files back into `theme.json`.
- Do not place live block defaults directly in `theme.json` when they belong in `styles/presets/blocks/*.json`.
- Do not invent a new token family when an existing preset or semantic token already fits.
- Do not create raw visual colour usage in authored UI.
- Do not move runtime-critical settings into folders that are not actually merged or registered.
- Do not mirror every block support into `theme.json` blindly.
- Do not change unrelated files.
- If an inferred addition conflicts with visible existing intent, stop and surface the conflict instead of guessing.

## Reporting template

1. **Storage model**: `<single file or modular preset layout>`
2. **Blocks audited**: `<list>`
3. **Add to** `<file>`
   - `<json path>` -> `<value>`
   - Basis: `<why this is missing and how it was inferred>`
4. **Hold for review**: `<conflicts, low-confidence items, or cases that should not be inferred automatically>`

Then ask: `Approve this plan and proceed with implementation?`

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
