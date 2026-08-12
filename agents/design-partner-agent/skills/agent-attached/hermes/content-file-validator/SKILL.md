---
name: content-file-validator
description: The content-file-validator skill helps users ensure the integrity and readiness of their content files by validating Markdown structure, YAML frontmatter, and semantic versioning in one comprehensive pass. Use this skill when you need to check various file types for quality and compliance, generating a single detailed report that highlights issues and suggested fixes.
---

Use this skill when the user wants one combined validation pass across Markdown, template-style, schema, and handoff files.

## When to use this skill

Use `$content-file-validator` when the user wants to:

- validate Markdown structure and content quality before final delivery
- validate YAML frontmatter placement, parsing, schema compliance, and required metadata
- require a `version` field in semantic version format
- check whether changed files incremented `version`
- validate mustache placeholders in templates against the relevant schema files
- validate that intake captures the required values for the next workflow step
- validate that a handoff template, manifest, and schema set stay aligned
- generate one consolidated report instead of separate Markdown, frontmatter, and handoff checks

Do not use this skill to overwrite files unless the user explicitly asks for auto-fix behavior.

## File types this skill scans

Default target root: `files/`

Default file types:

- `.md`
- `.mdx`
- `.html`
- `.php`
- `.twig`
- `.njk`
- `.liquid`
- `.yml`
- `.yaml`

Allow include and exclude glob overrides when the project needs them.

Default excludes:

- `node_modules/**`
- `vendor/**`
- `.git/**`
- `dist/**`
- `build/**`
- `.next/**`
- `coverage/**`

## Combined validation workflow

1. Choose the target directory. Default to `files/` unless the user provides another content root.
2. Run `scripts/validate_content_files.py`.
3. Validate Markdown quality and structure.
4. Validate YAML frontmatter placement, parsing, schema compliance, and required metadata.
5. Validate `version` as semantic versioning in `MAJOR.MINOR.PATCH` format.
6. If baseline comparison is available, check whether changed files incremented `version`.
7. If a handoff manifest is available, validate every registered template and matching schema.
8. Validate mustache placeholders against the matching handoff schema.
9. Validate that required intake values and downstream-required values are captured by the handoff artifact.
10. Return one consolidated report with summary counts, failed files, warnings, suggested fixes, and recommended next actions.

## Handoff validation behavior

When a handoff manifest is provided, the validator must:

- read the manifest and enumerate all registered handoff templates
- confirm that every manifest entry has both a template file and a schema file
- validate template required sections
- validate template mustache placeholders against the schema's required and optional placeholders
- flag unknown placeholders not declared in the schema
- flag required placeholders missing from the template
- flag required intake values that are not represented in the handoff structure
- flag required downstream values that are missing for the next workflow step
- flag mismatches between manifest target, schema target, and template intent

If no handoff templates exist for a workflow that clearly needs them, call that out as a validation gap instead of pretending the output set is complete.

Use `references/handoff-validation-rules.md` when interpreting handoff-specific failures.

## Recommended command flow

Basic validation:

```bash
python scripts/validate_content_files.py \
  --target files \
  --schema references/frontmatter.schema.yaml \
  --report content-validation-report.md
```

Validation with handoff manifest checks:

```bash
python scripts/validate_content_files.py \
  --target /workspace/agent_files \
  --schema references/frontmatter.schema.yaml \
  --handoff-manifest /workspace/agent_files/docs/handoff-templates/manifest.yaml \
  --include 'docs/**/*.md' \
  --include 'docs/**/*.yaml' \
  --report content-validation-report.md
```

Validation with version increment enforcement from Git history:

```bash
python scripts/validate_content_files.py \
  --target files \
  --schema references/frontmatter.schema.yaml \
  --report content-validation-report.md \
  --enforce-version-increment \
  --base-ref main
```

## How to interpret reports

The report separates:

- summary metrics
- failed files
- passed files
- Markdown issues
- frontmatter issues
- version issues
- handoff issues
- warnings
- recommended next actions

When a fix is straightforward, include a compact suggested repair block.

## When to suggest fixes

Suggest fixes when the failure is deterministic enough to repair safely, such as:

- missing required frontmatter fields
- invalid enum values with one obvious replacement
- missing `version`
- malformed document headings with an obvious correction path
- missing required placeholders
- unknown placeholders in a handoff template
- a manifest entry that names a missing schema file

Do not modify files automatically unless the user explicitly requests auto-fix behavior.

## Supporting Files

- `scripts/validate_content_files.py` — deterministic combined validator for Markdown, frontmatter, version, and handoff checks.
- `references/frontmatter.schema.yaml` — default schema for required metadata and per-file-type overrides.
- `references/markdown-validation-rules.md` — the combined skill's Markdown validation rules.
- `references/semver-versioning-rules.md` — guidance for interpreting and enforcing semantic version bumps.
- `references/schema-customisation.md` — examples for adapting the schema to other projects.
- `references/handoff-validation-rules.md` — handoff template, schema, and readiness validation rules.
- `references/example-validation-report.md` — example consolidated report output.
- `tests/` — concrete examples for valid content, missing frontmatter, invalid version metadata, Markdown structure issues, and handoff validation edge cases.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
