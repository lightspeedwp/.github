# Markdown Content Validation Report

## Summary

| Metric | Count |
|---|---:|
| Files scanned | 4 |
| Passed | 1 |
| Failed | 3 |
| Warnings | 2 |
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

*Maintained by the 🤖 LightSpeedWP Automation Team*
