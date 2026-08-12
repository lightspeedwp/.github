"""Business context completeness validator specification.

Checks:
- business-context.md has all required sections.
- Key sections are not placeholders.
- Agency profile is present.
- Stakeholder list is present.
- Commercial concerns are present.
- Reporting style is present.
- Source priority is present.
- Current business rules are present.
- Known context gaps are explicit.
- Matured agent topics are added when relevant.

Severity rules:
- Missing required section -> Error
- Placeholder content -> Warning
- Missing matured topic -> Notice
"""
