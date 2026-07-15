# Markdown Validation Rules

## Purpose

These rules define the practical markdown checks that the validator should enforce or report.

## Blocking errors

Treat these as failures by default:

- missing YAML frontmatter at the top of the file
- malformed or unclosed frontmatter
- invalid YAML frontmatter
- heading level jumps that make document structure unclear
- unclosed code fences
- missing required schema fields
- invalid field values that violate the schema
- invalid SemVer format in `version`

## Warnings

Treat these as warnings unless the project explicitly tightens them:

- duplicate headings
- malformed external links
- inconsistent bullet markers within the same list block
- empty code fences
- possible invalid table formatting
- missing final newline
- unverifiable or unchanged versions when version increment checking is enabled

## Style suggestions

Treat these as optional improvements:

- repeated blank lines
- trailing whitespace
- excessively long headings
- internal links that cannot be verified automatically
- title patterns that are inconsistent with the rest of the project

## Project adaptation guidance

Keep the validator practical. Do not force every style preference into a hard failure.

If the project already has documented markdown rules, adapt the warning and suggestion thresholds before introducing stricter blocking rules.
