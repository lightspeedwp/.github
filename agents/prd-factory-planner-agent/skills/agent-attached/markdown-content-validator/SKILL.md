---
name: markdown-content-validator
description: validate markdown and documentation files for formatting quality, heading structure, yaml frontmatter schema compliance, required semver version fields, version increments, malformed links, missing metadata, invalid values, and consolidated content quality reporting.
---

# Markdown Content Validator

Use this skill when the user wants to create, run, review, or refine a reusable validator for markdown-based documentation, templates, prompts, reference files, handoff packs, or other content files before they are shipped, committed, published, or handed to another agent.

This skill is designed for directory-based validation workflows such as `files/`, `docs/`, `references/`, `templates/`, and `prompts/`.

## When to use this skill

Use this skill when the user asks to:

- validate a documentation directory for markdown quality and frontmatter compliance
- check whether documentation changes include valid SemVer version updates
- standardise markdown rules without hard-coding one project's style into the validator
- generate or review a consolidated markdown validation report
- adapt the validator schema or markdown rules to an existing project standard

Do not use this skill for unrelated prose review, broad content editing, or auto-fixing files unless the user explicitly requests an auto-fix workflow.

## What files it scans

By default, scan markdown and markdown-adjacent content files recursively, including:

- `.md`
- `.markdown`
- `.mdx`

Use include and exclude globs to narrow or widen the scan when the target directory contains mixed content.

## Core workflow

1. Identify the target directory, schema path, report output path, and any include/exclude filters.
2. Load the frontmatter schema from `references/frontmatter.schema.yaml` unless the project already provides a stronger compatible schema.
3. Run `scripts/validate_markdown_content.py` against the target path.
4. Review the consolidated markdown report.
5. Treat blocking errors as release blockers, warnings as review items, and style suggestions as optional improvements unless the project says otherwise.
6. Suggest fixes without modifying files unless the user explicitly asks for auto-fix behaviour.

## How markdown validation is defined

Markdown validation combines deterministic checks in the script with project-adjustable guidance in `references/markdown-validation-rules.md`.

The script should enforce practical, testable quality checks such as:

- heading hierarchy and skipped heading levels
- empty or duplicate headings
- malformed or unclosed code fences
- malformed links
- trailing whitespace
- missing final newline
- repeated blank lines
- inconsistent bullet styles within one list block
- weak table formatting signals

Treat low-risk style issues as warnings or suggestions rather than hard failures unless the project clearly needs stricter enforcement.

## How frontmatter validation works

Every validated file must begin with YAML frontmatter bounded by triple dashes. Nothing may appear before the opening `---`, including prose, whitespace, comments, HTML, or a BOM marker.

The validator must:

- confirm frontmatter exists
- confirm it starts at byte zero
- parse it as valid YAML
- validate it against the configured schema
- require a valid `version` field
- respect `required`, enum, property-count, and additional-property rules from the schema

Use `references/frontmatter.schema.yaml` as the default schema and adapt it only when the project already has a stronger compatible contract.

## How SemVer version checks work

Every validated file must include a `version` frontmatter field using `MAJOR.MINOR.PATCH` format.

Use these versioning rules:

- **MAJOR** for breaking template, schema, or structural changes
- **MINOR** for backward-compatible additions
- **PATCH** for typo fixes, formatting fixes, clarifications, metadata corrections, or non-breaking maintenance changes

If `--enforce-version-increment` is enabled and a Git base reference is available, compare changed files against that reference and warn when a changed file keeps the same version. If no previous state is available, warn instead of guessing.

## Reports and interpretation

The validator produces one consolidated markdown report summarising:

- files scanned
- passed and failed files
- markdown issues
- frontmatter issues
- missing versions
- invalid version formats
- changed files without a version increment
- suggested fixes and next actions

Use blocking errors for schema failures, missing frontmatter, invalid YAML, missing required fields, invalid SemVer, and other issues that make the file unfit for release.

Use warnings for recoverable quality issues, unverifiable version increments, and project-style concerns.

Use style suggestions for optional consistency improvements.

## Auto-fix behaviour

Do not modify files by default.

If the user explicitly requests auto-fix behaviour, you may only perform low-risk changes such as:

- adding missing frontmatter where the required values are known
- adding `version: "1.0.0"` for clearly new files
- fixing trailing whitespace, repeated blank lines, final newline issues, and similar low-risk markdown cleanup

Do not increment versions automatically unless the user confirms the intended change type as `major`, `minor`, or `patch`.

## How to run the script

Example:

```bash
python scripts/validate_markdown_content.py \
  --target files \
  --schema references/frontmatter.schema.yaml \
  --report markdown-content-validation-report.md \
  --enforce-version-increment \
  --base-ref main
```

The script should exit with:

- `0` when validation passes
- `1` when validation failures are found
- `2` for configuration or runtime errors

## Supporting Files

- `scripts/validate_markdown_content.py` — deterministic CLI validator for markdown, frontmatter schema checks, and SemVer/version-increment checks.
- `references/frontmatter.schema.yaml` — configurable default schema for required frontmatter fields and field constraints.
- `references/markdown-validation-rules.md` — practical guidance for what the validator treats as blocking errors, warnings, and suggestions.
- `references/semver-versioning-rules.md` — version increment guidance for documentation and template changes.
- `references/schema-customisation.md` — how to adapt the schema without hard-coding project-specific rules into the script.
- `references/example-validation-report.md` — example of the consolidated report shape.
- `tests/` — example valid and invalid files for smoke-testing the validator.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
