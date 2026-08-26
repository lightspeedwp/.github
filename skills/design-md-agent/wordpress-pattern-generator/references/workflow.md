# Workflow

## Purpose

This reference expands the pattern-generation sequence.

## Standard Sequence

1. Identify the pattern type and intended use.
2. Normalize metadata with the parameter-generator behavior.
3. Choose a stable filename and namespaced slug.
4. Write the full PHP header.
5. Generate valid block markup for the pattern body.
6. Return assumptions and validation notes.

## Pattern Type Hints

- General inserter pattern: visible in the inserter, likely core category based.
- Starter pattern: often used for page-building starting points.
- Block-type pattern: include `Block Types` metadata.
- Template-usage pattern: include `Template Types` metadata where appropriate.
- Hidden implementation pattern: `Inserter: false`.

## Things To Avoid

- unnamespaced slugs
- inventing unnecessary custom categories
- mixing template responsibilities into the pattern file
- decorative filler code that does not reflect the prompt
