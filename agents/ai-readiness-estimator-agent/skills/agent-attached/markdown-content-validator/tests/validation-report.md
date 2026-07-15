# Markdown Content Validation Report

## Summary

| Metric | Count |
|---|---:|
| Files scanned | 5 |
| Passed | 1 |
| Failed | 4 |
| Warnings | 4 |
| Markdown issues | 6 |
| Frontmatter issues | 4 |
| Missing version | 0 |
| Invalid version format | 1 |
| Changed without version increment | 0 |

## Failed Files

### `invalid-version.md`

**Issues:**

- Frontmatter field `version` does not match the required pattern
- Frontmatter field `version` must be valid SemVer `MAJOR.MINOR.PATCH`

### `markdown-issues.md`

**Issues:**

- Line 16: unclosed code fence

**Warnings:**

- Line 4: heading level jumps from `h1` to `h4`
- Line 7: inconsistent bullet style in the same list block
- Line 9: repeated blank lines
- Line 14: inconsistent table column count

### `missing-frontmatter.md`

**Issues:**

- Missing YAML frontmatter at the top of the file

**Suggested fix:**

Add frontmatter bounded by `---` with at least `title`, `status`, `type`, and `version`.

### `validation-report.md`

**Issues:**

- Missing YAML frontmatter at the top of the file

**Suggested fix:**

Add frontmatter bounded by `---` with at least `title`, `status`, `type`, and `version`.

## Passed Files

- `valid-example.md`

## Recommended next actions

1. Fix blocking frontmatter errors.
2. Fix markdown structure and formatting issues.
3. Confirm the correct SemVer increment for changed files.
4. Re-run the validator.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
