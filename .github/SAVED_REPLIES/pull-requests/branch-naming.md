---
title: "Branch Naming Enforcement Saved Replies"
description: "Standard response for PRs not following the branch naming convention. Aligns with LightSpeedWP branching and automation standards."
category: "Pull Request"
labels:
  - status:needs-review
references:
  - "../../BRANCHING_STRATEGY.md"
  - "../../CONTRIBUTING.md"
---

# Branch Naming Enforcement Saved Replies

## Branch Naming Violation

**Use case**: PR opened from a branch that does not follow org-wide branch naming rules.

```markdown
Hi @username,

Thank you for your PR! For automation, release, and label mapping to work, branches must follow our naming convention:

**Format:**  
`{type}/{scope}-{short-title}`  
Examples:

- `feat/cart-coupon-flow`
- `fix/wp6-6-compat`
- `docs/readme-install-steps`
- `chore/deps-2025-09`

**Allowed prefixes:**  
feat/, fix/, docs/, chore/, build/, refactor/, test/, perf/, ci/, release/, hotfix/, design/, research/, a11y/, ux/, i18n/, ops/

Please rename your branch using the correct format and reopen this PR.  
See our [Branching Strategy](../../BRANCHING_STRATEGY.md) for details.

This helps us automate labeling, releases, and project sync. Thank you!
```
