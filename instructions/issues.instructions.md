---
file_type: "instructions"
title: "Issue Creation Instructions"
description: "Canonical instructions for creating, labeling, and managing Issues in LightSpeedWP projects. Reference for templates, types, automation, and labeling strategy."
version: "1.1"
last_updated: "2025-12-04"
owners: ["lightspeedwp/maintainers"]
tags: ["issues", "templates", "frontmatter", "automation", "labels", "issue types", "triage", "branching"]
---

# LightSpeedWP Issue Creation & Management Instructions

You are an issue governance assistant. Follow our issue template, labelling, and triage standards to create automation-friendly, traceable issues. Avoid YAML issue forms, missing frontmatter fields, or labels that violate one-hot rules unless explicitly authorised.

## Overview

Applies to all issue templates and issue creation workflows. Covers frontmatter, template selection, label strategy, and automation alignment. Excludes PR guidance (see `pull-requests.instructions.md`).

## General Rules

- Use Markdown templates with YAML frontmatter; do not use YAML Issue Forms.
- Include required frontmatter fields and one-hot `status:*`, `priority:*`, `type:*` labels.
- Choose the correct template and complete all required sections/checklists.
- Keep issues automation-friendly with links, acceptance criteria, and references.

## Detailed Guidance

- Follow the numbered sections below for templates, frontmatter, label requirements, and lifecycle rules.
- Use canonical label files and labeler config for consistency.

## Examples

- **Good:** `Bug report` template with `labels: ["type:bug","status:needs-triage","priority:normal"]`, steps to reproduce, acceptance criteria, and linked references.
- **Avoid:** Opening ad-hoc issues without templates or with missing required labels.

## Validation

- Ensure frontmatter matches schema and includes required fields.
- Verify labels meet one-hot rules and align with `labels.yml`/`labeler.yml`.
- Confirm templates live under `.github/ISSUE_TEMPLATE/*.md`.

This document defines how to create, label, and manage Issues in LightSpeedWP repositories.  
It covers templates, issue types, labels, frontmatter, and workflows, referencing all canonical guides, configs, and automation logic.  
**All contributors, maintainers, and bots must follow these instructions for consistency, automation, and project health.**

---

## 1. Use Markdown Issue Templates with YAML Frontmatter

- All issue templates are Markdown (`.md`) files with a YAML frontmatter block.
- Templates are located in:  
  `.github/ISSUE_TEMPLATE/*.md`
- **Do NOT use YAML Issue Forms**. All automation, labeling, and triage depend on Markdown-based templates.
- See: [docs/frontmatter/issue-templates.md](../docs/frontmatter/issue-templates.md)

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

See [FRONTMATTER_SCHEMA.md](../docs/FRONTMATTER_SCHEMA.md) and [frontmatter.schema.json](../.schemas/frontmatter.schema.json) for validation details.

---

## 3. Choosing the Right Issue Template

- Use the [GitHub Issues page](../../issues/new/choose) and select the template matching your intent:
  - Bug report, Feature request, Documentation, Task, Design, Epic, Story, Improvement, Maintenance, Security, Integration, Compatibility, Performance, Test Coverage, Automation, AI Ops, and more.
- Each template is tailored for its use case and includes relevant fields, checklists, and references.
- See all templates in [.github/ISSUE_TEMPLATE/](../.github/ISSUE_TEMPLATE/)

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
- **One** `type:*` (e.g., `type:bug`, `type:feature`, etc.) — matches org-wide [issue types](../docs/ISSUE_TYPES.md).
- **One** `priority:*` (e.g., `priority:normal`) — urgency for scheduling and board mapping.
- At least one `area:*` or `comp:*` if possible — for routing and discoverability.

### Label Families

- See [docs/LABEL_STRATEGY.md](../docs/LABEL_STRATEGY.md), [ISSUE_LABELS.md](../docs/ISSUE_LABELS.md), and canonical lists in [labels.yml](../.github/labels.yml).
- Label families include: `status:*`, `priority:*`, `type:*`, `area:*`, `comp:*`, `meta:*`, `contrib:*`, context labels (`env:*`, `phase:*`, etc.).
- **Always keep exactly one** `status:*` and `priority:*` label per issue.

### Label Assignment

- Labels are assigned via:
  - Template frontmatter (default set)
  - `.github/labeler.yml` (file paths, branch prefixes, automation)
  - Labeling workflows/agents ([labeling.agent.js](../scripts/agents/labeling.agent.js))
- Manual label curation is allowed for triage and clarification.

### Label Enforcement

- Workflows and agents enforce one-hot status/priority/type and prevent missing/duplicate labels.
- See [labeler.yml](../.github/labeler.yml) for branch prefix, file glob, and label mapping rules.
- Issues missing required labels may be flagged in CI or blocked from being worked on.

---

## 6. Issue Types: Purpose & Selection

- Reference [ISSUE_TYPES.md](../docs/ISSUE_TYPES.md) and [issue-types.yml](../.github/issue-types.yml) for all allowed types.

# LightSpeedWP Issue Creation Instructions

These instructions define how to create and submit actionable, automation-friendly issues in LightSpeedWP projects.  
They ensure all issues are discoverable, triage-ready, and compatible with our automated labeling and workflow agents.

---

## 1. Use Markdown Templates (Not YAML Forms)

- All issue templates **MUST** be Markdown (`.md`) files with YAML frontmatter, located in `.github/ISSUE_TEMPLATE/*.md`.
- Do **not** use GitHub’s YAML Issue Forms. All automation and labeling relies on Markdown-based templates.

---

## 2. Required YAML Frontmatter for Issues

Each issue template **must** start with a YAML frontmatter block, e.g.:

```yaml
---
name: "Bug Report"
about: "Report a reproducible bug"
title: "bug: {short summary}"
labels: ["type:bug", "status:needs-triage", "priority:normal"]
---
```

**Required fields:**

- `name`: Short label for the template selector.
- `about`: Description for the template chooser.
- `title`: Default issue title (can use placeholders).
- `labels`: Array of default labels for new issues.

**Optional fields:**

- `assignees`: Array of default assignees.
- `projects`: Array of projects to auto-add the issue to.

See [docs/frontmatter/issue-templates.md](../docs/frontmatter/issue-templates.md) for details.

---

## 3. Filling Out Issue Templates

- Always fully complete all required fields in the template.
- Use the provided checklists and acceptance criteria.
- Link related issues using `#issue-number`.
- Provide context, steps to reproduce (for bugs), and measurable acceptance criteria.

---

## 4. Label and Status Automation

- Labels are applied automatically by the template’s frontmatter, by `.github/labeler.yml` (file/branch/type), and by agent workflows.
- **Required labels per issue** (see [docs/LABEL_STRATEGY.md](../docs/LABEL_STRATEGY.md)):
  - One `status:*` (e.g., `status:needs-triage`)
  - One `priority:*` (e.g., `priority:normal`)
  - One `type:*` (e.g., `type:bug`, `type:feature`, etc.)
  - At least one `area:*` or `comp:*` if possible
- Project and milestone assignment is optional but encouraged.

---

## 5. Issue Lifecycle and Automation

- Issues start as `status:needs-triage`, then move through `status:ready`, `status:in-progress`, `status:needs-review`, etc.
- Automation ensures only one `status:*` and one `priority:*` label at any time.
- The `labeling.yml` workflow, powered by `labeling.agent.js`, enforces label hygiene and triggers project meta sync.

---

## 6. Issue Types and Labeling

- See [docs/ISSUE_TYPES.md](../docs/ISSUE_TYPES.md) and [issue-types.yml](../.github/issue-types.yml) for the canonical list of issue types and mapping to labels.
- Use the correct template and title prefix (`bug:`, `feature:`, etc.) to ensure type detection and correct automation.

---

## 7. Frontmatter and Template Validation

- All templates and issues must validate against the [frontmatter.schema.json](../.schemas/frontmatter.schema.json).
- Use [FRONTMATTER_SCHEMA.md](../docs/FRONTMATTER_SCHEMA.md) for full schema details.

**For questions or clarifications, see the project’s [CONTRIBUTING.md](../CONTRIBUTING.md) or open a GitHub Discussion.**

## References

- [instructions.instructions.md](instructions.instructions.md)
- [file-organisation.instructions.md](file-organisation.instructions.md)
- [labeling.instructions.md](labeling.instructions.md)
- [pull-requests.instructions.md](pull-requests.instructions.md)
- [Label Strategy](../docs/LABEL_STRATEGY.md)
- [Canonical Labels](../.github/labels.yml)
- [Labeler Rules](../.github/labeler.yml)
- [Issue Types](../.github/issue-types.yml)
- [Workflows](../docs/WORKFLOWS.md)
- [Automated Labeling](../scripts/agents/labeling.agent.js)
