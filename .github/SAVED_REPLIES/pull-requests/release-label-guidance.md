---
title: "Release Label Guidance Saved Replies"
description: "Guidance for selecting the correct release label (patch, minor, major) for semantic versioning and release automation."
category: "Pull Request"
labels:
  - status:needs-review
references:
  - "../../AUTOMATION_GOVERNANCE.md"
  - "../../PR_LABELS.md"
---

# Release Label Guidance Saved Replies

## Selecting a Release Label

**Use case**: Contributor is unsure or selected more than one `release:*` label.

```markdown
Hi @username,

For release automation and semantic versioning, every PR must have **exactly one** `release:*` label:

- `release:patch`: For bug fixes, documentation, and backward-compatible changes.
- `release:minor`: For new features or enhancements that are backward-compatible.
- `release:major`: For breaking changes or backward-incompatible updates.

**Action required:**

- Review your PR and select the single release label that best matches your change.
  - If more than one is selected, please remove the extras.
  - If you are unsure, ask in a comment or refer to our [Automation Governance guide](../../AUTOMATION_GOVERNANCE.md).

The release label determines the next version bump and is required for changelog and tagging automation to work correctly.

Thank you for helping us keep our releases reliable!
```
