"""Markdown structure validator specification.

Checks:
- Required files contain required headings.
- Required headings appear in the required order.
- Duplicate headings are flagged.
- Empty required sections are flagged.
- Placeholder text is flagged.
- Tables have headers and separator rows.
- Markdown files do not contain accidental raw notes intended for the builder only.
- business-context.md, memory files, templates, examples, and references follow their required structures.

Severity rules:
- Missing required heading -> Error
- Duplicate heading -> Warning
- Placeholder text -> Warning
- Empty optional section -> Notice
"""
