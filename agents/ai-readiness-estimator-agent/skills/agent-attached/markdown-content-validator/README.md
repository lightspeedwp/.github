# Markdown Content Validator

Reusable skill package for validating markdown files, YAML frontmatter, SemVer version fields, and version-bump checks with one consolidated markdown report.

## Main entrypoint

```bash
python scripts/validate_markdown_content.py --target files --schema references/frontmatter.schema.yaml --report markdown-content-validation-report.md
```
