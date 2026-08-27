---
name: themejson-extractor-orchestrator
description: Orchestrate the sequential extraction of WordPress theme.json design
  tokens from Figma. Use when setting up or syncing a full WordPress block theme with
  Figma design variables including palette, spacing, typography, radius, shadow, custom
  color tokens, and style variations.
---

# ThemeJSON Extractor Orchestrator

## Overview

Use this skill to run a complete WordPress `theme.json` extraction workflow in a controlled sequence.

This skill does not perform the individual extraction logic itself. Instead, it:

- selects the correct extractor skill for each stage
- asks the user for the required Figma node URL or node ID when a stage needs one
- pauses after each stage for user verification
- supports reruns, skips, and resume behavior
- keeps a visible progress checklist throughout the session

Treat this as an orchestration skill for another coding agent. It should coordinate the workflow cleanly rather than collapsing all steps into one pass.

## Required Skill Dependencies

Before starting, confirm these skills are available to the agent or the current workflow context:

- `figma-themejson-palette`
- `figma-themejson-spacing`
- `figma-themejson-typography`
- `figma-themejson-radius`
- `figma-themejson-shadow`
- `figma-themejson-custom-color-tokens`
- `figma-themejson-style-variations`

If one or more required skills are unavailable, stop and list the missing skills before starting extraction.

## Request Shapes

Use `$themejson-extractor-orchestrator` for requests like:

- "Run the full theme.json extraction workflow from my Figma variables."
- "Continue the theme.json extraction from typography onward."
- "Re-run the spacing extractor with a different Figma node, then continue step by step."

Success looks like:

- each extractor runs in the correct order
- the user is asked for exactly the right Figma node at each relevant step
- the user explicitly confirms each completed step before the next one begins
- skipped or rerun steps are tracked clearly
- the workflow can resume from the last confirmed step if the session is interrupted

## LightSpeedWP Example Context

Use the LightSpeedWP Agency `theme.json` as a grounding example for how WordPress token families may be organized:

- repository: `lightspeedwp/ls-theme`
- branch: `develop`
- file: `theme.json`
- example URL: `https://github.com/lightspeedwp/ls-theme/blob/develop/theme.json`

The example theme includes a structured palette with grouped slugs such as `neutral-*`, `surface-*`, `brand-*`, `cta-*`, `accent-*`, and `accent-two-*`. Use this example to ground naming expectations and to explain how extracted Figma variables may map into a real block-theme token system, but do not force users to copy the exact slug families when their theme uses a different naming system.

If helpful, read `references/lightspeed-themejson-example.md` for a concise summary of the example theme's token organization.

## Workflow

Run the workflow sequentially. After each step completes, present the result, ask the user to verify it, and wait for confirmation before continuing.

### Step 0: Initialize and Resume Check

At the start of the run:

1. Show the current progress checklist.
2. Determine whether this is:
   - a fresh run
   - a resumed run
   - a rerun of a specific step
3. If prior progress exists, resume from the first unconfirmed step unless the user explicitly asks to rerun or skip a different step.
4. Do not mark a step complete until the user confirms it.

### Step 1: Color Palette

Skill: `figma-themejson-palette`

1. Ask: `Please provide the Figma node URL or ID for the Color Palette variables table.`
2. Execute the palette extraction skill with the provided node.
3. Present the result.
4. Ask: `Please check the palette extraction result. Does everything look correct? (yes/no)`
5. If yes, mark Step 1 complete and continue.
6. If no, ask whether the user wants to rerun the step with a different node or stop here.

### Step 2: Spacing

Skill: `figma-themejson-spacing`

1. Ask: `Please provide the Figma node URL or ID for the Spacing variables table.`
2. Execute the spacing extraction skill with the provided node.
3. Present the result.
4. Ask: `Please check the spacing extraction result. Does everything look correct? (yes/no)`
5. If yes, mark Step 2 complete and continue.
6. If no, ask whether the user wants to rerun the step with a different node or stop here.

### Step 3: Typography

Skill: `figma-themejson-typography`

1. Ask: `Please provide the Figma node URL or ID for the Typography variables table.`
2. Execute the typography extraction skill with the provided node.
3. Present the result.
4. Ask: `Please check the typography extraction result. Does everything look correct? (yes/no)`
5. If yes, mark Step 3 complete and continue.
6. If no, ask whether the user wants to rerun the step with a different node or stop here.

### Step 4: Border Radius

Skill: `figma-themejson-radius`

1. Ask: `Please provide the Figma node URL or ID for the Border Radius variables table.`
2. Execute the radius extraction skill with the provided node.
3. Present the result.
4. Ask: `Please check the border radius extraction result. Does everything look correct? (yes/no)`
5. If yes, mark Step 4 complete and continue.
6. If no, ask whether the user wants to rerun the step with a different node or stop here.

### Step 5: Shadow

Skill: `figma-themejson-shadow`

1. Ask: `Please provide the Figma node URL or ID for the Shadow variables table.`
2. Execute the shadow extraction skill with the provided node.
3. Present the result.
4. Ask: `Please check the shadow extraction result. Does everything look correct? (yes/no)`
5. If yes, mark Step 5 complete and continue.
6. If no, ask whether the user wants to rerun the step with a different node or stop here.

### Step 6: Custom Color Tokens

Skill: `figma-themejson-custom-color-tokens`

1. Ask: `Please provide the Figma node URL or ID for the Custom Color Tokens variables table.`
2. Execute the custom color tokens extraction skill with the provided node.
3. Present the result.
4. Ask: `Please check the custom color tokens extraction result. Does everything look correct? (yes/no)`
5. If yes, mark Step 6 complete and continue.
6. If no, ask whether the user wants to rerun the step with a different node or stop here.

### Step 7: Style Variations

Skill: `figma-themejson-style-variations`

1. Ask: `Please provide the Figma node URL or ID for the Style Variations design.`
2. Execute the style variations extraction skill with the provided node.
3. Present the result.
4. Ask: `Please check the style variations extraction result. Does everything look correct? (yes/no)`
5. If yes, mark Step 7 complete.
6. If no, ask whether the user wants to rerun the step with a different node or stop here.

## Progress Tracking

Maintain and update this checklist during the run:

- `[ ] 1. Palette`
- `[ ] 2. Spacing`
- `[ ] 3. Typography`
- `[ ] 4. Radius`
- `[ ] 5. Shadow`
- `[ ] 6. Custom Color Tokens`
- `[ ] 7. Style Variations`

Rules:

- Replace `[ ]` with `[x]` only after user confirmation.
- If a step is skipped, mark it as `[skipped]` in the visible progress summary.
- If a step is rerun, keep only the latest confirmed result as authoritative.
- When resuming, show the checklist first and state which step will run next.

## Branching Rules

- If the user explicitly asks to skip a step, allow it and continue unless that step is a hard prerequisite for a later extractor.
- If a user reports a bad result, offer a rerun of the current step before moving on.
- Do not automatically continue after showing a result; always wait for confirmation.
- If the user wants to stop mid-workflow, end with the current checklist and the next resumable step.
- If the session restarts, resume from the first unconfirmed or intentionally rerun step.

## Output Contract

During execution, keep each turn focused on the current step.

For each step result, provide:

- the step name
- the extractor used
- the supplied Figma node reference when applicable
- a concise summary of what was extracted or changed
- the current progress checklist
- the verification question for that step

At workflow completion, summarize:

- total skills executed
- steps skipped or rerun
- issues or warnings encountered during extraction
- recommended next steps such as reviewing generated files, testing the theme, validating `theme.json`, or checking style variations in WordPress

## Guardrails

- Always wait for user confirmation before moving to the next step.
- Allow users to skip steps if they explicitly request it.
- Allow reruns of the current step with a different node.
- Track enough progress that the workflow can resume if interrupted.
- Do not invent Figma node IDs or URLs.
- Do not claim a step is complete before the user confirms it.
- Do not silently merge several extractor stages into one response.

## Supporting Files

- `references/lightspeed-themejson-example.md` — use this for a concise grounding summary of the LightSpeedWP example `theme.json` structure when you need to explain token-family expectations or compare extracted naming patterns.
