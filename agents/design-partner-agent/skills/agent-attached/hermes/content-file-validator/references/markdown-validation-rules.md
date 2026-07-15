# Markdown validation rules

The combined validator treats Markdown quality as part of content readiness, not as cosmetic cleanup.

## Core checks

The validator checks for:

- missing H1 headings
- duplicate H1 headings
- heading level jumps such as H2 to H4
- empty headings
- repeated headings
- malformed Markdown link syntax when detectable safely
- broken local links when the relative target can be resolved

## Interpretation guidance

These checks are intentionally conservative.

- A file should fail when structure is clearly broken.
- A file should warn when a likely problem exists but the validator cannot prove intent.
- The validator should not invent heading repairs automatically.

## Good practices

- keep one H1 per document
- use H2 for major sections
- avoid skipping heading levels
- keep section headings distinct and informative
- prefer valid relative links for local references
