---
title: "Permissions/Secrets Issues Saved Reply"
description: "Replies for problems accessing required secrets, tokens, or permissions during workflow runs."
category: "Workflow"
labels:
  - area:automation
  - area:secrets
  - status:needs-triage
references:
  - "../../AUTOMATION_GOVERNANCE.md"
  - "../../CONTRIBUTING.md"
  - "https://docs.github.com/en/actions/security-guides/encrypted-secrets"
---

# Permissions/Secrets Issues Saved Reply

Hi @username,

There was a problem accessing required secrets, tokens, or permissions in the workflow run.

**How to Fix:**

- Ensure all referenced secrets are set in the repo or org settings
- Validate workflow permission settings (minimum required: `read` for actions, `write` for most automation)
- Check if the token or secret name matches what’s referenced in the workflow file

See our [Automation Governance](../../AUTOMATION_GOVERNANCE.md) or ask for help if you’re unsure how to fix this.
