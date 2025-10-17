# .github/ISSUE_LABELS.md (v1.1)

## Purpose
Consistent, low‑friction **issue labelling** aligned with our **Issue Type** field and **BugHerd families**.

## Label families (issues)
- **`status:*`** — lifecycle (exactly one): blocked, duplicate, in-progress, needs-client-discussion, needs-design, needs-design-review, needs-dev, needs-discussion, needs-documentation, needs-figma-update, needs-loom-video, needs-more-info, needs-qa, needs-review, needs-testing, needs-triage, on-hold, ready, ready-for-deployment, scope-creep, wontfix.
- **`priority:*`** — critical · important · normal · minor.
- **`type:*`** — category of work: a11y, bug, chore, compat, content-import, content-management, design, dev, feature, fix, improve, missing-content, performance, refactor, task, ui, usability, ux.
- **`area:*`** (broad area) **or** **`comp:*`** (specific artefact).
- Context routing: **`env:*`**, **`phase:*`**, **`page:*`**, **`issue:*`**, **`device:*`**, **`layout:*`**, **`theme:*`**, **`block:*`**, **`template:*`**, **`template-part:*`**, **`woo:*`**, **`to:*`**, **`size:*`**.

## Triage workflow (5 steps)
1. Set **Issue Type** (Epic/Story/Task/Bug/etc.) and **Parent Epic** if applicable.
2. Add **one** `priority:*` and **one** `type:*`.
3. Add **one** of `area:*` **or** `comp:*`.
4. Set **`status:needs-triage`**. When ready to start, switch to **`status:ready`** (keep exactly one status).
5. Add context labels only if they help discovery or assignment.

## Automations affecting issues
- On **open/reopen/transfer** → add **`status:needs-triage`** if missing.
- Enforce **max one** `status:*`.
- If no `priority:*` is set → default to **`priority:normal`**.

## Do & Don’t
- ✅ Keep labels **orthogonal** and minimal (1× status, 1× priority, 1× type, 1× area/comp).
- ✅ Use `blocked` with a note in **Blocked reason**.
- ❌ Don’t overload with context labels unless they add routing/search value.
