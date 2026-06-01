---
name: wordpress-asset-parameter-generator
description: normalize and generate wordpress block theme asset parameters, metadata headers, theme.json entries and starter values for patterns, template parts, templates and custom templates. use when the user asks to prepare asset parameters, fill required metadata, standardize headers, or scaffold block theme asset inputs before generation or validation.
---

# WordPress Asset Parameter Generator

## Purpose

Generate and normalize the parameters needed to create WordPress block theme assets consistently.

This skill prepares structured inputs for:

- patterns
- template parts
- templates
- custom templates
- related style tasks when they depend on asset metadata or naming

It does not generate final production asset files unless the user explicitly asks for starter scaffolds.

## Trigger Conditions

Use this skill when the request is about:

- filling in missing pattern header fields
- normalizing slugs, names, titles, categories, areas, tags, or post types
- preparing a `customTemplates` entry for `theme.json`
- deciding which parameters are required before a specialist skill runs
- converting rough notes, Figma handoff, or a client brief into structured asset metadata

Do not use this skill as the final generator for full templates, template parts, or patterns when a specialist asset skill is more appropriate.

## Inputs

Accept any mix of:

- a requested asset type
- rough asset name or purpose
- project or theme slug
- block markup notes
- Figma handoff notes
- client briefs
- repository conventions
- existing theme file examples
- known post types, block types, template types, or pattern categories

If one or two fields are missing, use safe defaults and state assumptions. Ask one focused question only when a missing value materially changes the output.

## Fast Decision Flow

1. Identify the asset type:
   - pattern
   - template part
   - template
   - custom template
   - asset validation prep
2. Extract any confirmed values from the prompt or source files.
3. Apply WordPress rules for that asset type.
4. Fill missing required parameters with safe defaults or explicit blanks only where the team convention requires them.
5. Return structured parameters plus notes for the downstream generator or validator.

## Workflow

1. Inspect the source material and capture only confirmed facts.
2. Determine which asset-specific parameter set is needed.
3. Normalize names:
   - use lowercase hyphen-case slugs
   - keep human-facing titles readable
   - namespace pattern slugs with the theme slug
4. Apply asset rules:
   - patterns use PHP file headers and metadata
   - template parts map to `/parts/{slug}.html`
   - templates map to `/templates/{name}.html`
   - custom templates also require a `customTemplates` entry in `theme.json`
5. Produce one of these outputs:
   - parameter object
   - starter header block
   - starter `theme.json` fragment
   - parameter checklist for missing inputs
6. Flag anything that should be validated by `wordpress-block-asset-validator`.

## Asset Rules

### Patterns

- Prefer `/patterns/*.php` auto-registration unless the user explicitly needs manual PHP registration.
- Generate all supported pattern header keys:
  - `Title`
  - `Slug`
  - `Categories`
  - `Description`
  - `Viewport Width`
  - `Inserter`
  - `Keywords`
  - `Block Types`
  - `Post Types`
  - `Template Types`
- Use namespaced slugs such as `theme-slug/hero-default`.
- Default `Inserter` to `true` unless the pattern is implementation-only.
- Prefer core categories before custom categories.
- Use blank header values only where the working convention explicitly calls for full-key headers even when data is missing.

### Template Parts

- Target file path: `/parts/{slug}.html`
- Template parts contain block markup only.
- Use standard part slugs when appropriate:
  - `header`
  - `footer`
  - `sidebar`
  - `comments`
- If a tag is needed, keep it to valid wrapping tags:
  - `div`
  - `article`
  - `aside`
  - `footer`
  - `header`
  - `main`
  - `section`
- Do not introduce a new area unless the user explicitly requests it or repository evidence supports it.

### Templates

- Target file path: `/templates/{name}.html`
- Use block theme hierarchy-aware names such as `index`, `home`, `single`, `page`, `archive`, `404`.
- `index.html` is the minimum required template for a block theme.
- Templates may reference template parts and patterns.

### Custom Templates

- Require both:
  - `/templates/{name}.html`
  - a `customTemplates` entry in `theme.json`
- Generate `name`, `title`, and `postTypes`.
- Default `postTypes` to `page` only when no better evidence exists.
- Include a note to add `core/post-content` when the template must render editable entry content.

## Output Formats

Return outputs in compact, reusable forms.

### Pattern Parameter Object

```json
{
  "assetType": "pattern",
  "filePath": "/patterns/hero-default.php",
  "title": "Hero Default",
  "slug": "theme-slug/hero-default",
  "categories": ["banner"],
  "description": "",
  "viewportWidth": "",
  "inserter": true,
  "keywords": [],
  "blockTypes": [],
  "postTypes": [],
  "templateTypes": []
}
```

### Pattern Header Scaffold

```php
<?php
/**
 * Title: Hero Default
 * Slug: theme-slug/hero-default
 * Categories: banner
 * Description:
 * Viewport Width:
 * Inserter: true
 * Keywords:
 * Block Types:
 * Post Types:
 * Template Types:
 */
?>
```

### Custom Template Fragment

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

## Validation Handoff

Send the result to `wordpress-block-asset-validator` when:

- a pattern header is generated
- a template part slug or area is unusual
- a template name may conflict with hierarchy expectations
- a custom template is prepared for `theme.json`
- source inputs contain contradictory naming

## Failure Modes And Escalation

Escalate briefly when:

- the asset type is unclear after reasonable inference
- repository conventions conflict with official WordPress behavior
- the requested metadata would create a non-standard area or misleading hierarchy name
- the user asks for invented values that should come from product, editorial, or design decisions

In those cases, state the conflict, make the smallest safe assumption if possible, and mark the field for confirmation.

## Test Prompts

### Test prompt: pattern metadata from brief

Prompt:
> Prepare the parameters for a hidden CTA implementation pattern for the lsx theme. It should live in the patterns folder, not show in the inserter, and be usable in a page template.

Expected behaviour:

- produce a namespaced pattern slug
- set `Inserter` to `false`
- prepare the full pattern header keys
- include `Template Types` guidance if applicable

### Test prompt: custom template from rough request

Prompt:
> I need a Content Canvas custom template for pages and posts with header, footer, and editable content. Give me the parameters and the theme.json fragment.

Expected behaviour:

- produce a `/templates/content-canvas.html` target
- produce a `customTemplates` fragment
- keep `postTypes` as `page` and `post`
- note that the final template should include `core/post-content`

### Test prompt: boundary case

Prompt:
> Build the final footer template part HTML and commit it to the repo.

Expected behaviour:

- do not pretend this skill is the final asset generator
- provide normalized parameters for the footer template part
- route the final asset work to the template-part generator

## References

- `references/workflow.md`
- `references/wordpress-rules.md`
- `references/output-templates.md`
- `references/qa-rubric.md`
