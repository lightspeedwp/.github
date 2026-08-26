# Markdown Content Validation Report

## Summary

| Metric | Count |
|---|---:|
| Files scanned | 5 |
| Passed | 1 |
| Failed | 4 |
| Warnings | 5 |
| Markdown issues | 6 |
| Frontmatter issues | 4 |
| Missing version | 0 |
| Invalid version format | 2 |
| Changed without version increment | 0 |

## Failed Files

### `/workspace/skill_drafts/markdown-content-validator/tests/invalid-version.md`

**Issues:**

- Frontmatter field `version` does not match the required pattern
- Frontmatter field `version` does not match the required pattern

**Current version:** `1.0`

### `/workspace/skill_drafts/markdown-content-validator/tests/markdown-issues.md`

**Issues:**

- Line 3: Heading level jumps from h1 to h4

**Current version:** `1.0.0`

### `/workspace/skill_drafts/markdown-content-validator/tests/missing-frontmatter.md`

**Issues:**

- Missing YAML frontmatter at the very top of the file.

### `/workspace/skill_drafts/markdown-content-validator/tests/report.md`

**Issues:**

- Missing YAML frontmatter at the very top of the file.

## Passed Files

- `/workspace/skill_drafts/markdown-content-validator/tests/valid-example.md`

## Recommended next actions

1. Fix blocking frontmatter errors.
2. Fix markdown structure and formatting issues.
3. Confirm the correct SemVer increment for changed files.
4. Re-run the validator.
