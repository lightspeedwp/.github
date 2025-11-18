---
title: "Merge Discipline Saved Replies"
description: "Reminds about squash merge, deleting branches, and branch protection rules. Aligns with org strategy."
category: "Pull Request"
labels:
  - status:ready
references:
  - "../../BRANCHING_STRATEGY.md"
  - "../../AUTOMATION_GOVERNANCE.md"
---

# Merge Discipline Saved Replies

## Merge Guidelines Reminder

**Use case**: Before or after review, reminding contributors about merge discipline.

```markdown
Hi @username,

A reminder before merging:

- Please use **Squash & Merge** to keep history linear and clean.
- Delete the branch after merging.
- Ensure all review conversations are resolved and CI is green.
- Merges to `main` must follow our [branch protection](../../BRANCHING_STRATEGY.md) and [automation governance](../../AUTOMATION_GOVERNANCE.md) rules.

Thank you for helping maintain a high-quality and maintainable codebase!
```
