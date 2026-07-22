# Content File Validation Report

## Summary

| Metric | Count |
|---|---:|
| Files scanned | 4 |
| Passed | 1 |
| Failed | 3 |
| Warnings | 0 |
| Markdown issues | 3 |
| Frontmatter issues | 2 |
| Version issues | 1 |

## Failed Files

### `invalid-version.md`

**Issues:**

- version: value does not match required pattern `^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)$`.
- `version` must use SemVer `MAJOR.MINOR.PATCH`, for example `1.0.0`.

### `markdown-issues.md`

**Issues:**

- Heading level jumps from h1 to h4 on line 4.
- Repeated heading: `Repeat heading`.
- Broken local link target: `./does-not-exist.md`.

### `missing-frontmatter.md`

**Issues:**

- File does not start with YAML frontmatter at the top of the document.

**Suggested fix:**

```yaml
title: ""
status: draft
type: template
version: 1.0.0
```

## Passed Files

- `valid-example.md`

## Recommended next actions

1. Fix blocking frontmatter errors.
2. Fix markdown structure issues.
3. Confirm the correct SemVer increment for changed files.
4. Re-run the validator.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
