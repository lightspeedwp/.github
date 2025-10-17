# .github/ISSUE_LABELS.md

## Purpose
Consistent, low‑friction **issue labelling** aligned with **Issue Type** and **BugHerd families**.

## Label families (issues)
- **`status:*`** — lifecycle signal (exactly one): blocked, duplicate, in-progress, needs-client-discussion, needs-design, needs-design-review, needs-dev, needs-discussion, needs-documentation, needs-figma-update, needs-loom-video, needs-more-info, needs-qa, needs-review, needs-testing, needs-triage, on-hold, ready, ready-for-deployment, scope-creep, wontfix.
- **`priority:*`** — critical · important · normal · minor.
- **`type:*`** — a11y, bug, chore, compat, content-import, content-management, design, dev, feature, fix, improve, missing-content, performance, refactor, task, ui, usability, ux.
- **`area:*`** or **`comp:*`** — route to owners.
- Context: `env:*`, `phase:*`, `page:*`, `issue:*`, `device:*`, `layout:*`, `theme:*`, `block:*`, `template:*`, `template-part:*`, `woo:*`, `to:*`, `size:*`.

## Triage workflow
1) Set Issue Type; link Parent Epic.  
2) Add `priority:*` + `type:*`.  
3) Add `area:*` or `comp:*`.  
4) Set `status:needs-triage` → `status:ready`.  
5) Add context labels only if helpful.

## Automations
- Intake defaults & **one `status:*`** enforced via workflow.  
- Default `priority:normal` if none present.
