---
name: markdown-content-validator
description: The Markdown Content Validator helps ensure your markdown files and their YAML frontmatter meet necessary standards before publication or handoff, providing a detailed report on any issues found. Use this skill when you need to validate documentation, templates, or prompts for errors, missing fields, and adherence to versioning rules without altering the original content.
---

# Markdown Content Validator

Use this skill when the user needs a reusable validator for markdown-based documentation, templates, prompts, handoff packs, or other content files before they are committed, shipped, published, or handed to another agent.

## When to Use This Skill

Use this skill when the request involves any of the following:

- creating or updating a reusable markdown validation workflow
- validating documentation folders such as `files/`, `docs/`, `references/`, `templates/`, or `prompts/`
- enforcing YAML frontmatter rules at the top of markdown files
- checking SemVer `version` fields and, when possible, whether changed files were version-bumped
- generating one consolidated markdown validation report without modifying source files by default

Do not modify content files unless the user explicitly requests auto-fix behaviour.

## What This Skill Scans

Target markdown-oriented content files recursively from a supplied root path.

By default, treat these as in scope when they match include globs:

- `.md`
- `.mdx`
- `.markdown`

Allow the user to narrow or widen the file set with include and exclude globs.

## Workflow

1. Identify the target directory, schema path, report path, and whether version-increment enforcement is requested.
2. Read `references/frontmatter.schema.yaml` as the default source of truth for frontmatter requirements unless the project already has a stronger compatible schema.
3. Use `references/markdown-validation-rules.md` to decide which markdown checks should be blocking errors, warnings, or style suggestions.
4. Run `scripts/validate_markdown_content.py` with explicit CLI arguments rather than relying on hard-coded defaults.
5. Review the consolidated markdown report before presenting results.
6. Suggest low-risk fixes, but do not modify source files unless the user explicitly asks for auto-fix behaviour.
7. If the user asks for auto-fix, limit automatic changes to low-risk formatting and missing metadata that can be added safely. Do not infer a SemVer bump type without user confirmation when it materially affects meaning.

## How Markdown Validation Is Defined

The validator should use practical, project-appropriate checks instead of over-prescribing style rules.

Treat the default rules in `references/markdown-validation-rules.md` as the baseline. They separate checks into:

- blocking errors
- warnings
- style suggestions

Prefer blocking checks for structural problems that make content unreliable or invalid, such as missing frontmatter, invalid YAML, invalid schema values, invalid SemVer strings, unclosed code fences, or missing linked internal files.

Prefer warnings or suggestions for editorial consistency checks such as long headings, duplicate headings, mixed bullet markers, repeated blank lines, or inconsistent table structure.

## How Frontmatter Validation Works

Every validated file must start with YAML frontmatter bounded by triple dashes.

The validator must confirm that frontmatter:

- exists
- begins at the very first characters of the file
- parses as valid YAML
- contains the required schema fields
- respects enum, type, property-count, and pattern constraints from the schema file
- includes a `version` field that follows SemVer `MAJOR.MINOR.PATCH`

If frontmatter is missing, misplaced, malformed, or incompatible with the schema, report it clearly and include a suggested fix when one is practical.

## How SemVer Version Checks Work

Require a `version` frontmatter field in every validated file.

Validate the value using SemVer `MAJOR.MINOR.PATCH`.

When `--enforce-version-increment` is enabled and a base reference is available, compare the current file against the prior version from Git. If the file changed but the `version` field did not change, report that as a blocking issue.

If a previous file state is unavailable, warn instead of guessing. Use this wording:

`Version increment could not be verified because no previous version was available.`

Use `references/semver-versioning-rules.md` when explaining how to choose a major, minor, or patch bump.

## How To Customise The Schema

The default schema lives at `references/frontmatter.schema.yaml`.

If the project already has a stronger compatible schema, preserve it or merge in only the missing compatible defaults.

Use `references/schema-customisation.md` when the user asks to:

- add fields
- tighten enum values
- relax optional metadata
- adjust property-count limits
- change file-type assumptions

Do not hard-code project-specific schema rules into the script. Keep them in the schema file.

## How To Interpret Reports

The validator produces one consolidated markdown report with:

- a summary table
- failed files and their issues
- suggested fixes where practical
- passed files
- recommended next actions

Use `references/example-validation-report.md` as the reference shape for the final report.

## Suggesting Fixes

Suggest fixes when the validator finds:

- missing frontmatter
- missing required fields
- invalid enum values
- invalid SemVer strings
- low-risk markdown structure problems
- internal link targets that can be corrected deterministically

Prefer suggestions and examples over direct file edits unless the user explicitly requests auto-fix behaviour.

## When Not To Modify Files

Do not modify files when:

- the user asked for validation or review only
- the correct version bump type is unclear
- a missing field requires project knowledge that is not available
- a markdown issue has multiple valid editorial fixes
- auto-fix would risk altering meaning, headings, examples, or template semantics

## Running The Script

Example:

```bash
python scripts/validate_markdown_content.py \
  --target files \
  --schema references/frontmatter.schema.yaml \
  --report markdown-content-validation-report.md \
  --enforce-version-increment \
  --base-ref main
```

Use explicit include and exclude globs whenever the folder contains mixed content.

## Supporting Files

- `scripts/validate_markdown_content.py` — deterministic validator for markdown content, frontmatter schema checks, SemVer checks, optional Git comparisons, and report generation.
- `references/frontmatter.schema.yaml` — default configurable schema for frontmatter validation.
- `references/markdown-validation-rules.md` — default markdown rule set and severity guidance.
- `references/semver-versioning-rules.md` — guidance for interpreting major, minor, and patch bumps for documentation and templates.
- `references/schema-customisation.md` — instructions for adapting the schema without rewriting the validator.
- `references/example-validation-report.md` — reference report layout.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
