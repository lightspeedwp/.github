# SemVer Versioning Rules

## Required field

Every validated file must include:

```yaml
version: "1.0.0"
```

The format is:

```text
MAJOR.MINOR.PATCH
```

## How to interpret changes for documentation content

### Major

Use a major increment for incompatible or breaking changes, including:

- removed sections that downstream users rely on
- renamed required fields
- changed required workflow steps
- incompatible template or schema changes
- changes that would break downstream consumers or agents

### Minor

Use a minor increment for backward-compatible additions, including:

- new sections
- new optional fields
- new examples
- new supported use cases
- additive template improvements that do not break existing usage

### Patch

Use a patch increment for backward-compatible fixes, including:

- typo fixes
- wording improvements
- formatting fixes
- metadata corrections
- clarifications
- other non-breaking maintenance edits

## When previous state is unavailable

If Git history or another base reference is unavailable, do not guess whether the version should have changed. Report:

`Version increment could not be verified because no previous version was available.`
