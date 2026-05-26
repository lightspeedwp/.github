# Workflow

## Purpose

This reference expands the template-part generation sequence.

## Standard Sequence

1. Identify the part type and whether it is truly a shared reusable part.
2. Normalize the slug and wrapper tag.
3. Draft the target path in `/parts/{slug}.html`.
4. Generate valid block markup for the part body.
5. Add template-part insertion markup when useful.
6. Return assumptions and validation notes.

## Pattern Inclusion

When a template part should call a pattern:

- keep the part itself focused and reusable
- use block pattern insertion markup
- confirm the pattern slug is namespaced

## Things To Avoid

- inventing unnecessary shared part names
- nesting full template responsibilities inside a part
- using invalid wrapper tags
- drifting outside `/parts`
