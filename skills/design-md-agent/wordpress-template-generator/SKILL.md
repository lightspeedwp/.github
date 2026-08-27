---
name: wordpress-template-generator
description: create wordpress block theme templates, hierarchy-aware template files and template markup that composes template parts, patterns and post content correctly. use when the user asks to generate a block theme template, scaffold index home single archive or page templates, or build a template from approved parts and patterns.
---

# WordPress Template Generator

## Purpose

Generate WordPress block theme templates that follow the official template hierarchy and compose reusable theme assets cleanly.

This skill creates:

- base block theme templates
- hierarchy-aware templates such as `index`, `home`, `single`, `page`, `archive`, and `404`
- templates that include template parts
- templates that include patterns
- templates that render editable post content where appropriate

It does not register custom templates in `theme.json`. That belongs to the custom-template generator.

## Trigger Conditions

Use this skill when the request is about:

- creating a block theme template file in `/templates`
- scaffolding a hierarchy-aware template such as `index.html` or `single.html`
- composing a template from header, footer, patterns, and content blocks
- generating the main template structure for a block theme page or content type

Do not use this skill for:

- pattern-only generation
- template-part-only generation
- `theme.json` `customTemplates` registration
- broad review-only validation tasks

Those belong to the relevant specialist skills.

## Inputs

Accept any mix of:

- a requested template name or purpose
- theme or repository conventions
- required template parts
- required pattern slugs
- content requirements
- post type context
- layout notes
- existing theme examples

If required structure is unclear, use `wordpress-asset-parameter-generator` behavior first and state assumptions.

## Fast Decision Flow

1. Identify the template type:
   - `index`
   - `home`
   - `single`
   - `page`
   - `archive`
   - `404`
   - another hierarchy-aligned template
2. Normalize the template name and target path.
3. Decide which template parts and patterns belong in the composition.
4. Generate the full block markup.
5. Include `core/post-content` when the template should render editable entry content.
6. Mark anything that should be reviewed by `wordpress-block-asset-validator`.

## Workflow

1. Inspect the request and extract confirmed facts.
2. Choose the correct hierarchy-aware template filename.
3. Draft the target path in `/templates/{name}.html`.
4. Add template parts such as header and footer where appropriate.
5. Add patterns where the request or workflow calls for them.
6. Add `core/post-content` when the template is meant to render editable post or page content.
7. Return the template file, assumptions, and validation notes.

## Template Rules

- Templates live in `/templates/{name}.html`.
- `index.html` is the minimum required template for a block theme.
- Template filenames should align with the WordPress template hierarchy.
- Templates contain block markup only.
- Templates may include template parts with markup such as:

```html
<!-- wp:template-part {"slug":"header","tagName":"header"} /-->
```

- Templates may include patterns with markup such as:

```html
<!-- wp:pattern {"slug":"theme-slug/hero-default"} /-->
```

- Use `core/post-content` when entry content must render in the template.
- Keep reusable sections in template parts or patterns rather than duplicating them in every template.

## Output Format

By default, return:

1. the intended file path
2. the complete template file
3. assumptions
4. validation notes

Example output shape:

````markdown
## File path
/templates/single.html

## Template file
```html
<!-- wp:template-part {"slug":"header","tagName":"header"} /-->
<!-- wp:main -->
<main>
 <!-- wp:pattern {"slug":"theme-slug/article-hero"} /-->
 <!-- wp:post-content /-->
</main>
<!-- /wp:main -->
<!-- wp:template-part {"slug":"footer","tagName":"footer"} /-->
```

## Assumptions
- Reused shared `header` and `footer` parts.

## Validation notes
- Confirm the hierarchy choice and pattern slug.
- Run the validator before commit.
````

## Safe Defaults

- reuse shared `header` and `footer` template parts where appropriate
- use hierarchy-aligned names instead of invented template names
- include `core/post-content` for content-rendering templates
- keep repeated sections in patterns or parts, not duplicated inline

## Failure Modes And Escalation

Escalate briefly when:

- the requested template name conflicts with hierarchy expectations
- the request actually needs a custom template rather than a hierarchy template
- the prompt mixes template and pattern responsibilities too loosely
- the prompt lacks enough structure to produce a useful composition

In those cases, ask at most one focused question or return a safe scaffold with explicit assumptions.

## Test Prompts

### Test prompt: single template

Prompt:
> Create a `single.html` template for the lsx theme with shared header and footer, an article hero pattern, and editable post content.

Expected behaviour:

- output `/templates/single.html`
- use hierarchy-aware naming
- include header and footer template parts
- include the pattern slug
- include `core/post-content`
- recommend validator review

### Test prompt: baseline index template

Prompt:
> Build the minimum `index.html` template for a block theme using reusable shared parts where appropriate.

Expected behaviour:

- output `/templates/index.html`
- keep the structure simple and valid
- reflect that `index.html` is the baseline template

### Test prompt: boundary case

Prompt:
> Register a new landing-page template in theme.json for pages only and create the file.

Expected behaviour:

- do not treat this as a plain hierarchy template request
- route to the custom-template generator
- optionally mention that the template markup itself will still resemble a normal template file

## References

- `references/workflow.md`
- `references/wordpress-rules.md`
- `references/output-templates.md`
- `references/qa-rubric.md`
