# .github/ISSUE_LABELS

**Date:** 13-10-2025 — **Version:** v1.1

## Purpose

Consistent, low‑friction **issue labelling** that complements the **Issue Type** Project field (Epic/Story/Task/Bug/etc.) without duplicating it.

## Label families (issues)

- **`status:*`** — lifecycle signal (exactly one per issue): `needs-triage`, `ready`, `in-progress`, `needs-review`, `needs-qa`, `blocked`, `in-discussion`, `needs-more-info`.
- **`priority:*`** — `critical`, `important`, `normal`, `minor`.
- **`area:*`** (broad area) **or** **`comp:*`** (specific artefact, e.g. `comp:theme-json`, `comp:block-templates`, `comp:block-patterns`).
- Optional routing: **`lang:*`** (`php`, `js`, `css`, `md`, …), **`env:*`** (prototype/staging/live), **`compat:*`** (wordpress/php/woocommerce/etc.), **`cpt:*`** (content types), **`meta:*`** (hygiene: `meta:stale`, `meta:no-issue-activity`).

> **No `type:*` labels.** Classification lives in the **Issue Type** field. Labels are routing signals.

## Triage workflow (5 steps)

1. **Set Issue Type** (Epic/Story/Task/Bug/…); link **Parent Epic** when applicable.
2. Add **one** `priority:*`.
3. Add **one** of `area:*` **or** `comp:*`.
4. Set **`status:needs-triage`** (intake). When ready to start, switch to **`status:ready`** (keep exactly one status).
5. Add optional routing labels (`lang:*`, `env:*`, `compat:*`, `cpt:*`) only if they help discovery or assignment.

## Automations affecting issues

- On **open/reopen/transfer** → add **`status:needs-triage`** if missing.
- Enforce **max one** `status:*`.
- If no `priority:*` is set → default to **`priority:normal`**.

> These behaviours are managed by `.github/workflows/labels-issues-prs.yml`.

## Do & Don’t

- ✅ Keep labels **orthogonal** and minimal (1× status, 1× priority, 1× area/comp).
- ✅ Use `blocked` + a note in the issue **Blocked reason** (or body) instead of extra labels.
- ❌ Don’t mirror Issue Type with labels (no `type:feature`, `type:bug`, etc.).

## Notes on Stories

**Stories are primarily used during initial scoping** (client engagement kick‑off or product initiative framing). Prefer **Task/Feature/Improvement** for day‑to‑day delivery; keep Stories lean and demo‑able within an Epic.
