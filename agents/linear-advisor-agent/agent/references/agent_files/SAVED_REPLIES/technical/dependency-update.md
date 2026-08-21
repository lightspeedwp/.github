---
title: Dependency Update Automation Saved Reply
description: Guidance for troubleshooting automated dependency update failures or merge conflicts (Renovate, Dependabot, etc).
category: Technical Support
labels:
  - area:dependencies
  - status:needs-triage
references:
  - ../../instructions/dependencies.md
  - ../../instructions/automation.md
---

# Dependency Update Automation Saved Reply

**Use case**: Automated dependency update failures (Renovate, Dependabot), or merge conflicts.

```markdown
Hi @username,

Automated dependency update failed or encountered a merge conflict.

**Common Issues:**

- Version conflicts between updated dependency and existing code
- Update workflow failed due to missing permissions or configuration
- Merge conflict with other branches or PRs

**How to Fix:**

1. Review the error output from the dependency update bot (Renovate, Dependabot)
2. Resolve any merge conflicts in your branch and push updates
3. Confirm the PR passes all tests and workflows after updating

**Resources:**

- [Dependency Management Guide](../../instructions/dependencies.md)
- [Automated Updates Documentation](../../instructions/automation.md)

If you encounter persistent issues, please comment here with the error details and a maintainer will assist!
```

---

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
