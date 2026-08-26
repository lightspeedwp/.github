---
name: themejson-extractor-orchestrator
description: Orchestrate the sequential extraction of WordPress theme.json design tokens from Figma. Use when setting up or syncing a full WordPress block theme with Figma design variables including palette, spacing, typography, radius, shadow, custom color tokens, and style variations.
---

# ThemeJSON Extractor Orchestrator

## Overview

This skill guides an agent through a complete WordPress theme.json extraction workflow, executing each extractor skill in the correct order and prompting the user for Figma node inputs at each step.

## Workflow

Execute the following skills **sequentially**. After each skill completes, ask the user to verify the result before proceeding.

### Step 1: Color Palette

**Skill**: `figma-themejson-palette`

1. Ask the user: "Please provide the Figma node URL or ID for the **Color Palette** variables table."
2. Execute the palette extraction skill with the provided node.
3. Present the result and ask: "Please check the palette extraction result. Does everything look correct? (yes/no)"
4. Wait for confirmation before proceeding.

### Step 2: Spacing

**Skill**: `figma-themejson-spacing`

1. Ask the user: "Please provide the Figma node URL or ID for the **Spacing** variables table."
2. Execute the spacing extraction skill with the provided node.
3. Present the result and ask: "Please check the spacing extraction result. Does everything look correct? (yes/no)"
4. Wait for confirmation before proceeding.

### Step 3: Typography

**Skill**: `figma-themejson-typography`

1. Ask the user: "Please provide the Figma node URL or ID for the **Typography** variables table."
2. Execute the typography extraction skill with the provided node.
3. Present the result and ask: "Please check the typography extraction result. Does everything look correct? (yes/no)"
4. Wait for confirmation before proceeding.

### Step 4: Border Radius

**Skill**: `figma-themejson-radius`

1. Ask the user: "Please provide the Figma node URL or ID for the **Border Radius** variables table."
2. Execute the radius extraction skill with the provided node.
3. Present the result and ask: "Please check the border radius extraction result. Does everything look correct? (yes/no)"
4. Wait for confirmation before proceeding.

### Step 5: Shadow

**Skill**: `figma-themejson-shadow`

1. Ask the user: "Please provide the Figma node URL or ID for the **Shadow** variables table."
2. Execute the shadow extraction skill with the provided node.
3. Present the result and ask: "Please check the shadow extraction result. Does everything look correct? (yes/no)"
4. Wait for confirmation before proceeding.

### Step 6: Custom Color Tokens

**Skill**: `figma-themejson-custom-color-tokens`

1. Ask the user: "Please provide the Figma node URL or ID for the **Custom Color Tokens** variables table."
2. Execute the custom color tokens extraction skill with the provided node.
3. Present the result and ask: "Please check the custom color tokens extraction result. Does everything look correct? (yes/no)"
4. Wait for confirmation before proceeding.

### Step 7: Style Variations

**Skill**: `figma-themejson-style-variations`

1. Ask the user: "Please provide the Figma node URL or ID for the **Style Variations** design."
2. Execute the style variations extraction skill with the provided node.
3. Present the result and ask: "Please check the style variations extraction result. Does everything look correct? (yes/no)"
4. Wait for confirmation before proceeding to the final cleanup step.

### Step 8: Orphaned References Cleanup

**Skill**: `theme-orphaned-refs`

1. Ask the user: "Would you like to proceed with scanning for orphaned preset references? This will find and fix any broken references in your theme. (yes/no)"
2. On confirmation, execute the orphaned refs cleanup skill. **No Figma node is required for this step.**
3. Present the result and ask: "Please check the orphaned references cleanup result. Does everything look correct? (yes/no)"

## Completion

After all steps are complete, summarize:

- Total skills executed
- Any issues or warnings encountered during extraction
- Recommendations for next steps (e.g., testing the theme, reviewing generated files)

## Guardrails

- Always wait for user confirmation before moving to the next step
- If a user reports an issue, allow them to re-run the current step with a different node
- Allow users to skip steps if they explicitly request it
- Track progress so users can resume if the session is interrupted

## Progress Tracking

Maintain a checklist during execution:

```
[ ] 1. Palette
[ ] 2. Spacing
[ ] 3. Typography
[ ] 4. Radius
[ ] 5. Shadow
[ ] 6. Custom Color Tokens
[ ] 7. Style Variations
[ ] 8. Orphaned References
```

Update the checklist after each confirmed step.

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
