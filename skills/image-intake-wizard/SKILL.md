---
name: image-intake-wizard
description: >-
  guided intake, routing, and approval workflow for generated image requests. use when a user asks to create, generate, refine, brief, or prepare an image, illustration, concept visual, hero image, campaign visual, mockup, or visual prompt and the request needs composition, mood, brand, aspect ratio, audience, reference, or avoidance details before generation. route away when the actual deliverable is a figma design, diagram, frontend artifact, wordpress block-theme handoff, design qa review, brand guideline review, or written prompt only.
---

# Image Intake Wizard

## Purpose

Use this skill to turn vague or partially specified image requests into a clean, approved image generation spec before creating an image. The goal is to reduce rework, protect brand quality, and make image requests usable by LightSpeed team members across design, marketing, WordPress, Figma, QA, and client handoff work.

This skill is an intake and routing layer. It does not replace specialist skills when the user needs a Figma design, frontend build, WordPress asset, design QA review, brand review, diagram, or handoff packet.

## First Decision: Generate, Route, or Skip

Classify the request before asking intake questions.

### Use this skill

Use this skill when the user wants or is likely to want a generated image, including:

- image, hero image, illustration, visual concept, campaign visual, social image, advert visual, card image, cover image, mockup, scene, character, icon concept, or branded visual direction
- visual options for a website section, landing page, flyer, toolkit, blog post, presentation, product page, or marketing campaign
- a generated image based on a website, brand, Figma screenshot, uploaded image, or rough creative brief
- help preparing a strong prompt for image generation where the user may later approve generation

### Route away before using this skill

Use the more specific related skill when the requested output is not primarily a generated image:

- Figma file inspection, Dev Mode evidence, node analysis, screenshots, variables, or design-to-code translation: use `figma`.
- Figma write actions, node creation, component editing, variables, or programmatic file operations: use `figma-use` first, then the relevant Figma generation skill.
- New or edited Figma screens, modals, panels, pages, or multi-section layouts: use `figma-generate-design` or `edit-figma-design`.
- Figma design system libraries, tokens, components, or variable-bound assets: use `figma-generate-library`, `cc-figma-tokens`, or `cc-figma-component`.
- Diagrams, flowcharts, timelines, architecture diagrams, ERDs, or Mermaid-driven visuals: use `figma-generate-diagram`.
- Frontend UI, React components, single-page apps, prototypes, or HTML artifacts: use `frontend-design` or `web-artifacts-builder`.
- Styling an existing artifact, deck, doc, or page with a theme: use `theme-factory`.
- LightSpeed brand voice, visual consistency, proposal styling, or brand-safe copy/design review: use `lightspeed-brand-guidelines`.
- Scattered design, website, WordPress, Figma, QA, content, or implementation context that needs a handoff packet: use `design-execution-packet`, `handoff-router`, or `wp-figma-artifact-builder`.
- WordPress block-theme patterns, templates, template parts, section styles, block styles, theme.json mapping, or build-ready implementation assets: use `wordpress-block-theme-router` or the relevant WordPress specialist skill.
- Design QA, Figma handoff readiness, layout feasibility, or implementation risk review: use `design-qa-readiness`.
- User only asks for critique, text prompt writing, alt text, copy, or a written creative brief without image generation: answer directly or route to the relevant writing/planning skill.

### Skip the wizard and generate/edit directly

Skip the approval workflow only when the current turn already contains a complete, specific, safe image generation or image editing instruction. Examples: "remove the background from this uploaded image", "make this image square", or "generate a flat icon of a safari jeep, transparent background, no text".

If the request includes a rendition of the user or a private person and no current-conversation reference image is available, ask for an image of that person before generation.

## Input Handling

Accept messy inputs. Normalize them into the image spec instead of asking the user to restate everything.

Possible inputs include:

- a short creative prompt
- a business or campaign goal
- a website URL, landing page, brand page, or competitor reference
- a Figma link, node ID, screenshot, or design export
- an uploaded reference image
- a LightSpeed project name, client name, product name, or internal brief
- a WordPress pattern, page section, post, flyer, toolkit, presentation, or social campaign context
- existing brand tokens, colours, typography notes, visual rules, or constraints
- desired channel such as website, blog, LinkedIn, slide deck, print, lead magnet, or ad creative
- negative examples or constraints to avoid

When the user refers to internal LightSpeed project sources, use the available internal search or project context before asking them to repeat known details. When the user supplies a public URL, inspect or summarize what can be grounded from that source before finalizing the spec. When the user supplies a Figma URL and the task needs design evidence rather than a generated image, route to the Figma skill path.

## Required Image Spec

Aim to populate these ten fields before generation:

1. **goal**
2. **subject**
3. **output_type**
4. **orientation**
5. **composition**
6. **style**
7. **audience_or_use_case**
8. **reference_source**
9. **brand_or_visual_tokens**
10. **constraints_to_avoid**

Also capture these supporting fields when available:

- **context_or_setting**
- **text_in_image**
- **variant_count**
- **delivery_notes**
- **height_preference**
- **final_destination** such as WordPress pattern, Figma exploration, blog post, deck, flyer, or social post
- **related_skill_route** when the image work should feed another LightSpeed workflow

Capture at least 5 fields before generation. Aim for all 10 core fields when the user can provide them without friction.

## Defaulting Rules

Use grounded defaults when the user has not specified a field. Label defaults clearly in the approval summary.

Default values:

- `output_type`: mockup, unless the user clearly asked for an illustration, hero image, icon, product visual, or edited image
- `orientation`: portrait for general marketing visuals; landscape for website hero images, slides, and wide banners; square for social posts when no platform is specified
- `height_preference`: unconstrained when supported
- `text_in_image`: avoid text unless clearly needed
- `variant_count`: 2 or 3 distinct variants when the user asks for options; 1 image when they ask for a single final image
- `style`: clean, usable, brand-safe, and commercially practical over novelty
- `composition`: uncluttered, readable at target size, strong focal point, clear foreground/background separation
- `constraints_to_avoid`: avoid clutter, tiny unreadable details, fake UI text, overproduced stock-photo cliches, visual claims that imply unsupported outcomes, and anything that conflicts with the target brand

LightSpeed defaults:

- Prefer maintainable, reusable visual direction that can translate into Figma and WordPress work.
- Keep visuals client-safe, accessible, and conversion-aware.
- If the image supports a website or campaign, consider how it will crop on desktop and mobile.
- If the image may become implementation guidance, include enough notes for a designer or developer to reuse the concept.

## Reference Handling

If the user supplies a reference URL, website, visual reference, uploaded image, screenshot, or Figma frame:

1. audit the reference before asking the user to restate cues that can be extracted
2. extract reusable cues such as layout pattern, hierarchy, tone, palette direction, typography feel, spacing density, imagery style, component patterns, CTA treatment, and content density
3. keep reference cues separate from confirmed user instructions
4. reuse those cues in the image spec only as guidance, not as exact copying
5. tell the user that the spec includes reference-derived visual guidance

For LightSpeed work, also note whether the reference is best treated as:

- brand evidence
- layout inspiration
- campaign mood
- WordPress implementation input
- Figma exploration input
- QA or parity evidence

Route to a related specialist skill if the reference implies a non-image deliverable.

## Intake Workflow

Follow this sequence:

1. **Classify the deliverable.** Decide whether to use this skill, route to a related skill, skip the wizard, or answer directly.
2. **Collect only the missing high-value fields.** Ask one focused question when the missing information would materially change the image. Otherwise use defaults.
3. **Normalize the inputs.** Convert rough notes into the image spec fields.
4. **Audit references.** Use supplied URLs, images, screenshots, Figma links, or internal project context where available.
5. **Separate evidence types.** Keep confirmed details, assumed defaults, and reference-derived cues distinct.
6. **Present an approval summary.** Do not generate before explicit approval unless the request was already fully specified.
7. **Generate after approval.** Convert the approved spec into the strongest practical image prompt and use the image generation tool.
8. **Route downstream if needed.** If the approved spec is intended for Figma, WordPress, QA, or an implementation handoff, state the next related skill route after generation or instead of generation when appropriate.

## Approval Workflow

Once there is enough context, stop and present a concise approval summary before generation.

Use this flow:

1. State that image generation is the next step.
2. Summarize the chosen image spec in a scannable format.
3. Separate **confirmed details**, **assumed defaults**, and **reference-derived cues** when present.
4. Include **downstream route** when the result should feed a LightSpeed workflow.
5. Ask one direct approval question.

Accept approval only when the user clearly confirms. If the user changes any field, update the summary and ask for approval again before generating.

## Approval Summary Format

Use this compact structure:

- **Goal:** ...
- **Subject:** ...
- **Output type:** ...
- **Orientation:** ...
- **Composition:** ...
- **Style:** ...
- **Audience / use case:** ...
- **Reference source:** ...
- **Brand or visual tokens:** ...
- **Text in image:** ...
- **Height preference:** ...
- **Variants:** ...
- **Final destination:** ...
- **Avoid:** ...
- **Confirmed details:** ...
- **Assumed defaults:** ...
- **Reference-derived cues:** ...
- **Downstream route:** ...

Then ask: "Approve this spec for image generation?"

## After Approval

After the user approves:

1. convert the approved spec into a concise, high-signal image prompt
2. preserve reference cues, brand constraints, and avoidance rules
3. generate clearly differentiated variants when more than one image is requested
4. avoid near-duplicate variants
5. if relevant, provide a short note about how the output can be used by the next LightSpeed workflow, such as Figma exploration, WordPress pattern planning, marketing content, or design QA

## LightSpeed Related Skill Routing Cheatsheet

Use these routes to keep the team workflow clean:

- Image idea needs structured spec before generation: stay in `image-intake-wizard`.
- Generated visual should become a Figma screen or design exploration: route next to `figma-generate-design` or `edit-figma-design`.
- Prototype or UI needs to become reviewable Figma frames: route to `prototype-to-figma`.
- Visual direction needs brand alignment: route to `lightspeed-brand-guidelines` before generation when brand risk is high.
- Visual concept needs to become reusable frontend/UI code: route to `frontend-design` or `web-artifacts-builder`.
- Visual concept needs WordPress block-theme assets: route to `wordpress-block-theme-router`, `wordpress-pattern-generator`, `wordpress-section-style-generator`, or `wp-figma-artifact-builder`.
- Visual or design brief needs QA before build: route to `design-qa-readiness`.
- Mixed Figma, WordPress, QA, content, and implementation context needs packaging: route to `design-execution-packet` or `handoff-router`.
- A diagram, timeline, flow, or architecture visual is requested: route to `figma-generate-diagram` instead of generating an illustrative image.

## Memory Behavior

If the user states a lasting image preference that should influence future runs, save it in memory when allowed. Good candidates include preferred output type, recurring orientation, recurring brand tone, avoiding text in generated images, preferred variant count, and recurring reference-audit preference.

Do not save one-off campaign details, client-sensitive creative notes, or temporary project assumptions unless the user explicitly asks.

## Failure Conditions To Avoid

Do not:

- generate immediately from a vague image request without intake and approval
- ignore a supplied reference URL, uploaded image, screenshot, or Figma link
- force image generation when a related Figma, frontend, WordPress, QA, diagram, or brand skill is the better route
- mix confirmed details with assumptions without labeling them
- ask the user to repeat context that is available from supplied references or internal project sources
- generate near-duplicate variants
- put text into the image unless it is clearly required
- overwrite explicit user direction with aesthetic preference
- create image claims that imply unsupported business, legal, medical, accessibility, or performance outcomes

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
