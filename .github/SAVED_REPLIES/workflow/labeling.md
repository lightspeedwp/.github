---
title: "Labeling Automation Saved Reply"
description: "Guidance and troubleshooting for automated labeler issues and workflow errors."
category: "Workflow"
labels:
  - area:automation
  - area:labeling
  - status:needs-triage
references:
  - "../../.github/labeler.yml"
  - "../../ISSUE_LABELS.md"
  - "../../CONTRIBUTING.md"
---

# Labeling Automation Saved Reply

**Use case**: Automated labeler errors, missing or incorrect labels.

```markdown
Hi @username,

It looks like there was an issue with automated label assignment for this PR/issue.

**Common Labeling Issues:**

- Labeler workflow did not run or failed
- Labels do not match branch type or file changes
- Too many or missing required labels (`status:*`, `priority:*`)

**How to Fix:**

1. Check `.github/labeler.yml` configuration for correct patterns
2. Ensure your branch name matches the required prefix (see Branching Strategy)
3. Manually add or correct labels in the PR/issue if needed

**Resources:**

- [Labeling Automation Guide](../labeler.yml)
- [Issue & PR Labels Reference](../../ISSUE_LABELS.md)
- [Contribution Guide](../../CONTRIBUTING.md)

Let us know if you need help updating labels or fixing automation!
```
