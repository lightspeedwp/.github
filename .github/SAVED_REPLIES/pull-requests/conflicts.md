---
title: "Merge Conflicts Saved Replies"
description: "Guidance for resolving merge conflicts in PRs, with next steps for the author."
category: "Pull Request"
labels:
  - status:blocked
references:
  - "../../CONTRIBUTING.md"
  - "../../BRANCHING_STRATEGY.md"
---

# Merge Conflicts Saved Replies

## Resolve Merge Conflicts

**Use case**: PR cannot be merged due to merge conflicts.

```markdown
Hi @username,

This PR has **merge conflicts** with the target branch and cannot be merged until resolved.

**Next steps:**

- Update your branch with the latest `main` (or target branch)
- Resolve any conflicts locally, test, and push the updated branch
- Confirm that your PR is still passing all required checks

See our [Branching Strategy](../../BRANCHING_STRATEGY.md) or ask for help if you're unsure how to resolve conflicts. Thank you!
```
