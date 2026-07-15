# Markdown Validation Rules

Use these rules for the combined content validator.

## Core checks

- exactly one H1 for document-style Markdown
- no heading level jumps such as H2 to H4
- no empty headings like `##` with no title
- no repeated headings when they appear accidental or duplicated
- no malformed inline links like `[text](missing`
- warn on local relative links that point to missing files when the target can be checked safely

## Interpretation

### Blocking failures

Treat these as failures when they materially break document structure:

- missing or invalid frontmatter in a document that requires it
- empty H1
- heading level jumps that make section hierarchy invalid
- malformed Markdown links

### Warnings

Treat these as warnings unless the user requested strict enforcement:

- repeated headings that may be intentional in different sections
- local links that cannot be checked safely from the current root
- minor style inconsistencies that do not break structure

## Boundaries

- do not enforce one house style for prose wording
- do not rewrite content automatically unless the user explicitly asks for fixes
- do not assume every non-Markdown extension should receive full heading validation

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
