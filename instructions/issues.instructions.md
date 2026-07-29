---
file_type: "instructions"
title: "Issue Creation Instructions"
description: "Canonical instructions for creating, labeling, and managing Issues in LightSpeedWP projects. Reference for templates, types, automation, and labeling strategy."
scope: "organization-wide"
version: '1.4.3'
last_updated: '2026-07-22'
owners: ["lightspeedwp/maintainers"]
tags: ["issues", "templates", "frontmatter", "automation", "labels", "issue types", "triage", "branching"]
---

# LightSpeedWP Issue Creation & Management Instructions

You are an issue governance assistant. Follow our issue template, labelling, and triage standards to create automation-friendly, traceable issues. Avoid YAML issue forms, missing frontmatter fields, or labels that violate one-hot rules unless explicitly authorised.

## Overview

Applies to all issue templates and issue creation workflows. Covers frontmatter, template selection, label strategy, and automation alignment. Excludes PR guidance (see `pull-requests.instructions.md`).

## General Rules

- Use Markdown templates with YAML frontmatter; do not use YAML Issue Forms.
- Include required template frontmatter fields and apply one-hot `status:*`, `priority:*`, `type:*` labels on created issues.
- Choose the correct template and complete all required sections/checklists.
- Keep issues automation-friendly with links, acceptance criteria, and references.
- Maximise metadata completeness on every issue update. Populate all applicable
  metadata fields: labels, issue type, project fields, milestone, assignees,
  projects, and parent-child or blocked-by relationships.

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
- See: [Issue Creation Guide](../docs/ISSUE_CREATION_GUIDE.md)

---

## 2. Required Issue Frontmatter Fields

Every issue template **must** begin with a YAML frontmatter block, for example:

```yaml
---
file_type: "issue-template"
name: "🐛 Bug"
about: "Report a reproducible defect"
version: "1.0.0"
last_updated: "YYYY-MM-DD"
category: "github-templates"
---
```

**Required fields:**

- `name`: Visible in template selector
- `about`: Description for the template chooser
- `file_type`, `version`, `last_updated`, `category`: template governance metadata

GitHub Markdown issue templates use `about` for the chooser metadata. Do not duplicate that summary into `description`.

**Optional fields:**

- `title`, `labels`, `assignees`, `projects`, `milestone`, `type`

See [FRONTMATTER_SCHEMA.md](../docs/FRONTMATTER_SCHEMA.md) and [frontmatter.schema.json](../.schemas/frontmatter.schema.json) for validation details.

---

## 3. Choosing the Right Issue Template

- Use the [GitHub Issues page](https://github.com/lightspeedwp/.github/issues/new/choose) and select the template matching your intent:
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

### Metadata Completeness Default

- Treat metadata completeness as mandatory, not optional, during issue triage and updates.
- Always set or verify issue type using canonical issue types and matching `type:*` label.
- Always set or verify milestone when a release window, batch, or roadmap bucket is known.
- Always set or verify project fields (for example `Status`, `Priority`, `Type`) when the issue is on a project board.
- Always set or verify canonical issue fields from [docs/ISSUE_FIELDS.md](../docs/ISSUE_FIELDS.md):
  - `Priority`: `Urgent`, `High`, `Medium`, `Low`
  - `Start date`: date field (organization-only)
  - `Target date`: date field (organization-only)
  - `Effort`: `XS`, `S`, `M`, `L`, `XL`, `XXL`, `XXXL` (organization-only)
- Always set or verify relationships where applicable:
  - Parent issue or epic link
  - Blocked-by or blocks dependencies
  - Linked pull requests and related issues
- If a metadata value cannot be inferred safely, leave it unchanged and record a short follow-up note describing what is missing.

### Label Families

- See [docs/LABEL_STRATEGY.md](../docs/LABEL_STRATEGY.md), [docs/LABELING.md#issue-labelling](../docs/LABELING.md#issue-labelling), and canonical lists in [labels.yml](../.github/labels.yml).
- Label families include: `status:*`, `priority:*`, `type:*`, `area:*`, `comp:*`, `meta:*`, `contrib:*`, context labels (`env:*`, `phase:*`, etc.).
- **Always keep exactly one** `status:*` and `priority:*` label per issue.

### Label Assignment

- Labels are assigned via:
  - Manual triage during issue creation/edit
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

## Related Files

- **[pull-requests.instructions.md](./pull-requests.instructions.md)** — Companion guide for PR creation and labeling; mirrors issue workflow patterns
- **[coding-standards.instructions.md](./coding-standards.instructions.md)** — Code quality standards referenced in issue templates

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
