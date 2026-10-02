---
name: wordpress-pattern-generator
description: create wordpress block theme pattern files, php pattern headers, starter patterns, block-type patterns and template-usage patterns from briefs, figma handoff, block markup notes or repository conventions. use when the user asks to generate a wordpress pattern, scaffold a pattern file, create a hidden implementation pattern, or prepare a theme pattern for template or editor use.
---

# WordPress Pattern Generator

## Purpose

Generate WordPress block theme pattern files that align with official pattern behavior and LightSpeed-style consistency.

This skill creates:

- theme pattern PHP files
- starter patterns
- block-type patterns
- template-usage patterns
- hidden implementation-only patterns

It prefers theme `/patterns/*.php` auto-registration and does not default to manual PHP registration unless the user explicitly needs it.

## Trigger Conditions

Use this skill when the request is about:

- creating a new WordPress block theme pattern
- scaffolding a pattern file with the correct metadata header
- turning a brief, Figma handoff, or block outline into a pattern
- building a starter pattern for a page type such as About or Contact
- generating a hidden implementation pattern for a template or template part

Do not use this skill for:

- full template generation
- template part generation
- `theme.json` custom template registration
- broad theme validation reviews

Those belong to the relevant specialist skills.

## Inputs

Accept any mix of:

- a pattern purpose or name
- theme slug
- block markup notes
- Figma handoff or layout notes
- content constraints
- editor visibility expectations
- intended categories
- intended block types, post types, or template types
- repository conventions or example patterns

If required metadata is incomplete, call on `wordpress-asset-parameter-generator` behavior first and state any assumptions.

## Fast Decision Flow

1. Identify the pattern type:
   - general inserter pattern
   - starter pattern
   - block-type pattern
   - template-usage pattern
   - hidden implementation pattern
2. Normalize the metadata.
3. Determine path and filename in `/patterns`.
4. Generate the PHP header and block markup body.
5. Mark anything that needs validation by `wordpress-block-asset-validator`.

## Workflow

1. Inspect the request and pull out confirmed facts only.
2. Decide whether the pattern is user-facing or implementation-only.
3. Normalize the metadata:
   - title
   - namespaced slug
   - categories
   - description
   - viewport width
   - inserter value
   - keywords
   - block types
   - post types
   - template types
4. Draft the file path in `/patterns/{pattern-name}.php`.
5. Generate the standard PHP header.
6. Generate the block markup body.
7. Return the pattern file plus assumptions and a validation handoff note.

## Pattern Rules

- Prefer `/patterns/*.php` auto-registration.
- Always use a namespaced slug such as `theme-slug/hero-default`.
- Prefer WordPress core categories before custom categories.
- Use `Inserter: false` for hidden implementation-only patterns.
- Use `Block Types` when the pattern is meant to surface for a specific block context. For a starter page pattern it is mandatory, not optional — see the starter-pattern rule below.
- Use `Template Types` when the pattern is meant as a starting point for a template context. This is what makes it a starter template pattern, and such a pattern needs no `Block Types`.
- Use `Post Types` when the pattern is intentionally scoped to certain content types.
- Starter patterns come in two kinds. A starter *page* pattern needs `Block Types: core/post-content`; a starter *template* pattern needs `Template Types`. Do not require `core/post-content` of a template pattern.
- Keep the body as valid WordPress block markup suitable for theme patterns.

## Starter Patterns

WordPress has two kinds of starter pattern, and they are registered differently.

### Starter page patterns

A page pattern appears in the new-post-type picker only when all of the following hold:

- `Block Types` includes `core/post-content`. This is the hard gate: the editor filters the registered patterns down to those carrying that block type before it looks at anything else, so a pattern with `Post Types: page` but no `Block Types` never appears.
- `Post Types` names the post types the pattern is offered for. Omitting the field does **not** mean every post type: the filter accepts an absent `postTypes` only when the current post type is `page`, so an omitted field offers the pattern for pages alone.

So a page starter pattern needs only `Block Types: core/post-content`. Omitting `Post Types` offers it for pages, which is the same outcome as `Post Types: page`; naming other post types as well widens it, for example `page, wp_template`. The core filter is:

```js
( postType === 'page' && ! pattern.postTypes ) ||
( Array.isArray( pattern.postTypes ) && pattern.postTypes.includes( postType ) )
```

which is why neither field alone makes a non-page pattern appear for that post type.

### Starter template patterns

A template pattern appears in the Site Editor when creating a new template. It is keyed on `Template Types` instead:

- `Template Types` names one or more template types, separated by commas (for example `front-page, home`).
- `Block Types` is not required and not consulted. Do not add `core/post-content` to a template pattern; it represents a whole template, including header, footer and sidebar regions.
- `Inserter: false` is usually set, so the pattern does not also clutter the inserter.

See [Starter patterns](https://developer.wordpress.org/themes/patterns/starter-patterns/).

## Pattern Header Template

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

## Output Format

By default, return:

1. the intended file path
2. the complete PHP pattern file
3. assumptions
4. validation notes

Example output shape:

```markdown
## File path
/patterns/hero-default.php

## Pattern file
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
<!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group"></div>
<!-- /wp:group -->
```

## Assumptions

- Theme slug is `theme-slug`.

## Validation notes

- Confirm category choice.
- Run the block asset validator before commit.

```

## Safe Defaults

- `Inserter: true` unless the pattern is implementation-only
- core categories before custom categories
- blank optional metadata values only where the working convention expects the full header set
- minimal valid block structure rather than decorative filler

## Failure Modes And Escalation

Escalate briefly when:

- the request mixes template and pattern responsibilities unclearly
- the user asks for a non-namespaced slug
- the category strategy conflicts with repository conventions
- the prompt lacks enough content intent to produce a meaningful body

In those cases, ask at most one focused question or return a safe scaffold with explicit assumptions.

## Test Prompts

### Test prompt: hidden implementation pattern

Prompt:
> Create a hidden hero CTA implementation pattern for the lsx theme. It should be used inside a page template and not appear in the inserter.

Expected behaviour:

- produce a namespaced slug
- set `Inserter: false`
- output a full PHP header
- include a valid block markup body
- note that the validator should check the final result

### Test prompt: starter pattern

Prompt:
> Build a Contact page starter pattern for a block theme. It should be available for pages and use the best core category match.

Expected behaviour:

- output a complete pattern file
- use a suitable core category where possible
- include `Block Types: core/post-content`; that alone makes it a starter page pattern. `Post Types` is optional and names which post types see it — omit it, or use `page`, and the pattern is offered for pages
- do not require `Template Types` here; this is a page starter, not a template starter
- keep the output aligned with starter-pattern usage

### Test prompt: boundary case

Prompt:
> Register a new custom template in theme.json and create the matching template file.

Expected behaviour:

- do not treat this as pattern generation
- route to the custom-template generator
- optionally mention that patterns may later be used inside that template

## References

- `references/workflow.md`
- `references/wordpress-rules.md`
- `references/output-templates.md`
- `references/qa-rubric.md`

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/.github/graphs/contributors)
