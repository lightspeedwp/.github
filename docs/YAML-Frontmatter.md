# YAML Frontmatter Usage & Best Practices

> **Note:** All labeling, status, type, and standardization for issues, PRs, and discussions is handled by the unified [labeling agent](../.github/agents/labeling.agent.md) and [labeling workflow](../.github/workflows/labeling.yml). Canonical label/type configs are referenced in YAML for maximum automation.

---

## Purpose

This guide describes how to use YAML frontmatter for issues, PR templates, saved replies, Copilot instructions, and agent/config files.  
All automation, agent, and template files should use consistent YAML frontmatter for discoverability and automation.

---

## YAML Frontmatter Example

```yaml
---
title: "Add new block: Team Members"
labels:
  - type:feature
  - status:needs-triage
  - priority:normal
  - area:block-editor
assignees:
  - ashleyshaw
---
```

- **title:** Human-readable title for the issue/PR/template.
- **labels:** Canonical (automation-aligned) labels, validated and enforced by the unified agent.
- **assignees:** GitHub usernames.

---

## Best Practices

- Always use canonical label names from [labels.yml](../.github/labels.yml).
- Use one-hot values for `type:*`, `status:*`, `priority:*`.
- Reference the correct YAML keys for your file type (see [GitHub docs](https://docs.github.com/en/issues/using-labels-and-milestones-to-track-work/about-automation-for-issues-and-pull-requests)).
- All automation expects and validates YAML frontmatter.

---

## Supported File Types

- Issue templates
- PR templates
- Saved replies
- Agent/config files
- Copilot instructions
- Category forms for Discussions

---

## References

- [labels.yml](../.github/labels.yml)
- [labeler.yml](../.github/labeler.yml)
- [issue-types.yml](../.github/issue-types.yml)
- [labeling.agent.md](../.github/agents/labeling.agent.md)
- [GitHub YAML frontmatter docs](https://docs.github.com/en/issues/using-labels-and-milestones-to-track-work/about-automation-for-issues-and-pull-requests)

---

*All YAML frontmatter for automation should be validated against canonical configs and unified agent logic.*