---
name: wordpress-custom-template-generator
description: create wordpress block theme custom templates, matching template files and theme.json customtemplates entries for specific post types or editorial workflows. use when the user asks to register a custom template, create a page-specific template outside the default hierarchy, or generate both the template file and its theme.json registration.
---

# WordPress Custom Template Generator

## Purpose

Generate WordPress block theme custom templates as a paired deliverable:

- a template file in `/templates`
- a matching `customTemplates` entry in `theme.json`

This skill is for template needs that sit outside the normal hierarchy flow, such as named editorial layouts, landing-page layouts, or post-type-specific custom templates.

It does not replace the normal hierarchy-aware template generator for `index`, `single`, `page`, `archive`, or similar standard templates.

## Trigger Conditions

Use this skill when the request is about:

- registering a custom template in `theme.json`
- creating a named custom template for one or more post types
- generating both a custom template file and the required registration entry
- building a special-purpose page or post layout outside the default hierarchy

Do not use this skill for:

- normal hierarchy template generation only
- pattern-only generation
- template-part-only generation
- broad validation-only review

Those belong to the relevant specialist skills.

## Inputs

Accept any mix of:

- custom template purpose or title
- desired template name
- target post types
- required template parts
- required pattern slugs
- content requirements
- layout notes
- repository conventions

If the name, title, or `postTypes` values are incomplete, use `wordpress-asset-parameter-generator` behavior first and state assumptions.

## Fast Decision Flow

1. Confirm this is a custom template rather than a normal hierarchy template.
2. Normalize:
   - template name
   - human-readable title
   - `postTypes`
3. Draft the target file path in `/templates/{name}.html`.
4. Generate the matching `customTemplates` entry for `theme.json`.
5. Generate the template markup.
6. Include `core/post-content` when editable entry content must render.
7. Mark anything that should be reviewed by `wordpress-block-asset-validator`.

## Workflow

1. Inspect the request and capture confirmed facts only.
2. Choose a stable hyphen-case template name.
3. Draft the file path in `/templates`.
4. Generate the `theme.json` `customTemplates` entry with:
   - `name`
   - `title`
   - `postTypes`
5. Compose the template with shared parts and patterns where appropriate.
6. Add `core/post-content` when the template should render editable content.
7. Return the file path, template file, `theme.json` fragment, assumptions, and validation notes.

## Custom Template Rules

- Custom templates require both the file and the `theme.json` registration.
- The file lives in `/templates/{name}.html`.
- The registration belongs under `customTemplates` in `theme.json`.
- Use a stable hyphen-case `name`.
- Use a readable `title`.
- Make `postTypes` explicit when known.
- Include `core/post-content` when editable entry content must render.
- Keep reusable page sections in template parts or patterns where possible.

## Output Format

By default, return:

1. the intended file path
2. the complete template file
3. the `theme.json` fragment
4. assumptions
5. validation notes

Example output shape:

````markdown
## File path
/templates/content-canvas.html

## Template file
```html
<!-- wp:template-part {"slug":"header","tagName":"header"} /-->
<!-- wp:main -->
<main>
 <!-- wp:post-content /-->
</main>
<!-- /wp:main -->
<!-- wp:template-part {"slug":"footer","tagName":"footer"} /-->
```

## theme.json fragment
```json
{
  "customTemplates": [
    {
      "name": "content-canvas",
      "title": "Content Canvas",
      "postTypes": ["page", "post"]
    }
  ]
}
```

## Assumptions
- The template is intended for both pages and posts.

## Validation notes
- Confirm the post type list and title.
- Run the validator before commit.
````

## Safe Defaults

- choose a readable hyphen-case template name
- make `postTypes` explicit when there is enough evidence
- default to `page` only when the prompt gives no stronger signal
- include shared header and footer parts where appropriate
- include `core/post-content` when the template is meant to render editable content

## Failure Modes And Escalation

Escalate briefly when:

- the request is actually a normal hierarchy template request
- the requested `postTypes` do not match the stated use case
- the prompt lacks enough detail to choose a stable custom template name
- the user wants a file without the `theme.json` registration or the reverse

In those cases, ask at most one focused question or return a safe scaffold with explicit assumptions.

## Test Prompts

### Test prompt: editorial custom template

Prompt:
> Create a Content Canvas custom template for pages and posts with shared header and footer and editable entry content.

Expected behaviour:

- output `/templates/content-canvas.html`
- output a matching `customTemplates` fragment
- set `postTypes` to `page` and `post`
- include `core/post-content`
- recommend validator review

### Test prompt: landing-page template

Prompt:
> Build a Landing Page custom template for pages only. It should support a hero pattern and a simpler footer.

Expected behaviour:

- generate both the file and the registration fragment
- set `postTypes` to `page`
- include the requested reusable assets sensibly

### Test prompt: boundary case

Prompt:
> Create `single.html` for blog posts using the standard hierarchy.

Expected behaviour:

- do not treat this as custom-template work
- route to the normal template generator
- optionally mention that custom templates are for non-hierarchy editorial layouts

## References

- `references/workflow.md`
- `references/wordpress-rules.md`
- `references/output-templates.md`
- `references/qa-rubric.md`
