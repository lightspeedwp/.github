---
title: "Workflow Automation Issues Saved Reply"
description: "Guidance for troubleshooting workflow automation failures and GitHub Actions issues."
category: "Workflow"
labels:
  - area:automation
  - area:workflow
  - status:needs-triage
references:
  - "../../AUTOMATION_GOVERNANCE.md"
  - "../../instructions/ci-cd-troubleshooting.md"
  - "https://docs.github.com/en/actions"
---

# Workflow Automation Issues Saved Reply

**Use case**: Automation workflow failures, misconfigured actions, or trigger issues.

```markdown
Hi @username,

We've noticed an issue with our workflow automation (GitHub Actions or scripts).

**Common Issues:**

- Workflow did not trigger as expected (missing `on:` event, branch filter)
- Permissions error or token misconfiguration
- Step failed due to missing action or incorrect config

**How to Fix:**

1. Check workflow file (`.github/workflows/{name}.yml`) for correct trigger events and filters
2. Validate all required permissions and secrets are configured
3. Review the logs for failed steps and error messages

**Resources:**

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Automation Governance](../../AUTOMATION_GOVERNANCE.md)
- [Workflow Troubleshooting Guide](../instructions/ci-cd-troubleshooting.md)

If you need help diagnosing the workflow, paste the error log or workflow snippet here.
```
