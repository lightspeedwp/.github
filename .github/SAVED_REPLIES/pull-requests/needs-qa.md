---
title: "Needs QA Saved Replies"
description: "Reply when a PR is ready for or requires quality assurance review before merge."
category: "Pull Request"
labels:
  - status:needs-qa
references:
  - "../../CONTRIBUTING.md"
---

# Needs QA Saved Replies

## Ready for QA

**Use case**: PR is ready for QA or a QA review is required before merging.

```markdown
Hi @username,

This PR has passed code review and is now ready for QA.

**QA Review Checklist:**

- Test all acceptance criteria and edge cases
- Confirm no regressions in related features
- Verify a11y, performance, and security as appropriate

When QA is complete, update the status label to `status:ready-for-deployment` or leave feedback. Thank you!
```
