---
title: "Issue Creation Instructions"
description: "Canonical instructions for creating, labeling, and managing Issues in LightSpeedWP projects. Reference for templates, types, automation, and labeling strategy."
version: "1.1"
last_updated: "2025-10-23"
owners: ["lightspeedwp/maintainers"]
tags: ["issues", "templates", "frontmatter", "automation", "labels", "issue types", "triage", "branching"]
type: "instructions"
---

# LightSpeedWP Issue Creation & Management Instructions

This document defines how to create, label, and manage Issues in LightSpeedWP repositories.  
It covers templates, issue types, labels, frontmatter, and workflows, referencing all canonical guides, configs, and automation logic.  
**All contributors, maintainers, and bots must follow these instructions for consistency, automation, and project health.**

---

## 1. Use Markdown Issue Templates with YAML Frontmatter

- All issue templates are Markdown (`.md`) files with a YAML frontmatter block.
- Templates are located in:  
  `.github/ISSUE_TEMPLATE/*.md`
- **Do NOT use YAML Issue Forms**. All automation, labeling, and triage depend on Markdown-based templates.
- See: [docs/frontmatter/issue-templates.md](../../docs/frontmatter/issue-templates.md)

---

## 2. Required Issue Frontmatter Fields

Every issue template **must** begin with a YAML frontmatter block, for example:

```yaml
---
name: "🐛 Bug report"
about: "Report a reproducible bug"
title: "[Bug] <Short description>"
labels: ["type:bug", "status:needs-triage", "priority:normal"]
---
```

**Required fields:**
- `name`: Visible in template selector
- `about`: Description for the template chooser
- `title`: Default issue title (use placeholders where appropriate)
- `labels`: Array of default labels for new issues

**Optional fields:**
- `assignees`, `projects`, `milestone`, `type`, `references`

See [frontmatter instructions](./frontmatter.instructions.md) and [frontmatter schema](../../schema/frontmatter.schema.json) for validation details.

---

## 3. Choosing the Right Issue Template

- Use the [GitHub Issues page](../../issues/new/choose) and select the template matching your intent:
    - Bug report, Feature request, Documentation, Task, Design, Epic, Story, Improvement, Maintenance, Security, Integration, Compatibility, Performance, Test Coverage, Automation, AI Ops, and more.
- Each template is tailored for its use case and includes relevant fields, checklists, and references.
- See all templates in [.github/ISSUE_TEMPLATE/](../ISSUE_TEMPLATE/)

---

## 4. Filling Out Issue Templates

- Complete all required sections: summary, context, steps to reproduce, acceptance criteria, environment, references, etc.
- Use checklists for DoR (Definition of Ready) and DoD (Definition of Done).
- Always link related issues/PRs using `#issue-number`.
- Attach logs, screenshots, or code snippets as needed.
- Reference standards, guidelines, or specs (see each template’s `References` section).

---

## 5. Required Issue Labels & Labeling Automation

### Minimum Labels per Issue

- **One** `status:*` (e.g., `status:needs-triage`) — for triage workflow and project sync.
- **One** `type:*` (e.g., `type:bug`, `type:feature`, etc.) — matches org-wide [issue types](../ISSUE_TYPES.md).
- **One** `priority:*` (e.g., `priority:normal`) — urgency for scheduling and board mapping.
- At least one `area:*` or `comp:*` if possible — for routing and discoverability.

### Label Families

- See [docs/LABEL_STRATEGY.md](../../docs/LABEL_STRATEGY.md), [ISSUE_LABELS.md](../ISSUE_LABELS.md), and canonical lists in [labels.yml](../labels.yml).
- Label families include: `status:*`, `priority:*`, `type:*`, `area:*`, `comp:*`, `meta:*`, `contrib:*`, context labels (`env:*`, `phase:*`, etc.).
- **Always keep exactly one** `status:*` and `priority:*` label per issue.

### Label Assignment

- Labels are assigned via:
    - Template frontmatter (default set)
    - `.github/labeler.yml` (file paths, branch prefixes, automation)
    - Labeling workflows/agents ([labeling.agent.js](../agents/labeling.agent.js))
- Manual label curation is allowed for triage and clarification.

### Label Enforcement

- Workflows and agents enforce one-hot status/priority/type and prevent missing/duplicate labels.
- See [labeler.yml](../labeler.yml) for branch prefix, file glob, and label mapping rules.
- Issues missing required labels may be flagged in CI or blocked from being worked on.

---

## 6. Issue Types: Purpose & Selection

- Reference [ISSUE_TYPES.md](../ISSUE_TYPES.md) and [issue-types.yml](../issue-types.yml) for all allowed types.