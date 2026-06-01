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
- Use `Block Types` when the pattern is meant to surface for a specific block context.
- Use `Template Types` when the pattern is meant as a starting point for a template context.
- Use `Post Types` when the pattern is intentionally scoped to certain content types.
- Keep the body as valid WordPress block markup suitable for theme patterns.

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
- include `Post Types` or related metadata if the scope is explicit
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
