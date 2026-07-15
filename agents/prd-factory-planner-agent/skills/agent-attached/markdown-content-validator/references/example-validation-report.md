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
- Line 12: heading level jumps from `h2` to `h4`

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

**Issues:**

- File changed but version was not incremented. Current version: `1.2.0`.

**Suggested fix:**

```text
Use PATCH for small fixes, MINOR for backward-compatible additions, or MAJOR for breaking structural changes.
```

## Passed Files

- `files/valid-example.md`

## Recommended next actions

1. Fix blocking frontmatter errors.
2. Fix markdown structure and formatting issues.
3. Confirm the correct SemVer increment for changed files.
4. Re-run the validator.
