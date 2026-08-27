---
name: wordpress-template-part-generator
description: create wordpress block theme template parts, shared part markup and template-part insertion patterns for headers, footers, sidebars, comments and other approved parts. use when the user asks to generate a template part, scaffold a part file in /parts, wire a template part into templates, or create a part that calls a pattern.
---

# WordPress Template Part Generator

## Purpose

Generate WordPress block theme template parts that are structurally correct, reusable, and aligned with official block theme conventions.

This skill creates:

- template part files in `/parts`
- standard template-part insertion markup
- template parts that include patterns
- shared layout parts such as headers, footers, sidebars, and comments areas

It does not generate full templates or register custom templates in `theme.json`.

## Trigger Conditions

Use this skill when the request is about:

- creating a header, footer, sidebar, comments, or similar template part
- scaffolding a new template part file in `/parts`
- generating template-part block markup for insertion into a template
- building a template part that calls a pattern
- standardizing template part slugs, tags, and structure

Do not use this skill for:

- full template generation
- pattern-only generation
- custom template registration
- broad theme compliance review

Those belong to the relevant specialist skills.

## Inputs

Accept any mix of:

- a part purpose or name
- theme or project conventions
- required slug
- preferred wrapper tag
- layout notes
- included pattern slugs
- block markup notes
- repository examples

If naming or metadata is unclear, use `wordpress-asset-parameter-generator` behavior first and state assumptions.

## Fast Decision Flow

1. Identify the part type:
   - header
   - footer
   - sidebar
   - comments
   - other approved shared part
2. Normalize slug, name, and wrapper tag.
3. Draft the file path in `/parts/{slug}.html`.
4. Generate the block markup for the part body.
5. If needed, generate insertion markup for templates.
6. Mark anything that should be reviewed by `wordpress-block-asset-validator`.

## Workflow

1. Inspect the request and extract confirmed facts.
2. Reuse a shared standard slug when appropriate:
   - `header`
   - `footer`
   - `sidebar`
   - `comments`
3. Choose a valid wrapper tag if the request needs one:
   - `div`
   - `article`
   - `aside`
   - `footer`
   - `header`
   - `main`
   - `section`
4. Draft the file path in `/parts`.
5. Generate valid block markup for the part.
6. If the part should include a pattern, insert it with block pattern markup.
7. Return the part file, insertion markup, assumptions, and validation notes.

## Template Part Rules

- Template parts live in `/parts/{slug}.html`.
- Template parts contain block markup only.
- Reuse standard shared slugs before inventing a new one.
- Do not create a new custom area unless the prompt or repository evidence clearly requires it.
- Use valid template-part insertion markup such as:

```html
<!-- wp:template-part {"slug":"header","tagName":"header"} /-->
```

- A template part may call a pattern when that is the approved workflow.
- Keep the part focused on reusable structure, not full-page responsibilities.

## Output Format

By default, return:

1. the intended file path
2. the complete template part file
3. insertion markup for templates
4. assumptions
5. validation notes

Example output shape:

```markdown
## File path
/parts/header.html

## Template part file
```html
<!-- wp:group {"tagName":"header","layout":{"type":"constrained"}} -->
<header class="wp-block-group">
 <!-- wp:pattern {"slug":"theme-slug/hero-default"} /-->
</header>
<!-- /wp:group -->
```

## Template insertion markup

```html
<!-- wp:template-part {"slug":"header","tagName":"header"} /-->
```

## Assumptions

- Reused the shared `header` slug.

## Validation notes

- Confirm the wrapper tag and pattern slug.
- Run the validator before commit.

```

## Safe Defaults

- reuse shared slugs for standard parts
- prefer semantic wrapper tags that match the part role
- keep block markup compact and reusable
- use pattern inclusion only where the request or workflow calls for it

## Failure Modes And Escalation

Escalate briefly when:

- the request would create unnecessary new shared areas
- the requested slug conflicts with an existing standard part without clear reason
- the part is actually a full template section that should be a pattern instead
- the prompt lacks enough structural detail to produce a useful part

In those cases, ask at most one focused question or return a safe scaffold with explicit assumptions.

## Test Prompts

### Test prompt: header part with pattern

Prompt:
> Create a header template part for the lsx theme that includes a hidden implementation pattern for the top hero shell.

Expected behaviour:

- output `/parts/header.html`
- reuse the `header` slug
- include pattern markup if appropriate
- provide template-part insertion markup
- recommend validator review

### Test prompt: sidebar part

Prompt:
> Build a standard sidebar template part for a block theme. Keep the slug conventional and use an appropriate wrapper tag.

Expected behaviour:

- output `/parts/sidebar.html`
- keep the slug stable
- use a sensible wrapper such as `aside`
- return valid block markup

### Test prompt: boundary case

Prompt:
> Create a full single post template with header, footer, and content.

Expected behaviour:

- do not treat this as template-part generation alone
- route to the template generator
- optionally mention that header and footer parts can be generated separately if needed

## References

- `references/workflow.md`
- `references/wordpress-rules.md`
- `references/output-templates.md`
- `references/qa-rubric.md`
