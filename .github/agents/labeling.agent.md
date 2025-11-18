---
"title": "Labeling Agent Spec"
"version": "v2.0"
"last_updated": "2025-10-23"
"author": "LightSpeedWP"
"maintainer": "Ash Shaw"
"description": "Unified agent for dynamic, canonical, and automated labeling of issues and PRs. Handles status, type, priority, and project-field enforcement, label standardization, and migration based on .github/labels.yml."
"tags":
  - "lightspeed"
  - "labeling"
  - "automation"
  - "canonical-labels"
  - "agents"
"file_type": "agent"
"name": "Labeling Agent Spec"
---

# LightSpeed Unified Labeling Agent

## Purpose

- Single, canonical agent automating label application, enforcement, and standardization.
- Applies labels by file/branch heuristics, content, and front matter.
- Ensures all labels conform to `.github/labels.yml`.
- Removes/migrates legacy or non-canonical labels.
- Replaces all prior status/type/label-standardization agents and workflows.

---

## Key Features

- **Driven by config:**  
  - `.github/labels.yml`: Canonical label set (names, colors, optional aliases).
  - `.github/labeler.yml`: File/branch-based label rules.
  - `.github/issue-types.yml`: Issue type mapping.

- **Dynamic Application & Enforcement:**  
  - One-hot enforcement: exactly one `status:*`, `priority:*`, and `type:*` label per item.
  - Changelog nudge: Requires changelog label on PRs affecting code.
  - Alias migration: Migrates known legacy/alias labels to canonical set.

- **Extensible Heuristics:**  
  - Applies labels by branch, file, and PR/issue body heuristics.
  - Easily extended with new utility modules.

- **Unified Workflow:**  
  - [labeling.yml](../workflows/labeling.yml) is the only labeling workflow.
  - No separate status/type/standardization workflows/agents exist.

- **Dry-Run & Reporting:**  
  - Supports dry-run for safe preview/testing.
  - Generates audit logs and summary Markdown when enabled.

---

## Best Practices

- **No hardcoded label/type logic:** All rules/configs come from YAML files.
- **All code modularized:** Shared logic lives in `.github/agents/includes/`, not agent file.
- **Fully tested:** All utilities covered by Jest tests in `.github/agents/includes/__tests__/`.
- **Traceable:** All labeling actions are logged; maintainers can audit at any time.
- **Contributor-friendly:** Reference [Coding Standards](https://github.com/lightspeedwp/.github/blob/master/.github/instructions/coding-standards.instructions.md) and [Label Strategy](../../docs/LABEL_STRATEGY.md).

---

## Outputs

- Org-standard labels, enforced on all issues/PRs.
- No non-canonical/legacy labels remain.
- PR/issue comments (optional) with audit and label changes.

---

## References

- [labels.yml](../labels.yml)
- [labeler.yml](../labeler.yml)
- [issue-types.yml](../issue-types.yml)
- [labeling.yml](../workflows/labeling.yml)
- [Coding Standards](https://github.com/lightspeedwp/.github/blob/master/.github/instructions/coding-standards.instructions.md)
- [Label Strategy](../../docs/LABEL_STRATEGY.md)
- [Automation Governance](../../.github/AUTOMATION_GOVERNANCE.md)