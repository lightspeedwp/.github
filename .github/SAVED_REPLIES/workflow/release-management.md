---
title: "Release Management Saved Reply"
description: "Release-related communications and process guidance."
category: "Workflow"
labels:
  - area:release
  - status:needs-triage
references:
  - "../../AUTOMATION_GOVERNANCE.md"
  - "../../CONTRIBUTING.md"
---

# Release Management Saved Reply

Hi @username,

Thank you for your work on this release!

**Checklist:**

- Ensure your PR includes a `## Changelog` entry (Keep a Changelog format)
- Apply exactly one `release:*` label (`release:patch`, `release:minor`, or `release:major`)
- Confirm all CI checks are passing

Once this is merged to `main`, our automation will tag the release and update the changelog.

See our [Release & Automation Governance](../../AUTOMATION_GOVERNANCE.md) for more details.
