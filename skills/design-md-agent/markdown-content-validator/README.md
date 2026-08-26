# Markdown Content Validator

This skill validates markdown-oriented content files for:

- markdown structure and formatting quality
- YAML frontmatter presence and schema compliance
- required SemVer version fields
- optional changed-without-version-increment checks
- consolidated markdown reporting

## Run the validator

```bash
python scripts/validate_markdown_content.py \
  --target files \
  --schema references/frontmatter.schema.yaml \
  --report markdown-content-validation-report.md
```

Add `--enforce-version-increment --base-ref main` when you want changed-file version checks.
