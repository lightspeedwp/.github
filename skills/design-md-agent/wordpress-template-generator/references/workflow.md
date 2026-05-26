# Workflow

## Purpose

This reference expands the template-generation sequence.

## Standard Sequence

1. Identify the hierarchy role of the template.
2. Normalize the filename and target path.
3. Choose shared template parts and patterns.
4. Generate valid block markup for the full template.
5. Include `core/post-content` where content must render.
6. Return assumptions and validation notes.

## Composition Guidance

- Put reusable page sections in template parts or patterns.
- Keep the template focused on composition and hierarchy role.
- Use semantic structure where block markup makes that intent clear.

## Things To Avoid

- inventing non-standard hierarchy names without reason
- duplicating reusable structures inline
- omitting `core/post-content` where entry content must render
- treating a custom template request as a normal hierarchy template
