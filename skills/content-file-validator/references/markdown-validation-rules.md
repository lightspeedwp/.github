# Markdown Validation Rules

Use these rules when validating Markdown, template, and documentation files.

## Core Structural Checks

- YAML frontmatter, when required, must be the first block in the file.
- A document should normally contain exactly one H1 heading unless the format explicitly allows otherwise.
- Heading levels should not jump by more than one level at a time.
- Headings must not be empty after Markdown markers are stripped.
- Duplicate headings should be flagged when they create ambiguity or repeated section labels.

## Link Checks

Check links conservatively:

- fail malformed Markdown links such as empty destinations
- fail local file links that point to missing files when the path can be resolved safely
- fail local anchor links when the target heading cannot be found in the same file
- warn, rather than fail, for remote URLs that cannot be verified without network access

## Cleanliness Checks

- unmatched fenced code blocks should fail validation
- repeated blank heading markers or placeholder headings should fail validation
- repeated metadata below the H1 should be flagged when frontmatter already holds that metadata
- obvious formatting artefacts or duplicated section labels should be reported

## Failure Priorities

Prioritise these issues first:

1. malformed or missing frontmatter when required
2. broken heading hierarchy
3. empty or duplicate headings
4. broken local links or malformed link syntax
5. unmatched code fences and obvious structural noise

## Notes

- Structural correctness matters more than decorative formatting.
- Prefer one clear heading hierarchy over visually clever formatting.
- The validator should report issues precisely enough that the user can fix them without guessing.
