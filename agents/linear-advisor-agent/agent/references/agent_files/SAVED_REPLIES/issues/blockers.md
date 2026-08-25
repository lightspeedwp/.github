---
title: Blocked Issue Saved Replies
description: Use when an issue is blocked by another issue, external dependency, or decision. Follows LightSpeedWP status:blocked label workflow.
category: Issue Management
labels:
  - status:blocked
references:
  - ../ISSUE_LABELS.md
---

# Blocked Issue Saved Replies

## Blocked by Dependency

**Use case**: When an issue cannot proceed due to a dependency or external blocker.

```markdown
Hi @username,

This issue is currently **blocked** and cannot proceed until the following is resolved:

- [ ] Blocked by: #{blocking-issue} ([see here](link-to-issue))
- [ ] [Or: Waiting on an external dependency / decision]

**Status:**

- Labeled as `status:blocked` in our workflow ([see label guide](../../.github/ISSUE_LABELS.md))
- We'll update here as soon as the blocker is resolved

Thank you for your patience!
```

---

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*
