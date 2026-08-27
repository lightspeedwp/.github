---
name: wordpress-block-theme-router
description: route wordpress block theme asset requests to the correct specialist skill for parameters, validation, patterns, template parts, templates, custom templates, block styles or section styles. use when the user asks for general block theme asset help, gives an ambiguous asset-generation request, or needs the correct wordpress block theme specialist workflow selected first.
---

# WordPress Block Theme Router

## Purpose

Act as the central entry point for WordPress block theme asset requests.

This skill does not try to be the best generator for every asset type. Its job is to:

- identify the real request type
- choose the right specialist skill
- call for parameter normalization when inputs are incomplete
- call for validation before work is treated as complete
- keep the overall workflow consistent across the skill suite

## Specialist Skills

Route to these skills:

- `wordpress-asset-parameter-generator`
- `wordpress-block-asset-validator`
- `wordpress-pattern-generator`
- `wordpress-template-part-generator`
- `wordpress-template-generator`
- `wordpress-custom-template-generator`
- `wordpress-block-style-generator`
- `wordpress-section-style-generator`

## Trigger Conditions

Use this skill when the request is about:

- general WordPress block theme asset creation
- choosing between pattern, template part, template, custom template, block style, or section style work
- handling an ambiguous or mixed block theme asset request
- routing a request to the correct specialist workflow before generation starts

Do not use this skill when the asset type is already clear and a specialist skill can be invoked directly with confidence.

## Inputs

Accept any mix of:

- a user request in plain language
- rough asset descriptions
- file paths
- repository conventions
- Figma handoff notes
- partial metadata
- generated outputs that need validation

If the request is missing one or two fields, choose the most likely workflow and state assumptions briefly. Ask one focused question only when the missing detail materially changes which specialist skill should run.

## Fast Decision Flow

1. Decide whether the request is:
   - parameter preparation
   - validation
   - pattern generation
   - template part generation
   - hierarchy template generation
   - custom template generation
   - block style generation
   - section style generation
2. If metadata or scope is incomplete, route through `wordpress-asset-parameter-generator` first.
3. Route generation to the right specialist skill.
4. Route finished or proposed outputs through `wordpress-block-asset-validator` before treating them as complete.

## Routing Matrix

### Route to `wordpress-asset-parameter-generator`

Use when the user asks to:

- fill in metadata
- normalize slugs, names, titles, or post types
- prepare a pattern header
- prepare a `customTemplates` fragment
- standardize asset inputs before generation

### Route to `wordpress-block-asset-validator`

Use when the user asks to:

- validate a generated asset
- check compliance
- review a pattern, template part, template, or custom template
- verify naming, metadata, placement, or registration

### Route to `wordpress-pattern-generator`

Use when the user asks to:

- create a pattern
- scaffold a `/patterns/*.php` file
- build a starter pattern
- create a hidden implementation pattern
- prepare a pattern for editor or template usage

### Route to `wordpress-template-part-generator`

Use when the user asks to:

- create a reusable part in `/parts`
- build a header, footer, sidebar, or comments part
- create template-part insertion markup
- build a template part that calls a pattern

### Route to `wordpress-template-generator`

Use when the user asks to:

- build a standard hierarchy-aware template
- scaffold `index.html`, `home.html`, `single.html`, `page.html`, `archive.html`, or `404.html`
- compose a full template from parts and patterns

### Route to `wordpress-custom-template-generator`

Use when the user asks to:

- register a custom template in `theme.json`
- create a non-hierarchy named template
- generate both the template file and the `customTemplates` entry

### Route to `wordpress-block-style-generator`

Use when the user asks to:

- create a reusable style for one specific block
- register a block style variation
- define block-scoped CSS or style behavior

### Route to `wordpress-section-style-generator`

Use when the user asks to:

- style a reusable layout zone or page band
- define hero section, footer zone, feature band, or callout-area styling
- create styling that spans beyond a single block but not a full template

## Workflow

1. Inspect the request and identify the likely asset type.
2. If the request is mixed, split it into ordered subtasks.
3. Route missing metadata work to the parameter generator first when needed.
4. Route the main generation task to one specialist skill.
5. Route the result to the validator when the request is about completion, review, or delivery readiness.
6. Return:
   - the chosen specialist skill
   - the reason for the route
   - any assumptions
   - the next validation step if applicable

## Mixed Request Handling

When a request includes multiple asset types:

1. Identify the primary requested outcome.
2. Break the work into a short ordered sequence.
3. Do not merge all instructions into one vague workflow.

Example:

- “Create a landing page custom template with a hero pattern and matching header part.”

Route as:

1. `wordpress-asset-parameter-generator` if metadata is incomplete
2. `wordpress-pattern-generator`
3. `wordpress-template-part-generator`
4. `wordpress-custom-template-generator`
5. `wordpress-block-asset-validator`

## Output Format

By default, return:

1. the chosen specialist skill
2. the reason for the route
3. the ordered task sequence if the request is mixed
4. assumptions
5. validation notes

Example output shape:

```markdown
## Route
- Specialist skill: `wordpress-template-generator`
- Reason: the request is for a standard hierarchy-aware `single.html` template

## Ordered steps
1. Prepare any missing pattern or template-part inputs if needed.
2. Generate the template with `wordpress-template-generator`.
3. Validate the result with `wordpress-block-asset-validator`.

## Assumptions
- The request is for a normal hierarchy template, not a custom template.

## Validation notes
- Final template should be reviewed before commit.
```

## Router Rules

- Prefer a direct specialist route when the request is clear.
- Use the parameter generator when incomplete metadata would weaken the specialist output.
- Use the validator before signoff on generated assets.
- Do not absorb all specialist behavior into the router.
- Do not over-question the user when a safe route is obvious.

## Failure Modes And Escalation

Escalate briefly when:

- the request is too ambiguous to distinguish between two specialist skills
- repository conventions conflict with official WordPress behavior
- the user requests an invalid structure and no safe specialist route exists
- the task falls outside the current skill suite

In those cases, ask at most one focused question or choose the most conservative safe route and state the assumption.

## Test Prompts

### Test prompt: ambiguous generation request

Prompt:
> Build the WordPress asset for a hero area with editor reuse and make sure it is wired into the theme correctly.

Expected behaviour:

- detect ambiguity between pattern, template part, and styling work
- choose the most likely primary route or split the work into a short sequence
- call for parameter prep if needed
- include validator follow-up

### Test prompt: clear hierarchy template request

Prompt:
> Create `single.html` with header, footer, article hero pattern, and post content.

Expected behaviour:

- route directly to `wordpress-template-generator`
- note validator follow-up
- avoid routing through unrelated specialists unless needed

### Test prompt: boundary case

Prompt:
> Explain what WordPress patterns are.

Expected behaviour:

- do not force the full router workflow
- answer briefly or route lightly only if asset generation is actually requested

## References

- `references/workflow.md`
- `references/routing-matrix.md`
- `references/wordpress-rules.md`
- `references/output-templates.md`
- `references/qa-rubric.md`
