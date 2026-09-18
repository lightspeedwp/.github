# Content File Validator Merge Notes

## Merge Inventory

| Source skill | File | Decision | Notes |
|---|---|---|---|
| markdown-formatting-validator | `SKILL.md` | merged | Preserved the Markdown workflow, polish rules, and structural QA guidance, but narrowed it to validation rather than rewrite-first formatting. |
| markdown-formatting-validator | `agents/openai.yaml` | merged | Replaced with combined skill metadata aligned to the new validator scope. |
| markdown-formatting-validator | `references/markdown-quality-checklist.md` | renamed and merged | Preserved the useful checklist ideas and consolidated them into `references/markdown-validation-rules.md` as the Markdown source of truth. |
| yaml-frontmatter-validator | `SKILL.md` | merged | Preserved deterministic validation workflow, schema use, version rules, and reporting model. |
| yaml-frontmatter-validator | `agents/openai.yaml` | merged | Replaced with combined skill metadata aligned to the merged validator scope. |
| yaml-frontmatter-validator | `references/frontmatter.schema.yaml` | kept with minor extension | Preserved the schema and added `documentation` as an allowed `type` value for broader documentation coverage. |
| yaml-frontmatter-validator | `scripts/validate_frontmatter.py` | merged and renamed | Replaced by `scripts/validate_content_files.py`, which retains frontmatter/version checks and adds Markdown structure and link validation. |

## Removed As Duplicate Or Noise

- The separate Markdown-only and frontmatter-only skill identities were removed in favour of one combined validator.
- The old Markdown checklist file was not kept as a second checklist because its useful rules now live in `references/markdown-validation-rules.md`.
- No scaffold placeholder files were kept.

## Preserved

- YAML frontmatter schema validation
- required `version` field enforcement
- SemVer validation and version-increment checking
- deterministic Markdown report generation
- Markdown structural QA guidance

## Test Commands

```bash
python scripts/validate_content_files.py \
  --target tests \
  --schema references/frontmatter.schema.yaml \
  --report test-report.md

python scripts/validate_content_files.py \
  --target tests \
  --schema references/frontmatter.schema.yaml \
  --report valid-report.md \
  --include valid-example.md
```
