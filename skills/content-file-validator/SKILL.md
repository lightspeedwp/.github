---
name: content-file-validator
description: validate markdown, template and documentation files for markdown quality, yaml frontmatter schema compliance, required semver version fields, version increments, broken structure, missing metadata, invalid values, and consolidated content quality reporting.
---

# Content File Validator

Use this skill when the user wants one deterministic validation pass across Markdown, documentation, or template files and needs a single report covering both Markdown quality and YAML frontmatter/versioning rules.

Use `$content-file-validator` for requests like:

- "Validate these Markdown docs before final delivery."
- "Check frontmatter, heading structure, and version bumps in `files/`."
- "Run one combined validator and tell me what failed, what warned, and what to fix next."

Do not use this skill when the main task is substantive rewriting, planning, or content creation rather than validation.

## Files This Skill Scans

By default, validate text files under the requested target directory matching patterns such as:

- `*.md`
- `*.markdown`
- `*.mdx`
- `*.template`
- `*.tmpl`

Default the target to `files/` unless the user supplies another path.

## Workflow

1. Confirm the target path, schema path, report path, and whether version-increment checks should be enforced.
2. Use `references/frontmatter.schema.yaml` as the default schema unless the user supplies a different schema file.
3. Run `scripts/validate_content_files.py` with the narrowest flags needed for the request.
4. Read the generated report and summarise the highest-priority failures, warnings, and next actions.
5. Only modify files when the user explicitly asks for fixes. Validation alone should not overwrite content.

## Markdown Validation

The validator checks Markdown quality and structure, including:

- heading order and heading-level jumps
- duplicate headings
- empty headings
- multiple H1 headings
- malformed or obviously broken links where they can be checked safely
- missing local link targets where possible
- unmatched fenced code blocks
- other obvious structural cleanliness issues surfaced by the script

Treat Markdown validation as structural QA, not a license to rewrite the underlying meaning.

## Frontmatter Validation

The validator requires YAML frontmatter at the top of each matching file and checks it against the active schema.

By default it enforces:

- required frontmatter presence
- required fields from the active schema
- allowed field types and enums from the schema
- a required `version` field
- `version` stored as a string
- `version` matching SemVer `MAJOR.MINOR.PATCH`

## SemVer Version Checks

Every validated document must include:

```yaml
version: "1.0.0"
```

Interpret version changes this way unless the user or project standard says otherwise:

- `major` for incompatible or breaking structural changes
- `minor` for backward-compatible additions
- `patch` for backward-compatible fixes, typo fixes, clarifications, or small corrections

If version-increment enforcement is enabled and a previous revision is available, fail changed files whose version did not increase.

If the correct increment cannot be inferred safely, do not guess. Warn and ask the user to confirm whether the change should be `major`, `minor`, or `patch`.

## Schema Customisation

- Use `references/frontmatter.schema.yaml` as the default schema.
- If the user provides another schema path, pass it to the validator instead of editing the default.
- Use `references/schema-customisation.md` when the user wants to tighten, relax, or extend frontmatter rules.

## Reports

The validator produces one consolidated Markdown report with:

- summary metrics
- failed files
- warnings
- passed files when useful
- recommended next actions

Use the report as the source of truth for what failed. Keep any chat summary short and focused on blockers, warning themes, and next actions.

## Fix Guidance

Suggest fixes when:

- the error is deterministic and the safe correction is clear
- a missing required field can be shown in an example block
- a heading or local-link problem can be described precisely

Do not modify files unless the user explicitly asks for fixes or auto-fix behavior. Even then:

- only apply safe changes
- do not guess ambiguous SemVer bump types
- do not silently rewrite substantive content

## Supporting Files

- `scripts/validate_content_files.py` — main deterministic validator for Markdown structure, frontmatter schema compliance, SemVer checks, local-link checks, and consolidated report generation
- `references/frontmatter.schema.yaml` — default frontmatter schema with required `version` support
- `references/markdown-validation-rules.md` — Markdown rules and failure categories used by the validator
- `references/semver-versioning-rules.md` — SemVer interpretation rules for documentation and template changes
- `references/schema-customisation.md` — guidance for adapting the frontmatter schema safely
- `references/example-validation-report.md` — example report shape and phrasing

## Command Example

```bash
python scripts/validate_content_files.py \
  --target files \
  --schema references/frontmatter.schema.yaml \
  --report content-validation-report.md \
  --enforce-version-increment \
  --base-ref main
```

## Boundaries

- Do not treat formatting cleanup as permission to change the document's meaning.
- Do not overwrite files unless the user explicitly requests it.
- Do not guess SemVer bump types when the change class is ambiguous.
- Do not maintain two competing sources of truth for the same validation rule when one reference file will do.

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

_Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!_
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)
