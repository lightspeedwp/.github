# Content File Validation Report

## Summary

| Metric | Count |
|---|---:|
| Files scanned | 4 |
| Passed | 1 |
| Failed | 3 |
| Warnings | 0 |
| Markdown issues | 5 |
| Frontmatter issues | 2 |
| Version issues | 1 |

## Failed Files

### `tests/invalid-version.md`

**Issues:**

- Field `version` does not match required pattern
- Invalid version format: expected MAJOR.MINOR.PATCH

**Suggested fix:**

```yaml
---
title: Invalid Version
status: draft
type: guide
version: "1.0"
---
```

### `tests/markdown-issues.md`

**Issues:**

- Malformed heading syntax on line 10
- Unmatched fenced code block detected.
- Heading level jumps from h1 to h4 on line 4
- Repeated heading: `repeated`
- Malformed link with empty destination on line 12

**Suggested fix:**

```yaml
---
title: Markdown Issues
status: draft
type: guide
version: "1.0.0"
---
```

### `tests/missing-frontmatter.md`

**Issues:**

- Missing YAML frontmatter at the top of the document

**Suggested fix:**

```yaml
---
title: Example
status: draft
type: guide
version: "1.0.0"
---
```

## Passed Files

- `tests/valid-example.md`

## Recommended next actions

1. Fix blocking frontmatter errors.
2. Fix markdown structure issues.
3. Confirm the correct SemVer increment for changed files.
4. Re-run the validator.
