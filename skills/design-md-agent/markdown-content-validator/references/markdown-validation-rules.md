# Markdown Validation Rules

## Default posture

Use practical validation that is easy to explain, maintain, and test. Prefer deterministic checks that can be implemented reliably in the validator script. Reserve softer stylistic guidance for warnings or suggestions.

## Blocking errors

Treat these as blocking by default:

- missing frontmatter or frontmatter not at the top of the file
- invalid YAML frontmatter
- missing required frontmatter fields
- invalid enum values or schema violations
- missing `version`
- invalid SemVer `version` format
- unclosed code fences
- empty headings
- heading level jumps greater than one level
- malformed markdown links when the URL or target is clearly invalid
- changed file without a version increment when version enforcement is enabled and a base reference is available

## Warnings

Treat these as warnings by default:

- duplicate headings
- empty code fences
- repeated blank lines
- trailing whitespace
- missing final newline
- inconsistent bullet styles inside the same list block
- local anchor links that do not match any detected heading anchor
- very long headings
- suspicious table separator rows

## Suggestions

Treat these as suggestions unless the project explicitly tightens them:

- title/frontmatter mismatch where the intent is still understandable
- inconsistent heading wording across sibling sections
- optional style consistency improvements that do not affect parsing or downstream use

## What should remain configurable

Keep these project-tunable rather than hard-coded as universal failures:

- maximum heading length
- whether duplicate headings are warnings or failures
- whether bullet-style consistency is enforced globally or per list
- which file extensions count as content files
- include and exclude glob defaults
- whether broken local anchors are warnings or failures
