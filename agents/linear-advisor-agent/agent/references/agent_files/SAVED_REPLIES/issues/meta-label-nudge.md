---
title: "Meta/Automation Label Nudge Saved Replies"
description: "Prompt for missing or required meta labels, e.g. meta:needs-changelog, meta:triage. Supports LightSpeedWP automation and release workflow."
category: "Issue Management"
labels:
  - meta:needs-changelog
  - meta:triage
references:
  - "../ISSUE_LABELS.md"
  - "../../CONTRIBUTING.md"
---

# Meta/Automation Label Nudge Saved Replies

## Missing Required Meta Label

**Use case**: Issue or PR missing a required meta label (e.g., changelog entry or triage).

```markdown
Hi @username,

This issue (or PR) is missing a required **meta label** for automation:

- `meta:needs-changelog`: Please ensure you’ve added a changelog entry if your change is user-facing or impactful.
- `meta:triage`: Maintainers will triage and route this issue soon.

**References:**

- [Label Reference](../ISSUE_LABELS.md)
- [Contribution Guidelines](../../CONTRIBUTING.md)

Label hygiene helps us automate releases, changelogs, and triage for all contributors. Thank you!
```
