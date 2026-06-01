---
name: markdown-content-validator
description: validate markdown and documentation files for formatting quality, heading structure, yaml frontmatter schema compliance, required semver version fields, version increments, malformed links, missing metadata, invalid values, and consolidated content quality reporting.
---

# Markdown Content Validator

Use this skill when the user wants to create, update, run, or adapt a reusable validator for markdown-based documentation, templates, prompts, handoff packs, and other content files before they are shipped, committed, published, or handed to another agent.

## When to use it

Use this skill for requests such as:

- build or update a markdown validation skill for a repo or content package
- validate markdown files under `files/`, `docs/`, `references/`, `templates/`, or `prompts/`
- add or tighten YAML frontmatter validation with a configurable schema
- check whether changed files were updated without an appropriate version increment
- produce one consolidated markdown validation report without modifying files

## What it scans

By default, validate markdown-oriented files recursively under the requested target path.

Treat `.md`, `.markdown`, and `.mdx` as the default file types unless the project already uses a stronger documented convention. Respect include and exclude globs when the user or project provides them.

## Workflow

1. Identify the target directory, the schema path, whether version-increment checks should be enforced, and whether a base reference is available.
2. Read `references/frontmatter.schema.yaml` as the default schema unless the project already has a stronger compatible schema.
3. Read `references/markdown-validation-rules.md` to understand which checks are blocking errors, warnings, or style suggestions.
4. Run `scripts/validate_markdown_content.py` with the requested target and options.
5. Produce or update one consolidated markdown report.
6. Suggest fixes without modifying files unless the user explicitly asks for auto-fix behavior.

## Markdown validation

Define markdown validation rules from project context first, then fall back to the practical defaults in `references/markdown-validation-rules.md`.

The validator should prefer maintainable, testable checks that catch common content-quality problems, especially:

- heading hierarchy problems
- skipped heading levels
- empty or duplicate headings
- malformed or inconsistent list structure when it is clearly detectable
- malformed external links
- broken internal anchors where they can be checked locally
- empty or unclosed code fences
- trailing whitespace
- missing final newline
- repeated blank lines
- obviously malformed tables
- inconsistent title structure when the file's heading and frontmatter title clearly conflict

Not every issue must be a hard failure. Keep the distinction between blocking errors, warnings, and style suggestions.

## Frontmatter validation

Require YAML frontmatter at the very top of each validated file.

Apply these rules:

- the file must begin with `---` on the first line
- no BOM marker, whitespace, HTML, comments, or prose may appear before the opening delimiter
- the frontmatter must parse as valid YAML
- required fields must be present
- enum-constrained fields must use accepted values
- property counts must respect schema limits
- additional properties are not allowed unless the schema says otherwise
- `version` is required and must satisfy SemVer `MAJOR.MINOR.PATCH`

Read schema rules from `references/frontmatter.schema.yaml` instead of hard-coding project-specific frontmatter rules in the script.

## SemVer version checks

Require a `version` frontmatter field and validate it against the schema pattern.

When version-increment checking is enabled and a previous file state is available, compare the current file with the base reference. Warn or fail when the file changed without a version increment.

Use these interpretation rules when suggesting the next version:

- `MAJOR` for breaking structural changes, renamed required fields, removed sections, incompatible template changes, or changes that would break downstream consumers
- `MINOR` for backward-compatible additions such as new optional fields, new sections, new examples, or new supported use cases
- `PATCH` for non-breaking fixes such as typo corrections, formatting fixes, metadata corrections, wording clarifications, or maintenance edits

If no previous file state is available, do not guess. Report that version-increment verification could not be completed.

## Reports

Always produce one consolidated markdown report with:

- a summary table
- failed files with issue lists
- suggested fixes where practical
- passed files
- recommended next actions

Follow `references/example-validation-report.md` for the default report shape.

## Auto-fix behavior

Do not modify files unless the user explicitly asks for auto-fix behavior.

If auto-fix is explicitly requested, only apply low-risk fixes such as:

- adding missing frontmatter where safe
- adding `version: "1.0.0"` to a new file missing a version
- fixing low-risk markdown formatting issues

Do not increment versions automatically unless the user provides or confirms the intended change type: `major`, `minor`, or `patch`.

## Supporting Files

- `scripts/validate_markdown_content.py`: deterministic CLI validator for markdown, frontmatter schema checks, and optional version-increment checks.
- `references/frontmatter.schema.yaml`: default configurable frontmatter schema.
- `references/markdown-validation-rules.md`: practical default markdown rules, severity levels, and what should remain configurable.
- `references/semver-versioning-rules.md`: SemVer guidance for documentation and template content.
- `references/schema-customisation.md`: how to adapt the frontmatter schema without rewriting the script.
- `references/example-validation-report.md`: reference report format.
- `tests/`: sample valid and invalid files for quick validation checks.

## How to run it

Typical CLI usage:

```bash
python scripts/validate_markdown_content.py \
  --target files \
  --schema references/frontmatter.schema.yaml \
  --report markdown-content-validation-report.md \
  --enforce-version-increment \
  --base-ref main
```

Exit codes:

- `0` when all checks pass
- `1` when validation failures are found
- `2` for configuration or runtime errors
