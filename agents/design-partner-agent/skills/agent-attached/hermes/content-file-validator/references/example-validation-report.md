# Content File Validation Report

## Summary

| Metric | Count |
|---|---:|
| Files scanned | 4 |
| Passed | 1 |
| Failed | 3 |
| Warnings | 1 |
| Markdown issues | 2 |
| Frontmatter issues | 2 |
| Version issues | 2 |

## Failed Files

### `files/example.md`

**Issues:**

- Missing required frontmatter field: `version`
- Heading level jumps from h2 to h4

**Suggested fix:**

```yaml
---
title: Example
status: draft
type: guide
version: 1.0.0
---
```

## Passed Files

* `files/valid-example.md`

## Recommended next actions

1. Fix blocking frontmatter errors.
2. Fix markdown structure issues.
3. Confirm the correct SemVer increment for changed files.
4. Re-run the validator.
