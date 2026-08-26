---
title: "Area/Component Routing Saved Replies"
description: "Reply when a PR is re-labeled or routed to a specific area/component for review. Aligns with org-wide label policy."
category: "Pull Request"
labels:
  - status:needs-review
references:
  - "../../PR_LABELS.md"
  - "../../labels.yml"
---

# Area/Component Routing Saved Replies

## Routed to Area/Component

**Use case**: PR assigned or re-labeled for a specific area/component.

```markdown
Hi @username,

This PR has been routed to `{area}` for specialized review, based on labels:

- Area: `area:{area}`
- Component: `comp:{component}` (if applicable)

If you feel this should be reassigned, please comment with context. Routing ensures the right maintainers see the PR and can provide feedback quickly. Thank you!
```
