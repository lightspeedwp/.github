---
title: "Changelog Required Saved Replies"
description: "Prompt contributors to add a changelog entry to their PR, as required for release automation."
category: "Pull Request"
labels:
  - meta:needs-changelog
references:
  - "../../AUTOMATION_GOVERNANCE.md"
  - "../../CONTRIBUTING.md"
  - "../../PULL_REQUEST_TEMPLATE.md"
---

# Changelog Required Saved Replies

## Changelog Section Missing

**Use case**: PR description is missing the required changelog section or entry.

```markdown
Hi @username,

All PRs must include a **changelog entry** in the PR description for release and automation.

**How to fix:**

- Add a `## Changelog` section using [Keep a Changelog](https://keepachangelog.com/) categories (Added, Changed, Fixed, Removed).
- Only user-facing changes require a changelog entry. For internal-only PRs, add the `meta:no-changelog` label.
- If this PR closes issues, reference them in the changelog (e.g., "Fixed: ... (Closes #123)").

**References:**

- [PR Template](../../PULL_REQUEST_TEMPLATE.md)
- [Automation Governance](../../AUTOMATION_GOVERNANCE.md)
- [Contribution Guidelines](../../CONTRIBUTING.md)

This is required for CI and automated release notes. Thank you!
```
