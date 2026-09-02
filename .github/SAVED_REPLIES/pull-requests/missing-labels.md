---
title: "PR Label Enforcement Saved Replies"
description: "Standard reply when PRs are missing required status, priority, or release labels. Supports LightSpeedWP automation and changelog policies."
category: "Pull Request"
labels:
  - status:needs-triage
references:
  - "../../PR_LABELS.md"
  - "../../CONTRIBUTING.md"
---

# PR Label Enforcement Saved Replies

## Required Labels Missing

**Use case**: PR is missing required labels (status, priority, release:patch/minor/major).

```markdown
Hi @username,

This PR is missing one or more required labels for automation and release:

- Exactly one `status:*` (e.g. `status:needs-review`)
- Exactly one `priority:*` (e.g. `priority:normal`)
- Exactly one `release:*` (e.g. `release:patch`, `release:minor`, or `release:major`)

**Action:**

- Please add the missing labels via the sidebar to unblock CI and release automation.
- See our [PR Label Reference](../../PR_LABELS.md) for label meanings.

If this PR is not user-facing (e.g. internal refactor), use the `meta:no-changelog` label.

Proper labeling enables changelog automation, correct release versioning, and project sync. Thank you!
```
