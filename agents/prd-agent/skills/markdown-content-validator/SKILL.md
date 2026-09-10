---
name: content-file-validator
description: validate markdown, template and documentation files for markdown quality, yaml frontmatter schema compliance, required semver version fields, version increments, broken structure, missing metadata, invalid values, and consolidated content quality reporting.
---

# Content File Validator

Use this skill when the user wants one reusable validation pass over documentation, Markdown, templates, or mixed content files that need both structural Markdown checks and YAML frontmatter validation.

## When to use this combined validator

Run this skill when the request involves any of the following:

- validating Markdown quality or document structure
- checking heading order, duplicate headings, empty headings, or obvious Markdown problems
- checking malformed links or obviously broken local links where they can be verified safely
- enforcing required YAML frontmatter at the top of each file
- validating frontmatter against a configurable schema
- requiring a `version` field that follows SemVer `MAJOR.MINOR.PATCH`
- checking whether changed files appear to need a version increment when a base Git reference is available
- producing one consolidated validation report instead of separate Markdown and frontmatter reports

Do not use this skill for general prose critique, broad style editing, or auto-fixing content unless the user explicitly asks for that workflow.

## Default scope and file types

By default, scan `files/` recursively and include:

- `.md`
- `.mdx`
- `.html`
- `.php`
- `.twig`
- `.njk`
- `.liquid`
- `.yml`
- `.yaml`

Allow configurable include and exclude globs. Use the built-in defaults unless the user narrows the scope.

## How Markdown validation works

For Markdown-style files, validate:

- exactly one H1 when the file is document-style
- heading level order without jumps such as H2 to H4
- empty headings
- repeated headings when they look accidental
- malformed inline links
- obviously broken local file links when the target can be checked from the current filesystem
- trailing structural issues that make the document look unfinished or invalid

Use `references/markdown-validation-rules.md` as the source of truth for these checks and their intended interpretation.

## How frontmatter validation works

For all matching files, validate that:

1. the file begins with YAML frontmatter at the very top
2. nothing appears before the opening `---`
3. the frontmatter parses safely as a YAML object
4. required fields are present
5. field types, enums, patterns, and property limits satisfy the schema
6. unknown fields are allowed or rejected according to the schema
7. per-file-type overrides are applied where the schema defines them

Use `references/frontmatter.schema.yaml` as the source of truth for metadata rules.

## How SemVer version checks work

Every validated document must include:

```yaml
version: "1.0.0"
```

Validate `version` as SemVer `MAJOR.MINOR.PATCH`.

When `--enforce-version-increment` and a usable `--base-ref` are provided:

- compare each changed file with the base reference when possible
- fail when file content changed but the `version` value did not change
- warn when the file changed and the version changed, but the correct increment type cannot be inferred safely from the diff alone
- do not guess whether the change should be MAJOR, MINOR, or PATCH; ask the user to confirm the intended change type when it matters

Use `references/semver-versioning-rules.md` for the human rules behind version increments.

## Inputs to confirm

Before validating, identify:

1. the target directory to scan
2. the schema file to use
3. any include globs that narrow the scan
4. any exclude globs that should be added to the defaults
5. whether version increment checks should be enforced
6. which base Git reference to compare against, when version-increment validation is requested
7. whether the user wants report-only output or explicit fix suggestions

Default assumptions when the user does not specify them:

- target directory: `files/`
- schema file: `references/frontmatter.schema.yaml`
- output format: consolidated Markdown report
- behaviour: validate and suggest fixes only
- overwrite policy: never modify files unless the user explicitly asks for that

## Validation workflow

1. Locate the target directory.
2. Recursively collect matching files using the configured include and exclude globs.
3. Validate YAML frontmatter placement and schema compliance.
4. Validate Markdown structure for Markdown-like files.
5. Validate the required `version` field and SemVer pattern.
6. If version increment enforcement is enabled, compare current files against the supplied base reference when available.
7. Produce one consolidated Markdown report covering summary metrics, failures, warnings, and suggested fixes.
8. Only propose rewrites when the user explicitly asks for modification or auto-fix behaviour.

## How to customise schemas

Customise metadata rules in `references/frontmatter.schema.yaml` instead of changing the validator logic.

Use `references/schema-customisation.md` to adapt:

- required fields
- enum values
- type rules
- property limits
- defaults used in suggested fixes
- per-file-type overrides

## How to interpret reports

Treat the report in three layers:

- **Markdown issues**: structure, headings, links, or document-shape problems
- **Frontmatter issues**: missing, invalid, or non-compliant metadata
- **Version issues**: missing SemVer, invalid SemVer, or changed files without a visible version increment

Use `references/example-validation-report.md` when the user wants a concrete example of the consolidated report format.

## When to suggest fixes

Suggest fixes when:

- a missing frontmatter field can be repaired safely from schema defaults or explicit placeholders
- a Markdown issue can be described clearly enough for a developer or editor to fix quickly
- a version issue is obvious, such as a missing `version` field or unchanged version after a confirmed content change

Do not invent unknown metadata values or silently bump versions on the user's behalf.

## When not to modify files

Never modify files by default.

Do not overwrite files unless the user explicitly asks for rewrite or auto-fix behaviour. Even then:

- keep a preview of proposed changes
- avoid changing content beyond the validated issue scope
- do not guess the correct SemVer increment when the change type is ambiguous

## Supporting Files

- `scripts/validate_content_files.py` — consolidated validator for Markdown, frontmatter, and SemVer/version-increment checks.
- `references/frontmatter.schema.yaml` — metadata schema and SemVer requirements.
- `references/markdown-validation-rules.md` — Markdown structure rules and check explanations.
- `references/semver-versioning-rules.md` — versioning guidance for MAJOR, MINOR, and PATCH decisions.
- `references/schema-customisation.md` — schema customisation examples.
- `references/example-validation-report.md` — example consolidated report.
- `tests/` — example files for validating the merged skill behaviour.

---

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
