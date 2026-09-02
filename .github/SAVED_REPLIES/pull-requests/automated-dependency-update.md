---
title: "Automated Dependency Update Saved Replies"
description: "Standard reply for Renovate/Dependabot PRs, outlining expectations for review and merge."
category: "Pull Request"
labels:
  - area:dependencies
  - status:needs-review
references:
  - "../../CONTRIBUTING.md"
  - "../../PR_LABELS.md"
---

# Automated Dependency Update Saved Replies

## Dependency PR Review

**Use case**: Automated PRs from Renovate/Dependabot.

```markdown
Hi @username,

This PR was opened automatically to update dependencies.

**Please:**

- Review the changelog and breaking changes for updated packages
- Ensure all tests and CI checks pass
- Use the correct `release:*` label for versioning if this will be part of a release

Automated dependency updates improve security and maintainability, but always require human review. Thank you!
```
