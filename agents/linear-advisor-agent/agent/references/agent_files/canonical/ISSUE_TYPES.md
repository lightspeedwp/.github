---
title: "Issue Types Reference Guide"
description: "Canonical guide for org-wide issue type definitions, assignment, and automation. Covers all type categories, labels, and how the labeling agent assigns types."
file_type: "documentation"
version: "v2.0"
created_date: "2025-10-20"
last_updated: "2025-12-07"
author: "LightSpeed Team"
maintainer: "Ash Shaw"
owners: ["lightspeedwp/maintainers"]
tags: ["github", "labeling", "issue-types", "automation", "triage"]
category: "governance"
status: "active"
stability: "stable"
---

# Issue Types Reference Guide

> **Note:** All type assignment for issues and PRs is handled by the unified [labeling agent](../.gith../.github/agents/labeling.agent.md) and [labeling workflow](../.github/workflows/labeling.yml). The canonical type mapping is maintained in [issue-types.yml](../.github/issue-types.yml).

---

## Purpose

Defines the org-wide standard for **Issue Types** in LightSpeed projects.
This guide is for choosing a type, understanding type automation, and aligning with org-wide labeling and reporting.

---

## Quick Reference (All 24 Types)

- **Task** — Small, well-scoped unit of work (e.g., config update, copy edit). *Label:* `type:task`
- **Bug** — Broken/incorrect behaviour (e.g., error, regression, failed test). *Label:* `type:bug`
- **Feature** — Net-new capability or enhancement (e.g., new block, API). *Label:* `type:feature`
- **Design** — Design artefacts/decisions (e.g., Figma, specs, a11y checks). *Label:* `type:design`
- **Epic** — Parent issue grouping stories/tasks for a larger outcome. *Label:* `type:epic`
- **Story** — User-centred vertical slice within an Epic. *Label:* `type:story`
- **Improvement** — Enhance existing behaviour or UX. *Label:* `type:improve`
- **Refactor** — Internal restructure for maintainability, no behaviour change. *Label:* `type:refactor`
- **Build & CI** — Tooling, pipelines, packaging, releases, deploys. *Label:* `type:build`
- **Automation** — Bots/actions/scripts that reduce toil. *Label:* `type:automation`
- **Test Coverage** — Add or expand tests (unit, integration, E2E). *Label:* `type:test`
- **Performance** — Improve speed/efficiency. *Label:* `type:performance`
- **A11y** — Accessibility to WCAG 2.1 AA. *Label:* `type:a11y`
- **Security** — Security issues or improvements. *Label:* `type:security`
- **Compatibility** — Browser/device/plugin compatibility. *Label:* `type:compatibility`
- **Integration** — Integration with external systems/services. *Label:* `type:integration`
- **Release** — Release management and deployment. *Label:* `type:release`
- **Maintenance** — Routine maintenance, updates, or audits. *Label:* `type:maintenance`
- **Documentation** — Docs, guides, onboarding, or knowledge base. *Label:* `type:documentation`
- **Research** — Discovery, investigation, or technical spikes. *Label:* `type:research`
- **Chore** — Small hygiene change (typo, config, rename). *Label:* `type:chore`
- **Audit** — Security, code, or process audits. *Label:* `type:audit`
- **Code Review** — Peer review, QA, or validation. *Label:* `type:review`
- **AI Ops** — AI/automation operations, agents, or datasets. *Label:* `type:ai-ops`
- **Content Modelling** — Content structure, CPTs, or taxonomy. *Label:* `type:content-modelling`

See [../.github/issue-types.yml](../.github/issue-types.yml) for the machine-readable mapping.

---

## Detailed Comparison Table

| Type                     | Label                    | Color            | Use When                            | Priority           | Key Labels                                     |
| ------------------------ | ------------------------ | ---------------- | ----------------------------------- | ------------------ | ---------------------------------------------- |
| 🧩 **Task**              | `type:task`              | Blue `#4393f8`   | Small scoped work ≤2 days           | normal             | `status:ready`, `comp:*`, `lang:*`             |
| 🐞 **Bug**               | `type:bug`               | Red `#9f3734`    | Broken/incorrect behaviour          | critical/important | `priority:critical`, `env:*`, `compat:*`       |
| ✨ **Feature**           | `type:feature`           | Green `#3fb950`  | Net-new capability                  | important/normal   | `status:needs-design`, `comp:*`, `meta:has-pr` |
| 🎨 **Design**            | `type:design`            | Purple `#ab7df8` | Design artefacts/specs              | important/normal   | `status:needs-design`, `area:design-system`    |
| 🧭 **Epic**              | `type:epic`              | Purple `#ab7df8` | Parent issue (3+ sprints)           | important          | `status:in-discussion`, `meta:needs-changelog` |
| 📖 **Story**             | `type:story`             | Blue `#4393f8`   | User-centred vertical slice         | normal/important   | `comp:*`, `env:staging`, `meta:has-pr`         |
| 🔧 **Improvement**       | `type:improve`           | Grey `#9198a1`   | Enhance existing behaviour          | normal/minor       | `comp:*`, `area:*`, `meta:has-pr`              |
| ♻️ **Refactor**          | `type:refactor`          | Grey `#9198a1`   | Internal restructure (no UX change) | normal/minor       | `lang:*`, `meta:no-changelog`                  |
| ⚙️ **Build & CI**        | `type:build`             | Blue `#4393f8`   | Tooling/pipelines/releases          | normal/important   | `area:ci`, `lang:js\|yaml`, `env:*`            |
| 🤖 **Automation**        | `type:automation`        | Blue `#4393f8`   | Bots/actions/scripts                | normal             | `area:ci`, `meta:has-pr`                       |
| 🧪 **Test Coverage**     | `type:test`              | Yellow `#d29922` | Add/expand tests                    | normal/important   | `area:tests`, `lang:*`, `env:staging`          |
| ⚡ **Performance**       | `type:performance`       | Yellow `#d29922` | Improve speed/efficiency            | important/critical | `comp:*`, `env:*`, `meta:has-pr`               |
| ♿ **A11y**              | `type:a11y`              | Pink `#db61a2`   | Accessibility (WCAG 2.1 AA)         | critical/important | `comp:*`, `env:*`, `meta:has-pr`               |
| 🔒 **Security**          | `type:security`          | Red `#9f3734`    | Security issues/improvements        | critical           | `priority:critical`, `env:*`, `compat:*`       |
| 🔌 **Compatibility**     | `type:compatibility`     | Orange `#8d4821` | Browser/device/plugin compat        | important/critical | `compat:*`, `env:*`, `meta:has-pr`             |
| 🔄 **Integration**       | `type:integration`       | Orange `#8d4821` | External systems/services           | important/normal   | `area:integration`, `lang:*`, `env:*`          |
| 🚀 **Release**           | `type:release`           | Green `#3fb950`  | Release management/deployment       | critical/important | `release:*`, `env:*`, `meta:needs-changelog`   |
| 🧰 **Maintenance**       | `type:maintenance`       | Grey `#9198a1`   | Routine updates/audits              | normal/minor       | `area:dependencies`, `lang:*`                  |
| 📚 **Documentation**     | `type:documentation`     | Grey `#9198a1`   | Docs/guides/knowledge base          | normal/important   | `area:documentation`, `lang:md`                |
| 🔬 **Research**          | `type:research`          | Grey `#9198a1`   | Discovery/investigation/spikes      | normal/important   | `area:*`, `env:prototype`                      |
| 🧹 **Chore**             | `type:chore`             | Grey `#9198a1`   | Small hygiene change                | minor              | `priority:minor`, `meta:no-changelog`          |
| 🧪 **Audit**             | `type:audit`             | Grey `#9198a1`   | Security/code/process audits        | important/normal   | `type:security\|a11y\|performance`             |
| ✅ **Code Review**       | `type:review`            | Blue `#4393f8`   | Peer review/QA/validation           | normal             | `status:needs-review`, `meta:has-pr`           |
| 🤖 **AI Ops**            | `type:ai-ops`            | Blue `#4393f8`   | AI agents/prompts/datasets          | normal             | `ai-ops:*`, `lang:md\|json\|yaml`              |
| 🗂️ **Content Modelling** | `type:content-modelling` | Purple `#ab7df8` | CPT/taxonomies/field mapping        | important          | `cpt:*`, `comp:*`, `env:staging`               |

---

## Common Requirements

**Definition of Ready (DoR) — All Types:**

- Acceptance criteria clear
- Owner assigned
- Dependencies identified
- Impacted files listed
- Test plan defined
- Rollback noted

**Definition of Done (DoD) — All Types:**

- Acceptance criteria met
- Tests updated (unit/E2E as needed)
- Accessibility/performance/security impacts considered
- Docs/changelog updated (if user-facing)
- Reviews approved
- CI passing
- Linked issues closed

---

## Usage Guidelines

### How to Choose

1. **Pick ONE issue type** per issue or PR for classification
2. Add routing labels: **Priority + Status + Area/Component**
3. Add context labels as needed: **Lang/Env/Compat/CPT**

### Automation

- The unified labeling agent automatically assigns and enforces type labels
- Type assignment uses config, heuristics, branch patterns, and content analysis
- See [labeling agent spec](../.gith../.github/agents/labeling.agent.md) for details

### Color Palette

Grey `#9198a1` • Blue `#4393f8` • Green `#3fb950` • Yellow `#d29922` • Orange `#8d4821` • Red `#9f3734` • Pink `#db61a2` • Purple `#ab7df8`

---

## Best Practices

- **Don't over-use types** — prefer labels for orthogonal concerns (priority, status, area)
- **Design → Implementation** — either convert to Feature/Task or link child Stories
- **Story stays child of Epic** — track progress via parent roll-up in Projects
- **Use saved searches** — pin in Projects for engineers' queue, QA sweep, release gate

### Suggested Saved Searches

- Engineers' queue: `is:open is:issue label:"status:ready" -label:"status:blocked" sort:updated-desc`
- QA sweep: `is:open label:"status:needs-qa"`
- Release gate (vX.Y): `is:open milestone:vX.Y`

---

## Pull Request Templates

Keep a default `pull_request_template.md` and optional specialised templates (release/hotfix/docs/dep-update/ci/refactor/bug/chore/feature) prefilled with label prompts & DoD.

**Global PR DoD:**

- [ ] AC met; demo evidence
- [ ] Tests updated (unit/E2E as needed)
- [ ] A11y/perf/security impacts considered
- [ ] Docs/changelog updated (if user-facing)
- [ ] Reviews approved; CI green; linked issues closed

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
