# Content File Validator

This combined skill validates Markdown quality, YAML frontmatter, and semantic versioning in one pass.

## What changed in the merge

### Preserved

- the frontmatter schema, schema-customisation guidance, examples, README pattern, and test-driven structure from the YAML frontmatter validator
- the Markdown document-quality workflow and delivery expectations from the Markdown formatting validator

### Merged

- frontmatter validation and Markdown structure validation into one main script: `scripts/validate_content_files.py`
- SemVer field checks and version-increment enforcement into the same consolidated report
- overlapping skill instructions into one source of truth in `SKILL.md`

### Removed as duplicate or unnecessary

- separate validator scripts for frontmatter-only validation, because the combined script now covers that workflow
- duplicate metadata-only skill packaging, because one combined skill now owns the validation job
- the empty `assets/` scaffold, because no reusable asset templates are needed for this validator

## Audit inventory summary

### markdown-formatting-validation

- `SKILL.md` — merged into the combined skill instructions
- `agents/openai.yaml` — merged into the combined skill metadata
- `scripts/` — none
- `references/` — none
- `assets/` — none
- schemas — none
- examples — none
- README files — none
- test files — none
- config files — none

### yaml-frontmatter-validator

- `SKILL.md` — merged and renamed into the combined skill instructions
- `agents/openai.yaml` — merged into the combined skill metadata
- `scripts/validate_frontmatter.py` — replaced by `scripts/validate_content_files.py`
- `references/frontmatter.schema.yaml` — preserved and adapted as the main schema
- `references/schema-customisation.md` — preserved and tightened
- `references/example-frontmatter.md` — replaced by consolidated report and test examples
- `README.md` — preserved as merge summary and usage guide
- `tests/` — preserved as the basis for the new test examples
- `requirements.txt` — no longer needed because the merged package depends on the same libraries already imported by the main script and can be installed from environment defaults if present

## Main command

```bash
python scripts/validate_content_files.py \
  --target files \
  --schema references/frontmatter.schema.yaml \
  --report content-validation-report.md \
  --enforce-version-increment \
  --base-ref main
```
