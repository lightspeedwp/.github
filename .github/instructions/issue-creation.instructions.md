---
file_type: "instructions"
title: "Issue Creation Instructions"
description: "How to create, structure, and use Markdown-based GitHub Issue templates in LightSpeedWP projects. Enforces automation, labeling, and governance."
version: "1.0"
last_updated: "2025-10-23"
owners: ["lightspeedwp/maintainers"]
tags: ["issues", "templates", "frontmatter", "automation", "labels"]
file_type: "instructions"
---

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

See [docs/frontmatter/issue-templates.md](../../docs/frontmatter/issue-templates.md) for details.

---

## 3. Filling Out Issue Templates

- Always fully complete all required fields in the template.
- Use the provided checklists and acceptance criteria.
- Link related issues using `#issue-number`.
- Provide context, steps to reproduce (for bugs), and measurable acceptance criteria.

---

## 4. Label and Status Automation

- Labels are applied automatically by the template’s frontmatter, by `.github/labeler.yml` (file/branch/type), and by agent workflows.
- **Required labels per issue** (see [docs/LABEL_STRATEGY.md](../../docs/LABEL_STRATEGY.md)):
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

- See [docs/ISSUE_TYPES.md](../../docs/ISSUE_TYPES.md) and [issue-types.yml](../../.github/issue-types.yml) for the canonical list of issue types and mapping to labels.
- Use the correct template and title prefix (`bug:`, `feature:`, etc.) to ensure type detection and correct automation.

---

## 7. Frontmatter and Template Validation

- All templates and issues must validate against the [frontmatter.schema.json](../../schema/frontmatter.schema.json).
- Use [frontmatter.instructions.md](./frontmatter.instructions.md) for full schema details.

---

## 8. References

- [Labeling Strategy](../../docs/LABEL_STRATEGY.md)
- [Canonical Labels](../../.github/labels.yml)
- [Labeler Rules](../../.github/labeler.yml)
- [Issue Types](../../.github/ISSUE_TYPES.md)
- [Workflows](../../docs/WORKFLOWS.md)
- [Automated Labeling](../agents/labeling.agent.js)

---

**For questions or clarifications, see the project’s [CONTRIBUTING.md](../../CONTRIBUTING.md) or open a GitHub Discussion.**

---