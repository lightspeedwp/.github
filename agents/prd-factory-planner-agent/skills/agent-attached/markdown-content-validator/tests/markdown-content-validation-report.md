# Markdown Content Validation Report

## Summary

| Metric | Count |
|---|---:|
| Files scanned | 4 |
| Passed | 1 |
| Failed | 3 |
| Warnings | 1 |
| Markdown issues | 3 |
| Frontmatter issues | 2 |
| Missing version | 0 |
| Invalid version format | 1 |
| Changed without version increment | 0 |

## Failed Files

### `invalid-version.md`

**Issues:**

- Frontmatter schema violation at `version`: `1.0` does not match the required pattern.
- Invalid SemVer version format: `1.0`

**Suggested fix:**

```text
Use `MAJOR.MINOR.PATCH`, for example `1.0.0`.
```

### `markdown-issues.md`

**Issues:**

- Line 5: heading level jumps from `h2` to `h4`.
- Unclosed code fence detected.
- Line 8: inconsistent bullet style at indent level 0.

### `missing-frontmatter.md`

**Issues:**

- Missing YAML frontmatter at the very top of the file.

## Passed Files

- `valid-example.md`

## Recommended next actions

1. Fix blocking frontmatter errors.
2. Fix markdown structure and formatting issues.
3. Confirm the correct SemVer increment for changed files.
4. Re-run the validator.
