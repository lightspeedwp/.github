# Markdown Content Validation Report

## Summary

| Metric | Count |
|---|---:|
| Files scanned | 4 |
| Passed | 1 |
| Failed | 3 |
| Warnings | 5 |
| Markdown issues | 4 |
| Frontmatter issues | 3 |
| Missing version | 1 |
| Invalid version format | 1 |
| Changed without version increment | 1 |

## Failed Files

### `files/example.md`

**Issues:**

- Missing required frontmatter field: `version`
- Heading level jumps from `h2` to `h4`

**Suggested fix:**

```yaml
---
title: Example
status: draft
type: guide
version: "1.0.0"
---
```

### `files/template.md`

**Issue:** File changed but version was not incremented.

**Current version:** `1.2.0`

**Suggested options:**

- `1.2.1` for a patch-level wording, typo, clarification, or maintenance fix.
- `1.3.0` for a backward-compatible addition.
- `2.0.0` for a breaking template, schema, or structural change.

## Passed Files

- `files/valid-example.md`

## Recommended next actions

1. Fix blocking frontmatter errors.
2. Fix markdown structure and formatting issues.
3. Confirm the correct SemVer increment for changed files.
4. Re-run the validator.
