"""Combined validator runner specification.

Purpose:
Run all validators together and produce a combined validation report.

The attached agent file tree is the source of truth for validator names,
example files, templates, schemas, tests, and reference paths. Do not rely
on workspace-only copies or outdated local filenames when running or
documenting this combined validation pack.

Must call or describe calling:
- validate-memory-hygiene.py
- validate-source-priority-consistency.py
- validate-template-schema-alignment.py
- validate-markdown-structure.py
- validate-links-and-references.py
- validate-business-context.py
- validate-starter-prompts.py

Output should follow:
- schemas/validation-report.schema.json
- templates/validation-report.template.md
"""
