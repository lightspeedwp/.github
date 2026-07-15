# Markdown Validation Rules

Use these default rules as a practical baseline. Tighten or relax them only when the project has a stronger established documentation standard.

## Blocking errors

Use blocking errors for issues that make the file invalid, hard to parse, or unsafe to ship:

- missing YAML frontmatter
- any content before the opening `---`
- invalid YAML frontmatter
- missing required frontmatter fields
- frontmatter values that violate schema rules
- missing `version`
- invalid SemVer format
- unclosed code fences
- empty code fences when the fence clearly should contain example content
- broken internal markdown links to local files or anchors that can be checked deterministically

## Warnings

Use warnings for problems that should usually be fixed before shipping but may not always block release:

- skipped heading levels
- duplicate headings
- malformed external links
- inconsistent table column counts
- mixed bullet styles within the same list block
- repeated blank lines
- missing final newline
- excessively long headings
- files that changed without a verified version bump when the comparison data is unavailable

## Style suggestions

Use style suggestions for consistency improvements that do not automatically make the file invalid:

- trailing whitespace
- empty headings
- inconsistent title structure
- heading hierarchy that is valid but uneven
- dense list formatting that may be hard to scan

## Rule placement guidance

- Keep deterministic parsing and validation logic in the script.
- Keep adjustable project policy in the schema and reference docs.
- Keep editorial nuance in documentation-only guidance unless it can be checked reliably.
- Prefer warnings over hard failures when a rule is helpful but not universally correct.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
