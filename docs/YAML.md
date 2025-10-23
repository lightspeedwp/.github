# YAML Schema & Usage Guide for GitHub Automation

> **Note:** All labeling, status, type, and standardization is handled by the unified [labeling agent](../.github/agents/labeling.agent.md) and [labeling workflow](../.github/workflows/labeling.yml). All YAML configuration is centralized and canonical.

---

## Purpose

This file describes conventions and schemas for YAML files powering LightSpeed's GitHub automation.  
All canonical config is in `.github/` and referenced by all agents and workflows.

---

## Key YAML Files

- **labels.yml:** Canonical label names, descriptions, colors, and optional aliases.
- **labeler.yml:** File- and branch-based label assignment rules.
- **issue-types.yml:** Canonical issue type definitions and label mapping.
- **Workflow YAMLs:** All GitHub Actions workflows.
- **Agent Specs:** Agent documentation uses YAML frontmatter for versioning and metadata.
- **Templates:** Issue and PR templates use YAML frontmatter for default labels.

---

## Best Practices

- All labels and types must be canonical and validated via the unified agent and config files.
- YAML files must use 2-space indentation and valid keys.
- Use arrays for lists, and always quote strings with colons or special characters.

---

## Sample: Canonical labels.yml

```yaml
- name: type:feature
  color: 3FB950
  description: "Net-new capability or enhancement"
- name: status:needs-triage
  color: BFD4F2
  description: "Needs triage"
- name: priority:normal
  color: 0052CC
  description: "Default priority"
- name: area:block-editor
  color: C5DEF5
  description: "Block editor code"
```

---

## Sample: labeler.yml

```yaml
"type:feature":
  head-branch: ['^feat/.*']
  changed-files:
    any-glob-to-any-file: ['src/blocks/**']
"status:needs-review":
  head-branch: ['^feat/.*', '^fix/.*']
```

---

## Sample: issue-types.yml

```yaml
issue_types:
  - name: Feature
    color: 3FB950
    label: type:feature
  - name: Bug
    color: 9F3734
    label: type:bug
  - name: Task
    color: 4393F8
    label: type:task
```

---

## References

- [labels.yml](../.github/labels.yml)
- [labeler.yml](../.github/labeler.yml)
- [issue-types.yml](../.github/issue-types.yml)
- [labeling.agent.md](../.github/agents/labeling.agent.md)
- [YAML frontmatter guide](YAML-Frontmatter.md)

---

*All YAML automation should be validated and referenced by the unified agent and workflow. For schema questions, see agent docs or ask in Discussions.*