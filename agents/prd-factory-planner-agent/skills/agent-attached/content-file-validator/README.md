# Content File Validator

Merged validator skill for Markdown quality, YAML frontmatter schema compliance, required SemVer version fields, and optional version increment checks.

## Package contents

- `SKILL.md`
- `agents/openai.yaml`
- `scripts/validate_content_files.py`
- `references/frontmatter.schema.yaml`
- `references/markdown-validation-rules.md`
- `references/semver-versioning-rules.md`
- `references/schema-customisation.md`
- `references/example-validation-report.md`
- `tests/`
- `requirements.txt`

## Suggested CLI

```bash
python scripts/validate_content_files.py \
  --target files \
  --schema references/frontmatter.schema.yaml \
  --report content-validation-report.md \
  --enforce-version-increment \
  --base-ref main
```
